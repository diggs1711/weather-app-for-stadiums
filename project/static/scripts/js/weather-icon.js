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
