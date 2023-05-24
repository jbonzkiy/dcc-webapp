<div class="ui fluid container vehicle-container" style="margin-top: 40px; margin-bottom: 0;">
	<div class="ui grid">
		<div class="row">
			<div class="column">
				<div class="ui two column stackable grid">
					<div class="column">
						<div class="ui basic tertiary segment">
							<h4 class="ui left floated header"><i class="large icons"><i class="car icon"></i><i class="corner info circle icon"></i></i>Vehicle Information</h4>

							<button class="ui right floated mini button primary add-new-btn" data-type="vehicle"><i class="plus user"></i>Add new vehicle</button>
							<div id="vinfo_grid"></div>
						</div>
					</div>
					<div class="column">
						<div class="ui basic tertiary segment">
							<h4 class="ui left floated header"><i class="large icons"><i class="clipboard list icon"></i><i class="corner info circle icon"></i></i>Activity Information</h4>

							<button class="ui right floated mini button primary add-new-btn" data-type="activity"><i class="plus user"></i>Add new activity</button>
							<div id="ainfo_grid"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="column">
				<div class="ui two column stackable grid">
					<div class="column" style="position: relative; display: none;">
						<div class="ui basic tertiary segment">
							<h4 class="ui left floated header"><i class="info circle icon"></i>Status</h4>

							<button class="ui right floated mini button primary add-new-btn" data-type="status"><i class="plus user"></i>Add new status</button>
							<div id="stat_grid"></div>
						</div>
						<div class="blurry-top" style="display: none;">
							<h2 class="ui center aligned icon header red">
								<i class="ban icon"></i>Not Available
							</h2>
						</div>
					</div>
					<div class="column">
						<div class="ui basic tertiary segment">
							<h4 class="ui left floated header"><i class="address card icon"></i>Driver's Info</h4>

							<button class="ui right floated mini button primary add-new-btn" data-type="driver"><i class="plus user"></i>Add new driver</button>
							<div id="dinfo_grid"></div>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
	
</div>

<div class="ui mini coupled modal" data-type="entryform" style="position: relative;z-index: 99999;">
	<div id="stat_loading">
		<div class="ui green icon header">
			<i class="check icon"></i><span></span>
		</div>
	</div>
	<i class="close icon"></i>
	<div class="header" id="entryformTitle"></div>
	<div class="scrolling content" id="form_content" style="height: 20vw;">
		
		<div class="ui error message" id="errmsg" style="display: none;">
			<div class="header">
				Please review the form.
			</div>
			<ul id="errlst"></ul>
		</div>
		<form class="ui form" data-type="status">
			<div class="inline field">
				<div class="ui checkbox">
					<input type="checkbox" data-type="status" checked class="hidden isActive">
					<label>Active</label>
				</div>
			</div>
			<div class="field">
				<label>Status name:</label>
				<input type="text" id="stat_name" placeholder="Assigned, Available, etc...">
			</div>
			<div class="field">
				<label>Status color:</label>
				<input type="text" id="statColorPicker">
			</div>
			<div class="field">
				<label>Description:</label>
				<textarea rows="2" id="stat_desc" style="resize: none;" placeholder="(Optional)"></textarea>
			</div>
		</form>		

		<form class="ui form" data-type="vehicle">
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

		<form class="ui form" data-type="driver">
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

		<form class="ui form" data-type="activity">
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

	</div>
	<div class="actions">
		<button class="ui primary mini button btn-save-entry">Save</button>
		<button class="ui button mini deny">Cancel</button>
	</div>
</div>