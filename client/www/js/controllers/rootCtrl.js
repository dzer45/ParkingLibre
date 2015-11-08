controllers
.controller('RootCtrl', ['$scope', '$rootScope', '$ionicLoading','$timeout', 'Sensitize', 'AirQuality', '$ionicModal','$q',
    function($scope, $rootScope, $ionicLoading, $timeout, Sensitize, AirQuality, $ionicModal,$q) {
        
        $rootScope.loading = {
            show: function () {
                $ionicLoading.show({ template: '<ion-spinner icon="ripple"></ion-spinner>' });
            },
            hide: function () {
                $ionicLoading.hide();
            }
        };
        
        $scope.elapsed = false;
      $timeout(function(){$scope.elapsed = true}, 10000);

      Sensitize.getSentence().success(function(data){
        $scope.sentence = data[0].sentence;
      });

      GeoLocalisation.getPosition().then(function (position) {

        AirQuality.getAirQuality(position.coords.latitude, position.coords.longitude).then(function(data){
          var num = parseInt(data[0])
          num = ~~(num/2);
          $scope.rate = new Array(num)
          $scope.rate2 = new Array(5-num)
        })

      }, function () {
          $ionicPopup.alert({
              title: 'Problème',
              template: 'La géolocalisation n\'est pas fonctionnelle !'

          });
      });

      $ionicModal.fromTemplateUrl('templates/modal-feedback.html', {
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function(modal) {
          $rootScope.modalFeedback = modal;
      });
}]);
