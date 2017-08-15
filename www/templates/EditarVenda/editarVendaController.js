app.controller('editarVendaController',
	function($scope,$timeout,$firebaseObject,$firebaseStorage,$state,UserService,
		Loading,brCidadesEstados,EditarVendaService,Alerta){
			//Inicializando dados
			var database = firebase.database().ref();
			var storageRef = firebase.storage().ref();
			Loading.show();
			$scope.venda = $firebaseObject(database.child('vendas').child(EditarVendaService.get()));
			$scope.cidadesS
			$scope.venda.$loaded().then(function(){
				if($scope.venda.localizacoes){
					$scope.cidadesSeleciondas = $scope.venda.localizacoes.split(',');
				}else{
					$scope.cidadesSeleciondas = [];
				}
				
				Loading.hide();
			}).catch(function(){
				Loading.hide();
				Alerta.show('erro','Encontramos um problema ao buscar informações da divulgação, por favor tente novamente!');
				$state.go('menu.minhasDivulgacoes');
			});
			$scope.localizacao = {
				estado : '',
				cidade : ''
			};
			$scope.meuEndereco = true;
			$scope.dadosUser = UserService.get();
			$scope.contadorCaractes = 100;
			$scope.imagens = {};
			$scope.urlImagens = {};
			$scope.imagensCadastradasRemovidas = [];


			//Contador de caracters input titulo
			$scope.calculaCaracteres = function (){
				if ($scope.venda.titulo){
					$scope.contadorCaractes = 100 - $scope.venda.titulo.length;
				}else{
					$scope.contadorCaractes = 100;
				}
			};
			
			//Diálogo de dúvida (localização)
			 $scope.duvida = function() {
			 	Alerta.show("Ajuda","Definir localizações para seus produtos, garante que eles sejam listados em buscas por região!");
			 };


			//Máscara input preço
			$('.dinheiro').mask('000.000.000.000.000,00', {reverse: true});

			//Cidade-estado select
			$scope.estados = brCidadesEstados.estados;
			$scope.buscarCidadesPorSigla = function(sigla){
				$scope.cidades = brCidadesEstados.buscarCidadesPorSigla(sigla);
			};

			//Função para adicionar cidades selecionadas ao array
			$scope.selecionarCidades = function(){
				if ($scope.cidadesSeleciondas.indexOf($scope.localizacao.cidade) === -1){
					$scope.cidadesSeleciondas.push($scope.localizacao.cidade);
					$scope.localizacao.cidade = "";
				};
			};
			//Função para remover cidades selecionada do array
			$scope.retirarCidade = function(cidade){
				$scope.cidadesSeleciondas.splice($scope.cidadesSeleciondas.indexOf(cidade),1);
			};


			//Selecionar imagens
			$('#inputImagens').change(function(evt){
				var imagens = $ ('#inputImagens')[0].files;
	    		handleFileUpload(imagens);
			});


			//Função para salvar dados editados 
			$scope.editar = function (){
				Loading.show();

				if (!$scope.venda.imagens){
					$scope.venda.imagens = [];
				}

			   	for (key in $scope.urlImagens){
			 		$scope.venda.imagens.push($scope.urlImagens[key])
			 	}

			 	for (var idx in $scope.imagensCadastradasRemovidas){
			 		var url = $scope.imagensCadastradasRemovidas[idx];
			 		var refRemocao = firebase.storage().refFromURL(url);
			 		refRemocao.delete();
			 	}

			 	//Atualizando lista de localizações
			 	$scope.venda.localizacoes = $scope.cidadesSeleciondas.join();

				$scope.venda.$save()
		   		.then(function(){
		   			Loading.hide();
		   			Alerta.show('sucesso','Sua divulgação foi editada com sucesso!');
					$state.go('menu.minhasDivulgacoes');
			   	})
			   	.catch(function(erro){
			   		Loading.hide();
	   				Alerta.show('erro','Encontramos um problema ao salvar informações, por favor tente novamente!');
			   	});
			};

			//Função para remover imagens da lista de selecionados
			$scope.removerImagem = function (imagem){
				Loading.show();
				if (!imagem.uploading){
					var refRemocao = firebase.storage().refFromURL($scope.urlImagens[imagem.nome]);
					// Delete the file
					refRemocao.delete().then(function() {
						$timeout(function(){
							$scope.$apply(function(){
								console.log('deletado');
					  			delete $scope.imagens[imagem.nome];
					  			delete $scope.urlImagens[imagem.nome];
					  			Loading.hide();
							});
						});		
					}).catch(function(erro) {
						Loading.hide();
						console.log(erro);
					});	
				};
			};

			//Função para remover imagem já cadastrada
			$scope.removerImagemCadastrada = function (imagem){
				
				for (var i = 0  ; i < $scope.venda.imagens.length ; i++){
					if ($scope.venda.imagens[i] === imagem){
						$scope.venda.imagens.splice(i, 1);
						$scope.imagensCadastradasRemovidas.push(imagem);	
					};
				};		
			};



			//Função para processar o status de uploads das imagens  
			function handleFileUpload(files) {
	            for (var i = 0; i < files.length; i++) {
	                var fd = new FormData();
	                fd.append('file', files[i]);
	    
	                console.log(files[i]);
	                fireBaseImageUpload({
	                    'file': files[i],
	                    'path': 'imagens/' + $scope.dadosUser.id
	                }, function (data) {
	                    //console.log(data);
	                    if (!data.error) {
	                        if (data.progress) {
	                        	$timeout(function(){
	                        		$scope.$apply(function(){
	                        			$scope.imagens[data.element].progresso = data.progress;
	                        		});
	                        	});
	                        }
	                        if (data.downloadURL) {
	                        	$timeout(function(){
	                        		$scope.$apply(function(){
										$scope.imagens[data.element].uploading = false;
	                        			$scope.urlImagens[data.element] = data.downloadURL;   
	                        		});
	                        	});         
	                        }
	                    } else {
	                    	Alerta.show('erro','Encontramos um problema ao salvar uma imagem, por favor tente novamente!');
	                    }
	                });
	            }
	        };
	    

	        //Função para iniciar o upload de imagens no firebase
			function fireBaseImageUpload(parameters, callBackData) {
			    // expected parameters to start storage upload
			    var file = parameters.file;
			    var path = parameters.path;
			    var name;
			    
			    //verifica se existe dados
			    if (!file) { callBackData({error: 'É necessário fornecer uma imagem!'}); }
			    if (!path) { callBackData({error: 'É necessário fornecer o caminho onde a imagem será salva'}); }
			    
			    var metaData = {'contentType': file.type};
			    var arr = file.name.split('.');
			    var fileSize = formatBytes(file.size); // get clean file size (function below)
			    var fileType = file.type;
			    var n = file.name;
			    
			 	//gera nome aleatória para referência do upload atual 
	            name = generateRandomString(12); //(location function below)
	    
	            //var fullPath = path + '/' file name
	            var fullPath = path + '/' + file.name.split(' ').join('');


			    //Gerando icone da imagem na view
			    var reader = new FileReader();
			    reader.addEventListener("load", function(e) {
			    	$timeout(function(){
			    		$scope.$apply(function(){
			    			$scope.imagens[name] = {
			    				uploading : true,
			    				nome : name,
			    				progresso : 0,
			    				imgView : e.target.result
			    			}
			    		});
			    	});		   	  
			    });
			    reader.readAsDataURL(file);


			    //Inicia upload
			    var uploadFile = storageRef.child(fullPath).put(file, metaData);
			    callBackData({id: name, fileSize: fileSize, fileType: fileType, fileName: n});
			    uploadFile.on('state_changed', function (snapshot) {
			        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			        progress = Math.floor(progress);
			        callBackData({
			             progress: progress,
			             element: name, 
			             fileSize: fileSize, 
			             fileType: fileType, 
			             fileName: n});
			    }, function (error) {
			        callBackData({error: error});
			    }, function () {
			        var downloadURL = uploadFile.snapshot.downloadURL;
			        callBackData({
			              downloadURL: downloadURL, 
			              element: name, 
			              fileSize: fileSize, 
			              fileType: fileType, 
			              fileName: n});
			    });
			};
			//Função para formatar o tamanho da imagem
			function formatBytes(bytes, decimals) {
			    if (bytes == 0) return '0 Byte';
			    var k = 1000;
			    var dm = decimals + 1 || 3;
			    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
			    var i = Math.floor(Math.log(bytes) / Math.log(k));
			    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
			};
			//Função geradora de nomes aleatórios
			function generateRandomString(length) {
	            var chars = "abcdefghijklmnopqrstuvwxyz";
	            var pass = "";
	            for (var x = 0; x < length; x++) {
	                var i = Math.floor(Math.random() * chars.length);
	                pass += chars.charAt(i);
	            }
	            return pass;
	        };
});