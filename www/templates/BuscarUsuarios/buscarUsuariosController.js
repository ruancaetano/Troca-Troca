app.controller('buscarUsuariosController',function($scope,$firebaseArray,Loading,UserService,Alerta){
	Loading.show();
	var database = firebase.database().ref();
	$scope.input = {
		busca : ''
	};
	$scope.idUserAtual = UserService.get().id;
	$scope.listaUsuarios = $firebaseArray(database.child('usuarios'));
	$scope.listaUsuarios.$loaded().then(function(){
		$scope.listaUsuarios.sort(function(a,b){
			if(a.nome < b.nome) return -1;
	    	if(a.nome > b.nome) return 1;
	    	return 0;
		});
		Loading.hide();
	}).catch(function(erro){
		Loading.hide();
		Alerta.show('erro','Falha ao recuperar lista de usuários');
	});
});