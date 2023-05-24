<div style="padding-top: 40px; width: 100%; height: 100%;">
	<div id="horizontal_splitter">
		<div>
			<div id="itemgrid"></div>
		</div>
		<div>
			<div id="nested_splitter_1">
				<div id='itemSelectedTabs'>
					<ul style='margin-left: 20px;'>
						<li>Added QTY</li>
						<li>Waste QTY</li>
					</ul>
					<div style="padding: 5px">
						<div id="itemAddTotalGrid"></div>
					</div>
					<div style="padding: 5px">
						<div id="itemWasteGrid"></div>
					</div>
				</div>
				<div id="itemdetailsgrid"></div>
			</div>
		</div>
    </div>
</div>
<div id="windowcontainer" style="display: none;">
	<div id="importExcelWindow">
		<div id="windowHeader">
			<span>Import Excel</span>
		</div>
		<div style="overflow: hidden;overflow-y: auto;" id="windowContent">
			<div id="importcontent">
				<div id="jqxFileUpload"></div>
				<div class="ui divider"></div>
				<div id="jqxTabs">
					<ul>
						<li style="margin-left: 10px;">Existing item/s <span id="existTabHead"></span></li>
		                <li>Added item/s <span id="addTabHead"></span></li>
					</ul>
					<div style="padding:10px;">
						<div id="existGrid"></div>
					</div>
					<div style="padding:10px;">
						<div id="addedGrid"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="ui mini modal addnewitemform">
	<div class="header">Add New Item Form</div>
	<div class="scrolling content">
		<div class="ui form" id="frmPanel">
			<div class="inline fields">
				<label for="disp_or_non"></label>
				<div class="field">
					<div class="ui radio checkbox">
						<label>Disposable</label>
						<input type="radio" name="disp_or_non" checked="" value="disposable" tabindex="0" class="hidden">
					</div>
				</div>
				<div class="field">
					<div class="ui radio checkbox">
						<label>Non-Disposable</label>
						<input type="radio" name="disp_or_non" value="non-disposable" tabindex="0" class="hidden">
					</div>
				</div>
			</div>
			<div class="ui section divider"></div>
			<div class="field">
				<label>Item Name:</label>
				<input type="text" class="border-radius-none" id="itemname">
			</div>
			<div class="fields">
				<div class="field">
					<label>Quantity:</label>
					<input type="number" class="border-radius-none" id="total_qty">
				</div>
				<div class="field">
					<label>Unit:</label>
					<input type="text" class="border-radius-none" id="unit">
				</div>
			</div>
			<div class="field" id="category_field">
				<label>Category:</label>
				<select class="border-radius-none" id="category">
					<option></option>
				</select>
			</div>
			<div class="field" id="description_field">
				<label>Description:</label>
				<textarea id="description"></textarea>
			</div>
			<div class="field" id="receiptno_field">
				<label>Delivery Receipt no:</label>
				<input type="text" class="border-radius-none" id="receiptno">
			</div>
			<div class="field" id="mrto_field">
				<label>MR To:</label>
				<select style="width: 100%;" id="mr_to"></select>
			</div>
			<div class="field">
				<label>Remarks:</label>
				<textarea id="remarks"></textarea>
			</div>
		</div>
	</div>
	<div class="actions">
		<div class="ui primary button border-radius-none" id="saveitem">Save</div>
		<div class="ui cancel button border-radius-none">Cancel</div>
	</div>
</div>

<div class="ui large modal itemlogmodal">
	<div class="header"></div>
	<div class="scrolling content">
		<div id='itemListTabs'>
			<ul style='margin-left: 20px;'>
				<li>Item History</li>
			</ul>
			<div style="padding: 5px">
				<div id="itemloggrid"></div>
			</div>
		</div>
	</div>
	<div class="actions">
		<div class="ui cancel button border-radius-none">Close</div>
	</div>
</div>


<div class="ui small modal wasteItemModal">
	<div class="header"></div>
	<div class="scrolling content">
		
	</div>
	<div class="actions">
		<div class="ui cancel button border-radius-none">Close</div>
	</div>
</div>


<div class="ui small modal wasteitemform">
	<div class="header">Waste Slip</div>
	<div class="scrolling content">
		<h4 id="w_disp_or_non" style="text-align: center;"></h4>
		
		<table style="width: 100%;">
			<tr>
				<td style="width: 75px; vertical-align:top;">Item Name: </td>
				<td><h4 id="w_item_name"></h4></td>
			</tr>
		</table>
		<table style="width: 100%;padding-top: 15px;">
			<tr>
				<td style="width: 60%;"><div>Total Qty: <span style="font-size: 15px; font-weight: bold;" id="w_total_qty"></span></div></td>
				<td style="width: 40%;"><div>Category: <span style="font-size: 14px; font-weight: bold;" id="w_category"></span></div></td>
			</tr>
			<tr>
				<td style="width: 50%;"><div>Available Qty: <span style="font-size: 15px; font-weight: bold;" id="w_avail_qty"></span></div></td>
				<td style="width: 50%;"><div>Borrowed Qty: <span style="font-size: 14px; font-weight: bold;" id="w_borrowed_qty"></span></div></td>
			</tr>
		</table>
		
		<div class="ui clearing divider"></div>

		<div id="itemWasteFormGrid"></div>
		<br/>
		<div class="ui form" id="wasteFormPanel">
			<div class="field">
				<label>Remarks:</label>
				<textarea id="w_remarks"></textarea>
			</div>
		</div>
	</div>
	<div class="actions">
		<div class="ui primary button border-radius-none" id="save_waste">Save</div>
		<div class="ui cancel button border-radius-none">Cancel</div>
	</div>
</div>

<div class="ui tiny modal addqtyitemform">
	<div class="header">Add QTY</div>
	<div class="scrolling content">
		<h4 id="aqty_disp_or_non" style="text-align: center;"></h4>
		
		<table style="width: 100%;">
			<tr>
				<td style="width: 75px; vertical-align:top;">Item Name: </td>
				<td><h4 id="aqty_item_name"></h4></td>
			</tr>
		</table>
		<table style="width: 100%;padding-top: 15px;">
			<tr>
				<td style="width: 60%;"><div>Total Qty: <span style="font-size: 15px; font-weight: bold;" id="aqty_total_qty"></span></div></td>
				<td style="width: 40%;"><div>Category: <span style="font-size: 14px; font-weight: bold;" id="aqty_category"></span></div></td>
			</tr>
		</table>
		
		<div class="ui clearing divider"></div>

		<div class="ui form">
			<div class="field" id="aqty_field">
				<label>How many?</label>
				<input type="number" class="border-radius-none" id="aqty_item_qty" min="1">
			</div>
			<div class="field" id="aqty_dr_no_field">
				<label>Delivery Receipt no:</label>
				<input type="text" class="border-radius-none" id="aqty_dr_no">
			</div>
			<div class="field" id="aqty_mr_to_field">
				<label>MR To:</label>
				<select style="width: 100%;" id="aqty_mr_to"></select>
			</div>
			<div class="field">
				<label>Remarks:</label>
				<textarea id="aqty_remarks"></textarea>
			</div>
		</div>
	</div>
	<div class="actions">
		<div class="ui primary button border-radius-none" id="save_aqty">Save</div>
		<div class="ui cancel button border-radius-none">Cancel</div>
	</div>
</div>