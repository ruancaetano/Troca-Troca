app.controller('vendasController',
	function($scope,$timeout,$firebaseObject,$ionicModal,$location,$stateParams,$firebaseArray,
		$ionicScrollDelegate,UserService,Loading,brCidadesEstados){

			$scope.exibirFiltro = false;
			$scope.idVendaToScroll = $stateParams.idVendaToScroll;
		    //Recuperando dados essenciais
		    var database = firebase.database().ref();
		    $scope.usuarios = $firebaseObject(database.child('usuarios'));
		    $scope.vendas = $firebaseObject(database.child('vendas'));
		    $scope.vendas.$loaded().then(function(){
		    	if ($scope.idVendaToScroll){
			    	$timeout(function(){
			    		$location.hash($scope.idVendaToScroll);
		           		$ionicScrollDelegate.anchorScroll();
			    	});
		    	}
		    }).catch(function(erro){
		    	console.log(erro);
		    	alert('Falha ao carregar divulgações');
		    })
		    $scope.vendas.$bindTo($scope, "vendas");
		    $scope.dadosUser = UserService.get();
		    $scope.input = {
		    	comentario : ''
		    }
		    $scope.filtros = {
		    	estado :'',
		    	cidade : '',
		    	categoria : '',
		    	titulo : '',
		    	usuario : $stateParams.idUsuario
		    }

		    if (!$scope.filtros.usuario){
		    	$scope.filtros.usuario = "";
		    }

		    //Cidade estado select
			$scope.estados = brCidadesEstados.estados;
			$scope.buscarCidadesPorSigla = function(sigla){
				$scope.cidades = brCidadesEstados.buscarCidadesPorSigla(sigla);
			}

		    //Modal Zoom
			$ionicModal.fromTemplateUrl('templates/Padroes/zoomImagem.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.modalZoom = modal
			});
			$scope.zoom = function(urlImagem) {
				$scope.modalZoom.show()
				$scope.imagemZoom = urlImagem;
			}


			//Modal Detalhes
			$ionicModal.fromTemplateUrl('templates/Padroes/detalhesModal.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.detalhesModal = modal
			});
			$scope.verDescricao = function(venda) {
				$scope.detalhesModal.show()
				$scope.vendaSelecionadaDetalhes = venda;
			}

			//Modal Comentários
			$ionicModal.fromTemplateUrl('templates/Padroes/comentariosModal.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.comentariosModal = modal
			});
			$scope.abrirComentarios = function(vendaIndice) {
				$scope.comentariosModal.show()
				$scope.indiceVendaComentarios = vendaIndice;
			}

			//Modal Reações
			$ionicModal.fromTemplateUrl('templates/Padroes/reacoesModal.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.reacoesModal = modal
			});
			$scope.abrirReacoes = function(venda) {
				$scope.reacoesModal.show()
				$scope.vendaSelecionadaReacoes = venda;
			}



			//Função para formatar data e hora
			$scope.formatarDataHora = function (dataHora){
				var resultado = "";
				var objDataHr = new Date(dataHora);
				var dia = formatarNumeros(objDataHr.getDate());
				var mes = formatarNumeros(1 + objDataHr.getMonth());
				var ano = objDataHr.getFullYear();
				var horas = formatarNumeros(objDataHr.getHours());
				var minutos = formatarNumeros(objDataHr.getMinutes());

				resultado = dia + "/" + mes + "/" + ano + " às " + horas + 'h' + minutos;
				return resultado;
			}

			//Função para adicionar um zero no inicio de um número
			var formatarNumeros = function(num){
				if (num < 10){
					return '0' + num;
				}else{
					return num;
				}
			}

			//Função para dar like
			$scope.darLike = function (venda){
				if (!venda.likes){
					venda.likes = {};
				}

				if (!venda.deslikes){
					venda.deslikes = {};
				}

				//Removendo o deslike
				venda.deslikes[$scope.dadosUser.id] = false;

				//Alterando status do like
				if (venda.likes[$scope.dadosUser.id]){
					venda.likes[$scope.dadosUser.id] = false;
				}else{
					venda.likes[$scope.dadosUser.id] = true;
					notificar('reacao',venda.id,venda.idCriador);
					
				}
			};

			//Função para dar deslike
			$scope.darDeslike = function (venda){
				if (!venda.likes){
					venda.likes = {};
				}

				if (!venda.deslikes){
					venda.deslikes = {};
				}


				//Removendo o deslike
				venda.likes[$scope.dadosUser.id] = false;

				//Alterando status do like
				if (venda.deslikes[$scope.dadosUser.id]){
					venda.deslikes[$scope.dadosUser.id] = false;
				}else{
					venda.deslikes[$scope.dadosUser.id] = true;
					//Notificar usuario
					notificar('reacao',venda.id,venda.idCriador);
				}
			}

			//Função para criar comentário
			$scope.criarComentario = function(venda){
				var texto = $scope.input.comentario;

				if (texto !== ""){
					if (!venda.comentarios){
						venda.comentarios = [];
					}

					venda.comentarios.push({
						texto : texto,
						idCriador : $scope.dadosUser.id,
						dataCriacao : Date ()
					});
					$scope.input.comentario = "";
					notificar('comentario',venda.id,venda.idCriador);
				}
			}
			//Função para editar comentário
			$scope.editarComentario = function (comentario){
				$scope.input.comentario = comentario.texto;
				$scope.deletarComentario(comentario);
			}
			//função para deletar comentário
			$scope.deletarComentario = function(comentario){
				for (key in $scope.vendas[$scope.indiceVendaComentarios].comentarios){
					if($scope.vendas[$scope.indiceVendaComentarios].comentarios[key] === comentario){
						delete $scope.vendas[$scope.indiceVendaComentarios].comentarios[key];
					}
				}
			}
			//Função para contar comentários
			$scope.calcularNumComentarios = function (venda){
				if (venda.comentarios){
					return venda.comentarios.length;
				}else{
					return 0;
				}
			}

			//Função para calcular número de reações
			$scope.calculaNumReacoes = function (venda){
				var contador = 0;
				//Contando likes
				if (venda.likes){
					for (key in venda.likes){
						if (venda.likes[key]){
							contador++;
						}
					}
				}

				//Contando deslikes
				if (venda.deslikes){
					for (key in venda.deslikes){
						if (venda.deslikes[key]){
							contador++;
						}
					}
				}

				return contador;
			}

			//função para notificar usuário (reacao/comentario)
			var notificar = function(tipoNotificacao,idVenda,idCriadorVenda){
				
				if ($scope.dadosUser.id !== idCriadorVenda){
					var referecencia = $firebaseArray(database.child('notificacoes').child(idCriadorVenda));
					referecencia.$loaded().then(function(){
						//Notificar criador
						referecencia.$add({
							tipo : tipoNotificacao,
							idUsuario : $scope.dadosUser.id,
							visualizada : false,
							idVenda : idVenda,
							horario : Date()
						});
					}).catch(function(erro){
						console.log(erro);
					});
				}

				//Notificar assinantes
				var venda = $scope.vendas[idVenda];
				for (idAssinante in venda.assinaturas){
					if(venda.assinaturas[idAssinante] && idAssinante != $scope.dadosUser.id){
						var referenciaAssinante = $firebaseArray(database.child('notificacoes').child(idAssinante));
						referenciaAssinante.$loaded().then(function(){
							referenciaAssinante.$add({
								tipo : tipoNotificacao+'/assinatura',
								idUsuario : $scope.dadosUser.id,
								visualizada : false,
								idVenda : idVenda,
								horario : Date()
							});
						}).catch(function(erro){
							console.log(erro);
						});	
					}
				}
			};


			//Função para assinar (receber notificação) de uma divulgação
			$scope.receberNotificacoes = function(venda){
				if (!venda.assinaturas){
					venda.assinaturas = {};
				}
				if (!venda.assinaturas[$scope.dadosUser.id]){
					venda.assinaturas[$scope.dadosUser.id] = true;
				}else{
					venda.assinaturas[$scope.dadosUser.id] = false;
				}
			}

			//Evento de destruição do controller atual
		    $scope.$on('$destroy', function() {
		      $scope.modalZoom.remove();
		      $scope.detalhesModal.remove();
		      $scope.comentariosModal.remove();
		      $scope.reacoesModal.remove();
		    });
	});