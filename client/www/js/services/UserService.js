services.factory('User', ['$http', '$q', function ($http, $q) {
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
