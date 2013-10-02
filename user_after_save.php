<?php

require 'config.php';
require 'core/vkapi.class.php';
require 'core/safemysql.class.php';

class App {
	var $db;
	var $vk;

	function App() {
		$this->db = new SafeMySQL(array(
			'host' => MYSQL_HOST,
			'user' => MYSQL_USER,
			'pass' => MYSQL_PASS,
			'db' => MYSQL_DB,
			'charset' => 'utf8',
		));;

		$this->vk = new vkapi(VK_API_ID, VK_SECRET_KEY);
	}

	// расчет смещения в рейтинге для первых 100 чел
	function get_shift() {
		$users = $this->db->getAll('SELECT * FROM user WHERE (id > 101 AND banned < 1) ORDER BY ?n DESC LIMIT 100', 'rating');
		$users_old = $this->db->getAll('SELECT * FROM user_old WHERE (id > 101 AND banned < 1) ORDER BY ?n DESC LIMIT 100', 'rating');

		if (!empty($users) && !empty($users_old)) {
			// получаем смещение пользователя относительно предыдущего парсинга
			for ($i = 0; $i < count($users); $i++) {
				$in_array = false;

				for ($j = 0; $j < count($users_old); $j++) {
					if ($users[$i]['id'] == $users_old[$j]['id']) {
						$users[$i]['shift'] = $j - $i;
						$this->db->query('UPDATE user SET ?u WHERE id=?i', $users[$i], $users[$i]['id']);
						$in_array = true;
						break;
					}
				}
				if (!$in_array) {
					$users[$i]['shift'] = 100;
					$this->db->query('UPDATE user SET ?u WHERE id=?i', $users[$i], $users[$i]['id']);
				}
			}
		}
	}

	// получение данных пользователей для первых 100 чел
	function get_user_data($inputTableName, $outputTableName) {
		$users = $this->db->getAll('SELECT * FROM ?n WHERE (id > 101 AND banned < 1) ORDER BY ?n DESC LIMIT 100', $inputTableName, 'rating');
		$users_str = '';

		for ($i = 0; $i < count($users); $i++) {
			$users_str = $users_str.', '.$users[$i]['id'];
		}

		$resp = $this->vk->api('users.get', array (
			'uids' => $users_str,
			'fields' => 'photo_100,photo_50,city'
		));

		if ($resp['response']) {
			$resp = $resp['response'];
			$city_str = '';

			for ($i = 0; $i < count($resp); $i++) {
				if (!empty($resp[$i]['city'])) {
					$city_str = $city_str.', '.$resp[$i]['city'];
				}
			}

			$city_resp = $this->vk->api('database.getCitiesById', array (
				'city_ids' => $city_str
			));

			if ($city_resp['response']) {
				$city_resp = $city_resp['response'];

				$this->db->query('TRUNCATE TABLE ?n', $outputTableName);

				for ($i = 0; $i < count($resp); $i++) {
					for ($j = 0; $j < count($users); $j++) {
						if ($resp[$i]['uid'] == $users[$j]['id']) {
							$users[$j]['first_name'] = $resp[$i]['first_name'];
							$users[$j]['last_name'] = $resp[$i]['last_name'];
							$users[$j]['photo_100'] = $resp[$i]['photo_100'];
							$users[$j]['photo_50'] = $resp[$i]['photo_50'];

							if (!empty($resp[$i]['city'])) {
								for ($k = 0; $k < count($city_resp); $k++) {
									if ($city_resp[$k]['cid'] == $resp[$i]['city']) {
										$users[$j]['city'] = $city_resp[$k]['name'];
									}
								}
							} else {
								$users[$j]['city'] = '';
							}

							$this->db->query('INSERT INTO ?n SET ?u', $outputTableName, $users[$j]);
						}
					}
				}
			}
		}
	}

	function time() {
		$this->db->query('UPDATE setting SET ?u WHERE id = 1', array(
			'update_date' => time(),
			'parse_time' => $_POST['parse_time']
		));
	}
}


$app = new App();

$app->get_shift();
$app->get_user_data('user', 'user_data');
$app->get_user_data('user_last_day', 'user_data_last_day');
$app->time();

echo 'true';

?>
