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
