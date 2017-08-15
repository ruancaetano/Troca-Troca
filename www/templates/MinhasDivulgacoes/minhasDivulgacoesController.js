app.controller('minhasDivulgacoesController',
	function($scope,$timeout,$firebaseObject,$ionicModal,$ionicPopup,$state,$location,$stateParams,
		$ionicScrollDelegate,UserService,Loading,brCidadesEstados,EditarVendaService,Alerta){
			$scope.exibirFiltro = false;
			$scope.idVendaToScroll = $stateParams.idVendaToScroll;
		    //Recuperando dados essenciais
		    var database = firebase.database().ref();
		    $scope.usuarios = $firebaseObject(database.child('usuarios'));
		    $scope.vendas = $firebaseObject(database.child('vendas'));
		    $scope.vendas.$bindTo($scope, "vendas");
		    $scope.vendas.$loaded().then(function(){
		    	if ($scope.idVendaToScroll){
			    	$timeout(function(){
			    		$location.hash($scope.idVendaToScroll);
		           		$ionicScrollDelegate.anchorScroll();
			    	});
		    	}
		    }).catch(function(erro){
		    	Alerta.show('erro','Falha ao carregar divulgações, por favor tente novamente!');
		    });
		    $scope.dadosUser = UserService.get();
		    $scope.input = {
		    	comentario : ''
		    };
		    $scope.filtros = {
		    	estado :'',
		    	cidade : '',
		    	categoria : '',
		    	titulo : ''
		    };

		    //Cidade estado select
			$scope.estados = brCidadesEstados.estados;
			$scope.buscarCidadesPorSigla = function(sigla){
				$scope.cidades = brCidadesEstados.buscarCidadesPorSigla(sigla);
			};

		    //Modal Zoom
			$ionicModal.fromTemplateUrl('templates/Padroes/zoomImagem.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.modalZoom = modal
			});
			$scope.zoom = function(urlImagem) {
				$scope.modalZoom.show()
				$scope.imagemZoom = urlImagem;
			};


			//Modal Detalhes
			$ionicModal.fromTemplateUrl('templates/Padroes/detalhesModal.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.detalhesModal = modal
			});
			$scope.verDescricao = function(venda) {
				$scope.detalhesModal.show()
				$scope.vendaSelecionadaDetalhes = venda;
			};

			//Modal Comentários
			$ionicModal.fromTemplateUrl('templates/Padroes/comentariosModal.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.comentariosModal = modal
			});
			$scope.abrirComentarios = function(vendaIndice) {
				$scope.comentariosModal.show()
				$scope.indiceVendaComentarios = vendaIndice;
			};

			//Modal Reações
			$ionicModal.fromTemplateUrl('templates/Padroes/reacoesModal.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.reacoesModal = modal
			});
			$scope.abrirReacoes = function(venda) {
				$scope.reacoesModal.show()
				$scope.vendaSelecionadaReacoes = venda;
			};

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
			};

			//Função para adicionar um zero no inicio de um número
			var formatarNumeros = function(num){
				if (num < 10){
					return '0' + num;
				}else{
					return num;
				}
			};

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


				if (!venda.reacoes){
					venda.reacoes = {};
				}

				//Removendo o deslike
				venda.likes[$scope.dadosUser.id] = false;
	
				//Alterando status do like
				if (venda.deslikes[$scope.dadosUser.id]){
					venda.deslikes[$scope.dadosUser.id] = false;
				}else{
					venda.deslikes[$scope.dadosUser.id] = true;
				}
			};

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
				}
			};
			//Função para editar comentário
			$scope.editarComentario = function (comentario){
				$scope.input.comentario = comentario.texto;
				$scope.deletarComentario(comentario);
			};
			//função para deletar comentário
			$scope.deletarComentario = function(comentario){
				for (key in $scope.vendas[$scope.indiceVendaComentarios].comentarios){
					if($scope.vendas[$scope.indiceVendaComentarios].comentarios[key] === comentario){
						delete $scope.vendas[$scope.indiceVendaComentarios].comentarios[key];
					}
				}
			};
			//Função para contar comentários
			$scope.calcularNumComentarios = function (venda){
				if (venda.comentarios){
					return venda.comentarios.length;
				}else{
					return 0;
				}
			};

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
			};

			//Função para divulgar venda
			$scope.divulgarVenda = function (venda){
				var hoje = new Date();
				var criacaoVenda = new Date(venda.dataPublicacao);

				var diferenca = Math.floor((hoje.getTime() - criacaoVenda.getTime()) / (1000*60*60));
				if (diferenca >= 24){
					var agora = hoje.toString();
					venda.dataPublicacao = agora;
					Alerta.show('sucesso','Sua venda foi divulgada e aparecerá no topo das buscas novamente!');
				}else{
					Alerta.show('erro','Desculpe, o tempo mínimo entre uma divulgação e outra é de 24 horas!');
				}
			};

			//Função para ir para página de editar venda
			$scope.editarVenda = function (indiceVenda){
				EditarVendaService.set(indiceVenda);
				$state.go('menu.editarVenda');
			}

			//Função para excluir venda
			$scope.excluirVenda = function(indiceVenda){
				var confirmPopup = $ionicPopup.confirm({
					title: 'Remover Divulgação',
					template: 'Você deseja remover permanentemente essa divulgação?'
				});
				confirmPopup.then(function(res) {
					if(res) {
						var venda = $firebaseObject(database.child('vendas').child(indiceVenda));
						Loading.show();
						venda.$loaded().then(function(){
							var imagensParaExcluir = [];
							for (var idx in venda.imagens){
						 		var url = venda.imagens[idx];
						 		imagensParaExcluir.push(url);
						 	}
						 	venda.$remove().then(function(){
							 	for (var idx in imagensParaExcluir){
							 		var url = imagensParaExcluir[idx];
							 		var refRemocao = firebase.storage().refFromURL(url);
							 		refRemocao.delete();
							 	}
							 	Loading.hide();
						 	}).catch(function(erro){
						 		Loading.hide();
						 		Alerta.show('erro','Falha ao remover divulgação, por favor tente novamente!');
						 	});	
						}).catch(function(erro){
					 		Loading.hide();
					 		Alerta.show('erro','Falha ao remover divulgação, por favor tente novamente!');;
						});
					};
				});
			};

			//Evento de destruição do controller atual
		    $scope.$on('$destroy', function() {
		      $scope.modalZoom.remove();
		      $scope.detalhesModal.remove();
		      $scope.comentariosModal.remove();
		      $scope.reacoesModal.remove();
		    });
	});