<?php
error_reporting(E_ALL|E_STRICT);
ini_set('display_errors', 'on');

require_once 'vk/VK.php';
require_once 'vk/VKException.php';
const FILENAME = './data/results.dat';

$contents = @file_get_contents(FILENAME);
$data = json_decode($contents);

$vk = new VK\VK(3977829, 'HandikaParser');

foreach ($data as $info) {
  $posts = $vk->api('wall.getById', array('posts' => "{$info->user_id}_{$info->post_id}"));
  $posts = $posts['response'];
  $info->exists = count($posts);
  if ($info->exists) {
    $info->likes = $posts[0]['likes']['count'];
  }
  if (!isset($info->likes)) {
    $info->likes = 0;
  }
}

file_put_contents(FILENAME, json_encode($data));