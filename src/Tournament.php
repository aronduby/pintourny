<?php

class Tournament extends Illuminate\Database\Eloquent\Model{
	
	public $timestamps = false;

	public function machines(){
		return $this->hasMany('Machine');
	}

	public function players(){
		return $this->belongsToMany('Player');
	}

}

?>