<?php

if ($_SERVER['SERVER_NAME'] == 'vk-club.local') {
	define('MYSQL_HOST', 'localhost');
	define('MYSQL_USER', 'root');
	define('MYSQL_PASS', 'zxx');
	define('MYSQL_DB', 'p177982_vk-club');
} else {
	define('MYSQL_HOST', 'localhost');
	define('MYSQL_USER', 'admin');
	define('MYSQL_PASS', 'FZiVMDAE6c');
	define('MYSQL_DB', 'p177982_vk-club');
}

define('VK_API_ID', '3912614'); // Insert here id of your application
define('VK_SECRET_KEY', 'eS0KrXT5S2zWNvS9tiyJ'); // Insert here secret key of your application

?>