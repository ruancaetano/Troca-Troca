//Service para armazenar dados do usuário atual no formato $firebaseObject
app.service('EditarVendaService',function(){
	var venda = "";

	return {
		set : function(_venda){
			venda = _venda;
		},
		get : function (){
			return venda;
		}
	};
})