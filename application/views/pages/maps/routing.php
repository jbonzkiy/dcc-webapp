<div id="alphaselection" class="center-element py-2" style="width: 250px;font-size:1rem; display: none;">
	<center>
		<!-- <img src="https://192.168.0.200/dcc-webapp/assets/img/oro_rescue_logo_100px.png" height="100" width="100" /> -->
		<br><br>
		<h3><i class="mdi mdi-account-group"></i> VEHICLE ROUTING</h3>
	</center>
	<div class="mb-3">
		<label for="ambuno">SELECT ALPHA:</label>
		<select id="teamsel" class="form-control"></select>
	</div>
	<div style="margin-top: 1rem;">
		<button type="button" class="btn btn-primary btn-lg btn-block btn-sm" id="savebtnemscrew" style="font-size:2rem;">SET</button>
	</div>
</div>
<button type="button" class="btn" style="position: fixed; bottom:1rem; left: 1rem;z-index: 2000;border: 1px solid #495057; font-size: 2vw; padding: 1px 6px;" id="togglepan" data-pan="true"><i class="mdi mdi-crosshairs-gps"></i></button>
<div id="controlsContainer" style="font-size: 0.7vw;position:fixed; bottom: 0.6rem; right: 0.6rem; background-color: #fff; height: 20vw;width: 20vw;z-index: 2000; border-radius: 5px; padding:.5rem;overflow: auto; border: 1px solid #495057;">
	<button type="button" class="btn btn-primary btn-sm btn-block" id="changevh">Change Vehicle</button>
	<hr>
	<table id="tbl">
		<tr><th width="50%">Vehicle:</th><td id="vname"></td></tr>
		<tr><th>Call Log ID:</th><td id="cid"></td></tr>
		<tr><th>Time Dispatch:</th><td id="tdispatch"></td></tr>
		<tr><th>Time Depart:</th><td id="tdepart"></td></tr>
		<tr><th>Time Arrived:</th><td id="tarrive"></td></tr>
		<tr><th>Time Accomplished:</th><td id="taccom"></td></tr>
		<tr><th>Land Mark:</th><td id="landmark"></td></tr>
		<tr><th>Remarks:</th></tr>
		<tr><td id="remarks" colspan="2"></td></tr>
	</table>
</div>
<div id="map"></div>
<!-- <button id="editemscrew">edit</button> -->