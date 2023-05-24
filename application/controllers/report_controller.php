 <?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Report_controller extends CI_Controller {
	private $assetsUrl;
	public function __construct()
	{
		parent::__construct();
		$this->assetsUrl = base_url().'assets/';
		$this->load->model('report_model','report');
		
		$this->load->library('myassets');

	}
	public function pages($page = 'records')
	{
		if ( ! file_exists(APPPATH.'views/pages/'.$page.'.php'))
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
				case 'weather-monitoring-records':
					$js[] = $this->assetsUrl.'js/weather/wrecords.js';
					$title = "records";
					break;
				case 'report':
					$js[] = $this->assetsUrl.'js/report.js';
					$css[] = $this->assetsUrl.'css/report_style.css';
					$title = "REPORT";
					break;
				case "weather-data":
					$js = $this->myassets->jslist('semantic');
					$css = $this->myassets->csslist('semantic');
					$js[] = $this->assetsUrl.'js/weather/wsc.js';
					// $css[] = $this->assetsUrl.'css/report_style.css';
					$title = "Weather Data";
					break;
			}

			$data['js'] = $js;
			$data['css'] = $css;
			$data['title'] = strtoupper($title);

			$this->load->view('templates/header', $data);
			$this->load->view('pages/'.$page, $data);
			$this->load->view('templates/footer', $data);
		}
	}

	public function ajax()
	{
		$uriArr = $this->uri->segment_array();
		$m = $uriArr['3'];

		$isJsonEncode = true;
		$return = 'NOTHING';

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
			case 'GetPWS':
				$dt = $this->input->post('dt');
				$return = $this->report->GetPWS($dt);
				break;
			case 'GetATF':
				$dt = $this->input->post('dt');
				$return = $this->report->GetATF($dt);
				break;
			case 'GetTotalTextSent':
				$dt = $this->input->post('dt');
				$return = $this->report->GetTotalTextSent($dt);
				break;
			case 'GetInfoDessemination':
				$dt = $this->input->post('dt');
				$return = $this->report->GetInfoDessemination($dt);
				break;
			case 'GetInfocastSubs':
				$return = $this->report->GetInfocastSubs();
				break;
			case 'GetFB':
				$dt = $this->input->post('dt');
				$return = $this->report->GetFB($dt);
				break;
			case 'GetFBPosted':
				$dt = $this->input->post('dt');
				$return = $this->report->GetFBPosted($dt);
				break;
			case 'GetData':
				$post = $this->input->post();
				$return = $this->report->GetData($post);
				break;
			case 'GetSummaryResponseTime':
				$dt = $this->input->post('dt');
				$return = $this->report->GetSummaryResponseTime($dt);
				break;
		}

		echo ($isJsonEncode?json_encode($return):$return);
		exit();
	}
}
 ?>