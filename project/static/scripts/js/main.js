;

(function() {
    var pubSub = require('./pubSub.js');
    var stadiums = require('./stadiums.js');

    var app = {
        pubSub: pubSub,
        stadiums: stadiums,
        stadiumList: null,
        loadingEle: null,
        inputSearchString: null,
        searchString: "",
        markers: [],

        run: function() {
            this.init();
            this.stadiums.fetchStadiums();
        },
        // sets initial state
        init: function() {
            this.initEle();
            this.initEvents();
        },

        initEle: function() {
            this.stadiumList = document.querySelector('.stadium-list');
            this.loadingEle = document.querySelector('.loading');
            this.inputSearchString = document.querySelector('.searchString');
        },

        initEvents: function() {
            this.inputSearchString.addEventListener("change", function(e) {
                console.log(e);
                this.searchString = e.target.value;
            })
        },

        // sets state, triggers render method
        handleChange: function(event) {

        },

        filterCities: function() {

        },

        render: function(data) {
            var self = this;

            var stadiums = data["stadiums"];
            this.loadingEle.classList.add("hidden");
            var searchString = this.searchString.trim().toLowerCase();

            // filter countries list by value from input boxz
            if (searchString.length > 0) {
                stadiums = stadiums.filter(function(stadium) {
                    return stadium.city.toLowerCase().match(searchString);
                });
            }

            stadiums.map(function(stadium) {
                var r = self.createWeatherInfoElement(stadium);
                this.stadium - self.stadiumList.appendChild(r);
            });

            console.log(this.markers);

        },

        createWeatherInfoElement: function(s) {
            var result = document.createElement("tr");

            for (var property in s) {
                if (s.hasOwnProperty(property)) {
                    if (!(property === "longitude" || property === "latitude")) {
                        var p = document.createElement("td");
                        p.innerText = s[property];
                        result.appendChild(p);
                    }
                }
            }

            var long = s["longitude"];
            var lat = s["latitude"];

            var startMarker = new ol.Feature({
                type: 'icon',
                geometry: new ol.geom.Point([long, lat])
            });

            this.markers.push(startMarker);
            return result;
        },

        loadingElement: function() {
            this.loadingEle.classList.remove("hidden");
        }

    };

    pubSub.subscribe("stadiumsLoaded", app.render, app);
    pubSub.subscribe("loadingStadiums", app.loadingElement, app);
    app.run();
})();
