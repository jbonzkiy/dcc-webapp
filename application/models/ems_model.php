<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Ems_model extends CI_Model {
	private $comdb;
	//private $ninedb;
    private $cdrrmd;
    private $comcenter;
	public function __construct()
    {
            parent::__construct();
            // $this->load->database();
            $this->comdb = $this->load->database('comcenter',TRUE);
            //$this->ninedb = $this->load->database('nineoneone',TRUE);
            $this->load->helper('date');
            // $this->cdrrmd = $this->load->database('cdrrmd',TRUE);
    }

    public function LoginVerification($post){
        $uname = $post['uname'];
        $upass = $post['upass'];
        $r = 'ERROR';
        $str = 'SELECT uid, pass, uname, user_type FROM ems_userdata WHERE uname LIKE "'.$uname.'" LIMIT 1';
        $qry = $this->comdb->query($str);
        if($qry->num_rows() == 0){
            $r = 'INVALID_USERNAME';
        }else{
            $row = $qry->row();
            if($upass == $row->pass){
                $r = $row;
            }else{
                $r = 'INVALID_PASSWORD';
            }
        }
        return $r;exit();
    }

    public function GetCaseType(){
        $str = 'SELECT cid,type,cat FROM ems_case_type WHERE active = 1 ORDER BY FIELD(cat,"Medical","Trauma","Others"),type';
        $qry = $this->comdb->query($str);
        return $qry->result();exit();
    }

    public function GetCaseTypeSub(){
        $str = 'SELECT sid,cid,name FROM ems_case_type_sub WHERE active = 1 ORDER BY cid,sid';
        $qry = $this->comdb->query($str);
        return $qry->result();exit();
    }

    public function GetCallLogData2($p){
        $did = $p['did'];
        $type = $p['type'];
        if($type == 'count'){
            $str = 'SELECT id FROM ems_data WHERE dispatch_id LIKE "'.$did.'"'; 
            $qry = $this->comdb->query($str);           
        }else{
            $str = 'SELECT Date_Log,Address,Address,Time_Dispatched,Time_Departed,Time_Accomplished,Brgy_ID,COUNT(`Call_Log_ID`) AS cnt,
            GROUP_CONCAT(DISTINCT `Team` ORDER BY `Team`) AS ambu FROM `dispatch_team` AS a LEFT JOIN call_log AS b ON a.Call_Log_ID = b.CallLog_ID WHERE
            `Call_Log_ID` = '.(int)$did.' AND `Team` LIKE "%alpha%" GROUP BY `Call_Log_ID`';
            $qry = $this->ninedb->query($str);
        }

        
        //if no record then get data from dispatch table then get Date_Log,Address,Address,Time_Dispatched,Time_Departed,Time_Accomplished,Brgy_ID
        if($qry->num_rows() == 0 && $type == 'data'){
            $qry->free_result();
            $str = 'SELECT Date_Log,Address,Address,Brgy_ID,"NOTHING" AS ambu FROM call_log WHERE CallLog_ID = '.(int)$did;
            $qry = $this->ninedb->query($str);
        }
        
        $return = ($type == 'count')?$qry->num_rows():$qry->row();
        return $return; exit();
    }
    /**
    * Getting the data from the fed_call_log table base on the given dispatch ID
    */
    public function GetCallLogData($p){
        $did = $p['did'];
        $team = $p['team'];
        $isnew = $p['isnew'];
        // log_message('error','GetCallLogData: '. $this->comdb->last_query());
        if($isnew == 'new'){
            $addteam = ($team == 'none')?'':' AND ambu LIKE "'.$team.'"';
            $str = 'SELECT id,dispatch_id,dispatch_dt AS Date_Log, location AS Address, case_type, case_sub_type, p_gender, intoxicated, p_covid, hospital, remarks, transport_from, spHospital, tl_id, uname, type, cat, name, p_agerange, a.dt_created, pname, pnum, ambu, brgy,vdose,vdate,vname,transport_type FROM `ems_data` AS a LEFT JOIN ems_userdata AS b ON a.tl_id = b.uid LEFT JOIN ems_case_type AS c ON a.case_type = c.cid LEFT JOIN ems_case_type_sub AS d ON a.case_sub_type = d.sid WHERE dispatch_id LIKE "'.$did.'" '.$addteam;
            // log_message('error','GetCallLogData: '.$str);

            $qry = $this->comdb->query($str);

            if($qry->num_rows() == 0){//if no result found then check cared database
                $qry->free_result();
                $str = 'SELECT Date_Log,Address,Address,Time_Dispatched,Time_Departed,Time_Accomplished,a.Team AS ambu,Brgy_ID FROM dispatch_team AS a LEFT JOIN call_log AS b ON a.Call_Log_ID = b.CallLog_ID WHERE CallLog_ID = '.(int)$did;
                // log_message('error','GetCallLogData no record query: '.$str);
                $qry = $this->ninedb->query($str);$this->ninedb->close();
            }
        }else{
            
            

            $str = 'SELECT Date_Log,Address,Address,Time_Dispatched,Time_Departed,Time_Accomplished,a.Team AS ambu,Brgy_ID FROM dispatch_team AS a LEFT JOIN call_log AS b ON a.Call_Log_ID = b.CallLog_ID WHERE CallLog_ID = '.(int)$did;

            $qry = $this->ninedb->query($str);$this->ninedb->close();
        }
        $row = $qry->row();
        $qry->free_result();

        $str = 'SELECT id FROM ems_data WHERE dispatch_id LIKE "'.$did.'"';

        $qry = $this->comdb->query($str);
        $numrows = $qry->num_rows();
        $row->cntexist = $numrows;

        // log_message('error','GetCallLogData: '. json_encode($row));
        return $row;exit();
    }

    public function checkEmsDataExist($p){
        $did = $p['did'];

        $str = 'SELECT id FROM ems_data WHERE CAST(dispatch_id AS UNSIGNED) = '.(int)$did;

        $qry = $this->comdb->query($str);
        return $qry->num_rows();exit();
    }

    public function RemoveRequest($p){
        $rid = $p['rid'];
        $r = 'OK';
        $this->comdb->delete('ems_request_data', array('id' => $rid));
        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
        if($p['request'] != 'approve'){
            exit();
        }
    }

    public function AddData($p){
        
        // {did:did,dt:dt,loc:location,ct:casetype,sct:subcase,age:age,gender:gender,hospital:hospital}
        $uid = $this->session->userdata('userid');
        $r = 'OK';
        //check if did and alpha already exist in database
        // $chkstr = 'SELECT ';
        
        $table = ($p['request'] == 'request')?'ems_request_data':'ems_data';

        $arr = array(
            'dispatch_id'=>$p['did'],
            'dispatch_dt'=>$p['dt'],
            'location'=>$p['loc'],
            'case_type'=>$p['ct'],
            'case_sub_type'=>$p['sct'],
            'p_agerange'=>$p['age'],
            'p_gender'=>$p['gender'],
            'intoxicated'=>$p['intoxicated'],
            'p_covid'=>$p['p_covid'],
            'hospital'=>$p['hospital'],
            'remarks'=>$p['remarks'],
            'pname'=>$p['pname'],
            'transport_from'=>$p['transport_from'],
            'pnum'=>$p['pnum'],
            'tl_id'=>$p['userid'],
            'ambu'=>$p['team'],
            'vdose'=>$p['vdose'],
            'vdate'=>$p['vdate'],
            'vname'=>$p['vname'],
            'brgy'=>$p['brgyid'],
            'transport_type'=>$p['transport_type'],
            'Time_Dispatched'=>$p['Time_Dispatched'],
            'Time_Departed'=>$p['Time_Departed'],
            'Time_Arrived'=>$p['Time_Arrived'],
            'Time_Accomplished'=>$p['Time_Accomplished'],
            'dt_created'=>date('Y-m-d H:i:s')
        );

        // $str = 'INSERT INTO ems_data (`dispatch_id`, `dispatch_dt`, `location`,`case_type`, `case_sub_type`, 
        //         `p_agerange`, `p_gender`, `hospital`, `tl_id`, `dt_created`) VALUES ('.$p['did'].',"'.$p['dt'].'",
        //         "'.$p['loc'].'",'.$p['ct'].','.$p['sct'].','.$p['age'].',"'.$p['gender'].'","'.$p['hospital'].'",
        //         '.$uid.',NOW())';
        $this->comdb->trans_start();
        $qry = $this->comdb->insert($table,$arr);
        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->db->_error_number(), $this->db->_error_message(), print_r($this->main_db->last_query(), TRUE)));
        }

        if($p['request'] == 'approve'){
            // $qry->free_result();
            $r = $this->RemoveRequest($p);
        }

        return $r;exit();
    }

    public function UpdateData($p){
        $r = 'OK';
        $arr = array(
            'dispatch_id'=>$p['did'],
            'dispatch_dt'=>$p['dt'],
            'location'=>$p['loc'],
            'case_type'=>$p['ct'],
            'case_sub_type'=>$p['sct'],
            'p_agerange'=>$p['age'],
            'p_gender'=>$p['gender'],
            'intoxicated'=>$p['intoxicated'],
            'p_covid'=>$p['p_covid'],
            'hospital'=>$p['hospital'],
            'remarks'=>$p['remarks'],
            'pname'=>$p['pname'],
            'pnum'=>$p['pnum'],
            'transport_from'=>$p['transport_from'],
            'ambu'=>$p['team'],
            'brgy'=>$p['brgyid'],
            'vdose'=>$p['vdose'],
            'vdate'=>$p['vdate'],
            'vname'=>$p['vname'],
            'transport_type'=>$p['transport_type']
        );
        // log_message('error','UpdateData: '.json_encode($p));
        $this->comdb->trans_start();
        $qry = $this->comdb->update('ems_data',$arr,'id = '.$p['upid']);
        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->db->_error_number(), $this->db->_error_message(), print_r($this->main_db->last_query(), TRUE)));
        }
        return $r;
    }

    public function GetData($p){
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];
        $type = $p['type'];
        $filter = array();
        if(isset($p['filterscount'])){

            
            $forLikeWildCardArr = array('type'=>'c.type','name'=>'d.name','pname'=>'a.pname','location'=>'a.location','transport_from'=>'transport_from','remarks'=>'a.remarks','pnum'=>'a.pnum','vname'=>'vname');// LIKE "%value%"
            $forLikeBeginArr = array('dispatch_id'=>'a.dispatch_id','dtime'=>'TIME(dispatch_dt)');// LIKE "value%"
            $forLikeArr = array('intoxicated'=>'a.intoxicated','p_gender'=>'a.p_gender');// LIKE "value"
            $forIn = array('p_covid'=>'a.p_covid','cat'=>'c.cat','ambu'=>'a.ambu','uname'=>'b.uname','vdose'=>'vdose','transport_type'=>'transport_type','hospital'=>'a.hospital');// IN(value,...)
            $forBetween = array();// BETWEEN

            $addFilter = array();
            if(isset($p['filterGroups'])){
                foreach($p['filterGroups'] AS $value){
                    // LIKE "%value%"
                    if(array_key_exists($value['field'],$forLikeWildCardArr)){
                        $addFilter[] = $forLikeWildCardArr[$value['field']].' LIKE "%'.$value['filters'][0]['value'].'%"';
                    }
                    // LIKE "value%"
                    if(array_key_exists($value['field'],$forLikeBeginArr)){
                        $addFilter[] = $forLikeBeginArr[$value['field']].' LIKE "'.$value['filters'][0]['value'].'%"';
                    }
                    // LIKE "value"
                    if(array_key_exists($value['field'],$forLikeArr)){
                        $addFilter[] = $forLikeArr[$value['field']].' LIKE "'.$value['filters'][0]['value'].'"';
                    }
                    // IN(value,...)
                    if(array_key_exists($value['field'],$forIn)){
                        $inArrVal = array();
                        foreach($value['filters'] AS $v){
                            $inArrVal[] = '"'.$v['value'].'"';
                        }
                        $addFilter[] = $forIn[$value['field']].' IN('.implode(',', $inArrVal).')';
                    }
                    // BETWEEN
                    if(array_key_exists($value['field'],$forBetween)){
                        
                    }

                }
            }
            $fcnt = $p['filterscount'];
            if($fcnt > 0){
                $arrddate = array();
                for($i = 0; $i < $fcnt; $i++){
                    $fdfield = $p["filterdatafield" . $i];
                    $fval = $p["filtervalue" . $i];

                    if($fdfield == 'ddate'){
                        $addFilter[] = 'DATE(dispatch_dt) LIKE CAST("'.$fval.'" AS DATE)';
                    }
                    if($fdfield == 'vdate'){
                        $addFilter[] = 'DATE(vdate) LIKE CAST("'.$fval.'" AS DATE)';
                    }
                }
                
            }
        }

        if($type != 'default'){
            $addFilter[] = 'dispatch_dt BETWEEN CAST("'.$fdt.'" AS DATETIME) AND CAST("'.$tdt.'" AS DATETIME)';
        }
        // log_message('error','qry emsGetData: '.$fdt.' | '.$tdt);
        // $dtused = ($type == 'default'?'dt_created':'dispatch_dt');
        
        // $additional_filter = (count($filter) == 0?($type == 'default'?'':'a.'.$dtused.' BETWEEN  CAST("'.$fdt.'" AS DATETIME) AND CAST("'.$tdt.'" AS DATETIME)'):implode(' AND ',$filter));

        $orderby = ' ORDER BY dispatch_dt DESC';
        $limit = ($type == 'default' && count($addFilter) == 0)?' LIMIT 30':'';

        $str = 'SELECT "" AS ppcr, id,dispatch_id, DATE(dispatch_dt) AS ddate, TIME(dispatch_dt) AS dtime,location,case_type,case_sub_type,p_gender,intoxicated,p_covid,hospital,remarks,spHospital,tl_id,uname,type,cat,name,p_agerange,a.dt_created,pname,pnum,ambu,Barangay,brgy,vdose,vdate,vname,transport_type,transport_from, Time_Dispatched,Time_Departed,Time_Arrived,Time_Accomplished FROM `ems_data` AS a LEFT JOIN ems_userdata AS b ON a.tl_id = b.uid LEFT JOIN ems_case_type AS c ON a.case_type = c.cid LEFT JOIN ems_case_type_sub AS d ON a.case_sub_type = d.sid LEFT JOIN barangay as e on a.brgy=e.Barangay_ID '.(count($addFilter) == 0?'':' WHERE ').implode(' AND ',$addFilter).$orderby.$limit;
        // log_message('error','qry emsGetData: '.$str);
        $qry = $this->comdb->query($str);
        return $qry->result();exit();
    }

    public function GetDataReport($g){
        $type = $g['type'];
        return ($type == 'monthly'?$this->monthlyReport($g):$this->yearlyReport($g));exit();
    }

    private function monthlyReport($g){
        $fdt = $g['fdt'];
        $tdt = $g['tdt'];

        $str = 'SELECT cat,typ,styp,cnt FROM (SELECT b.cat AS cat, b.type AS typ, "NONE" AS styp, COUNT(*) AS cnt FROM `ems_data` AS a LEFT JOIN `ems_case_type` AS b ON a.`case_type` = b.`cid` WHERE `case_sub_type` = 0 AND (DATE(`dispatch_dt`) BETWEEN CAST("'.$fdt.'" AS DATE) AND CAST("'.$tdt.'" AS DATE)) GROUP BY `case_type` UNION ALL SELECT b.cat AS cat, b.type AS typ, c.name AS styp, COUNT(*) AS cnt FROM ems_data AS a JOIN ems_case_type AS b ON a.`case_type` = b.cid JOIN ems_case_type_sub AS c ON a.`case_sub_type` = c.sid WHERE case_sub_type <> 0 AND (`dispatch_dt` BETWEEN CAST("'.$fdt.'" AS DATETIME) AND CAST("'.$tdt.'" AS DATETIME)) GROUP BY case_sub_type) AS tblmerge ORDER BY cat,typ,styp';
        // log_message('error','qry monthlyReport: '.$str);
        $qry = $this->comdb->query($str);
        return $qry->result();
    }

    private function yearlyReport($g){
        $y = $g['year'];

        $str = 'SELECT nm,m,cat,typ,styp,cnt FROM (SELECT DATE_FORMAT(`dispatch_dt`,"%c") AS nm,DATE_FORMAT(`dispatch_dt`,"%b") AS m,b.cat AS cat, b.type AS typ, "NONE" AS styp, COUNT(*) AS cnt FROM `ems_data` AS a LEFT JOIN `ems_case_type` AS b ON a.`case_type` = b.`cid` WHERE `case_sub_type` = 0 AND DATE_FORMAT(`dispatch_dt`,"%Y") LIKE "'.$y.'" GROUP BY m,`case_type` UNION ALL SELECT DATE_FORMAT(`dispatch_dt`,"%c") AS nm,DATE_FORMAT(`dispatch_dt`,"%b") AS m,b.cat AS cat, b.type AS typ, c.name AS styp, COUNT(*) AS cnt FROM ems_data AS a JOIN ems_case_type AS b ON a.`case_type` = b.cid JOIN ems_case_type_sub AS c ON a.`case_sub_type` = c.sid WHERE case_sub_type <> 0 AND  DATE_FORMAT(`dispatch_dt`,"%Y") LIKE "'.$y.'" GROUP BY m,case_sub_type) AS tblmerge ORDER BY CAST(nm AS UNSIGNED),cat,typ,styp';

        $qry = $this->comdb->query($str);
        return $qry->result();exit();
    }

    public function getFileTruePath($f){
        $dir_to_search = $f['dir_to_search']['name'];
        log_message('error',json_encode($f));
        return $f;exit();
    }
    
    public function saveEPCR($p){
        //{dispatch_dt,epcr_dt,location,case_type,pname,p_gender,pnum,epcr_tas,epcr_tls,epcr_tah,
        //epcr_ct_desc,epcr_ht,epcr_age,epcr_w,epcr_h,epcr_rteam,epcr_rcode,epcr_address,epcr_rfrom,epcr_ambnum,
        //epcr_rp,epcr_cc,epcr_interventions,epcr_notes,epcr_dntp,epcr_sample,epcr_vitalsigns,epcr_crew,epcr_receiving};
        $r = 'OK';

        $arr = array(
            'dispatch_dt'=>$p['dispatch_dt'],
            'epcr_dt'=>$p['epcr_dt'],
            'location'=>$p['location'],
            'case_type'=>$p['case_type'],
            'pname'=>$p['pname'],
            'p_gender'=>$p['p_gender'],
            'pnum'=>$p['pnum'],
            'epcr_tas'=>$p['epcr_tas'],
            'epcr_tls'=>$p['epcr_tls'],
            'epcr_tah'=>$p['epcr_tah'],
            'epcr_ct_desc'=>$p['epcr_ct_desc'],
            'epcr_ht'=>$p['epcr_ht'],
            'epcr_age'=>$p['epcr_age'],
            'epcr_w'=>$p['epcr_w'],
            'epcr_h'=>$p['epcr_h'],
            'epcr_rteam'=>$p['epcr_rteam'],
            'epcr_rcode'=>$p['epcr_rcode'],
            'epcr_address'=>$p['epcr_address'],
            'epcr_rfrom'=>$p['epcr_rfrom'],
            'epcr_ambnum'=>$p['epcr_ambnum'],
            'epcr_rp'=>$p['epcr_rp'],
            'epcr_cc'=>$p['epcr_cc'],
            'epcr_interventions'=>$p['epcr_interventions'],
            'epcr_notes'=>$p['epcr_notes'],
            'epcr_dntp'=>$p['epcr_dntp'],
            'epcr_sample'=>$p['epcr_sample'],
            'epcr_vitalsigns'=>$p['epcr_vitalsigns'],
            'epcr_crew'=>$p['epcr_crew'],
            'epcr_receiving'=>$p['epcr_receiving'],
            'tl_id'=>23,
            'dt_created'=>date('Y-m-d H:i:s')
        );
        $this->comdb->trans_start();
        $qry = $this->comdb->insert('ems_data',$arr);
        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->db->_error_number(), $this->db->_error_message(), print_r($this->main_db->last_query(), TRUE)));
        }
        return $r;exit();
    }
    public function GetGetNotLog($p){
        $dispatchdt = 'DATE(`dispatch_dt`) BETWEEN CAST("2021-08-01" AS DATE) AND CURDATE()';
        $datelog = 'DATE(b.Date_Log) BETWEEN CAST("2021-08-01" AS DATE) AND CURDATE()';

        if(!is_null($p)){
            $dispatchdt = '`dispatch_dt` BETWEEN CAST("'.$p['fdt'].'" AS DATETIME) AND CAST("'.$p['tdt'].'" AS DATETIME)';
            $datelog = 'b.Date_Log BETWEEN CAST("'.$p['fdt'].'" AS DATETIME) AND CAST("'.$p['tdt'].'" AS DATETIME)';
        }
        //get all runs from
        $str1 = 'SELECT CONCAT(CAST(dispatch_id AS UNSIGNED),"A",REPLACE(ambu,"Alpha ","")) AS str FROM ems_data WHERE '.$dispatchdt;
        $qry2 = $this->comdb->query($str1);
        $did = array();
        foreach ($qry2->result() as $row){
            $did[] = $row->str;
        }
        $qry2->free_result();
        $str = 'SELECT a.Call_Log_ID AS cid,DATE(b.Date_Log) AS dt,TIME(b.Date_Log) AS tm,Type_Emergency,Address,LandMark,a.Remarks AS rmarks,a.Team,b.Brgy_ID,Time_Dispatched,Time_Departed,Time_Arrived,Time_Accomplished FROM dispatch_team AS a LEFT JOIN call_log AS b ON a.Call_Log_ID = b.CallLog_ID LEFT JOIN type_emergency AS c ON b.Type_Emergency_ID = c.Type_Emergency_ID LEFT JOIN completed AS d ON d.Call_log_ID = a.Call_Log_ID WHERE '.$datelog.' AND a.Team LIKE "%alpha%" AND (NOT FIND_IN_SET(CONCAT(b.CallLog_ID,"A",REPLACE(a.Team,"Alpha ","")),"'.implode(',',$did).'")) AND (a.Accomplishment_ID IN(6,9,11,12,16,17,18,19,20,22,23,24,47,50,52,53,56,58) OR (a.Accomplishment_ID = 0 AND d.Type_ID = 11)) GROUP BY a.Call_Log_ID,a.Team ORDER BY b.Date_Log,b.CallLog_ID,a.Team';//GROUP BY Call_Log_ID;
        // log_message('error','GetGetNotLog: '.$str1);
        $qry = $this->ninedb->query($str);
        //log_message('error','GetGetNotLog'.$this->ninedb->last_query());
        $res = (!is_null($p))?$qry->num_rows():$qry->result();
        return $res;exit();
    }

    public function GetCountNotLog($p){
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];
        // $startdt = '2021-08-01';
        //get all runs from
        $str1 = 'SELECT CONCAT(CAST(dispatch_id AS UNSIGNED),"A",REPLACE(ambu,"Alpha ","")) AS str FROM ems_data WHERE `dispatch_dt` BETWEEN CAST("'.$fdt.'" AS DATETIME) AND CAST("'.$tdt.'" AS DATETIME)';
        $qry2 = $this->comdb->query($str1);
        $did = array();
        foreach ($qry2->result() as $row){
            $did[] = $row->str;
        }
        $qry2->free_result();
        $str = 'SELECT a.Call_Log_ID AS cid,DATE(b.Date_Log) AS dt,Type_Emergency,Address,LandMark,b.Remarks AS rmarks,a.Team FROM dispatch_team AS a LEFT JOIN call_log AS b ON a.Call_Log_ID = b.CallLog_ID LEFT JOIN type_emergency AS c ON b.Type_Emergency_ID = c.Type_Emergency_ID LEFT JOIN completed AS d ON d.Call_log_ID = a.Call_Log_ID WHERE b.Date_Log BETWEEN CAST("'.$fdt.'" AS DATETIME) AND CAST("'.$tdt.'" AS DATETIME) AND a.Team LIKE "%alpha%" AND (NOT FIND_IN_SET(CONCAT(b.CallLog_ID,"A",REPLACE(a.Team,"Alpha ","")),"'.implode(',',$did).'")) AND (a.Accomplishment_ID IN(6,11,12,16,17,18,19,20,22,23,24,47,50,52,53,56,58) OR (a.Accomplishment_ID = 0 AND d.Type_ID = 11)) GROUP BY a.Call_Log_ID,a.Team ORDER BY b.Date_Log,b.CallLog_ID,a.Team';//GROUP BY Call_Log_ID;

        $qry = $this->ninedb->query($str);
        // log_message('error','GetGetNotLog'.$this->comdb->last_query());
        return $qry->num_rows();exit();
    }

    public function GetErsData($p){
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];

        $addFilter = array();
        if(isset($p['filterscount'])){

            
            $forLikeWildCardArr = array('Type_Emergency'=>'Type_Emergency','Address'=>'Address','LandMark'=>'LandMark','Remarks'=>'Remarks','LogBy'=>'LogBy');// LIKE "%value%"
            $forLikeBeginArr = array('CallLog_ID'=>'CallLog_ID','dtime'=>'TIME(Date_Log)');// LIKE "value%"
            $forLikeArr = array();// LIKE "value"
            $forIn = array();// IN(value,...)
            $forBetween = array();// BETWEEN

            $addFilter = array();
            if(isset($p['filterGroups'])){
                foreach($p['filterGroups'] AS $value){
                    // LIKE "%value%"
                    if(array_key_exists($value['field'],$forLikeWildCardArr)){
                        $addFilter[] = $forLikeWildCardArr[$value['field']].' LIKE "%'.$value['filters'][0]['value'].'%"';
                    }
                    // LIKE "value%"
                    if(array_key_exists($value['field'],$forLikeBeginArr)){
                        $addFilter[] = $forLikeBeginArr[$value['field']].' LIKE "'.$value['filters'][0]['value'].'%"';
                    }
                    // LIKE "value"
                    if(array_key_exists($value['field'],$forLikeArr)){
                        $addFilter[] = $forLikeArr[$value['field']].' LIKE "'.$value['filters'][0]['value'].'"';
                    }
                    // IN(value,...)
                    if(array_key_exists($value['field'],$forIn)){
                        $inArrVal = array();
                        foreach($value['filters'] AS $v){
                            $inArrVal[] = '"'.$v['value'].'"';
                        }
                        $addFilter[] = $forIn[$value['field']].' IN('.implode(',', $inArrVal).')';
                    }
                    // BETWEEN
                    if(array_key_exists($value['field'],$forBetween)){
                        
                    }

                }
            }
            $fcnt = $p['filterscount'];
            if($fcnt > 0){
                $arrddate = array();
                for($i = 0; $i < $fcnt; $i++){
                    $fdfield = $p["filterdatafield" . $i];
                    $fval = $p["filtervalue" . $i];

                    if($fdfield == 'ddate'){
                        $addFilter[] = 'DATE(Date_Log) LIKE CAST("'.$fval.'" AS DATE)';
                    }
                }
                
            }
        }

        if($fdt != ''){
            $addFilter[] = 'DATE(Date_Log) BETWEEN CAST("'.$fdt.'" AS DATE) AND CAST("'.$tdt.'" AS DATE)';
        }else{
            if(count($addFilter) == 0){
                $addFilter[] = 'DATE(Date_Log) LIKE CURDATE()';
            }
        }
        // log_message('error','GetErsData: '.$fdt.' | '.$tdt);
        //,(SELECT COUNT(Call_Log_ID) FROM fed_dispatch_team WHERE Call_Log_ID = CallLog_ID) AS dcnt
        $str = 'SELECT CallLog_ID,Type_Emergency,DATE(Date_Log) AS ddate,TIME(Date_Log) AS dtime,Address,LandMark,Remarks,LogBy FROM call_log AS a LEFT JOIN type_emergency AS b ON a.Type_Emergency_ID = b.Type_Emergency_ID '.(count($addFilter) > 0?'WHERE '.implode(' AND ',$addFilter):'').' ORDER BY Date_Log';
        // log_message('error','GetErsData Query: '.$str);
        $qry = $this->ninedb->query($str);
        return $qry->result();exit();
    }
    //for ersviewer
    public function getDispatchTeamData($p){
        $cid = $p['cid'];

        $str = 'SELECT Time_Dispatched, Time_Departed, Time_Arrived, Time_Accomplished, Team,Remarks, Accomp_Type_Desc, DispatchBy, Depart_By, Onsite_By, Accomplish_By FROM dispatch_team AS a LEFT JOIN accomplishment_type AS b ON a.Accomplishment_ID = b.Accomplishment_Type_ID WHERE Call_Log_ID = '.$cid.' ORDER BY Team';
        $qry = $this->ninedb->query($str);
        return $qry->result();exit();
    }

    public function GetTeam($p){
        $did = (int)$p['did'];
        $where = '';
        if($did != 0){
            $where = 'AND Call_Log_ID = '.$did;
        }
        $str = 'SELECT Team_ID, Team FROM dispatch_team WHERE Team LIKE "%alpha%" '.$where.' GROUP BY Team ORDER BY Team';
        // log_message('error','GetTeam Query: '.$str);
        $qry = $this->ninedb->query($str);
        
        return $qry->result();exit();
    }

    public function MoveDataToArchive($p){
        $r = 'OK';
        $id = $p['id'];
        $str = 'INSERT INTO ems_data_archive SELECT * FROM ems_data WHERE id = '.$id;
        
        $this->comdb->delete('ems_data', array('id' => $id));
        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;exit();
        /*$id = $p['id'];
        $r = 'OK';
        $this->comdb->delete('ems_data', array('id' => $id));
        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;*/
    }

    public function GetPatientList(){
        $str = 'SELECT DISTINCT pname FROM ems_data WHERE pname != "" ORDER BY pname';
        $qry = $this->comdb->query($str);

        return $qry->result();exit();
    }

    public function GetRequestData($p){
        $uid = $p['uid'];
        $type = $p['type'];//user or admin

        $where = ($type == 'user')?' WHERE tl_id = '.$uid:'';

        $str = 'SELECT id, dispatch_id, dispatch_dt, location, brgy, ambu, case_type, case_sub_type, intoxicated, pname, p_agerange, p_gender, p_covid, vdose, vname, vdate, pnum, hospital, transport_from, transport_type, tl_id, remarks, a.dt_created, type AS ct,cat, name AS cst, uname, Barangay FROM ems_request_data AS a LEFT JOIN ems_case_type AS b ON a.case_type = b.cid LEFT JOIN ems_case_type_sub AS c ON a.case_sub_type = c.sid LEFT JOIN ems_userdata AS d ON a.tl_id = d.uid LEFT JOIN barangay AS e ON a.brgy = e.Barangay_ID '.$where.' ORDER BY id';

        $qry = $this->comdb->query($str);

        return $qry->result();exit();
    }

    public function getDispatchedToDepart($p){
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];

        $qry = $this->comdb->query('
            SELECT COUNT(*) AS total_cnt, 
                    SUM( response_time > 0 && response_time < 900 ) AS total_valid_cnt, 
                    SUM(IF(response_time > 0 && response_time < 900,response_time,0)) AS sum_response_time, 
                    ( SUM(IF(response_time > 0 && response_time < 900,response_time,0)) / SUM( response_time > 0 && response_time < 900 ) ) AS average_response_time, 
                    SUM( response_time >= 900 ) AS invalid_cnt, 
                    SUM( response_time = 0 ) AS negative_cnt,
                    SUM(IF(response_time IS NULL && case_type=45,1,0)) AS medical_transport_cnt, 
                    SUM(IF(response_time IS NULL && case_type<>45,1,0)) AS null_cnt
            FROM (
                (
                    SELECT case_type, (CASE
                        WHEN ( TIMESTAMPDIFF(SECOND, Time_Dispatched, Time_Departed) > 0 ) THEN ( TIMESTAMPDIFF(SECOND, Time_Dispatched, Time_Departed) )
                        WHEN ( TIMESTAMPDIFF(SECOND, Time_Dispatched, Time_Departed) ) IS NULL THEN NULL
                        WHEN ( TIMESTAMPDIFF(SECOND, Time_Dispatched, Time_Departed) < 0 ) THEN 0
                    END) AS response_time 
                    FROM ems_data 
                    WHERE dispatch_dt BETWEEN CAST("'.$fdt.'" AS DATETIME) AND CAST("'.$tdt.'" AS DATETIME)
                )
            ) AS tbl;'
        );

        return $qry->result();exit();
    }

    public function getDispatchedToArrived($p){
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];

        $qry = $this->comdb->query('
            SELECT COUNT(*) AS total_cnt, 
                    SUM( response_time > 0 ) AS total_valid_cnt, 
                    SUM(response_time) AS sum_response_time, 
                    ( SUM(response_time) / SUM( response_time > 0 ) ) AS average_response_time, 
                    SUM( response_time = 0 ) AS negative_cnt, 
                    SUM(IF(response_time IS NULL && case_type=45,1,0)) AS medical_transport_cnt, 
                    SUM(IF(response_time IS NULL && case_type<>45,1,0)) AS null_cnt
            FROM (
                (
                    SELECT case_type, (CASE
                        WHEN ( TIMESTAMPDIFF(SECOND, Time_Dispatched, Time_Arrived) > 0 ) THEN ( TIMESTAMPDIFF(SECOND, Time_Dispatched, Time_Arrived) )
                        WHEN ( TIMESTAMPDIFF(SECOND, Time_Dispatched, Time_Arrived) ) IS NULL THEN NULL
                        WHEN ( TIMESTAMPDIFF(SECOND, Time_Dispatched, Time_Arrived) < 0 ) THEN 0
                    END) AS response_time 
                    FROM ems_data 
                    WHERE dispatch_dt BETWEEN CAST("'.$fdt.'" AS DATETIME) AND CAST("'.$tdt.'" AS DATETIME)
                )
            ) AS tbl;'
        );

        return $qry->result();exit();
    }

    public function getDispatchedToAccomplished($p){
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];

        $qry = $this->comdb->query('
            SELECT COUNT(*) AS total_cnt, 
                    SUM( response_time > 0 ) AS total_valid_cnt, 
                    SUM(response_time) AS sum_response_time, 
                    ( SUM(response_time) / SUM( response_time > 0 ) ) AS average_response_time, 
                    SUM( response_time = 0 ) AS negative_cnt, 
                    SUM(IF(response_time IS NULL,1,0)) AS null_cnt
            FROM (
                (
                    SELECT (CASE
                        WHEN ( TIMESTAMPDIFF(SECOND, Time_Dispatched, Time_Accomplished) > 0 ) THEN ( TIMESTAMPDIFF(SECOND, Time_Dispatched, Time_Accomplished) )
                        WHEN ( TIMESTAMPDIFF(SECOND, Time_Dispatched, Time_Accomplished) ) IS NULL THEN NULL
                        WHEN ( TIMESTAMPDIFF(SECOND, Time_Dispatched, Time_Accomplished) < 0 ) THEN 0
                    END) AS response_time 
                    FROM ems_data 
                    WHERE dispatch_dt BETWEEN CAST("'.$fdt.'" AS DATETIME) AND CAST("'.$tdt.'" AS DATETIME)
                )
            ) AS tbl;'
        );

        return $qry->result();exit();
    }

    public function getTimeCallToDispatched($p){
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];

        $qry = $this->comdb->query('
            SELECT COUNT(*) AS total_cnt, 
                    SUM( response_time > 0 ) AS total_valid_cnt, 
                    SUM(response_time) AS sum_response_time, 
                    ( SUM(response_time) / SUM( response_time > 0 ) ) AS average_response_time, 
                    SUM( response_time = 0 ) AS negative_cnt, 
                    SUM(IF(response_time IS NULL,1,0)) AS null_cnt
            FROM (
                (
                    SELECT (CASE
                        WHEN ( TIMESTAMPDIFF(SECOND, dispatch_dt, Time_Dispatched) > 0 ) THEN ( TIMESTAMPDIFF(SECOND, dispatch_dt, Time_Dispatched) )
                        WHEN ( TIMESTAMPDIFF(SECOND, dispatch_dt, Time_Dispatched) ) IS NULL THEN NULL
                        WHEN ( TIMESTAMPDIFF(SECOND, dispatch_dt, Time_Dispatched) < 0 ) THEN 0
                    END) AS response_time 
                    FROM ems_data 
                    WHERE dispatch_dt BETWEEN CAST("'.$fdt.'" AS DATETIME) AND CAST("'.$tdt.'" AS DATETIME)
                )
            ) AS tbl;'
        );

        return $qry->result();exit();
    }
}

?>