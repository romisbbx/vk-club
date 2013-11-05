<?php

require 'config.php';
require 'core/safemysql.class.php';

class App {
	var $db;

	function App() {
		$this->db = new SafeMySQL(array(
			'host' => MYSQL_HOST,
			'user' => MYSQL_USER,
			'pass' => MYSQL_PASS,
			'db' => MYSQL_DB,
			'charset' => 'utf8',
		));;

		$this->setting = $this->db->getRow('SELECT * FROM setting WHERE id = 1');
		$this->ban = $this->db->getCol('SELECT id FROM ban');
	}

	function add_to_base() {
		foreach ($_POST as $key => $value) {
			$baned = false;

			foreach ($this->ban as $ban_item) {
				if ($ban_item == $key) {
					$baned = true;
					break;
				}
			}

			if (!$baned) {
				$ins = array(
					'id' => $key,
					'like' => isset($value['l']) ? $value['l'] : 0,
					'repost' => isset($value['r']) ? $value['r'] : 0,
					'comment' => isset($value['c']) ? $value['c'] : 0,
					'topic' => isset($value['t']) ? $value['t'] : 0,
					'photo' => isset($value['p']) ? $value['p'] : 0
				);

				$ins['rating'] = $ins['like'] * $this->setting['like']
					+ $ins['repost'] * $this->setting['repost']
					+ $ins['comment'] * $this->setting['comment']
					+ $ins['topic'] * $this->setting['topic']
					+ $ins['photo'] * $this->setting['photo'];

				$this->db->query('INSERT INTO user SET ?u', $ins);
			}
		}
	}
}


$app = new App();

$app->add_to_base();

echo 'true';

?>
