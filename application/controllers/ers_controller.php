<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Ers_controller extends CI_Controller {
	private $assetsUrl;
	public function __construct()
	{
		parent::__construct();
		$this->assetsUrl = base_url().'assets/';
		$this->load->model('ers_model','ers');
		
		$this->load->library('myassets');

	}
	public function pages($page = 'dashboard')
	{
		if ( ! file_exists(APPPATH.'views/pages/ers/'.$page.'.php'))
		{
			show_404();
		}else{
			$js = $this->myassets->jslist();
			$css = $this->myassets->csslist();
			$title = $page;
			/*
			 * -------------------------------------------------------------------
			 *  Any additional page specific parameters to pass in the page.
			 * -------------------------------------------------------------------
			 */
			switch ($page) {
				case 'dashboard':

					$css[] = $this->assetsUrl.'css/dashboard_style.css';
					$js[] = $this->assetsUrl.'js/lib/Chart.bundle.min.js';
					$js[] = $this->assetsUrl.'js/lib/echarts.min.js';
					$js[] = $this->assetsUrl.'js/ers/dashboard.js';
					$title = "DASHBOARD";
					break;
				case 'call_log':

					break;
				case 'map':
					$js = $this->myassets->jslist('semantic');
					$css = $this->myassets->csslist('semantic');
					$css[] = $this->assetsUrl."css/ers-map.css";
					$css[] = $this->assetsUrl."css/leaflet.css";
					
					$js[] = $this->assetsUrl."js/lib/leaflet.js";
					$js[] = $this->assetsUrl.'js/lib/esri-leaflet.js';
					$js[] = $this->assetsUrl.'js/lib/leaflet.smoothmarkerbouncing.js';
					$js[] = $this->assetsUrl.'js/ers/map.js';
					break;
			}

			$data['js'] = $js;
			$data['css'] = $css;
			$data['title'] = strtoupper($title);

			$this->load->view('templates/header', $data);
			$this->load->view('pages/ers/'.$page, $data);
			$this->load->view('templates/footer', $data);
		}
	}

	public function ajax(){
		$uriArr = $this->uri->segment_array();
		$m = $uriArr['3'];

		$isJsonEncode = true;
		$return = 'NOTHING';

		switch ($m) {
			case 'GetDailyCallsToday':
				$dt = $this->input->post('dt');
				$return = $this->ers->GetDailyCallsToday($dt);
				break;
			case 'GetAverageCalls':
				$dt = $this->input->post('dt');
				$return = $this->ers->GetAverageCalls($dt);
				break;
			case 'GetMonthlyCalls':
				$dt = $this->input->post('dt');
				$return = $this->ers->GetMonthlyCalls($dt);
				break;
			case 'GetStaffPerf':
				$dt = $this->input->post('dt');
				$return = $this->ers->GetStaffPerf($dt);
				break;
			case 'GetIncidentData':
				$dt = $this->input->post('dt');
				$return = $this->ers->GetIncidentData($dt,false);
				break;
			case 'GetMonthlyIncidentData':
				$dt = $this->input->post('dt');
				$return = $this->ers->GetIncidentData($dt,true);
				break;
			case 'GetHistoryCalls':
				$dt = $this->input->post('dt');
				$return = $this->ers->GetHistoryCalls($dt);
				break;
		}

		echo ($isJsonEncode?json_encode($return):$return);
		exit();
	}
}
 ?>