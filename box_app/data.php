<?php
error_reporting(E_ALL|E_STRICT);
ini_set('display_errors', 'on');

const FILENAME = './data/results.dat';
$request = file_get_contents("php://input");
if ($request) {
  $request = json_decode($request);
  $data = array();
  $contents = @file_get_contents(FILENAME);
  if ($contents) {
    $data = json_decode($contents);
  }
  $request->likes = 0;
  $request->friends_likes = 0;
  $request->fails_count = 0;
  $request->exists = 1;
  $request->points = 0;
  $data[] = $request;
  file_put_contents(FILENAME, json_encode($data));
}
echo file_get_contents(FILENAME);