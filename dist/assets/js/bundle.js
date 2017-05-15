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
	    var tableDisplay = __webpack_require__(5);

	    var app = {
	        pubSub: pubSub,
	        stadiums: stadiums,
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

	            //this.loadingEle = document.querySelector('.loading');
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
	                var markerName = marker.I.name;

	                if (markerName) {
	                    var result = markerName.toLowerCase().indexOf(self.searchString.toLowerCase()) > -1;
	                }

	                return result || null;
	            });

	            pubSub.publish("inputSearch", filtered);
	        }

	    };

	    pubSub.subscribe("stadiumsLoaded", tableDisplay.render, tableDisplay);
	    pubSub.subscribe("addMarkersToMap", map.addMarkersToMap, map);
	    pubSub.subscribe("addMarker", map.addMarker, map);
	    pubSub.subscribe("inputSearch", map.filterMap, map);
	    pubSub.subscribe("loadingComplete", map.showMap, map);
	    app.run();
	})();


/***/ },
/* 1 */
/***/ function(module, exports) {

	;
	(function() {
	    'use strict';

	    var pubSub = {
	        events: [],

	        publish: function(eve, data) {
	            this.events.map(function(e) {
	                if (e.eve === eve) {
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
/***/ function(module, exports, __webpack_require__) {

	;
	(function() {
	    'use strict';
	    var logoController = __webpack_require__(4);
	    var pubSub = __webpack_require__(1);
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	;(function() {
	  var logoFactory = function() {
	      this.logos = {};
	  };

	  logoFactory.prototype.createLogo = function(lat, long, name) {

	      this.logos[name] = new ol.style.Style({
	          image: new ol.style.Icon({
	              anchor: [0.5, 1],
	              size: [1000, 1000],
	              scale: 21 / 1000,
	              src: '../static/images/' + name + '.png'
	          })
	      });
	  };

	  logoFactory.prototype.init = function() {


	  }

	  module.exports = logoFactory;
	})();


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	;
	(function() {

	    var pubSub = __webpack_require__(1);
	    var weatherIcons = __webpack_require__(6);
	    var wi = new weatherIcons();

	    var tableDisplay = {

	        stadiumList: null,

	        init: function() {
	            this.initElements();
	        },

	        initElements: function() {
	            this.stadiumList = document.querySelector('.stadium-list');
	        },

	        createWeatherInfoElement: function(s) {
	            var listItem = document.createElement("li");
	            listItem.className = "list-group-item text-center";

	            var pHeading = document.createElement("p");
	            pHeading.className = "h3 text-center";

	            var pBody = document.createElement("p");
	            pBody.className = "h1 text-center";

	            var pFooter = document.createElement("p");

	            var crest = document.createElement("div");

	            for (var property in s) {
	                var spanEle = document.createElement("span");
	                if (s.hasOwnProperty(property)) {
	                    if (!(String(property) === "longitude" || String(property) === "latitude")) {

	                        if (String(property) === "team") {
	                            spanEle.innerText = s[property];
	                            pHeading.appendChild(spanEle);
	                        }

	                        if (String(property) === "temp") {
	                            console.log(s['code'])
	                            var weatherIconEle = document.createElement("canvas");
	                            var iconClass = s['icon'] + " icon-style";
	                            weatherIconEle.className = iconClass;

	                            spanEle.className = "pull-left col-md-5 temp";
	                            spanEle.innerText = s[property] + "°";
	                            spanEle.appendChild(weatherIconEle);
	                            pBody.appendChild(spanEle);
	                        }

	                        if (String(property) === "wind_speed") {
	                            spanEle.className = "pull-right col-md-5 wind-speed";
	                            spanEle.innerText = s[property] + "m/s";
	                            pBody.appendChild(spanEle);
	                        }

	                        if (String(property) === "status") {
	                            pFooter.innerText = s[property];
	                        }

	                    }

	                    var url = "url('../static/images/" + String(s['team']).trim() + ".png')";
	                    crest.style.backgroundImage = url;
	                    crest.className = 'thumbnail';
	                }
	            }

	            pBody.appendChild(crest);

	            listItem.appendChild(pHeading);
	            listItem.appendChild(pBody);
	            listItem.appendChild(pFooter);

	            this.addMarker(s.longitude, s.latitude, s.city, s.team);
	            return listItem;
	        },

	        addWeatherIcon: function(c) {
	            var prefix = 'wi wi-';
	            var code = c;
	            var icon = weatherIcons[code].icon;

	            if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
	                icon = 'day-' + icon;
	            }

	            return prefix + icon + " col-md-12";
	        },

	        addWindLabel: function(speed) {
	            var el = document.createElement("span");

	            if (speed <= 5) {
	                el.innerText = "Calm"
	                el.className = "label label-info";
	            } else if (speed > 5 && speed <= 15) {
	                el.innerText = "Strong Breeze";
	                el.className = "label label-success";
	            } else if (speed > 15 && speed <= 25) {
	                el.innerText = "Strong Gale";
	                el.className = "label label-warning";
	            } else if (speed > 25) {
	                el.innerText = "Stormy";
	                el.className = "label label-danger";
	            }

	            return el;
	        },

	        render: function(data) {
	            var self = this;

	            var stadiums = data.stadiums;
	            //this.loadingEle.classList.add("hidden");

	            stadiums.map(function(stadium) {
	                var r = self.createWeatherInfoElement(stadium);
	                self.stadiumList.appendChild(r);
	            });

	            console.log(wi)
	            wi.run();

	            this.addMarkersToMap();
	        },

	        addMarkersToMap: function() {
	            pubSub.publish("addMarkersToMap", "");
	        },

	        addMarker: function(lon, lat, city, team) {
	            pubSub.publish("addMarker", [lon, lat, city, team]);
	        },


	    };

	    tableDisplay.init();
	    module.exports = tableDisplay;
	})();


/***/ },
/* 6 */
/***/ function(module, exports) {

	(function() {

	    var weatherIcons = function() {

	        this.skycons = new Skycons({ "color": "#ebebeb" });

	        this.list = [
	            "clear-day", "clear-night", "partly-cloudy-day",
	            "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
	            "fog"
	        ];

	    };

	    weatherIcons.prototype.run = function() {
	        this.setIcons();
	        this.skycons.play();
	    }

	    weatherIcons.prototype.setIcons = function() {

	        for (i = this.list.length; i--;) {
	            var weatherType = this.list[i],
	                elements = document.getElementsByClassName(weatherType);
	            for (e = elements.length; e--;) {
	                this.skycons.set(elements[e], weatherType);
	            }
	        }

	    };



	    module.exports = weatherIcons;

	})();


/***/ }
/******/ ]);