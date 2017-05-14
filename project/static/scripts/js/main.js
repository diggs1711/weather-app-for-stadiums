;

(function() {
    'use strict';

    var pubSub = require('./pubSub.js');
    var stadiums = require('./stadiums.js');
    var map = require('./map.js');
    var tableDisplay = require('./tableDisplay.js');

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
