<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]> <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]> <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>Клуб подписчиков</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width">

	<link href='https://fonts.googleapis.com/css?family=Roboto:300,300italic,400,400italic,100,100italic&subset=cyrillic-ext' rel='stylesheet' type='text/css'>
	<link type="text/css" rel="stylesheet" href="/rating_app/static/_build/css/icons/icons.data.svg.css" />
	<link type="text/css" rel="stylesheet" href="/rating_app/static/_build/css/main.css" />

	<script type="text/javascript" src="https://vk.com/js/api/xd_connection.js?2"></script>
	<script type="text/javascript" src="https://vk.com/js/api/openapi.js?101"></script>
	<script type="text/javascript" src="/rating_app/static/js/app.loader.js"></script>
	<script type="text/javascript">
		WebApp.config = {
			debugMode: false,
			debugEvent: false,
			locations: {
				js: '/rating_app/static/js/',
				jsBuild: '/rating_app/static/_build/js/',
				css: '/rating_app/static/_build/css/',
				img: '/rating_app/static/img/',
				api: '/api/'
			},
			bootstrap: <?php include 'user_data.php'; ?>
		};

		window.config = {};

		if (window.location.host == 'vk-club.local') {
			window.config.VK_GROUPE_ID = 58328169;
			WebApp.config.debugMode = true;
		} else {
			window.config.VK_GROUPE_ID = 48475446;
		}

		window.config.VK_POST_OFFSET = 60 * 9; // смещения для отложенного постинга в минутах
	</script>
	<script type="text/javascript" src="/rating_app/static/js/files.js"></script>
	<script type="text/javascript">
		VK.init(function() {
			new WebApp.Loader();
		});
	</script>
	<script src="//localhost:35729/livereload.js"></script>
</head>
<body>
<!--	<a class="header icon-logo" id="js-header" href="/"></a>-->
	<div class="panel" id="js-panel-top"></div>
	<div class="panel -mid" id="js-panel-mid"></div>
	<div class="panel" id="js-panel-bottom"></div>
	<div class="panel" id="js-panel-navigation"></div>
	<div class="content" id="js-content"></div>

<!--	<div class="footer" id="js-footer">-->
<!--		<div class="center">-->
<!--			<div class="head-menu">-->
<!--				<a class="head-menu-item active" href="/">Рейтинг</a>-->
<!--				&nbsp;&bull;&nbsp;-->
<!--				<a class="head-menu-item" href="/help/">Что это такое?</a>-->
<!--				&nbsp;&bull;&nbsp;-->
<!--				<a class="head-menu-item" href="/admin/">Админка</a>-->
<!--			</div>-->
<!--		</div>-->
<!--	</div>-->
</body>
</html>