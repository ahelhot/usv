(function() {
  var HotCoffee, coffee, drink;

  HotCoffee = (function() {
    function HotCoffee() {}

    HotCoffee.prototype.isGood = function() {
      return true;
    };

    return HotCoffee;

  })();

  coffee = new HotCoffee();

  if (coffee.isGood()) {
    drink = true;
  }

}).call(this);
