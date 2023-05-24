<div id="emscrew" class="center-element py-2" style="width: 250px;height: 100%;font-size:1rem; display: none;">
	<center>
		<img src="http://192.168.0.200/dcc-webapp/assets/img/ems_logo.png" height="100" width="100" />
		<br><br>
		<h3><i class="mdi mdi-account-group"></i> EMS CREW</h3>
	</center>
	<div class="mb-3">
		<label for="ambuno">AMBULANCE NO</label>
		<input type="number" class="form-control form-control-sm" id="ambuno">
	</div>
	<div class="mb-3">
		<label for="eic">EMS IN CHARGE</label>
		<input type="text" class="form-control form-control-sm" id="eic">
	</div>
	<div class="mb-3">
		<label for="ea1">EMS ASSISTANT</label>
		<input type="text" class="form-control form-control-sm" id="ea1">
	</div>
	<div class="mb-3">
		<label for="ea2">EMS ASSISTANT</label>
		<input type="text" class="form-control form-control-sm" id="ea2">
	</div>
	<div class="mb-3">
		<label for="ea3">EMS ASSISTANT</label>
		<input type="text" class="form-control form-control-sm" id="ea3">
	</div>
	<div class="mb-3">
		<label for="eo">EMS OPERATOR</label>
		<input type="text" class="form-control form-control-sm" id="eo">
	</div>
	<div class="d-grid gap-2">
		<button type="button" class="btn btn-success btn-lg btn-block btn-sm" id="savebtnemscrew">SAVE</button>
	</div>
