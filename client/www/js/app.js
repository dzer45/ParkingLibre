// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

/* En attendant que le server marche bien */
//var API_URL = "http://192.168.1.35/parkinglibre";
var API_URL = "http://parkinglibre.thomasheymelot.com";

/**
 * Check bug iphone 4
 */

angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'ionic-ratings'])

.run(['$ionicPlatform', '$rootScope', '$timeout', '$cordovaNetwork', '$cordovaDialogs', '$ionicLoading', 'Config', 'Authentification', 'GeoLocalisation', 'User', function($ionicPlatform, $rootScope, $timeout, $cordovaNetwork, $cordovaDialogs, $ionicLoading, Config, Authentification, GeoLocalisation, User) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
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
    .state('carpark', {
        url: "/carpark",
        cache: false,
        templateUrl: "templates/carpark.html",
        controller: "CarParkCtrl"
    })
    .state('chargingstation', {
        url: "/chargingstation",
        cache: false,
        templateUrl: "templates/chargingstation.html",
        controller: "ChargingStationCtrl"
    })
    .state('freeplace', {
        url: "/freeplace",
        cache: false,
        templateUrl: "templates/freeplace.html",
        controller: "FreePlaceCtrl"
    })
    .state('home', {
        url: "/home",
        cache: false,
        templateUrl: "templates/home.html",
        controller: "HomeCtrl"
    })
    .state('profile', {
        url: "/profile",
        cache: false,
        templateUrl: "templates/profile.html",
        controller: "ProfileCtrl"
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');

}).filter('html', function($sce){
    return function(text){
        return $sce.trustAsHtml(text);
    };
});;

var controllers = angular.module('starter.controllers', []);
