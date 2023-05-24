<nav class="navbar navbar-expand-lg navbar-dark bg-primary text-light">
	<a class="navbar-brand">EMS Data Entry</a>
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
  	<div class="collapse navbar-collapse" id="navbarNavDropdown">
  		<ul class="nav navbar-nav mr-auto">
  			<li class="nav-item <?php echo ($page == 'entry'?'active':''); ?>">
        		<a class="nav-link" href="<?php echo base_url(); ?>ems/entry">Log Entry</a>
      		</li>
      		<li class="nav-item dropdown">
      			<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Report</a>
      			<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
					<a class="dropdown-item <?php echo ($type == 'report'?'active':''); ?>" href="<?php echo base_url(); ?>ems/report/report">Reponse Time</a>
      				<a class="dropdown-item <?php echo ($type == 'monthly'?'active':''); ?>" href="<?php echo base_url(); ?>ems/report/monthly">Monthly Report</a>
      				<a class="dropdown-item <?php echo ($type == 'yearly'?'active':''); ?>" href="<?php echo base_url(); ?>ems/report/yearly">Yearly Report</a>
      			</div>
        		
      		</li>
  		</ul>



  		<a class="navbar-right mr-1">Welcome! <?php echo $uname; ?> <i class="mdi mdi-account-circle"></i> | </a>
  		<a class="navbar-right text-light" href="<?php echo base_url(); ?>ems/logout"><i class="mdi mdi-logout"></i> Logout</a>
  	</div>
</nav>