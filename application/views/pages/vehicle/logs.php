<div class="ui fluid container vehicle-container logs" style="margin-top: 30px; margin-bottom: 0;padding: 0 40px !important;position:relative;">
	<div class="ui basic tertiary segment">
		<h4 class="ui left floated header"><i class="large icons"><i class="car icon"></i><i class="corner info circle icon"></i></i>Vehicle Activity Logs</h4>

		<button class="ui right floated mini button primary add-new-btn" data-type="vehicle-activity"><i class="plus user"></i>Add new activity log</button>

		<!-- <div class="ui clearing divider"></div> -->
		<div id="vactivity_grid"></div>
	</div>
</div>
<div class="blurry-top" style="margin-top: 83px;">
	<h2 class="ui center aligned icon header blue">
		<i class="circle notch loading icon"></i>Loading...
	</h2>
</div>
<div class="ui mini coupled modal" data-type="entryform" style="position: relative; z-index: 999999;">
	<div id="stat_loading">
		<div class="ui green icon header">
			<i class="check icon"></i><span></span>
		</div>
	</div>
	<i class="close icon"></i>
	<div class="header" id="entryformTitle">Add new activity log form</div>
	<div class="scrolling content" id="form_content" style="height: 40vw;">

		<div class="ui error message" id="errmsg" style="display: none;">
			<div class="header">
				Please review the form.
			</div>
			<ul id="errlst"></ul>
		</div>

		<form class="ui form">
			<div class="fields">
				<div class="nine field">
					<label>Date:</label>
					<input type="date" id="date" value="<?php echo date('Y-m-d'); ?>">
				</div>
				<div class="seven field">
					<label><abbr title="Estimated time of departure">ETD</abbr>:</label>
					<input type="time" id="etd">
				</div>
			</div>
			<div class="two fields" id="etaetr" style="display: none;">
				<div class="field">
					<label><abbr title="Estimated time of arrival">ETA</abbr>:</label>
					<input type="time" id="eta">
				</div>
				<div class="field">
					<label><abbr title="Estimated time of return">ETR</abbr>:</label>
					<input type="time" id="etr">
				</div>
			</div>
			<div class="field">
				<label>Activity:</label>
				<select class="ui search dropdown" id="activity"></select>
			</div>
			<div class="field">
				<label>Assigned vehicle:</label>
				<select multiple="" class="ui search dropdown" id="vass"></select>
			</div>
			<!-- <div class="field" id="ifVOthers" style="display:none;">
				<input type="text" id="vothers" placeholder="Other vehicle">
			</div> -->
			<div class="field">
				<label>Driver:</label>
				<select multiple="" class="ui search dropdown" id="driver"></select>
			</div>
			<!-- <div class="field" id="ifDOthers" style="display:none;">
				<input type="text" id="dothers" placeholder="Other driver">
			</div> -->
			<div class="field">
				<label>Location:</label>
				<input type="text" id="location">
			</div>
			<div class="field">
				<label>Details:</label>
				<textarea rows="2" id="details" style="resize: none;" placeholder="(Optional)"></textarea>
			</div>
			<div class="field">
				<label>Remarks:</label>
				<textarea rows="2" id="remarks" style="resize: none;" placeholder="(Optional)"></textarea>
			</div>
		</form>

	</div>
	<div class="actions">
		<button class="ui primary mini button btn-save-entry">Save</button>
		<button class="ui button mini deny">Cancel</button>
	</div>
</div>