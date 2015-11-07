angular.module('starter.controller-freeplace', [])

.controller('FreePlaceCtrl', ['$scope', '$rootScope', '$http', 
    function ($scope, $rootScope, $http) {

	$scope.freePlace = function(){
		var x = 12;
		var y = 12;
		var route = '/map/addPlaceInformation';
		var payload = {
				'x' : x,
				'y' : y,
				'isFree' :'true'};
        $http.post(API_URL + route, payload).success(function (data) {
            $scope.send = "envoyé";
            $rootScope.loading.hide();
        }).error(function (err) {
        	$scope.send = "non envoyé";
            $rootScope.loading.hide();
        });
	}
}]);