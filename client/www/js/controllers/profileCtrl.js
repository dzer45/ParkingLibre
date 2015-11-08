controllers
.controller('ProfileCtrl', ['$scope', '$rootScope', '$http', 'Place', 'Profile',
                              function ($scope, $rootScope, $http, Place, Profile) {
	var token = Profile.app_auth("2336542779", "3a8c82795e662c25a87b692d444986bb");

  Profile.user_info(token).then(function(data){
    $scope.player = data;
  })
}]);
