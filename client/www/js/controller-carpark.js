angular.module('starter.controller-carpark', [])

.controller('CarParkCtrl', ['$rootScope', '$scope', '$timeout', 'Place','$compile', 
    function ($rootScope, $scope, $timeout, Place, $compile) {
    /**
     * Init des variables
     */
    $scope.isLoading = false;
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
    
    $scope.searchRoute = function (item) {
        $scope.isLoading = true;
        var myLatlng = new google.maps.LatLng(item.y,item.x);
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
        content: compiled[0]
        });

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Uluru (Ayers Rock)'
        });
    
        google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
        });

       
        $scope.map = map;
        
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();

        current_pos = new google.maps.LatLng(40.4,-78);
        end_pos = new google.maps.LatLng(6.176248545363775,48.695384785489395);
       
        var request = {
           origin:current_pos,
           destination:end_pos,
           travelMode: google.maps.TravelMode.DRIVING
        };
        
        
        directionsService.route(request, function(result, status) {
           if (status == google.maps.DirectionsStatus.OK) {
               alert('test');
              directionsDisplay.setDirections(result);
           }
        });
        directionsDisplay.setMap(map); 
          
      google.maps.event.addDomListener(window, 'load', initialize);
    
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }
        
        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
        
    };
     
}]);