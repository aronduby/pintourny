'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('TournamentCtrl', 
['$scope', '$http', '$filter', 'Restangular', 'points', 'socket', 'flare', 'promiseTracker',
function($scope, $http, $filter, Restangular, points, socket, flare, promiseTracker){
	
	$scope.points = points;
	
	$scope.listTracker = promiseTracker();
	$scope.tournamentTracker = promiseTracker();

	var tournaments_promise = Restangular.all('tournaments').getList()
	.then(function(tournaments){
		$scope.tournaments = tournaments;
		if(tournaments.length)
			loadTournament(tournaments[0].id);
	});
	$scope.tournamentTracker.addPromise(tournaments_promise);
	$scope.listTracker.addPromise(tournaments_promise);

	$scope.current_index = 0;

	$scope.breakpoints = [
	  {
	    breakpoint: 1400,
	    settings: {
	      slidesToShow: 3,
	      slidesToScroll: 3
	    }
	  }, {
	  	breakpoint: 1150,
	  	settings: {
	  		slidesToShow: 2,
	  		slidesToScroll: 2
	  	}
	  }, {
	    breakpoint: 900,
	    settings: {
	      slidesToShow: 1,
	      slidesToScroll: 1
	    }
	  }
	];

	socket
		.on('score.new', function(data){
			updateScore(data);
		})
		.on('score.update', function(data){
			updateScore(data);
		})
		.on('score.delete', function(data){
			// check for the machine in the current tournament
			// if its there, splice and update totals
			// otherwise do nothing
			var midx = _.findIndex($scope.current_tournament.machines, {id: data.machine_id});
			if(midx >= 0){
				var machine = $scope.current_tournament.machines[midx],
					sidx = _.findIndex(machine.scores, {id: data.id});

				machine.scores.splice(sidx, 1);
				$scope.updateTotals();
			}
		});

	socket.on('reconnect', function(){
		loadTournament($scope.current_tournament.id);
	});


	var updateScore = function(data){
		var msg = data.player.first_name + ' ' + data.player.last_name + ' just scored ' + $filter('number')(data.score, 0) + ' on ' + data.machine.title;
		flare.info(msg, 5000);

		// see if the machine id is in the current tournament
		for(var i = 0 in $scope.current_tournament.machines){
			var machine = $scope.current_tournament.machines[i];

			if(machine.id == data.machine_id){				
				var score = null;
				for(var j = 0 in machine.scores){
					var s = machine.scores[j];

					if(s.player_id == data.player_id){
						score = s;
						break;
					}
				}

				if(score == null){
					score = {
						id: data.id,
						player_id: data.player_id,
						player: data.player,
						machine_id: data.machine_id,
						score: 0
					};
					machine.scores.push(score);
					j++;
				}
				score.score = Number(data.score);
				$scope.updateTotals();

				break;
			}
		}
	}

	$scope.jumpToMachine = function(machine, index){
		if(machine.tournament_id != $scope.current_tournament.id){
			loadTournament(machine.tournament_id)
			.then(function(){
				$scope.current_index = index;
			})
		} else {
			$scope.current_index = index;
			$scope.highlight_nav = index;
		}
	}

	var loadTournament = function(tournament_id){
		var promise = Restangular.one('tournaments', tournament_id).get()
		.then(function(d){
			$scope.current_tournament = d;
			$scope.current_tournament.totals = {};
			$scope.current_machine = $scope.current_tournament.machines[0];
			$scope.updateTotals();
			$scope.current_index = 0;
		});

		$scope.tournamentTracker.addPromise(promise);
		return promise;
	};

	$scope.updateTotals = function(){
		$scope.current_tournament.totals = {};
		angular.forEach($scope.current_tournament.machines, function(machine) {
			var i = 0;
			angular.forEach($filter('orderBy')(machine.scores, 'score', true), function(score){
				if($scope.current_tournament.totals[score.player_id] == undefined){
					$scope.current_tournament.totals[score.player_id] = {
						player_id: score.player_id,
						first_name: score.player.first_name,
						last_name: score.player.last_name,
						points: 0
					};
				}

				$scope.current_tournament.totals[score.player_id].points += points[i];
				i++;
			});
		});
	}

}])



