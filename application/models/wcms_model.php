<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Wcms_model extends CI_Model {
	private $cdr;
	public function __construct(){
            parent::__construct();
            $this->load->database();
            $this->cdr = $this->load->database('cdrrmd',TRUE);
    }

    public function SaveEventIncident($post){
    	$r = 'SUCCESS';
    	//{title:title,des:descipt,fields:fields,eid:eid,fid:fid};
    	$title = $post['title'];
    	$des = $post['des'];
    	$fields = $post['fields'];
    	$eid = isset($post['eid'])?$post['eid']:0;
    	
    	$this->cdr->trans_start();
    	//insert/update event/incident data
    	$eiData = array('title'=>$title,'description'=>$des,'fields'=>json_encode($fields));
    	if($eid == 0){//insert new data
    		$eiData['dt_created'] = date('Y-m-d H:i:s.u');
	    	$this->cdr->insert('mark_ict_tblevents', $eiData);
	    	$eid = $this->cdr->insert_id();
    	}else{//else update existing data
    		$this->cdr->where('id', $eid);
    		$this->cdr->update('mark_ict_tblevents', $eiData);
    	}
    	$this->cdr->trans_complete();

    	if ($this->cdr->trans_status() === FALSE){
    		$r = 'ERROR';
    	}

    	return $r;exit();
    }

    public function GetEventIncident(){

    	$this->cdr->select('id AS eid,title,description,fields,dt_created');
    	$this->cdr->from('mark_ict_tblevents');
    	$this->cdr->order_by('dt_created','DESC');
		$qry = $this->cdr->get();

		return $qry->result();exit();
    }

    public function DeleteEventIncident($post){
    	$eid = (int)$post['eid'];
    	$r = 'SUCCESS';

    	$this->cdr->trans_start();
    	
    	$this->cdr->where('id',$eid);
    	$this->cdr->delete('mark_ict_tblevents');

    	$this->cdr->where('eid',$eid);
    	$this->cdr->delete('mark_ict_tbldata');

    	$this->cdr->trans_complete();

    	if ($this->cdr->trans_status() === FALSE){
    		$r = 'ERROR';
    	}

    	return $r; exit();
    }

    public function SaveEIData($post){
    	$r = 'SUCCESS';
    	$data = $post['data'];
    	$eid = $post['eid'];
		$did = isset($post['did'])?$post['did']:0;

    	$this->cdr->trans_start();
    	//insert/update event/incident data
    	$eiData = array('data'=>json_encode($data));
    	if($did == 0){//insert new data
    		$eiData['dt_created'] = date('Y-m-d H:i:s.u');
    		$eiData['eid'] = $eid;
	    	$this->cdr->insert('mark_ict_tbldata', $eiData);
	    	$did = $this->cdr->insert_id();
    	}else{//else update existing data
    		$this->cdr->where('id', $did);
    		$this->cdr->update('mark_ict_tbldata', $eiData);
    	}
    	$this->cdr->trans_complete();

    	if ($this->cdr->trans_status() === FALSE){
    		$r = 'ERROR';
    	}

    	return $r;exit();
    }

    public function GetEIData($post){
    	$eid = (int)$post['eid'];
    	$this->cdr->select('id AS did,eid,data,dt_created');
    	$this->cdr->from('mark_ict_tbldata');
    	$this->cdr->where('eid',$eid);
    	$this->cdr->order_by('dt_created','DESC');
		$qry = $this->cdr->get();

		return $qry->result();exit();
    }

    public function DeleteEIData($post){
    	$did = (int)$post['did'];
    	$r = 'SUCCESS';

    	$this->cdr->trans_start();
    	
    	$this->cdr->where('id',$did);
    	$this->cdr->delete('mark_ict_tbldata');

    	$this->cdr->trans_complete();

    	if ($this->cdr->trans_status() === FALSE){
    		$r = 'ERROR';
    	}

    	return $r; exit();
    }
    
}

?>