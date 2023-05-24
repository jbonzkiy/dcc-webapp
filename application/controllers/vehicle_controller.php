 <?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Vehicle_controller extends CI_Controller {
	private $assetsUrl;
	public function __construct()
	{
		parent::__construct();
		$this->assetsUrl = base_url().'assets/';
		$this->load->model('vehicle_model','vehicle');
		
		$this->load->library('myassets');

	}
	public function pages($page = 'log')
	{
		if ( ! file_exists(APPPATH.'views/pages/vehicle/'.$page.'.php'))
		{
			show_404();
		}else{
			$js = $this->myassets->jslist('semantic');
			$css = $this->myassets->csslist('semantic');
			$title = $page;
			/*
			 * -------------------------------------------------------------------
			 *  Any additional page specific parameters to pass in the page.
			 * -------------------------------------------------------------------
			 */
			switch ($page) {
				case 'logs':
					$js[] = $this->assetsUrl.'js/vehicle/logs.js';
					$css[] = $this->assetsUrl."css/vehicle_style.css";
					break;
				case 'manage-list':
					$js[] = $this->assetsUrl.'js/lib/spectrum.js';
					$js[] = $this->assetsUrl.'js/vehicle/manage_list.js';
					$css[] = $this->assetsUrl."css/spectrum.css";
					$css[] = $this->assetsUrl."css/vehicle_style.css";
					break;
				case 'monitoring':
					$js[] = $this->assetsUrl.'js/vehicle/monitoring.js';
					$css[] = $this->assetsUrl."css/vehicle_style.css";
					break;
				case 'managelist':
					$js[] = $this->assetsUrl.'js/vehicle/managelist.js';
					$css[] = $this->assetsUrl."css/vehicle_style.css";
					break;
			}
			$data['js'] = $js;
			$data['css'] = $css;
			$data['page'] = $page;
			$data['title'] = strtoupper($title);

			$this->load->view('templates/header', $data);
			$this->load->view('pages/vehicle/nav', $page,$data);
			$this->load->view('pages/vehicle/'.$page, $data);
			$this->load->view('templates/footer', $data);
		}
	}

	public function ajax(){
		$uriArr = $this->uri->segment_array();
		$m = $uriArr['3'];

		$isJsonEncode = true;
		$return = 'NOTHING';

		switch ($m) {

			case 'action':
				$isJsonEncode = false;
				$post = $this->input->post();
				$return = $this->vehicle->parse($post);
				break;
		}

		echo ($isJsonEncode?json_encode($return):$return);
		exit();
	}
}
 ?>