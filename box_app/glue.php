<?php
putenv('GDFONTPATH=' . realpath('.'));

const MARGIN = 10;
const Y = 175;

const X1 = 30;
const X2 = 110;

CONST H = 310;
CONST SMALL_H = 155;
CONST WIDTH = 1010;
CONST HEIGHT = 600;
CONST FONT = 'Arial';

$input = json_decode(file_get_contents("php://input"));

function squarize($src, $size) {
  $w = max($size[0], $size[1]);
  $res = imagecreatetruecolor($w, $w);
  imagefill($res, 0, 0, imagecolorallocate($res, 255, 255, 255));
  imagecopyresampled($res, $src, round(($w-$size[0])/2), round(($w-$size[1])/2), 0, 0, $size[0], $size[1], $size[0], $size[1]);
  imagedestroy($src);
  return $res;
}

foreach ($input->images as $i => $image) {
  $file = explode('.', $image);
  $file = array_reverse($file);
  file_put_contents("./temp/$i.".$file[0], file_get_contents($image));
}

$files = glob('./temp/*');
$count = count($files);


$map = array();
$result = imagecreatetruecolor(WIDTH, HEIGHT);
imagefill($result, 0, 0, imagecolorallocate($result, 255, 255, 255));

$header_color = imagecolorallocate($result, 247, 151, 29);
$text_color = imagecolorallocate($result, 70, 51, 130);


imagettftext($result, 24, 0, 186, 148, $header_color, FONT, 'Я выбрал эти призы в конкурсе Handika Box:');
imagettftext($result, 15, 0, 223, 541, $text_color, FONT, 'С твоей помощью я смогу выиграть эти призы — жми «Мне нравится»!');
imagettftext($result, 15, 0, 324, 571, $text_color, FONT, 'Или тоже прими участие на vk.com/handika.');

$map = array();
if ($count == 1) {
  for ($i = 0; $i < $count; $i++) {
    $map[$i] = array(
      'x' => X1+2*round((H+MARGIN) / 2) + $i*(H+MARGIN),
      'y' => Y,
      'width' => H,
      'height' => H
    );
  }
}
else if ($count == 2) {
  for ($i = 0; $i < $count; $i++) {
    $map[$i] = array(
      'x' => X1+round((H+MARGIN) / 2) + $i*(H+MARGIN),
      'y' => Y,
      'width' => H,
      'height' => H
    );
  }
}
else if ($count == 3) {
  for ($i = 0; $i < $count; $i++) {
    $map[$i] = array(
      'x' => X1 + $i*(H+MARGIN),
      'y' => Y,
      'width' => H,
      'height' => H
    );
  }
}
else if ($count == 4) {
  for ($i = 0; $i < 2; $i++) {
    $map[] = array(
      'x' => X2 + $i*(H+MARGIN),
      'y' => Y,
      'width' => H,
      'height' => H
    );
  }
  for ($i = 0; $i < 2; $i++) {
    $map[] = array(
      'x' => X2 + 2*(H+MARGIN),
      'y' => Y+$i*(SMALL_H+MARGIN),
      'width' => SMALL_H,
      'height' => SMALL_H
    );
  }
}
else if ($count == 5 || $count == 6) {
  for ($i = 0; $i < 2; $i++) {
    $map[] = array(
      'x' => X1 + $i*(H+MARGIN),
      'y' => Y,
      'width' => H,
      'height' => H
    );
  }
  for ($i = 0; $i < $count - 2; $i++) {
    $map[] = array(
      'x' => X1 + 2*(H+MARGIN)+floor($i / 2)*(SMALL_H+MARGIN),
      'y' => Y+($i%2)*(SMALL_H+MARGIN),
      'width' => SMALL_H,
      'height' => SMALL_H
    );
  }
}
else if ($count == 7) {
  $map[] = array(
    'x' => X2,
    'y' => Y,
    'width' => H,
    'height' => H
  );
  for ($i = 0; $i < 6; $i++) {
    $map[] = array(
      'x' => X2 + MARGIN + H + ($i % 3) * (SMALL_H + MARGIN),
      'y' => Y + round($i / 5) * (SMALL_H + MARGIN),
      'width' => SMALL_H,
      'height' => SMALL_H
    );
  }
}
else if ($count == 8 || $count == 9) {
  $map[] = array(
    'x' => X1,
    'y' => Y,
    'width' => H,
    'height' => H
  );
  for ($i = 0; $i < $count - 1; $i++) {
    $map[] = array(
      'x' => X1 + H+MARGIN+($i % 4)*(SMALL_H+MARGIN),
      'y' => Y+round($i / 7)*(SMALL_H+MARGIN),
      'width' => SMALL_H,
      'height' => SMALL_H
    );
  }
}
else if ($count == 10) {
  for ($i = 0; $i < $count; $i++) {
    $map[] = array(
      'x' => X2 + ($i % 5)*(SMALL_H+MARGIN),
      'y' => Y+round($i / 9)*(SMALL_H+MARGIN),
      'width' => SMALL_H,
      'height' => SMALL_H
    );
  }
}
else if ($count == 11 || $count == 12) {
  for ($i = 0; $i < $count; $i++) {
    $map[] = array(
      'x' => X1 + ($i % 6)*(SMALL_H+MARGIN),
      'y' => Y+round($i / 11)*(SMALL_H+MARGIN),
      'width' => SMALL_H,
      'height' => SMALL_H
    );
  }
}

foreach ($map as $i => $position) {
  $size = getimagesize($files[$i]);
  $image = squarize(imagecreatefromjpeg($files[$i]), $size);
  imagecopyresampled($result, $image, $position['x'], $position['y'], 0, 0, $position['width'], $position['height'], max($size[0], $size[1]), max($size[0], $size[1]));
}

file_put_contents("./temp/avatar.jpg", file_get_contents($input->avatar));
$avatar = imagecreatefromjpeg('./temp/avatar.jpg');
imagecopyresampled($result, $avatar, 466, 22, 0, 0, 81, 81, 200, 200);
imagejpeg($result, './results/result.jpg', 100);

$data['file1'] = '@'.realpath('./results/result.jpg');
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $input->upload_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
echo curl_exec($ch);
curl_close($ch);
#rmdir('./temp');
foreach (array('./temp/*', './results/*') as $dir) {
  $files = glob($dir); // get all file names
  foreach($files as $file){ // iterate files
    if(is_file($file))
      unlink($file); // delete file
  }
}