(function() {
  var usv;

  usv = (function() {
    function usv() {}

    usv.prototype.prepare = function(data, def) {
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

    usv.prototype.range = function(min, max) {
      var rand;
      rand = min - 0.5 + Math.random() * (max - min + 1);
      rand = Math.round(rand);
      return rand;
    };

    usv.prototype.oneOf = function(variants) {
      var rand;
      if (variants == null) {
        variants = [];
      }
      rand = Math.floor(Math.random() * variants.length);
      return variants[rand];
    };

    return usv;

  })();

  module.exports = new usv();

}).call(this);
