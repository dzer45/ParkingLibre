angular.module('starter.controller-freeplace', [])

.controller('FreePlaceCtrl', ['$scope', '$rootScope', '$http', 'Place',
                              function ($scope, $rootScope, $http, Place) {

	$scope.loadingFreePlace = false;
	$scope.sendPlace = false;

	$scope.freeMyPlace = function () {
		var x = 12;
		var y = 12;		
		$scope.loadingFreePlace = true;
		$rootScope.loading.show();
		Place.freePlace(x,y).success(function (data) {
			$scope.sendPlace = true;
			$scope.loadingFreePlace = false;
			$rootScope.loading.hide();
		}).error(function (err) {
			$scope.sendPlace = false;
			$rootScope.loading.hide();
		});
	};
}]);