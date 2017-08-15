app.controller('loginController',function($scope,$firebaseAuth,$state,$ionicPopup,$firebaseObject,ErrosFirebase,
	Loading,UserService,ngFB,Alerta){
		var auth = $firebaseAuth();
		var database = firebase.database().ref();
		//iniciando objeto do form de login
		$scope.login = {
			email : '',
			senha : ''
		};
		//Objeto para recuperação de senha
		$scope.recuperar = {};


		$scope.verificarUserLogado = function (){
			Loading.show();
			auth.$onAuthStateChanged(function(firebaseUser) {
			  if (firebaseUser) {
			    var dadosUser = $firebaseObject(database.child('usuarios').child(firebaseUser.uid));
			    dadosUser.$loaded().then(function(){
			    	UserService.set(dadosUser);
			    	Loading.hide();
			    	$state.go('menu.home');
			    }).catch(function(){
			    	Loading.hide();
			    })
			  } else {
			  	Loading.hide();
			  }
			});
		}

		//Função para realizar login
		$scope.logar = function (){
			Loading.show();
			auth.$signInWithEmailAndPassword($scope.login.email, $scope.login.senha)
		    .then(function(user) {
		    	//Recuperando dados do perfil
				var refDadosUser = database.child("usuarios").child(user.uid);
				var dadosUser = $firebaseObject(refDadosUser);
				dadosUser.$loaded().then(function(){
					UserService.set(dadosUser);
					Loading.hide();

					if (dadosUser.primeiraVisita){
						$state.go('menu.perfil');
					}else{
						$state.go('menu.home');
					}
					
				}).catch(function(erro){
					Loading.hide();
					Alerta.show('erro','Encontramos um problema ao tentar acessar sua conta, tente novamente!');
				});    	
		    })
		    .catch(function(erro){
		    	Loading.hide();
		    	var msg = ErrosFirebase.msg(erro.code)
		    	Alerta.show('erro',msg);
		    });
		};

		//Função para recuperar senha
		$scope.recuperarSenha = function (){
			$ionicPopup.show({
				template: '<input type="text" placeholder="Digite seu e-mail" ng-model="recuperar.email">',
				title: 'Recupeção de senha',
				subTitle: '',
				scope: $scope,
				buttons: [
					{ text: 'Cancelar', onTap: function(e) { return false; } },
					{
						text: '<b>Enviar</b>',
						type: 'button-positive',
						onTap: function(e) {
							return $scope.recuperar.email || true;
						}
					},
				]
			})
			.then(function(email) {
				if (email){
					Loading.show();
					auth.$sendPasswordResetEmail(email).then(function() {
						Loading.hide();
						Alerta.show('sucesso',"Pronto, acesse seu e-mail e recupere o acesso a sua conta!");
					}).catch(function(erro) {
						Loading.hide();	
					  	var msg = ErrosFirebase.msg(erro.code);
		    			Alerta.show('erro',msg);
					});
				}
			});		
		};


		//Logar com facebook 
		$scope.loginComFacebook = function (){
			Loading.show();
			ngFB.init({appId: '1615786421773494'});
			ngFB.login({scope: 'email'}).then(
					function (response) {
					if (response.status === 'connected') {
						var token = response.authResponse.accessToken;
						logarFirebasePorToken(token);
					} else {
						Loading.hide();
						Alerta.show('erro','Falha ao realizar login com Facebook!');
					};
				}
			);
		};

		var logarFirebasePorToken = function (token){
			var credential = firebase.auth.FacebookAuthProvider.credential(token);
			firebase.auth().signInWithCredential(credential).then(function (user) {
				salvarDadosFacebook(user.uid);
			}).catch(function(erro){
				Loading.hide();
				var msg = ErrosFirebase.msg(erro.code);
		    	Alerta.show('erro',msg);
			});
		};

		var salvarDadosFacebook = function (uid){
			ngFB.api({
				path: '/me',
				params: {fields: 'id,name,picture,email'}
			}).then(function (user) {
				var dadosUser = $firebaseObject(database.child('usuarios').child(uid));
				dadosUser.$loaded().then(function(){
					if (dadosUser.primeiraVisita === undefined){
						dadosUser.primeiraVisita = true;
					}
					dadosUser.id = uid;
					dadosUser.loginFacebook = true;
					dadosUser.nome = user.name;
					dadosUser.imagem = "https://graph.facebook.com/"+ user.id +"/picture?type=large";
					dadosUser.email =  user.email;

					dadosUser.$save().then(function(){
						UserService.set(dadosUser);
						Loading.hide();

						if (dadosUser.primeiraVisita){
							$state.go('menu.perfil');
						}else{
							$state.go('menu.home');
						}				
					}).catch(function(erro){
						Loading.hide();
						Alerta.show('erro','Falha ao realizar login com Facebook!')
					})


				}).catch(function(erro){
					Loading.hide();
					Alerta.show('erro','Falha ao realizar login com Facebook!');
				});
			});
		};
	});