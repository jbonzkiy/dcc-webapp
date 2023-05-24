<div class="container py-3">
	<div class="row">
		<div class="col-md-6">
			<div class="mb-5">
				<div class="form-row">
					<div class="form-group col-md-6">
						<label for="fdt">From:</label>
						<input type="date" class="form-control form-control-sm rounded-0" id="fdt" disabled>
					</div>
					<div class="form-group col-md-6">
						<label for="tdt">To:</label>
						<input type="date" class="form-control form-control-sm rounded-0" id="tdt" disabled>
					</div>
				</div>
				<div class="pb-3">
					<fieldset>
						<legend><b>Please select what data to load.</b></legend>
						<!-- <small>This is to reduce the time if you only want to load a part of the report.</small> -->
						<div class="custom-control custom-checkbox">
							<input type="checkbox" class="custom-control-input chk" id="chk_monthly_calls" checked  disabled>
							<label class="custom-control-label" for="chk_monthly_calls">Monthly Emergencies Reported per Category and Type of Emergency</label>
						</div>
						<div class="custom-control custom-checkbox">
							<input type="checkbox" class="custom-control-input chk" id="chk_chart_data" checked disabled>
							<label class="custom-control-label" for="chk_chart_data">Chart Data</label>
						</div>
						<div class="custom-control custom-checkbox">
							<input type="checkbox" class="custom-control-input chk" id="chk_responded" checked disabled>
							<label class="custom-control-label" for="chk_responded">EMS and USAR Monthly Calls Responded</label>
						</div>
						<div class="custom-control custom-checkbox">
							<input type="checkbox" class="custom-control-input chk" id="chk_ref_other" checked disabled>
							<label class="custom-control-label" for="chk_ref_other">REFERRED TO OTHER AGENCIES</label>
						</div>
						<div class="custom-control custom-checkbox">
							<input type="checkbox" class="custom-control-input chk" id="chk_ws" disabled>
							<label class="custom-control-label" for="chk_ws">WEATHER SYSTEMS</label>
						</div>
						<div class="custom-control custom-checkbox">
							<input type="checkbox" class="custom-control-input chk" id="chk_response_time" disabled>
							<label class="custom-control-label" for="chk_response_time">Summary of Response Time</label>
						</div>
						<div class="custom-control custom-checkbox">
							<input type="checkbox" class="custom-control-input chk" id="chk_ic" disabled>
							<label class="custom-control-label" for="chk_ic">INFOCAST</label>
						</div>
						<!-- <div class="custom-control custom-checkbox">
							<input type="checkbox" class="custom-control-input chk" id="chk_rcdo" disabled>
							<label class="custom-control-label" for="chk_rcdo">Actual rain in CDO posted</label>
						</div> -->
					</fieldset>
				</div>
				<button type="button" class="btn btn-primary btn-sm rounded-0" id="apply_filter" disabled>Apply Filter</button>
				<button type="button" class="btn btn-primary btn-sm rounded-0" id="clear_filter" disabled>Clear Filter</button>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-6">
			<div style="font-weight: bold;">Date: <span id="date_display"></span></div><br>
			<div id="merge_table"></div>
			<div id="chart_data"></div>
			<div id="responded_data"></div>
			<div id="ref_other_data"></div>
			<div id="ws_data"></div>
			<div id="infocast_data"></div>
			<div id="response_time_data"></div>
			<div class="loading col1"><i class="mdi mdi-loading mdi-spin"></i>Fetching <span class="loading-text"></span> <small class="text-secondary loading-sub"></small></div>
		</div>
		<div class="col-md-6">
			<div class="loading col2"><i class="mdi mdi-loading mdi-spin"></i>Fetching <span class="loading-text col1"></span> <small class="text-secondary loading-sub col2"></small></div>
		</div>
	</div>
</div>