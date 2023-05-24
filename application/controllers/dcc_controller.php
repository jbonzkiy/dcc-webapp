 <?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Dcc_controller extends CI_Controller {
	private $assetsUrl;
	public function __construct()
	{
		parent::__construct();
		$this->assetsUrl = base_url().'assets/';
		$this->load->model('comcenter2_model','comcenter');
		$this->load->model('weather_model','weather');
		$this->load->model('ers_model','ers');
		$this->load->model('earthquake_model');
		$this->load->model('report_model','report');
		
		$this->load->library('myassets');

	}
	public function pages($folder = 'comcenter',$page = 'records')
	{
		$folder2 = ($folder == 'pages')?'':$folder.'/';
		if ( ! file_exists(APPPATH.'views/pages/'.$folder2.$page.'.php'))
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
			switch($folder){
				case 'comcenter':
					switch ($page) {
						case 'records':
							$js[] = $this->assetsUrl.'js/comcenter/records.js';
							$css[] = $this->assetsUrl.'css/custom-style.css';
							$title = 'Comcenter - RECORDS';
							break;
						case 'entry':
							$js[] = $this->assetsUrl."js/lib/leaflet.js";
							$js[] = $this->assetsUrl.'js/lib/esri-leaflet.js';
							$js[] = $this->assetsUrl.'js/lib/leaflet.smoothmarkerbouncing.js';		
							$js[] = $this->assetsUrl.'js/lib/leaflet-search.js';
							$js[] = $this->assetsUrl.'js/comcenter/entry.js';
							
							$css[] = $this->assetsUrl.'css/custom-style.css';
							$css[] = $this->assetsUrl."css/leaflet-search.min.css";
							$css[] = $this->assetsUrl."css/leaflet.css";

							$title = 'Comcenter - ENTRY';
							break;
					}
					
					break;
				case 'weather':
					switch ($page) {
						case 'records':
							$js[] = $this->assetsUrl.'js/weather/wrecords.js';
							$css[] = $this->assetsUrl.'css/custom-style.css';
							$title = "WEATHER MONITORING RECORDS";
							break;
					}
					break;
				case 'ers':
						switch ($page) {
							case 'dashboard':

								$css[] = $this->assetsUrl.'css/dashboard_style.css';
								$js[] = $this->assetsUrl.'js/lib/Chart.bundle.min.js';
								$js[] = $this->assetsUrl.'js/lib/echarts.min.js';
								$js[] = $this->assetsUrl.'js/ers/dashboard.js';
								$title = "DASHBOARD";
								break;
						}
					break;
				case 'pages':
					switch ($page) {
						case 'weather-monitoring-records':
							$js[] = $this->assetsUrl.'js/weather/wrecords.js';
							$title = "records";
							break;
						case 'report':
							$js[] = $this->assetsUrl.'js/report.js';
							$css[] = $this->assetsUrl.'css/report_style.css';
							$title = "REPORT";
							break;
						case 'login':
							$js = $this->myassets->jslist('semantic');
							$css = $this->myassets->csslist('semantic');
							$css[] = $this->assetsUrl.'css/custom-style.css';
							$css[] = $this->assetsUrl.'css/login-style.css';
							break;
					}
					break;
				case 'ems':
					switch ($page) {
						case 'entry':
							$css[] = $this->assetsUrl.'css/custom-style.css';
							$title = "EMS Data Entry";
							break;
						case 'login':
							$js[] = $this->assetsUrl.'js/ems/login.js';
							$css[] = $this->assetsUrl.'css/custom-style.css';
							$title = "EMS Login";
							break;
					}
			}

			$data['js'] = $js;
			$data['css'] = $css;
			$data['title'] = strtoupper($title);

			$this->load->view('templates/header', $data);
			$this->load->view('pages/'.$folder2.$page, $data);
			$this->load->view('templates/footer', $data);
		}
	}

	public function ajax()
	{
		$uriArr = $this->uri->segment_array();
		$f = $uriArr['2']; $m = $uriArr['3'];

		$isJsonEncode = true;
		$return = 'NOTHING';

		switch ($f) {
			case 'comcenter':
				switch ($m) {
					case 'fetch_records':
						$post = $this->input->post();
						// log_message('error','test: '.json_encode($post));
						$return = $this->comcenter->FetchRecordData($post);
						break;
					case 'get_call_type':
						$return = $this->comcenter->GetAllCallType();
						break;
				}
				break;
			case 'weather':
				switch ($m) {
					case 'fetch_user':
						$return = $this->weather->GetUsers();
						break;
					case 'fetch_records':
						$post = $this->input->post();
						// log_message('error','test: '.json_encode($post));
						$return = $this->weather->FetchRecordData($post);
						break;
				}
				break;
			case 'ers':
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
				break;
			case 'report':
				switch ($m) {
					case 'GetErsMonthlyCallsReceive':
						$dt = $this->input->post('dt');
						$return = $this->report->GetErsMonthlyCallsReceive($dt);
						break;
					case 'GetComcenterMonthlyCallsReceive':
						$dt = $this->input->post('dt');
						$return = $this->report->GetComcenterMonthlyCallsReceive($dt);
						break;
					case 'GetMonthlyCallsResponded':
						$dt = $this->input->post('dt');
						$return = $this->report->GetMonthlyCallsResponded($dt);
						break;
					case 'GetChartData':
						$dt = $this->input->post('dt');
						$return = $this->report->GetChartData($dt);
						break;
					case 'GetRefOtherAgency':
						$dt = $this->input->post('dt');
						$return = $this->report->GetRefOtherAgency($dt);
						break;
					case 'GetWeatherSystem':
						$dt = $this->input->post('dt');
						$return = $this->report->GetWeatherSystem($dt);
						break;
				}
				break;
			case 'ems':
				switch ($m) {
					case 'LoginVerification':
						$post = $this->input->post();$isJsonEncode = false;
						$return = $this->ems->LoginVerification($post);
						break;
				}
				break;
		}

		echo ($isJsonEncode?json_encode($return):$return);
		exit();
	}

	public function user_login(){
		
	}
}
 ?>