.controller('NavCtrl', ['$rootScope', '$scope', '$state', 'Auth', 'flare', function($rootScope, $scope, $state, Auth, flare) {
	$scope.user = Auth.user;
	$scope.userRoles = Auth.userRoles;
	$scope.accessLevels = Auth.accessLevels;

	$scope.logout = function() {
		Auth.logout(function() {
			$scope.user = Auth.user;
			$state.go('anon.login');
			
		}, function(err) {
			console.log(err);
			flare.error("Failed to logout: "+err.msg);
		});
	};
}])

.controller('SocketStatusCtrl', ['$scope', 'socket', 'flare', '$timeout', function($scope, socket, flare, $timeout){
	
	$scope.status = false;
	$scope.msg = false;
	$scope.current_attempt = 0;
	$scope.reconnection_attempts = 5; // match socket setting in services
	$scope.spin_options = {
		lines: 7,
		length: 2,
		width: 4,
		radius: 4,
		corners: .9,
		color: '#fff'
	};

	socket
		.on('disconnect', function(){
			$scope.status = 'reconnecting';
			$scope.msg = 'You\'ve gotten disconnected, we\'re attempting to reconnect you';
		})
		.on('reconnect', function(attempt_number){
			$scope.status = 'reconnected';
			$scope.msg = 'Reconected, but we\'re grabbing fresh data to make sure your up to date';
			$scope.attempt_number = 0;
			$timeout(function(){
				$scope.status = false;
				$scope.msg = false;
			}, 5000);
		})
		.on('reconnecting', function(attempt_number){
			$scope.current_attempt = attempt_number;
		})
		.on('reconnect_failed', function(){
			$scope.status = 'disconnected';
			$scope.msg = 'Reconnection failed! This data will be out of date. Please refresh the page to try again';
		});
}])

/*
 *	Used to go between the views and the AuthService
*/
.controller('LoginCtrl', ['$rootScope', '$scope', 'Auth', '$state', 'flare',  function($rootScope, $scope, Auth, $state, flare){
	$scope.user = Auth.user;
	$scope.userRoles = Auth.userRoles;
	$scope.accessLevels = Auth.accessLevels;

	$scope.login_status = false;
	$scope.username = '';
	$scope.password = '';

	$scope.login = function() {
		$scope.login_status = 'loading';
		Auth.login(
			{
				username: $scope.username,
				password: $scope.password
			},
			function(u){
				$scope.login_status = true;
				$scope.user = u;

				flare.success('Success! Lets play some pinball!', 5000);

				if(u.role.title == 'admin'){
					$state.go('admin.tournaments');
				} else {
					$state.go('user.score');
				}				
			},
			function(err){
				$scope.login_status = false;
				var msg = '';
				switch(err.status){
					case 403:
						msg = "Looks like you're not authorized to use the system.";
						break;
					default:
						msg = "Server said: '"+err.data.error+"'";
				}
				flare.error(msg, 10000);
			}
		);
	}
}])

