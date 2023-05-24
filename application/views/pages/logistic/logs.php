<div id="versplit" style="margin-top: 40px;">
	<div>
		<div id="vhsplit">
			<div>
				<div style="
			    font-size: 14px;
			    text-align: center;
			    padding: 10px;background-color: #fff;color:#000;
			"><h4 class="ui horizontal divider header">Requisition Slip</h4></div>
			</div>
			<div>
				<div id="frmPanel">
					<div class="ui form" id="create-form" style="padding: 15px;">
						<div class="field">
							<label>Datetime Borrowed:</label>
    						<input type="datetime-local" class="border-radius-none" name="dtb" id="dtb" value="<?php 
                                $date = new DateTime("now", new DateTimeZone('Asia/Taipei') );
                                echo $date->format('Y-m-d\TH:i'); ?>">
						</div>
						<fieldset>
							<div class="field">
								<label>Item: <i class="sync loading icon" id="itemselloading" style="display: none;"></i></label>
								<select style="width: 228px;" id="data-items"></select>
							</div>
							<div class="field">
								<label>Category:</label>
								<input type="text" class="border-radius-none" readonly="" id="log_category">
							</div>
							<div class="field" style="width: 99%;">
								<label>Qty: <span style="font-weight: normal;font-style: italic;" id="current_qty"></span><span style="float:right;font-weight: normal;" id="current_qty_desc"></span></label>
								
								<div class="fields" id="qty_fields">
									<button class="ui icon red button" id="minus_qty">
										<i class="minus icon"></i>
									</button>
									
									<div class="field">
										<input type="text" id="custom_numeric" />
									</div>
									
									<button class="ui icon green button" id="add_qty">
										<i class="plus icon"></i>
									</button>
								</div>
							</div>
						</fieldset>
						<br>
						<fieldset>
							<div class="field">
								<label>Borrowed By:</label>
								<select style="width: 100%;" id="borrower"></select>
							</div>
							<div class="field">
								<label>Borrower's Division:</label>
								<input type="text" class="border-radius-none" readonly="" id="borrowers_division">
							</div>
							<div class="field" id="vehicle_field">
								<label>Vehicle:</label>
								<select class="border-radius-none" id="vehicle">
									<option></option>
								</select>
							</div>
						</fieldset>
						<br>
						<div class="field">
							<label>Remarks:</label>
    						<textarea id="remarks"></textarea>
						</div>
						<button class="fluid ui primary button border-radius-none" type="submit" id="save">Save</button>
						<br>
						<button class="fluid ui button" id="clear" onclick="return confirm('Are you sure you want to clear entry?')">Clear</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div>
		<div id="loggrid"></div>
	</div>
</div>
<div class="ui small modal editform">
	<div class="header">Return Slip</div>
	<div class="scrolling content">
		<h4 id="update_disp_or_non" style="text-align: center;"></h4>
		
		<table style="width: 100%;">
			<tr>
				<td style="width: 75px; vertical-align:top;">Item Name: </td>
				<td><h4 id="update_item_name"></h4></td>
			</tr>
		</table>
		<table style="width: 100%;padding-top: 15px;">
			<tr>
				<td style="width: 63%;"><div>Borrower: <span style="font-size: 15px; font-weight: bold;" id="update_borrower"></span></div></td>
				<td style="width: 37%;"><div>Division: <span style="font-size: 14px; font-weight: bold;" id="update_borrower_div"></span></div></td>
			</tr>
			<tr>
				<td style="width: 63%;"><div>Borrowed Qty: <span style="font-size: 15px; font-weight: bold;" id="update_borrowed_qty"></span></div></td>
				<td style="width: 37%;"><div>Category: <span style="font-size: 14px; font-weight: bold;" id="update_log_category"></span></div></td>
			</tr>
			<tr>
				<td style="width: 63%;"><div>Datetime Borrowed: <span style="font-size: 15px; font-weight: bold;" id="update_dt_borrowed"></span></div></td>
				<td style="width: 37%;"><div>Vehicle: <span style="font-size: 14px; font-weight: bold;" id="update_vehicle"></span></div></td>
			</tr>
		</table>
		
		<div class="ui clearing divider"></div>

		<div class="ui form" id="update-form" style="margin-top: 30px;">
			<fieldset id="waste_item_fieldset">
				<legend>Waste Item</legend>
				<div class="field ui checkbox">
					<label>Is there any waste item(s)?</label>
					<input type="checkbox" name="is_waste" id="is_waste">
				</div>
				<br>
				<div class="field" id="waste_qty_field">
					<label>How many?</label>
					<input type="number" class="border-radius-none" id="waste_qty" min="1">
				</div>
			</fieldset>
			<br>
			<fieldset>
				<legend>Returner</legend>
				<div class="field">
					<label>Datetime Returned:</label>
					<input type="datetime-local" class="border-radius-none" id="update_dt_returned">
				</div>
				<div class="field">
					<label>Returned By:</label>
					<select style="width: 100%;" id="update_returner"></select>
				</div>
				<div class="field">
					<label>Returner's Division:</label>
					<input type="text" class="border-radius-none" readonly="" id="update_returner_div">
				</div>
			</fieldset>
			<br>
			<div class="field">
				<label>Received By:</label>
				<input type="text" class="border-radius-none" id="update_received_by">
			</div>
			<div class="field">
				<label>Remarks:</label>
				<textarea id="update_remarks"></textarea>
			</div>
		</div>
	</div>
	<div class="actions">
		<div class="ui primary button border-radius-none" id="save_return_item">Save</div>
		<div class="ui cancel button border-radius-none">Cancel</div>
	</div>
</div>