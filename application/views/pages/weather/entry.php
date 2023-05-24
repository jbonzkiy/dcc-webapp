<style type="text/css">
	.custom input, .custom .field .search, select{width: 100% !important; border-radius: 0 !important;}
	.button{border-radius: 0 !important;}
	.custom legend{font-weight: bolder; padding: 0 3px;}
</style>
<div id="versplit" data-uid="<?php echo $uid; ?>" data-utype="<?php echo $access; ?>">
	<div>
		<div id="vhsplit">
			<div>
				<div style="
			    font-size: 14px;
			    text-align: center;
			    padding: 10px; font-weight: bolder;
			">Weather Data Entry Form</div>
			</div>
			<div>
				<div id="frmPanel">
					<div style="overflow: auto; overflow-x: hidden;">

						<div class="ui tiny form custom" style="padding:10px 10px 20px 10px;">
							<fieldset>
								<legend>SOURCE</legend>
								<div class="field">
									<label>Link:</label>
									<input type="text" id="slnk">
								</div>
								<div class="field">
									<label>Date/Time:</label>
									<input type="datetime-local" id="slnk_dt" value="<?php echo date('Y-m-d\TH:i'); ?>">
								</div>
							</fieldset>
							<br>
							<fieldset>
								<legend>CDRRMD</legend>
								<div class="field">
									<label>Link:</label>
									<input type="text" id="cdrrmdlnk">
								</div>
								<div class="field">
									<label>Date/Time:</label>
									<input type="datetime-local" id="cdrrmdlnk_dt" value="<?php echo date('Y-m-d\TH:i'); ?>">
								</div>
							</fieldset>
							<br>
							<div class="field">
								<label>Type of Post:</label>
								<select id="type_of_post"></select>
							</div>
							<div class="field">
								<label>Type of Advisory:</label>
								<select id="type_of_advi"></select>
							</div>
							<div id="for_earthquake" style="display:none;">
								<fieldset>
									<legend>EARTHQUAKE POST STATUS</legend>
									<div class="inline field">
										<div class="ui radio checkbox">
											<input type="radio" name="estat" value="pending" checked>
											<label>Pending</label>
										</div>
										<div class="ui radio checkbox">
											<input type="radio" name="estat" value="final">
											<label>Final</label>
										</div>
									</div>
									</fieldset>
									</div>
					<!--<div id="for_rescues" style="display:none;">
					<fieldset>
					<legend>Type of Runs</legend>
					<div class="inline field">
										
					<div class="ui radio checkbox ">
							<input type="radio" name="rescues" value="Fire"checked>
							<br><label>Fire</label></br>
						</div>
										
					<div class="ui radio checkbox ">
						<input type="radio" name="rescues" value="Dead Body">
						<br><label>Dead Body</label></br>
							</div>
										
					<div class="ui radio checkbox ">
					<input type="radio" name="rescues" value="Flood">
						<br><label>Flood&nbsp;&nbsp;&nbsp;</label></br>
						</div>
					<div class="ui radio checkbox ">
					<input type="radio" name="rescues" value="Landslide">
						<br><label>Landslide</label></br>
					</div>
										
				<div class="ui radio checkbox ">
				<input type="radio" name="rescues" value="Vehicular Accident">
					<br><label>Vehicular Accident</label></br>
						</div>
										
				<div class="ui radio checkbox ">
				<input type="radio" name="rescues" value="Simulation">
				<br><label>Simulation</label></br>
						</div>

					</div>
									
				</fieldset>
								
				</div>-->
								<div class="inline field" id="for_rescues" style="display:none;">
								<label>Type of Runs:</label>
								<select class="ui dropdown" name="rescues" id="rescues" >
									<option value="fire">Fire</option>
									<option value="dead body">Dead Body</option>
									<option value="flood">Flood</option>
									<option value="landslide">Landslide</option>
									<option value="vehicular accident">Vehicular Accident</option>
									<option value="simulation">Simulation</option>
								</select>
								
							</div>

							<div class="field" id="cdoaffected_container">
								<label>Is CDO Affected?:</label>
								<select id="cdoaffected">
									<option value="affected">Affected</option>
									<option value="not">Not Affected</option>
									<option value="na">Not Available</option>
								</select>
							</div>
							<div id="affected_area_container">
								<fieldset>
									<legend>AFFECTED AREA</legend>
									<div class="inline field">
										<div class="ui checkbox">
											<input type="checkbox" name="affected_area" value="urban" class="hidden">
											<label>Urban</label>
										</div>
										<div class="ui checkbox">
											<input type="checkbox" name="affected_area" value="riverine" class="hidden">
											<label>Riverine</label>
										</div>
									</div>
								</fieldset>
							</div>
							<div id="daily_ws_container" style="display: none;">
								<fieldset>
									<legend>Weather System affecting CDO</legend>
									<div class="field">
										<label>List:</label>
										<div id="ws_cdo_lst"></div>
									</div>
									<br>
									<fieldset class="tc_container" style="display:none;">
										<legend>Tropical Cyclone&nbsp;<i class="sync alternate loading icon tc_loading" style="display: none;"></i></legend>
										<div class="tc_list_container" data-type="cdo">
											<fieldset>
												<select class="tc_type" id="cdo_tc_type" style="float:left;width: 35% !important;">
													<option value="TD">TD</option>
													<option value="TS">TS</option>
													<option value="STS">STS</option>
													<option value="TY">TY</option>
													<option value="STY">STY</option>
												</select>
												<select class="tc_name" id="cdo_tc_name" style="float:left;width: 54% !important;"></select>
												<i class="plus icon tc_btn" data-action="add" style="float:left;cursor:pointer;margin: 10px 0 0 5px;"></i>
												<select class="int_tc_name" id="cdo_int_tc_name" style="display: none;width:90% !important;"></select>
											</fieldset>
										</div>
									</fieldset>
								</fieldset>
								<br>
								<fieldset>
									<legend>Weather System affecting PAR</legend>
									<div class="field">
										<label>List:</label>
										<div id="ws_par_lst"></div>
									</div>
									<br>
									<fieldset class="tc_container" style="display:none;">
										<legend>Tropical Cyclone&nbsp;<i class="sync alternate loading icon tc_loading" style="display: none;"></i></legend>
										<div class="tc_list_container" data-type="par">
											<fieldset>
												<select class="tc_type" id="par_tc_type" style="float:left;width: 35% !important;">
													<option value="TD">TD</option>
													<option value="TS">TS</option>
													<option value="STS">STS</option>
													<option value="TY">TY</option>
													<option value="STY">STY</option>
												</select>
												<select class="tc_name" id="par_tc_name" style="float:left;width: 54% !important"></select>
												<i class="plus icon tc_btn" data-action="add" style="float:left;cursor:pointer;margin: 10px 0 0 5px;"></i>
												<select class="int_tc_name" id="par_int_tc_name" style="display: none;width:90% !important;"></select>
											</fieldset>
										</div>
									</fieldset>
								</fieldset>
							</div>
							<br>
							<fieldset>
								<legend>INFOCAST</legend>
								<div class="inline field">
									<div class="ui checkbox">
										<input type="checkbox" class="hidden" id="chk_infocast">
										<label>Has sent infocast?</label>
									</div>
								</div>
								<div class="disabled field">
									<label>Total Text Sent (per contact):</label>
									<input type="number" id="infocast_sent_text">
								</div>
								<div class="disabled field">
									<label>Total Contacts Excluded:</label>
									<input type="number" id="total_contacts_excluded">
								</div>
							</fieldset>
							<br>
							<fieldset>
								<legend>MISSED POST</legend>
								<div class="inline field">
									<div class="ui checkbox">
										<input type="checkbox" class="hidden" id="chk_missedpost">
										<label>Is post missed?</label>
									</div>
								</div>
								<div class="disabled field">
									<label>User who missed posting:</label>
									<select id="missed_user">
									<?php 
									foreach($userlst as $row){
									?>
										<option value="<?php echo $row->uid; ?>"><?php echo strtoupper($row->fname); ?></option>
									<?php } ?>
									</select>
								</div>
							</fieldset>
							<br>
							<div class="inline field">
								<div class="ui checkbox">
									<input type="checkbox" id="xprain" class="hidden">
									<label style="font-weight: bold;">Has CDO currently experienced rain?</label>
								</div>
							</div>
							<br>
							<div class="field">
								<label>Remarks:</label>
    							<textarea id="remarks"></textarea>
							</div>
							<br>
							<button class="fluid ui positive button" id="btn_submit">Submit</button>
							<br>
							<button class="fluid ui button" id="btn_clear" onclick="return confirm('Are you sure you want to clear entry?')">Clear</button>
						</div>

					</div>
				</div>
			</div>
		</div>
	</div>
	<div>
		<div id="grid"></div>
	</div>
</div>