<div id="parentSplit">
	<div>
		<div id="lsttabs">
			<ul>
				<li style="margin-left: 30px;">Vehicle Information</li>
				<li>Driver's Information</li>
				<li>Activity Information</li>
			</ul>
			<div style="padding: 10px;">
				<div id="vinfo_grid"></div>
			</div>
			<div style="padding: 10px;">
				<div id="dinfo_grid"></div>
			</div>
			<div style="padding: 10px;">
				<div id="ainfo_grid"></div>
			</div>
		</div>
	</div>
	<div>
		<div id="addedittitle" style="border-bottom: 1px solid #35353A;border-top: 1px solid #35353A;padding: 6px;background-color: #3E3E42;">Add new vehicle</div>
		<div id="jqxPanel" style="position: relative;">
				<div class="ui dimmer" id="loader" style="position: absolute;top: 0;left: 0;height: 100%;width: 100%;">
					<div class="ui text loader">Saving</div>
				</div>
			<div style="padding: 20px;">
				<div class="ui error message" id="errmsg" style="display: none;">
					<div class="header">
						Please review the form.
					</div>
					<ul id="errlst"></ul>
				</div>

				<form class="ui mini form" data-type="vehicle">
					<div class="inline field">
						<div class="ui checkbox">
							<input type="checkbox" data-type="vehicle" checked class="hidden isActive">
							<label>Active</label>
						</div>
					</div>
					<div class="field">
						<label>Vehicle's name:</label>
						<input type="text" id="vehicle_name">
					</div>
					<div class="field">
						<label>Type name:</label>
						<input type="text" id="vehicle_type">
					</div>
					<div class="field">
						<label>Plate number:</label>
						<input type="text" id="vehicle_plate_num">
					</div>
					<div class="field">
						<label>Remarks:</label>
						<textarea rows="2" id="vehicle_remarks" style="resize: none;" placeholder="(Optional)"></textarea>
					</div>
				</form>

				<form class="ui mini form" data-type="driver" style="display: none;">
					<div class="inline field">
						<div class="ui checkbox">
							<input type="checkbox" data-type="driver" checked class="hidden isActive">
							<label>Active</label>
						</div>
					</div>
					<div class="field">
						<label>Driver's name:</label>
						<input type="text" id="dname">
					</div>
					<div class="field">
						<label>Contact number:</label>
						<input type="text" id="dnum">
					</div>
					<div class="field">
						<label>Assigned vehicle:</label>
						<select multiple="" class="ui search dropdown" id="vass"></select>
					</div>
				</form>

				<form class="ui mini form" data-type="activity" style="display: none;">
					<div class="inline field">
						<div class="ui checkbox">
							<input type="checkbox" data-type="activity" checked class="hidden isActive">
							<label>Active</label>
						</div>
					</div>
					<div class="field">
						<label>Activity:</label>
						<input type="text" id="aname">
					</div>
					<div class="field">
						<label>Route:</label>
						<input type="text" id="route">
					</div>
					<div class="field">
						<label>Responsible person:</label>
						<input type="text" id="resperson">
					</div>
					<div class="field">
						<label>Vehicle:</label>
						<select multiple="" class="ui search dropdown" id="vact"></select>
					</div>
				</form>

				<button style="margin-top: 30px;" class="ui primary fluid mini button" id="btn-save-entry" data-type="vehicle">Save</button>
				<button style="margin-top: 10px; display: none;" class="ui fluid mini button" id="btn-cancel" onClick="resetForm();">Cancel</button>

			</div>
		</div>
	</div>
</div>