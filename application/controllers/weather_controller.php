 <?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Weather_controller extends CI_Controller {
	private $assetsUrl;
	public function __construct()
	{
		parent::__construct();
		$this->assetsUrl = base_url().'assets/';
		$this->load->model('weather_model','weather');
		
		$this->load->library('myassets');

	}

	

	public function pages($page = 'logs')
	{
		if ( ! file_exists(APPPATH.'views/pages/weather/'.$page.'.php'))
		{
			show_404();
		}else{
			$ssdata = $this->session->userdata();
			$js = $this->myassets->jslist('semantic');
			$css = $this->myassets->csslist('semantic');
			$title = $page;
			$data['fw'] = 'semantic';
			
			/*
			 * -------------------------------------------------------------------
			 *  Redirect to login page if no session or cookies exist
			 * -------------------------------------------------------------------
			 */
			if(is_null(get_cookie('wuserid')) && !isset($ssdata['wuserid'])){
				redirect('/weather/login', 'location');
			}
			/*
			 * -------------------------------------------------------------------
			 *  Any additional page specific parameters to pass in the page.
			 * -------------------------------------------------------------------
			 */
			switch ($page) {
				case 'logs':
					$js = $this->myassets->jslist('semantic','v12.1.2');
					$css = $this->myassets->csslist('semantic');
					$css[] = $this->assetsUrl.'css/weather_styles.css';
					$js[] = $this->assetsUrl.'js/weather/logs.js';
					$title = "Weather Logs";
					break;
				case 'entry':
					$js = $this->myassets->jslist('semantic','v12.1.2');
					$css = $this->myassets->csslist('semantic');
					$css[] = $this->assetsUrl.'css/weather-style.css';
					$css[] = $this->assetsUrl.'css/weather_styles.css';
					$js[] = $this->assetsUrl.'js/weather/variables.js';
					$js[] = $this->assetsUrl.'js/weather/entry.js';
					$data['userlst'] = $this->weather->getUserList();
					$title = "Weather Entry";
					break;
				case 'hazard':
					$js[] = $this->assetsUrl.'js/weather/variables.js';
					$js[] = $this->assetsUrl.'js/weather/hazard.js';
					break;
				case 'gauges':
					$js[] = $this->assetsUrl.'js/weather/variables.js';
					$js[] = $this->assetsUrl.'js/weather/gauges.js';
					$css[] = $this->assetsUrl.'css/weather-style.css';
					break;
				case 'infocast':
					$js[] = $this->assetsUrl.'js/weather/variables.js';
					$js[] = $this->assetsUrl.'js/weather/infocast.js';
					$css[] = $this->assetsUrl.'css/weather-style.css';
					break;
				case 'usermanagement':
					$css[] = $this->assetsUrl.'css/weather-style.css';
					$js[] = $this->assetsUrl.'js/weather/usermanagement.js';
					break;
				case 'reports':
					$css[] = $this->assetsUrl.'css/weather-style.css';
					$js[] = $this->assetsUrl.'js/weather/reports.js';
					break;
				case 'reports1':
					$js = $this->myassets->jslist('semantic','v12.1.2');
					$css = $this->myassets->csslist('semantic');
					$css[] = $this->assetsUrl.'css/weather-style.css';
					$css[] = $this->assetsUrl.'css/weather_styles.css';
					$js[] = $this->assetsUrl.'js/weather/variables.js';
					$data['userlst'] = $this->weather->getUserList();
					$css[] = $this->assetsUrl.'css/weather-style.css';
					$js[] = $this->assetsUrl.'js/weather/reports1.js';
					break;


				case 'elog':
					$js[] = $this->assetsUrl.'js/weather/elog.js';
					break;
				case 'databankviewer':
					$js = $this->myassets->jslist('semantic','v12.1.2');
					$css = $this->myassets->csslist('semantic');

					$js[] = $this->assetsUrl.'js/lib/summernote-lite.min.js';
					$js[] = $this->assetsUrl.'js/weather/databankviewer.js';

					$css[] = $this->assetsUrl.'css/summernote-lite.min.css';
					$css[] = $this->assetsUrl.'css/custom-style.css';
					$css[] = $this->assetsUrl.'css/weather-databankviewer.css';
					$title = 'DATA VIEWER';
					break;
				case 'home':

					break;
			}
			$nav_data['page'] = $page;
			$data['js'] = $js;
			$data['css'] = $css;
			$data['title'] = strtoupper($title);
			if(!is_null(get_cookie('wuserid')) && !isset($ssdata['wuserid'])){
				$ssdata = array("wuserid"=>get_cookie('wuserid'),'wusername'=>get_cookie('wusername'),"waccess"=>get_cookie('waccess'));
				$this->session->set_userdata($ssdata);
			}

			$this->load->view('templates/header', $data);
			if(!in_array($page,array('login'))){
				$nav_data['uid'] = $ssdata['wuserid'];
				$nav_data['uname'] = $ssdata['wusername'];
				$nav_data['access'] = $ssdata['waccess'];

				//if not admin access then redirect to home and flash error msg
				//pages that needs admin access
				$needAdminPages = array('usermanagement');
				if(in_array($page, $needAdminPages) && $ssdata['waccess'] !== 'admin'){
					$this->session->set_flashdata('ERROR', 'ADMIN_ACCESS_ERROR');
					redirect('/weather/home', 'location');
				}

				$this->load->view('pages/weather/nav', $nav_data);
			}
			$this->load->view('pages/weather/'.$page, $data);
			$this->load->view('templates/footer', $data);
		}
	}

	public function ajax(){
		$uriArr = $this->uri->segment_array();
		$m = $uriArr['3'];

		$isJsonEncode = true;
		$return = 'NOTHING';
		$post = $this->input->post();
		switch ($m) {
			case 'LoginVerification':
				$return = $this->weather->LoginVerification($post);
				if(is_object($return)){
					$isJsonEncode = true;
					if($post['rm'] == 'true'){
						$timeExpire = 2147483647;
						$uid_cookie = array('name'=>'wuserid','value'=>$return->uid,'expire'=>$timeExpire);
						$uname_cookie = array('name'=>'wusername','value'=>$return->uname,'expire'=>$timeExpire);
						$access_cookie = array('name'=>'waccess','value'=>$return->access,'expire'=>$timeExpire);
						set_cookie($uid_cookie);
						set_cookie($uname_cookie);//log_message('error',$utype_cookie);
						set_cookie($access_cookie);
					}
					$ssdata = array("wuserid"=>$return->uid,'wusername'=>$return->uname,"waccess"=>$return->access);
					$this->session->set_userdata($ssdata);
				}
				break;
			case 'getUserList':
				$return = $this->weather->getUserList();
				break;
			case 'saveData':
				$return = $this->weather->saveData($post);
				break;
			case 'getWData':
				$return = $this->weather->getWData($post);
				break;
			case 'getTCData':
				$return = $this->weather->getTCData($post);
				break;
			case 'getFloodData':
				$return = $this->weather->getFloodData($post);
				break;
			case 'getGaugesStatus':
				$return = $this->weather->getGaugesStatus($post);
				break;
			case 'updateGaugeStatus':
				$return = $this->weather->updateGaugeStatus($post);
				break;
			case 'getInfocastData':
				$return = $this->weather->getInfocastData($post);
				break;
			case 'getUserData':
				$return = $this->weather->getUserData($post);
				break;
			case 'GetWeatherSystem':
				$return = $this->weather->GetWeatherSystem($post);
				break;
			case 'GetPWS':
				$return = $this->weather->GetPWS($post);
				break;
			case 'GetATF':
				$return = $this->weather->GetATF($post);
				break;
			case 'GetInfocastSubs':
				$return = $this->weather->GetInfocastSubs();
				break;
			case 'GetTotalTextSent':
				$return = $this->weather->GetTotalTextSent($post);
				break;
			case 'GetInfoDessemination':
				$return = $this->weather->GetInfoDessemination($post);
				break;
			case 'GetFB':
				$return = $this->weather->GetFB($post);
				break;
			case 'GetFBPosted':
				$return = $this->weather->GetFBPosted($post);
				break;
			case 'GetFlooding':
				$return = $this->weather->GetFlooding($post);
				break;



			case 'LoadData':
				
				// $dt = $this->input->post('dt');
				$return = $this->weather->LoadData();
				break;
			case 'LoadViewerData':
				$return = $this->weather->LoadViewerData();
				break;
			case 'saveNote':
				$note = $this->input->post('note');
				$return = 'OK'; $isJsonEncode = false;
				if(!write_file(FCPATH."notes.html", $note)){
						$return = 'FAILED';
				}
				break;
			case 'getNote':
				$isJsonEncode = false;
				$return = read_file(FCPATH."notes.html");
				break;
		}

		echo (in_array(1,array(is_object($return),is_array($return)))?json_encode($return):$return);
		exit();
	}

	public function logout(){
		$sess_array = array('wuserid', 'wusername','waccess');
		$this->session->unset_userdata($sess_array);
		delete_cookie('wuserid');
		delete_cookie('wusername');
		delete_cookie('waccess');
		redirect('/weather/login', 'location');
	}

	public function login(){
		$ssdata = $this->session->userdata();
		if(!is_null(get_cookie('wuserid')) || isset($ssdata['wuserid'])){
			if(!isset($ssdata['wuserid'])){
				$ssdata = array("wuserid"=>get_cookie('wuserid'),'wusername'=>get_cookie('wusername'),"waccess"=>get_cookie('waccess'));
				$this->session->set_userdata($ssdata);
			}
			redirect('/weather/home', 'location');
		}
		$js = $this->myassets->jslist();
		$css = $this->myassets->csslist();
		$js[] = $this->assetsUrl.'js/weather/login.js';
		$css[] = $this->assetsUrl.'css/custom-style.css';
		$title = "Weather Login";

		$data['js'] = $js;
		$data['css'] = $css;
		$data['title'] = strtoupper($title);

		$this->load->view('templates/header', $data);
		$this->load->view('pages/weather/login', $data);
		$this->load->view('templates/footer', $data);
	}

}
 ?>