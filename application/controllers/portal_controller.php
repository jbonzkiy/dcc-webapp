<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Portal_controller extends CI_Controller {
	private $assetsUrl;
	public function __construct()
	{
		parent::__construct();
		$this->assetsUrl = base_url().'assets/';
		$this->load->model('portal_model','portal');
		
		$this->load->library('myassets');

	}
	public function pages($page = 'login')
	{
		if ( ! file_exists(APPPATH.'views/pages/portal/'.$page.'.php'))
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
				case 'login':

					$js = $this->myassets->jslist('semantic');
					$css = $this->myassets->csslist('semantic');
					$css[] = $this->assetsUrl.'css/custom-style.css';
					$css[] = $this->assetsUrl.'css/login-style.css';
					$js[] = $this->assetsUrl.'js/predefined_functions.js';
					$js[] = $this->assetsUrl.'js/portal/login.js';
					break;
			}

			$data['js'] = $js;
			$data['css'] = $css;
			$data['title'] = strtoupper($title);

			$this->load->view('templates/header', $data);
			$this->load->view('pages/portal/'.$page, $data);
			$this->load->view('templates/footer', $data);
		}
	}

	public function ajax(){
		$uriArr = $this->uri->segment_array();
		$m = $uriArr['3'];

		$isJsonEncode = true;
		$return = 'NOTHING';

		switch ($m) {
			case 'validation':
				$post = $this->input->post();
				$return = $this->portal->dbValidation($post);
				break;
		}

		echo ($isJsonEncode?json_encode($return):$return);
		exit();
	}
}
 ?>