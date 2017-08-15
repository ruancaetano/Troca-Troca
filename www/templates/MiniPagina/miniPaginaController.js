app.controller('miniPaginaController',function($scope,$stateParams,$firebaseObject,$firebaseArray,$state,$ionicModal,
	Loading,UserService,Alerta){
		Loading.show();
		$scope.idUsuario = $stateParams.idUsuario;
		var database = firebase.database().ref();
	    $scope.usuarios = $firebaseObject(database.child('usuarios'));
	    $scope.userAtual = UserService.get();

	     //Avaliação
		$scope.objetoAvaliacao = {
			iconOn: 'ion-ios-star',     
			iconOff: 'ion-ios-star',   
			iconOnColor: '#edc957',   
			iconOffColor:  '#bfbebe',   
			rating:  0,  
			minRating:0,    
			readOnly: true, 
			callback: function(rating, index) {}
		};
		//Objeto para o avaliar
		$scope.dadosAvaliar = {
			iconOn: 'ion-ios-star',     
			iconOff: 'ion-ios-star',   
			iconOnColor: '#edc957',   
			iconOffColor:  '#bfbebe',   
			rating:  5,  
			minRating:0,    
			readOnly: false, 
			callback: function(rating, index) {
				$scope.dadosAvaliar.rating = rating;
			}
		};


		var atualizarAvaliacoes = function (){
			$scope.contadorAvaliacoes = 0;
	    	$scope.somaEstrelas = 0;
	    	$scope.listaAvaliacoes = [];
	    	for (key in $scope.dadosUser.avaliacoes){
	    		var avaliacao = $scope.dadosUser.avaliacoes[key];
	    		$scope.contadorAvaliacoes++;
	    		$scope.somaEstrelas+= avaliacao.estrelas;
	    		$scope.listaAvaliacoes.push({
	    			imgUser : $scope.usuarios[key].imagem,
	    			msg : avaliacao.msg,
	    			nomeUser : $scope.usuarios[key].nome,
	    			estrelas : avaliacao.estrelas
	    		})
	    	}

	    	if ($scope.contadorAvaliacoes !== 0){
	    		$scope.objetoAvaliacao.rating = Math.floor($scope.somaEstrelas/$scope.contadorAvaliacoes);
	    	}
		};

	    $scope.usuarios.$loaded().then(function(){
	    	$scope.dadosUser = $scope.usuarios[$scope.idUsuario];
	    	atualizarAvaliacoes();
	    	Loading.hide();
	    }).catch(function(erro){
	    	Loading.hide();
	    	Alerta.show('erro','Falha ao carregar informações, por favor tente novamente!');
	    });

	   	//Modal Avaliar
		$ionicModal.fromTemplateUrl('templates/Padroes/avaliarModal.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.avaliarModal = modal
		});
		$scope.abrirAvaliar = function(urlImagem) {
			if($scope.dadosUser.avaliacoes){
				if ($scope.dadosUser.avaliacoes[$scope.userAtual.id]){
					$scope.avaliarMsg = $scope.dadosUser.avaliacoes[$scope.userAtual.id].msg;
					$scope.dadosAvaliar.rating = $scope.dadosUser.avaliacoes[$scope.userAtual.id].estrelas;
				}	
			}
			$scope.avaliarModal.show();
		};

		//Avaliar
		$scope.avaliar = function(msg,estrelas){
			Loading.show();
			if(!$scope.dadosUser.avaliacoes){
				$scope.dadosUser.avaliacoes = {};
			}
			if (!msg){
				msg = "";
			}
			$scope.dadosUser.avaliacoes[$scope.userAtual.id] = {
				msg : msg,
				estrelas : estrelas
			}

			$scope.usuarios.$save().then(function(){
				$scope.dadosUser = $scope.usuarios[$scope.idUsuario]; //Fazendo bind manual dos dados 
	    		atualizarAvaliacoes();
	    		notificarAvaliacao();
	    		Loading.hide();
				$scope.avaliarModal.hide();
			}).catch(function(erro){
				Loading.hide();
				Alerta.show('erro',"Ocorreu um problema ao tentar salvar sua avaliação, tente novamente!");
			})
		};

		//Função para enviar notificação da avaliação para o usuário
		var notificarAvaliacao = function (){
		 	var referecencia = $firebaseArray(database.child('notificacoes').child($scope.idUsuario));
		 	referecencia.$loaded().then(function(){
		 		referecencia.$add({
		 			tipo : 'avaliacao',
		 			idUsuario : $scope.userAtual.id,
		 			visualizada : false,
		 			horario : Date()
		 		});
		 	}).catch(function(erro){
		 		console.log(erro);
		 	})
		};

		//Evento de destruição do controller atual
	    $scope.$on('$destroy', function() {
	      $scope.avaliarModal.remove();
	    });


});