/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	;

	(function() {
	    'use strict';

	    var pubSub = __webpack_require__(1);
	    var stadiums = __webpack_require__(2);
	    var map = __webpack_require__(3);

	    var app = {
	        pubSub: pubSub,
	        stadiums: stadiums,
	        stadiumList: null,
	        loadingEle: null,
	        inputSearchString: null,
	        searchString: "",
	        map: map,
	        markers: [],

	        run: function() {
	            this.init();
	            this.stadiums.fetchStadiums();
	        },
	        // sets initial state
	        init: function() {
	            this.initEle();
	            this.initEvents();
	            this.map.init();
	        },

	        initEle: function() {
	            this.stadiumList = document.querySelector('.stadium-list');
	            this.loadingEle = document.querySelector('.loading');
	            this.inputSearchString = document.querySelector('.searchString');
	        },

	        initEvents: function() {
	            var self = this;
	            this.inputSearchString.addEventListener("keyup", self.filterCities.bind(self));
	        },

	        filterCities: function() {  
	            this.searchString = this.inputSearchString.value;
	            var self = this;

	            var filtered = this.map.markers.filter(function(marker) {
	                var result = marker.I.name.toLowerCase().indexOf(self.searchString.toLowerCase()) > -1;
	                return result;
	            });

	            pubSub.publish("inputSearch", filtered);
	            console.log(filtered);
	        },

	        render: function(data) {
	            var self = this;

	            var stadiums = data.stadiums;
	            this.loadingEle.classList.add("hidden");
	        
	            stadiums.map(function(stadium) {
	                var r = self.createWeatherInfoElement(stadium);
	                self.stadium - self.stadiumList.appendChild(r);
	            });

	        },

	        createWeatherInfoElement: function(s) {
	            var result = document.createElement("tr");

	            for (var property in s) {
	                if (s.hasOwnProperty(property)) {
	                    if (!(property === "longitude" || property === "latitude")) {
	                        var p = document.createElement("td");
	                        p.innerText = s[property];
	                        result.appendChild(p);
	                    } else {

	                    }
	                }
	            }

	            this.addMarker(s.longitude, s.latitude, s.city);


	            this.addMarkersToMap();
	            return result;
	        },

	        addMarker: function(lon, lat, city) {
	            pubSub.publish("addMarker", [lon, lat, city]);
	        },

	        addMarkersToMap: function() {
	            pubSub.publish("addMarkersToMap", "");
	        },

	        loadingElement: function() {
	            this.loadingEle.classList.remove("hidden");
	        }

	    };

	    pubSub.subscribe("stadiumsLoaded", app.render, app);
	    pubSub.subscribe("addMarkersToMap", map.addMarkersToMap, map);
	    pubSub.subscribe("loadingStadiums", app.loadingElement, app);
	    pubSub.subscribe("addMarker", map.addMarker, map);
	    pubSub.subscribe("inputSearch", map.removeLayer, map);
	    app.run();
	})();


/***/ },
/* 1 */
/***/ function(module, exports) {

	;(function() {
	  'use strict';
	  
	  var pubSub = {
	    events: [],

	    publish: function(eve, data) {
	        this.events.map(function(e) {
	          if(e.eve === eve) {
	            e.fn.call(e.scope, data);
	          }
	        });
	    },

	    subscribe: function(eve, fn, scope) {

	        this.events.push({
	          eve: eve,
	          fn: fn,
	          scope: scope
	        });

	    }
	  };

	  module.exports = pubSub;
	})();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	;
	(function() {
	    'use strict';
	    
	    var pubSub = __webpack_require__(1);

	    var stadiums = {
	        pubSub: pubSub,
	        init: function() {

	        },

	        stadiums: {

	        },

	        getStadiums: function() {
	            return this.stadiums;
	        },

	        fetchStadiums: function() {
	            pubSub.publish("loadingStadiums", "");

	            $.ajax({
	                url: 'stadiums.json',
	                dataType: 'json',
	                success: function(data) {
	                    stadiums = data;
	                    pubSub.publish("stadiumsLoaded", data);
	                }.bind(this),
	                error: function(xhr, status, error) {
	                    console.log('An error (' + status + ') occured:', error.toString());
	                }.bind(this)
	            });

	        },
	    };

	    module.exports = stadiums;
	})();


/***/ },
/* 3 */
/***/ function(module, exports) {

	;
	(function() {
	    'use strict';

	    var map = {
	        markers: [],
	        vectorLayer: null,
	        mapLayer: null,

	        init: function() {
	            this.initElements();
	        },

	        initElements: function() {

	            this.mapLayer = new ol.Map({
	                target: 'map',
	                layers: [
	                    new ol.layer.Tile({
	                        source: new ol.source.OSM()
	                    })
	                ],
	                view: new ol.View({
	                    center: ol.proj.fromLonLat([2.3522, 48.8566]),
	                    zoom: 4
	                })
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

	        removeLayer: function() {
	            this.mapLayer.removeLayer(this.vectorLayer);
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


/***/ }
/******/ ]);