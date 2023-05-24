<div id="horsplit">
	<div>
		<div class="p-2" id="filtercontainer" style="background-color: #F4F4F4;">
			<fieldset>
				<legend class="text-dark">Date Filter</legend>
				<div class="float-left mr-2"><span>From:</span><br><input type="datetime-local" id="fdt"/></div>
				<div class="float-left mr-2"><span>To:</span><br><input type="datetime-local" id="tdt"/></div>
				<div class="float-left mr-2"><br><button class="btn btn-primary btn-sm rounded-0" type="button" id="btnSearch">Filter</button></div>
				<div class="float-left mr-2"><br><button type="button" class="btn btn-danger btn-sm rounded-0" id="btnClearSearch">Clear Filter</button></div>
			</fieldset>
		</div>
	</div>
	<div>
		<div id="grid"></div>	
	</div>
</div>
<div id="DispatchWindow">
	<div id="windowHeader">
		<h5 class="modal-title">Dispatch Team/s&nbsp;(<span class="totalDispatch">0</span>)</h5>
	</div>
	<div style="overflow: auto;" id="windowContent">
		<div id="dispatchTeamGrid"></div>
	</div>
</div>