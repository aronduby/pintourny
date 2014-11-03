<?php
/*
 *	This is used as route middleware, so it just needs to be callable
*/

namespace User\Middleware;

class RequireLogin{

	protected $uc;

	public function __construct(\User\Controller $uc){
		$this->uc =  $uc;
	}

	public function __invoke(\Slim\Route $route){
		if(!$this->uc->get()->logged_in)
			throw new \HttpStatusException('Login Required', 401);

		return true;
	}
}

?>