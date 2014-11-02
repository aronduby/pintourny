<?php

header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT"); 
header("Cache-Control: no-store, no-cache, must-revalidate"); 
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

require '/web/pintourny/vendor/autoload.php';


try{
	$subdomain = array_shift((explode(".",$_SERVER['HTTP_HOST'])));
	$CC = new Config\Controller(new Config\Reader\Json('/web/pintourny/configs/'));
	$config = $CC->load($subdomain);
} catch(Exception $e){
	header('Content-type: application/json');
	http_response_code (404);
	print json_encode([
		'msg' => "Unknown subdomain, check your url and try again.",
		'error' => $e->getMessage()
	]);
	die();
}

/* 
 *	Setup EloquentORM from Laravel
*/
use Illuminate\Database\Capsule\Manager as Capsule;
$capsule = new Capsule;
$capsule->addConnection((array)$config->db);

// Set the event dispatcher used by Eloquent models... (optional)
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
$capsule->setEventDispatcher(new Dispatcher(new Container));
// Make this Capsule instance available globally via static methods... (optional)
$capsule->setAsGlobal();
// Setup the Eloquent ORM... (optional; unless you've used setEventDispatcher())
$capsule->bootEloquent();

/*
 *	Setup Redis for PubSub for events
*/
$redis = new Predis\Client();
$pub = new Publisher($redis, 'pintourny', $subdomain);


/*
 *	Setup Slim
*/
$UC = new User\Controller( new PasswordLib\PasswordLib );

// set this up so it can be injected to required routes
$require_login = new User\Middleware\RequireLogin($UC);
$require_admin = new User\Middleware\RequireAdmin($UC);

$force_hash = null;
// force it to be me
// $force_hash = '$2y$10$hsRagMZGf43bK04BPoNLLeHr4dKTxIgLxgV1CZY2iEMSjvimoU93y';

$app = new \Slim\Slim();
$app->add(new JsonToPost());
$app->add(new \User\Middleware\Auth($UC, $force_hash));
$app->add(new \SlimJson\Middleware([
	'json.debug' => true,
	'json.override_error' => true,
	'json.override_notfound' => true,
	'json.status' => true  
]));



// Make this more useful at some point
$app->get('/', function() use($app, $UC, $config){
	// $app->render(200, ['data' => Tournament::with('machines', 'machines', 'players')->get() ]);
	$app->render(200, ['data'=>$config->site]);
});



/*
 *	Tournaments
*/
$app->get('/tournaments', function() use ($app){
	$app->render(200, ['data' => Tournament::with('machines', 'machines', 'players')->get() ]);
})->name('tournaments');

$app->get('/tournaments/:id', function($id) use ($app){
	$tournament = Tournament::with('machines.scores.player', 'machines.scores.entered_by',  'players')->where('id', '=', $id)->firstOrFail();
	$app->render(200, ['data' => $tournament ]);
});

$app->post('/tournaments', $require_admin, function() use ($app, $pub){

	$title = $app->request->post('title');
	$description = $app->request->post('description');
	$cutoff = $app->request->post('cutoff');

	$tournament = new Tournament();
	$tournament->title = $title;
	$tournament->description = $description;
	$tournament->cutoff = $cutoff;
	$tournament->save();

	$pub->send('tournament.new', $tournament);
	$app->render(200, ['data' => $tournament ]);
});

$app->put('/tournaments/:id', $require_admin, function($id) use ($app, $pub){

	$title = $app->request->post('title');
	$description = $app->request->post('description');
	$cutoff = $app->request->post('cutoff');

	$tournament = Tournament::find($id);
	$tournament->title = $title;
	$tournament->description = $description;
	$tournament->cutoff = $cutoff;
	$tournament->save();

	$pub->send('tournament.update', $tournament);
	$app->render(200, ['data' => $tournament ]);
});

$app->delete('/tournaments/:id', $require_admin, function($id) use($app, $pub){

	$tournament = Tournament::find($id);
	$tournament->machines()->delete();
	$tournament->players()->detach();

	$deleted = $tournament->delete();

	$pub->send('tournament.delete', $tournament);
	$app->render(200, ['data' => $deleted]);
});


/*
 * Players
*/
$app->get('/players', function() use ($app){
	
	$app->render(200, ['data' => Player::with('scores.machine', 'scores.entered_by', 'tournaments')->get() ]);
});

$app->get('/players/:id', function($id) use ($app){
	$player = Player::with('scores.machine', 'scores.entered_by', 'tournaments')->where('id', '=', $id)->firstOrFail();
	$app->render(200, ['data' => $player ]);
});

