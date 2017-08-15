app.controller('cadastroController',function($scope,$firebaseAuth,$firebaseObject,$state,Loading,Alerta,ErrosFirebase){
	var auth = $firebaseAuth();
	var database = firebase.database().ref();
	//Iniciando objetivo do formulário
	$scope.dadosCadastro = {
		email : '',
		nome : '',
		senha : '',
		confirmarSenha : ''
	};
	//função para criar novo usuário
	$scope.criarUsuario = function (){
		Loading.show();
		auth.$createUserWithEmailAndPassword($scope.dadosCadastro.email, $scope.dadosCadastro.senha)
	    .then(function(user) {
	    	//Referência do novo usuário
		  	var refUsuario = database.child('usuarios/' + user.uid);
		   	var objetoUsuarios = $firebaseObject(refUsuario);
		   	objetoUsuarios.$loaded().then(function(){
		   		//Alterando dados
			   	objetoUsuarios.id = user.uid;
			   	objetoUsuarios.email = $scope.dadosCadastro.email;
			   	objetoUsuarios.nome = $scope.dadosCadastro.nome;
			   	objetoUsuarios.imagem = 'img/profile.png';
			   	objetoUsuarios.primeiraVisita = true;
			   	//Salvando no banco de dados
			   	objetoUsuarios.$save()
			   		.then(function(msg){
			   			Loading.hide();	
			   			$state.go('login');
			   		})
			   		.catch(function(erro){
			   			Loading.hide();
			   			Alerta.show('erro','Falha ao salvar suas informações, tente novamente!');
			   			
			   		});	
		   	})
		   	.catch(function(erro){
			   	Loading.hide();
    	   		Alerta.show('erro','Falha ao salvar suas informações, tente novamente!');
		   	});
 
	    }).catch(function(erro) {
	    	Loading.hide();
   			var msg = ErrosFirebase.msg(erro.code);
   			Alerta.show('erro',msg);
	    });
	};
});