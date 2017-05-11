;
(function() {

    var pubSub = require('./pubSub.js');
    var weatherIcons = require('./weather-icon.js');
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
