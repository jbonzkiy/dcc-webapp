<div id="firstloader" class="trans-blur" style="height: 100%;width: 100%;position: fixed;top: 0;left: 0;z-index: 9999">
	<img class="center-loading" src="<?php echo base_url().'assets/img/ororescue_loading.gif'; ?>" width="200" />
</div>
<div id="mainSplitter">
	<div>
		<div style="height: 100%;width: 100%;background-color: #0B2B51;">
			<div style="float:left;color: #fff;margin: 2px 10px;font-size: 32px;font-weight: bolder;">
				<img src="<?php echo base_url().'assets/img/oro_rescue_icon.ico'; ?>"/> COVID-19</div>
				<div style="float: right;" class="mt-2 mr-2"><select id="dtfilter" class="form-control form-control-sm rounded-0"></select></div>
		</div>
	</div>
	<div>
		<div id="secondSplitter">
			<div>
				<div class="text-center"><h4>BHERT Hotline</h4></div>
				<div id="miscPanel">
					
				</div>
			</div>
			<div>
				<div id="thirdSplitter">
					<div><div id="map"></div></div>
					<div>
						<div id='tabs'>
							<ul>
								<li>Confirmed</li>
								<li>PUM</li>
								<li>PUI</li>
								<li>PUM to PUI</li>
							</ul>
							<div class="text-center">
								<h6>CONFIRMED</h6>
								<h1 class="display-3" id="totalConfirmed">0</h1>
							</div>
							<div class="text-center">
								<h6>PUM</h6>
								<h1 class="display-3" id="totalPUM">170</h1>
							</div>
							<div class="text-center">
								<h6>PUI</h6>
								<h1 class="display-3" id="totalPUI">0</h1>
							</div>
							<div class="text-center">
								<h6>PUM to PUI</h6>
								<h1 class="display-3" id="totalPUMPUI">0</h1>
							</div>
						</div>
						<div id="statPanel">
							<div id="brgyGrid">table here</div>
						</div>
						<div id="accordion">
							<div>Cases Classification</div>
							<div>
								<h6>Cases classification (COVID, PUM, PUI)</h6>
								<p>Content here</p>
							</div>
							<div>Age Group per Barangay</div>
							<div>
								<h6>Age Group per Barangay</h6>
								<p>Content here</p>
							</div>
							<div>History Data</div>
							<div>
								<h6>History data per Date</h6>
								<p>Content here</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>