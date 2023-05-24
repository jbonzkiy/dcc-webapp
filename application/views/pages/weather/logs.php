<div id="grid"></div>

<div class="ui tiny modal">
	<i class="close icon"></i>
	<div class="header">New Entry Form</div>
	<div class="scrolling content" style="height: 100vw;">

		<form class="ui form">
			<div class="field">
				<label>Date:</label>
    			<input id="dt" type="date" value="<?php echo date('Y-m-d'); ?>">
			</div>
			<div class="two fields">
				<div class="field">
					<label>Type of post:</label>
					<select class="ui dropdown" id="typeofpost"></select>
				</div>
				<div class="field">
					<label>Type of advisory:</label>
					<select class="ui dropdown" id="typeofadvi"></select>
				</div>
			</div>
			<!--For Daily Weather Forecast-->
			<div class="two fields display-none" id="forDaily">
				<div class="field weather-affect-cdo">
					<label>Weather System affecting CDO:</label>
	    			<select class="ui search dropdown" multiple="" id="weather_affect_cdo"></select>
				</div>
				<div class="field weather-not-affect-cdo">
					<label>Not affecting CDO:</label>
	    			<select class="ui search dropdown" multiple="" id="weather_not_affect_cdo"></select>
				</div>
			</div>
			<!------------------------------>
			<!-------Default------>

			<div class="inline fields" id="forDefault">
				<div class="field">
					<div class="ui radio checkbox">
						<input type="radio" name="is_affected" checked="checked">
						<label>CDO affected</label>
					</div>
				</div>
				<div class="field">
					<div class="ui radio checkbox">
						<input type="radio" name="is_affected">
						<label>Not affecting CDO</label>
					</div>
				</div>
				<div class="field">
					<div class="ui radio checkbox">
						<input type="radio" name="is_affected">
						<label>Not applicable</label>
					</div>
				</div>
			</div>
			<div class="inline fields">
				<label>Affected area:</label>
				<div class="field">
					<div class="ui radio checkbox">
						<input type="radio" name="affected_area" checked="checked" value="NONE">
						<label>NONE</label>
					</div>
				</div>
				<div class="field">
					<div class="ui radio checkbox">
						<input type="radio" name="affected_area" value="URBAN">
						<label>URBAN</label>
					</div>
				</div>
				<div class="field">
					<div class="ui radio checkbox">
						<input type="radio" name="affected_area" value="RIVERINE">
						<label>RIVERINE</label>
					</div>
				</div>
				<div class="field">
					<div class="ui radio checkbox">
						<input type="radio" name="affected_area" value="BOTH">
						<label>BOTH</label>
					</div>
				</div>
			</div>
			<!-------------------->
			<div class="fields">
				<div class="eleven wide field">
					<label>Source link:</label>
    				<input id="source_link" type="text">
				</div>
				<div class="five wide field">
					<label>Time issued:</label>
    				<input id="source_time_issued" type="time">
				</div>
			</div>
			<div class="fields">
				<div class="eleven wide field">
					<label>CDRRMD link:</label>
    				<input id="cdrrmd_link" type="text">
				</div>
				<div class="five wide field">
					<label>Time issued:</label>
    				<input id="cdrrmd_time_issued" type="time">
				</div>
			</div>

			<div class="inline fields">
				<label>Infocast:</label>
				<div class="field">
					<div class="ui radio checkbox">
						<input type="radio" name="infocast" checked="checked" value="NO">
						<label>NO</label>
					</div>
				</div>
				<div class="field">
					<div class="ui radio checkbox">
						<input type="radio" name="infocast" value="YES">
						<label>YES</label>
					</div>
				</div>
			</div>
			<div class="five wide field display-none" id="forInfocast"><!--Display only if Infocast is yes-->
				<label>No. of text sent:</label>
				<input id="num_txt_sent" type="number">
			</div>

			<div class="inline fields">
				<label>Missed post:</label>
				<div class="field">
					<div class="ui radio checkbox">
						<input type="radio" name="missed_post" checked="checked" value="NO">
						<label>NO</label>
					</div>
				</div>
				<div class="field">
					<div class="ui radio checkbox">
						<input type="radio" name="missed_post" value="YES">
						<label>YES</label>
					</div>
				</div>
			</div>
			<div class="five wide field display-none" id="forMissedPost"><!--Display only if missed post is yes-->
				<label>Missed Post By:</label>
				<select class="ui dropdown" multiple="" id="missed_post_by">
					<option value=""></option>
					<option value="SAGRADO">SAGRADO</option>
					<option value="SALUNTAO">SALUNTAO</option>
					<option value="ECOT">ECOT</option>  
					<option value="MANJAC">MANJAC</option>
					<option value="ESCOBAR">ESCOBAR</option> 
				</select>
			</div>

			<div class="field">
				<label>Comment:</label>
				<textarea></textarea>
			</div>
		</form>

	</div>
	<div class="actions">
		<div class="ui button">Cancel</div>
    	<div class="ui primary button">Save</div>
	</div>
</div>