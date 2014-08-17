<?php

class Machine extends Illuminate\Database\Eloquent\Model{
	
	public $timestamps = false;

	public function tournament(){
		return $this->belongsTo('Tournament');
	}

	public function scores(){
		return $this->hasMany('Score');
	}

}

?>