<?php

require 'config.php';
require 'core/safemysql.class.php';

$db = new SafeMySQL(array(
	'host' => MYSQL_HOST,
	'user' => MYSQL_USER,
	'pass' => MYSQL_PASS,
	'db' => MYSQL_DB,
	'charset' => 'utf8',
));

$users = $db->getAll('SELECT * FROM user_data WHERE (id > 101 AND banned < 1) ORDER BY ?n DESC, ?n ASC LIMIT 100', 'rating', 'first_name');
$users_last_day = $db->getAll('SELECT * FROM user_data_last_day WHERE (id > 101 AND banned < 1) ORDER BY ?n DESC, ?n ASC LIMIT 5', 'rating', 'first_name');

if (!empty($_POST['cur_user'])) {
	$cur_user_id = $_POST['cur_user'];
	$cur_user_in_top_100 = false;
	$cur_user_place = -1;

	// проверяем есть ли текущий user в выдаче
	foreach ($users as $item) {
		$cur_user_place++;
		if ($cur_user_id == $item['id']) {
			$cur_user_in_top_100 = true;
			break;
		}
	}

	$cur_user = $db->getRow('SELECT * FROM user WHERE id = ?i', $cur_user_id);

	if ($cur_user_in_top_100) {
		// если текущий user есть в top 100
		$cur_user['place'] = $cur_user_place;
	} else {
		// если текущего usera вообще нет в базе
		if (empty($cur_user)) {
			$cur_user = $users[0];

			foreach ($cur_user as &$item) {
				$item = "0";
			}
			unset($item);
			$cur_user['id'] = $cur_user_id;
		}

		// считаем примерное место Usera
		$cur_user['place'] = $db->getOne('SELECT COUNT(id) FROM user WHERE (id > 101 AND banned < 1 AND rating - ?i > 0.00001) ORDER BY ?n DESC', $cur_user['rating'], 'rating');
	}
} else {
	$cur_user = false;
}

$data = array(
	'users' => $users,
	'users_last_day' => $users_last_day,
	'setting' => $db->getRow('SELECT * FROM setting WHERE id = 1'),
	'cur_user' => $cur_user
);

echo json_encode($data);

?>