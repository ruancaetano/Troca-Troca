app.filter('filtrarVendaTitulo', function () {
  return function (input, search) {
    if (!input) return input;
    if (!search) return input;


    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function (value, key) {
      var titulo = ('' + value.titulo).toLowerCase();

      if (titulo.indexOf(expected) !== -1) {
        result[key] = value;
      }
    });
    return result;
  }
});