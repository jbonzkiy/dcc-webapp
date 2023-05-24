<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Ers_model extends CI_Model {
    private $tblCallLog = 'call_log';
    private $tblTE = 'type_emergency';
    private $cdrrmd;
	public function __construct()
    {
            parent::__construct();
            $this->load->database();
            $this->cdrrmd = $this->load->database('cdrrmd',TRUE);
    }

    public function GetDailyCallsToday($dt = null){//log_message('error','test1: '.$dt);
        $dt = (is_null($dt))?"CURDATE()":"CAST('".$dt."' AS DATE)";//($dt == date('Y-m-d')?"CURDATE()":"CAST('".$dt."' AS DATE)");
        // log_message('error','test2: '.$dt.' | '.($dt == date('Y-m-d')));
        $data = array();
        $selArray = array(
            'today'=>array("COUNT(*) AS today",
                //--Emergency Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A NOT LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt.") AS emergency",
                //--Other Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt.") AS other",
                //--Hangup Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` WHERE Type_Emergency_ID IN('129','131','170','172') AND DATE(Date_log) LIKE ".$dt.") AS hangup"),
            'touch'=>array("COUNT(*) AS today",
            
                //--Emergency Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A NOT LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND `Remarks` LIKE '%@@@%' AND TelNo NOT IN(0,1,2)) AS emergency",
                //--Other Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND `Remarks` LIKE '%@@@%' AND TelNo NOT IN(0,1,2)) AS other",
                //--Hangup Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` WHERE Type_Emergency_ID IN('129','131','170','172') AND DATE(Date_log) LIKE ".$dt." AND `Remarks` LIKE '%@@@%' AND TelNo NOT IN(0,1,2)) AS hangup"),
            'cared'=>array("COUNT(*) AS today",
            
                //--Emergency Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A NOT LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND `Remarks` NOT LIKE '%@@@%' AND TelNo NOT IN(0,1,2)) AS emergency",
                //--Other Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND `Remarks` NOT LIKE '%@@@%' AND TelNo NOT IN(0,1,2)) AS other",
                //--Hangup Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` WHERE Type_Emergency_ID IN('129','131','170','172') AND DATE(Date_log) LIKE ".$dt." AND `Remarks` NOT LIKE '%@@@%' AND TelNo NOT IN(0,1,2)) AS hangup"),
            'walkin'=>array("COUNT(*) AS today",
            
                //--Emergency Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A NOT LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND TelNo = 0) AS emergency",
                //--Other Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND TelNo = 0) AS other",
                //--Hangup Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` WHERE Type_Emergency_ID IN('129','131','170','172') AND DATE(Date_log) LIKE ".$dt." AND TelNo = 0) AS hangup"),
            'comcenter'=>array("COUNT(*) AS today",
            
                //--Emergency Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A NOT LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND TelNo = 1) AS emergency",
                //--Other Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND TelNo = 1) AS other",
                //--Hangup Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` WHERE Type_Emergency_ID IN('129','131','170','172') AND DATE(Date_log) LIKE ".$dt." AND TelNo = 1) AS hangup")
        );

        $this->db->select(implode(",", $selArray['today']));

        $this->db->from($this->tblCallLog);
        $this->db->where("DATE(Date_log) LIKE ".$dt."");
        $qry = $this->db->get();
        $row = $qry->row();
        $data['today'] = $row;
        $qry->free_result();

        $this->db->select(implode(",", $selArray['touch']));

        $this->db->from($this->tblCallLog);
        $this->db->where("DATE(Date_log) LIKE ".$dt." AND `Remarks` LIKE '%@@@%' AND TelNo NOT IN(0,1,2)");
        $qry = $this->db->get();
        $row = $qry->row();
        $data['touch'] = $row;
        $qry->free_result();

        $this->db->select(implode(",", $selArray['cared']));

        $this->db->from($this->tblCallLog);
        $this->db->where("DATE(Date_log) LIKE ".$dt." AND `Remarks` NOT LIKE '%@@@%' AND TelNo NOT IN(0,1,2)");
        $qry = $this->db->get();
        $row = $qry->row();
        $data['cared'] = $row;
        $qry->free_result();

        $this->db->select(implode(",", $selArray['walkin']));

        $this->db->from($this->tblCallLog);
        $this->db->where("DATE(Date_log) LIKE ".$dt." AND TelNo = 0");
        $qry = $this->db->get();
        $row = $qry->row();
        $data['walkin'] = $row;
        $qry->free_result();

        $this->db->select(implode(",", $selArray['comcenter']));

        $this->db->from($this->tblCallLog);
        $this->db->where("DATE(Date_log) LIKE ".$dt." AND TelNo = 1");
        $qry = $this->db->get();
        $row = $qry->row();
        $data['comcenter'] = $row;
        $qry->free_result();
        $this->db->close();
        return $data;exit();
    }

    public function GetCallsToday($dt = null){
        $dt = (is_null($dt))?"CURDATE()":"CAST('".$dt."' AS DATE)";//($dt == date('Y-m-d')?"CURDATE()":"CAST('".$dt."' AS DATE)");

        $selArray = array("COUNT(*) AS today",
                //--Emergency Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A NOT LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt.") AS emergency",
                //--Other Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt.") AS other",
                //--Hangup Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` WHERE Type_Emergency_ID IN('129','131','170','172') AND DATE(Date_log) LIKE ".$dt.") AS hangup"

        );

        $this->db->select(implode(",", $selArray));

        $this->db->from($this->tblCallLog);
        $this->db->where("DATE(Date_log) LIKE ".$dt."");
        $qry = $this->db->get();
        $row = $qry->row();
        $this->db->close();
        return $row;exit();
    }

    public function GetCallsTodayTouch($dt = null){
        $dt = (is_null($dt))?"CURDATE()":"CAST('".$dt."' AS DATE)";//($dt == date('Y-m-d')?"CURDATE()":"CAST('".$dt."' AS DATE)");

        $selArray = array("COUNT(*) AS today",
        	
                //--Emergency Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A NOT LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND `Remarks` LIKE '%@@@%' AND TelNo NOT IN(0,1,2)) AS emergency",
                //--Other Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND `Remarks` LIKE '%@@@%' AND TelNo NOT IN(0,1,2)) AS other",
                //--Hangup Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` WHERE Type_Emergency_ID IN('129','131','170','172') AND DATE(Date_log) LIKE ".$dt." AND `Remarks` LIKE '%@@@%' AND TelNo NOT IN(0,1,2)) AS hangup"

        );

        $this->db->select(implode(",", $selArray));

        $this->db->from($this->tblCallLog);
        $this->db->where("DATE(Date_log) LIKE ".$dt." AND `Remarks` LIKE '%@@@%' AND TelNo NOT IN(0,1,2)");
        $this->db->limit(1);
        $qry = $this->db->get();
        $row = $qry->row();
        $this->db->close();
        return $row;exit();
    }

    public function GetCallsTodayCared($dt = null){
        $dt = (is_null($dt))?"CURDATE()":"CAST('".$dt."' AS DATE)";//($dt == date('Y-m-d')?"CURDATE()":"CAST('".$dt."' AS DATE)");

        $selArray = array("COUNT(*) AS today",
            
                //--Emergency Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A NOT LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND `Remarks` NOT LIKE '%@@@%' AND TelNo NOT IN(0,1,2)) AS emergency",
                //--Other Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND `Remarks` NOT LIKE '%@@@%' AND TelNo NOT IN(0,1,2)) AS other",
                //--Hangup Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` WHERE Type_Emergency_ID IN('129','131','170','172') AND DATE(Date_log) LIKE ".$dt." AND `Remarks` NOT LIKE '%@@@%' AND TelNo NOT IN(0,1,2)) AS hangup"

        );

        $this->db->select(implode(",", $selArray));

        $this->db->from($this->tblCallLog);
        $this->db->where("DATE(Date_log) LIKE ".$dt." AND `Remarks` NOT LIKE '%@@@%' AND TelNo NOT IN(0,1,2)");
        $this->db->limit(1);
        $qry = $this->db->get();
        $row = $qry->row();
        $this->db->close();
        return $row;exit();
    }

    public function GetCallsTodayWalkIn($dt = null){
        $dt = (is_null($dt))?"CURDATE()":"CAST('".$dt."' AS DATE)";//($dt == date('Y-m-d')?"CURDATE()":"CAST('".$dt."' AS DATE)");

        $selArray = array("COUNT(*) AS today",
            
                //--Emergency Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A NOT LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND TelNo = 0) AS emergency",
                //--Other Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND TelNo = 0) AS other",
                //--Hangup Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` WHERE Type_Emergency_ID IN('129','131','170','172') AND DATE(Date_log) LIKE ".$dt." AND TelNo = 0) AS hangup"

        );

        $this->db->select(implode(",", $selArray));

        $this->db->from($this->tblCallLog);
        $this->db->where("DATE(Date_log) LIKE ".$dt." AND TelNo = 0");
        $this->db->limit(1);
        $qry = $this->db->get();
        $row = $qry->row();
        $this->db->close();
        return $row;exit();
    }

    public function GetCallsTodayComcenter($dt = null){
        $dt = (is_null($dt))?"CURDATE()":"CAST('".$dt."' AS DATE)";//($dt == date('Y-m-d')?"CURDATE()":"CAST('".$dt."' AS DATE)");

        $selArray = array("COUNT(*) AS today",
            
                //--Emergency Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A NOT LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND TelNo = 1) AS emergency",
                //--Other Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE(Date_Log) LIKE ".$dt." AND TelNo = 1) AS other",
                //--Hangup Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` WHERE Type_Emergency_ID IN('129','131','170','172') AND DATE(Date_log) LIKE ".$dt." AND TelNo = 1) AS hangup"

        );

        $this->db->select(implode(",", $selArray));

        $this->db->from($this->tblCallLog);
        $this->db->where("DATE(Date_log) LIKE ".$dt." AND TelNo = 1");
        $this->db->limit(1);
        $qry = $this->db->get();
        $row = $qry->row();
        $this->db->close();
        return $row;exit();
    }

    public function GetMonthlyCalls($dt = null){
        $dt = (is_null($dt))?"CURDATE()":"CAST('".$dt."' AS DATE)";//($dt == date('Y-m-d')?"CURDATE()":"CAST('".$dt."' AS DATE)");

        // $dt = "CAST('2019-05-04' AS DATE)";
        $selArray = array(
                //--Total Emergency Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A NOT LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND MONTHNAME(Date_Log) LIKE MONTHNAME(".$dt.") AND YEAR(Date_Log) LIKE YEAR(".$dt.")) AS total_emerg",
                //--Total Other Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND MONTHNAME(Date_Log) LIKE MONTHNAME(".$dt.") AND YEAR(Date_Log) LIKE YEAR(".$dt.")) AS total_other",
                //--Total Hangup Calls
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` WHERE Type_Emergency_ID IN('129','131','170','172') AND MONTHNAME(Date_Log) LIKE MONTHNAME(".$dt.") AND YEAR(Date_Log) LIKE YEAR(".$dt.")) AS total_hangup",
                //--Total Calls this month
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE MONTHNAME(Date_Log) LIKE MONTHNAME(".$dt.") AND YEAR(Date_Log) LIKE YEAR(".$dt.")) AS total_calls"

        );

        $this->db->select(implode(",", $selArray));

        $this->db->from($this->tblCallLog);
        $this->db->limit(1);
        $qry = $this->db->get();
        $row = $qry->row();
        $this->db->close();
        return $row;exit();
    }

    public function GetAverageCalls($dt = null){
        $startdt = '2021-01-01';//2019-06-26
    	$dt = (is_null($dt))?"CURDATE()":"CAST('".$dt."' AS DATE)";//($dt == date('Y-m-d')?"CURDATE()":"CAST('".$dt."' AS DATE)");
        $arr = array();
        $avg_monthly_emer = "SELECT AVG(test) AS avg FROM (SELECT COUNT(*) AS test FROM ".$this->tblCallLog." AS a INNER JOIN ".$this->tblTE." AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A NOT LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170') AND DATE(Date_Log) BETWEEN CAST('".$startdt."' AS DATE) AND DATE_SUB(".$dt.", INTERVAL 1 MONTH) GROUP BY DATE_FORMAT(Date_Log,'%Y-%c') ORDER BY DATE(Date_Log)) AS testing";

        $avg_daily_emer = "SELECT AVG(test) AS avg FROM (SELECT COUNT(*) AS test FROM ".$this->tblCallLog." AS a INNER JOIN ".$this->tblTE." AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A NOT LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170') AND DATE(Date_Log) BETWEEN CAST('".$startdt."' AS DATE) AND DATE_SUB(".$dt.", INTERVAL 1 DAY) GROUP BY DATE_FORMAT(Date_Log,'%Y-%c-%d') ORDER BY DATE(Date_Log)) AS testing";

        $avg_daily = "SELECT AVG(test) AS avg FROM (SELECT COUNT(*) AS test FROM ".$this->tblCallLog." WHERE DATE(Date_Log) BETWEEN CAST('".$startdt."' AS DATE) AND DATE_SUB(".$dt.", INTERVAL 1 DAY) GROUP BY DATE_FORMAT(Date_Log,'%Y-%c-%d') ORDER BY DATE(Date_Log)) AS testing";

        $qry = $this->db->query($avg_monthly_emer);
        $arr['avg_monthly_emer'] = $qry->result()[0]->avg;
        $qry = $this->db->query($avg_daily_emer);
        $arr['avg_daily_emer'] = $qry->result()[0]->avg;
        $qry = $this->db->query($avg_daily);
        $arr['avg_daily'] = $qry->result()[0]->avg;
        $this->db->close();
        return $arr;exit();
    }

    public function GetStaffPerf($dt = null){
    	$dt = (is_null($dt))?"CURDATE()":($dt == date('Y-m-d')?"CURDATE()":"CAST('".$dt."' AS DATE)");
    	$this->db->select("a.LogBy_ID AS logid, b.FirstName AS fn, COUNT(*) AS cnt,
                    (SELECT Count(*) as Number FROM ".$this->tblCallLog." WHERE Type_Emergency_ID NOT IN('170','172','129','131') AND DATE_FORMAT(Date_Log,'%Y-%c') LIKE DATE_FORMAT(".$dt.",'%Y-%c') AND LogBy_ID=logid) AS call_valid,
                    (SELECT Count(*) as Hangup FROM ".$this->tblCallLog." WHERE Type_Emergency_ID IN('170','172','129','131') AND DATE_FORMAT(Date_Log,'%Y-%c') LIKE DATE_FORMAT(".$dt.",'%Y-%c') AND LogBy_ID=logid) AS call_hangup");
    	$this->db->from($this->tblCallLog." AS a");
    	$this->db->join("password_user AS b","b.Password_ID = a.LogBy_ID","inner");
    	$this->db->where("DATE_FORMAT(Date_Log,'%Y-%c') LIKE DATE_FORMAT(".$dt.",'%Y-%c')");
    	$this->db->group_by("a.LogBy_ID");

    	$qry = $this->db->get();
        $res = $qry->result();
        $this->db->close();
    	return $res;exit();
    }

    public function GetIncidentData($dt = null,$isMonthly = false){
    	$dt = (is_null($dt))?"CURDATE()":"CAST('".$dt."' AS DATE)";//($dt == date('Y-m-d')?"CURDATE()":"CAST('".$dt."' AS DATE)");

        $this->db->select("b.Type_Emergency as Name, COUNT(*) AS cnt");
        $this->db->from($this->tblCallLog." AS a");
        $this->db->join($this->tblTE." AS b","a.Type_Emergency_ID = b.Type_Emergency_ID","INNER");
        $this->db->where((!$isMonthly?"DATE(Date_Log) LIKE ".$dt:"DATE_FORMAT(Date_Log,'%Y-%c') LIKE DATE_FORMAT(".$dt.",'%Y-%c') AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND Group_Name_A NOT LIKE 'other calls'"));
        $this->db->order_by((!$isMonthly?"FIELD(a.Type_Emergency_ID,'170') DESC,COUNT(*) DESC":"COUNT(*) DESC"));
        $this->db->group_by("a.Type_Emergency_ID");

        $qry = $this->db->get();
        $res = $qry->result();
        $this->db->close();
        return $res;exit();
    }

    public function GetHistoryCalls($dt){
    	$dt = (is_null($dt))?"CURDATE()":"CAST('".$dt."' AS DATE)";//($dt == date('Y-m-d')?"CURDATE()":"CAST('".$dt."' AS DATE)");

        $arr = array('CallLog_ID as cid','COUNT(*) AS tcalls','DATE_FORMAT(Date_log,"%b") AS m','YEAR(Date_Log) AS y',
                "(SELECT COUNT(*) FROM `".$this->tblCallLog."` AS a INNER JOIN `".$this->tblTE."` AS b ON a.`Type_Emergency_ID` = b.`Type_Emergency_ID` WHERE Group_Name_A NOT LIKE 'other calls' AND a.Type_Emergency_ID NOT IN('129','131','170','172') AND DATE_FORMAT(Date_Log,'%b') LIKE m AND YEAR(Date_Log) LIKE y) AS temer");
        $this->db->select(implode(',', $arr));
        $this->db->from($this->tblCallLog);
        $this->db->where('YEAR(Date_Log) LIKE YEAR('.$dt.')');
        $this->db->group_by('MONTH(Date_Log),YEAR(Date_Log)');

        $qry = $this->db->get();//log_message('error','test123: '.$this->db->last_query());
        $res = $qry->result();
        $this->db->close();
        return $res;exit();
    }

    /*********************************************************************
    /*for map*************************************************************
    /*********************************************************************/
    
    
}
?>