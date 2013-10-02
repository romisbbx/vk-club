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
	<link type="text/css" rel="stylesheet" href="/static/_build/css/icons/icons.data.svg.css" />
	<link type="text/css" rel="stylesheet" href="/static/_build/css/main.css" />

	<script type="text/javascript" src="https://vk.com/js/api/xd_connection.js?2"></script>
	<script type="text/javascript" src="https://vk.com/js/api/openapi.js?101"></script>
	<script type="text/javascript" src="/static/js/app.loader.js"></script>
	<script type="text/javascript">
		WebApp.config = {
			debugMode: true,
			debugEvent: false,
			locations: {
				js: '/static/js/',
				jsBuild: '/static/_build/js/',
				css: '/static/_build/css/',
				img: '/static/img/',
				api: '/api/'
			}
		};
	</script>
	<script type="text/javascript" src="/static/js/files.js"></script>
	<script type="text/javascript">
		VK.init(function() {
			new WebApp.Loader();
		});
	</script>
	<!-- TODO: добавить подключение скриптов для production версии -->
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