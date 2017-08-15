app.filter('filtrarNomeUsuario', function () {
  return function (input, search) {
    if (!input) return input;
    if (!search) return input;


    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function (value, key) {
      var nome = ('' + value.nome).toLowerCase();

      if (nome.indexOf(expected) !== -1) {
        result[key] = value;
      }
    });
    return result;
  }
});