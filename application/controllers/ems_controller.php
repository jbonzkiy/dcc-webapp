<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Ems_controller extends CI_Controller {
	private $assetsUrl;

	public function __construct()
	{
		parent::__construct();
		$this->assetsUrl = base_url().'assets/';
		$this->load->model('ems_model','ems');
		$this->load->library('myassets');
		// $this->session->set_userdata('some_name', 'some_value');
	}
	public function pages($page = 'records',$type = ''){
		$spage = ($page == 'report'?$type.'_report':$page);
		if ( ! file_exists(APPPATH.'views/pages/ems/'.$spage.'.php'))
		{
			show_404();
		}else{
			$ssdata = $this->session->userdata();
			$js = $this->myassets->jslist();
			$css = $this->myassets->csslist();
			$title = $page;
			/*
			 * -------------------------------------------------------------------
			 *  Any additional page specific parameters to pass in the page.
			 * -------------------------------------------------------------------
			 */
			//check if userid cookie exist and redirect to login page if not exist
			if(in_array($page,array('entry','report'))){
				if(is_null(get_cookie('ems_userid')) && !isset($ssdata['ems_userid'])){
					redirect('/ems/login', 'location');
				}
			}
			switch ($page) {
				case 'entry':
					// if(is_null(get_cookie('userid')) && !isset($ssdata['userid'])){
					// 	redirect('/ems/login', 'location');
					// }
				// log_message('error','test: '.(int)"1234/-B");
					$js[] = $this->assetsUrl.'js/ems/entry.js';
					// $css[] = $this->assetsUrl.'css/ems-report.css';
					$css[] = $this->assetsUrl.'css/custom-style.css';
					$title = "EMS Data Entry";
					$data['uname'] = strtoupper($ssdata['ems_username']);
					$data['uid'] = $ssdata['ems_userid'];
					$data['utype'] = $ssdata['ems_utype'];
					$data['plist'] = json_encode($this->ems->GetPatientList());
					break;
				case 'ersviewer':
					// if(is_null(get_cookie('userid')) && !isset($ssdata['userid'])){
					// 	redirect('/ems/login', 'location');
					// }
				// log_message('error','test: '.(int)"1234/-B");
					$js = $this->myassets->jslist("bootstrap",'v12.1.2');
					$js[] = $this->assetsUrl.'js/ems/ersviewer.js';
					// $css[] = $this->assetsUrl.'css/ems-report.css';
					$css[] = $this->assetsUrl.'css/custom-style.css';
					$title = "ERS VIEWER";
					// $data['uname'] = strtoupper($ssdata['username']);
					// $data['uid'] = $ssdata['userid'];
					break;
				case 'entry-archive':
					// if(is_null(get_cookie('userid')) && !isset($ssdata['userid'])){
					// 	redirect('/ems/login', 'location');
					// }
				// log_message('error','test: '.(int)"1234-B");
					$js[] = $this->assetsUrl.'js/ems/entry-archive.js';
					// $css[] = $this->assetsUrl.'css/ems-report.css';
					$css[] = $this->assetsUrl.'css/custom-style.css';
					$title = "EMS Data Entry";
					$data['uname'] = strtoupper($ssdata['ems_username']);
					$data['uid'] = $ssdata['ems_userid'];
					break;

				case 'report':
					switch ($type) {
						case 'report':
							$js[] = $this->assetsUrl.'js/ems/report_report.js';
							$css[] = $this->assetsUrl.'css/ems-report.css';
							$title = "EMS Report";
							break;
						
						case 'monthly':
							$js[] = $this->assetsUrl.'js/ems/monthly_report.js';
							$css[] = $this->assetsUrl.'css/ems-report.css';
							$title = "EMS Monthly Report";
							break;
						
						case 'yearly':
							$js[] = $this->assetsUrl.'js/ems/yearly_report.js';
							$css[] = $this->assetsUrl.'css/ems-report.css';
							$title = "EMS Yearly Report";
							break;
					}
					
					$css[] = $this->assetsUrl.'css/custom-style.css';
					
					$data['uname'] = strtoupper($ssdata['ems_username']);
					$data['uid'] = $ssdata['ems_userid'];
					break;
				case 'epcrform':
					$title = "EPCR Form";
					$css[] = $this->assetsUrl.'css/jquery-ui.min.css';
					$css[] = $this->assetsUrl.'css/signature-pad.css';
					$css[] = $this->assetsUrl.'css/ems-epcr.css';
					$js[] = $this->assetsUrl.'js/lib/jquery-ui.min.js';
					$js[] = $this->assetsUrl.'js/lib/jquery.ui.touch-punch.min.js';
					$js[] = $this->assetsUrl.'js/lib/jquery.signature.min.js';
					$js[] = $this->assetsUrl.'js/ems/epcr.js';
					
					
					break;
				case 'epcr':
					$title = "EPCR";
					$js = $this->myassets->jslist('bootstrap','v10','V5');
					$css = $this->myassets->csslist('bootstrap','V5');

					$css[] = $this->assetsUrl.'css/jquery-ui.min.css';
					$css[] = $this->assetsUrl.'css/signature-pad.css';
					$css[] = $this->assetsUrl.'css/ems-epcr2.css';
					$css[] = $this->assetsUrl.'css/summernote-lite.min.css';

					$js[] = $this->assetsUrl.'js/lib/jquery-ui.min.js';
					$js[] = $this->assetsUrl.'js/lib/jquery.ui.touch-punch.min.js';
					$js[] = $this->assetsUrl.'js/lib/jquery.signature.min.js';
					$js[] = $this->assetsUrl.'js/lib/summernote-lite.min.js';
					$js[] = $this->assetsUrl.'js/ems/epcrjs.js';
					
					
					break;
			}
			
			$data['js'] = $js;
			$data['css'] = $css;
			$data['title'] = strtoupper($title);
			$data['page'] = $page;
			$data['type'] = $type;
			$this->load->view('templates/header', $data);
			if(in_array($page,array('entry','report','entry-archive')) && (isset($ssdata['ems_userid']) || !is_null(get_cookie('ems_userid')))){
					$this->load->view('pages/ems/nav', $data);
			}
			$this->load->view('pages/ems/'.$spage, $data);
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
				$post = $this->input->post();//$isJsonEncode = false;
				$return = $this->ems->LoginVerification($post);
				if(is_object($return)){
					$isJsonEncode = true;
					if($post['rm'] == 'true'){
						$timeExpire = 2147483647;
						$uid_cookie = array('name'=>'ems_userid','value'=>$return->uid,'expire'=>$timeExpire);
						$uname_cookie = array('name'=>'ems_username','value'=>$return->uname,'expire'=>$timeExpire);
						$utype_cookie = array('name'=>'ems_utype','value'=>$return->user_type,'expire'=>$timeExpire);
						set_cookie($uid_cookie);
						set_cookie($uname_cookie);//log_message('error',$utype_cookie);
						set_cookie($utype_cookie);
					}
					$ssdata = array("ems_userid"=>$return->uid,'ems_username'=>$return->uname,"ems_utype"=>$return->user_type);
					$this->session->set_userdata($ssdata);
				}
				break;
			case 'GetCaseType':
				$return = $this->ems->GetCaseType();
				break;
			case 'GetCaseTypeSub':
				$return = $this->ems->GetCaseTypeSub();
				break;
			case 'GetCallLogData':
				$did = $this->input->post();
				$return = $this->ems->GetCallLogData($did);
				break;
			case 'GetCallLogData2':
				$did = $this->input->post();
				$return = $this->ems->GetCallLogData2($did);
				break;
			case 'checkEmsDataExist':
				$did = $this->input->post();//$isJsonEncode = false;
				$return = $this->ems->checkEmsDataExist($did);
				break;
			case 'AddData':
				$post = $this->input->post();//$isJsonEncode = false;
				$return = $this->ems->AddData($post);
				break;
			case 'UpdateData':
				$post = $this->input->post();//$isJsonEncode = false;
				$return = $this->ems->UpdateData($post);
				break;
			case 'RemoveRequest':
				$post = $this->input->post();//$isJsonEncode = false;
				$return = $this->ems->RemoveRequest($post);
				break;
			case 'saveEPCR':
				$post = $this->input->post();//$isJsonEncode = false;
				$return = $this->ems->saveEPCR($post);
				break;
			case 'GetData':
				$post = $this->input->post();
				// log_message('error','test: '.json_encode($post));
				$return = $this->ems->GetData($post);
				break;
			case 'GetDataReport':
				$g = $this->input->get();
				//log_message('error','test: '.json_encode($g));
				$return = $this->ems->GetDataReport($g);
				break;
			case 'getfilepath':
				$return = $this->ems->getFileTruePath($_FILE['lnk']);
				break;
			case 'GetGetNotLog':
				$return = $this->ems->GetGetNotLog(null);
				break;
			case 'GetCountNotLog':
				$post = $this->input->post();//$isJsonEncode = false;
				$return = $this->ems->GetGetNotLog($post);
				break;
			case 'GetErsData':
				$post = $this->input->post();
				// log_message('error','GetErsData controller: '.json_encode($post));
				$return = $this->ems->GetErsData($post);
				break;
			case 'getDispatchTeamData':
				$post = $this->input->post();
				$return = $this->ems->getDispatchTeamData($post);
				break;
			case 'GetPatientList':
				$return = $this->ems->GetPatientList();
				break;
			case 'GetTeam':
				$post = $this->input->post();
				$return = $this->ems->GetTeam($post);
				break;
			case 'MoveDataToArchive':
				$post = $this->input->post();//$isJsonEncode = false;
				$return = $this->ems->MoveDataToArchive($post);
				break;
			case 'GetRequestData':
				$post = $this->input->post();
				$return = $this->ems->GetRequestData($post);
				break;
			case 'urlExist':
				$post = $this->input->post();
				$return = $this->urlExist($post);
				break;
			case 'getDispatchedToDepart':
				$post = $this->input->post();
				$return = $this->ems->getDispatchedToDepart($post);
				break;
			case 'getDispatchedToArrived':
				$post = $this->input->post();
				$return = $this->ems->getDispatchedToArrived($post);
				break;
			case 'getDispatchedToAccomplished':
				$post = $this->input->post();
				$return = $this->ems->getDispatchedToAccomplished($post);
				break;
			case 'getTimeCallToDispatched':
				$post = $this->input->post();
				$return = $this->ems->getTimeCallToDispatched($post);
				break;
		}
		// log_message('error','ajax: isobject: '.is_object($return).' | type: '.gettype($return).' | isarray: '.is_array($return));
		echo (in_array(1,array(is_object($return),is_array($return)))?json_encode($return):$return);
		exit();
	}
	public function logout(){
		$sess_array = array('ems_userid', 'ems_username','ems_utype');
		$this->session->unset_userdata($sess_array);
		delete_cookie('ems_userid');
		delete_cookie('ems_username');
		delete_cookie('ems_utype');
		redirect('/ems/login', 'location');
	}

	public function login(){
		$ssdata = $this->session->userdata();
		if(!is_null(get_cookie('ems_userid')) || isset($ssdata['ems_userid'])){
			if(!isset($ssdata['ems_userid'])){
				$ssdata = array("ems_userid"=>get_cookie('ems_userid'),'wusername'=>get_cookie('ems_username'),"ems_utype"=>get_cookie('ems_utype'));
				$this->session->set_userdata($ssdata);
			}
			redirect('/ems/entry', 'location');
		}
		$js = $this->myassets->jslist();
		$css = $this->myassets->csslist();
		$js[] = $this->assetsUrl.'js/ems/login.js';
		$css[] = $this->assetsUrl.'css/custom-style.css';
		$title = "EMS Login";

		$data['js'] = $js;
		$data['css'] = $css;
		$data['title'] = strtoupper($title);

		$this->load->view('templates/header', $data);
		$this->load->view('pages/ems/login', $data);
		$this->load->view('templates/footer', $data);
	}

	public function export2excel(){
		$post = $this->input->post();
		header("Content-Disposition: attachment; filename=".$post['filename'].".".$post['format']);
  		header("Content-Type: application/vnd.ms-excel");
  		try{
		    echo $post['content'];
		}catch(Exception $e){
			log_message('error','export2excel '.json_encode($e));
		}
		// log_message('error','export2excel '.json_encode($post['filename']));
	}

	private function urlExist($p){

		// Initialize an URL to the variable
		$url = $p['url'];

		// Use curl_init() function to initialize a cURL session
		$curl = curl_init($url);

		// Use curl_setopt() to set an option for cURL transfer
		curl_setopt($curl, CURLOPT_NOBODY, true);

		// Use curl_exec() to perform cURL session
		$result = curl_exec($curl);

		if ($result !== false) {

			// Use curl_getinfo() to get information
			// regarding a specific transfer
			$statusCode = curl_getinfo($curl, CURLINFO_HTTP_CODE); 

			if ($statusCode == 404) {
				echo "NOT";
			}
			else {
				echo "EXIST";
			}
		}else {
			echo "NOT";
		}
	}
}
?>