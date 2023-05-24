<div class="container-fluid p-0 m-0" style="height: 100%;">
	<?php echo $nav; ?>
	<div class="row m-0" style="height: calc(100% - 46px);">
		<div class="col-sm-2 p-0 fillmeup" style="border-right: 1px solid #062C32;">
			<button class="btn btn-sm btn-info btn-block rounded-0" style="border-bottom: 1px solid #062C32;" id="addNewEI"><i class="mdi mdi-plus"></i> Add new Event/ Incident</button>
			<div id="eventlstContainer" style="height: calc(100% - 22px); overflow: auto;">

				<div id="eventlst">
					
				</div>
			</div>
		</div>
		<div class="col-sm-10 p-0 m-0" style="position:relative;">
			<div class="pt-0 pb-3 px-3 bg-info border border-top-0 border-left-0 text-white" id="addNewEIForm" style="display:none;position: absolute;z-index: 999;top: 0;left: 0;width: 400px;border-color: #062C32 !important;">
				<b>Add New Event/Incident Form</b>
				<button type="button" id="addNewEIFormClose" class="close" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button><br>
				<div class="form-group">
					<label for="einame">Event/ Incident Name:</label>
					<input type="text" class="form-control form-control-sm rounded-0" id="einame">
				</div>
				<div class="form-group">
					<label for="eides">Description:</label>
					<textarea class="form-control form-control-sm rounded-0" id="eides" rows="3" style="resize: none;"></textarea>
				</div>
				<div>Table Field/s:	<i class="mdi mdi-plus-box-multiple-outline" data-tooltip-for-input="true" title="Add new field" id="AddNewField"></i></div>
				<div style="max-height: 200px;overflow:auto;" id="fieldContainer">
					<div class="tablefield">
						<input type="text" placeholder="Field Name" class="border fname"/>
						<select class="border ftype">
							<optgroup label="Field Type">
								<option value="input">Input</option>
								<option value="textarea">Textarea</option>
								<option value="select">select</option>
								<option value="checkbox">checkbox</option>
								<option value="radio">radio</option>
							</optgroup>
						</select>
						<input type="text" title="Options to be displayed. Separate by semi-colon(;)" data-tooltip="true" class="border fopt" style="display: none;" placeholder="Separate by semi-colon (;)"/>
						<!-- <i class="mdi mdi-close fremove"></i> -->
					</div>
				</div>
				<br>
				<div style="display: none;" class="text-danger" id="errmsg"></div>
				<button type="button" class="btn btn-light btn-sm btn-block rounded-0" id="saveei">Save</button>
			</div>
			<div style="height: 32px;width: 100%;" class="pl-2 text-white bg-info">
				<div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;float: left; width: 50%;">
					<b id="etitle"></b>&nbsp;&nbsp;<small><i id="edes"></i></small>
				</div>
				<div class="action-btn pr-2" id="actionGrid">
					<i class="mdi mdi-trash-can-outline action-delete inline" data-tooltip="true" title="Delete selected" data-action="delete"></i>
					<i class="mdi mdi-plus-box-outline action-add inline mr-2" data-tooltip="true" title="Add" data-action="add"></i>
				</div>
			</div>
			<div id="grid"></div>
		</div>
	</div>
</div>


<div class="modal fade" id="addeditform" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content rounded-0">
			<div class="modal-header">
				<h5 class="modal-title" id="modalTitle"></h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body" style="max-height: 400px; overflow: auto;overflow-x: hidden;">
				<center><h6 id="eititle"></h6></center>
				<div id="fieldsContainer">
					
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary btn-sm rounded-0" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary btn-sm rounded-0" id="savedata">Save</button>
			</div>
		</div>
	</div>
</div>