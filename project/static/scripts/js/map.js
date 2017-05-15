;
(function() {
    'use strict';
    var logoController = require('./logosConfig.js');
    var pubSub = require('./pubSub.js');
    var logoCtrl = new logoController();

    var map = {
        markers: [],
        vectorLayer: null,
        mapLayer: null,
        osmLayer: null,
        emptyLayer: null,
        cloudLayer: null,
        filteredMarkers: [],
        ele: null,
        loadingEle: null,
        cloudBtn: null,
        controls: null,
        selectedLayer: "",

        init: function() {
            this.initElements();
            this.initMapLayers();
            this.initEvents();
        },

        initElements: function() {

            this.map = document.querySelector(".map");
            this.loadingEle = document.querySelector(".loadingIcon");
            this.cloudBtn = document.querySelector(".cloudBtn");
            this.controls = document.querySelector(".controls");

            this.mapLayer = new ol.Map({
                interactions: ol.interaction.defaults({
                    mouseWheelZoom: false
                }),
                target: 'map',
                layers: [],
                view: new ol.View({
                    center: ol.proj.fromLonLat([0.8, 52.2]),
                    zoom: 6
                })
            });

            this.emptyLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: []
                })
            });

        },

        initEvents: function() {
            var self = this;

            this.cloudBtn.addEventListener("click", self.cloudLayerControl.bind(self));
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

        cloudLayerControl: function() {

            if (this.selectedLayer === "cloud") {
                this.mapLayer.removeLayer(this.cloudLayer);
                this.selectedLayer = "";
            } else {
                this.selectedLayer = "cloud";
                this.initCloudLayers();
                this.mapLayer.addLayer(this.cloudLayer);
                this.mapLayer.updateSize();
            }

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

            console.log(logoCtrl);
            logoCtrl.createLogo(lat, lon, team.trim());

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
                    console.log(logoCtrl.logos[t]);
                    return logoCtrl.logos[t];
                }
            });

            this.mapLayer.addLayer(this.vectorLayer);
            pubSub.publish("loadingComplete", "");
        },

        filterMap: function(data) {
            var self = this;
            this.filteredMarkers = data;

            this.clearLayer();
            this.addFilteredMarkers();
        },

        showMap: function() {
            console.log('Loading Complete');
            this.loadingEle.classList.add("hidden");
            this.map.classList.remove("hidden");
            this.controls.classList.remove("hidden");
            this.map.style.height = '350px';
            this.mapLayer.updateSize();
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
