controllers
.controller('CarParkCtrl', ['$rootScope', '$scope', '$ionicPlatform', '$ionicPopup', '$cordovaGeolocation', '$state', '$timeout', 'Place', 'GeoLocalisation',
    function ($rootScope, $scope, $ionicPlatform, $ionicPopup, $cordovaGeolocation, $state, $timeout, Place, GeoLocalisation) {


    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //:::                                                                         :::
    //:::  This routine calculates the distance between two points (given the     :::
    //:::  latitude/longitude of those points). It is being used to calculate     :::
    //:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
    //:::                                                                         :::
    //:::  Definitions:                                                           :::
    //:::    South latitudes are negative, east longitudes are positive           :::
    //:::                                                                         :::
    //:::  Passed to function:                                                    :::
    //:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
    //:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
    //:::    unit = the unit you desire for results                               :::
    //:::           where: 'M' is statute miles (default)                         :::
    //:::                  'K' is kilometers                                      :::
    //:::                  'N' is nautical miles                                  :::
    //:::                                                                         :::
    //:::  Worldwide cities and other features databases with latitude longitude  :::
    //:::  are available at http://www.geodatasource.com                          :::
    //:::                                                                         :::
    //:::  For enquiries, please contact sales@geodatasource.com                  :::
    //:::                                                                         :::
    //:::  Official Web site: http://www.geodatasource.com                        :::
    //:::                                                                         :::
    //:::               GeoDataSource.com (C) All Rights Reserved 2015            :::
    //:::                                                                         :::
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    $scope.distance = function(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var radlon1 = Math.PI * lon1/180
        var radlon2 = Math.PI * lon2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
    }


    /**
     * Init des variables
     */
    $scope.isLoading = false;
    $scope.items = false;
    $scope.hasChoice = false;
    $scope.start = false;
    $scope.steps = false;

    $scope.loadingCarPark = true;
    $rootScope.loading.show();

    if(!Place.payingPark){
      GeoLocalisation.getPosition().then(function (position) {
          Place.findFreePlacesLimit(position.coords.latitude, position.coords.longitude,'5000', 3).success(function (data) {
              $rootScope.loading.hide();
              if (data.public.length == 0 && data.private.length == 0) {
                  $ionicPopup.alert({
                      title: 'Problème',
                      template: 'Aucun parking ou place disponible dans les environs...'
                  }).then(function(res) {
                      $state.go('home');
                  });
              }
              else {
                  $scope.items = data;
                  $scope.loadingCarPark = false;

                  /**
                   * Si tout est ok, je charge la map
                   */
                  $scope.currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                  var mapOptions = {
                      center: $scope.currentPosition,
                      zoom: 16,
                      mapTypeId: google.maps.MapTypeId.ROADMAP,
                      disableDefaultUI: true
                  }
                  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                  $scope.directionsService = new google.maps.DirectionsService();
                  $scope.directionsDisplay = new google.maps.DirectionsRenderer();
                  $scope.directionsDisplay.setMap($scope.map);
              }
          }).error(function () {
             $scope.items = false;
             $rootScope.loading.hide();
          });
      }, function () {
          $ionicPopup.alert({
              title: 'Problème',
              template: 'La géolocalisation n\'est pas fonctionnelle !'

          }).then(function(res) {
              $state.go('home');
          });
          /*
           * Callback go home
           */
      });
    } else {
      //find payink park
    }

    $scope.ifArrive = function(){
        console.log("Function if arrive");
        console.log($scope.distance($scope.currentPos.latitude, $scope.currentPos.longitude, $scope.currentItem.y, $scope.currentItem.x, "K"));
        if($scope.distance($scope.currentPos.latitude, $scope.currentPos.longitude, $scope.currentItem.y, $scope.currentItem.x, "K") < 0.1){
            console.log("arriving soon");
            $scope.stopTimeout();
            $rootScope.modalFeedback.show();
            $scope.stopRoute();
        }
    }

    $scope.startTimeout = function () {
        console.log('start1');
        GeoLocalisation.getPosition().then(function (position) {
            console.log(position);
            console.log('start2');
            $scope.currentPos = position.coords;
            $scope.marker.setPosition({lat: position.coords.latitude, lng: position.coords.longitude});
            $scope.map.setCenter($scope.marker.getPosition());
            $scope.ifArrive();
            $scope.promiseTimeout = $timeout(function () {
                console.log('start3');
                $scope.startTimeout();
            }, 1500);
        });
    };

    $scope.stopTimeout = function () {
        console.log("Stop Timeout");
        $timeout.cancel($scope.promiseTimeout);
    };

    $scope.stopRoute = function () {
        $state.go('home');
    };

    $scope.choicePlace = function (item) {
        $scope.hasChoice = true;
        $scope.currentItem = item;
        end_pos = new google.maps.LatLng($scope.currentItem.y, $scope.currentItem.x);

        var request = {
           origin: $scope.currentPosition,
           destination:end_pos,
           travelMode: google.maps.TravelMode.DRIVING
        };
        $scope.directionsService.route(request, function(result, status) {
           if (status == google.maps.DirectionsStatus.OK) {
                console.log(result);
                $scope.directionsDisplay.setDirections(result);
                $scope.$apply(function () {
                    $scope.steps = result.routes[0].legs[0].steps;
                    $scope.currentStep = $scope.steps[0];
                });
            }
        });
    };

    $scope.startRoute = function () {
        $scope.start = true;
        end_pos = new google.maps.LatLng($scope.currentItem.y, $scope.currentItem.x);

        var request = {
           origin: $scope.currentPosition,
           destination:end_pos,
           travelMode: google.maps.TravelMode.DRIVING
        };


        $scope.marker = new google.maps.Marker({
            position: $scope.currentPosition,
            map: $scope.map,
            title: 'Yolo',
            icon: 'img/me.png'
        });

        $scope.directionsService.route(request, function(result, status) {
           if (status == google.maps.DirectionsStatus.OK) {
                console.log(result);
                $scope.directionsDisplay.setDirections(result);
                $scope.$apply(function () {
                    $scope.steps = result.routes[0].legs[0].steps;
                    console.log($scope.steps);
                    $scope.ng = $scope.steps[0];
                    $timeout(function() {
                        $scope.map.setCenter($scope.currentPosition);
                        $scope.map.setZoom(18);
                    }, 1000);
                });
            }
        });
        $scope.stopTimeout();
        $scope.startTimeout();
    }

    /**
     * Calcul de distance
     */
    $scope.calculDistance = function (step){
        R = 6378000 //Rayon de la terre en mètre
        lat_a = convertRad(step.lat);
        lon_a = convertRad(step.lng);
        lat_b = convertRad($scope.position.coords.latitude);
        lon_b = convertRad($scope.position.coords.longitude);
        return R * (Math.PI/2 - Math.asin( Math.sin(lat_b) * Math.sin(lat_a) + Math.cos(lon_b - lon_a) * Math.cos(lat_b) * Math.cos(lat_a)))
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
            title: 'Uluru (Ayers Rock)',
            icon: 'img/voiture.png'
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
