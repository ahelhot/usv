
/*
  This script part of usv project
  @author: fe3dback@yandex.ru
 */

(function() {
  var USV;

  USV = (function() {
    function USV() {}

    USV.imageIndex = null;


    /**
      * Prepare mixin data and set default values
      * @param {Object} data - object with user values
      * @param {Object} def - default values
      * @return {Object} result data object. Extended from def + user data
    
      * ex:
      * let data = {a:3}
      * let data = usv.prepare(data, {a:1, b:2})
      * // data = {a:3, b:2}
     */

    USV.prototype.prepare = function(data, def) {
      var field, result;
      if (data == null) {
        data = {};
      }
      if (def == null) {
        def = {};
      }
      result = {};
      for (field in def) {
        if ((data[field] != null)) {
          result[field] = data[field];
        } else {
          result[field] = def[field];
        }
      }
      return result;
    };


    /**
      * Clamp number between min and max
      * @param {number} number
      * @param {number} min
      * @param {number} max
      * @return {number} clamped number
     */

    USV.prototype.clamp = function(number, min, max) {
      if (number > max) {
        number = max;
      }
      if (number < min) {
        number = min;
      }
      return number;
    };


    /**
      * Get random number between min and max
      * @param {number} min
      * @param {number} max
      * @return {number} random number
     */

    USV.prototype.range = function(min, max) {
      var rand;
      rand = min - 0.5 + Math.random() * (max - min + 1);
      rand = Math.round(rand);
      return rand;
    };


    /**
      * Choose one random value from array
      * @param {Array} variants
     */

    USV.prototype.oneOf = function(variants) {
      var rand;
      if (variants == null) {
        variants = [];
      }
      rand = Math.floor(Math.random() * variants.length);
      return variants[rand];
    };


    /**
      * Format number to ru-RU price (rub)
      * Like 2605.30 => 2 605
      * @param {number} x
      * @return {string}
     */

    USV.prototype.formatPrice = function(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };


    /**
      * Generate url to random image (from any placeholder service)
      * @param {number} width
      * @param {number} height
      * @param {service} service
        - 1=placeimg.com,
        - 2=lorempixel.com,
        - 3=unsplash.it,
        - def=placehold.it
      * @param {string} tag (only for service #1, #2), ex. "tech"
     */

    USV.prototype.image = function(width, height, service, tag) {
      if (width == null) {
        width = 100;
      }
      if (height == null) {
        height = 100;
      }
      if (service == null) {
        service = 0;
      }
      if (tag == null) {
        tag = "tech";
      }
      if (!(this.imageIndex != null)) {
        this.imageIndex = 60;
      }
      this.imageIndex++;
      switch (service) {
        case 1:
          return "https://placeimg.com/" + width + "/" + height + "/" + tag + "?image=" + this.imageIndex;
        case 2:
          return "http://lorempixel.com/" + width + "/" + height + "/" + tag + "/?image=" + this.imageIndex;
        case 3:
          return "https://unsplash.it/" + width + "/" + height + "?image=" + this.imageIndex;
        default:
          return "https://placehold.it/" + width + "x" + height;
      }
    };

    return USV;

  })();

  module.exports = new USV();

}).call(this);