$app->post('/players', $require_admin, function() use ($app, $pub){
	
	$first_name = $app->request->post('first_name');
	$last_name = $app->request->post('last_name');
	$tournaments = $app->request->post('tournaments');
	if($tournaments == null)
		$tournaments = [];

	$player = new Player();
	$player->first_name = $first_name;
	$player->last_name = $last_name;
	$player->save();

	$player->tournaments()->sync($tournaments);
	$player->tournaments;

	$pub->send('player.new', $player);
	$app->render(200, ['data' => $player]);
});

$app->put('/players/:id', $require_admin, function($id) use ($app, $pub){

	$first_name = $app->request->post('first_name');
	$last_name = $app->request->post('last_name');
	$tournaments = $app->request->post('tournaments');
	if($tournaments == null)
		$tournaments = [];

	$player = Player::findOrFail($id);
	$player->first_name = $first_name;
	$player->last_name = $last_name;
	$player->save();

	$player->tournaments()->sync($tournaments);
	$player->tournaments;

	$pub->send('player.update', $player);
	$app->render(200, ['data' => $player]);
});

$app->delete('/players/:id', $require_admin, function($id) use ($app, $pub){

	$player = Player::find($id);
	$player->scores()->delete();
	$player->tournaments()->detach();
	$deleted = $player->delete();

	$pub->send('player.delete', $player);
	$app->render(200, ['data' => $deleted]);
});


/*
 *	Machines
*/
$app->get('/machines', function() use ($app){

	$app->render(200, ['data' => Machine::with('scores.player', 'scores.entered_by', 'tournament')->get() ]);
});

$app->get('/machines/:id', function($id) use ($app){
	$machine = Machine::with('scores', 'tournament')->where('id','=',$id)->firstOrFail();
	$app->render(200, ['data' => $machine ]);
});

$app->post('/machines', $require_admin, function() use($app, $pub){
	
	$tournament_id = $app->request->post('tournament_id');
	$abbv = $app->request->post('abbv');
	$title = $app->request->post('title');
	$image = $app->request->post('image');

	$machine = new Machine();
	$machine->tournament_id = $tournament_id;
	$machine->abbv = $abbv;
	$machine->title = $title;
	$machine->image = $image;
	$machine->save();

	$machine->tournament;

	$pub->send('machine.new', $machine);
	$app->render(200, ['data' => $machine ]);
});

$app->put('/machines/:id', $require_admin, function($id) use($app, $pub){

	$tournament_id = $app->request->post('tournament_id');
	$abbv = $app->request->post('abbv');
	$title = $app->request->post('title');
	$image = $app->request->post('image');	

	$machine = Machine::find($id);
	$machine->tournament_id = $tournament_id;
	$machine->abbv = $abbv;
	$machine->title = $title;
	$machine->image = $image;
	$machine->save();

	$machine->tournament;

	$pub->send('machine.update', $machine);
	$app->render(200, ['data' => $machine ]);
});

$app->delete('/machines/:id', $require_admin, function($id) use($app, $pub){

	$machine = Machine::find($id);
	$machine->scores()->delete();

	$deleted = $machine->delete();

	$pub->send('machine.delete', $machine);
	$app->render(200, ['data' => $deleted ]);
});



/*
 *	Points
*/
$app->get('/points', function() use ($app){
	$data = Capsule::table('points')->orderBy('place')->lists('points', 'place');
	$app->render(200, ['data' => $data]);
});

$app->get('/points/:place', function($place) use($app){

	$app->render(200, ['data' => Points::find($place)->points ]);
});

$app->post('/points', $require_admin, function() use($app, $pub){

	$place_to_points = $app->request->post('points');
	if(!is_array($place_to_points) || !count($place_to_points))
		$place_to_points = [];

	foreach($place_to_points as $place => $points){
		$p = Points::firstOrNew(['place' => $place]);
		$p->points = $points;
		$p->save();
	}

	$data = Capsule::table('points')->orderBy('place')->lists('points', 'place');

	$pub->send('points.new', $data);
	$app->render(200, ['data' => $data]);
});

$app->put('/points/:place', $require_admin, function($place) use($app, $pub){

	$points = Points::firstOrNew(['place' => $place]);
	$points->points = $app->request->post('points');
	$points->save();

	$pub->send('points.update', $points);
	$app->render(200, ['data' => $points->points]);
});

