controllers
.controller('RootCtrl', ['$scope', '$rootScope','$timeout', 'Sensitize', 'AirQuality', '$ionicModal','$q',
    function($scope, $rootScope, $timeout, Sensitize, AirQuality, $ionicModal,$q) {
      $scope.elapsed = false;
      $timeout(function(){$scope.elapsed = true}, 10000);

      Sensitize.getSentence().success(function(data){
        $scope.sentence = data[0].sentence;
      });

      var deferred = $q.defer();
      deferred.resolve(AirQuality.getAirQuality())
      deferred.promise.then(function(data){
        var num = parseInt(data[0])
        num = ~~(num/2);
        console.log(num)
        $scope.rate = new Array(num)
        $scope.rate2 = new Array(5-num)
      });

      $ionicModal.fromTemplateUrl('templates/modal-feedback.html', {
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function(modal) {
          $rootScope.modalFeedback = modal; 
      });   
      // var rate = parseInt(deferred.promise.data[0])
}]);
