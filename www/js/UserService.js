//Service para armazenar dados do usuário atual no formato $firebaseObject
app.service('UserService',function(){
	var dadosUser = {};

	return {
		set : function(_dados){
			dadosUser = _dados;
		},
		get : function (){
			return dadosUser;
		}
	};
})