<?php

namespace User;

use \Illuminate\Database\Capsule\Manager as Capsule;

class Controller{
	
	protected $crypt;

	protected $user = false;

	public function __construct(\PasswordLib\PasswordLib $crypt){
		$this->crypt = $crypt;
	}

	// syntatic sugar to get the actual user object
	public function __invoke(){
		return $this->get();
	}

	public function get(){
		return $this->user;
	}

	public function set(User $u){
		$this->user = $u;
	}

	public function loginWithHash($hash){
		$user = User::where('hash', '=', $hash)->first();

		/*
		$sql = "SELECT * FROM user WHERE hash = ?";
		$stmt = $this->dbh->prepare($sql);
		$stmt->setFetchMode(\PDO::FETCH_CLASS, 'User\User');
		$stmt->execute([$hash]);
		$user = $stmt->fetch();
		*/

		return $this->loginUser($user);
	}

	public function loginFromRegistry($username, $password){
		$user = User::where('username', '=', $username)->first();
		if($user !== null){
			if($this->crypt->verifyPasswordHash($password, $user->password)){
				return $this->loginUser($user);
			} else {
				throw new \InvalidArgumentException('Incorrect Password', 401);
			}
		} else {
			throw new \InvalidArgumentException('Username not found', 401);
		}

	}

	public function logout(){
		if($this->user->logged_in){
			$this->user->logged_in = false;
			$this->user->hash = null;
			$this->user->save();
		}
	}	

	private function loginUser($user){
		if($user === false || !$user instanceof \User\User){
			// set a dummy user
			$this->set(new User());
			return false;
		}

		$hash = $user->hash;
		if(!strlen($hash)){
			$user->hash = $this->createUniqueHash();
			$user->save();
		}

		$user->logged_in = true;
		$this->set($user);

		return $user;
	}

	private function createUniqueHash($token_len = 16, $table = 'user', $field = 'hash'){

		/*
		$count = 1;
		$stmt = $this->dbh->prepare("SELECT COUNT(*) AS count FROM ".$table." WHERE ".$field." = :hash");
		$stmt->bindParam(':hash', $hash);
		$stmt->bindColumn('count', $count, \PDO::PARAM_INT);
		while($count != 0){
			$token = $this->crypt->getRandomToken($token_len);
			$hash = $this->crypt->createPasswordHash($token);
			$stmt->execute();
			$stmt->fetch();
		}
		*/
		$count = 1;
		
		while($count != 0){
			$token = $this->crypt->getRandomToken($token_len);
			$hash = $this->crypt->createPasswordHash($token);
		
			$count = Capsule::table($table)->where($field, '=', $hash)->count();	
		}

		return $hash;
	}
}

?>