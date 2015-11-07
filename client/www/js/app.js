// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var API_URL = "http://api.com";

/**
 * Check bug iphone 4
 */

angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])

.run(['$ionicPlatform', '$rootScope', '$timeout', '$cordovaNetwork', '$cordovaDialogs', '$ionicLoading', 'Config', 'Authentification', 'GeoLocalisation', 'User', function($ionicPlatform, $rootScope, $timeout, $cordovaNetwork, $cordovaDialogs, $ionicLoading, Config, Authentification, GeoLocalisation, User) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        console.log('okkkkkk!!!!');
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
        /**
         * Déclaration des variables rootScope
         */
        $rootScope.auth = Authentification;
        $rootScope.config = Config;
        $rootScope.myUser = {};
        
        $rootScope.loading = {
            show: function () {
                $ionicLoading.show({ template: '<ion-spinner icon="ripple"></ion-spinner>' });
            },
            hide: function () {
                $ionicLoading.hide();
            }
        };
        console.log('okkkkkk!!!!');
               
        /**
         * Gestion du OFFLINE ou ONLINE
         */
        $rootScope.config.horsConnexion = $cordovaNetwork.isOffline();
        
        if (!$rootScope.config.horsConnexion) {
            $rootScope.config.mapsIsLoaded = true;
        }
        
        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            $rootScope.config.horsConnexion = false;
            $rootScope.modalHorsConnexion.hide();
            $rootScope.$broadcast('isOnline');
        });

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            $rootScope.config.horsConnexion = true;
            if (!$rootScope.config.modeHorsConnexion) {
                $rootScope.modalHorsConnexion.show();
            }
        });
    });
}])

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
    /**
     * Ionic config
     */
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.tabs.style('standard');
    $ionicConfigProvider.backButton.text('Retour');
    //$ionicConfigProvider.views.maxCache(0);
    
    
    /**
     * Http config
     */
    //$httpProvider.defaults.timeout = 8000;
    $httpProvider.interceptors.push('TokenInterceptor');
    
    /**
     * Router config
     */
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('auth', {
        url: "/auth",
        cache: false,
        templateUrl: "templates/auth.html",
        controller: "AuthCtrl"
    })
    
    .state('app', {
        url: "/app",
        abstract: true,
        cache: false,
        templateUrl: "templates/menu.html",
        controller: "AppCtrl"
    })

    // Each tab has its own nav history stack:

    .state('app.accueil', {
      url: '/accueil',
      views: {
        'menu-content': {
          templateUrl: 'templates/menu-accueil.html',
          controller: 'AccueilCtrl'
        }
      }
    })
    .state('app.profil', {
      url: '/profil',
      views: {
        'menu-content': {
          templateUrl: 'templates/menu-profil.html',
          controller: 'ProfilCtrl'
        }
      }
    })
    .state('app.parametres', {
      url: '/parametres',
      views: {
        'menu-content': {
          templateUrl: 'templates/menu-parametres.html',
          controller: 'ParamsCtrl'
        }
      }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/accueil');

});
