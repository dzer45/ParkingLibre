services.factory('Config', [function () {
	return {
		modeHorsConnexion: false,
		horsConnexion: false,
		token: '',
		mapsIsLoaded: false,
		modeTrace: true
	};
}])

services.factory('Weather', ['$http', '$q', function ($http, $q) {
	return {
		getByCoords: function (lat, lng) {
			var deferred = $q.defer();
			$http.get('http://api.openweathermap.org/data/2.5/weather?units=metric&lat='+lat+'&lon='+lng).success(function (data) {
				deferred.resolve(data);
			}).error(function (err) {
				deferred.reject(err);
			});
			return deferred.promise;
		}
	};
}])

services.factory('Sensitize', ['$http', '$q', function ($http, $q) {
	return {
		getSentence: function () {
			return $http.get(API_URL+ '/sensibilization');
		}
	};
}])

services.factory('AirQuality', ['$http', '$q', function ($http, $q) {
	return {
		getAirQuality: function (latitude, longitude) {
			var deferred = $q.defer();
			$http.get(API_URL + '/air/qualityGeo/\"'+latitude+'\"/\"'+longitude+'\"').success(function (data) {
				deferred.resolve(data);
			}).error(function (err) {
				deferred.reject(err);
			});
			return deferred.promise;
		}
	};
}]);

services.factory('Prise', ['$http', function ($http) {
    return {
        typePrises: function () {
            return $http.get(API_URL + '/map/getAllTypesOfOutlet');
        },
        findPrises: function (type) {
            return $http.get(API_URL + '/map/findChargingStation/' + type);
        }
    };
}])
