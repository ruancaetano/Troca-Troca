app.filter('filtrarVendasUsuario', function () {
  return function (input, search) {
    if (!input) return input;
    if (!search) return input;


    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function (value, key) {
      var idCriador = ('' + value.idCriador).toLowerCase();

      if (idCriador == expected) {
        result[key] = value;
      }
    });
    return result;
  }
});