.controller('ScoreCtrl', ['$scope', '$modal', 'Restangular', 'flare', 'promiseTracker', 'socket', function($scope, $modal, Restangular, flare, promiseTracker, socket){
	
	$scope.initTracker = promiseTracker();
	$scope.saving = promiseTracker();

	var scoring = Restangular.all('scores');
	$scope.score = {};
	$scope.player_machines = [];

	// load players
	$scope.initTracker.addPromise(
		Restangular.all('players').getList()
		.then(function(players){
			$scope.players = players;
			return true;
		}, console.error)
	);

	// load machines
	$scope.initTracker.addPromise(
		Restangular.all('machines').getList()
		.then(function(machines){
			$scope.machines = machines;
			return true;
		}, console.error)
	);

	// when the player changes update what machines are available
	$scope.$watch('score.player', function(newVal, oldVal){
		if(newVal !== undefined && newVal.tournaments !== undefined){
			var tids = _.pluck(newVal.tournaments, 'id');	
			$scope.player_machines =  _.filter($scope.machines, function(machine){
				var i = _.indexOf(tids, machine.tournament_id);
				return i >= 0;
			});
		}
	});

	// handle player changes
	socket
		.on('player.new', function(data){
			$scope.players.push( Restangular.restangularizeElement('', data, 'players') );
		})
		.on('player.update', function(data){
			var pidx = _.findIndex($scope.players, {id: data.id});
			$scope.players[pidx] = data;
		})
		.on('player.delete', function(data){
			var pidx = _.findIndex($scope.players, {id: data.id});
			$scope.players.splice(pidx, 1);
		});

	$scope.confirm = function(){
		var confirm = $modal.open({
			templateUrl: 'partials/user/modals/confirm-score.html',
			controller: ConfirmScoreModalCtrl,
			resolve: {
				score: function(){ return $scope.score },
				scoring: function(){ return scoring; },
				flare: function(){ return flare; },
				promiseTracker: function(){ return promiseTracker; }
			}
		});

		confirm.result
		.then(function(saved){
			if(saved == true)
				$scope.score = {};
		});
	};

	$scope.cancel = function(){
		$scope.score = {};
	}
}])

.controller('AdminUserLoginOutMsgCtrl', ['$scope', 'flare', 'socket', function($scope, flare, socket){
	
	socket
		.on('user.login', function(data){
			flare.warn(data.username + ' logged in', 3000);
		})
		.on('user.logout', function(data){
			flare.warn(data.username + ' logged out', 3000);
		});
}])

.controller('AdminTournamentsCtrl', ['$scope', '$modal', 'Restangular', 'flare', 'promiseTracker', function($scope, $modal, Restangular, flare, promiseTracker){
	
	$scope.tournamentTracker = promiseTracker();

	var promise = Restangular.all('tournaments').getList()
	.then(function(tournaments){
		$scope.tournaments = tournaments;
		return true;
	}, console.error);
	$scope.tournamentTracker.addPromise(promise);


	$scope.add = function(){
		var t = Restangular.restangularizeElement('', {}, 'tournaments');
		var add_window = $modal.open({
			templateUrl: 'partials/admin/modals/add-edit-tournament.html',
			controller: AdminTournamentAddEditCtrl,
			resolve: {
				title: function(){ return 'Add Tournament'; },
				tournament: function(){ return t; },
				promiseTracker: function(){ return promiseTracker; },
				flare: function(){ return flare; }
			}
		});

		add_window.result.then(function(t){
			if(t != false)
				$scope.tournaments.push( t );	
		});
	};

	$scope.edit = function(tournament){
		var edit_window = $modal.open({
			templateUrl: 'partials/admin/modals/add-edit-tournament.html',
			controller: AdminTournamentAddEditCtrl,
			resolve: {
				title: function(){ return 'Edit Tournament'; },
				tournament: function(){ return tournament; },
				promiseTracker: function(){ return promiseTracker; },
				flare: function(){ return flare; }
			}
		});
	};

	$scope.delete = function(tournament){
		var confirm = $modal.open({
			templateUrl: 'partials/modals/confirm.html',
			controller: ConfirmModalCtrl,
			resolve: {
				title: function(){ return 'Are you sure you want to delete the <strong>'+tournament.title+'</strong> Tournament?'; }
			}
		});

		confirm.result
		.then(function(d){
			// something else requires lodash, so might as well use it
			var i = _.findIndex($scope.tournaments, {id: tournament.id});
			$scope.tournaments.splice(i, 1);
			tournament.remove();
			flare.success('Removed '+tournament.title, 3000);
		});
	};
}])

