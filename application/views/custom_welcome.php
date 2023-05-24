<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>

<style>
	body{background-color: white;}
</style>
<div class="ui center aligned container" style="padding-top: 8vh;">
	<div class="ui raised segment">
		<h1 class="ui icon header">
			<img src="<?php echo base_url();?>assets/img/oro_rescue_logo_100px.png">
			<div class="content">
				CDRRMD - Oro Rescue 911  Web Application
			</div>
		</h1>
		<?php $server_name = $_SERVER['SERVER_NAME']; ?>
		<?php if( $server_name == '192.168.0.147' || $server_name == 'localhost' || $server_name == '127.0.0.1' || $server_name == '[::1]' ) : ?>

			<h4 class="ui horizontal divider header"><i class="linkify icon"></i>Links</h4>
			<div class="ui three stackable cards">
				<a class="blue card" href="<?php echo base_url(); ?>ems/entry" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/ems_logo.png" style="height: 5vw;width: 5vw;"></div>
						<div class="center aligned description">
							<h1>EMS Data Entry</h1>
						</div>
					</div>
				</a>
				<a class="blue card" href="<?php echo base_url(); ?>maps/routing" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/route.png" style="height: 5vw;width: 5vw;"></div>
						<div class="center aligned description">
							<h1>Vehicle Routing</h1>
						</div>
					</div>
				</a>
				<a class="blue card" href="<?php echo base_url(); ?>ers/dashboard" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/chart.png" style="height: 5vw;width: 7vw;"></div>
						<div class="center aligned description">
							<h1>911 Dashboard</h1>
						</div>
					</div>
				</a>
				<a class="blue card" href="<?php echo base_url(); ?>maps/resource-monitoring" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/Map.png" style="height: 5vw;width: 7vw;"></div>
						<div class="center aligned description">
							<h1>Resource Map</h1>
						</div>
					</div>
				</a>
				<a class="blue card" href="http://192.168.0.200/dcc-webapp/pages/report" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/report_logo.png" style="height: 5vw;width: 9vw;"></div>
						<div class="center aligned description">
							<h1>Reports</h1>
						</div>
					</div>
				</a>
				<a class="blue card" href="<?php echo base_url(); ?>comcenter2/entry" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/radio.png" style="height: 5vw;width: 5vw;"></div>
						<div class="center aligned description">
							<h1>Comcenter</h1>
						</div>
					</div>
				</a>
				<a class="blue card" href="<?php echo base_url(); ?>logistic/items" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/inventory.png" style="height: 5vw;width: 5vw;"></div>
						<div class="center aligned description">
							<h1>Logistics</h1>
						</div>
					</div>
				</a>
				<a class="blue card" href="<?php echo base_url(); ?>weather/login" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/weather_logo.png" style="height: 5vw;width: 5vw;"></div>
						<div class="center aligned description">
							<h1>Weather Watch</h1>
						</div>
					</div>
				</a>
				<a class="blue card" href="https://ororescue911.maps.arcgis.com/apps/webappviewer/index.html?id=0e048db3306d49a18985843702fe9701&fbclid=IwAR1BWX2BRaahWOYfxA0pjAFWywf3nRmlE4dsF9cgGPMciNpBO5x_o9e_-Xw" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/riverine_logo.png" style="height: 5vw;width: 5vw;"></div>
						<div class="center aligned description">
							<h1>River Basins</h1>
						</div>
					</div>
				</a>
				<a class="blue card" href="https://ororescue911.maps.arcgis.com/apps/webappviewer/index.html?id=3e6e8d080e0847f2baf8b668b5755274&fbclid=IwAR3uYptB1GuSMDKXmBz2ycg-5C6rYl4k3Zfa1KrnevvW6RJQ78GxNGw_gfk" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/location.png" style="height: 5vw;width: 5vw;"></div>
						<div class="center aligned description">
							<h1>Zoning Map</h1>
						</div>
					</div>
				</a>
			</div>

		<?php endif; ?>
	</div>
</div>