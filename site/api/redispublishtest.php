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

$redis = new Predis\Client();
$pub = new Publisher($redis, 'pp3');


$machines = Machine::all();
$players = Player::orderBy('first_name')->get();


if(!empty($_POST)){
	$player = Player::find($_POST['player_id']);
	$machine = Machine::find($_POST['machine_id']);
	$score = $_POST['score'];

	$obj = new StdClass();
	$obj->player = $player;
	$obj->player_id = $player->id;
	$obj->machine = $machine;
	$obj->machine_id = $machine->id;
	$obj->score = $score;

	$ret = $pub->send('score.new', $obj);
	D::ump($ret, $obj);
}
?>
<!doctype html>
<html>
<head>
	<title>Post Scores (fake)</title>
</head>
<body>
	<form method="post">
		<ul>
			<li>
				<label for="player_id">Player:</label>
				<select name="player_id" id="player_id">
					<?php
					foreach($players as $player){
						print '<option value="'.$player->id.'" '.($player->id==27 ? 'selected' : '').'>'.$player->first_name.' '.$player->last_name.'</option>';
					}
					?>
				</select>
			</li>
			<li>
				<label for="machine_id">Machines:</label>
				<select name="machine_id" id="machine_id">
					<?php
					foreach($machines as $machine){
						print '<option value="'.$machine->id.'">'.$machine->title.'</option>';
					}
					?>
				</select>
			</li>
			<li>
				<label for="score">Score</label>
				<input type="number" name="score" id="score" />
			</li>
		</ul>
		<input type="submit" />
	</form>
</body>
</html>