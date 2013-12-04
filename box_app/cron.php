<?php
// error_reporting(E_ALL|E_STRICT);
// ini_set('display_errors', 'on');

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
    $likes = $vk->api('likes.getList', array('type' => 'post', 'owner_id' => $info->user_id, 'item_id' => $info->post_id));
    $friends = $vk->api('friends.get', array('user_id' => $info->user_id));
    $friends = $friends['response'];
    $friends_likes = array_intersect($likes['response']['users'], $friends);
    $info->likes = $likes['response']['count'];
    $info->friends_likes = count($friends_likes);
    $info->fails_count = 0;
  }
  else {
    if (!isset($info->fails_count)) {
      $info->fails_count = 0;
    }
    $info->fails_count++;
  }
  if (!isset($info->likes)) {
    $info->likes = 0;
  }
  if (!isset($info->friends_likes)) {
    $info->friends_likes = 0;
  }
  $info->points = $info->likes * 0.1 + $info->friends_likes*5;
}

file_put_contents(FILENAME, json_encode($data));