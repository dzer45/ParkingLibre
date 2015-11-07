controllers
.controller('RootCtrl', ['$scope', '$rootScope','$timeout',
    function($scope, $rootScope, $timeout) {
      $scope.elapsed = false;
      $timeout(function(){$scope.elapsed = true}, 10000);
}]);
