'use strict';

angular.module('app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'app.directives',
  'restangular',
  'cfp.hotkeys'
])
  .config(['RestangularProvider', function (RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.setRestangularFields({
      id: "_id",
      route: "restangularRoute",
      selfLink: "self.href"
    });
  }])
  .config(function (hotkeysProvider) {
    hotkeysProvider.includeCheatSheet = true;
  })
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    })
  })
  .controller('AppCtrl', [
  '$scope', '$location',
  function($scope, $location){

    $scope.isSpecificPage = function(){
      var path = $location.path()
      // return _.contains( [
      //   '/404',
      //   '/pages/500',
      //   '/pages/login',
      //   '/pages/signin',
      //   '/pages/signin1',
      //   '/pages/signin2',
      //   '/pages/signup',
      //   '/pages/signup1',
      //   '/pages/signup2',
      //   '/pages/forgot',
      //   '/pages/lock-screen'
      // ], path )
    }
    $scope.main ={

      brand: 'Square',
      name: 'Lisa Doe'// # those which uses i18n can not be replaced for now.
    }
  }])

  .controller('NavCtrl', [
    '$scope', 'filterFilter',
    function ($scope, filterFilter){

      // # init
      // var tasks = $scope.tasks = taskStorage.get()
      // $scope.taskRemainingCount = filterFilter(tasks, {completed: false}).length

      // $scope.$on('taskRemaining:changed', function(event, count){
      //   $scope.taskRemainingCount = count
      // })
    }])


