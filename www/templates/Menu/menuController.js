app.controller('menuController',function($scope,$firebaseAuth,$state,UserService,Alerta){
	var auth = $firebaseAuth();
	$scope.idUser = UserService.get().id;
	//Função de logout
	$scope.sair = function () {
		auth.$signOut().then(function () {
			UserService.set({});
			$state.go('login');
		}, function (erro) {
			Alerta.show('erro','Falha ao tentar sair, tente novamente!');
		});
	};
});