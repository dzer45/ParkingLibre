services.factory('Profile', ['$http', '$q', 'Config', function ($http, $q, Config) {
    return {
        app_auth: function (_api_key, _api_secret) {
           var deferred = $q.defer();

            function reqListener(){
                console.log(JSON.parse(this.responseText).response.token);
                deferred.resolve(JSON.parse(this.responseText).response.token);
            }
            var req = new XMLHttpRequest();

            req.open("POST", "https://api.pbapp.net/Auth", true);
            var data = new FormData();
            data.append("api_key", "2336542779");
            data.append("api_secret", "3a8c82795e662c25a87b692d444986bb");
            req.onload = reqListener;
            req.send(data);

            return deferred.promise;
        },
        user_info: function(token){
            var deferred = $q.defer();
            var req = {
                    method: 'POST',
                    url: 'https://api.pbapp.net/Player/test?api_key=2336542779&iodocs=true&id=test&token=' + token,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                    }
            }

            console.log(req);
            //$http.post('https://api.pbapp.net/Auth?api_key=' + api_key + '&iodocs=true', {api_secret: api_secret}).success(function (result) {
            $http(req).success(function (result) {    
                console.log(result.response.player);
                deferred.resolve(result.response.player);
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

    };
}])
