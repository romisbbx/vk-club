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

$users = $db->getAll('SELECT * FROM user_last_day WHERE (id > 101 AND banned < 1) ORDER BY ?n DESC LIMIT 100', 'rating');

$data = array(
	'users' => $users
);

echo json_encode($data);

?>
