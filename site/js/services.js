'use strict';

/* Services */


angular.module('myApp.services', [])
.factory('Auth', ['Restangular', '$localStorage', '$q', function(Restangular, $localStorage, $q){
	
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
		logging_in: $q.defer(),
		checking_hash: $q.defer(),

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
			_self.logging_in = Restangular.all('users').login(user);
			_self.logging_in.then(function(user){
				user.role = _self.getRoleForMask(user.role.bit);
				changeUser(user);
			});
			return _self.logging_in;
		},

		loginFromHash: function(hash, success, error){
			Restangular.all('users').customGET('checklogin', {}, {'User-Hash': hash})
			.then(
				function(user){
					user.role = _self.getRoleForMask(user.role.bit);
					changeUser(user);
					_self.checking_hash.resolve(user);
				}, function(err){
					_self.checking_hash.reject(err);
				}, function(msg){
					_self.checking_hash.notify(err);
				}
			);
			
			return _self.checking_hash.promise;
		},

		logout: function(success, error){
			var logged_out = currentUser.logout();
			logged_out.then(function(){
				changeUser(defaultUser);
				delete $localStorage.user_hash;
				_self.logging_in = $q.defer();
				_self.checking_hash = $q.defer();
			});

			return logged_out;
		}
	};

	return _self;
}])
.factory('socket', ['$rootScope', '$window', function($rootScope, $window) {

	// Setup socket.io as normal
	var addr = 'http://'+$window.location.hostname+':773';
	var socket = io(addr,{
		'sync disconnect on unload': true,
		'reconnectionAttempts': 5
	});

	/*
	 *	Create scoped objects which correspond to controllers scopes
	 *	this allows us to easily remove events for a controllers scope when it gets destroyed
	*/
	var scopes = {};
	function Scope(id){
		this.id = id;
		this.events = {};
		scopes[id] = this;
	}
	Scope.prototype.on = function(e, handler){
		if(this.events[e] == undefined){
			this.events[e] = [];
		}
		var wrapped_handler = wrapHandler(handler); 
		this.events[e].push(wrapped_handler);
		addListener(e, wrapped_handler);
		return this;
	}
	Scope.prototype.clear = function(){
		// loop through all of our events and removeListener
		var keys = Object.keys(this.events);
		for(var i=0; i<keys.length; ++i){
			var e = keys[i],
				handlers = this.events[e];
		    
		    for(var j=0; j<handlers.length; ++j){
		    	socket.removeListener(e, handlers[j]);
		    }
		}
	}

	/*
	 *	Since we can remove things now we have to be able to have a reference to the actual function
	 *	since we have to use $rootScope.apply to bring the functions into "Angular Land" we can't just
	 *	use the bare handler, so this function will wrap the supplied handler with the proper Angular
	 *	code and return that function, which can be stored and used with removeListener
	*/
	function wrapHandler(handler){
		return function() {
			var args = arguments;
			$rootScope.$apply(function() {
				handler.apply(null, args);
			});
		}
	}

	/*
	 *	This actually adds the event listener to the socket. Make sure the handler has already been
	 *	wraped using the wrapHandler() function above
	*/
	function addListener(e, wrapped_handler){
		socket.on(e, wrapped_handler);
	}


	/*
	 *	Go between object which actually gets returned
	*/
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
			addListener(e, wrapHandler(handler));
			return this;
		},

		addScope: function(id){
			var scope  = glue.getScope(id);
			if(scope == false){
				scope = new Scope(id);
			}
			return scope;
		},

		getScope: function(id){
			if(scopes[id]){
				return scopes[id];
			} else {
				return false;
			}
		}
	};

	return glue;
}]);