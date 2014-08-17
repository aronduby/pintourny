<?php

class Player extends Illuminate\Database\Eloquent\Model{
	
	public $timestamps = false;

	public function scores(){
		return $this->hasMany('Score');
	}

	public function tournaments(){
		return $this->belongsToMany('Tournament');
	}

}

?>