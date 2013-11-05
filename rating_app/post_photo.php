<?php

if (class_exists('CurlFile')) {
	$data['file1'] = new CurlFile($_GET['image_url'], 'image/png');
} else {
	$data['file1'] = '@'.realpath($_GET['image_url']);
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $_GET['upload_url']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
echo curl_exec($ch);
curl_close($ch);

?>
