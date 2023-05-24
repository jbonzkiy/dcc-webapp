<div class="container-fuild text-white">
	<div class="row m-0 pt-3">
		<div class="col-lg-3">
			<fieldset class="main px-2 pb-2">
				<legend style="width: 50%;">Calls Today<i class="dloader daily_loader mdi mdi-refresh mdi-spin"></i></legend>
				<div class="row no-gutter" style="position: relative;">
					<div class="col-xs-10 col-sm-10 col-md-8 col-lg-8">
						<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 main-value"><span id="total_daily_calls">0</span></div>
					</div>
					<div class="col-xs-2 col-sm-2 col-md-4 col-lg-4">
						<table style="width: 100%;height: 100%;font-weight: bold;text-align: center;">
							<tr><td class="text-warning" style="font-size: 0.8vw;">Emergency<div style="font-size: 2vw;" id="daily_emergency">0</div></td></tr>
							<tr><td class="text-success" style="font-size: 0.8vw;">Others<div style="font-size: 2vw;" id="daily_others">0</div></td></tr>
							<tr><td class="text-danger" style="font-size: 0.8vw;">Dropped Calls<div style="font-size: 2vw;" id="daily_hangup">0</div></td></tr>
						</table>
					</div>
				</div>
				<div class="row no-gutter mt-2">
					<div class="col">
						<fieldset class="sub">
							<legend style="width: 100%;">Daily Avg Calls<i class="dloader mdi mdi-refresh mdi-spin average-loader"></i></legend>
							<div id="daily_ave_calls">0</div>
						</fieldset>
					</div>
					<div class="col">
						<fieldset class="sub">
							<legend style="width: 100%;">Daily Avg Emergency<i class="dloader mdi mdi-refresh mdi-spin average-loader"></i></legend>
							<div id="daily_ave_emergency">0</div>
						</fieldset>
					</div>
				</div>
			</fieldset>
		</div>
		<div class="col-lg-5">
			<fieldset class="main px-2 pb-2">
				<legend style="width: 60%;">Calls Received for <span><?php echo date('F'); ?></span><i id="monthly_loader" class="dloader mdi mdi-refresh mdi-spin"></i></legend>
				<div class="row no-gutter mt-4">
					<div class="col">
						<fieldset class="sub border-warning">
							<legend class="border-warning text-warning" style="background-color: #2A3F54; width: 50%;">Emergency</legend>
							<div class="text-warning" id="total_emergency">0</div>
							<div class="sub-value text-warning" id="total_emergency_percentage">0%</div>
						</fieldset>
					</div>
					<div class="col">
						<fieldset class="sub border-success">
							<legend class="border-success text-success" style="background-color: #2A3F54;width: 50%;">Others</legend>
							<div class="text-success" id="total_others">0</div>
							<div class="sub-value text-success" id="total_others_percentage">0%</div>
						</fieldset>
					</div>
					<div class="col">
						<fieldset class="sub border-danger">
							<legend class="border-danger text-danger" style="background-color: #2A3F54;width: 50%;">Dropped Calls</legend>
							<div class="text-danger" id="total_hangup">0</div>
							<div class="sub-value text-danger" id="total_hangup_emergency">0%</div>
						</fieldset>
					</div>
				</div>
				<div class="row no-gutter mt-2">
					<div class="col">
						<fieldset class="sub">
							<legend style="width: 50%;">Total Calls</legend>
							<div id="total_monthly_calls">0</div>
						</fieldset>
					</div>
					<div class="col">
						<fieldset class="sub">
							<legend style="width: 50%;">Avg. Emergency<i class="dloader mdi mdi-refresh mdi-spin average-loader"></i></legend>
							<div id="monthly_ave_emergency">0</div>
						</fieldset>
					</div>
				</div>
			</fieldset>
		</div>
		<div class="col-lg-4">
			<fieldset class="main px-2 pb-2">
				<legend style="width: 90%;">Telecommunicator's Performace<i id="staffperf_loader" class="dloader mdi mdi-refresh mdi-spin"></i></legend>
				<div id="staff_perf_chart" style="height: 400px;position: relative;"></div>
			</fieldset>
		</div>
	</div>

	<div class="row m-0 mt-5">
		<div class="col-lg-3">
			<fieldset class="main px-2 pb-2">
				<legend style="width: 50%;">Daily Calls<i id="incident_loader" class="dloader mdi mdi-refresh mdi-spin"></i></legend>
				<div id="incident_chart" style="height: 200px;"></div>
				<fieldset class="main">
					<legend style="width: 100%;">Top 5 calls for the Month<i id="monthlyincident_loader" style="display: none;" class="mdi mdi-refresh mdi-spin"></i></legend>
					<div style="font-weight: normal !important;overflow-y: auto;height:140px;padding-right: 10px;" id="monthly_container"></div>
				</fieldset>
			</fieldset>
		</div>
		<div class="col-lg-5">
			<fieldset class="main px-2 pb-2">
				<legend style="width: 70%;">Daily Calls Breakdown<i class="dloader daily_loader mdi mdi-refresh mdi-spin"></i></legend>
				<div class="row no-gutter">
					<div class="col">
						<fieldset class="normal p-1">
							<legend><img style="width: 2vw;" src="<?php echo base_url(); ?>assets/img/touchpoint.png"/>TOUCHPOINT</legend>
							<div class="row pr-3">
								<div class="col-xs-12 col-sm-12 col-md-7 col-lg-7" style="font-size: 1vw;">
									<table style="width: 100%;height: 100%;font-weight: bold;text-align: center;">
										<tr><td class="text-warning">Emergency: <span id="touch_emergency">0</span></td></tr>
										<tr><td class="text-success">Others: <span id="touch_others">0</span></td></tr>
										<tr><td class="text-danger">Dropped Calls: <span id="touch_hangup">0</span></td></tr>
									</table>
								</div>
								<div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
									<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="font-size: 3vw;"><span id="touch_total">0</span></div>
								</div>
							</div>
						</fieldset>
					</div>
					<div class="col">
						<fieldset class="normal p-1">
							<legend><img style="width: 2vw" src="<?php echo base_url(); ?>assets/img/cared.png"/>CARED</legend>
							<div class="row pr-3">
								<div class="col-xs-12 col-sm-12 col-md-7 col-lg-7" style="font-size: 1vw;">
									<table style="width: 100%;height: 100%;font-weight: bold;text-align: center;">
										<tr><td class="text-warning">Emergency: <span id="cared_emergency">0</span></td></tr>
										<tr><td class="text-success">Others: <span id="cared_others">0</span></td></tr>
										<tr><td class="text-danger">Dropped Calls: <span id="cared_hangup">0</span></td></tr>
									</table>
								</div>
								<div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
									<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="font-size: 3vw;"><span id="cared_total">0</span></div>
								</div>
							</div>
						</fieldset>
					</div>
				</div>
				<div class="row no-gutter mt-2">
					<div class="col">
						<fieldset class="normal p-1">
							<legend class="sub">Walk-in</legend>
							<div class="row pr-3">
								<div class="col-xs-12 col-sm-12 col-md-7 col-lg-7" style="font-size: 1vw;">
									<table style="width: 100%;height: 100%;font-weight: bold;text-align: center;">
										<tr><td class="text-warning">Emergency: <span id="walkin_emergency">0</span></td></tr>
										<tr><td class="text-success">Others: <span id="walkin_others">0</span></td></tr>
										<tr><td class="text-danger">Dropped Calls: <span id="walkin_hangup">0</span></td></tr>
									</table>
								</div>
								<div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
									<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="font-size: 3vw;"><span id="walkin_total">0</span></div>
								</div>
							</div>
						</fieldset>
					</div>
					<div class="col">
						<fieldset class="normal p-1">
							<legend class="sub">Comcenter</legend>
							<div class="row pr-3">
								<div class="col-xs-12 col-sm-12 col-md-7 col-lg-7" style="font-size: 1vw;">
									<table style="width: 100%;height: 100%;font-weight: bold;text-align: center;">
										<tr><td class="text-warning">Emergency: <span id="comcenter_emergency">0</span></td></tr>
										<tr><td class="text-success">Others: <span id="comcenter_others">0</span></td></tr>
										<tr><td class="text-danger">Dropped Calls: <span id="comcenter_hangup">0</span></td></tr>
									</table>
								</div>
								<div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
									<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="font-size: 3vw;"><span id="comcenter_total">0</span></div>
								</div>
							</div>
						</fieldset>
					</div>
				</div>
			</fieldset>
		</div>
		<div class="col-lg-4">
			<fieldset class="main px-2 pb-2">
				<legend style="width: 90%;">Monthly Calls Received for <span><?php echo date('Y'); ?></span><i id="historycalls_loader" class="dloader mdi mdi-refresh mdi-spin"></i></legend>
				<div id="historical_chart" style="height: 450px;position: relative;"></div>
			</fieldset>
		</div>
	</div>
</div>
<div>
	<center>
		<span class="text-white">Date Filter:</span> <input type="date" id="filter_date" value="<?php echo date('Y-m-d'); ?>"/>
		<button id="filter_btn">Filter</button>&nbsp;<button id=reset_btn>Reset</button>
	</center>
</div>