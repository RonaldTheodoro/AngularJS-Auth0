(function() {
    'use strict';

    angular.module('authApp', [
        'auth0',
        'angular-storage',
        'angular-jwt',
        'ngMaterial',
        'ui.router'
    ]).config(function(
        $provide,
        authProvider,
        $urlRouterProvider,
        $stateProvider,
        $httpProvider,
        jwtInterceptorProvider) {

        authProvider.init({
            domain: 'YOUR_DOMAIN',
            clientID: 'YOUR_CLIENTID'
        });

        $urlRouterProvider.otherwise('/home');

        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'components/home/home.tpl.html'
        }).state('profile', {
            url: '/profile',
            templateUrl: 'components/profile/profile.tpl.html',
            controller: 'profileController as user'
        });

        jwtInterceptorProvider.tokenGetter = function(store) {
            return store.get('id_token');
        }

        function redirect($q, $injector, $timeout, store, $location) {
            var auth;

            $timeout(function() {
                auth = $injector.get('auth');
            });

            return {
                responseError: function(rejection) {

                    if (rejection.status === 401) {
                        auth.signout();
                        store.remove('profile');
                        store.remove('token');
                        $location.path('/home');
                    }
                    return $q.reject(rejection);
                }
            }
        }

        $provide.factory('redirect', redirect);

        $httpProvider.interceptors.push('jwtInterceptor');
        $httpProvider.interceptors.push('redirect');

    }).run(function($rootScope, auth, store, jwtHelper, $location) {
        $rootScope.$on('$locationChangeStart', function() {
            var token = store.get('id_token');

            if (token) {
                if (!jwtHelper.isTokenExpired(token)) {
                    if (!auth.isAuthenticated) {
                        auth.authenticate(store.get('profile'), token);
                    }
                }
            }
            if (!auth.isAuthenticated) {
                $location.path('/home');
            }
        });
    });
})();
