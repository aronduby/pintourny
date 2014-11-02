<?php

namespace Config\Reader;

class Json implements \Config\Reader{

	protected $path;

	public function __construct($path){
		$this->path = $path;
	}

	public function load($name){
		$file = $this->path.$name.'.json';

		if(is_file($file) && is_readable($file)){
			$content = file_get_contents($file);
			$json = json_decode($content);
			
			if(is_null($json)){
				// errors
				$constants = get_defined_constants(true);
				$json_errors = array();
				foreach ($constants["json"] as $name => $value) {
				    if (!strncmp($name, "JSON_ERROR_", 11)) {
				        $json_errors[$value] = $name;
				    }
				}

				throw new \Exception($json_errors[json_last_error()]);

			} else {
				return $json;
			}

		} else {
			throw new \InvalidArgumentException('Supplied file "'.$file.'" is not a file or not readable by the server');
		}
	}
	
}

?>