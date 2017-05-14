var logos = {
    'Manchester United': new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            size: [400, 400],
            scale: 21 / 400,
            src: '../static/images/Manchester United.png'
        })
    }),
    'Arsenal': new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            size: [1000, 1000],
            scale: 21 / 1000,
            src: '../static/images/Arsenal.png'
        })
    }),
    'Liverpool': new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            size: [1000, 1000],
            scale: 21 / 1000,
            src: '../static/images/Liverpool.png'
        })
    }),
    'Southampton': new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            size: [1000, 1000],
            scale: 21 / 1000,
            src: '../static/images/Southampton.png'
        })
    }),
    'Swansea City': new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            size: [1000, 1000],
            scale: 21 / 1000,
            src: '../static/images/Swansea City.png'
        })
    }),

};

var logoFactory = function() {

    this.logos = logos;

};

logoFactory.prototype.createLogo = function(lat, long, name) {

}

module.exports = logos;
