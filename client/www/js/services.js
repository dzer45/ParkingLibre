angular.module('starter.services', [])

.factory('Config', [function () {
    return {
        modeHorsConnexion: false,
        horsConnexion: false,
        token: '',
        mapsIsLoaded: false,
        modeTrace: true
    };
}])



.factory('Authentification', ['$http', '$q', 'Config', function ($http, $q, Config) {
    var that = this;
    return {
        isConnected: false,
        connexion: function (mail, password) {
            var deferred = $q.defer();
            $http.post(API_URL + '/auth/login', {mail: mail, password: password}).success(function (token) {
                Config.token = token;
                that.isConnected = true;
                deferred.resolve();
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        },
        inscription: function (mail, password, pseudo) {
            var deferred = $q.defer();
            $http.post(API_URL + '/auth/register', {mail: mail, password: password, pseudo: pseudo}).success(function (data) {
                deferred.resolve();
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        },
        deconnexion: function () {
            var deferred = $q.defer();
            $http.get(API_URL + '/auth/logout').success(function () {
                that.isConnected = false;
                deferred.resolve();
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    };
}])

.factory('User', ['$http', '$q', function ($http, $q) {
    this.user = {};
    var that = this;
    return {
        profile: function () {
            var deferred = $q.defer();
            $http.get(API_URL + '/user/profile').success(function (user) {
                that.user = user;
                that.user.position = JSON.parse(that.user.position);
                deferred.resolve(that.user);
            }).error(function (err) {
                console.log(err);
                deferred.reject(err);
            });
            return deferred.promise;
        },
        refreshPosition: function (position) {
            var deferred = $q.defer();
            $http.put(API_URL + '/user/position', position).success(function () {
                deferred.resolve();
            }).error(function (err) {
                console.log(err);
                deferred.reject(err);
            });
            return deferred.promise;
        },
        get: function () {
            return that.user;
        }
    };
}])

.factory('GeoLocalisation', ['$cordovaGeolocation', '$q', '$http', function ($cordovaGeolocation, $q, $http) {
    this.position = {};
    var that = this;
    return {
        getPosition: function () {
            var deferred = $q.defer();
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                that.position = position;
                deferred.resolve(that.position);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        },
        getAdresse: function (lat, lng) {
            var deferred = $q.defer();
            $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=true').success(function (data) {
                if(data.results.length>0) {
                    deferred.resolve(data);
                }
                else {
                    deferred.reject('LOC_UNKNOWN');
                }
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    };
}])

.factory('Weather', ['$http', '$q', function ($http, $q) {
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

.factory('Sensitize', ['$http', '$q', function ($http, $q) {
    return {
        getSentence: function () {
            return $http.get(API_URL+ '/sensibilization');
        }
    };
}])

.factory('AirQuality', ['$http', '$q', function ($http, $q) {
    return {
        getAirQuality: function () {
            var deferred = $q.defer();
            $http.get(API_URL+ '/air/quality').success(function (data) {
                deferred.resolve(data);
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        },
        rate:null
    };
}])

.factory('TokenInterceptor', ['$q', 'Config', function ($q, Config) {
    return {
        request: function (config) {
            if (Config.token) {
                config.headers.Authorization = 'Bearer ' + Config.token;
            }
            if (config.url.indexOf(API_URL)>-1) {
                config.url+='?' + (new Date()).getTime();
                config.timeout = 5000;
            }
            console.log(config.url);
            return config;
        },
        requestError: function (rejection) {
            /*if (rejection != null && !Config.modeHorsConnexion) {
                $rootScope.modalHorsConnexion.show();
            }*/
            return $q.reject(rejection);
        },
        responseError: function(rejection) {
            /*if (rejection != null && !Config.modeHorsConnexion) {
                $rootScope.$emit('horsConnexion', true);
                $rootScope.modalHorsConnexion.show();
            }
            else if (rejection != null) {
                $rootScope.$emit('horsConnexion', true);
            }*/
            return $q.reject(rejection);
        }
    };
 }])

.factory('Place', ['$http', function ($http) {
    return {
        findFreePlacesLimit: function (x,y,radius,limit) {
            return $http.get(API_URL + '/map/findFreePlaces/'+y+'/'+x+'/'+radius+'/'+limit);
        },
        findFreePlaces: function (x,y,radius) {
            return $http.get(API_URL + '/map/findFreePlaces/'+y+'/'+x+'/'+radius);
        },
        freePlace: function (x,y) {
        	var req = {
        			method: 'POST',
        			url: API_URL + '/map/addPlaceInformation',
        			headers: {
        				'Content-Type': 'application/x-www-form-urlencoded'
        			},
        			data: {
        				"x" : x,
        				"y" : y,
        				"isFree" :"true"
        			}
        	}
        	return $http(req);
        }
    };
}]);
