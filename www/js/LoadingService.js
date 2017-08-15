app.service('Loading',function($ionicLoading){
	return {
		show : function (){
		 $ionicLoading.show(
		 	{
	        	template: '<ion-spinner class="bubbles"></ion-spinner>'
	      	});
		},
		hide : function (){
			$ionicLoading.hide();
		}
	}

});