angular.module('starter.controller-carpark', [])

.controller('CarParkCtrl', ['$rootScope', '$scope', '$timeout', 'Place', 
    function ($rootScope, $scope, $timeout, Place) {
    /**
     * Init des variables
     */
    //$scope.isLoading = true;
    $scope.loadingCarPark = false;
    $scope.items = false;
        
    $scope.searchCarPark = function () {
        $scope.loadingCarPark = true;
        $rootScope.loading.show();
        
        Place.findFreePlaces('6.176248545363775', '48.695384785489395','1000').success(function (data) {
            console.log('ok');
            console.log(JSON.stringify(data));
            $scope.items = data;
            $scope.loadingCarPark = false;
            $rootScope.loading.hide();
        }).error(function () {
           $scope.items = false;
           $rootScope.loading.hide();
        });
    };
}]);