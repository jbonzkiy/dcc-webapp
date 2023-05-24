<audio  id="firemp3">
	<source src="<?php echo base_url(); ?>assets/sound/fire.mp3" type="audio/mpeg">
</audio>
<div id="marker_legend" class="trans-blur">
	<h3>LEGEND</h3>
	<div><img src="<?php echo base_url(); ?>assets/img/map-img/incident_category_icon/icon_fire.png" > <span style="font-size:1.5vw;">Fire</span></div>
	<div><img src="<?php echo base_url(); ?>assets/img/map-img/incident_category_icon/icon_law_enforcement.png" > <span style="font-size:1.5vw;">Law Enforcement</span></div>
	<div><img src="<?php echo base_url(); ?>assets/img/map-img/incident_category_icon/icon_medical.png" > <span style="font-size:1.5vw;">Medical Emergencies</span></div>
	<div><img src="<?php echo base_url(); ?>assets/img/map-img/incident_category_icon/icon_rescue.png" > <span style="font-size:1.5vw;">Rescue</span></div>
	<div><img src="<?php echo base_url(); ?>assets/img/map-img/incident_category_icon/icon_other_calls.png" > <span style="font-size:1.5vw;">Other Calls</span></div>
	<hr style="border: 1px solid #fff;">
	<div><img src="<?php echo base_url(); ?>assets/img/map-img/cctv_icon.png" > <span style="font-size:1.5vw;">CCTV</span></div>
	<div><img src="<?php echo base_url(); ?>assets/img/map-img/MainStation.png" > <img src="<?php echo base_url(); ?>assets/img/map-img/SubStation.png" > <span style="font-size:1.5vw;">Fire Station</span></div>
	<div><img src="<?php echo base_url(); ?>assets/img/map-img/hospital.png" > <span style="font-size:1.5vw;">Hospital</span></div>
	<div><img src="<?php echo base_url(); ?>assets/img/map-img/police_station.png" > <span style="font-size:1.5vw;">Police Station</span></div>
</div>

<div id="team_content" class="trans-blur">
	<table>		
		<tr>
			<td>A1 - </td><td class="team_stat" data-type="alpha 01"><span>--</span> <span></span></td>
			<td>A6 - </td><td class="team_stat" data-type="alpha 06"><span>--</span> <span></span></td>
			<td>A11 - </td><td class="team_stat" data-type="alpha 11"><span>--</span> <span></span></td>
			<td>RV 1 - </td><td class="team_stat" data-type="rv 01"><span>--</span> <span></span></td>
			<td>RV 6 - </td><td class="team_stat" data-type="rv 06"><span>--</span> <span></span></td>
			<td>RESCUE TRUCK - </td><td class="team_stat" data-type="rescue truck"><span>--</span> <span></span></td>
		</tr>
		<tr>
			<td>A2 - </td><td class="team_stat" data-type="alpha 02"><span>--</span> <span></span></td>
			<td>A7 - </td><td class="team_stat" data-type="alpha 07"><span>--</span> <span></span></td>
			<td>A12 - </td><td class="team_stat" data-type="alpha 12"><span>--</span> <span></span></td>
			<td>RV 2 - </td><td class="team_stat" data-type="rv 02"><span>--</span> <span></span></td>
			<td>KIA 1 - </td><td class="team_stat" data-type="kia 01"><span>--</span> <span></span></td>
			<td>TRAVIZ 1 - </td><td class="team_stat" data-type="traviz 01"><span>--</span> <span></span></td>
		</tr>
		<tr>
			<td>A3 - </td><td class="team_stat" data-type="alpha 03"><span>--</span> <span></span></td>
			<td>A8 - </td><td class="team_stat" data-type="alpha 08"><span>--</span> <span></span></td>
			<td>A14 - </td><td class="team_stat" data-type="alpha 14"><span>--</span> <span></span></td>
			<td>RV 3 - </td><td class="team_stat" data-type="rv 03"><span>--</span> <span></span></td>
			<td>KIA 2 - </td><td class="team_stat" data-type="kia 02"><span>--</span> <span></span></td>
			<td>TRAVIZ 2 - </td><td class="team_stat" data-type="traviz 02"><span>--</span> <span></span></td>
		</tr>
		<tr>
			<td>A4 - </td><td class="team_stat" data-type="alpha 04"><span>--</span> <span></span></td>
			<td>A9 - </td><td class="team_stat" data-type="alpha 09"><span>--</span> <span></span></td>
			<td>A15 - </td><td class="team_stat" data-type="alpha 15"><span>--</span> <span></span></td>
			<td>RV 4 - </td><td class="team_stat" data-type="rv 04"><span>--</span> <span></span></td>
			<td>KIA 3 - </td><td class="team_stat" data-type="kia 03"><span>--</span> <span></span></td>
			
		</tr>
		<tr>
			<td>A5 - </td><td class="team_stat" data-type="alpha 05"><span>--</span> <span></span></td>
			<td>A10 - </td><td class="team_stat" data-type="alpha 10"><span>--</span> <span></span></td>
			<td>A16 - </td><td class="team_stat" data-type="alpha 16"><span>--</span> <span></span></td>
			<td>RV 5 - </td><td class="team_stat" data-type="rv 05"><span>--</span> <span></span></td>
			<td>TANKER 1 - </td><td class="team_stat" data-type="tanker 01"><span>--</span> <span></span></td>
		</tr>
	</table>
