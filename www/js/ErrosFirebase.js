app.service('ErrosFirebase',function(){

	var handle = {
		'auth/app-deleted' : 'Problema interno, por favor comunique nossa equipe!',
		'auth/app-not-authorized' : 'Problema interno, por favor comunique nossa equipe!',
		'auth/argument-error' : 'Dados inválidos, por favor informe os dados corretamente!',
		'auth/invalid-api-key' : 'Problema interno, por favor comunique nossa equipe!',
		'auth/invalid-user-token' : 'Encontramos problemas para vincular sua rede social, tente novamente!',
		'auth/network-request-failed' : 'Sua conexão com a internet talvez esteja passando por problemas, tente novamente!',
		'auth/operation-not-allowed' : 'Problema interno, por favor comunique nossa equipe!',
		'auth/requires-recent-login' : 'Você precisa realizar login, antes de realizar alguma operação!',
		'auth/too-many-requests' : 'Sua operação foi cancelada, pois o seu dispositivo está realizando operações impróprias.',
		'auth/unauthorized-domain' : 'Problema interno, por favor comunique nossa equipe!',
		'auth/user-disabled' : 'Sua conta foi desativada, entre em contato com nossa equipe para outras informações!',
		'auth/user-token-expired' : 'Encontramos um problema com sua rede social vinculada, tente entrar novamente!',
		'auth/web-storage-unsupported' : 'Problema interno, por favor comunique nossa equipe!',
		'auth/invalid-email' : 'Formato de e-mail inválido, verifique e tente novamente!',
		'auth/user-not-found' : 'Usuário não encontrado, verifique os dados e tente novamente!',
		'auth/wrong-password' : 'Senha inválida, verifique e tente novamente!',
		'auth/email-already-in-use' : 'Desculpe, esse e-mail já está sendo usado em uma outra conta!',
		'auth/weak-password' : 'Senha muito fraca, tente com uma outra senha!',
		'auth/account-exists-with-different-credential' : 'Desculpe, esse e-mail já está sendo usado em uma outra conta!',
		'invalid-credential' : 'Encontramos um problema ao tentar vincular sua rede social, por favor tente novamente!'
	}

	return {
		msg : function(codigo){
			return handle[codigo];
		}
	}


});