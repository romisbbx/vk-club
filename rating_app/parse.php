<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]> <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]> <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>Клуб подписчиков servise</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width">

	<script type="text/javascript" src="https://vk.com/js/api/xd_connection.js?2"></script>
	<script type="text/javascript" src="/rating_app/static/js/libs/jquery/jquery.min.js"></script>
	<script type="text/javascript" src="/rating_app/static/js/libs/lodash.min.js"></script>
	<script type="text/javascript" src="/rating_app/static/js/libs/twig.min.js"></script>
	<script type="text/javascript" src="/rating_app/static/js_parse/app.js"></script>
	<script type="text/javascript" src="/rating_app/static/js_parse/parse.js"></script>
	<script type="text/javascript">
		VK.init(function() {
			window.App = new window.WebApp();

			window.config = {};
			window.config.API_REQUEST_COUNT = 25;
//			window.config.VK_GROUPE_ID = -40147984;
//			window.config.VK_GROUPE_ID = -18835152;
//			window.config.VK_GROUPE_ID = -44035160; // https://vk.com/bask.official
//			window.config.VK_GROUPE_ID = -56192645; // https://vk.com/vne_dorog_beloretsk   / 72 поста
			window.config.VK_GROUPE_ID = -48475446; // https://vk.com/handika

			new Parser();
		});
	</script>
</head>
<body>
	Parse servise!
</body>
</html>