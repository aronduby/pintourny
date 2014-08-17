<?php
/**
 *	Largely based on Slim\Middleware\ContentTypes this is specific to JSON Posted bodies
 *	This is used for turning json posted bodies into actual post variables
*/
class JsonToPost extends \Slim\Middleware{

	public function call(){

		if($this->app->request()->getMediaType() == 'application/json'){
			$env = $this->app->environment();
			$env['slim.input_original'] = $env['slim.input'];

            $env['slim.input'] = json_decode($env['slim.input'], true);
            $_POST = $env['slim.input'];
		}

		$this->next->call();

	}
}


?>