 <?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Maps_controller extends CI_Controller {
	private $assetsUrl;

	public function __construct()
	{
		parent::__construct();
		$this->assetsUrl = base_url().'assets/';
		$this->load->model('maps_model','maps');
		$this->load->library('myassets');
		
	}
	public function pages($page = 'records',$type = ''){
		$spage = ($page == 'report'?$type.'_report':$page);
		if (!file_exists(APPPATH.'views/pages/maps/'.$spage.'.php'))
		{
			show_404();
		}else{
			$ssdata = $this->session->userdata();
			$js = $this->myassets->jslist();
			$css = $this->myassets->csslist();
			$title = $page;
			
			$js[] = $this->assetsUrl.'js/lib/leaflet.js';
			$js[] = $this->assetsUrl.'js/lib/shp.js';
			$js[] = $this->assetsUrl.'js/lib/leaflet.shpfile.js';
			$js[] = $this->assetsUrl.'js/lib/esri-leaflet.js';
			$js[] = $this->assetsUrl.'js/lib/leaflet.smoothmarkerbouncing.js';
			$js[] = $this->assetsUrl.'js/lib/leaflet-routing-machine.min.js';

			$css[] = $this->assetsUrl.'css/leaflet-routing-machine.css';
			$css[] = $this->assetsUrl.'css/leaflet.css';

			switch ($page) {
				case 'resource-monitoring':
					$js[] = $this->assetsUrl.'js/maps/resource_monitoring.js';
					$css[] = $this->assetsUrl.'css/maps-style.css';
					break;
				case 'routing':

					$js[] = $this->assetsUrl.'js/maps/routing.js';
					$css[] = $this->assetsUrl.'css/map-routing-style.css';
					break;
			}
			
			$data['js'] = $js;
			$data['css'] = $css;
			$data['title'] = strtoupper($title);
			$data['page'] = $page;
			$data['type'] = $type;
			$this->load->view('templates/header', $data);
			$this->load->view('pages/maps/'.$spage, $data);
			$this->load->view('templates/footer', $data);
		}
	}
	public function ajax(){
		$uriArr = $this->uri->segment_array();
		$m = $uriArr['3'];
		// log_message('error','maps ajax: '.$m);
		$isJsonEncode = true;
		$return = 'NOTHING';

		switch ($m) {
			case 'get_call_logs_map':
				$type = $this->uri->segment(4, 'daily');
				$ismonthly = ($type == 'monthly');
				$return = $this->maps->Get_call_log_map($ismonthly);
				break;
			case 'get_map_layer':
				$return  = $this->maps->GetMapLayerLocation();
				break;
			case 'get_city_bound':
				$return = $this->maps->Get_city_bound();
				break;
			case 'get_team_status':
				$return  = $this->maps->GetTeamStatus();
				break;
			case 'getAllTeam':
				$return  = $this->maps->getAllTeam();
				break;
			case 'updateVehicleLocation':
				$post = $this->input->post();
				$return  = $this->maps->updateVehicleLocation($post);
				break;
			case 'getRunData':
				$post = $this->input->post();
				$return  = $this->maps->getRunData($post);
				break;
			case 'getAllVehicleLocation':
				$return  = $this->maps->getAllVehicleLocation();
				break;
		}
		// log_message('error','ajax: isobject: '.is_object($return).' | type: '.gettype($return).' | isarray: '.is_array($return));
		echo (in_array(1,array(is_object($return),is_array($return)))?json_encode($return):$return);
		exit();
	}
}
?>