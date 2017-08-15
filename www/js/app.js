// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('Troca-Troca', ['ionic','firebase','ngImgCrop','br.cidades.estados','ionic-ratings','ngOpenFB'])

.run(function($ionicPlatform,$state,$rootScope,$stateParams) {
  $ionicPlatform.ready(function() {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    //Configurando a splash screen
    if (window.navigator && window.navigator.splashscreen) {
      window.navigator.splashscreen.hide();
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
//Cache view
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);
})
//Desativando console.log
.config(function($logProvider) {
  $logProvider.debugEnabled(false);
})
//Desabilitando referência do DOM no angualrjs
.config(function($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
})
//Configurando animações para melhor performance
.config(function($animateProvider) {
    $animateProvider.classNameFilter( /\banimated\b/ );
})
//Configurando scroll nativo
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
});