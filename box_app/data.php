<?php
const FILENAME = './data/results.dat';
$request = file_get_contents("php://input");
if ($request) {
  $request = json_decode($request);
  $data = array();
  $contents = @file_get_contents(FILENAME);
  if ($contents) {
    $data = json_decode($contents);
  }
  $data[] = $request;
  file_put_contents(FILENAME, json_encode($data));
  echo json_encode(array('result' => 'ok'));
}
else {
  echo file_get_contents(FILENAME);
}