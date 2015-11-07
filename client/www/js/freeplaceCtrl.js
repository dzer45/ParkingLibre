controllers
.controller('FreePlaceCtrl', ['$scope', '$rootScope', '$http', 'Place', 'GeoLocalisation', 
                              function ($scope, $rootScope, $http, Place, GeoLocalisation) {
	
	$scope.loadingFreePlace = false;
	$scope.sendPlace = false;

	$scope.freeMyPlace = function () {
		GeoLocalisation.getPosition().then(function (position){
			$scope.loadingFreePlace = true;
			$rootScope.loading.show();
			console.log(position.coords.longitude + ' ' + position.coords.latitude);
			Place.freePlace(position.coords.longitude,position.coords.latitude).success(function (data) {
				if($rootScope.user){
					$rootScope.user.score += 6;
				}
				$scope.sendPlace = true;
				$scope.loadingFreePlace = false;
				$rootScope.loading.hide();
			}).error(function (err) {
				$scope.sendPlace = false;
				$rootScope.loading.hide();
			});
		});
	};

	
}]);