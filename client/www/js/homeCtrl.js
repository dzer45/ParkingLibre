controllers
.controller('HomeCtrl', ['$scope', '$rootScope', '$ionicModal', '$timeout', 'Place',
    function($scope, $rootScope, $ionicModal, $timeout, Place) {
    /**
     * Init variable
     */
    $scope.isLoading = false;
    
   
    /**
     * Modal des parametres
     */
    $ionicModal.fromTemplateUrl('templates/modal-parametres.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $rootScope.modalParametres = modal; 
    });   
    
    $scope.settingsList = [
        { text: "Parking Payant", checked: true },
        { text: "Radius", checked: false },
        { text: "Limite", checked: false }
    ];
      
    
      
}]);