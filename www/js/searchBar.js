app.directive('searchBar', [function () {
	return {
		scope: {
			ngModel: '='
		},
		require: ['^ionNavBar', 'ngModel'],
		restrict: 'E',
		replace: true,
		template: '<ion-nav-buttons side="right">'+
		'<div class="searchBar">'+
		'<div class="searchTxt" ng-show="ngModel.show">'+
		'<div class="bgdiv"></div>'+
		'<div class="bgtxt">'+
		'<input type="text" placeholder="Procurar..." ng-model="$parent.filtros.titulo">'+
		'</div>'+
		'</div>'+
		'<i class="icon placeholder-icon" ng-click="$parent.filtros.titulo=\'\';ngModel.show=!ngModel.show"></i>'+
		'</div>'+
		'</ion-nav-buttons>',

		link : function(scope, element, attrs, ngModel){
			var input = angular.element(element[0].querySelector('input'));
			input.bind("input", function(e) {
				scope.$apply(function() {
					console.log(e.target.value);
					ngModel.$setViewValue(e.target.value);
				});
			});

			scope.$watch(function(){
				return ngModel.$modelValue;
			}, function(modelValue){
				input.val(modelValue);
			});
		},
		
		compile: function (element, attrs) {
			var icon=attrs.icon
			|| (ionic.Platform.isAndroid() && 'ion-android-search')
			|| (ionic.Platform.isIOS()     && 'ion-ios-search')
			|| 'ion-search';
			angular.element(element[0].querySelector('.icon')).addClass(icon);
			
			return function($scope, $element, $attrs, ctrls) {
				var navBarCtrl = ctrls[0];
				$scope.navElement = $attrs.side === 'right' ? navBarCtrl.rightButtonsElement : navBarCtrl.leftButtonsElement;
				
			};
		},
		controller: ['$scope','$ionicNavBarDelegate', function($scope,$ionicNavBarDelegate){
			var title, definedClass;
			$scope.$watch('ngModel.show', function(showing, oldVal, scope) {
				if(showing!==oldVal) {
					if(showing) {
						if(!definedClass) {
							var numicons=$scope.navElement.children().length;
							angular.element($scope.navElement[0].querySelector('.searchBar')).addClass('numicons'+numicons);
						}
						
						title = $ionicNavBarDelegate.title();
						$ionicNavBarDelegate.title('');
					} else {
						$ionicNavBarDelegate.title(title);
					}
				} else if (!title) {
					title = $ionicNavBarDelegate.title();
				}
			});
		}]
	};
}]);