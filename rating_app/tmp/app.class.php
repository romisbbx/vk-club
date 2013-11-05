<?php

/**
 * Application class
 *
 * @autor Roman Isaev
 * @version 1.0
 */
 
class App {
	var $vk;
	var $db;
	var $user;
	var $time;

	function App($vk, $db) {
		$this->vk = $vk;
		$this->db = $db;

		$this->time = time();

		$db->query('TRUNCATE TABLE wall');
		$db->query('TRUNCATE TABLE user_old');
		$this->db->query('INSERT user_old SELECT * FROM user');
		$db->query('TRUNCATE TABLE user');
	}

	function time() {
		$time = time() - $this->time;

		$this->db->query('UPDATE setting SET ?u WHERE id = 1', array(
			'update_date' => time(),
			'parse_time' => $time
		));

		echo '<p>' . $time / 60 .'мин. ( ' . $time .'c. )</p>';
	}

	// универсальный метод для поручениея и парсинга многостраничных данных от VK API
	function get_vk_data($vk_method, $vk_data, $parse_func, $offset_count = 100, $offset_max = 0) {
		$offset = 0;

		do {
			$is_next = 0;

			$vk_data['count'] = $offset_count;
			$vk_data['offset'] = $offset;

			$resp = $this->vk->api($vk_method, $vk_data);$resp = $this->vk->api($vk_method, $vk_data);

			if (!empty($resp['response'])) {
				$count = isset($resp['response']['count']) ? $resp['response']['count'] : $resp['response'][0];
				$is_next = $count - $offset > $offset_count;

				if ($offset_max > 0) {
					$is_next = $is_next && ($offset_max - $offset > $offset_count);
				}

				$parse_func($resp['response']);
			} else {
				echo $vk_method . ': error!';
				$this->print_r($resp);
				exit;
			}

			$offset += $offset_count;
		} while ($is_next);
	}

	function get_wall($offset_max = 0) {
		$this->get_vk_data('wall.get', array (
			'domain' => VK_GROUPE_DOMAIN
		), function ($resp) {
//			$this->print_r($resp);
			for ($i = 1; $i < count($resp); $i++) {
				$value = $resp[$i];

				$ins = array(
					'id' => $value['id'],
					'text' => $value['text'],
					'like' => $value['likes']['count'],
					'repost' => $value['reposts']['count'],
					'comments' => $value['comments']['count'],
					'date' => $value['date']
				);

				echo $this->db->query('INSERT INTO wall SET ?u', $ins);

				if ($ins['like'] > 0) {
					$this->get_wall_like($value['id'], 'post');
				}

				if ($ins['repost'] > 0) {
					$this->get_wall_repost($value['id']);
				}

				if ($ins['comments'] > 0) {
					$this->get_wall_comment($value['id']);
				}

				// лайки фоток со стены
				if (!empty($value['attachments'])) {
					for ($j = 0; $j < count($value['attachments']); $j++) {
						$attachment = $value['attachments'][$j];

						if ($attachment['type'] == 'photo') {
							$this->get_wall_like($attachment['photo']['pid'], 'photo');
						}
					}
				}
			}
		}, 100, $offset_max);
	}

	function get_wall_like($id, $type) {
		$this->get_vk_data('likes.getList', array (
			'type' => $type,
			'owner_id' => -VK_GROUPE_ID,
			'item_id' => $id
		), function ($resp) {
			foreach ($resp['users'] as $id) {
				// пытаемся получить строку с таким id из базы
				$row_in_table = $this->db->getRow('SELECT * FROM user WHERE id = ?i', $id);

				if (empty($row_in_table)) {
					// если в базе ее нет, то добаляем
					$ins = array(
						'id' => $id,
						'like' => 1
					);
					$this->db->query('INSERT INTO user SET ?u', $ins);
				} else {
					// если есть, то обновляем
					$ins = array(
						'like' => $row_in_table['like'] + 1
					);
					$this->db->query('UPDATE user SET ?u WHERE id=?i', $ins, $id);
				}
			}
		}, 1000);
	}

	function get_wall_repost($id) {
		$this->get_vk_data('likes.getList', array (
			'type' => 'post',
			'owner_id' => -VK_GROUPE_ID,
			'item_id' => $id,
			'filter' => 'copies'
		), function ($resp) {
			foreach ($resp['users'] as $id) {
				// пытаемся получить строку с таким id из базы
				$row_in_table = $this->db->getRow('SELECT * FROM user WHERE id = ?i', $id);

				if (empty($row_in_table)) {
					// если в базе ее нет, то добаляем
					$ins = array(
						'id' => $id,
						'repost' => 1
					);
					$this->db->query('INSERT INTO user SET ?u', $ins);
				} else {
					// если есть, то обновляем
					$ins = array(
						'repost' => $row_in_table['repost'] + 1
					);
					$this->db->query('UPDATE user SET ?u WHERE id=?i', $ins, $id);
				}
			}
		}, 1000);
	}

	function get_wall_comment($id) {
		$this->get_vk_data('wall.getComments', array (
			'owner_id' => -VK_GROUPE_ID,
			'post_id' => $id,
			'need_likes' => 1
		), function ($resp) {
			for ($i = 1; $i < count($resp); $i++) {
				$value = $resp[$i];

				// пытаемся получить строку с таким id из базы
				$row_in_table = $this->db->getRow('SELECT * FROM user WHERE id = ?i', $value['uid']);

				if (empty($row_in_table)) {
					// если в базе ее нет, то добаляем
					$ins = array(
						'id' => $value['uid'],
						'comment' => 1,
						'comment_like' => $value['likes']['count']
					);
					$this->db->query('INSERT INTO user SET ?u', $ins);
				} else {
					// если есть, то обновляем
					$ins = array(
						'comment' => $row_in_table['comment'] + 1,
						'comment_like' => $row_in_table['comment_like'] + $value['likes']['count']
					);
					$this->db->query('UPDATE user SET ?u WHERE id=?i', $ins, $value['uid']);
				}
			}
		}, 1000);
	}

	function get_rating() {
		$users = $this->db->getAll('SELECT * FROM user');
		$setting = $this->db->getRow('SELECT * FROM setting WHERE id = 1');

		foreach ($users as $item) {
			$item['rating'] = $item['like'] * $setting['like']
				+ $item['repost'] * $setting['repost']
				+ $item['comment'] * $setting['comment'];

			$this->db->query('UPDATE user SET ?u WHERE id=?i', $item, $item['id']);
		}
	}

	// расчет смещения в рейтинге для первых 100 чел
	function get_shift() {
		$users = $this->db->getAll('SELECT * FROM user WHERE (id > 0 AND banned < 1) ORDER BY ?n DESC LIMIT 100', 'rating');
		$users_old = $this->db->getAll('SELECT * FROM user_old WHERE (id > 0 AND banned < 1) ORDER BY ?n DESC', 'rating');

		// получаем смещение пользователя относительно предыдущего парсинга
		for ($i = 0; $i < count($users); $i++) {
			for ($j = 0; $j < count($users_old); $j++) {
				if ($users[$i]['id'] == $users_old[$j]['id']) {
					$users[$i]['shift'] = $j - $i;
					$this->db->query('UPDATE user SET ?u WHERE id=?i', $users[$i], $users[$i]['id']);
					break;
				}
			}
		}
	}

	function print_r($data) {
		echo '<pre>';
		print_r($data);
		echo '</pre>';
	}
}
?>
