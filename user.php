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

$users = $db->getAll('SELECT * FROM user WHERE (id > 101 AND banned < 1) ORDER BY ?n DESC LIMIT 100', 'rating');
$cur_user_in_top_100 = false;

// проверяем есть ли текущий user в выдаче
foreach ($users as $item) {
	if ($_POST['cur_user'] == $item['id']) {
		$cur_user_in_top_100 = true;
		break;
	}
}

$cur_user = $db->getRow('SELECT * FROM user WHERE id = ?i', $_POST['cur_user']);

if (!$cur_user_in_top_100) {
	// если текущего usera нет в базе
	if (empty($cur_user)) {
		$cur_user = $users[0];

		foreach ($cur_user as &$item) {
			$item = "0";
		}
		unset($item);
		$cur_user['id'] = $_POST['cur_user'];
	}

	// если текущего usera нет в выдаче то добавляем его в конец
	$cur_user['no_top'] = true;
	array_push($users, $cur_user);
}

$data = array(
	'users' => $users,
	'setting' => $db->getRow('SELECT * FROM setting WHERE id = 1'),
	'cur_user_place' => $db->getOne('SELECT COUNT(id) FROM user WHERE (id > 101 AND banned < 1 AND rating - ?i > 0.00001) ORDER BY ?n DESC', $cur_user['rating'], 'rating')
);

echo json_encode($data);

?>
