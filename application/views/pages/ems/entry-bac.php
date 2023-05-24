<div id="firstloading" style="position:absolute;top:0;left:0;z-index:9999;height: 100%;width: 100%;background: #fff url(http://192.168.0.200/dcc-webapp/assets/img/ems_logo.png) no-repeat fixed center;background-size: 400px;">
	<div class="center-loading"><i class="mdi mdi-autorenew mdi-spin" style="font-size: 200px;color:#fff;"></i></div>
</div>
<div class="container-fluid" style="margin-top: 56px!important;">
	<div class="row">
		<div class="col-md-3">
			<fieldset>
				<legend class="text-dark">EMS Data Entry Form</legend>
				<div id="frmPanel" style="">
					<div class="px-4 py-2">
						
						<div class="form-group no-gutters">
							<label for="did">Dispatch ID: <small id="errDid" style="display:none;cursor: help; color: #FE0000;"><abbr title="No data match with the given Dispatch ID">(Invalid Dispatch ID)</abbr></small></label>
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
							<label for="pname">Patient's Name:</label>
							<input type="text" class="form-control form-control-sm rounded-0" id="pname">
						</div>
						<div class="form-group">
							<label for="age">Age:</label>
							<select class="form-control form-control-sm rounded-0" id="age">
								<option value="1">Neonate (0 to 1 month)</option>
								<option value="2">Infant (1 month to 1 year)</option>
								<option value="3">Toddler (1 to 3 years)</option>
								<option value="4">Preschool age (3 to 6 years)</option>
								<option value="5">School Age (6 to 12 years)</option>
								<option value="6">Adolescent (12 to 18 years)</option>
								<option value="7">Early adult (19 to 40 years)</option>
								<option value="8">Middle adult (41 to 60 years)</option>
								<option value="9">Late adult (61 and older)</option>
							</select>
						</div>
						
						<div class="form-group">
							<label for="casetype">Case Type Description:</label>
							<select class="form-control form-control-sm rounded-0" id="casetype"></select>
						</div>
						<div class="form-group" id="subcase" style="display: none;">
							<label for="subcasetype">Sub Case Type:</label>
							<select class="form-control form-control-sm rounded-0" id="subcasetype"></select>
						</div>
						
						<div class="custom-control custom-radio custom-control-inline">
							<input type="radio" name="gender" id="genderMale" value="male" class="custom-control-input" checked>
							<label class="custom-control-label" for="genderMale">Male</label>
						</div>
						<div class="custom-control custom-radio custom-control-inline">
							<input type="radio" name="gender" id="genderFemale" value="female" class="custom-control-input">
							<label class="custom-control-label" for="genderFemale">Female</label>
						</div>
						<br><br>
						<div class="form-group">
							<label for="hospital">Transported To:</label>
							<select class="form-control form-control-sm rounded-0" id="hospital"></select>
						</div>
						<div class="form-group" id="spHospitalContainer" style="display: none;">
							<label for="spHospital">Specific Location:</label>
							<input type="text" class="form-control form-control-sm rounded-0" id="spHospital">
						</div>
						<div class="form-group">
							<div class="field">
								<label>Remarks</label>
								<textarea class="form-control form-control-sm rounded-0" id="remarks"></textarea>
							</div>
						</div>
						<!-- <div class="form-group" id="spHospitalContainer">
							<label for="lnk">Link:</label>
							<input type="file" class="form-control form-control-sm rounded-0" name="lnk" id="lnk">
						</div> -->
						<button type="button" id="submit" class="btn btn-dark btn-sm rounded-0 btn-block">Save</button>
						<button type="button" style="display: none;" id="clear" class="btn btn-info btn-sm rounded-0 btn-block">New</button>
					</div>
				</div>
			</fieldset>
		</div>
		<div class="col-md" id="gridcontainer">
			<div class="p-2" style="background-color: #F4F4F4;">
				<fieldset>
					<legend class="text-dark">Date Added Filter</legend>
					<div class="float-left mr-2"><span>From:</span><br><input type="date" id="fdt"/></div>
					<div class="float-left mr-2"><span>To:</span><br><input type="date" id="tdt"/></div>
					<div class="float-left mr-2"><br><button class="btn btn-primary btn-sm rounded-0" type="button" id="btnSearch">Filter</button></div>
					<div class="float-left mr-2"><br><button type="button" class="btn btn-danger btn-sm rounded-0" id="btnClearSearch">Clear Filter</button></div>
					<div class="float-right mr-2"><br><button type="button" class="btn btn-secondary btn-sm rounded-0" id="btnRefresh">Refresh Data</button></div>
				</fieldset>
			</div>
			<div id="grid"></div>
		</div>
	</div>
</div>