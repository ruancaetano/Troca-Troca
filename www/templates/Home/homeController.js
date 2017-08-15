app.controller('homeController',function($scope,$ionicSideMenuDelegate,$ionicModal,$firebaseAuth,$state,$firebaseObject,UserService,Alerta){
	var database = firebase.database().ref();
	var auth = $firebaseAuth();
	$scope.dadosUser = UserService.get();
	var splitNomeUser =  $scope.dadosUser.nome.split(' ');
	$scope.nomeESobrenome = splitNomeUser[0] + ' ' + splitNomeUser[1];
	$ionicSideMenuDelegate.canDragContent(false);


	var notificacoes = $firebaseObject(database.child('notificacoes').child($scope.dadosUser.id));
	notificacoes.$loaded().then(function(){
		$scope.contadorNotificacao = 0;
		angular.forEach(notificacoes, function(item) {
			if ((typeof item === "object") && (item !== null) && !item.visualizada ){
				$scope.contadorNotificacao++;
			}
		});
	}).catch(function(erro){console.log(erro)});


	//Função de logout
	$scope.sair = function () {
		auth.$signOut().then(function () {
			UserService.set({});
			$state.go('login');
		}, function (erro) {
			Alerta.show('erro','Falha ao tentar sair, tente novamente!');
		});
	};

	//Modal outros menu
	$ionicModal.fromTemplateUrl('templates/Padroes/outrosMenuHome.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modalOutrosMenu = modal
	});
	$scope.abrirModalOutros = function(urlImagem) {
		$scope.modalOutrosMenu.show();
	}

	//Removendo referência dos objetos
	$scope.$on('$destroy', function() {
    	$scope.modalOutrosMenu.remove();
    });

    //Evento de destruição do controller atual
    $scope.$on('$destroy', function() {
      $scope.modalOutrosMenu.remove();
    });
});