.controller('AdminMachinesCtrl', ['$scope', '$modal', 'Restangular', 'flare', 'promiseTracker', function($scope, $modal, Restangular, flare, promiseTracker){
	
	$scope.machineTracker = promiseTracker();

	var promise = Restangular.all('machines').getList()
	.then(function(machines){
		$scope.machines = machines;
		return true;
	}, console.error);
	$scope.machineTracker.addPromise(promise);


	var tournament_promise = Restangular.all('tournaments').getList()
	.then(function(tournaments){
		$scope.tournaments = tournaments;
		return true;
	}, console.error);
	$scope.machineTracker.addPromise( tournament_promise );

	$scope.add = function(){
		var m = Restangular.restangularizeElement('', {}, 'machines');
		var add_window = $modal.open({
			templateUrl: 'partials/admin/modals/add-edit-machine.html',
			controller: AdminMachineAddEditCtrl,
			resolve: {
				title: function(){ return 'Add Machine'; },
				machine: function(){ return m; },
				tournaments: function(){ return $scope.tournaments },
				promiseTracker: function(){ return promiseTracker; },
				flare: function(){ return flare; }
			}
		});

		add_window.result.then(function(m){
			if(m != false)
				$scope.machines.push( m );	
		});
	};

	$scope.edit = function(machine){
		var edit_window = $modal.open({
			templateUrl: 'partials/admin/modals/add-edit-machine.html',
			controller: AdminMachineAddEditCtrl,
			resolve: {
				title: function(){ return 'Edit Machine'; },
				machine: function(){ return machine; },
				tournaments: function(){ return $scope.tournaments },
				promiseTracker: function(){ return promiseTracker; },
				flare: function(){ return flare; }
			}
		});
	};

	$scope.delete = function(machine){
		var confirm = $modal.open({
			templateUrl: 'partials/modals/confirm.html',
			controller: ConfirmModalCtrl,
			resolve: {
				title: function(){ return 'Are you sure you want to delete <strong>'+machine.title+'</strong>?'; }
			}
		});

		confirm.result
		.then(function(d){
			// something else requires lodash, so might as well use it
			var i = _.findIndex($scope.machines, {id: machine.id});
			$scope.machines.splice(i, 1);
			machine.remove();
			flare.success('Removed '+machine.title, 3000);
		});
	};
}])

.controller('AdminPlayersCtrl', ['$scope', '$modal', 'Restangular', 'flare', 'promiseTracker', function($scope, $modal, Restangular, flare, promiseTracker){
	
	$scope.playerTracker = promiseTracker();

	var promise = Restangular.all('players').getList()
	.then(function(players){
		$scope.players = players;
		return true;
	}, console.error);
	$scope.playerTracker.addPromise(promise);


	var tournament_promise = Restangular.all('tournaments').getList()
	.then(function(tournaments){
		$scope.tournaments = tournaments;
		return true;
	}, console.error);
	$scope.playerTracker.addPromise( tournament_promise );

	$scope.add = function(){
		var p = Restangular.restangularizeElement('', {}, 'players');
		var add_window = $modal.open({
			templateUrl: 'partials/admin/modals/add-edit-player.html',
			controller: AdminPlayerAddEditCtrl,
			resolve: {
				title: function(){ return 'Add Player'; },
				player: function(){ return p; },
				tournaments: function(){ return $scope.tournaments },
				promiseTracker: function(){ return promiseTracker; },
				flare: function(){ return flare; }
			}
		});

		add_window.result.then(function(p){
			if(p != false)
				$scope.players.push( p );	
		});
	};

	$scope.edit = function(player){
		var edit_window = $modal.open({
			templateUrl: 'partials/admin/modals/add-edit-player.html',
			controller: AdminPlayerAddEditCtrl,
			resolve: {
				title: function(){ return 'Edit Machine'; },
				player: function(){ return player; },
				tournaments: function(){ return $scope.tournaments },
				promiseTracker: function(){ return promiseTracker; },
				flare: function(){ return flare; }
			}
		});
	};

	$scope.delete = function(player){
		var confirm = $modal.open({
			templateUrl: 'partials/modals/confirm.html',
			controller: ConfirmModalCtrl,
			resolve: {
				title: function(){ return 'Are you sure you want to delete <strong>'+player.first_name+' '+player.last_name+'</strong>?'; }
			}
		});

		confirm.result
		.then(function(d){
			// something else requires lodash, so might as well use it
			var i = _.findIndex($scope.players, {id: player.id});
			$scope.players.splice(i, 1);
			player.remove();
			flare.success('Removed '+player.first_name+' '+player.last_name, 3000);
		});
	};
}])

