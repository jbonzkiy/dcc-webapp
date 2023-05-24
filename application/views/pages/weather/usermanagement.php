<style type="text/css">
	.custom input, .custom .field .search, select{width: 100% !important; border-radius: 0 !important;}
	.button,textarea{border-radius: 0 !important;}
	.custom legend{font-weight: bolder; padding: 0 3px;}
</style>
<div id="versplit">
	<div>
		<div id="vhsplit">
			<div>
				<div style="font-size: 14px;text-align: center;padding: 10px; font-weight: bolder;">Infocast Contact Entry Form</div>
			</div>
			<div>
				<div id="frmPanel">
					<div style="overflow: auto; overflow-x: hidden;">
						<div class="ui tiny form custom" style="padding:10px 10px 20px 10px;">
							<div class="field">
								<label>Username:</label>
								<input type="text" id="uname">
							</div>
							<div class="field">
								<label>Password:</label>
								<input type="text" id="upass">
							</div>
							<div class="field">
								<label>Fullname:</label>
								<input type="text" id="fname">
							</div>
							<fieldset>
								<legend>Access</legend>
								<div class="inline field">
									<div class="ui radio checkbox">
										<input type="radio" name="access" value="admin" checked>
										<label>Admin</label>
									</div>
									<div class="ui radio checkbox">
										<input type="radio" name="access" value="user">
										<label>User</label>
									</div>
								</div>
							</fieldset>
							<br>
							<button class="fluid ui positive button" id="btn_submit">Submit</button>
							<br>
							<button class="fluid ui button" id="btn_clear">Clear</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div>
		<div id="grid"></div>
	</div>
</div>