 <?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Wcms_controller extends CI_Controller {
	private $assetsUrl;
	public function __construct()
	{
		parent::__construct();
		$this->assetsUrl = base_url().'assets/';
		$this->load->model('wcms_model','wcms');
		
		$this->load->library('myassets');


	}
	public function pages($page = 'home')
	{
		if ( ! file_exists(APPPATH.'views/pages/wcms/'.$page.'.php'))
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
				case 'home':
					$js[] = $this->assetsUrl.'js/wcms/home.js';
					$css[] = $this->assetsUrl.'css/wcms_styles.css';
					$data['nav'] = $this->load->view('pages/wcms/nav', NULL, TRUE);
					$title = "Incident Data Management";
					break;

				// case 'report':
				// 	$js[] = $this->assetsUrl.'js/report.js';
				// 	$css[] = $this->assetsUrl.'css/report_style.css';
				// 	$title = "REPORT";
				// 	break;
			}

			$data['js'] = $js;
			$data['css'] = $css;
			$data['title'] = strtoupper($title);

			$this->load->view('templates/header', $data);
			$this->load->view('pages/wcms/'.$page, $data);
			$this->load->view('templates/footer', $data);
		}
	}

	public function ajax(){
		$uriArr = $this->uri->segment_array();
		$m = $uriArr['3'];

		$isJsonEncode = true;
		$return = 'NOTHING';

		switch ($m) {
			case 'SaveEventIncident':
				$isJsonEncode = false;
				$post = $this->input->post();
				$return = $this->wcms->SaveEventIncident($post);
				break;
			case 'GetEventIncident':
				$return = $this->wcms->GetEventIncident();
				break;
			case 'GetEIData':
				$post = $this->input->post();
				$return = $this->wcms->GetEIData($post);
				break;
			case 'DeleteEventIncident':
				$isJsonEncode = false;
				$post = $this->input->post();
				$return = $this->wcms->DeleteEventIncident($post);
				break;
			case 'DeleteEIData':
				$isJsonEncode = false;
				$post = $this->input->post();
				$return = $this->wcms->DeleteEIData($post);
				break;
			case 'SaveEIData':
				$isJsonEncode = false;
				$post = $this->input->post();
				$return = $this->wcms->SaveEIData($post);
				break;
		}

		echo ($isJsonEncode?json_encode($return):$return);
		exit();
	}
}
 ?>