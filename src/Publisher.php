<?php

class Publisher {
	
	public $pub;
	public $channel;
	public $room;

	public function __construct($pub, $channel, $room){
		//if(!method_exists($pub, 'publish'))
		//	throw new InvalidArgumentException('Pub must be an object with a publish method');

		$this->pub = $pub;
		$this->channel = $channel;
		$this->room = $room;
	}

	public function send($type, $msg){
		$evt = new StdClass();
		$evt->room = $this->room;
		$evt->type = $type;
		$evt->data = $msg;

		return $this->pub->publish($this->channel, json_encode($evt));
	}

}

?>