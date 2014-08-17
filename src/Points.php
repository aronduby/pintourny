<?php

class Points extends Illuminate\Database\Eloquent\Model{
	
	protected $table = 'points';
	protected $primaryKey = 'place';
	protected $fillable = ['place', 'points'];
	
	public $timestamps = false;


}

?>