services.factory('Authentification', ['$http', '$q', 'Config', function ($http, $q, Config) {
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

services.factory('TokenInterceptor', ['$q', 'Config', function ($q, Config) {
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
