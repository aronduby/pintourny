<?php

require '../../vendor/autoload.php';

$client = new Predis\Client();

$obj = new StdClass();
$obj->name_key = 'aronduby';
$obj->first_name = 'Aron';
$obj->last_name = 'Duby';
$obj->admin = true;
$obj->awesome = true;
$obj->scores = [
	'BO' => 888780,
	'XMEN' => 120870
];

$ret = $client->publish('user', json_encode($obj));
D::ump($ret);

?>