</div>

<div id="open_incident" style="position:fixed;top:10px;right:10px;width: 40px;height: 40px;font-size: 30px;background-color: #fff;color:#666;border-radius: 3px;text-align: center;cursor: pointer;z-index: 998;" title="Open incident list"><i class="fa fa-caret-square-left"></i></div>
<div id="incidents" class="card" style="display:none;width: 425px;z-index: 999;">
	<div class="card-header text-white bg-primary" style="font-size: 1.5vw;">
		<button type="button" class="close" id="close_incident" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Incidents <span id="incident_count"></span></div>
	<div class="card-body" id="incident_content" style="max-height:94%;overflow-y: auto;padding:0;">
		
	</div>
</div>

<div id="map2" style="width: 100vw; height: 100vh"></div>
<script>
	// document.getElementById("map2").style.height = window.innerHeight+'px';
	// document.getElementById("map2").style.width = window.innerWidth+'px';
</script>



<!--
<div id="team_content2">
	<table>
		<tr>
			<td>ALPHA 1 - </td><td class="team_stat" data-type="alpha 01"><span style="color:#008000;">--</span> <span></span></td>
		</tr>
		<tr>
			<td>ALPHA 2 - </td><td class="team_stat" data-type="alpha 02"><span style="color:#008000;">--</span> <span></span></td>
		</tr>
		<tr>
			<td>ALPHA 3 - </td><td class="team_stat" data-type="alpha 03"><span style="color:#008000;">--</span> <span></span></td>
		</tr>
		<tr>
			<td>ALPHA 4 - </td><td class="team_stat" data-type="alpha 04"><span style="color:#008000;">--</span> <span></span></td>
		</tr>
		<tr><td><hr></td></tr>
		<tr>
			<td>RV 1 - </td><td class="team_stat" data-type="rv 01"><span style="color:#008000;">--</span> <span></span></td>
		</tr>
		<tr>
			<td>RV 2 - </td><td class="team_stat" data-type="rv 02"><span style="color:#008000;">--</span> <span></span></td>
		</tr>
		<tr>
			<td>RV 3 - </td><td class="team_stat" data-type="rv 03"><span style="color:#008000;">--</span> <span></span></td>
		</tr>
		<tr>
			<td>RV 4 - </td><td class="team_stat" data-type="rv 04"><span style="color:#008000;">--</span> <span></span></td>
		</tr>
		<tr>
			<td>RV 5 - </td><td class="team_stat" data-type="rv 05"><span style="color:#008000;">--</span> <span></span></td>
		</tr>
		<tr>
			<td>RV 6 - </td><td class="team_stat" data-type="rv 06"><span style="color:#008000;">--</span> <span></span></td>
		</tr>
		<tr><td><hr></td></tr>
		<tr>
			<td>KIA 1 - </td><td class="team_stat" data-type="kia 01"><span style="color:#008000;">--</span> <span></span></td>
		</tr>
		<tr>
			<td>KIA 2 - </td><td class="team_stat" data-type="kia 02"><span style="color:#008000;">--</span> <span></span></td>
		</tr>
		<tr>
			<td>KIA 3 - </td><td class="team_stat" data-type="kia 03"><span style="color:#008000;">--</span> <span></span></td>
		</tr>
	</table>
</div>
-->