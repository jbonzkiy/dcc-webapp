<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Vehicle_model extends CI_Model {
    private $cdrrmd;
	public function __construct()
    {
            parent::__construct();
            $this->cdrrmd = $this->load->database('cdrrmd',TRUE);
    }

    public function parse($post){
        $action = $post['action'];
        $r = '';
        switch ($action) {
            case 'add':
                $r = $this->AddData($post);
                break;
            case 'edit':
                $r = $this->EditData($post);
                break;
            case 'load':
                $r = json_encode($this->loadData($post));
                break;
            case 'validate':
                $r = $this->ValidateData($post);
                break;
        }
        return $r;exit();
    }

    private function AddData($post){
        $type = $post['type'];
        $table = '';
        $insertArray = array();
        $r = 'SUCCESS';
        // $isExist = $this->ValidateData($type);
        // if($isExist == 'EXIST'){return 'EXIST'; exit();}
        $this->cdrrmd->trans_start();
        switch ($type) {
            case 'status':
                $table = 'mark_status_info';
                $insertArray = array('name'=>$post['name'],'description'=>$post['desc'],'color'=>$post['color'],
                'dt_created'=>date('Y-m-d H:i:s'),'active'=>$post['active']);
                break;
            case 'vehicle':
                $table = 'mark_vehicle_info';
                $insertArray = array('name'=>$post['name'],'type'=>$post['vtype'],'plate_num'=>$post['pnum'],'remarks'=>$post['remarks'],'active'=>$post['active'],'dt_created'=>date('Y-m-d H:i:s'));
                break;
            case 'driver':
                $table = 'mark_driver_info';
                $insertArray = array('name'=>$post['name'],'contact_num'=>$post['num'],'assigned_vehicle'=>$post['vass'],'active'=>$post['active'],'dt_created'=>date('Y-m-d H:i:s'));
                break;
            case 'activity':
                $table = 'mark_activity_info';
                $insertArray = array('activity'=>$post['activity'],'route'=>$post['route'],'responsible_person'=>$post['resperson'],'vehicle'=>$post['vehicle'],'active'=>$post['active'],'dt_created'=>date('Y-m-d H:i:s'));
                break;
            case 'activity_log'://{action:action,type:'activity_log',date:date,etd:etd,eta:eta,etr:etr,activity:activity, vass:vass, vothers:vothers,driver:driver,dothers:dothers,location:location,details:details,remarks:remarks,id:id};
                $table = 'mark_vehicle_activity_log';
                $insertArray = array('dt'=>$post['date'],'etd'=>$post['etd'],'eta'=>$post['eta'],'etr'=>$post['etr'],
                'aid'=>(int)$post['activity'],'vid'=>$post['vass'],'did'=>$post['driver'],'location'=>$post['location'],'details'=>$post['details'],'remarks'=>$post['remarks'],'dt_created'=>date('Y-m-d H:i:s'));
                break;
        }

        $qry = $this->cdrrmd->insert($table,$insertArray);
        $this->cdrrmd->trans_complete();

        if ($this->cdrrmd->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->cdrrmd->_error_number(), $this->cdrrmd->_error_message(), print_r($this->cdrrmd->last_query(), TRUE)));
        }
        return $r; exit();
    }

    private function EditData($post){
        $type = $post['type'];
        $table = '';
        $updateArray = array();
        $r = 'SUCCESS';
        $this->cdrrmd->trans_start();
        switch ($type) {
            case 'status':
                $table = 'mark_status_info';
                $updateArray = array('name'=>$post['name'],'description'=>$post['desc'],'color'=>$post['color'],'active'=>$post['active']);
                $this->cdrrmd->where('sid', $post['sid']);
                break;
            case 'vehicle':
                $table = 'mark_vehicle_info';
                $updateArray = array('name'=>$post['name'],'type'=>$post['vtype'],'plate_num'=>$post['pnum'],'remarks'=>$post['remarks'],'active'=>$post['active']);
                $this->cdrrmd->where('vid', $post['vid']);
                break;
            case 'driver':
                $table = 'mark_driver_info';
                $updateArray = array('name'=>$post['name'],'contact_num'=>$post['num'],'assigned_vehicle'=>$post['vass'],'active'=>$post['active']);
                $this->cdrrmd->where('did', $post['did']);
                break;
            case 'activity':
                $table = 'mark_activity_info';
                $updateArray = array('activity'=>$post['activity'],'route'=>$post['route'],'responsible_person'=>$post['resperson'],'vehicle'=>$post['vehicle'],'active'=>$post['active']);
                $this->cdrrmd->where('eid', $post['eid']);
                break;
            case 'activity_log':
                $table = 'mark_vehicle_activity_log';
                $updateArray = array('dt'=>$post['date'],'etd'=>$post['etd'],'eta'=>$post['eta'],'etr'=>$post['etr'],
                'aid'=>$post['activity'],'vid'=>$post['vass'],'did'=>$post['driver'],'location'=>$post['location'],'details'=>$post['details'],'remarks'=>$post['remarks']);
                $this->cdrrmd->where('id', $post['id']);
                break;
        }
        
        $qry = $this->cdrrmd->update($table,$updateArray);
        $this->cdrrmd->trans_complete();

        if ($this->cdrrmd->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->cdrrmd->_error_number(), $this->cdrrmd->_error_message(), print_r($this->cdrrmd->last_query(), TRUE)));
        }
        return $r; exit();
    }

    private function loadData($post){
        $type = $post['type'];
        $table = '';
        $selString = '';
        $orderby = 'dt_created DESC';
        switch ($type) {
            case 'status':
                $table = 'mark_status_info';
                $selString = 'sid, name, description, color, active';
                break;
            case 'vehicle':
                $table = 'mark_vehicle_info';
                $selString = 'vid, name, type, plate_num, remarks, active';
                $orderby = 'active DESC, name';
                break;
            case 'option_vehicle':
                $table = 'mark_vehicle_info';
                $selString = 'vid, name,active';
                $orderby = 'active DESC, name';
                //$this->cdrrmd->where('active', 1);
                break;
            case 'driver':
                $table = 'mark_driver_info';
                $selString = 'did, name, contact_num, assigned_vehicle, active';
                $orderby = 'active DESC, name';
                break;
            case 'activity':
                $table = 'mark_activity_info';
                $selString = 'aid, activity, route, vehicle, responsible_person, active';
                break;
            case 'option_activity':
                $table = 'mark_activity_info';
                $selString = 'aid, activity,route,active';
                //$this->cdrrmd->where('active', 1);
                break;
            case 'option_driver':
                $table = 'mark_driver_info';
                $selString = 'did, name,active';
                $orderby = 'active DESC, name';
                //$this->cdrrmd->where('active', 1);
                break;
            case 'activity_log':
                return $this->LoadActivityLog($post); exit();
                break;

        }
        $qry = $this->cdrrmd->select($selString)
        ->from($table)
        ->order_by($orderby)
        ->get();

        return $qry->result();exit();
    }

    private function LoadActivityLog($post){
        $where = '';
        if(isset($post['monitoring'])){
            switch ($post['monitoring']) {
                case 'active':
                    $where = 'WHERE etr = ""';
                    break;
                case 'done':
                    $where = 'WHERE etr != "" AND dt LIKE DATE(NOW())';
                    break;
            }
            
        }

        // $str = 'SELECT id, valog.aid as aid, activity, route, valog.vid as vid, vid_other, vinfo.name as vname, valog.did as did, did_other, dinfo.name as dname, dt, etd, eta, etr, location, details, valog.remarks as remarks FROM `mark_vehicle_activity_log` AS valog LEFT JOIN `mark_activity_info` AS ainfo ON valog.aid = ainfo.aid LEFT JOIN `mark_vehicle_info` AS vinfo ON valog.vid = vinfo.vid LEFT JOIN `mark_driver_info` AS dinfo ON valog.did = dinfo.did '.$where;
        $str = 'SELECT id, valog.aid as aid, activity, route, valog.vid as vid, valog.did as did, dt, etd, eta, etr, location, details, valog.remarks as remarks, (CASE WHEN etd != "" AND etr = "" THEN "ASSIGNED" WHEN etr != "" OR etd = "" THEN "AVAILABLE" ELSE "NOT AVAILABLE" END) AS stat FROM `mark_vehicle_activity_log` AS valog LEFT JOIN `mark_activity_info` AS ainfo ON valog.aid = ainfo.aid '.$where.' ORDER BY valog.dt DESC, TIME_FORMAT(etd,"%H:%i") DESC';

        $qry = $this->cdrrmd->query($str);
        $row = $qry->result();

        // log_message('error','query: '.$this->cdrrmd->last_query());
        return $row; exit();
    }   

    private function ValidateData($post){
        $type = $post['type'];
        // $field = $post['field'];//field to validate
        $r = 'OK';
        $str = '';
        switch($type){
            case 'vehicle':
                $str = 'SELECT name FROM mark_vehicle_info WHERE name LIKE "'.$post['val'].'"';
                break;
            case 'driver':
                $str = 'SELECT name FROM mark_driver_info WHERE name LIKE "'.$post['val'].'"';
                break;
        }
        if($str != ''){
            $qry = $this->cdrrmd->query($str);

            if((int)$qry->num_rows() > 0){
                $r = 'EXIST';
            }
        }
        return $r; exit();
    }
}
?>