<div class="center-login" style="width: 250px;height: 300px;">
	<center>
		<img src="<?php echo base_url(); ?>/assets/img/ems_logo.png" height="100" width="100" />
		<h3><i class="mdi mdi-account-lock"></i> EMS Login</h3>
	</center>

	<div class="form-group">
		<label for="uname">Username:</label>
    	<input type="text" class="form-control form-control-sm rounded-0" id="uname" placeholder="Username">
	</div>
	<div class="form-group">
		<label for="upass">Password:</label>
    	<input type="password" class="form-control form-control-sm rounded-0" id="upass" placeholder="Password">
	</div>
	<div class="custom-control custom-checkbox">
		<input type="checkbox" class="custom-control-input" id="chk_rm">
		<label class="custom-control-label" for="chk_rm">Remember me</label>
	</div><br>
	<button type="button" id="login" class="btn btn-dark btn-block btn-sm rounded-0"><span id="login_btn_text">Login</span><i id="login_btn_loading" class="mdi mdi-autorenew mdi-spin" style="display: none;"></i></button>
</div>