'use strict';

/* Services */


angular.module('myApp.services', [])
.factory('Auth', ['Restangular', '$localStorage', function(Restangular, $localStorage){
	
	var accessLevels = routingConfig.accessLevels,
		userRoles = routingConfig.userRoles,
		defaultUser = { 
			role: userRoles.public,
			logged_in: false
		},
		currentUser = angular.copy(defaultUser);

	// removed the cookie part
	// eventually do something with angularLocalStorage module
	// $cookieStore.remove('user');

	function changeUser(user, force){
		if(force === true)
			currentUser = user;
		else
			angular.extend(currentUser, user);

		_self.user = currentUser;
	}
	
	var _self = {
		user: currentUser,
		userRoles: userRoles,
		accessLevels: accessLevels,

		/*
		 *	Check if the user has the specified access
		 *	accessLevel and role is set in js/routingConfig.js
		*/
		authorize: function(accessLevel, role) {
			if(role === undefined)
				role = currentUser.role;

			return accessLevel.bitMask & role.bitMask;
		},
		isLoggedIn: function(user) {
			if(user === undefined)
				user = currentUser;
			return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
		},
		getRoleForMask: function(mask){
			for(var i in userRoles){
				if(userRoles[i].bitMask == mask)
					return userRoles[i];
			}
			return userRoles.public;
		},
		/*
		register: function(user, success, error) {
			$http.post('/register', user).success(function(res) {
				changeUser(res);
				success();
			}).error(error);
		},
		*/
		login: function(user, success, error) {
			Restangular.all('users').login(user)
			.then(
				function(user){
					user.role = _self.getRoleForMask(user.role.bit);
					changeUser(user);
					success(user);
				}, error
			);
		},

		loginFromHash: function(hash, success, error){
			Restangular.all('users').customGET('checklogin', {}, {'User-Hash': hash})
			.then(
				function(user){
					user.role = _self.getRoleForMask(user.role.bit);
					changeUser(user);
					success(user);
				}, error
			);
		},

		logout: function(success, error){
			currentUser.logout().then(
				function(){
					changeUser(defaultUser);
					delete $localStorage.user_hash;
					success();
				}, error
			);
		}
	};

	return _self;
}])
.factory('socket', ['$rootScope', '$window', function($rootScope, $window) {
	var addr = 'http://'+$window.location.hostname+':835';
	var socket = io(addr,{
		'sync disconnect on unload': true,
		'reconnectionAttempts': 5
	});

	var glue = {
		emit: function() {
			var args = Array.prototype.slice.call(arguments);
			if(args.length<=0)
				return;
			var responseHandler = args[args.length-1];
			if(angular.isFunction(responseHandler)) {
				args[args.length-1] = function() {
					var args = arguments;
					$rootScope.$apply(function() {
						responseHandler.apply(null, args);
					});
				}
			}
			socket.emit.apply(socket, args);
			return this;
		},

		on: function(e, handler) {
			socket.on(e, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					handler.apply(null, args);
				});
			});
			return this;
		}
	};

	return glue;
}]);