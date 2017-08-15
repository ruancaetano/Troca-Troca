app.filter('filtrarVendaCategoria', function () {
  return function (input, search) {
    if (!input) return input;
    if (!search) return input;


    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function (value, key) {
      var categoria = ('' + value.categoria).toLowerCase();

      if (categoria == expected) {
        result[key] = value;
      }
    });
    return result;
  }
});