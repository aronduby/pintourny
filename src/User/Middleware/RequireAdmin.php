<?php
/*
 *	This is used as route middleware, so it just needs to be callable
*/

namespace User\Middleware;

class RequireAdmin{

	protected $uc;

	public function __construct(\User\Controller $uc){
		$this->uc =  $uc;
	}

	public function __invoke(\Slim\Route $route){
		
		if(!$this->uc->get()->role->bit & \User\Role::ADMIN)
			throw new \UnexpectedValueException('Must be an admin to do that', 403);

		return true;
	}
}

?>