.controller('AdminScoresCtrl', ['$scope', '$modal', 'Restangular', 'flare', 'promiseTracker', function($scope, $modal, Restangular, flare, promiseTracker){
	
	$scope.scoreTracker = promiseTracker();

	var promise = Restangular.all('scores').getList()
	.then(function(scores){
		$scope.scores = scores;
		return true;
	}, console.error);
	$scope.scoreTracker.addPromise(promise);


	var machinesTracker = Restangular.all('machines').getList()
	.then(function(machines){
		$scope.machines = machines;
		return true;
	}, console.error);
	$scope.scoreTracker.addPromise( machinesTracker );

	var playersTracker = Restangular.all('players').getList()
	.then(function(players){
		$scope.players = players;
		return true;
	}, console.error);
	$scope.scoreTracker.addPromise( playersTracker );

	$scope.add = function(){
		var s = Restangular.restangularizeElement('', {}, 'scores');
		var add_window = $modal.open({
			templateUrl: 'partials/admin/modals/add-edit-score.html',
			controller: AdminScoreAddEditCtrl,
			resolve: {
				title: function(){ return 'Add Score'; },
				score: function(){ return s; },
				machines: function(){ return $scope.machines },
				players: function(){ return $scope.players },
				promiseTracker: function(){ return promiseTracker; },
				flare: function(){ return flare; }
			}
		});

		add_window.result.then(function(s){
			if(s !== false){
				// check to see if the score already exists
				var i = _.findIndex($scope.scores, {id: s.id});
				if(i >= 0){
					$scope.scores[i] = s;
					flare.info('Updated already existing score', 3000);
				} else {
					$scope.scores.push( s );
				}
			}
		});
	};

	$scope.edit = function(score){
		var edit_window = $modal.open({
			templateUrl: 'partials/admin/modals/add-edit-score.html',
			controller: AdminScoreAddEditCtrl,
			resolve: {
				title: function(){ return 'Edit Score'; },
				score: function(){ return score; },
				machines: function(){ return $scope.machines },
				players: function(){ return $scope.players },
				promiseTracker: function(){ return promiseTracker; },
				flare: function(){ return flare; }
			}
		});
	};

	$scope.delete = function(score){
		var confirm = $modal.open({
			templateUrl: 'partials/modals/confirm.html',
			controller: ConfirmModalCtrl,
			resolve: {
				title: function(){ return 'Are you sure you want to delete <strong>'+score.player.first_name+' '+score.player.last_name+'</strong>\'s score on <strong>'+score.machine.title+'</strong>?'; }
			}
		});

		confirm.result
		.then(function(d){
			// something else requires lodash, so might as well use it
			var i = _.findIndex($scope.scores, {id: score.id});
			$scope.scores.splice(i, 1);
			score.remove();
			flare.success('Removed '+score.player.first_name+' '+score.player.last_name+'\'s score on '+score.machine.title, 3000);
		});
	};
}])

