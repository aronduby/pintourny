<?php

namespace User;

class User extends \Illuminate\Database\Eloquent\Model{

	public $logged_in = false;
	protected static $crypt;

	public $timestamps = false;
	protected $hidden = ['password', 'hash'];

	public static function boot(){
		parent::boot();

		self::$crypt = new \PasswordLib\PasswordLib();
	}

	public function role(){
		return $this->belongsTo('User\Role');
	}


	public function setPasswordAttribute($val){
		$this->attributes['password'] = self::$crypt->createPasswordHash($val);
	}

}

?>