</div>
<div id="mainapp" style="display: none;font-size: 1rem;padding-bottom: 10px !important;">
	<nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark text-white">
		<div class="container-fluid">
			<a class="navbar-brand" href="#">
			<img src="http://192.168.0.200/dcc-webapp/assets/img/ems_logo.png" class="d-inline-block align-text-top" style="width: 30px;height: auto;" /> EPCR</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navtoggle" aria-controls="navtoggle" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>

			<div class="collapse navbar-collapse" id="navtoggle">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item"><a class="nav-link active" href="javascript:void(0)"><i class="mdi mdi-account-badge-horizontal-outline"></i> PPCR FORM</a></li>
					<li class="nav-item"><a class="nav-link" href="javascript:void(0)"><i class="mdi mdi-history"></i> HISTORY</a></li>
				</ul>
				<ul class="navbar-nav ml-auto">
					<li class="nav-item"><a class="nav-link" href="javascript:void(0)"><i class="mdi mdi-printer"></i> PRINT</a></li>
					<li class="nav-item"><a class="nav-link" href="javascript:void(0)" id="editemscrew"><i class="mdi mdi-account-group"></i> EDIT EMS CREW</a></li>
				</ul>
			</div>
		</div>
	</nav>

	<div class="p-2" style="margin-top:4rem;">
		<div class="accordion" id="eppcrForm">
			<div class="accordion-item">
				<h2 class="accordion-header" id="heading1">
					<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
					Response Info
					</button>
				</h2>
				<div id="collapse1" class="accordion-collapse collapse show" aria-labelledby="heading1" data-bs-parent="#eppcrForm">
					<div class="accordion-body">
						<div class="row g-2">
							<div class="col-md-2">
								<label for="dt">Date/Time</label>
								<input type="datetime-local" class="form-control form-control-sm" id="dt">
							</div>
							<div class="col-md-2">
								<label for="dt_tas">Time Arrived at Scene</label>
								<input type="datetime-local" class="form-control form-control-sm" id="dt_tas">
							</div>
							<div class="col-md-2">
								<label for="dt_tls">Time Left Scene</label>
								<input type="datetime-local" class="form-control form-control-sm" id="dt_tls">
							</div>
							<div class="col-md-2">
								<label for="dt_tah">Time Arrived at Hospital</label>
								<input type="datetime-local" class="form-control form-control-sm" id="dt_tah">
							</div>
							<div class="col-md-4">
								<label for="ht">Hospital Transported To</label>
								<input type="text" class="form-control form-control-sm" id="ht">
							</div>
						</div>
						<div class="row g-2 mt-2">
							<div class="col-md-4">
								<label for="rteam">Response Team</label>
								<input type="text" class="form-control form-control-sm" id="rteam">
							</div>
							<div class="col-md-4">
								<label for="rcode">Response Code</label>
								<input type="text" class="form-control form-control-sm" id="rcode">
							</div>
							<div class="col-md-4">
								<label for="rfrom">Response From</label>
								<input type="text" class="form-control form-control-sm" id="rfrom">
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="accordion-item">
				<h2 class="accordion-header" id="heading2">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
					Patient's Personal Info
					</button>
				</h2>
				<div id="collapse2" class="accordion-collapse collapse" aria-labelledby="heading2" data-bs-parent="#eppcrForm">
					<div class="accordion-body">
						<div class="row g-2">
							<div class="col-md-1">
								<label for="casetype">Case Type</label>
								<select class="form-select form-select-sm" id="casetype">
									<option value="53">Medical</option><option value="54">Trauma</option>
				                </select>
							</div>
							<div class="col-md-3">
								<label for="ct_desc">Case Description <small class="text-secondary">(Optional)</small></label>
								<input type="text" class="form-control form-control-sm" id="ct_desc" placeholder="Additional description. eg.(OB Case, OB Transport, etc...)">
							</div>
							<div class="col-md-3">
								<label for="loc">Location</label>
								<input type="text" class="form-control form-control-sm" id="loc">
							</div>
							<div class="col-md-2">
								<label for="pname">Name of Patient</label>
								<input type="text" class="form-control form-control-sm" id="pname">
							</div>
							<div class="col-md-3">
								<label for="padd">Home Address</label>
								<input type="text" class="form-control form-control-sm" id="padd">
							</div>
						</div>
						<div class="row g-2 mt-2">
							<div class="col-md-1">
								<label for="age">Age</label>
								<input type="number" class="form-control form-control-sm" id="age">
							</div>
							<div class="col-md-1">
								<label for="pgender">Gender</label>
								<select class="form-select form-select-sm" id="pgender">
									<option value="male">Male</option><option value="female">Female</option>
				                </select>
							</div>
							<div class="col-md-1">
								<label for="pweight">Weight</label>
								<input type="text" class="form-control form-control-sm" id="pweight">
							</div>
							<div class="col-md-1">
								<label for="pheight">Height</label>
								<input type="text" class="form-control form-control-sm" id="pheight">
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="accordion-item">
				<h2 class="accordion-header" id="heading3">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
					Patient's Significant Other/s
					</button>
				</h2>
				<div id="collapse3" class="accordion-collapse collapse" aria-labelledby="heading3" data-bs-parent="#eppcrForm">
					<div class="accordion-body">
						<div class="row g-2">
							<div class="col-md-3">
								<label for="pso">Name/s of Significant Other/s</label>
								<input type="text" class="form-control form-control-sm" id="pso">
							</div>
							<div class="col-md-3">
								<label for="rp">Relation to Patient</label>
								<input type="text" class="form-control form-control-sm" id="rp">
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="accordion-item">
				<h2 class="accordion-header" id="heading4">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
					DOI, NOI, TOI, POI
					</button>
				</h2>
				<div id="collapse4" class="accordion-collapse collapse" aria-labelledby="heading4" data-bs-parent="#eppcrForm">
					<div class="accordion-body">
						<div class="row g-2">
							<div class="col-md-3">
								<label for="pso">DOI</label>
								<input type="text" class="form-control form-control-sm dntp" data-field="d">
							</div>
							<div class="col-md-3">
								<label for="pso">NOI</label>
								<input type="text" class="form-control form-control-sm dntp" data-field="n">
							</div>
							<div class="col-md-3">
								<label for="pso">TOI</label>
								<input type="text" class="form-control form-control-sm dntp" data-field="t">
							</div>
							<div class="col-md-3">
								<label for="rp">POI</label>
								<input type="text" class="form-control form-control-sm dntp" data-field="p">
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="accordion-item">
				<h2 class="accordion-header" id="heading5">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
					Chief Complaint
					</button>
				</h2>
				<div id="collapse5" class="accordion-collapse collapse" aria-labelledby="heading5" data-bs-parent="#eppcrForm">
					<div class="accordion-body">
						<div id="cc" class="summernote"></div>
					</div>
				</div>
			</div>
			<div class="accordion-item">
				<h2 class="accordion-header" id="heading6">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse6" aria-expanded="false" aria-controls="collapse6">
					History (S.A.M.P.L.E)
					</button>
				</h2>
				<div id="collapse6" class="accordion-collapse collapse" aria-labelledby="heading6" data-bs-parent="#eppcrForm">
					<div class="accordion-body">
						<div class="row g-2">
							<div class="col-md-4">
								Symptoms
								<div data-field="s" class="summernote sample"></div>
							</div>
							<div class="col-md-4">
								Allergies
								<div data-field="a" class="summernote sample"></div>
							</div>
							<div class="col-md-4">
								Medication
								<div data-field="m" class="summernote sample"></div>
							</div>
						</div>
						<div class="row g-2 mt-2">
							<div class="col-md-4">
								Past Medical History
								<div data-field="p" class="summernote sample"></div>
							</div>
							<div class="col-md-4">
								Last In and Out
								<div data-field="l" class="summernote sample"></div>
							</div>
							<div class="col-md-4">
								Events
								<div data-field="e" class="summernote sample"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="accordion-item">
				<h2 class="accordion-header" id="heading7">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse7" aria-expanded="false" aria-controls="collapse7">
					Interventions
					</button>
				</h2>
				<div id="collapse7" class="accordion-collapse collapse" aria-labelledby="heading7" data-bs-parent="#eppcrForm">
					<div class="accordion-body">
						<div id="interventions" class="summernote"></div>
					</div>
				</div>
			</div>
			<div class="accordion-item">
				<h2 class="accordion-header" id="heading8">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse8" aria-expanded="false" aria-controls="collapse8">
					Vital Signs
					</button>
				</h2>
				<div id="collapse8" class="accordion-collapse collapse" aria-labelledby="heading8" data-bs-parent="#eppcrForm">
					<div class="accordion-body">
						
					</div>
				</div>
			</div>
			<div class="accordion-item">
				<h2 class="accordion-header" id="heading9">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse9" aria-expanded="false" aria-controls="collapse9">
					Notes
					</button>
				</h2>
				<div id="collapse9" class="accordion-collapse collapse" aria-labelledby="heading9" data-bs-parent="#eppcrForm">
					<div class="accordion-body">
						<div id="notes" class="summernote"></div>
					</div>
				</div>
			</div>
			<div class="accordion-item">
				<h2 class="accordion-header" id="heading10">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse10" aria-expanded="false" aria-controls="collapse10">
					Receiving
					</button>
				</h2>
				<div id="collapse10" class="accordion-collapse collapse" aria-labelledby="heading10" data-bs-parent="#eppcrForm">
					<div class="accordion-body">
						<div class="row g-2">
							<div class="col-md-2">
								<label for="revdt">Date/Time Received</label>
								<input type="datetime-local" class="form-control form-control-sm dntp" id="revdt">
							</div>
							<div class="col-md-3">
								<label for="revname">Physician/Nurse on Duty</label>
								<input type="text" class="form-control form-control-sm dntp" id="revname">
							</div>
						</div>
						<div class="row g-2 mt-2">
							<div class="col-md-3">
								<label for="sigcanvas">Signature&nbsp;&nbsp;&nbsp;<span style="cursor: pointer; display: none;" class="text-primary" id="sigclr">Clear</span></label>
								<div id="sigcanvas" style="border:1px solid #000; overflow: hidden;"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>