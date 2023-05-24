<center><div class="container" style="height: 100%;">
	<div id="controlContainer">
		<label for="selYear">Year:</label>
		<select id="selYear">
			<?php
			for($i=2099;$i>=2020;$i--){
		?>
			<option value="<?php echo $i; ?>" <?php echo ($i == date('Y')?'selected':''); ?> ><?php echo $i; ?></option>
		<?php } ?>
		</select>
		

		<button type="button" style="border:1px solid #767676" id="btnGenerate">Generate Report</button>
		<button type="button" style="border:1px solid #767676" id="btnPrint"><i class="mdi mdi-printer"></i>&nbsp;Print</button>
	</div>
	<div style="overflow-y: auto;width: 80%;" id="printableContent">
		<div class="p-5"style="font-family: Bell MT;font-size: 16px;">
			<img src="<?php echo base_url(); ?>assets/img/cdo_logo.png" style="height: 100px; width: auto;float: left;"/>
			<img src="<?php echo base_url(); ?>assets/img/oro_rescue_logo.png" style="height: 100px; width: auto;float: right;"/>
			<center>
				Republic of the Philippines<br>City of Cagayan de Oro<br>CITY DISASTER RISK REDUCTION AND MANAGEMENT DEPARTMENT<br>ORO RESCUE 911
			</center>

		</div>
		<div class="px-5 font-weight-bold" style="font-family: Calibri;font-size: 15px;">
			<table width="100%">
				<tr>
					<td class="pr-3">TO</td><td class="pr-3">:</td><td>NICK A. JABAGAT</td>
				</tr>
				<tr>
					<td></td><td></td><td>CDRRMD - OFFICER IN CHARGE</td>
				</tr>
				<tr>
					<td>CC</td><td>:</td><td>JOHN ROSS L. ESCOLTOS</td>
				</tr>
				<tr>
					<td></td><td></td><td>EMS UNIT CHIEF</td>
				</tr>
				<tr>
					<td>DATE</td><td>:</td><td><input type="text" id="dtcreated" value="<?php echo date('F Y') ?>" style="font-weight: bold;border: none;font-size: 16px;text-transform: uppercase;color: #212529;margin-left: -2px;"/></td>
				</tr>
				<tr>
					<td>RE</td><td>:</td><td>RUN CENSUS FOR THE MONTH OF <input type="text" id="cencusyr" value="<?php echo date('Y') ?>" style="font-weight: bold;border: none;font-size: 16px;text-transform: uppercase;color: #212529;"/></td>
				</tr>
			</table>
			<hr style="border:1px #000 dashed;">
		</div>
		<div id="output" class="px-5"></div>
	</div>
</div>