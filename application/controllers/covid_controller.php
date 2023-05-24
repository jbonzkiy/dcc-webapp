 <?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Covid_controller extends CI_Controller {
	private $assetsUrl;
	public function __construct()
	{
		parent::__construct();
		$this->assetsUrl = base_url().'assets/';
		$this->load->model('covid_model','covid');
		
		$this->load->library('myassets');


	}
	public function pages($page = 'map')
	{
		if ( ! file_exists(APPPATH.'views/pages/covid/'.$page.'.php'))
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
				case 'map':
					// $js[] = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAWgQl3xBESgdqWOgeIkgdoIiAJj7Bh6qk&libraries=places';
					
					// $css[] = $this->assetsUrl.'css/custom_maps_css.css';
					// $csslst[] = $baseURL.'css/L.Icon.Pulse.css';
					$js[] = $this->assetsUrl."js/lib/xlsx.full.min.js";

					$js[] = $this->assetsUrl."js/lib/leaflet.js";
					// $jslist[] = $baseURL.'js/Leaflet.GoogleMutant.js';
					$js[] = $this->assetsUrl.'js/lib/esri-leaflet.js';

					$js[] = $this->assetsUrl.'js/lib/jquery.csv.min.js';
					$js[] = $this->assetsUrl.'js/covid/map.js';

					$css[] = $this->assetsUrl."css/leaflet.css";
					$css[] = $this->assetsUrl."css/covid-map.css";
					$title = "COVID-19";
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
			$this->load->view('pages/covid/'.$page, $data);
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
			case 'GetBrgyAor':
				$return = $this->covid->GetBrgyAor();
				break;
			case 'GetExcelData':
				$return = $this->covid->GetExcelData();
				break;
		}

		echo ($isJsonEncode?json_encode($return):$return);
		exit();
	}

	public function GetExcelData(){
		$file = 'public/data.xlsx';
        $this->load->library('phpexcel');
        // $this->load->library('iofactory');log_message('error','file: '.$file);
		$objPHPExcel = PHPExcel_IOFactory::load($file);
		$cell_collection = $objPHPExcel->getActiveSheet()->getCellCollection();
		echo json_encode($cell_collection);
    }
}
 ?>