angular.module('starter.controllers', [])

.controller('AuthCtrl', ['$scope', '$rootScope', '$q', '$ionicModal', 'User', 'Authentification', '$ionicPlatform', 
    function($scope, $rootScope, $q, $ionicModal, User, Authentification, $ionicPlatform) {
    $ionicPlatform.ready(function() {
        /**
         * Init variable de formulaires (log/register)
         */
        $scope.formInscription = {
            mail: '',
            password: '',
            pseudo: ''
        };  
        $scope.formConnexion = {
            mail: '',
            password: ''
        }; 

        /**
         * Fonction de soumission de l'inscription
         */
        $scope.inscription = function (form) {
            /**
             * Appel au service d'auth pour l'inscription
             */
            Authentification.inscription(form.mail, form.password, form.pseudo).then(function () {
                /**
                 * Si tout se passe bien, je cache la modal et je me log
                 */
                $scope.modalInscription.hide();
                $scope.connexion({mail: form.mail, password: form.password});
            }, function (err) {
                /**
                 * Sinon, j'affiche l'erreur
                 */
                form.message = err;
            });
        };
        
        /**
         * Fonction de soumission de la connexion
         */
        $scope.connexion = function (form) {
            /**
             * Appel au service d'auth pour la connexion
             */
            Authentification.connexion(form.mail, form.password).then(function () {
                /**
                 * Si tout se passe bien, je recupere le profil et je sauvegarde 
                 * le login, je sauv mon user dans le rootScope, je préviens le
                 * service d'auth que nous sommes connecté
                 */
                $scope.profile().then(function (user) {
                    console.log(JSON.stringify(user));
                    $rootScope.myUser = {id: user.id, mail: user.mail, pseudo: user.pseudo};
                    $rootScope.auth.isConnected = true;
                    $scope.modalConnexion.hide();
                }, function (err) {
                    $rootScope.myUser = {};
                    $rootScope.auth.isConnected = false;
                    console.log(err);
                }).finally(function () {
                    $rootScope.loading.hide();
                });
            }, function (err) {
                /**
                 * Sinon j'affiche l'erreur
                 */
                form.message = err;
                $rootScope.loading.hide();
            });
        };
        
        /**
         * Fonction de recuperation du profil
         */
        $rootScope.profile = function () {
            var deferred = $q.defer();
            
            /**
             * Récuperer du profil par le service User
             */
            User.profile().then(function (user) {
                /**
                 * Si ok, je renvois mon user
                 */
                deferred.resolve(user);
            }, function (err) {
                /**
                 * Sinon, je renvois mon err
                 */
                deferred.reject(err);
            });
            return deferred.promise;
        };

        /**
         * 
         * Déclaration de mes modals de ma page d'auth
         * 
         */
        
        /**
         * Modal de connexion
         */
        $ionicModal.fromTemplateUrl('templates/modal-connexion.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modalConnexion = modal;
        });
        
        /**
         * Modal d'inscription
         */
        $ionicModal.fromTemplateUrl('templates/modal-inscription.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modalInscription = modal;
        });
        
        /**
         * Modal d'information
         */
        $ionicModal.fromTemplateUrl('templates/modal-information.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modalInformation = modal;
        });

    });
}])

.controller('AppCtrl', ['$scope', '$rootScope', '$state', '$ionicModal', '$cordovaDialogs', 'Authentification', 
    function($scope, $rootScope, $state, $ionicModal, $cordovaDialogs, Authentification) {
    
    $scope.deconnexion = function () {
        Authentification.deconnexion();
        $rootScope.myUser = {};
        $rootScope.isConnected = false;
        $state.go('auth');
        $rootScope.loading.hide();
    };
    
    $ionicModal.fromTemplateUrl('templates/modal-hors-connexion.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $rootScope.modalHorsConnexion = modal;
        $rootScope.activeModeHorsConnexion = function () {
            $rootScope.config.modeHorsConnexion = true;
            $rootScope.modalHorsConnexion.hide();
        };
    });
}])
.controller('ProfilCtrl', ['$scope', '$rootScope', 'GeoLocalisation', function($scope, $rootScope, GeoLocalisation) {
    console.log('profilCtrl');
    $scope.adresse = '';
    
    $scope.rafraichirAdresse = function () {
        
        GeoLocalisation.getPosition().then(function (position) {
            console.log(position);
            $scope.position = position.coords;
            GeoLocalisation.getAdresse(position.coords.latitude, position.coords.longitude).then(function (adresse) {
                $scope.adresses = adresse;
            }, function () {
                $scope.adresse = '';
            });
        }, function (err) {
            console.log(JSON.stringify(err));
            $scope.adresse = '';
        });
    };  
    
    $scope.rafraichirAdresse();
}])

.controller('AccueilCtrl', ['$scope', '$rootScope', 'Items', 
    function($scope, $rootScope, Items) {
    /**
     * Init variable
     */
}])
.controller('ContentController', ['$scope', '$ionicSideMenuDelegate', 
    function ($scope, $ionicSideMenuDelegate) {
    console.log('contentCtrl');
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
}])

.controller('ParamsCtrl', ['$scope', 'Config', 
    function ($scope, Config) {
    $scope.config = Config;
    console.log('paramsCtrl');
}])

.controller('MenuCtrl', ['$scope', 
    function ($scope) {
    /**
     * Init des variables
     */
    $scope.isLoading = true;

}]);