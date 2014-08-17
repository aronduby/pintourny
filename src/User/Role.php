<?php

namespace User;

class Role extends \Illuminate\Database\Eloquent\Model{

	const ANON = 1;
	const USER = 2;
	const ADMIN = 4;

	public $timestamps = false;
	

}

?>