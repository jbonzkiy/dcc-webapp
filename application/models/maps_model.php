<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Maps_model extends CI_Model {
	private $comdb;
    private $ninedb;
	public function __construct()
    {
            parent::__construct();
            $this->comdb = $this->load->database('comcenter',TRUE);
            //$this->ninedb = $this->load->database('nineoneone',TRUE);
            $this->load->helper('date');
    }
    /**
     * Get call log data
     */
    public function Get_call_log_map($isMonthly = false){
            
            $selArr = array('CallLog_ID','Latitude','Longitude','NameCaller','Address','TelNo','Remarks','Status','Group_Name_A','Type_Emergency','LandMark','TIME(Date_Log) AS dt','Date_Log AS dtlog',
                    "(SELECT `Time_Accomplished` FROM `dispatch_team` WHERE Call_Log_ID = CallLog_ID ORDER BY `Time_Accomplished` DESC LIMIT 1) AS ta",
                    "(SELECT `Time_Dispatched` FROM `dispatch_team` WHERE Call_Log_ID = CallLog_ID ORDER BY `Time_Dispatched` DESC LIMIT 1) AS td",
                    "(SELECT COUNT(Dispatch_Team_ID) FROM `dispatch_team` WHERE Call_Log_ID = CallLog_ID) AS dcnt",
                    "(SELECT COUNT(Other_Agency_ID) FROM `trans_other_agency` WHERE Caller_ID = CallLog_ID) AS cnt_other_agency",
                    "(SELECT Actions FROM `log_user` WHERE Call_Log_ID = CallLog_ID ORDER BY Date_Log DESC LIMIT 1) AS user_action",
                    "(SELECT COUNT(Completed_ID) FROM `completed` WHERE Call_Log_ID = CallLog_ID) AS cnt_completed"
                    );//cnt_completed, cnt_other_agency, dcnt
            $this->ninedb->select(implode(',', $selArr));
            $this->ninedb->from('call_log AS a');
            $this->ninedb->join("type_emergency AS b","a.Type_Emergency_ID = b.Type_Emergency_ID","INNER");
            $this->ninedb->where((!$isMonthly?"Date_Log BETWEEN CAST(CONCAT(DATE_ADD(CURDATE(), INTERVAL -1 DAY),' 19:00:00') AS DATETIME) AND CURRENT_TIMESTAMP()":"MONTHNAME(Date_Log) LIKE MONTHNAME(CURDATE())")." AND a.Type_Emergency_ID NOT IN ('129','131','170','94','79','172','125')");
            $this->ninedb->order_by('DATE(Date_Log),TIME(Date_Log)');
            //log_message('error',$this->db->get_compiled_select());
            $qry = $this->ninedb->get();
            
            $res = $qry->result();
            $this->ninedb->close();
            return $res;exit();
    }

    /**
     * Get lat long of cctv,firestation,hospital,police station
     */
    public function GetMapLayerLocation(){
        $arr = array();
        $str = 'SELECT X,Y,Name,description,"cctv" AS type FROM `cctv_loc`';
        $qry = $this->comdb->query($str);
        $arr = $qry->result();
        $qry->free_result();

        $str ='SELECT X,Y,Catname,Name,Sec_Comder,Address,Vehicles,Hotline,"fire" AS type FROM `fire_station`';
        $qry = $this->comdb->query($str);
        $arr = array_merge($arr,$qry->result());
        $qry->free_result();

        $str ='SELECT X,Y,Name,description,"hospital" AS type FROM `hospital`';
        $qry = $this->comdb->query($str);
        $arr = array_merge($arr,$qry->result());
        $qry->free_result();

        $str ='SELECT X,Y,Name,description,location,"police" AS type FROM `police_station`';
        $qry = $this->comdb->query($str);
        $arr = array_merge($arr,$qry->result());
        $qry->free_result();
        $this->comdb->close();
        return $arr;exit();
    }
    /**
     * Get lat long data of city boundary
     */
    public function Get_city_bound(){
            $selArr = array('Longitude','latitude','Brgy_name');
            $this->comdb->select(implode(',', $selArr));
            $this->comdb->from('barangay_aor');
            $this->comdb->order_by('Brgy_name,Point_sequence');

            $qry = $this->comdb->get();
            $res = $qry->result();
            $this->comdb->close();
            return $res;exit();
    }
    /**
     * Get team status
     */
    public function GetTeamStatus(){
            $qryStr = "SELECT `Call_Log_ID`,`Time_Dispatched`,`Time_Accomplished`,`Team`,`Color`,`NR`,`NR_Type`,Group_Name_A,d.Type_Emergency_ID AS tid FROM (SELECT * FROM `dispatch_team`  ORDER BY `Dispatch_Team_ID` DESC) AS a INNER JOIN `team` AS b ON a.`Team_ID` = b.`Team_ID` LEFT JOIN call_log AS c ON a.Call_log_ID = c.CallLog_ID LEFT JOIN type_emergency AS d ON c.Type_Emergency_ID = d.Type_Emergency_ID WHERE b.`Code` NOT LIKE 'm%' AND b.Code NOT LIKE 'fire%' GROUP BY Team";

            $qry = $this->ninedb->query($qryStr);
            $res = $qry->result();

            $this->ninedb->close();
            return $res;exit();
    }
    //*********************************************************************************
    //MAP CLIENT
    //*********************************************************************************
    public function getAllTeam(){
            $str = 'SELECT Team_ID AS tid, Code AS name FROM team WHERE Code NOT LIKE "m%" AND Code NOT LIKE "fire%" ORDER BY Code';
            $qry = $this->ninedb->query($str);

          return $qry->result();exit();
    }

    public function updateVehicleLocation($p){
            $vid = $p['vid'];//vehicle ID
            $r = 'OK';
            $arr = array(
                'latlng'=>$p['latlng'],
                'dt_created'=>date('Y-m-d H:i:s')
            );
            $this->comdb->trans_start();
            $qry = $this->comdb->update('vehicle_location',$arr,'tid = '.$p['vid']);
            $this->comdb->trans_complete();
            if ($this->comdb->trans_status() === FALSE){
                $r = 'ERROR';
                log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
            }
            // log_message('error',$this->comdb->last_query());
            return $r;exit();
    }

    public function getRunData($p){
            $vid = $p['vid'];

            $str = 'SELECT CallLog_ID, Time_Dispatched, Time_Departed, Time_Arrived, Time_Accomplished, Address, Landmark, b.Remarks AS rmarks, Latitude, Longitude FROM dispatch_team AS a LEFT JOIN call_log AS b ON a.Call_Log_ID = b.CallLog_ID WHERE ISNULL(a.Time_Accomplished) = 1 AND a.Team_ID = '.$vid;
            $qry = $this->ninedb->query($str);
            // log_message('error',$str);
            return $qry->row();exit();
    }

    public function getAllVehicleLocation(){
            $str = 'SELECT aid,tid,name,latlng,dt_created FROM vehicle_location ORDER BY name';
            $qry = $this->comdb->query($str);

            return $qry->result();exit();
    }

}

?>