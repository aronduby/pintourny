<?php

class Score extends Illuminate\Database\Eloquent\Model{
	
	public $timestamps = false;
	protected $fillable = ['player_id', 'machine_id'];


	public function player(){
		return $this->belongsTo('Player');
	}

	public function machine(){
		return $this->belongsTo('Machine');
	}

	public function entered_by(){
		return $this->belongsTo('User\User', 'entered_by', 'id');
	}

}

?>