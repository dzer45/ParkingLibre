controllers
.controller('RootCtrl', ['$scope', '$rootScope','$timeout', 'Sensitize', 'AirQuality', '$ionicModal',
    function($scope, $rootScope, $timeout, Sensitize, AirQuality, $ionicModal) {
      $scope.elapsed = false;
      $timeout(function(){$scope.elapsed = true}, 10000);

      Sensitize.getSentence().success(function(data){
        $scope.sentence = data[0].sentence;
      });

      AirQuality.getAirQuality().then(function(data){
        AirQuality.rate = parseInt(data[0]);
        $scope.ratings = 'AirQuality.rate'; 
      });


      $ionicModal.fromTemplateUrl('templates/modal-feedback.html', {
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function(modal) {
          $rootScope.modalFeedback = modal; 
      });   


}]);
