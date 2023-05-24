<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Report_model extends CI_Model {
	private $comdb;
	private $ninedb;
    private $cdrrmd;
	public function __construct()
    {
            parent::__construct();
            $this->load->database();
            $this->comdb = $this->load->database('comcenter',TRUE);
            $this->cdrrmd = $this->load->database('cdrrmd',TRUE);
            $this->ninedb = $this->load->database('nineoneone',TRUE);
    }

    public function GetErsMonthlyCallsReceive($dt){
    	$dt = explode('/', $dt);

    	$str = 'SELECT type_emergency AS incident_type, group_name_a AS group_type, COUNT(*) AS ERS FROM  `fed_call_log` AS a INNER JOIN fed_type_emergency AS b ON a.type_emergency_id = b.type_emergency_id 
    	WHERE DATE( date_log ) BETWEEN  CAST("'.$dt[0].'" AS DATE) AND  CAST("'.$dt[1].'" AS DATE) AND TelNo NOT IN(1) AND Remarks NOT LIKE  "%***%" GROUP BY 
    	type_emergency ORDER BY group_name_a, type_emergency';

    	$qry = $this->comdb->query($str);
    	$row = $qry->result();

    	$strprank = 'SELECT "prank" AS incident_type, "Prank" AS group_type, COUNT( * ) AS ERS FROM  `fed_call_log` AS a INNER JOIN fed_type_emergency AS b ON a.type_emergency_id = 
    	b.type_emergency_id WHERE DATE( date_log )  BETWEEN  CAST("'.$dt[0].'" AS DATE) AND  CAST("'.$dt[1].'" AS DATE) AND
    	TelNo NOT IN(1) AND Remarks LIKE "%***%"';
    	$qryprank = $this->comdb->query($strprank);
    	$rowprank = $qryprank->row();
    	if(isset($rowprank)){
    		$row = (object) array_merge((array)$row,(array)[$rowprank]);
    	}

    	return $row; exit();
    }

	public function GetComcenterMonthlyCallsReceive($dt){
		$dt = explode('/', $dt);

    	$str = 'SELECT case_type AS incident_type, call_category AS group_type, COUNT( * ) AS COMCENTER FROM  comm WHERE 
    	DATE( `date` ) BETWEEN  CAST("'.$dt[0].'" AS DATE) AND  CAST("'.$dt[1].'" AS DATE) AND 
    	Dispatch_ID = 0 AND memory_of_call != "CDRRMD" AND
    	case_type NOT IN("Information","Weather Update")
    	GROUP BY case_type ORDER BY call_category,
    	case_type';

    	$qry = $this->comdb->query($str);
    	$row = $qry->result();

    	return $row; exit();
    }

    public function GetChartData($dt){
    	$dt = explode('/', $dt);

    	$str = 'SELECT cat,type,cnt FROM (
    	
    	(SELECT "ers" AS cat,"CARED" AS type, COUNT(*) AS cnt FROM `fed_call_log`  WHERE date(date_log) BETWEEN 
    	CAST("'.$dt[0].'" AS DATE) AND  CAST("'.$dt[1].'" AS DATE) AND TelNo NOT IN (0,1,2) AND Remarks NOT LIKE "%@@@%")

    	UNION ALL

    	(SELECT "ers" AS cat,"TOUCHPOINT" AS type, COUNT(*) AS cnt FROM `fed_call_log`  WHERE date(date_log) BETWEEN 
    	CAST("'.$dt[0].'" AS DATE) AND  CAST("'.$dt[1].'" AS DATE) AND TelNo NOT IN (0,1,2) AND Remarks LIKE "%@@@%")

    	UNION ALL

    	(SELECT "ers" AS cat,"radioers" AS type, COUNT(*) AS cnt FROM `fed_call_log`  WHERE date(date_log) BETWEEN 
    	CAST("'.$dt[0].'" AS DATE) AND  CAST("'.$dt[1].'" AS DATE) AND TelNo IN(2) )

    	UNION ALL

    	(SELECT "com" AS cat,memory_of_call AS type, COUNT(*) FROM `comm` WHERE 
    	DATE(`date`) BETWEEN CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE) AND 
    	`Dispatch_ID` = 0 AND memory_of_call != "CDRRMD" AND
    	case_type NOT IN("Information","Weather Update")
    	GROUP BY memory_of_call)

    	UNION ALL

    	(SELECT "ers" AS cat,"walkin" AS type, COUNT(*) AS cnt FROM `fed_call_log`  WHERE date(date_log) BETWEEN 
    	CAST("'.$dt[0].'" AS DATE) AND  CAST("'.$dt[1].'" AS DATE) AND TelNo = 0  )
    	) AS tbl';

    	$qry = $this->comdb->query($str);
    	$row = $qry->result();

    	return $row; exit();
    }

    public function GetRefOtherAgency($dt){
        $dt = explode('/', $dt);
        $arr = array();

        $str = 'SELECT `Reason`, COUNT(*) AS cnt FROM `fed_trans_other_agency` WHERE DATE(`Date_Log`) BETWEEN 
        CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE) GROUP BY `Reason` ORDER BY `Reason`';

        $qry = $this->comdb->query($str);
        $arr['ERS'] = $qry->result();

        $qry->free_result();

        $str = 'SELECT unit, COUNT(*) AS cnt FROM `response_unit` AS a LEFT JOIN `comm` AS b ON a.id = b.report_id WHERE 
        DATE(`date`) BETWEEN CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE) GROUP BY unit ORDER BY unit';

        $qry = $this->comdb->query($str);
        $arr['COMCENTER'] = $qry->result();
        $qry->free_result();
        return $arr; exit();
    }

    public function GetMonthlyCallsResponded($dt){
        $dt = explode('/', $dt);

        // $str = 'SELECT team,Type_Emergency AS incident_type,group_name_a AS group_type, COUNT(*) AS cnt FROM (
        // (SELECT "EMS" AS team,Type_Emergency,group_name_a,COUNT(Call_Log_ID) AS cnt FROM fed_dispatch_team AS a LEFT JOIN fed_call_log AS b 
        // ON a.Call_Log_ID = b.CallLog_ID LEFT JOIN fed_type_emergency AS c ON b.Type_Emergency_ID = c.Type_Emergency_ID 
        // WHERE DATE(b.Date_Log) BETWEEN CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE) AND Team LIKE "%alpha%"
        // GROUP BY Call_Log_ID) 
        // UNION ALL 
        // (SELECT "USAR" AS team,Type_Emergency,group_name_a,COUNT(Call_Log_ID) AS cnt FROM fed_dispatch_team AS a LEFT JOIN fed_call_log 
        // AS b ON a.Call_Log_ID = b.CallLog_ID LEFT JOIN fed_type_emergency AS c ON b.Type_Emergency_ID = c.Type_Emergency_ID
        // WHERE DATE(b.Date_Log) BETWEEN CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE) AND Team NOT LIKE "%alpha%"
        // GROUP BY Call_Log_ID)
        // UNION ALL
        // (SELECT "ALL" AS team,Type_Emergency,group_name_a,COUNT(Call_Log_ID) AS cnt FROM fed_dispatch_team AS a LEFT JOIN fed_call_log 
        // AS b ON a.Call_Log_ID = b.CallLog_ID LEFT JOIN fed_type_emergency AS c ON b.Type_Emergency_ID = c.Type_Emergency_ID
        // WHERE DATE(b.Date_Log) BETWEEN CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE) GROUP BY Call_Log_ID)
        // ) AS tbl GROUP BY team,Type_Emergency ORDER BY team,group_name_a, type_emergency';
        $str = 'SELECT CASE WHEN Team LIKE "%alpha%" THEN "EMS" ELSE "USAR" END AS team,Type_Emergency AS incident_type,group_name_a AS group_type, COUNT(*) AS cnt FROM (SELECT Team, Type_Emergency,group_name_a,Call_Log_ID FROM fed_dispatch_team AS a JOIN fed_call_log AS b ON a.Call_Log_ID = b.CallLog_ID LEFT JOIN fed_type_emergency AS c ON b.Type_Emergency_ID = c.Type_Emergency_ID WHERE DATE(b.Date_Log) BETWEEN CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE) GROUP BY Call_Log_ID) AS tbl GROUP BY CASE WHEN Team LIKE "%alpha%" THEN "EMS" ELSE "USAR" END, Type_Emergency ORDER BY CASE WHEN Team LIKE "%alpha%" THEN "EMS" ELSE "USAR" END,group_name_a, type_emergency';

        $qry = $this->comdb->query($str);
        $r = $qry->result();
        $qry->free_result();
        return $r;exit();
    }
    /**********************************************************************/
    //Weather Systems
    /**********************************************************************/
    public function GetWeatherSystem($dt){
        $dt = explode('/', $dt);
        $arr = array();

        $str = '(SELECT affecting_CDO AS weather, "affected" AS type FROM weather_system WHERE affecting_CDO != "" 
        AND `date_advi` BETWEEN CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE)) UNION 
        (SELECT not_affecting AS weather, "not affected" AS type FROM weather_system WHERE not_affecting != "" 
        AND `date_advi` BETWEEN CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE)) ORDER BY weather';

        $qry = $this->cdrrmd->query($str);
        $r = $qry->result();
        $qry->free_result();
        return $r; exit();
    }

    public function GetPWS($dt){
        $dt = explode('/', $dt);
        $arr = array();

        $str = 'SELECT `affecting_CDO`, COUNT(`ID`) AS cnt FROM `weather_system` WHERE `date_advi` BETWEEN CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE) AND `affecting_CDO` != "" GROUP BY `affecting_CDO`';

        $qry = $this->cdrrmd->query($str);
        $r = $qry->result();
        $qry->free_result();
        return $r; exit();
    }

    public function GetATF($dt){
        $dt = explode('/', $dt);
        $arr = array();

        $str = 'SELECT type,cnt FROM ((SELECT "Actual Thunderstorm" AS type, COUNT(dt) AS cnt FROM (SELECT `date_advi` AS dt FROM
        `links` WHERE `date_advi` BETWEEN CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE) AND `xprain` LIKE "yes" 
        GROUP BY `date_advi`) AS atbl) UNION (SELECT "Flooding" AS type, COUNT(dt) AS cnt FROM (SELECT `date_advi` AS dt FROM `links` WHERE `date_advi` BETWEEN CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE) AND `type_advi` LIKE "urban flooding" GROUP BY `date_advi`) AS ftbl )) AS tbl';

        $qry = $this->cdrrmd->query($str);
        $r = $qry->result();
        $qry->free_result();
        return $r; exit();
    }
    /**********************************************************************/
    //Infocast
    /**********************************************************************/
    public function GetTotalTextSent($dt){
        $dt = explode('/', $dt);
        $arr = array();

        $str = 'SELECT SUM(`Total_Text_Sent`) as cnt FROM `links` WHERE `date_advi` BETWEEN 
        CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE)';

        $qry = $this->cdrrmd->query($str);
        $r = $qry->row()->cnt;
        $qry->free_result();
        return $r; exit();
    }

    public function GetInfoDessemination($dt){
        $dt = explode('/', $dt);
        $arr = array();

        $str = 'SELECT `type_advi`,COUNT(`Text`) AS cnt FROM `links` WHERE `date_advi` BETWEEN
        CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE) AND `infocast`  LIKE "yes"
        GROUP BY `type_advi`';

        $qry = $this->cdrrmd->query($str);
        $r = $qry->result();
        $qry->free_result();
        return $r; exit();
    }

    public function GetInfocastSubs(){

        $str = 'SELECT `Category` AS cat,COUNT(`id`) AS cnt FROM `infocast` GROUP BY `Category`';

        $qry = $this->cdrrmd->query($str);
        $r = $qry->result();
        $qry->free_result();
        return $r; exit();
    }

    public function GetFB($dt){
        $dt = explode('/', $dt);
        $arr = array();

        $str = 'SELECT (SELECT COUNT(`id`) AS cnt FROM `links` WHERE `date_advi` BETWEEN 
        CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE) AND `missed_advisory` LIKE
        "posted advisory") AS tpost, (SELECT COUNT(`id`) AS cnt FROM `links` WHERE
        `date_advi` BETWEEN CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE) AND
        `missed_advisory` LIKE "missed advisory") AS mpost';

        $qry = $this->cdrrmd->query($str);
        $r = $qry->row();
        $qry->free_result();
        return $r; exit();
    }

    public function GetFBPosted($dt){
        $dt = explode('/', $dt);
        $arr = array();

        $str = 'SELECT `type_advi`,COUNT(`id`) AS cnt FROM `links` WHERE `date_advi` BETWEEN
        CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE) AND `missed_advisory` LIKE
        "posted advisory" GROUP BY `type_advi`';

        $qry = $this->cdrrmd->query($str);
        $r = $qry->result();
        $qry->free_result();
        return $r; exit();
    }
    /**********************************************************************/
    //Weather system data comparison
    /**********************************************************************/
    public function GetData($post){
        $ws = $post['ws'];
        $acdo = $post['acdo'];
        $dt = $post['dt'];
        $dt = explode('/', $dt);

        
    }

    /**********************************************************************/
    //Summary of Response Time
    /**********************************************************************/
    public function GetSummaryResponseTime($dt){
        $dt = explode('/', $dt);
        $arr = array();
        $datelog = 'DATE_FORMAT(a.Date_Log, "%Y-%m-%d") BETWEEN CAST("'.$dt[0].'" AS DATE) AND CAST("'.$dt[1].'" AS DATE)';
        $where = 'b.Team LIKE "%alpha%" AND (b.Accomplishment_ID IN(6,9,11,12,16,17,18,19,20,22,23,24,47,50,52,53,56,58) OR (b.Accomplishment_ID = 0 AND d.Type_ID = 11))';

        $str = 'SELECT "timecall_to_dispatched" AS type, "" AS invalid_cnt, COUNT(*) AS total_cnt, SUM( response_time > 0 ) AS total_valid_cnt, SUM(response_time) AS sum_response_time, ( SUM(response_time) / SUM( response_time > 0 ) ) AS average_response_time, SUM( response_time = 0 ) AS negative_cnt, SUM(IF(response_time IS NULL,1,0)) AS null_cnt
        FROM (
            (
                SELECT (CASE
                    WHEN ( TIMESTAMPDIFF(SECOND, a.Date_Log, b.Time_Dispatched) > 0 ) THEN ( TIMESTAMPDIFF(SECOND, a.Date_Log, b.Time_Dispatched) )
                    WHEN ( TIMESTAMPDIFF(SECOND, a.Date_Log, b.Time_Dispatched) ) IS NULL THEN NULL
                    WHEN ( TIMESTAMPDIFF(SECOND, a.Date_Log, b.Time_Dispatched) < 0 ) THEN 0
                    ELSE 0
                END) AS response_time 
                FROM `call_log` a 
                LEFT JOIN dispatch_team b ON a.CallLog_ID=b.Call_Log_ID
                LEFT JOIN completed d ON d.Call_log_ID = a.CallLog_ID 
                WHERE '.$datelog.' AND '.$where.'
            )
        ) AS tbl1 UNION
        
        SELECT "dispatched_to_depart" AS type, SUM( response_time >= 900 ) AS invalid_cnt, COUNT(*) AS total_cnt, SUM( response_time > 0 && response_time < 900 ) AS total_valid_cnt, SUM(response_time) AS sum_response_time, ( SUM(response_time) / SUM( response_time > 0 && response_time < 900 ) ) AS average_response_time, SUM( response_time = 0 ) AS negative_cnt, SUM(IF(response_time IS NULL,1,0)) AS null_cnt
        FROM (
            (
                SELECT (CASE
                    WHEN ( TIMESTAMPDIFF(SECOND, b.Time_Dispatched, b.Time_Departed) > 0 && TIMESTAMPDIFF(SECOND, b.Time_Dispatched, b.Time_Departed) < 900 ) THEN ( TIMESTAMPDIFF(SECOND, b.Time_Dispatched, b.Time_Departed) )
                    WHEN ( TIMESTAMPDIFF(SECOND, b.Time_Dispatched, b.Time_Departed) ) IS NULL THEN NULL
                    WHEN ( TIMESTAMPDIFF(SECOND, b.Time_Dispatched, b.Time_Departed) < 0 ) THEN 0
                    ELSE 0
                END) AS response_time 
                FROM `call_log` a 
                LEFT JOIN dispatch_team b ON a.CallLog_ID=b.Call_Log_ID
                LEFT JOIN completed d ON d.Call_log_ID = a.CallLog_ID 
                WHERE '.$datelog.' AND '.$where.'
            )
        ) AS tbl2 UNION
        
        SELECT "dispatched_to_arrived" AS type, "" AS invalid_cnt, COUNT(*) AS total_cnt, SUM( response_time > 0 ) AS total_valid_cnt, SUM(response_time) AS sum_response_time, ( SUM(response_time) / SUM( response_time > 0 ) ) AS average_response_time, SUM( response_time = 0 ) AS negative_cnt, SUM(IF(response_time IS NULL,1,0)) AS null_cnt
        FROM (
            (
                SELECT (CASE
                    WHEN ( TIMESTAMPDIFF(SECOND, b.Time_Dispatched, b.Time_Arrived) > 0 ) THEN ( TIMESTAMPDIFF(SECOND, b.Time_Dispatched, b.Time_Arrived) )
                    WHEN ( TIMESTAMPDIFF(SECOND, b.Time_Dispatched, b.Time_Arrived) ) IS NULL THEN NULL
                    WHEN ( TIMESTAMPDIFF(SECOND, b.Time_Dispatched, b.Time_Arrived) < 0 ) THEN 0
                    ELSE 0
                END) AS response_time 
                FROM `call_log` a 
                LEFT JOIN dispatch_team b ON a.CallLog_ID=b.Call_Log_ID
                LEFT JOIN completed d ON d.Call_log_ID = a.CallLog_ID 
                WHERE '.$datelog.' AND '.$where.'
            )
        ) AS tbl3 UNION
        
        SELECT "dispatched_to_accomplished" AS type, "" AS invalid_cnt, COUNT(*) AS total_cnt, SUM( response_time > 0 ) AS total_valid_cnt, SUM(response_time) AS sum_response_time, ( SUM(response_time) / SUM( response_time > 0 ) ) AS average_response_time, SUM( response_time = 0 ) AS negative_cnt, SUM(IF(response_time IS NULL,1,0)) AS null_cnt
        FROM (
            (
                SELECT (CASE
                    WHEN ( TIMESTAMPDIFF(SECOND, b.Time_Dispatched, b.Time_Accomplished) > 0 ) THEN ( TIMESTAMPDIFF(SECOND, b.Time_Dispatched, b.Time_Accomplished) )
                    WHEN ( TIMESTAMPDIFF(SECOND, b.Time_Dispatched, b.Time_Accomplished) ) IS NULL THEN NULL
                    WHEN ( TIMESTAMPDIFF(SECOND, b.Time_Dispatched, b.Time_Accomplished) < 0 ) THEN 0
                    ELSE 0
                END) AS response_time 
                FROM `call_log` a 
                LEFT JOIN dispatch_team b ON a.CallLog_ID=b.Call_Log_ID
                LEFT JOIN completed d ON d.Call_log_ID = a.CallLog_ID 
                WHERE '.$datelog.' AND '.$where.'
            )
        ) AS tbl4';


        $qry = $this->ninedb->query($str);
        $r = $qry->result();
        $qry->free_result();
        $this->ninedb->close();
        return $r; exit();
    }

}

?>