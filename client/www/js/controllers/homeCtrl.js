controllers
.controller('HomeCtrl', ['$scope', '$rootScope', '$ionicModal', '$timeout', '$state', '$ionicPopup', 'Place',
    function($scope, $rootScope, $ionicModal, $timeout, $state, $ionicPopup, Place) {
    /**
     * Init variable
     */
    $scope.isLoading = false;

    $scope.dispache = false;

    $scope.cherchePlace = function () {
        $scope.dispache = true;
        $timeout(function () {
            $state.go('carpark');
        }, 1000);
    };


    $scope.seeProfil = function () {
        $scope.dispache = false;
        $timeout(function () {
            $state.go('profile');
        }, 1000);
    };

    $scope.borneElectrique = function () {
        $scope.dispache = true;
        $timeout(function () {
            $state.go('chargingstation');
        }, 1000);
    };

    /**
     * Modal des parametres
     */
    $ionicModal.fromTemplateUrl('templates/modal-parametres.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $rootScope.modalParametres = modal;
    });

    $scope.payingPark = Place.payingPark;
    $scope.radius = Place.radius;
    $scope.limit = Place.limit;

    $scope.setPaying = function(paying){
      Place.payingPark = paying;
      window.localStorage.setItem('payingPark', paying);
    };
    $scope.setRadius = function(radius){
      Place.radius = radius;
      window.localStorage.setItem('radius', radius);
    };
    $scope.setLimit = function(limit){
      Place.limit = limit;
      window.localStorage.setItem('limit', limit);
    };

    $ionicModal.fromTemplateUrl('templates/modal-authentification.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal
        if(!$rootScope.user){
        	$scope.modal.show();
        }
      });

      $scope.openModal = function() {
    	  $scope.user = null;
    	  $rootScope.user = null;
        $scope.modal.show();
      };

      $scope.closeModal = function() {
        $scope.modal.hide();
      };

    $scope.logout = function() {

    	$scope.openModal();
    };

    $scope.login = function(user){
    	$rootScope.user = user;
    	$rootScope.user.logged = true;
    	$rootScope.user.score = 42;
    	$scope.closeModal();
        $scope.rassemble = true;
    };
    
    $scope.fbLogin = function () {
        
    };
}]);
