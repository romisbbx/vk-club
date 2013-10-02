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

$items = $db->getAll('SELECT * FROM story ORDER BY ?n DESC LIMIT 100', 'date');

$data = array(
	'items' => $items
);

echo json_encode($data);

?>
