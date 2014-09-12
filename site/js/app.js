'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
	'ajoslin.promise-tracker',
	'angularSpinner',
	'ui.router',
	'ui.bootstrap',
	'restangular',
	'ngOrderObjectBy',
	'angular-flare',
	'slick',
	'ngStorage',
	'ngSanitize',
	'myApp.filters',
	'myApp.services',
	'myApp.directives',
	'myApp.controllers'
])
.factory('points', function(){
	var points = [100, 90, 85],
		start = 84,
		end = 1;

	for(var i = start; i >= end; i--){
		points.push(i);
	}

	return points;
})
.config([
	'$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'RestangularProvider', 
	function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, RestangularProvider){

		/*
		 *	State Based Routing with Access Levels
		*/
		var access = routingConfig.accessLevels;

		// Public routes
		$stateProvider
			.state('public', {
				abstract: true,
				template: "<ui-view/>",
				data:{
					access: access.public
				}
			})
			.state('public.tournament', {
				url: '/',
				templateUrl: 'partials/tournament.html',
				controller: 'TournamentCtrl'
			});

		// Anonymous Routes
		$stateProvider
			.state('anon', {
				abstract: true,
				template: "<ui-view/>",
				data: {
					access: access.anon
				}
			})
			.state('anon.login', {
				url: '/login',
				templateUrl: 'partials/login.html',
				controller: 'LoginCtrl'
			});

		// User Routes
		$stateProvider
			.state('user', {
				abstract: true,
				templateUrl: 'partials/admin.html',
				data:{
					access: access.user
				}
			})
			.state('user.score', {
				url: '/user/score',
				templateUrl: 'partials/user/score.html',
				controller: 'ScoreCtrl'
			})

		// Admin Routes
		$stateProvider
			.state('admin', {
				abstract: true,
				templateUrl: 'partials/admin.html',
				controller: 'AdminUserLoginOutMsgCtrl',
				data: {
					access: access.admin
				}
			})
			.state('admin.tournaments', {
				url: '/tournaments',
				templateUrl: 'partials/admin/tournaments.html',
				controller: 'AdminTournamentsCtrl'
			})
			.state('admin.machines', {
				url: '/machines',
				templateUrl: 'partials/admin/machines.html',
				controller: 'AdminMachinesCtrl'
			})
			.state('admin.players', {
				url: '/players',
				templateUrl: 'partials/admin/players.html',
				controller: 'AdminPlayersCtrl'
			})
			.state('admin.scores', {
				url: '/scores',
				templateUrl: 'partials/admin/scores.html',
				controller: 'AdminScoresCtrl'
			})
			.state('admin.users', {
				url: '/users',
				templateUrl: 'partials/admin/users.html',
				controller: 'AdminUsersCtrl'				
			});

		// if no path, go to 404
		$urlRouterProvider.otherwise('/');

		// FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
		// without this /path is different from /path/
		$urlRouterProvider.rule(function($injector, $location) {
			if($location.protocol() === 'file')
				return;

			var path = $location.path()
				// Note: misnomer. This returns a query object, not a search string
				, search = $location.search()
				, params
				;

				// check to see if the path already ends in '/'
				if (path[path.length - 1] === '/') {
					return;
				}

				// If there was no search string / query params, return with a `/`
				if (Object.keys(search).length === 0) {
					return path + '/';
				}

				// Otherwise build the search string and return a `/?` prefix
				params = [];
				angular.forEach(search, function(v, k){
					params.push(k + '=' + v);
				});
				return path + '/?' + params.join('&');
		});

		// $locationProvider.html5Mode(true);

		// if we get back a 401 or 403 status go to login
		$httpProvider.interceptors.push(function($q, $location) {
			return {
				'responseError': function(response) {
					if(response.status === 401 || response.status === 403) {
						$location.path('/login');
						return $q.reject(response);
					} else {
						return $q.reject(response);
					}
				}
			}
		});


		RestangularProvider.setBaseUrl('/api');

		RestangularProvider.addRequestInterceptor(function(element, operation, what, url){
			// if its a user that is being created or updated then we need to change tournament to just the ids
			if(
				what == 'players'
				&& (operation == 'post' || operation == 'put')
			){
				element.tournaments = _.pluck(element.tournaments, 'id');
				return element;
			} else {
				return element;
			}
		});

		RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response) {
			var hash = response.headers('User-Hash');
			RestangularProvider.setDefaultHeaders({'User-Hash': hash});
			$httpProvider.defaults.headers.common['User-Hash'] = hash;

			// ditch everything minus the data
			return data.data;
		});

		// if the element has machines[0].scores convert scores.score to an actual object
		// that's because 32bit php sucks balls for int conversion and that's what the dev is
		RestangularProvider.addElementTransformer('tournaments', false, function(el){
			if(el.machines != undefined && el.machines.length > 0 && el.machines[0].scores != undefined){
				angular.forEach(el.machines, function(m){
					angular.forEach(m.scores, function(s){
						s.score = Number(s.score);
					});
				});
			}

			return el;
		});

		RestangularProvider.addElementTransformer('scores', false, function(el){
			el.score = Number(el.score);
			return el;
		});

		RestangularProvider.addElementTransformer('users', function(user) {
			// This will add a method called login that will do a POST to the path login
			// signature is (name, operation, path, params, headers, elementToPost)
			if(user.addRestangularMethod != undefined){
				user.addRestangularMethod('login', 'post', 'login');
				user.addRestangularMethod('logout', 'post', 'logout');
				user.addRestangularMethod('checkLogin', 'get', 'checklogin');
			}
			return user;
		});

	}
])
.run([
'$rootScope', '$state', 'Auth', '$location', 'flare', '$localStorage', 'Restangular', '$http',
 function ($rootScope, $state, Auth, $location, flare, $localStorage, Restangular, $http) {

 	if( $localStorage.user_hash != undefined ){
 		Auth.loginFromHash($localStorage.user_hash,
 			function(user){
 				$http.defaults.headers.common['User-Hash'] = $localStorage.user_hash;
 				Restangular.setDefaultHeaders({'User-Hash': $localStorage.user_hash});
 			}, function(){}
 		);
 	}

 	Restangular.addResponseInterceptor(function(data, operation, what, url, response) {
 		var hash = response.headers('User-Hash');
 		if(hash){
 			var hash = response.headers('User-Hash');
 			$localStorage.user_hash = hash;
 		}
 		return data;
	});

	var locationSearch = null;
	/*
	 *	Checks that the Auth User has the proper access to view the new "route"
	*/
	$rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
		//save location.search so we can add it back after transition is done
		locationSearch = $location.search();

		if (!Auth.authorize(toState.data.access)) {
			flare.error("Seems like you tried accessing a route you don't have access to...", 3000);
			event.preventDefault();

			if(Auth.isLoggedIn()){
				$state.go('user.home');
			} else {
				$state.go('anon.login');
			}
		}
	});

	$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		//restore all query string parameters back to $location.search
		$location.search(locationSearch);
	});


	// toggle main-menu when click is triggered
	$(document).on('click', '#main-menu a', function(){
		$('body').toggleClass('mme');
	});

	$('#main-navbar').on('click', 'a:not(.dropdown-toggle)', function(){
		$('.in,.open').removeClass('in open');
		// $(this).closest(".dropdown-menu").prev().dropdown("toggle");
	});


}]);
