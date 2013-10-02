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
	}

	function add_to_base() {
		foreach ($_POST as $key => $value) {
			$value['item_id'] = intval($value['item_id'], 10);
			$value['user_id'] = intval($value['user_id'], 10);

			$this->db->query('INSERT INTO story SET ?u', $value);
		}
	}
}


$app = new App();

$app->add_to_base();

echo 'true';

?>
