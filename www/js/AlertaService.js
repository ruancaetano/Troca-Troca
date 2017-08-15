app.service('Alerta',function($ionicPopup){
	return {

		show : function(titulo,mensagem){
			titulo = '' + titulo.toLowerCase();

			if (titulo === "erro"){
				var iconeTitulo = "<i class='icon ion-ios-close-outline iconeErroAlerta'></i>";
			} else if (titulo === "duvida"){
				var iconeTitulo = "<i class='icon ion-ios-help-outline iconeDuvidaAlerta'></i>";
			} else if (titulo === "sucesso"){
				var iconeTitulo = "<i class='icon ion-ios-checkmark-outline iconeSucessoAlerta'></i>";
			}
			$ionicPopup.alert({
				title: iconeTitulo,
				template: mensagem
			});
		}
	};
});