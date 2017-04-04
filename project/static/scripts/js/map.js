;
(function() {
    'use strict';

    var map = {
        markers: [],
        vectorLayer: null,
        mapLayer: null,
        osmLayer: null,
        emptyLayer: null,
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
            this.mapLayer.addLayer(this.osmLayer);
        },

        initLayerOSM: function() {
            this.osmLayer = new ol.layer.Tile({
                source: new ol.source.OSM()
            });
        },

        addMarker: function(geo) {
            var lat = geo[1],
                lon = geo[0],
                city = geo[2];

            var m = new ol.Feature({
                type: 'icon',
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
                    return self.styles[feature.get('type')];
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
                    src: 'https://openlayers.org/en/v4.0.1/examples/data/icon.png'
                })
            }),
            'geoMarker': new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 7,
                    snapToPixel: false,
                    fill: new ol.style.Fill({ color: 'black' }),
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
