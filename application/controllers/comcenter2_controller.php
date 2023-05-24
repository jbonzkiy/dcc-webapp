<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Comcenter2_controller extends CI_Controller {
	private $assetsUrl;
	public function __construct()
	{
		parent::__construct();
		$this->assetsUrl = base_url().'assets/';
		$this->load->model('comcenter2_model','comcenter2');
		
		$this->load->library('myassets');

	}
	public function pages($page = 'records')
	{
		if ( ! file_exists(APPPATH.'views/pages/comcenter2/'.$page.'.php'))
		{
			show_404();
		}else{
			$ssdata = $this->session->userdata();
			$js = $this->myassets->jslist();
			$css = $this->myassets->csslist();
			$title = $page;
			/*
			 * -------------------------------------------------------------------
			 *  Redirect to login page if no session or cookies exist
			 * -------------------------------------------------------------------
			 */
			if(is_null(get_cookie('comm_userid')) && !isset($ssdata['comm_userid'])){
				redirect('/comcenter2/login', 'location');
			}
			/*
			 * -------------------------------------------------------------------
			 *  Any additional page specific parameters to pass in the page.
			 * -------------------------------------------------------------------
			 */
			switch ($page) {
				case 'records':
					$js[] = $this->assetsUrl.'js/comcenter2/records.js';
					$css[] = $this->assetsUrl.'css/custom-style.css';
					$title = 'Comcenter - RECORDS';
					break;
				case 'entry_old':
					$js[] = $this->assetsUrl."js/lib/leaflet.js";
					$js[] = $this->assetsUrl.'js/lib/esri-leaflet.js';
					$js[] = $this->assetsUrl.'js/lib/leaflet.smoothmarkerbouncing.js';		
					$js[] = $this->assetsUrl.'js/lib/leaflet-search.js';
					$js[] = $this->assetsUrl.'js/comcenter2/variables.js';
					$js[] = $this->assetsUrl.'js/comcenter2/entry_old.js';
					
					$css[] = $this->assetsUrl.'css/custom-style.css';
					$css[] = $this->assetsUrl."css/leaflet-search.min.css";
					$css[] = $this->assetsUrl."css/leaflet.css";

					$title = 'Comcenter - ENTRY';
					break;
				case 'entry':
					// for map plugins
					$js[] = $this->assetsUrl."js/lib/leaflet.js";
					$js[] = $this->assetsUrl.'js/lib/esri-leaflet.js';
					$js[] = $this->assetsUrl.'js/lib/leaflet.smoothmarkerbouncing.js';		
					$js[] = $this->assetsUrl.'js/lib/leaflet-search.js';
					$js[] = $this->assetsUrl.'js/lib/Control.FullScreen.js';

					$css[] = $this->assetsUrl."css/leaflet-search.min.css";
					$css[] = $this->assetsUrl."css/leaflet.css";
					$css[] = $this->assetsUrl."css/Control.FullScreen.css";
					
					$js[] = $this->assetsUrl.'js/comcenter2/variables.js';
					$js[] = $this->assetsUrl.'js/comcenter2/entry.js';
					
					$css[] = $this->assetsUrl.'css/custom-style.css';
					$css[] = $this->assetsUrl.'css/comcenter2-style.css';

					$title = 'Comcenter - ENTRY';
					break;
			}

			$data['uname'] = strtoupper($ssdata['comm_username']);
			$data['uid'] = $ssdata['comm_userid'];
			$data['utype'] = $ssdata['comm_utype'];

			$data['js'] = $js;
			$data['css'] = $css;
			$data['title'] = strtoupper($title);
			$data['page'] = $page;

			$this->load->view('templates/header', $data);

			if(!in_array($page,array('login'))){
				$this->load->view('pages/comcenter2/nav', $data);
			}

			$this->load->view('pages/comcenter2/'.$page, $data);
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
			case 'LoginVerification':
				$post = $this->input->post();
				$return = $this->comcenter2->LoginVerification($post);
				if(is_object($return)){
					$isJsonEncode = true;
					if($post['rm'] == 'true'){
						$timeExpire = 2147483647;
						$uid_cookie = array('name'=>'comm_userid','value'=>$return->admin_id,'expire'=>$timeExpire);
						$uname_cookie = array('name'=>'comm_username','value'=>$return->email,'expire'=>$timeExpire);
						$access_cookie = array('name'=>'comm_utype','value'=>$return->account_type,'expire'=>$timeExpire);
						set_cookie($uid_cookie);
						set_cookie($uname_cookie);//log_message('error',$utype_cookie);
						set_cookie($access_cookie);
					}
					$ssdata = array("comm_userid"=>$return->admin_id,'comm_username'=>$return->email,"comm_utype"=>$return->account_type);
					$this->session->set_userdata($ssdata);
				}
				break;
			case 'fetch_records':
				$post = $this->input->post();
				// log_message('error','test: '.json_encode($post));
				$return = $this->comcenter2->FetchRecordData($post);
				break;
			case 'get_call_type':
				$return = $this->comcenter2->GetAllCallType();
				break;
			case 'getData':
				$post = $this->input->post();
				$return = $this->comcenter2->getData($post);
				break;
			case 'getFollowUpData':
				$post = $this->input->post();
				$return = $this->comcenter2->getFollowUpData($post);
				break;
			case 'getAddResponderData':
				$post = $this->input->post();
				$return = $this->comcenter2->getAddResponderData($post);
				break;
			case 'saveData':
				$post = $this->input->post();
				$return = $this->comcenter2->saveData($post);
				break;
			case 'updateData':
				$post = $this->input->post();
				$return = $this->comcenter2->updateData($post);
				break;
			case 'saveFollowUpData':
				$post = $this->input->post();
				$return = $this->comcenter2->saveFollowUpData($post);
				break;
			case 'saveAddResponderData':
				$post = $this->input->post();
				$return = $this->comcenter2->saveAddResponderData($post);
				break;
			case 'updateAddResponderData':
				$post = $this->input->post();
				$return = $this->comcenter2->updateAddResponderData($post);
				break;
			case 'getUsers':
				$return = $this->comcenter2->getUsers();
				break;
		}

		echo (in_array(1,array(is_object($return),is_array($return)))?json_encode($return):$return);
		exit();
	}

	public function logout(){
		$sess_array = array('comm_userid', 'comm_username','comm_utype');
		$this->session->unset_userdata($sess_array);
		delete_cookie('comm_userid');
		delete_cookie('comm_username');
		delete_cookie('comm_utype');
		redirect('/comcenter2/login', 'location');
	}

	public function login(){
		$ssdata = $this->session->userdata();
		if(!is_null(get_cookie('comm_userid')) || isset($ssdata['comm_userid'])){
			if(!isset($ssdata['comm_userid'])){
				$ssdata = array("comm_userid"=>get_cookie('comm_userid'),'comm_username'=>get_cookie('comm_username'),"comm_utype"=>get_cookie('comm_utype'));
				$this->session->set_userdata($ssdata);
			}
			redirect('/comcenter2/entry', 'location');
		}
		$js = $this->myassets->jslist();
		$css = $this->myassets->csslist();
		$js[] = $this->assetsUrl.'js/comcenter2/login.js';
		$css[] = $this->assetsUrl.'css/custom-style.css';
		$title = "Comcenter Login";

		$data['js'] = $js;
		$data['css'] = $css;
		$data['title'] = strtoupper($title);

		$this->load->view('templates/header', $data);
		$this->load->view('pages/comcenter2/login', $data);
		$this->load->view('templates/footer', $data);
	}
}
 ?>