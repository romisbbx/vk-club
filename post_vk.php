<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]> <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]> <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>Клуб подписчиков post</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width">

	<link href='https://fonts.googleapis.com/css?family=Roboto:300,300italic,400,400italic,100,100italic&subset=cyrillic-ext' rel='stylesheet' type='text/css'>
	<link type="text/css" rel="stylesheet" href="/static/_build/css/icons/icons.data.svg.css" />
	<link type="text/css" rel="stylesheet" href="/static/_build/css/main.css" />

	<script type="text/javascript" src="https://vk.com/js/api/xd_connection.js?2"></script>
	<script type="text/javascript" src="/static/js/libs/jquery/jquery.min.js"></script>
	<script type="text/javascript" src="/static/js/libs/lodash.min.js"></script>
	<script type="text/javascript" src="/static/js/libs/twig.min.js"></script>
	<script type="text/javascript" src="/static/js_post/app.js"></script>
	<script type="text/javascript" src="/static/js_post/post.js"></script>
	<script type="text/javascript">
		VK.init(function() {
			window.App = new window.WebApp();

			window.config = {};
			window.config.VK_GROUPE_ID = 58328169;
			window.config.VK_ALBUM_ID = 180761478;
			window.config.VK_POST_OFFSET = 5; // смещения для отложенного постинга в минутах

			new Post();
		});
	</script>
</head>
<body>
	<div class="content" id="js-content">

	</div>
</body>
</html>