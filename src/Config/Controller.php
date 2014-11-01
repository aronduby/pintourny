<?php

namespace Config;

class Controller{
	
	protected $reader;

	public function __construct(Reader $reader){
		$this->reader = $reader;
	}

	public function load($name){
		return $this->reader->load($name);
	}
}


?>