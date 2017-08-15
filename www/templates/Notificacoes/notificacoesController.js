app.controller('notificacoesController',function($scope,$firebaseObject,UserService,Loading,Alerta){
	Loading.show();
	var database = firebase.database().ref();
	$scope.userAtual = UserService.get();
	$scope.notificacoes = $firebaseObject(database.child('notificacoes').child($scope.userAtual.id));
	$scope.notificacoes.$bindTo($scope,'notificacoes');
	$scope.usuarios = $firebaseObject(database.child('usuarios'));
	$scope.vendas = $firebaseObject(database.child('vendas'));

	$scope.notificacoes.$loaded().then(function(){
		Loading.hide();
	}).catch(function(erro){
		Loading.hide();
		Alerta.show('erro','Falha ao carregar notificações, por favor tente novamente!')
	});

	//função para receber
	$scope.primeiroNome = function(idUsuario){
		if ($scope.usuarios && $scope.usuarios[idUsuario]){
			return $scope.usuarios[idUsuario].nome.split(' ')[0];
		}
		return "";
	};
});