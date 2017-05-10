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
/***/ function(module, exports, __webpack_require__) {

	;
	(function() {
	    'use strict';
	    var logos = __webpack_require__(4);

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


/***/ },
/* 4 */
/***/ function(module, exports) {

	var logos = {
		'Manchester United': new ol.style.Style({
	                image: new ol.style.Icon({
	                    anchor: [0.5, 1],
	                    size: [400, 400],
	                    scale: 21/400,
	                    src: '../static/images/Manchester United.png'
	                })
	            }), 
		'Arsenal': new ol.style.Style({
	                image: new ol.style.Icon({
	                    anchor: [0.5, 1],
	                    size: [1000, 1000],
	                    scale: 21/1000,
	                    src: '../static/images/Arsenal.png'
	                })
	            }),
		'Liverpool': new ol.style.Style({
	                image: new ol.style.Icon({
	                    anchor: [0.5, 1],
	                    size: [1000, 1000],
	                    scale: 21/1000,
	                    src: '../static/images/Liverpool.png'
	                })
	            }),
		'Southampton': new ol.style.Style({
	                image: new ol.style.Icon({
	                    anchor: [0.5, 1],
	                    size: [1000, 1000],
	                    scale: 21/1000,
	                    src: '../static/images/Southampton.png'
	                })
	            }),
		'Swansea City': new ol.style.Style({
	                image: new ol.style.Icon({
	                    anchor: [0.5, 1],
	                    size: [1000, 1000],
	                    scale: 21/1000,
	                    src: '../static/images/Swansea City.png'
	                })
	            }),

	};

	module.exports = logos;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	;
	(function() {

	    var pubSub = __webpack_require__(1);
	    var weatherIcons = __webpack_require__(6);

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
	                            var weatherIconEle = document.createElement("i");
	                            var iconClass = this.addWeatherIcon(s['code']);
	                            weatherIconEle.className = iconClass;

	                            spanEle.className = "pull-left col-md-4 temp";
	                            spanEle.innerText = s[property] + "°";
	                            spanEle.appendChild(weatherIconEle);
	                            pBody.appendChild(spanEle);
	                        }

	                        if (String(property) === "wind_speed") {
	                            spanEle.className = "pull-right col-md-4 wind-speed";
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

	var weatherIcons = {
	    "200": {
	        "label": "thunderstorm with light rain",
	        "icon": "storm-showers"
	    },

	    "201": {
	        "label": "thunderstorm with rain",
	        "icon": "storm-showers"
	    },

	    "202": {
	        "label": "thunderstorm with heavy rain",
	        "icon": "storm-showers"
	    },

	    "210": {
	        "label": "light thunderstorm",
	        "icon": "storm-showers"
	    },

	    "211": {
	        "label": "thunderstorm",
	        "icon": "thunderstorm"
	    },

	    "212": {
	        "label": "heavy thunderstorm",
	        "icon": "thunderstorm"
	    },

	    "221": {
	        "label": "ragged thunderstorm",
	        "icon": "thunderstorm"
	    },

	    "230": {
	        "label": "thunderstorm with light drizzle",
	        "icon": "storm-showers"
	    },

	    "231": {
	        "label": "thunderstorm with drizzle",
	        "icon": "storm-showers"
	    },

	    "232": {
	        "label": "thunderstorm with heavy drizzle",
	        "icon": "storm-showers"
	    },

	    "300": {
	        "label": "light intensity drizzle",
	        "icon": "sprinkle"
	    },

	    "301": {
	        "label": "drizzle",
	        "icon": "sprinkle"
	    },

	    "302": {
	        "label": "heavy intensity drizzle",
	        "icon": "sprinkle"
	    },

	    "310": {
	        "label": "light intensity drizzle rain",
	        "icon": "sprinkle"
	    },

	    "311": {
	        "label": "drizzle rain",
	        "icon": "sprinkle"
	    },

	    "312": {
	        "label": "heavy intensity drizzle rain",
	        "icon": "sprinkle"
	    },

	    "313": {
	        "label": "shower rain and drizzle",
	        "icon": "sprinkle"
	    },

	    "314": {
	        "label": "heavy shower rain and drizzle",
	        "icon": "sprinkle"
	    },

	    "321": {
	        "label": "shower drizzle",
	        "icon": "sprinkle"
	    },

	    "500": {
	        "label": "light rain",
	        "icon": "rain"
	    },

	    "501": {
	        "label": "moderate rain",
	        "icon": "rain"
	    },

	    "502": {
	        "label": "heavy intensity rain",
	        "icon": "rain"
	    },

	    "503": {
	        "label": "very heavy rain",
	        "icon": "rain"
	    },

	    "504": {
	        "label": "extreme rain",
	        "icon": "rain"
	    },

	    "511": {
	        "label": "freezing rain",
	        "icon": "rain-mix"
	    },

	    "520": {
	        "label": "light intensity shower rain",
	        "icon": "showers"
	    },

	    "521": {
	        "label": "shower rain",
	        "icon": "showers"
	    },

	    "522": {
	        "label": "heavy intensity shower rain",
	        "icon": "showers"
	    },

	    "531": {
	        "label": "ragged shower rain",
	        "icon": "showers"
	    },

	    "600": {
	        "label": "light snow",
	        "icon": "snow"
	    },

	    "601": {
	        "label": "snow",
	        "icon": "snow"
	    },

	    "602": {
	        "label": "heavy snow",
	        "icon": "snow"
	    },

	    "611": {
	        "label": "sleet",
	        "icon": "sleet"
	    },

	    "612": {
	        "label": "shower sleet",
	        "icon": "sleet"
	    },

	    "615": {
	        "label": "light rain and snow",
	        "icon": "rain-mix"
	    },

	    "616": {
	        "label": "rain and snow",
	        "icon": "rain-mix"
	    },

	    "620": {
	        "label": "light shower snow",
	        "icon": "rain-mix"
	    },

	    "621": {
	        "label": "shower snow",
	        "icon": "rain-mix"
	    },

	    "622": {
	        "label": "heavy shower snow",
	        "icon": "rain-mix"
	    },

	    "701": {
	        "label": "mist",
	        "icon": "sprinkle"
	    },

	    "711": {
	        "label": "smoke",
	        "icon": "smoke"
	    },

	    "721": {
	        "label": "haze",
	        "icon": "day-haze"
	    },

	    "731": {
	        "label": "sand, dust whirls",
	        "icon": "cloudy-gusts"
	    },

	    "741": {
	        "label": "fog",
	        "icon": "fog"
	    },

	    "751": {
	        "label": "sand",
	        "icon": "cloudy-gusts"
	    },

	    "761": {
	        "label": "dust",
	        "icon": "dust"
	    },

	    "762": {
	        "label": "volcanic ash",
	        "icon": "smog"
	    },

	    "771": {
	        "label": "squalls",
	        "icon": "day-windy"
	    },

	    "781": {
	        "label": "tornado",
	        "icon": "tornado"
	    },

	    "800": {
	        "label": "clear sky",
	        "icon": "sunny"
	    },

	    "801": {
	        "label": "few clouds",
	        "icon": "cloudy"
	    },

	    "802": {
	        "label": "scattered clouds",
	        "icon": "cloudy"
	    },

	    "803": {
	        "label": "broken clouds",
	        "icon": "cloudy"
	    },

	    "804": {
	        "label": "overcast clouds",
	        "icon": "cloudy"
	    },


	    "900": {
	        "label": "tornado",
	        "icon": "tornado"
	    },

	    "901": {
	        "label": "tropical storm",
	        "icon": "hurricane"
	    },

	    "902": {
	        "label": "hurricane",
	        "icon": "hurricane"
	    },

	    "903": {
	        "label": "cold",
	        "icon": "snowflake-cold"
	    },

	    "904": {
	        "label": "hot",
	        "icon": "hot"
	    },

	    "905": {
	        "label": "windy",
	        "icon": "windy"
	    },

	    "906": {
	        "label": "hail",
	        "icon": "hail"
	    },

	    "951": {
	        "label": "calm",
	        "icon": "sunny"
	    },

	    "952": {
	        "label": "light breeze",
	        "icon": "cloudy-gusts"
	    },

	    "953": {
	        "label": "gentle breeze",
	        "icon": "cloudy-gusts"
	    },

	    "954": {
	        "label": "moderate breeze",
	        "icon": "cloudy-gusts"
	    },

	    "955": {
	        "label": "fresh breeze",
	        "icon": "cloudy-gusts"
	    },

	    "956": {
	        "label": "strong breeze",
	        "icon": "cloudy-gusts"
	    },

	    "957": {
	        "label": "high wind, near gale",
	        "icon": "cloudy-gusts"
	    },

	    "958": {
	        "label": "gale",
	        "icon": "cloudy-gusts"
	    },

	    "959": {
	        "label": "severe gale",
	        "icon": "cloudy-gusts"
	    },

	    "960": {
	        "label": "storm",
	        "icon": "thunderstorm"
	    },

	    "961": {
	        "label": "violent storm",
	        "icon": "thunderstorm"
	    },

	    "962": {
	        "label": "hurricane",
	        "icon": "cloudy-gusts"
	    }
	}

	module.exports = weatherIcons;

/***/ }
/******/ ]);