<?php
// Slightly cheating to set the titles without having to dick with loading json async in the app
require '/web/pintourny/vendor/autoload.php';
$subdomain = array_shift((explode(".",$_SERVER['HTTP_HOST'])));
$CC = new Config\Controller(new Config\Reader\Json('/web/pintourny/configs/'));
try{
	$config = $CC->load($subdomain);	
} catch(InvalidArgumentException $e){
	// subdomain doesn't exist
	error_log($e->getMessage());
	include '404.html';
	die();

} catch(Exception $e){
	// everything else (probably bad JSON format)
	error_log($e->getMessage());
	include '500.html';
	die();
}

?>
<!doctype html>
<html lang="en" ng-app="myApp">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

	<title><?= $config->site->title ?></title>

	<link rel="shortcut icon" href="favicon.ico" />

	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">

	<!-- Open Sans font from Google CDN -->
	<link href="http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,400,600,700,300&subset=latin" rel="stylesheet" type="text/css">

	<!-- Pixel Admin's stylesheets -->
	<link rel="stylesheet" href="components/slick-carousel/slick/slick.css">
	<link rel="stylesheet" type="text/css" href="components/bootstrap/dist/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="css/pixel-admin.css">
	<link rel="stylesheet" type="text/css" href="css/signin.css">
	<link rel="stylesheet" type="text/css" href="css/themes.css">


	<link rel="stylesheet" type="text/css" href="css/btncheckboxgroup.css" >
	<link rel="stylesheet" type="text/css" href="css/app.css">

</head>
<!-- 1. $BODY ======================================================================================
	Body

	Classes:
	* 'theme-{THEME NAME}'
	* 'right-to-left'      - Sets text direction to right-to-left
	* 'main-menu-right'    - Places the main menu on the right side
	* 'no-main-menu'       - Hides the main menu
	* 'main-navbar-fixed'  - Fixes the main navigation
	* 'main-menu-fixed'    - Fixes the main menu
	* 'main-menu-animated' - Animate main menu
-->
<body class="theme-frost" ng-cloak>
	<div id ="main-wrapper">

		<nav id="main-navbar" class="navbar navbar-default" role="navigation" ng-controller="NavCtrl">
			<button type="button" id="main-menu-toggle" ng-click="toggleMainMenu()"><i class="navbar-icon fa fa-bars icon"></i><span class="hide-menu-text">HIDE MENU</span></button>
			
			<div class="navbar-inner">
				<div class="navbar-header">
					<a href="#" class="navbar-brand">
						<div><img alt="<?= $config->site->title ?>" src="img/logos/<?= $config->site->logo ?>"></div>
						<?= $config->site->title ?>
					</a>
					<button 
						type="button" 
						class="navbar-toggle dropdown-toggle" 
						data-toggle="collapse" 
						data-target="#main-navbar-collapse"
						ng-click="navbar_open = !navbar_open"
					>
						<i class="navbar-icon fa fa-bars"></i>
					</button>
				</div>

				<div id="main-navbar-collapse" class="collapse navbar-collapse main-navbar-collapse" ng-class="{'in': navbar_open}">
					<div>
						<ul class="nav navbar-nav">
							<li>
								<a href="#">Home</a>
							</li>
							<li 
								access-level="accessLevels.user"
								active-nav
							><a ui-sref="user.score">Score</a></li>
							<li 
								class="dropdown"
								access-level="accessLevels.admin"
								active-nav
							>
								<a href class="dropdown-toggle" data-toggle="dropdown">Admin <span class="caret"></span></a>
								<ul class="dropdown-menu">
									<li 
										access-level="accessLevels.admin"
										active-nav
									><a ui-sref="admin.tournaments">Tournaments</a></li>
									<li 
										access-level="accessLevels.admin"
										active-nav
									><a ui-sref="admin.machines">Machines</a></li>
									<li 
										access-level="accessLevels.admin"
										active-nav
									><a ui-sref="admin.players">Players</a></li>
									<li 
										access-level="accessLevels.admin"
										active-nav
									><a ui-sref="admin.scores">Scores</a></li>
									<li 
										access-level="accessLevels.admin"
										active-nav
									><a ui-sref="admin.users">Users</a></li>
								</ul>
							</li>
						</ul> <!-- / .navbar-nav -->

						<div class="right clearfix">
							<ul class="nav navbar-nav pull-right right-navbar-nav">
								<li 
									access-level="accessLevels.anon"
									active-nav
								><a ui-sref="anon.login">Login</a></li>
								<li 
									access-level="accessLevels.user"
								><a href="#" ng-click="logout()">Logout</a></li>
							</ul> <!-- / .navbar-nav -->
						</div> <!-- / .right -->
					</div>
				</div> <!-- / #main-navbar-collapse -->
			</div> <!-- / .navbar-inner -->
		</nav>

		<div 
			id="socket_status" 
			class="alert alert-dark alert-page" 
			ng-show="status !== false" 
			ng-controller="SocketStatusCtrl"
			ng-class="{
				'alert-warning': status=='reconnecting', 
				'alert-danger': status=='disconnected', 
				'alert-success': status=='reconnected'
			}"			
		>
			{{msg}}
			<span class="label label-warning" ng-show="status=='reconnecting' && attempt_number != 0">attempt {{current_attempt}}/{{reconnection_attempts}}</span>
		</div>

		<div ui-view></div>		

		<div id="flare-holder">
			<flare-messages></flare-messages>
		</div>


		<div id="main-menu-bg"></div>
	</div>


	<!-- In production use:
	<script src="//ajax.googleapis.com/ajax/libs/angularjs/x.x.x/angular.min.js"></script>
	-->
	<script src="components/angular/angular.js"></script>
	<script src="components/angular-flare/dist/angular-flare.min.js"></script>
	<script src="components/ngstorage/ngStorage.min.js"></script>
	<script src="components/angular-sanitize/angular-sanitize.min.js"></script>

	<script type="text/javascript">
		document.write('\x3Cscript type="text/javascript" src="http://'+window.location.hostname+':773/socket.io/socket.io.js">\x3C/script>');
	</script>

	<script src="components/jquery/dist/jquery.js"></script>
	<script src="components/slick-carousel/slick/slick.js"></script>
	<script src="components/angular-slick/dist/slick.js"></script>

	<script src="components/angular-ui-router/release/angular-ui-router.min.js"></script>
	<script src="js/routingConfig.js"></script>

	<script src="components/angular-bootstrap/ui-bootstrap.js"></script>
	<script src="components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>

	<script src="components/lodash/dist/lodash.min.js"></script>
	<script src="components/restangular/dist/restangular.min.js"></script>

	<script src="components/angular-promise-tracker/promise-tracker.js"></script>
	<script src="components/angular-promise-tracker/promise-tracker-http-interceptor.js"></script>

	<script src="components/spin.js/spin.js"></script>
	<script src="components/angular-spinner/angular-spinner.js"></script>

	<script src="components/angular-order-object-by/src/ng-order-object-by.js"></script>


	<script src="js/app.js"></script>
	<script src="js/services.js"></script>
	<script src="js/controllers.js"></script>
	<script src="js/filters.js"></script>
	<script src="js/directives.js"></script>

	<!-- Templates/Partials -->
	

</body>
</html>
