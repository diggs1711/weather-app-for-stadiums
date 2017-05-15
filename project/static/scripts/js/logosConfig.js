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
