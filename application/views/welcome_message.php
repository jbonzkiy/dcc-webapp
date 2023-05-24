<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>
<!DOCTYPE html>
<!--<nav class="navbar navbar-light" style="background-color: hsl(89, 43%, 51%);">
  <a class="navbar-brand" href="#">
    <img src="<?php echo base_url();?>assets/img/oro_rescue_logo_100px.png" width="70" height="70" class="d-inline-block align-top" alt="">
  </a>
  <h1 class="ui center aligned container">CDRRMD - Oro Rescue 911  Web Application</h1>

</nav>-->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>

<style>
	body{background-color: #f2f2f2;}
	
.navbar {
  width: 100%;
  background-color: #555;
  overflow: auto;
  
}
</style>

<div class="p-0 mb-1 text-white">
    <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
            <a href="" class="navbar-brand">
                <img src="<?php echo base_url();?>assets/img/oro_rescue_logo_100px.png" height="80" alt="logo">
            </a>
            
            
                <div class="ui center aligned container">
                    <h1>CDRRMD - Oro Rescue 911  Web Application</h1>
                    </div>
        </div>
    </nav>
</div>
<div class="ui center aligned container" style="padding-top: 2vh;">
	
		
		<?php $server_name = $_SERVER['SERVER_NAME']; ?>
		<?php if( $server_name == '192.168.0.147' || $server_name == 'localhost' || $server_name == '127.0.0.1' || $server_name == '[::1]' ) : ?>

			<h4 class="ui horizontal divider header"><i class="linkify icon"></i>Links</h4>
			<div class="ui three stackable cards">
				<a class="green card" href="<?php echo base_url(); ?>ems/entry" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/ems_logo.png" style="height: 10vw;width: 10vw;"></div>
						<div class="center aligned description">
							<h2>EMS Data Entry</h2>
						</div>
					</div>
				</a>
				<a class="green card" href="<?php echo base_url(); ?>maps/routing" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/route.png" style="height: 10vw;width: 10vw;"></div>
						<div class="center aligned description">
							<h2>Vehicle Routing</h2>
						</div>
					</div>
				</a>
				<a class="green card" href="<?php echo base_url(); ?>ers/dashboard" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/chart.png" style="height: 10vw;width: 10vw;"></div>
						<div class="center aligned description">
							<h2>911 Dashboard</h2>
						</div>
					</div>
				</a>
				<a class="green card" href="<?php echo base_url(); ?>maps/resource-monitoring" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/Map.png" style="height: 10vw;width: 10vw;"></div>
						<div class="center aligned description">
							<h2>Resource Map</h2>
						</div>
					</div>
				</a>
				<a class="green card" href="http://192.168.0.200/dcc-webapp/pages/report" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/report_logo.png" style="height: 10vw;width: 13vw;"></div>
						<div class="center aligned description">
							<h2>Reports</h2>
						</div>
					</div>
				</a>
				<a class="green card" href="<?php echo base_url(); ?>comcenter2/entry" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/radio.png" style="height: 10vw;width: 10vw;"></div>
						<div class="center aligned description">
							<h2>Comcenter</h2>
						</div>
					</div>
				</a>
				<a class="green card" href="<?php echo base_url(); ?>logistic/items" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/inventory.png" style="height: 10vw;width: 10vw;"></div>
						<div class="center aligned description">
							<h2>Logistics</h2>
						</div>
					</div>
				</a>
				<a class="green card" href="<?php echo base_url(); ?>weather/login" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/weather_logo.png" style="height: 10vw;width: 10vw;"></div>
						<div class="center aligned description">
							<h2>Weather Watch</h2>
						</div>
					</div>
				</a>
				<a class="green card" href="https://ororescue911.maps.arcgis.com/apps/webappviewer/index.html?id=0e048db3306d49a18985843702fe9701&fbclid=IwAR1BWX2BRaahWOYfxA0pjAFWywf3nRmlE4dsF9cgGPMciNpBO5x_o9e_-Xw" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/riverine_logo.png" style="height: 10vw;width: 10vw;"></div>
						<div class="center aligned description">
							<h2>River Basins</h2>
						</div>
					</div>
				</a>
				<a class="green card ui center aligned container" href="https://ororescue911.maps.arcgis.com/apps/webappviewer/index.html?id=3e6e8d080e0847f2baf8b668b5755274&fbclid=IwAR3uYptB1GuSMDKXmBz2ycg-5C6rYl4k3Zfa1KrnevvW6RJQ78GxNGw_gfk" target="_blank">
					<div class="content">
						<div class="center aligned header"><img src="<?php echo base_url();?>assets/img/location.png" style="height: 10vw;width: 10vw;"></div>
						<div class="center aligned description">
							<h2>Zoning Map</h2>
						</div>
					</div>
				</a>
			</div>

		<?php endif; ?>
	</div>	
</body>	
</html>
