<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Myassets {
	private $assetsUrl;
	public function __construct()
	{
		$this->assetsUrl = base_url().'assets/';
	}
	/*
	 * -------------------------------------------------------------------
	 *  Javascript libraries that will always be added in the page in order
	 * -------------------------------------------------------------------
	 */
	/**
	 * @param $fefw - Front-end Framework ("bootstrap" or "semantic")
	 */
	public function jslist($fefw = "bootstrap",$jqxver = 'v10',$bootstrapVersion = '',$withjsui = false){
		$js = array(
			$this->assetsUrl.'js/lib/jquery-3.5.1.min.js',
			// $this->assetsUrl.'js/lib/jquery-migrate-1.4.1.min.js',
			// $this->assetsUrl.'js/lib/jquery-migrate-3.3.0.min.js',
			$this->assetsUrl.'js/lib/'.($fefw == 'bootstrap'?'bootstrap'.$bootstrapVersion.'.bundle':'semantic').'.min.js',
			$this->assetsUrl.'js/lib/font-awesome.min.js',
			$this->assetsUrl.'js/lib/moment.min.js',
			$this->assetsUrl.'js/lib/lodash.min.js',
			$this->assetsUrl.'js/lib/notify.min.js',
			$this->assetsUrl.'js/lib/pubnub.4.23.0.min.js',
			$this->assetsUrl.'js/lib/js.cookie.min.js',
			$this->assetsUrl.'js/lib/printThis.js',
			$this->assetsUrl.'js/lib/select2.min.js',
			$this->assetsUrl.'js/lib/alertify.min.js'
		);
		if($withjsui){
			$js[] = $this->assetsUrl.'js/lib/jquery-ui.min.js';
		}
		// if($jqxver != 'jqgrid'){
			$js[] = $this->assetsUrl.'js/lib/jqx-all_'.$jqxver.'.js';
		// }else{
			$js[] = $this->assetsUrl.'js/lib/trirand/i18n/grid.locale-en.js';
			$js[] = $this->assetsUrl.'js/lib/trirand/jquery.jqGrid.min.js';
		// }
		if($fefw == 'bootstrap'){
			$js[] = $this->assetsUrl.'js/lib/bootbox.min.js';
		}else{
			$js[] = $this->assetsUrl.'js/lib/bootbox-semantic-ui.js';
		}
		$js[] = $this->assetsUrl.'js/predefined_functions.js';
		return $js;
	}
	/*
	 * -------------------------------------------------------------------
	 *  Css that will always be added in the page in order
	 * -------------------------------------------------------------------
	 */
	public function csslist($fefw = "bootstrap",$bootstrapVersion = '',$withjsui = false){
		$jqxstyles = directory_map('./assets/css/styles/',1);
		$excludeStyle = array();

		$css = array(
			$this->assetsUrl.'css/'.($fefw == 'bootstrap'?'bootstrap'.$bootstrapVersion:'semantic').'.min.css',
			// $this->assetsUrl.'css/bootstrap-select.min.css',
			$this->assetsUrl.'css/materialdesignicons.min.css',
			$this->assetsUrl.'css/select2.min.css',
			$this->assetsUrl.'css/alertify/alertify.min.css',
			$this->assetsUrl.'css/alertify/default.min.css'
		);
		if($withjsui){
			$css[] = $this->assetsUrl.'css/jquery-ui.min.css';
			$css[] = $this->assetsUrl.'css/jquery-ui.structure.min.css';
			$css[] = $this->assetsUrl.'css/jquery-ui.theme.min.css';
		}
		// if(!$isjqgrid){
			foreach ($jqxstyles as $value) {
				if(strpos($value,'.css') !== false){
					$needle = str_replace('jqx.', '', $value);
					$needle = str_replace('.css', '', $needle);
					if(!in_array($needle, $excludeStyle)){
						$css[] = $this->assetsUrl.'css/styles/'.$value;
					}
				}
				
			}
		// }else{
			$css[] = $this->assetsUrl.'css/trirand/ui.jqgrid-bootstrap4.css';
		// }
		return $css;
	}
}
?>