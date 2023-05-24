
<div id="navbar" class="ui labeled icon blue inverted menu" style="border-radius: 0;margin: 0;" data-uid="<?php echo $uid; ?>" data-utype="<?php echo $access; ?>">
	<div class="header item">
		<h3 class="ui header">
			<img src="<?php echo base_url(); ?>assets/img/weather_logo.png" />
			<div class="content" style="color:#fff;text-align: left;">
				Weather Monitoring
				<div class="sub header" style="color:#fff;">CDRRMD - ORO RESCUE</div>
			</div>
		</h3>
	</div>
	<a href="home" class="<?php echo ($page == 'home'?'active':''); ?> item"><i class="home icon"></i>Home</a>
	<a href="entry" class="<?php echo ($page == 'entry'?'active':''); ?> item"><i class="list alternate icon"></i>Entry</a>
	<a href="hazard" class="<?php echo ($page == 'hazard'?'active':''); ?> item"><i class="bolt icon"></i>Hazard</a>
	<a href="gauges" class="<?php echo ($page == 'gauges'?'active':''); ?> item"><i class="tachometer alternate icon"></i>Gauges</a>
	<a href="reports" class="<?php echo ($page == 'reports'?'active':''); ?> item"><i class="chart area icon"></i>Reports</a>
	<a href="reports1" class="<?php echo ($page == 'reports1'?'active':''); ?> item"><i class="fa fa-clipboard" style="font-size:18px"></i><br>CDO/PAR</br></a>
	<a href="infocast" class="<?php echo ($page == 'infocast'?'active':''); ?> item"><i class="mobile alternate icon"></i>Infocast</a>
	<div class="right menu">
		<div class="ui dropdown item" style="z-index:99999;">
			<i class="user outline icon"></i>
			<span><?php echo strtoupper($uname); ?><i class="dropdown icon"></i></span>
			<div class="menu">
				<a class="item" href="usermanagement"><i class="key icon"></i>Change Password</a>
				<?php if($access == 'admin'){ ?>
				<a class="item" href="usermanagement"><i class="users icon"></i>User Management</a>
				<?php } ?>
				<a class="item" href="<?php echo base_url(); ?>weather/logout"><i class="sign-out icon"></i>Logout</a>
			</div>
		</div>
	</div>
</div>

