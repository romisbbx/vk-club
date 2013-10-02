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

$users = $db->getAll('SELECT * FROM user_data WHERE (id > 101 AND banned < 1) ORDER BY ?n DESC LIMIT 18', 'rating');
$users_last_day = $db->getAll('SELECT * FROM user_data_last_day WHERE (id > 101 AND banned < 1) ORDER BY ?n DESC LIMIT 18', 'rating');

$data = array(
	'users' => $users,
	'users_last_day' => $users_last_day,
);

echo json_encode($data);

?>
