// On initialise la latitude et la longitude de Paris (centre de la carte)
var lat = 48.852969,
    lon = 2.349903; // Paris
var map = null;
/* global OverlappingMarkerSpiderfier */
/* global L */
/* global d3 */
d3.json("content/premiere-guerre-mondiale-base-memoire.json").then(
    function(data) {
        var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

        var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19
        });

        var GeoportailFrance_orthos = L.tileLayer('https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
            attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
            bounds: [
                [-75, -180],
                [81, 180]
            ],
            minZoom: 1,
            maxZoom: 19,
            apikey: 'choisirgeoportail',
            format: 'image/jpeg',
            style: 'normal'
        });

        var streets = L.tileLayer(mbUrl, {
            id: 'mapbox.streets',
            attribution: mbAttr
        });

        var baseLayers = {
            "Grayscale": grayscale,
            "Streets": streets,
            "Mode Nuit": CartoDB_DarkMatter,
            "Mode Satellite": GeoportailFrance_orthos
        };

        var grayscale = L.tileLayer(mbUrl, {
            id: 'mapbox.light',
            attribution: mbAttr
        });


        map = L.map('map', {
            center: [lat, lon],
            zoom: 10,
            layers: [streets, GeoportailFrance_orthos, CartoDB_DarkMatter, grayscale]
        });

        var oms = new OverlappingMarkerSpiderfier(map);

        var popup = new L.Popup();
        oms.addListener('click', function(marker) {
            popup.setContent(marker);
            popup.setLatLng(marker.getLatLng());
            map.openPopup(popup);
        });

        oms.addListener('spiderfy', function(markers) {
            map.closePopup();
        });

        var baseMaps = {
            "<span style='color: gray'>Grayscale</span>": grayscale,
            "Streets": streets,
            "Mode nuit": CartoDB_DarkMatter,
            "Mode Satellite": GeoportailFrance_orthos
        };

        for (var i in data) {
            var fields = data[i].fields;
            var wgs4 = fields.wgs4;

            var popup = '<hr><center><b>Description</b></center><hr>' +
                '<b>Commune : </b>' + fields.com + ' - ' + fields.insee +
                '<br/><b>Legende :</b> ' + fields.leg +
                '<br/><b>Date :</b> ' + fields.datpv +
                '<br/><b>Type :</b> ' + fields.typdoc +
                '<hr><center><b>Média</b></center><hr>' +
                '<b>Série : </b>' + fields.serie +
                '<br/><b>Lieu : </b>' + fields.edif +
                '<br/><b>Archive : </b>' + fields.copy +
                '<br/><br/><center><img src="' + fields.video_v + '"/></center>';
            if (typeof wgs4 != 'undefined') {
                lat = wgs4[0], lon = wgs4[1];
                var marker = new L.Marker([lat, lon], { tags: [fields.typdoc, fields.edif] }).bindPopup(popup).addTo(map);

                map.addLayer(marker);
                oms.addMarker(marker);
            }
        }

        L.control.tagFilterButton({
            data: ['Tirage photographique', 'Positif original'],
            icon: '<img src="icon/images-solid.svg">',
            filterOnEveryClick: true
        }).addTo(map);

        L.control.tagFilterButton({
            data: ['Grand Palais', 'Domaine national du Palais-Royal', 'Hôtel des Invalides', 'Petit Palais', 'Palais du Louvre', 'Palais du Trocadéro', 'Hôtel Stillman', 'Domaine national ; Trianon Palace', 'Domaine national ; Château', 'Hôtel le Trianon Palace', 'Hôpital d\'orientation et d\'évacuation – HOE', 'Hôtel de la Marine', 'Maison de Charles Gounod', 'Palais de l\'Elysée', 'Palais de Chaillot', 'Petit-Palais', 'Hôtel Bristol', 'Hôtel de Ville', 'Hôtel Mercédès', 'Grand-Palais', 'Maison', 'Hôtel Biron', 'Hôtel Crillon', 'Domaine national ; Parc'],
            icon: '<img src="icon/hotel-solid.svg">',
            filterOnEveryClick: true
        }).addTo(map);

        L.control.tagFilterButton({
            data: ['Camp militaire de Satory', 'Chenil de guerre', 'Campement scout', 'Ecole militaire', 'Caserne'],
            icon: '<img src="icon/flag-solid.svg">',
            filterOnEveryClick: true
        }).addTo(map);

        L.control.tagFilterButton({
            data: ['Hôpital militaire', 'Val-de-Grâce', 'Hôpital américain', 'Hôpital', 'Hôpital colonial', 'Hôpital militaire Villemin', 'Hôpital du Val-de-Grâce'],
            icon: '<img src="icon/hospital-solid.svg">',
            filterOnEveryClick: true
        }).addTo(map);

        L.control.tagFilterButton({
            data: ['Ecole des Beaux-Arts', 'Ecole nationale d\'agriculture', 'Ecole militaire', 'Lycée Saint-Louis'],
            icon: '<img src="icon/graduation-cap-solid.svg">',
            filterOnEveryClick: true
        }).addTo(map);

        L.control.tagFilterButton({
            data: ['Ministère des Affaires étrangères', 'Ministère de la Guerre'],
            icon: '<img src="icon/fort-awesome-brands.svg">',
            filterOnEveryClick: true
        }).addTo(map);

        L.control.tagFilterButton({
            data: ['Gare de la Chapelle', 'Gare de la Villette', 'Gare Montparnasse', 'Gare de Lyon'],
            icon: '<img src="icon/train-solid.svg">',
            filterOnEveryClick: true
        }).addTo(map);

        L.control.tagFilterButton({
            data: ['Eglise Saint-Sulpice', 'Eglise de la Madeleine', 'Eglise Saint-Ambroise', 'Cathédrale Notre-Dame'],
            icon: '<img src="icon/church-solid.svg">',
            filterOnEveryClick: true
        }).addTo(map);

        L.control.tagFilterButton({
            data: ['Cimetière de Picpus', 'Cimetière'],
            icon: '<img src="icon/cross-solid.svg">',
            filterOnEveryClick: true
        }).addTo(map);

        L.control.tagFilterButton({
            data: ['Galerie Georges Petit', 'Galerie Georges Bernheim', 'Galerie La Boëtie'],
            icon: '<img src="icon/palette-solid.svg">',
            filterOnEveryClick: true
        }).addTo(map);

        L.control.tagFilterButton({
            data: ['Usine Sev Marchal', 'Usine Citroën', 'Usine Lepaute'],
            icon: '<img src="icon/building-solid.svg">',
            filterOnEveryClick: true
        }).addTo(map);

        L.control.tagFilterButton({
            data: ['Orangerie des Tuileries', 'Opéra Garnier', 'Monument aux morts', 'Arc de Triomphe de l\'Etoile', 'Cercle de l\'Union interalliée', 'Musée du Louvre', 'Trocadéro', 'Jardin des Tuileries', 'Place Vendôme', 'Parc d\'attraction Magic City, quai d\'Orsay', 'Barrière du Trône', 'Luna-Park'],
            icon: '<img src="icon/archway-solid.svg">',
            filterOnEveryClick: true
        }).addTo(map);

        L.control.tagFilterButton({
            data: ['Jeu de Paume', 'Café de la Paix', 'Comptoir national d\'escompte de Paris', 'Moulin', 'Sorbonne (La)', 'Chais et entrepôts de Bercy', 'Cantine Viviani', 'Dispensaire Léon-Bourgeois'],
            icon: '<img src="icon/plus-circle-solid.svg">',
            filterOnEveryClick: true
        }).addTo(map);

        L.control.layers(baseMaps).addTo(map);
        L.Control.boxzoom({ position:'topright' }).addTo(map);
        L.control.navbar().addTo(map);
    }
);


/* https://github.com/jawj/OverlappingMarkerSpiderfier-Leaflet */
/* http://maydemirx.github.io/leaflet-tag-filter-button/ */