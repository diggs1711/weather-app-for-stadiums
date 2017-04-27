;

(function() {
    'use strict';

    var pubSub = require('./pubSub.js');
    var stadiums = require('./stadiums.js');
    var map = require('./map.js');

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
                var markerName = marker.I.name;

                if (markerName) {
                    var result = markerName.toLowerCase().indexOf(self.searchString.toLowerCase()) > -1;
                }

                return result || null;
            });

            pubSub.publish("inputSearch", filtered);
        },

        render: function(data) {
            var self = this;

            var stadiums = data.stadiums;
            this.loadingEle.classList.add("hidden");

            stadiums.map(function(stadium) {
                var r = self.createWeatherInfoElement(stadium);
                self.stadium - self.stadiumList.appendChild(r);
            });

            this.addMarkersToMap();
        },

        createWeatherInfoElement: function(s) {
            var result = document.createElement("tr");

            for (var property in s) {
                if (s.hasOwnProperty(property)) {
                    if (!(String(property) === "longitude" || String(property) === "latitude")) {
                        var td = document.createElement("td");
                        var d = document.createElement("div");
                        var p = document.createElement("p");
                        p.className = "col-md-3";
                        p.innerText = s[property];

                        d.className = "weather-" + property;
                        d.appendChild(p);

                        if(property === "wind_speed") {
                        	console.log(property)
                        	var label = this.addWindLabel(s[property]);
                        	d.appendChild(label);
                        }

                        td.appendChild(d);
                        result.appendChild(td);
                    }
                }
            }

            this.addMarker(s.longitude, s.latitude, s.city);
            return result;
        },

        addWindLabel: function(speed) {
        	var el = document.createElement("span");

        	if(speed <= 5) {
        		el.innerText = "Calm"
        		el.className = "label label-info";
        	} else if(speed > 5 && speed <=15) {
        		el.innerText = "Strong Breeze";
        		el.className = "label label-success";
        	} else if(speed > 15 && speed <= 25) {
        		el.innerText = "Strong Gale";
        		el.className = "label label-warning";
        	} else if(speed > 25) {
        		el.innerText = "Stormy";
        		el.className = "label label-danger";
        	}

        	return el;
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
    pubSub.subscribe("inputSearch", map.filterMap, map);
    app.run();
})();
