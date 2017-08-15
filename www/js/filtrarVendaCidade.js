app.filter('filtrarVendaCidade', function () {
  return function (input, search) {
    if (!input) return input;
    if (!search) return input;


    var expected = ('' + search);
    var result = {};
    angular.forEach(input, function (value, key) {
      if (!value.localizacoes){
        value.localizacoes = [];
      }

      if (value.localizacoes.indexOf(expected) !== -1){
        result[key] = value;
      }
    });
    return result;
  }
});