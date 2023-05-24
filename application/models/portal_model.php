<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Portal_model extends CI_Model {
	//Initialize table names as variables
    private $tblLog = 'ws_tbl_log';
    private $tblTcName = 'ws_tbl_tc_name';
    private $tblTypeGroup = 'ws_tbl_type_group';
    private $tblTypeMember = 'ws_tbl_type_member';
    private $tblUser = 'ws_tbl_user';
    private $tblWS = 'ws_tbl_weather_system';
    private $tblTcSet = 'ws_tc_set';

    private $cdrrmd;
	public function __construct()
    {
            parent::__construct();
            $this->load->database();
            $this->cdrrmd = $this->load->database('cdrrmd',TRUE);
    }

    public function dbValidation($post){
    	$type = $post['type'];//type of validation
    	$r = 'INVALID';
    	switch ($type) {
    		case 'login':
    			$r = $this->loginValidation($post);
    			break;
    	}

    	return $r; exit();
    }

    private function loginValidation($post){
    	$uname = $post['uname'];
    	$upass = $post['upass'];
    	$r = 'INVALID';
    	//check if user name exist
    	$qry = $this->cdrrmd->query('SELECT * FROM '.$this->tblUser.' WHERE username = "'.$uname.'"');
    	if($qry->num_rows() == 0){
    		$r = 'NOT EXIST';
    	}else{
    		$qry->free_result();
    		//check if password match  AND password = SHA1("'.$upass.'")
    		$qry = $this->cdrrmd->query('SELECT * FROM '.$this->tblUser.' WHERE username = "'.$uname.'" AND password = SHA1("'.$upass.'")');

    		if($qry->num_rows() == 0){
    			$r = 'MISMATCH';
    		}else{
    			$r = 'OK';
    		}
    	}

    	return $r;
    }

}

?>