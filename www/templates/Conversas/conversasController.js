app.controller('conversasController',function($scope,$firebaseObject,UserService){
	var database = firebase.database().ref();
	var idUsuarioAtual = UserService.get().id;
	$scope.usuarios = $firebaseObject(database.child('usuarios'));
	$scope.listaConversas = $firebaseObject(database.child('conversas').child('salas').child(idUsuarioAtual));
	$scope.listaConversas.$bindTo($scope,'listaConversas');
});