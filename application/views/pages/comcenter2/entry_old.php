<!-- <nav class="navbar fixed-top navbar-dark bg-dark">
	<span class="navbar-brand mb-0 h1"><i class="mdi mdi-radio-tower"></i>COMCENTER</span>
</nav> -->
<div id="main_splitter" style="/*margin-top: 57px;*/">
	<div>
		<div id="nested_splitter">
			<div>
				<div id="new_entry_panel">
					<form class="p-3">
						<div class="row">
							<div class="col-sm-8">
								<label for="dt">Date:</label>
								<input type="date" id="dt" class="form-control form-control-sm rounded-0">
							</div>
							<div class="col-sm-4">
								<label for="t">Time:</label>
								<input type="time" id="t" class="form-control form-control-sm rounded-0">
							</div>
						</div>
						<div class="row mt-2">
							<div class="col">
								<label for="call_orig">Call Origin:</label>
								<select class="form-control form-control-sm rounded-0" id="call_orig">
									<option>Radio</option>
									<option>Telephone</option>
									<option>Walk-in</option>
									<option>CDRRMD</option>
								</select>
							</div>
							<div class="col">
								<label for="call_source">Source of info:</label>
								<select class="form-control form-control-sm rounded-0" id="call_source">
									<option>Informant</option>
									<option>Complainant</option>
									<option>Victim</option>
								</select>
							</div>
						</div>
						<div class="form-group mt-2">
							<label for="caller_name">Caller's Name:</label>
							<input type="text" class="form-control form-control-sm rounded-0" id="caller_name">
						</div>
						<div class="form-group mt-2">
							<label for="caller_num">Contact Number:</label>
							<input type="number" class="form-control form-control-sm rounded-0" id="caller_num">
						</div>
						<div class="form-group mt-2">
							<label for="call_type">Call Type:</label>
							<select class="form-control form-control-sm rounded-0" id="call_type">
								<option>Alarm</option>
							</select>
						</div>
						<div class="form-group mt-2">
							<label for="incident_location">Incident Location:</label>
							<select class="form-control form-control-sm rounded-0" id="incident_location">
								<option>Alarm</option>
							</select>
						</div>
						<div class="form-group mt-2">
							<label for="coor">Coordinates:</label>
							<input type="number" class="form-control form-control-sm rounded-0" id="coor">
						</div>
					</form>
				</div>
			</div>
			<div>
				<div id="map" style="height: 100%;width: 100%;"></div>
			</div>
		</div>
	</div>

	<div>
		table
	</div>
</div>