<?php
	$ws = array('None'=>'','Localized Thunderstorm'=>'Localized thunderstorm','Northeast Monsoon'=>'Amihan','Soutwest Monsoon'=>'Habagat','Tropical Cyclone'=>'Tropical Cyclone','Easterlies'=>'Easterlies','Tail-End of a Cold Front'=>'Tail-End of a Cold Front','ITCZ'=>'ITCZ','Low Pressure Area'=>'LPA','High Pressure Area'=>'HPA','Trough of LPA'=>'Trough of LPA', 'Trough of LPA Outside PAR'=>'Trough of LPA Outside PAR','Trough of Cyclone'=>'Trough of Cyclone','Northeasterly Surface Windflow'=>'Northeasterly surface windflow','Frontal System'=>'Frontal System','Monsoon Trough'=>'Monsoon Trough','Soutwesterlies'=>'Southwesterlies','Southwesterly Surface Windflow'=>'Southwesterly surface windflow','Northwesterly'=>'Northwesterly','NWSW Winds Convergence'=>'Northwesterly and Southwesterly Winds Convergence','Northeasterlies'=>'Northeasterlies','Tail-End of a Frontal System'=>'Tail-End of a Frontal System');
?>
<div class="ui container" style="padding-top: 20px;">
	<h3 class="ui header">Weather Disturbance Comparison</h3>
	<div class="ui divider"></div>
	<form class="ui mini form">
		<div class="fields">
			<div class="field">
				<label>From:</label>
				<input type="date" id="fdt">
			</div>
			<div class="field">
				<label>To:</label>
				<input type="date" id="tdt">
			</div>
		</div>
		<div class="five fields">
			<div class="field">
				<label>Weather System</label>
				<select class="ui search dropdown" id="ws">
					<?php foreach ($ws as $key => $value) { ?>
						<option value="<?php echo $value; ?>"><?php echo $key; ?></option>
					<?php } ?>
				</select>
			</div>
			<div class="field">
				<label>Affecting CDO</label>
				<select class="ui search dropdown" id="acdo">
					<?php foreach ($ws as $key => $value) { ?>
						<option value="<?php echo $value; ?>"><?php echo $key; ?></option>
					<?php } ?>
				</select>
			</div>
		</div>
		<button class="ui button primary mini" type="button" id="btn_filter"><i class="icon filter"></i>Apply Filter</button>
	</form>
	

	<div class="ui segment">
		<div class="ui two column very relaxed grid">
			<div class="column">
				<div class="ui horizontal divider">Weather System</div>
				<table class="ui celled table">
					<thead>
						<tr>
							<th>#</th>
							<th>Date/Time Posted</th>
							<th>Weather System</th>
							<th>Source Link</th>
							<th>CDRRMD Link</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="column">
				<div class="ui horizontal divider">Affecting CDO</div>
				<table class="ui celled table">
					<thead>
						<tr>
							<th>#</th>
							<th>Date/Time Posted</th>
							<th>Weather System</th>
							<th>Source Link</th>
							<th>CDRRMD Link</th>
						</tr>
					</thead>
				</table>
			</div>
		</div>
		<div class="ui vertical divider"><i class="arrows alternate horizontal icon" id="vdivider_icn"></i></div>
	</div>
</div>