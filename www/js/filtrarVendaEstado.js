app.filter('filtrarVendaEstado', function () {
  return function (input, search) {
    if (!input) return input;
    if (!search) return input;


    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function (value, key) {
      if (!value.localizacao){
        value.localizacao = {};
      }
      var estado = ('' + value.localizacao.estado).toLowerCase();

      if (estado == expected) {
        result[key] = value;
      }
    });
    return result;
  }
});