$app->delete('/points/:place', $require_admin, function($place) use($app, $pub){

	$points = Points::find($place);
	$deleted = $points->delete();

	$pub->send('points.delete', $points);
	$app->render(200, ['data' => $deleted]);
});


/*
 *	Users
*/
$app->get('/users', $require_admin, function() use($app){

	$app->render(200, ['data' => User\User::with('role')->get() ]);
});

$app->get('/users/checklogin', $require_login, function() use($app, $UC){
	$me = User\User::with('role')->where('id', '=', $UC()->id)->firstOrFail();
	$app->render(200, ['data' => $me ]);
});

$app->get('/users/:id', $require_admin, function($id) use($app){

	$user = User\User::with('role')->where('id', '=', $id)->firstOrFail();
	$app->render(200, ['data' => $user]);
});

$app->post('/users', $require_admin, function() use($app, $pub){

	$username = $app->request->post('username');
	$password = $app->request->post('password');
	$role_id = $app->request->post('role_id');

	$user = new User\User();
	$user->username = $username;
	$user->password = $password;
	$user->role_id = $role_id;
	$user->save();

	$user->role;

	$pub->send('user.new', $user);
	$app->render(200, ['data' => $user]);
});

$app->post('/users/login', function() use($app, $UC, $pub){
	
	$username = $app->request->post('username');
	$password = $app->request->post('password');

	$user = $UC->loginFromRegistry($username, $password);
	$user->role;

	$app->response->headers->set('User-Hash', $user->hash);

	$pub->send('user.login', $user);
	$app->render(200, ['data' => $user]);
});

$app->post('/users/:id/logout', $require_login, function() use($app, $UC, $pub){

	$UC->logout();

	$pub->send('user.logout', $UC());
	$app->render(200, ['data' => 'loggedout']);

});

$app->put('/users/:id', $require_admin, function($id) use($app, $pub){

	$username = $app->request->post('username');
	$password = $app->request->post('password');
	$role_id = $app->request->post('role_id');

	$user = User\User::findOrFail($id);
	$user->username = $username;
	$user->role_id = $role_id;
	if($password != null)
		$user->password = $password;

	$user->save();

	$user->role;

	$pub->send('user.update', $user);
	$app->render(200, ['data' => $user]);
});

$app->delete('/users/:id', $require_admin, function($id) use($app, $pub){

	$user = User\User::findOrFail($id);

	$deleted = $user->delete();

	$pub->send('user.delete', $user);
	$app->render(200, ['data' => $deleted]);
});

/*
 *	Roles
*/
$app->get('/roles', $require_admin, function() use ($app){

	$app->render(200, ['data' => User\Role::all()]);
});


/*
 *	Scores
*/
$app->get('/scores', function() use ($app){

	$scores = Score::with('machine.tournament', 'player')->get();
	$app->render(200, ['data' => $scores]);
});

$app->post('/scores', $require_login, function() use($app, $UC, $pub){

	$player_id = $app->request->post('player_id');
	$machine_id = $app->request->post('machine_id');
	$score = $app->request->post('score');

	$current_score = Score::firstOrNew(['player_id' => $player_id, 'machine_id' => $machine_id]);
	if($current_score->score < $score || $current_score->score == null){
		$current_score->player_id = $player_id;
		$current_score->machine_id = $machine_id;
		$current_score->score = $score;
		$current_score->entered_by = $UC()->id;

		$current_score->save();

		// need the full player for the front-end
		$current_score->player;
		$current_score->machine;
		$current_score->machine->tournament;
		
		$pub->send('score.new', $current_score);
		$app->render(200, ['data' => $current_score]);

	} else {
		$app->render(409, ['data' => 'Submitted score is less than current score of ' . number_format($current_score->score)], 5000);
	}
});

$app->put('/scores/:id', $require_admin, function($id) use($app, $pub){

	$player_id = $app->request->post('player_id');
	$machine_id = $app->request->post('machine_id');
	$score = $app->request->post('score');

	$current_score = Score::findOrFail($id);
	$current_score->player_id = $player_id;
	$current_score->machine_id = $machine_id;
	$current_score->score = $score;

	$current_score->save();

	// need the full player for the front-end
	$current_score->player;
	$current_score->machine;
	$current_score->machine->tournament;

	$pub->send('score.update', $current_score);
	$app->render(200, ['data' => $current_score]);
});

$app->delete('/scores/:id', $require_admin, function($id) use($app, $pub){

	$score = Score::findOrFail($id);
	$deleted = $score->delete();

	$pub->send('score.delete', $score);
	$app->render(200, ['data' => $deleted]);
});


$app->run();

?>