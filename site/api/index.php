<?php

require '/web/pinballpyramid/vendor/autoload.php';

/* 
 *	Setup EloquentORM from Laravel
*/
use Illuminate\Database\Capsule\Manager as Capsule;
$capsule = new Capsule;
$capsule->addConnection([
    'driver'    => 'mysql',
    'host'      => 'localhost',
    'database'  => 'pinballpyramid',
    'username'  => 'pinballpyramid',
    'password'  => 'fun2fun',
    'charset'   => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix'    => '',
]);

// Set the event dispatcher used by Eloquent models... (optional)
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
$capsule->setEventDispatcher(new Dispatcher(new Container));
// Make this Capsule instance available globally via static methods... (optional)
$capsule->setAsGlobal();
// Setup the Eloquent ORM... (optional; unless you've used setEventDispatcher())
$capsule->bootEloquent();


/*
 *	Setup Slim
*/
$UC = new User\Controller( new PasswordLib\PasswordLib );

// set this up so it can be injected to required routes
$require_login = new User\Middleware\RequireLogin($UC);
$require_admin = new User\Middleware\RequireAdmin($UC);

$force_hash = null;
// force it to be me
$force_hash = '$2y$10$hsRagMZGf43bK04BPoNLLeHr4dKTxIgLxgV1CZY2iEMSjvimoU93y';

$app = new \Slim\Slim();
$app->add(new JsonToPost());
$app->add(new \User\Middleware\Auth($UC, $force_hash));
$app->add(new \SlimJson\Middleware([
	'json.debug' => true,
	'json.override_error' => true,
	'json.override_notfound' => true,
	'json.status' => true  
]));





$app->get('/', function() use($app, $UC){
	$app->render(200, ['data' => User\User::where('username', '=', 'aronduby')->first() ]);
});



/*
 *	Tournaments
*/
$app->get('/tournaments', function() use ($app){

	$app->render(200, ['data' => Tournament::with('machines.scores.player', 'machines.scores.entered_by', 'players')->get() ]);
});

$app->get('/tournaments/:id', function($id) use ($app){
	$tournament = Tournament::with('machines.scores.player', 'machines.scores.entered_by',  'players')->where('id', '=', $id)->firstOrFail();
	$app->render(200, ['data' => $tournament ]);
});

$app->post('/tournaments', $require_admin, function() use ($app){

	$title = $app->request->post('title');
	$description = $app->request->post('description');

	$tournament = new Tournament();
	$tournament->title = $title;
	$tournament->description = $description;
	$tournament->save();

	$app->render(200, ['data' => $tournament ]);
});

$app->put('/tournaments/:id', $require_admin, function($id) use ($app){

	$title = $app->request->post('title');
	$description = $app->request->post('description');

	$tournament = Tournament::find($id);
	$tournament->title = $title;
	$tournament->description = $description;
	$tournament->save();

	$app->render(200, ['data' => $tournament ]);
});

$app->delete('/tournaments/:id', $require_admin, function($id) use($app){

	$tournament = Tournament::find($id);
	$tournament->machines()->delete();
	$tournament->players()->detach();

	$deleted = $tournament->delete();

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

$app->post('/players', $require_admin, function() use ($app){
	
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

	$app->render(200, ['data' => $player]);
});

$app->put('/players/:id', $require_admin, function($id) use ($app){

	$first_name = $app->request->post('first_name');
	$last_name = $app->request->post('last_name');
	$tournaments = $app->request->post('tournaments');
	if($tournaments == null)
		$tournaments = [];

	$player = Player::find($id);
	$player->first_name = $first_name;
	$player->last_name = $last_name;
	$player->save();

	$player->tournaments()->sync($tournaments);
	$player->tournaments;

	$app->render(200, ['data' => $player]);
});

$app->delete('/players/:id', $require_admin, function($id) use ($app){

	$player = Player::find($id);
	$player->scores()->delete();
	$player->tournaments()->detach();
	$deleted = $player->delete();

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

$app->post('/machines', $require_admin, function() use($app){
	
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

	$app->render(200, ['data' => $machine ]);
});

$app->put('/machines/:id', $require_admin, function($id) use($app){

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

	$app->render(200, ['data' => $machine ]);
});

$app->delete('/machines/:id', $require_admin, function($id) use($app){

	$machine = Machine::find($id);
	$machine->scores()->delete();

	$deleted = $machine->delete();

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

$app->post('/points', $require_admin, function() use($app){

	$place_to_points = $app->request->post('points');
	if(!is_array($place_to_points) || !count($place_to_points))
		$place_to_points = [];

	foreach($place_to_points as $place => $points){
		$p = Points::firstOrNew(['place' => $place]);
		$p->points = $points;
		$p->save();
	}

	$data = Capsule::table('points')->orderBy('place')->lists('points', 'place');
	$app->render(200, ['data' => $data]);
});

$app->put('/points/:place', $require_admin, function($place) use($app){

	$points = Points::firstOrNew(['place' => $place]);
	$points->points = $app->request->post('points');
	$points->save();

	$app->render(200, ['data' => $points->points]);
});

$app->delete('/points/:place', $require_admin, function($place) use($app){

	$points = Points::find($place);
	$deleted = $points->delete();

	$app->render(200, ['data' => $deleted]);
});


/*
 *	Users
*/
$app->get('/users', $require_admin, function() use($app){

	$app->render(200, ['data' => User\User::with('roles')->get() ]);
});

$app->get('/users/:id', $require_admin, function($id) use($app){

	$user = User\User::with('roles')->where('id', '=', $id)->firstOrFail();
	$app->render(200, ['data' => $user]);
});

$app->post('/users', $require_admin, function() use($app){

	$username = $app->request->post('username');
	$password = $app->request->post('password');
	$roles = $app->request->post('roles');
	if($roles == null)
		$roles = [];

	$user = new User\User();
	$user->username = $username;
	$user->password = $password;
	$user->save();

	$user->roles()->sync($roles);
	$user->roles;

	$app->render(200, ['data' => $user]);
});

$app->post('/users/login', function() use($app, $UC){
	
	$username = $app->request->post('username');
	$password = $app->request->post('password');

	$user = $UC->loginFromRegistry($username, $password);
	$user->roles;

	$app->render(200, ['data' => $user]);
});

$app->put('/users/:id', $require_admin, function($id) use($app){

	$username = $app->request->post('username');
	$password = $app->request->post('password');
	$roles = $app->request->post('roles');
	if($roles == null)
		$roles = [];

	$user = User\User::findOrFail($id);
	$user->username = $username;
	$user->password = $password;
	$user->save();

	$user->roles()->sync($roles);
	$user->roles;

	$app->render(200, ['data' => $user]);
});

$app->delete('/users/:id', $require_admin, function($id) use($app){

	$user = User\User::findOrFail($id);
	$user->roles()->sync([]);

	$deleted = $user->delete();
	$app->render(200, ['data' => $deleted]);
});


/*
 *	Scores
*/
$app->post('/scores', $require_login, function() use($app, $UC){

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
		
		$app->render(200, ['data' => $current_score]);

	} else {
		$app->render(208, ['data' => 'Submitted score is less than current score of ' . $current_score->score]);
	}
});

$app->put('/scores/:id', $require_admin, function($id) use($app){

	$player_id = $app->request->post('player_id');
	$machine_id = $app->request->post('machine_id');
	$score = $app->request->post('score');

	$current_score = Score::findOrFail($id);
	$current_score->player_id = $player_id;
	$current_score->machine_id = $machine_id;
	$current_score->score = $score;

	$current_score->save();

	$app->render(200, ['data' => $current_score]);
});


$app->run();

?>