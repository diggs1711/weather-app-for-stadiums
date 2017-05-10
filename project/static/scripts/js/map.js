;
(function() {
    'use strict';
    var logos = require('./logosConfig.js');

    var map = {
        markers: [],
        vectorLayer: null,
        mapLayer: null,
        osmLayer: null,
        emptyLayer: null,
        cloudLayer: null,
        filteredMarkers: [],

        init: function() {
            this.initElements();
            this.initMapLayers();
        },

        initElements: function() {
            this.mapLayer = new ol.Map({
                target: 'map',
                layers: [],
                view: new ol.View({
                    center: ol.proj.fromLonLat([2.3522, 48.8566]),
                    zoom: 4
                })
            });

            this.emptyLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: []
                })
            });

        },

        initMapLayers: function() {
            this.initLayerOSM();
            this.initCloudLayers();
            this.mapLayer.addLayer(this.osmLayer);
            this.mapLayer.addLayer(this.cloudLayer);
        },

        initLayerOSM: function() {
            this.osmLayer = new ol.layer.Tile({
                source: new ol.source.OSM()
            });
        },

        initCloudLayers: function() {
            this.cloudLayer = new ol.layer.Tile({
                title: "Clouds",
                source: new ol.source.XYZ({
                    // Replace this URL with a URL you generate. To generate an ID go to http://home.openweathermap.org/
                    // and click "map editor" in the top right corner. Make sure you're registered!
                     url: "http://maps.owm.io:8099/58e4198ae158e70001eb97f9/{z}/{x}/{y}?hash=1801cf76b88ae491674d97d8cae66107",
                })
            });
        },

        addMarker: function(geo) {
            var lat = geo[1],
                lon = geo[0],
                city = geo[2],
                team = geo[3];

            var m = new ol.Feature({
                team: team,
                name: city,
                geometry: new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'))
            });

            this.markers.push(m);
        },

        addMarkersToMap: function() {
            var self = this;

            this.vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: this.markers
                }),

                style: function(feature) {
                    var t = feature.get('team').toString().trim();
                    return logos[t];
                }
            });

            this.mapLayer.addLayer(this.vectorLayer);
        },

        filterMap: function(data) {
            var self = this;
            this.filteredMarkers = data;

            this.clearLayer();
            this.addFilteredMarkers();
        },

        addFilteredMarkers: function() {
            this.vectorLayer.getSource().addFeatures(this.filteredMarkers);
            this.mapLayer.render();
            this.mapLayer.updateSize();
        },

        clearLayer: function() {
            this.vectorLayer.getSource().clear();
        },

        styles: {
            'route': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 6,
                    color: [237, 212, 0, 0.8]
                })
            }),
            'icon': new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    size: [300, 300],
                    scale: 0.07,
                    src: '../static/images/Leeds_United_Logo.png'
                })
            }),
            'geoMarker': new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 7,
                    snapToPixel: false,
                    fill: new ol.style.Fill({
                        color: 'black'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'white',
                        width: 2
                    })
                })
            })
        },

        markerFactory: function(locations) {

            locations.forEach(function(location) {

                var marker = new ol.Feature({
                    type: 'icon',
                    geometry: new ol.geom.Point(ol.proj.transform([-9, 53], 'EPSG:4326',
                        'EPSG:3857'))
                });

            });
        }

    }

    module.exports = map;
})();
