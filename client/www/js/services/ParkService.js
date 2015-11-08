services.factory('Place', ['$http', function ($http) {
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
        },
        payingPark : window.localStorage.getItem('payingPark')||true,
        radius : window.localStorage.getItem('radius')||15,
        limit: window.localStorage.getItem('limit')||3
    };

}]);