.controller('AdminUsersCtrl', ['$scope', '$modal', 'Restangular', 'flare', 'promiseTracker', function($scope, $modal, Restangular, flare, promiseTracker){
	
	$scope.userTracker = promiseTracker();

	var promise = Restangular.all('users').getList()
	.then(function(users){
		$scope.users = users;
		return true;
	}, console.error);
	$scope.userTracker.addPromise(promise);


	var role_promise = Restangular.all('roles').getList()
	.then(function(roles){
		$scope.roles = roles;
		return true;
	}, console.error);
	$scope.userTracker.addPromise( role_promise );

	$scope.add = function(){
		var u = Restangular.restangularizeElement('', {}, 'users');
		var add_window = $modal.open({
			templateUrl: 'partials/admin/modals/add-edit-user.html',
			controller: AdminUserAddEditCtrl,
			resolve: {
				title: function(){ return 'Add User'; },
				user: function(){ return u; },
				roles: function(){ return $scope.roles },
				promiseTracker: function(){ return promiseTracker; },
				flare: function(){ return flare; }
			}
		});

		add_window.result.then(function(u){
			if(u != false)
				$scope.users.push( u );	
		});
	};

	$scope.edit = function(user){
		var edit_window = $modal.open({
			templateUrl: 'partials/admin/modals/add-edit-user.html',
			controller: AdminUserAddEditCtrl,
			resolve: {
				title: function(){ return 'Edit Machine'; },
				user: function(){ return user; },
				roles: function(){ return $scope.roles },
				promiseTracker: function(){ return promiseTracker; },
				flare: function(){ return flare; }
			}
		});
	};

	$scope.delete = function(user){
		var confirm = $modal.open({
			templateUrl: 'partials/modals/confirm.html',
			controller: ConfirmModalCtrl,
			resolve: {
				title: function(){ return 'Are you sure you want to delete <strong>'+user.username+'</strong>?'; }
			}
		});

		confirm.result
		.then(function(d){
			// something else requires lodash, so might as well use it
			var i = _.findIndex($scope.users, {id: user.id});
			$scope.users.splice(i, 1);
			user.remove();
			flare.success('Removed '+user.username, 3000);
		});
	};
}]);



var AdminUserAddEditCtrl = function($scope, $modalInstance, title, user, roles, promiseTracker, flare){
	
	$scope.title = title;
	$scope.user = user;
	$scope.roles = roles;
	$scope.saving = promiseTracker();
	
	$scope.cancel = function(){
		$modalInstance.close(false);
		return false;
	};

	$scope.save = function(){
		var i = _.findIndex($scope.roles, {id: $scope.user.role_id});
		$scope.user.role = $scope.roles[i];

		var promise = $scope.user.save();
		$scope.saving.addPromise(promise);
		promise.then(
			function(data){
				// force it to think the obj is from the server to force save to work properly when editing new elements
				$scope.user.id = data.id;
				$scope.user.fromServer = true;

				flare.success('User Saved', 3000);
				$modalInstance.close($scope.user);
			},
			function(err){
				console.error(err);
				flare.error('Save Failed ('+err.data._status+'): '+err.data.error);
			}
		);		
	}
}


var AdminScoreAddEditCtrl = function($scope, $modalInstance, title, score, machines, players, promiseTracker, flare){
	
	$scope.title = title;
	$scope.score = score;
	$scope.players = players;
	$scope.machines = machines;
	$scope.player_machines = [];

	$scope.saving = promiseTracker();

	$scope.$watch('score.player_id', function(newVal, oldVal){
		if(newVal != undefined){
			var player = _.find($scope.players, {id: newVal}),
				tids = _.pluck(player.tournaments, 'id');

			$scope.player_machines =  _.filter($scope.machines, function(machine){
				var i = _.indexOf(tids, machine.tournament_id);
				return i >= 0;
			});

		}
	});
	
	$scope.cancel = function(){
		$modalInstance.close(false);
		return false;
	};

	$scope.save = function(){
		var promise = $scope.score.save();
		$scope.saving.addPromise(promise);
		promise.then(
			function(data){
				// force it to think the obj is from the server to force save to work properly when editing new elements
				$scope.score.id = data.id;
				$scope.score.fromServer = true;

				$scope.score.player = _.find($scope.players, {id: data.player_id});
				$scope.score.machine = _.find($scope.machines, {id: data.machine_id});

				flare.success('Score Saved', 1000);
				$modalInstance.close($scope.score);
			},
			function(err){
				// server replies with 409 conflict if score is less than an existing score for that user
				if(err.status = 409){
					flare.warn(err.data.data+'. Maybe you need to edit the score?', 3000);
					$modalInstance.close(false);
				} else {
					flare.error('Save Failed ('+err.data._status+'): '+err.data.error);	
				}				
			}
		);		
	}
}

