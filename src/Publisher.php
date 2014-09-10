<?php

class Publisher {
	
	public $pub;
	public $channel;

	public function __construct($pub, $channel){
		//if(!method_exists($pub, 'publish'))
		//	throw new InvalidArgumentException('Pub must be an object with a publish method');

		$this->pub = $pub;
		$this->channel = $channel;
	}

	public function send($type, $msg){
		$evt = new StdClass();
		$evt->type = $type;
		$evt->data = $msg;

		return $this->pub->publish($this->channel, json_encode($evt));
	}

}

?>