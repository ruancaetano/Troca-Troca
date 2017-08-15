app.controller('perfilController',function($scope,$ionicModal,$timeout,UserService,Loading,brCidadesEstados,Alerta){	
	//Modal para crop de imagens
    $ionicModal.fromTemplateUrl('templates/Perfil/cropImage.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.cropModal = modal;
    });
    
    //Recuperando dados do usuário atual
    $scope.perfilUser = UserService.get();
    if ($scope.perfilUser.primeiraVisita){
    	$scope.perfilUser.primeiraVisita = false;
    	$scope.perfilUser.$save();
    };

   	//Cidade estado
	$scope.estados = brCidadesEstados.estados;
	$scope.buscarCidadesPorSigla = function(sigla){
		$scope.cidades = brCidadesEstados.buscarCidadesPorSigla(sigla);
	};


    //Definindo mascaras dos inputs
    $('.telefone').mask('(00) 0000-0000');
    $('.celular').mask('(00) 00000-0000');

	var coletarImagemSelecionada = function (evt) {
		$scope.cropModal.show();
		var file = evt.currentTarget.files[0];
		var reader = new FileReader();
		$scope.imagemSelecionada = "";
		$scope.imagemFinal = "";
		reader.onload = function (evt) {
		  $timeout(function() {
		  	$scope.$apply(function(){
		  		$scope.imagemSelecionada = evt.target.result;
		  	});   
		  });
		};
		reader.readAsDataURL(file);
	};
	angular.element(document.querySelector('#inputImagemPerfil')).on('change', coletarImagemSelecionada);

	//Função para salvar crop imagem
	$scope.salvarCropImage = function (imagem){
		$scope.perfilUser.imagem = imagem;
		$scope.cropModal.hide();
	}

	//Função para finalizar edição
	$scope.finalizar = function (){
		Loading.show();
		$scope.perfilUser.$save().then(function(){
			Loading.hide();
		}).catch(function(){
			Loading.hide();
			Alerta.show('erro','Encontramos um problema ao salvar seus dados, por favor tente novamente!');
		})
	}

    //Evento de destruição do controller atual
    $scope.$on('$destroy', function() {
      $scope.cropModal.remove();
    });
});