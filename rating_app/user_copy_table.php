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

$db->query('TRUNCATE TABLE user_old');
$db->query('TRUNCATE TABLE story');
$db->query('INSERT user_old SELECT * FROM user');
$db->query('TRUNCATE TABLE user');

echo 'true';

?>
