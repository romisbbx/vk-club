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
	<link type="text/css" rel="stylesheet" href="/rating_app/static/_build/css/icons/icons.data.svg.css" />
	<link type="text/css" rel="stylesheet" href="/rating_app/static/_build/css/main.css" />

	<style>
		h2 {
			font-family: 'Arial';
		}
	</style>

	<script type="text/javascript" src="/rating_app/static/js/libs/jquery/jquery.min.js"></script>
	<script type="text/javascript" src="/rating_app/static/js/libs/lodash.min.js"></script>
	<script type="text/javascript" src="/rating_app/static/js/libs/twig.min.js"></script>
	<script type="text/javascript" src="/rating_app/static/js_post/app.js"></script>
	<script type="text/javascript" src="/rating_app/static/js_post/post.js"></script>
	<script type="text/javascript">
		$(function() {
			window.App = new window.WebApp();
			new Post();
		});
	</script>
</head>
<body>
	<div class="content" id="js-content"></div>
</body>
</html>