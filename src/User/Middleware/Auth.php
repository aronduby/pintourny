<?php

namespace User\Middleware;

class Auth extends \Slim\Middleware{
	
	public $force_hash;

	protected $uc;

	public function __construct(\User\Controller $uc, $force_hash = null){
		$this->uc =  $uc;
		$this->force_hash = $force_hash;
	}

	public function call(){

		/*
		 *	Fore Debugging/Development Only
		*/
		if(isset($this->force_hash)){
			$hash = $this->force_hash;
			$user = $this->uc->loginWithHash($hash);
			if($user !== false && $user->logged_in === true){
				$this->app->response->headers->set('User-Hash', $user->hash);
			}

			$this->next->call();
			return true;
		}

		/*
		 *	Attempts to log a user in based on the User-Hash header for the request
		 *	If it logs in a user it also sets the User-Hash header for the response
		*/
		if($this->app->request->headers->has('User-Hash')){
			$hash = $this->app->request->headers->get('User-Hash');
			$user = $this->uc->loginWithHash($hash);
			if($user !== false && $user->logged_in === true){
				$this->app->response->headers->set('User-Hash', $user->hash);
			}
		} else {
			$this->uc->set(new \User\User());
		}

		$this->next->call();
	}
}

?>