var AdminPlayerAddEditCtrl = function($scope, $modalInstance, title, player, tournaments, promiseTracker, flare){
	
	$scope.title = title;
	$scope.player = player;
	$scope.tournaments = tournaments;
	$scope.saving = promiseTracker();
	
	$scope.cancel = function(){
		$modalInstance.close(false);
		return false;
	};

	$scope.save = function(){
		var promise = $scope.player.save();
		$scope.saving.addPromise(promise);
		promise.then(
			function(data){
				// force it to think the obj is from the server to force save to work properly when editing new elements
				$scope.player.id = data.id;
				$scope.player.fromServer = true;

				flare.success('Player Saved', 3000);
				$modalInstance.close($scope.player);
			},
			function(err){
				console.error(err);
				flare.error('Save Failed ('+err.data._status+'): '+err.data.error);
			}
		);		
	}
}

var AdminMachineAddEditCtrl = function($scope, $modalInstance, title, machine, tournaments, promiseTracker, flare){
	
	$scope.title = title;
	$scope.machine = machine;
	$scope.tournaments = tournaments;
	$scope.saving = promiseTracker();
	
	$scope.cancel = function(){
		$modalInstance.close(false);
		return false;
	};

	$scope.save = function(){
		var i = 0,
			selected = false;

		angular.forEach($scope.tournaments, function(t){
			if(t.id == $scope.machine.tournament_id)
				selected = i;
			
			i++;
		});
		$scope.machine.tournament = $scope.tournaments[selected];

		var promise = $scope.machine.save();
		$scope.saving.addPromise(promise);
		promise.then(function(data){
			// force it to think the obj is from the server to force save to work properly when editing new elements
			$scope.machine.id = data.id;
			$scope.machine.fromServer = true;

			flare.success('Machine Saved', 3000);
			$modalInstance.close($scope.machine);
		}, function(err){
			console.error(err);
			flare.error('Save Failed ('+err.data._status+'): '+err.data.error);
		});		
	}
}

var AdminTournamentAddEditCtrl = function($scope, $modalInstance, title, tournament, promiseTracker, flare){
	
	$scope.title = title;
	$scope.tournament = tournament;
	$scope.saving = promiseTracker();
	
	$scope.cancel = function(){
		$modalInstance.close(false);
		return false;
	};

	$scope.save = function(){
		var promise = $scope.tournament.save();
		$scope.saving.addPromise(promise);
		promise.then(function(data){
				// force it to think the obj is from the server to force save to work properly when editing new elements
				$scope.tournament.id = data.id;
				$scope.tournament.fromServer = true;

				flare.success('Tournament Saved', 3000);
				$modalInstance.close($scope.tournament);
			},
			function(err){
				console.error(err);
				flare.error('Save Failed ('+err.data._status+'): '+err.data.error);
			}
		);		
	}
}




