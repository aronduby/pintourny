<?php
// Slightly cheating to set the titles without having to dick with loading json async in the app
require '/web/pintourny/vendor/autoload.php';
$subdomain = array_shift((explode(".",$_SERVER['HTTP_HOST'])));
$CC = new Config\Controller(new Config\Reader\Json('/web/pintourny/configs/'));
$config = $CC->load($subdomain);
?>
<nav id="main-menu" role="navigation" ng-controller="NavCtrl">
	<div id="main-menu-inner">
		<div id="menu-content-demo" class="menu-content top">
			<div access-level="accessLevels.user">
				<div class="text-bg">
					<span 
						class="label user-type"
						ng-class="{
							'label-info': user.role.title == userRoles.user.title,
							'label-success': user.role.title == userRoles.admin.title
						}"
					>{{user.role.title}}</span>
					<span class="text-slim">Hey,</span> <span class="text-semibold">{{user.username}}</span>
				</div>

				<p>Let's play some pinball!</p>
			</div>
			<div access-level="accessLevels.anon">
				<div class="text-bg">
					<span class="text-slim">Nothing to see here folks&hellip;</span>
				</div>
				<p>Just go about your business of logging in</p>
			</div>
		</div>
		<ul class="navigation">
			<!-- Users -->
			<li 
				class="user-score"
				access-level="accessLevels.user"
				active-nav
			><a ui-sref="user.score">Score</a></li>

			<!-- Admin -->
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
		</ul> <!-- / .navigation -->
		<div class="menu-content">
			<a access-level="accessLevels.user" href="#" ng-click="logout()" class="btn btn-primary btn-block btn-outline dark">Logout</a>
			<a access-level="accessLevels.anon" ui-sref="anon.login" class="btn btn-primary btn-block btn-outline dark">Login</a>
		</div>
	</div> <!-- / #main-menu-inner -->
</nav> <!-- / #main-menu -->

<article id="content-wrapper" class="login theme-frost page-signin">

	<header class="page-header">			
		<div class="row">
			<!-- Page header, center on small screens -->
			<h1 class="col-xs-12 col-sm-4 text-center text-left-sm"><strong>Login</strong></h1>
		</div>
	</header>

	<div class="signin-container">

		<!-- Left side -->
		<div class="signin-info">
			<a href="#" class="logo">
				<img alt="<?= $config->site->title ?>" src="img/logos/<?= $config->site->logo ?>" style="margin-top: -5px;">&nbsp;
				<?= $config->site->title ?>
			</a>
			<div class="slogan">
				Let's Play Some Pinball!
			</div>
		</div>

		<!-- Right side -->
		<div class="signin-form">

			<form id="signin-form_id" novalidate="novalidate" ng-submit="login()">
				<div class="signin-text">
					<span>Sign In to your account</span>
				</div>

				<div class="form-group w-icon">
					<input type="text" name="username" id="username_id" class="form-control input-lg" placeholder="Username" required ng-model="username">
					<span class="fa fa-user signin-form-icon"></span>
				</div>

				<div class="form-group w-icon">
					<input type="password" name="password" id="password_id" class="form-control input-lg" placeholder="Password" required ng-model="password">
					<span class="fa fa-lock signin-form-icon"></span>
				</div>

				<div class="form-actions">
					<button type="submit" class="btn btn-lg btn-primary btn-flat btn-labeled">
						<span class="btn-label icon fa fa-cloud-upload"></span>
						<span ng-switch on="login_status">
							<span ng-switch-when="false">Login</span>
							<span
								ng-switch-when="loading" 
								us-spinner="{
									color:'#fff',
									lines: 7,
									length: 3,
									width: 4,
									radius: 5
								}"
							>&nbsp;</span>
							<span ng-switch-when="true">Welcome {{user.username}}</span>
						</span>
					</button>
				</div>
			</form>

			<div class="signin-with text-muted">
				You probably don't have an account.
			</div>

		</div>
		
	</div>
	
</article>