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
	var $api_secret;
	var $app_id;
	var $api_url;
	var $time;
	var $query_count;

	function vkapi($app_id, $api_secret, $api_url = 'api.vk.com/api.php') {
		$this->app_id = $app_id;
		$this->api_secret = $api_secret;
		if (!strstr($api_url, 'http://')) $api_url = 'http://'.$api_url;
		$this->api_url = $api_url;
		$this->query_count = 0;
	}

	function api($method, $params = false) {
		// не даем выполнять более 3-х запросов в секунду
		if (time() != $this->time) {
			$this->query_count = 0;
			$this->time = time();
		} else {
			if ($this->query_count >= 1) {
				sleep(1);
				$this->query_count = 0;
			}
			$this->query_count++;
		}

		return $this->get_api($method, $params);
	}

	function get_api($method, $params = false) {
		if (!$params) $params = array();
		$params['api_id'] = $this->app_id;
		$params['v'] = '3.0';
		$params['method'] = $method;
		$params['timestamp'] = time();
		$params['format'] = 'json';
		$params['random'] = rand(0,10000);
		ksort($params);
		$sig = '';
		foreach($params as $k=>$v) {
			$sig .= $k.'='.$v;
		}
		$sig .= $this->api_secret;
		$params['sig'] = md5($sig);
		$query = $this->api_url.'?'.$this->params($params);
		$res = file_get_contents($query);
		return json_decode($res, true);
	}
	
	function params($params) {
		$pice = array();
		foreach($params as $k=>$v) {
			$pice[] = $k.'='.urlencode($v);
		}
		return implode('&',$pice);
	}
}
?>