/*	Usage:
	var confirmInstance = $modal.open({
		templateUrl: 'partials/modals/confirm.html',
		controller: ConfirmModalCtrl,
		resolve: {
			title: function () { return 'Did '+$scope.game.stats[sprint_by].first_name+' win the sprint?'; },
		}
	});

	confirmInstance.result
		.then(function (result) {
			game.sprint(sprint_by, result);
			$location.path('/game/'+game.game_id+'/inplay');
		});
*/
var ConfirmModalCtrl = function ($scope, $modalInstance, title) {
	$scope.title = title;

	$scope.confirm = function(){
		$modalInstance.close(true);
	};

	$scope.cancel = function(){
		$modalInstance.close(false);
	};

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
};

var ConfirmScoreModalCtrl = function ($scope, $modalInstance, score, scoring, flare, promiseTracker) {
	$scope.score = score;
	$scope.saving = promiseTracker();

	$scope.confirm = function(){
		var obj = {
			player_id: $scope.score.player.id,
			machine_id: $scope.score.machine.id,
			score: $scope.score.score
		};

		var promise = scoring.post(obj)
		.then(
			function(data){
				flare.success('Score Saved', 3000);
				$scope.score = {};
				$modalInstance.close(true);
			},
			function(err){
				// server replies with 409 conflict if score is less than an existing score for that user
				if(err.status = 409){
					flare.warn(err.data.data+'. Score not saved.', 5000);
					$modalInstance.close(true);
				} else {
					flare.error('Save Failed ('+err.data._status+'): '+err.data.error);	
					$modalInstance.close(false);
				}
			}
		);
		$scope.saving.addPromise(promise);
	};

	$scope.cancel = function(){
		$modalInstance.close(false);
	};
};





var AddUserModalCtrl = function ($scope, $modalInstance, type, allowedDomains, promiseTracker, Restangular) {
	$scope.type = type;
	$scope.allowedDomains = allowedDomains;
	$scope.defaultPermissions = [];
	// $scope.facebookFriends = [];
	$scope.friendsTracker = promiseTracker();
	$scope.saving = promiseTracker();
	$scope.msg = "You've been granted access to the Shortener! Click this message to start making nice links.";

	$scope.newUsers = [];

	var fql = "SELECT uid, name, is_app_user, pic_square FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())";
	$scope.friendsTracker.addPromise(
		facebook.api('/fql', {q: fql})
		.then(function(d){
			$scope.facebookFriends = d.data;
		}, function(err){
			console.log(err);
			$rootScope.error = err.msg;
		})
	);
	
	$scope.selectFriend = function($item, $model, $label){
		var nu = angular.copy($item),
			full = nu.name.split(' ');

		nu.first_name = full.shift(),
		nu.last_name = full.join(' ');

		nu.permissions = angular.copy($scope.defaultPermissions);
		nu.facebook_id = nu.uid;

		$scope.newUsers.push(nu);
		// remove the user from the facebook friends array (found using lodash)
		var index = _.findIndex($scope.facebookFriends, {'uid': $item.uid});
		$scope.facebookFriends.splice(index, 1);
		// clear the selection
		// $scope wasn't working, presummably because its in the directive scope
		// $scope.selected = undefined;
		this.selected = undefined;
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	};

	$scope.removeNewUser = function(user){
		var index = _.findIndex($scope.newUsers, {'uid': user.uid});
		$scope.newUsers.splice(index, 1);
		$scope.facebookFriends.push(user);
	};

	$scope.addUsers = function(){
		var ids = [];

		angular.forEach($scope.newUsers, function(u){
			ids.push(u.facebook_id);
		});
		$scope.saving.addPromise(
			Restangular.all('users').batch($scope.newUsers, 'batch')
			.then(function(rsp){
				// send the facebook request thingie

				facebook.ui({
					method: 'apprequests',
					message: $scope.msg,
					to: ids
				}).then(function(){

					// send back our data to be added to the manage users scope
					$modalInstance.close(true);

				}, function(err){
					console.log(err);
					$rootScope.error = err.msg;
				});

			}, function(err){
				console.log(err);
				$rootScope.error = err.msg;
			})
		);
	};


	

	$scope.cancel = function(){
		$modalInstance.close(false);
	};
};