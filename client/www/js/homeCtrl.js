controllers
.controller('HomeCtrl', ['$scope', '$rootScope', '$ionicModal', '$timeout', '$ionicPopup', 'Place',
    function($scope, $rootScope, $ionicModal, $timeout, $ionicPopup, Place) {
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
    $scope.logout = function() {
    	$rootScope.user = {};
    }
	$scope.showLoginPopup = function() {
		$rootScope.user = {};

		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
			template:'<form novalidate class="css-form">' +
			    'Login: <input type="text" ng-model="user.login" required /><br />'+
			    'Password: <input type="password" ng-model="user.password" required /><br />'+
			  '</form>',
			title: 'Authentification',
			scope: $rootScope,
			buttons: [
			          { text: 'Cancel' },
			          {
			        	  text: '<b>Login</b>',
			        	  type: 'button-positive',
			        	  onTap: function(e) {
			                  if (!$rootScope.user.login) {
			                      //don't allow the user to close unless he enters wifi password
			                      e.preventDefault();
			                    } else {
			                    	$rootScope.user.score = 42;
			                    	$rootScope.user.logged = true;
			                        return $rootScope.user.login;
			                    }
			                }
			          },
			          ]
		});
	}
      
}]);