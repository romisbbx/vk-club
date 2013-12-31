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

		$this->setting = $this->db->getRow('SELECT * FROM setting WHERE id = 1');
	}

	// расчет смещения в рейтинге для первых 120 чел
	function get_shift() {
		$users = $this->db->getAll('SELECT * FROM user WHERE (id > 101 AND banned < 1) ORDER BY ?n DESC LIMIT 120', 'rating');
		$users_old = $this->db->getAll('SELECT * FROM user_old WHERE (id > 101 AND banned < 1) ORDER BY ?n DESC LIMIT 120', 'rating');

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
					$users[$i]['shift'] = 120;
					$this->db->query('UPDATE user SET ?u WHERE id=?i', $users[$i], $users[$i]['id']);
				}
			}
		}
	}

	// получение данных пользователей для первых 120 чел
	function get_user_data($inputTableName, $outputTableName) {
		$users = $this->db->getAll('SELECT * FROM ?n WHERE (id > 101 AND banned < 1) ORDER BY ?n DESC LIMIT 120', $inputTableName, 'rating');
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

	// если за прошедщий день слишком мало юзеров проявили активность, то берем остальных из топ 100
	function correct_user_last_day_length() {
		$user_last_day_count = $this->db->getOne('SELECT COUNT(id) FROM user_data_last_day');
		$count = 5 - $user_last_day_count;

		if ($count > 0) {
			$data = $this->db->getAll('SELECT * FROM user_data WHERE (id > 101 AND banned < 1) ORDER BY ?n DESC, ?n ASC LIMIT ?i', 'rating', 'first_name', $count);

			foreach ($data as $item) {
				$item['rating'] = 0;
				$item['repost'] = 0;
				$item['like'] = 0;
				$item['comment'] = 0;
				$item['topic'] = 0;
				$item['photo'] = 0;

				$this->db->query('INSERT INTO user_data_last_day SET ?u', $item);
			}
		}
	}

	function user_last_day_get_likes () {
		$data = $this->db->getAll('SELECT user.id, user.like-user_old.like like_diff FROM user, user_old WHERE (user.id=user_old.id AND user.like!=user_old.like)');

		foreach ($data as $item) {
			$ins['id'] = $item['id'];
			$ins['like'] = $item['like_diff'];
			$ins['rating'] = $item['like_diff'] * $this->setting['like'];

			$this->db->query('INSERT INTO user_last_day SET ?u ON DUPLICATE KEY UPDATE ?n=?i, rating=rating+?s', $ins, 'like', $ins['like'], $ins['rating']);

			// story
			$story['item_id'] = 0;
			$story['type'] = 'like';
			$story['date'] = time();
			$story['text'] = $item['like_diff'];

			$this->db->query('INSERT INTO story SET ?u', $story);
		}
	}

	function user_last_day_get_repost () {
		$data = $this->db->getAll('SELECT user.id, user.repost-user_old.repost repost_diff FROM user, user_old WHERE (user.id=user_old.id AND user.repost!=user_old.repost)');

		foreach ($data as $item) {
			$ins['id'] = $item['id'];
			$ins['repost'] = $item['repost_diff'];
			$ins['rating'] = $item['repost_diff'] * $this->setting['repost'];

			$this->db->query('INSERT INTO user_last_day SET ?u ON DUPLICATE KEY UPDATE ?n=?i, rating=rating+?s', $ins, 'repost', $ins['repost'], $ins['rating']);

			// story
			$story['item_id'] = 0;
			$story['type'] = 'repost';
			$story['date'] = time();
			$story['text'] = $item['repost_diff'];

			$this->db->query('INSERT INTO story SET ?u', $story);
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

$app->db->query('TRUNCATE TABLE user_data');
$app->get_user_data('user', 'user_data');

$app->user_last_day_get_likes();
$app->user_last_day_get_repost();

$app->db->query('TRUNCATE TABLE user_data_last_day');
$app->get_user_data('user_last_day', 'user_data_last_day');

$app->correct_user_last_day_length();

$app->time();

echo 'true';

?>
