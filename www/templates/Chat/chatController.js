app.controller('chatController',function($scope,$stateParams,$firebaseArray,$firebaseObject,$timeout,UserService,Alerta){
	$scope.idDestinatario = $stateParams.idUsuario;
	$scope.idUserAtual = UserService.get().id;
	$scope.input = {
		texto : ''
	};	
	//Buscando mensagens no banco
	var database = firebase.database().ref();
	$scope.mensagens = $firebaseArray(database.child('conversas').child('mensagens'));
	$scope.mensagens.$loaded().then(function(){
		if ($scope.salas && $scope.salas[$scope.idUserAtual]){
			$scope.salas[$scope.idUserAtual][$scope.idDestinatario] = 0;
		}
		$timeout(function(){
			document.getElementById("chatBody").scrollTop = document.getElementById("chatBody").scrollHeight;
		});
		
	}).catch(function(erro){
		Alerta.show('erro','Falha ao tentar iniciar chat,tente novamente!');
	});
	//Buscando e alterando referência das conversas
	$scope.salas = $firebaseObject(database.child('conversas').child('salas'));
	$scope.salas.$bindTo($scope,'salas');
	$scope.salas.$loaded().then(function(){
		//Atualizando salas
		if (!$scope.salas[$scope.idUserAtual]){
			$scope.salas[$scope.idUserAtual] = {};
			$scope.salas[$scope.idUserAtual][$scope.idDestinatario] = 0;
		}
		if (!$scope.salas[$scope.idDestinatario]){
			$scope.salas[$scope.idDestinatario] = {};
			$scope.salas[$scope.idDestinatario][$scope.idUserAtual] = 0;
		}		
	});
	//Buscando informações do usuário destinatário
	$scope.destinatario = $firebaseObject(database.child('usuarios').child($scope.idDestinatario));

	//Função para enviar mensagem
	$scope.enviarMensagem = function (){
		var texto = $scope.input.texto;
		if (texto.length > 0 && $scope.mensagens){
			//Enviando mensagem
			var objetoMensagem = {
				from : $scope.idUserAtual,
				to : $scope.idDestinatario,
				dataEnvio : Date(),
				tipo : 'texto',
				texto : texto
			};
			$scope.mensagens.$add(objetoMensagem)
			.then(function(){
				$scope.input.texto = "";
				document.getElementById("chatBody").scrollTop = document.getElementById("chatBody").scrollHeight;
				$scope.salas[$scope.idDestinatario][$scope.idUserAtual] += 1;
				//Enviando notificação para destinatário
				enviarNotificacao();			
			})
			.catch(function(erro){
				console.log(erro);
			});
		};
	};


	var enviarNotificacao = function (){
		//Enviando notificações
		if ($scope.salas[$scope.idDestinatario][$scope.idUserAtual] === 1){
			var referecencia = $firebaseArray(database.child('notificacoes').child($scope.idDestinatario));
				referecencia.$loaded().then(function(){
					referecencia.$add({
						tipo : 'mensagem',
						idUsuario : $scope.idUserAtual,
						visualizada : false,
						horario : Date()
					});
				})
				.catch(function(erro){ 
					console.log(erro); 
				});
		}
	};
});


