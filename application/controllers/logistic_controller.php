<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Logistic_controller extends CI_Controller {
	private $assetsUrl;
	private $accessCode;

	public function __construct()
	{
		parent::__construct();
		$this->assetsUrl = base_url().'assets/';
		$this->load->model('logistic_model','logistic');
		$this->load->library('myassets');
		$this->accessCode = 'admin123';
		// $this->session->set_userdata('some_name', 'some_value');
	}
	public function pages($page = 'records',$type = ''){
		
		if ( ! file_exists(APPPATH.'views/pages/logistic/'.$page.'.php'))
		{
			show_404();
		}else{
			$ssdata = $this->session->userdata();
			$js = $this->myassets->jslist('semantic','v12.0.4');
			$css = $this->myassets->csslist('semantic');
			$title = $page;
			/*
			 * -------------------------------------------------------------------
			 *  Redirect to login page if no session or cookies exist
			 * -------------------------------------------------------------------
			 */
			if(is_null(get_cookie('logistic_userid')) && !isset($ssdata['logistic_userid'])){
				redirect('/logistic/login', 'location');
			}
			/*
			 * -------------------------------------------------------------------
			 *  Any additional page specific parameters to pass in the page.
			 * -------------------------------------------------------------------
			 */
			//check if userid cookie exist and redirect to login page if not exist
			// $isAdmin = $this->GetAdminAccess();

			switch ($page) {
				case 'logs':
					$js[] = $this->assetsUrl.'js/logistic/nav.js';
					$js[] = $this->assetsUrl.'js/logistic/logs.js';
					$js[] = $this->assetsUrl.'js/logistic/variables.js';
					
					$css[] = $this->assetsUrl.'css/custom-style.css';
					$css[] = $this->assetsUrl.'css/logistic-style.css';
					$title = "LOGISTICS-Logs";
					break;
				case 'items':
					$js[] = $this->assetsUrl.'js/logistic/nav.js';
					$js[] = $this->assetsUrl.'js/logistic/item.js';
					$js[] = $this->assetsUrl.'js/logistic/variables.js';
					
					$css[] = $this->assetsUrl.'css/custom-style.css';
					$css[] = $this->assetsUrl.'css/logistic-style.css';
					$title = "LOGISTICS-Item List";
					break;
				case 'import-list':
					$js[] = $this->assetsUrl.'js/logistic/nav.js';
					$js[] = $this->assetsUrl.'js/logistic/import_list.js';
					$js[] = $this->assetsUrl.'js/logistic/variables.js';
					
					$title = "LOGISTICS-Import List";
					break;
			}
			
			$data['uname'] = strtoupper($ssdata['logistic_username']);
			$data['uid'] = $ssdata['logistic_userid'];
			$data['utype'] = $ssdata['logistic_utype'];

			$data['js'] = $js;
			$data['css'] = $css;
			$data['title'] = strtoupper($title);
			$data['page'] = $page;
			$data['isadmin'] = ( $ssdata['logistic_utype'] == 'admin' ) ? 'YES' : 'NO';

			$this->load->view('templates/header', $data);
			$this->load->view('pages/logistic/nav', $data);
			$this->load->view('pages/logistic/'.$page, $data);
			$this->load->view('templates/footer', $data);
		}
	}
	public function ajax(){
		$uriArr = $this->uri->segment_array();
		$m = $uriArr['3'];

		$isJsonEncode = true;
		$return = 'NOTHING';

		switch ($m) {
			case 'LoginVerification':
				$post = $this->input->post();
				$return = $this->logistic->LoginVerification($post);
				if(is_object($return)){
					$isJsonEncode = true;
					if($post['rm'] == 'true'){
						$timeExpire = 2147483647;
						$uid_cookie = array('name'=>'logistic_userid','value'=>$return->uid,'expire'=>$timeExpire);
						$uname_cookie = array('name'=>'logistic_username','value'=>$return->uname,'expire'=>$timeExpire);
						$access_cookie = array('name'=>'logistic_utype','value'=>$return->access,'expire'=>$timeExpire);
						set_cookie($uid_cookie);
						set_cookie($uname_cookie);
						set_cookie($access_cookie);
					}
					$ssdata = array("logistic_userid"=>$return->uid,'logistic_username'=>$return->uname,"logistic_utype"=>$return->access);
					$this->session->set_userdata($ssdata);
				}
				break;
			case 'validateTotalQty':
				$post = $this->input->post();
				$return = $this->logistic->validateTotalQty($post);
				break;
			case 'GetExcelData':
				$return = $this->logistic->GetExcelData();
				break;
			case 'importExcel':
				$return = $this->logistic->GetExcelDataFromFile($_FILES['importexcel']);
				break;
			case 'updateImportExcel':
				header('Content-type: application/json');
				$jsonData = json_decode($this->input->raw_input_stream,true);
				$return = $this->logistic->updateImportExcel($jsonData);
				break;
			case 'parseData':
				$post = $this->input->post();$isJsonEncode = false;
				$return = $this->logistic->parseData($post);
				break;
			case 'GetData':
				$post = $this->input->post();
				// log_message('error','test: '.json_encode($post));
				$return = $this->logistic->GetData($post);
				break;
			case 'GetLogData':
				// $did = $this->input->post('did');
				$return = $this->logistic->GetLogData();
				break;
			case 'GetSelItem':
				// $did = $this->input->post('did');
				$return = $this->logistic->GetSelItem();
				break;
			case 'GetItemLogData':
				$post = $this->input->post();
				$return = $this->logistic->GetItemLogData($post);
				break;
			case 'GetItemWasteData':
				$post = $this->input->post();
				$return = $this->logistic->GetItemWasteData($post);
				break;
			case 'ValidateAdminAccessCode':
				$accessCode = $this->accessCode;
				$post = $this->input->post('accesscode');
				$return = 'INVALID';
				if($post == $accessCode){
					$return = 'OK';
					set_cookie('isAdmin','YES',2147483647);
				}
				$isJsonEncode = false;
				break;
			case 'RemoveAdminAccess':
				delete_cookie('isAdmin');
				$return = 'OK';
				$isJsonEncode = false;
				break;
			case 'getSelectedItemData':
				$get = $this->input->get();
				$return = $this->logistic->getSelectedItemData($get);
				break;
			case 'getNonDisposableItemData':
				$get = $this->input->get();
				$return = $this->logistic->getNonDisposableItemData($get);
				break;
			case 'getPersonnelData':
				$get = $this->input->get();
				$return = $this->logistic->getPersonnelData($get);
				break;
			case 'getRegularForMR':
				$get = $this->input->get();
				$return = $this->logistic->getRegularForMR($get);
				break;
			case 'GetItemTotalQtyData':
				$post = $this->input->post();
				$return = $this->logistic->GetItemTotalQtyData($post);
				break;
			case 'GetItemDetailsData':
				$post = $this->input->post();
				$return = $this->logistic->GetItemDetailsData($post);
				break;
			case 'GetItemWasteSpecificData':
				$post = $this->input->post();
				$return = $this->logistic->GetItemWasteSpecificData($post);
				break;
			// case 'AddData':
			// 	$post = $this->input->post();$isJsonEncode = false;
			// 	$return = $this->ems->AddData($post);
			// 	break; 
			// case 'GetDataReport':
			// 	$g = $this->input->get();
			// 	//log_message('error','test: '.json_encode($g));
			// 	$return = $this->ems->GetDataReport($g);
			// 	break;
		}
		echo (in_array(1,array(is_object($return),is_array($return)))?json_encode($return):$return);
		exit();
	}

	public function logout(){
		$sess_array = array('logistic_userid', 'logistic_username','logistic_utype');
		$this->session->unset_userdata($sess_array);
		delete_cookie('logistic_userid');
		delete_cookie('logistic_username');
		delete_cookie('logistic_utype');
		redirect('/logistic/login', 'location');
	}

	public function login(){
		$ssdata = $this->session->userdata();
		if(!is_null(get_cookie('logistic_userid')) || isset($ssdata['logistic_userid'])){
			if(!isset($ssdata['logistic_userid'])){
				$ssdata = array("logistic_userid"=>get_cookie('logistic_userid'),'logistic_username'=>get_cookie('logistic_username'),"logistic_utype"=>get_cookie('logistic_utype'));
				$this->session->set_userdata($ssdata);
			}
			redirect('/logistic/items', 'location');
		}
		$js = $this->myassets->jslist();
		$css = $this->myassets->csslist();
		$js[] = $this->assetsUrl.'js/logistic/login.js';
		$css[] = $this->assetsUrl.'css/custom-style.css';
		$title = "Logistic Login";

		$data['js'] = $js;
		$data['css'] = $css;
		$data['title'] = strtoupper($title);

		$this->load->view('templates/header', $data);
		$this->load->view('pages/logistic/login', $data);
		$this->load->view('templates/footer', $data);
	}

	private function GetAdminAccess(){
		$accessCode = $this->accessCode;
		$r = 'NO';
		// $ssdata = $this->session->userdata();
		if(!is_null(get_cookie('isAdmin'))){
			//check access code if correct
			$r = get_cookie('isAdmin');
		}
		return $r;
	}

	

	// public function GetExcelData(){
	// 	$file = 'public/data.xlsx';
 //        $this->load->library('phpexcel');
 //        // $this->load->library('iofactory');log_message('error','file: '.$file);
	// 	$objPHPExcel = PHPExcel_IOFactory::load($file);
	// 	$cell_collection = $objPHPExcel->getActiveSheet()->getCellCollection();
	// 	echo json_encode($cell_collection);
 //    }
}
?>