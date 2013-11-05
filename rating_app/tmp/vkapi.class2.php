<?php

/**
 * VKAPI class for vk.com social network
 *
 * @package server API methods
 * @link http://vk.com/developers.php
 * @autor Oleg Illarionov
 * @version 1.0
 */

// Допускается: 3 запроса в секунду от каждого уникального пользователя, запустившего приложение со стороны
// приложения. Количество запросов от сервера зависит от количества пользователей, установивших приложение.
// Если приложение установило меньше 10 000 человек, то можно совершать 5 запросов в секунду,
// до 100 000 – 8 запросов,  до 1 000 000 – 20 запросов, больше 1 млн. – 35 запросов в секунду.
// Числа могут поменяться со временем.
 
class vkapi {
	private $_accessToken = null;

	private $_apiUrl = 'https://api.vk.com/method/';

	public function vkapi($app_id, $api_secret) {
		$this->get_token($app_id, $api_secret);
	}

	function get_token($app_id, $api_secret) {
		$params = array();
		$params['client_id'] = $app_id;
		$params['client_secret'] = $api_secret;
		$params['grant_type'] = 'client_credentials';

		$query = 'https://oauth.vk.com/access_token?'.$this->_params($params);
		$res = file_get_contents($query);
		$this->_accessToken = json_decode($res, true)['access_token'];
	}

	public function api($method, $params = array()) {
		$params['access_token'] = $this->_accessToken;
		$query = $this->_apiUrl. $method . '?' . $this->_params($params);
		$responseStr = file_get_contents($query);
		if(!is_string($responseStr)){
			return null;
		}

		$responseObj = json_decode($responseStr);
		return $responseObj;
	}

	private function _params($params) {
		$pice = array();
		foreach($params as $k=>$v) {
			$pice[] = $k.'='.urlencode($v);
		}
		return implode('&',$pice);
	}
}
?>
