controllers
.controller('RootCtrl', ['$scope', '$rootScope','$timeout', 'Sensitize', 'AirQuality',
    function($scope, $rootScope, $timeout, Sensitize, AirQuality) {
      $scope.elapsed = false;
      $timeout(function(){$scope.elapsed = true}, 10000);

      Sensitize.getSentence().success(function(data){
        $scope.sentence = data[0].sentence;
      });

      AirQuality.getAirQuality().then(function(data){
        AirQuality.rate = parseInt(data[0]);
        $scope.ratings = 'AirQuality.rate'; 
      });




}]);
