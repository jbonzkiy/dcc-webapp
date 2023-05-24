<div id="firstloading" style="position:absolute;top:0;left:0;z-index:9999;height: 100%;width: 100%;background: #fff url(http://192.168.0.200/dcc-webapp/assets/img/ems_logo.png) no-repeat fixed center;background-size: 400px;">
	<div class="center-loading"><i class="mdi mdi-autorenew mdi-spin" style="font-size: 200px;color:#fff;"></i></div>
</div>
<div id="versplit" data-uid="<?php echo $uid; ?>" data-utype="<?php echo $utype; ?>">
	<div>
		<div id="vhsplit">
			<div>
				<div style="
			    font-size: 14px;
			    text-align: center;
			    padding: 10px;
			">EMS Data Entry Form</div>
			</div>
			<div>
				<div id="frmPanel" style="position: relative;">
					
					<div class="px-4 py-2">
						<div class="form-group no-gutters">
							<label for="did">Dispatch ID: <small id="errDid" style="display:none;cursor: help; color: #FE0000;"></small></label>
							<div style="position: relative;">
								<i class="mdi mdi-vanish mdi-spin" id="didloading" style="display:none;font-size: 24px;color:#252526;position: absolute;top:5px;right: 5px;"></i>
							<input type="text" class="form-control form-control-sm rounded-0" id="did">
							</div>
						</div>
						<div class="row no-gutters">
							<div class="col-sm">
								<div class="form-group">
									<label for="edate">Date:</label>
									<input type="date" class="form-control form-control-sm rounded-0" id="edate">
								</div>
							</div>
							<div class="col-sm">
								<div class="form-group">
									<label for="etime">Time:</label>
									<input type="time" class="form-control form-control-sm rounded-0" id="etime">
								</div>
							</div>
						</div>
						<div class="form-group">
							<label for="location">Location:</label>
							<textarea class="form-control form-control-sm rounded-0 no-resize" id="location"></textarea>
						</div>
						<div class="form-group">
							<label for="team">Alpha Team:</label>
							<div style="position: relative;">
								<i class="mdi mdi-vanish mdi-spin" id="teamloading" style="display:none;font-size: 24px;color:#252526;position: absolute;top:5px;right: 5px;"></i>
								<select class="form-control form-control-sm rounded-0" id="team"></select>
							</div>
						</div>
						<div class="form-group">
							<label for="pname">Patient's Name:</label>
							<input list="plist" type="text" class="form-control form-control-sm rounded-0" id="pname">
							<datalist id="plist">
								<?php
									foreach(json_decode($plist) AS $value){
								?>
								<option value="<?php echo $value->pname; ?>">
								<?php	} ?>
							</datalist>
						</div>
						<div class="form-group">
							<label for="pname">Contact Number:</label>
							<input type="text" class="form-control form-control-sm rounded-0" id="pnum">
						</div>
						<div class="form-group">
							<label for="age">Age:</label>
							<input type="number" class="form-control form-control-sm rounded-0" id="age">
							<!-- <select class="form-control form-control-sm rounded-0" id="age">
								<option value="0"></option>
								<option value="1">Neonate (0 to 1 month)</option>
								<option value="2">Infant (1 month to 1 year)</option>
								<option value="3">Toddler (1 to 3 years)</option>
								<option value="4">Preschool age (3 to 6 years)</option>
								<option value="5">School Age (6 to 12 years)</option>
								<option value="6">Adolescent (12 to 18 years)</option>
								<option value="7">Early adult (19 to 40 years)</option>
								<option value="8">Middle adult (41 to 60 years)</option>
								<option value="9">Late adult (61 and older)</option>
							</select> -->
						</div>
						<fieldset class="custom-fieldset" id="genderFieldSet">
							<legend><label for="genderFieldSet" style="margin-bottom: 0 !important;">Gender:</label></legend>
							<div class="custom-control custom-radio custom-control-inline">
								<input type="radio" name="gender" id="genderMale" value="male" class="custom-control-input">
								<label class="custom-control-label" for="genderMale">Male</label>
							</div>
							<div class="custom-control custom-radio custom-control-inline">
								<input type="radio" name="gender" id="genderFemale" value="female" class="custom-control-input">
								<label class="custom-control-label" for="genderFemale">Female</label>
							</div>
						</fieldset>
						<div class="form-group mt-3">
							<label for="casetype">Case Type Description:</label>
							<select class="form-control form-control-sm rounded-0" id="casetype"></select>
						</div>
						<div class="form-group" id="subcase" style="display: none;">
							<label for="subcasetype">Sub Case Type:</label>
							<select class="form-control form-control-sm rounded-0" id="subcasetype"></select>
						</div>
						<fieldset class="custom-fieldset mb-3" id="intoxicated">
							<legend><label for="intoxicated" style="margin-bottom: 0 !important;">Intoxicated:</label></legend>
							<div class="custom-control custom-radio custom-control-inline">
								<input type="radio" name="nakainom" id="itno" value="no" class="custom-control-input">
								<label class="custom-control-label" for="itno">No</label>
							</div>
							<div class="custom-control custom-radio custom-control-inline">
								<input type="radio" name="nakainom" id="ityes" value="yes" class="custom-control-input">
								<label class="custom-control-label" for="ityes">Yes</label>
							</div>
						</fieldset>
						<fieldset class="custom-fieldset mb-3" id="pcovidFieldSet">
							<legend><label for="pcovidFieldSet" style="margin-bottom: 0 !important;">Covid Patient</label></legend><!--added this option at June 10, 2021 1:45PM-->
							<div class="custom-control custom-radio custom-control-inline">
								<input type="radio" name="iscovid" id="covidno" value="no" class="custom-control-input">
								<label class="custom-control-label" for="covidno">No</label>
							</div>
							<div class="custom-control custom-radio custom-control-inline">
								<input type="radio" name="iscovid" id="covidyes" value="yes" class="custom-control-input">
								<label class="custom-control-label" for="covidyes">Yes</label>
							</div>
							<div class="custom-control custom-radio custom-control-inline">
								<input type="radio" name="iscovid" id="covidsus" value="suspected" class="custom-control-input">
								<label class="custom-control-label" for="covidsus">Suspected</label>
							</div>
						</fieldset>
						
						<fieldset class="custom-fieldset mb-3" id="vdoseFieldSet">
							<legend><label for="vdoseFieldSet" style="margin-bottom: 0 !important;">Vaccinated</label></legend><!--added this option at June 10, 2021 1:45PM-->
							<div class="custom-control custom-radio mb-2">
								<input type="radio" class="custom-control-input" name="isvacs" id="vnone" value="0">
								<label class="custom-control-label" for="vnone">None</label>
							</div>

							<div class="custom-control custom-radio mb-2" style="position: relative;">
								<input type="radio" class="custom-control-input" name="isvacs" id="vd1" value="1">
								<label class="custom-control-label" for="vd1">1st Dose</label>
								<input type="date" class="" data-for="vd1" id="vdt1" style="position: absolute; top: 0; right: 0; width: 60%;border: 1px solid #CED4DA;color: #495057;" disabled>
							</div>
							<div class="custom-control custom-radio">
								<input type="radio" class="custom-control-input" name="isvacs" id="vd2" value="2">
								<label class="custom-control-label" for="vd2">Completed</label>
								<input type="date" class="" data-for="vd2" id="vdt2" style="position: absolute; top: 0; right: 0; width: 60%;border: 1px solid #CED4DA;color: #495057;" disabled>
							</div>
							<div class="form-group">
								<label for="vname">Vaccine Name:</label>
								<input type="text" class="form-control form-control-sm rounded-0" id="vname" disabled>
							</div>
						</fieldset>
						<div class="form-group">
							<label for="transport_type">Transported Type:</label>
							<select class="form-control form-control-sm rounded-0" id="transport_type"></select>
						</div>
						<div class="form-group" id="transfromcontainer" style="display:none;">
							<label for="trans_from">Transported from:</label>
							<select class="form-control form-control-sm rounded-0" id="trans_from"></select>
						</div>						
						<div class="form-group">
							<label for="hospital">Transported To:</label>
							<select class="form-control form-control-sm rounded-0" id="hospital"></select>
						</div>						
						<!-- <div class="form-group" id="spHospitalContainer" style="display: none;">
							<label for="spHospital">Specific Location:</label>
							<input type="text" class="form-control form-control-sm rounded-0" id="spHospital">
						</div> -->
						<div class="form-group">
							<div class="field">
								<label>Remarks:</label>
								<textarea class="form-control form-control-sm rounded-0" rows="10" id="remarks"></textarea>
							</div>
						</div>

						<button type="button" id="submit" class="btn btn-dark btn-sm rounded-0 btn-block" data-request="request">Save</button>
						<button type="button" id="clearall" class="btn btn-light btn-sm rounded-0 btn-block">Clear</button>
						<button type="button" style="display: none;" id="clear" class="btn btn-info btn-sm rounded-0 btn-block">New</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div>
		<div id="horsplit">
			<div>
				<div class="p-2" id="filtercontainer" style="background-color: #F4F4F4;">
					<fieldset>
						<legend class="text-dark">Date Added Filter</legend>
						<div class="float-left mr-2"><span>From:</span><br><input type="datetime-local" id="fdt"/></div>
						<div class="float-left mr-2"><span>To:</span><br><input type="datetime-local" id="tdt"/></div>
						<div class="float-left mr-2"><br><button class="btn btn-primary btn-sm rounded-0" type="button" id="btnSearch">Filter</button></div>
						<div class="float-left mr-2"><br><button type="button" class="btn btn-danger btn-sm rounded-0" id="btnClearSearch">Clear Filter</button></div>
						<div class="float-left mr-2"><br><button type="button" class="btn btn-info btn-sm rounded-0" id="btnExporttoExcel"><i class="mdi mdi-file-excel"></i> Export</button></div>
						<div class="float-left mr-5" id="totalsni" style="display: none;font-size: 1.5em;"><br>
							<i class="mdi mdi-refresh mdi-spin" style="display: none;" id="totalsniloading"></i>
							<div id="totalsnicontainer">
								<span class="badge badge-primary p-1">Total Run: (<span id="totalrun"></span>)</span>
								<span class="badge badge-info">Total Log: (<span id="totallog"></span>)</span>
								<span class="badge badge-warning">Total Pending: (<span id="totalpending"></span>)</span>
							</div>
						</div>
						
						<div class="float-right mr-2"><br><button type="button" class="btn btn-secondary btn-sm rounded-0" id="btnRefresh">Refresh Data</button></div>
						<div class="float-right mr-2"><br><button type="button" class="btn btn-warning btn-sm rounded-0" id="btnPending" disabled="" data-toggle="modal" data-target="#pendingModal">Pending Log/s&nbsp;(<span class="totalpendinglog">0</span>)<i class="mdi mdi-refresh mdi-spin" style="display: none;" id="pendingLogLoading"></i></button></div>
						
						<div class="float-right mr-2"><br><button type="button" class="btn btn-secondary btn-sm rounded-0" id="btnRequest">Pending Request&nbsp;(<span class="totalpendingrequest">0</span>)<i class="mdi mdi-refresh mdi-spin" style="display: none;" id="pendingRequestLoading"></i></button></div>
						
					</fieldset>
				</div>
			</div>
			<div>
				<div id="grid"></div>
			</div>
		</div>
	</div>
</div>

<div id="pendingWindow">
	<div id="windowHeader">
		<h5 class="modal-title">Pending Log/s&nbsp;(<span class="totalpendinglog">0</span>)</h5>
	</div>
	<div style="overflow: auto;" id="windowContent">
		<p class="lead">Double click item to insert <b>Dispatch ID</b> to Data Entry Form.<p>
		<div id="pendingLogGrid"></div>
	</div>
</div>

<div id="requestWindow">
	<div id="windowRequestHeader">
		<h5 class="modal-title">Pending Request&nbsp;(<span class="totalpendingrequest">0</span>)&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-link" id="refreshRequest"><i clas="mdi mdi-refresh"></i>Refresh</button></h5>
	</div>
	<div style="overflow: auto;" id="windowRequestContent">
		<div id="pendingRequestGrid"></div>
	</div>
</div>