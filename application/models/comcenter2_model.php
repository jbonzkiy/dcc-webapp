<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Comcenter2_model extends CI_Model {
	private $comdb;
	private $ninedb;
	public function __construct()
    {
            parent::__construct();
            // $this->load->database();
            $this->comdb = $this->load->database('comcenter',TRUE);
    }

    public function LoginVerification($post){
        $uname = $post['uname'];
        $upass = $post['upass'];
        $r = 'ERROR';
        $str = 'SELECT admin_id, password, email, account_type FROM users WHERE email LIKE "'.$uname.'" LIMIT 1';
        $qry = $this->comdb->query($str);
        if($qry->num_rows() == 0){
            $r = 'INVALID_USERNAME';
        }else{
            $row = $qry->row();
            if($upass == $row->password){
                $r = $row;
            }else{
                $r = 'INVALID_PASSWORD';
            }
        }
        return $r;exit();
    }

    public function getData($post){
        $fdt = $post['fdt']; // fron date
        $tdt = $post['tdt']; // to date
        $type = $post['type']; // type of filter
        $addFilter = array();
        
        
        /*
         * -------------------------------------------------------------------
         *  Filter result
         * -------------------------------------------------------------------
         */
        if(isset($post['filterscount'])){

            $fcnt = $post['filterscount'];
            if($fcnt > 0){
                $arrddate = array();
                // for select dropdown filtering data
                $where_in = array();
                $where_in_field = '';

                for($i = 0; $i < $fcnt; $i++){
                    $fdfield = $post["filterdatafield" . $i];
                    $fval = $post["filtervalue" . $i];
 
                    if( $fdfield == 'c_date' ){
                        $addFilter[] = 'DATE(date) LIKE CAST("'.$fval.'" AS date)';
                        // $addFilter['date'] = 'CAST("'.$fval.'" AS date)';
                    }
                    else if ( $fdfield == 'c_time' ){
                        $addFilter[] = 'time LIKE "%'.$fval.'%"';
                    }
                    else if ( $fdfield == 'call_type' ){
                        $where_in[] = '"'.$fval.'"';
                        $where_in_field = 'case_type';
                    }
                    else if ( $fdfield == 'incident_location' ){
                        $addFilter[] = 'location LIKE "%'.$fval.'%"';
                    }
                    else if ( $fdfield == 'details' ){
                        $addFilter[] = 'case_particular LIKE "%'.$fval.'%"';
                    }
                    else if ( $fdfield == 'c_status' ){
                        $where_in[] = '"'.$fval.'"';
                        $where_in_field = 'Status';
                    }
                    else if ( $fdfield == 'c_status' ){
                        $where_in[] = '"'.$fval.'"';
                        $where_in_field = 'Status';
                    }
                    else if ( $fdfield == 'modified_by' ){
                        $where_in[] = '"'.$fval.'"';
                        $where_in_field = 'u.email';
                    }
                    else{
                        $addFilter[] = $fdfield.' LIKE "%'.$fval.'%"';
                        // $addFilter[$fdfield] = $fval;
                    }
                }

                // where in array
                if ( !empty($where_in) ){
                    $addFilter[] = $where_in_field.' IN('.implode(',', $where_in).')';
                }
                
            }

        }

        /*
         * -------------------------------------------------------------------
         *  Filter 'from date' and 'to date'
         * -------------------------------------------------------------------
         */
        if($type != 'default'){
            $addFilter[] = 'CONCAT(date," ",time) BETWEEN "'.$fdt.'" AND "'.$tdt.'"';
        }

        // if( isset($addFilter) ){
        //     foreach($addFilter as $key => $value){
        //         $this->comdb->like($key, $value);
        //     }
        // }
        // if( isset($addFilter) ){
        //     foreach($addFilter as $key => $value){
        //         $like .= "$key LIKE $value";
        //         $this->comdb->like($like);
        //     }
        // }
        
        
        $orderby = ' ORDER BY com.date DESC, com.time DESC';
        $limit = ($type == 'default' && count($addFilter) == 0)?' LIMIT 50':'';
        
        $str = 'SELECT 
                com.report_id,com.FollowUp_ID AS follow_up_id,com.Dispatch_id AS dispatch_id,com.date AS c_date,
                com.time AS c_time,com.memory_of_call AS call_origin,com.icv AS source_of_info,com.caller_name,
                com.contact AS caller_number,com.case_type AS call_type,com.call_category,com.location AS incident_location,
                com.case_particular AS details,com.remarks,com.Status AS c_status,com.Latitude AS latitude,
                com.Longitude AS longitude,
                u.email AS modified_by
                FROM `comm` com LEFT JOIN `users` u ON u.admin_id=com.uid '.(count($addFilter) == 0?'':'WHERE ').implode(' AND ',$addFilter).$orderby.$limit;
        $qry = $this->comdb->query($str);
        return $qry->result();

        // $this->comdb->select('report_id,date AS c_date,time AS c_time,caller_name,case_type AS call_type,location AS incident_location,case_particular AS details,remarks,Status AS c_status');
        // $this->comdb->order_by('c_date DESC, c_time DESC');
        // $this->comdb->limit(50);
        // $query = $this->comdb->get('comm');
        // return $query->result();
        exit();
    }

    public function getFollowUpData($post){
        $report_id = $post['report_id'];
        $responder_followup_ids = [];

        $or_where_array = array(
            'report_id' => $report_id, 
            'FollowUp_ID' => $report_id
        );

        $this->comdb->select('
        com.report_id,com.FollowUp_ID AS follow_up_id,com.Dispatch_id AS dispatch_id,com.date AS c_date,
        com.time AS c_time,com.memory_of_call AS call_origin,com.icv AS source_of_info,com.caller_name,
        com.contact AS caller_number,com.case_type AS call_type,com.call_category,com.location AS incident_location,
        com.case_particular AS details,com.remarks,com.Status AS c_status,com.Latitude AS latitude,
        com.Longitude AS longitude,
        u.email AS modified_by', FALSE);
        $this->comdb->join('users u', 'u.admin_id = com.uid', 'left');
        $this->comdb->or_where($or_where_array);
        return $this->comdb->get('comm com')->result();
    }

    public function getAddResponderData($post){
        $report_id = $post['report_id'];
        $responder_followup_ids = [$report_id];
        $r = [];

        // get reponder data
        $follow_up_data = $this->getFollowUpData(array('report_id' => $report_id));
        foreach ($follow_up_data as $value) {
            $responder_followup_ids[] = $value->report_id;
        }

        if($responder_followup_ids){
            $this->comdb->select('
            res.resp_id,res.id,res.Sub_id AS sub_id,res.unit AS response_unit,res.Sub_unit AS response_sub_unit,res.Call_origin AS response_call_origin,
            res.time_call AS response_time,res.Status AS acknowledge,res.receive_by AS acknowledge_by,
            u.email AS modified_by', FALSE);
            $this->comdb->join('users u', 'u.admin_id = res.uid', 'left');
            $this->comdb->where_in('res.id', $responder_followup_ids);
            $r = $this->comdb->get('response_unit res')->result();
        }

        return $r;
    }

    public function saveData($post) {
        // save to comm table
        $arr_comcenter = array(
            'date' => $post['date'],
            'time' => $post['time'],
            'memory_of_call' => $post['memory_of_call'],
            'icv' => $post['icv'],
            'caller_name' => $post['caller_name'],
            'contact' => $post['contact'],
            'call_category' => $post['call_category'],
            'case_type' => $post['case_type'],
            'location' => $post['location'],
            'case_particular' => $post['case_particular'],
            'remarks' => $post['remarks'],
            'Status' => $post['Status'],
            'Latitude' => $post['Latitude'],
            'Longitude' => $post['Longitude'],
            'Dispatch_ID' => $post['Dispatch_ID'],
            'uid' => $post['uid']
        );
        $qry_comcenter = $this->comdb->insert('comm', $arr_comcenter);
        $last_inserted_id = $this->comdb->insert_id(); // return last inserted id

        if ( isset($last_inserted_id) ) {
            // save to reponse unit
            if ( $post['unit'] !== '' && $post['unit'] !== 'NONE' ) {

                $this->saveResponderData($post, $last_inserted_id);
            }
        }

        return $qry_comcenter;
        exit();
    }

    public function saveResponderData($post, $id) {
        $this->comdb->select_max('Sub_id');
        $this->comdb->where('id', $id);
        $sub_id_query = $this->comdb->get('response_unit');
        $sub_id_query_data = $sub_id_query->row();
        
        if ( isset($sub_id_query_data) ) {
            $max_sub_id = (int)$sub_id_query_data->Sub_id + 1;
            
            $arr_response_unit = array(
                'id' => $id,
                'Sub_id' => $max_sub_id,
                'unit' => $post['unit'],
                'Sub_unit' => $post['Sub_unit'],
                'Call_origin' => $post['Call_origin'],
                'time_call' => $post['time_call'],
                'Status' => $post['acknowledge'],
                'receive_by' => $post['receive_by'],
                'uid' => $post['uid']  
            );
            return $this->comdb->insert('response_unit', $arr_response_unit);
        }
    }

    public function updateData($post) {
        $data = array(
            'date' => $post['date'],
            'time' => $post['time'],
            'memory_of_call' => $post['memory_of_call'],
            'icv' => $post['icv'],
            'caller_name' => $post['caller_name'],
            'contact' => $post['contact'],
            'call_category' => $post['call_category'],
            'case_type' => $post['case_type'],
            'location' => $post['location'],
            'case_particular' => $post['case_particular'],
            'remarks' => $post['remarks'],
            'Status' => $post['Status'],
            'Latitude' => $post['Latitude'],
            'Longitude' => $post['Longitude'],
            // 'Dispatch_ID' => $post['Dispatch_ID'],
            'uid' => $post['uid']
        );
        
        $this->comdb->where('report_id', $post['update_id']);
        $qry_update_com = $this->comdb->update('comm', $data);

        // if ( $qry_update_com ) {
        //     // update to reponse unit
        //     if ( $post['unit'] !== '' && $post['unit'] !== 'NONE' ) {

        //         $this->updateResponderData($post, $post['update_id']);
        //     }
        // }

        return $qry_update_com;
        exit();
    }

    public function updateResponderData($post, $id) {
        if ( isset($post['update_id']) && isset($post['response_sub_id']) ) {
            $arr_response_unit = array(
                'id' => $id,
                'unit' => $post['unit'],
                'Sub_unit' => $post['Sub_unit'],
                'Call_origin' => $post['Call_origin'],
                'time_call' => $post['time_call'],
                'Status' => $post['acknowledge'],
                'receive_by' => $post['receive_by']
            );
            $this->comdb->where(array('id' => $post['update_id'], 'Sub_id' => $post['response_sub_id']));
            $this->comdb->update('response_unit', $arr_response_unit);
        }
    }

    public function saveFollowUpData($post) {
        // save to comm table
        $arr_comcenter = array(
            'FollowUp_ID' => $post['report_id'],

            'date' => $post['date'],
            'time' => $post['time'],
            'memory_of_call' => $post['memory_of_call'],
            'icv' => $post['icv'],
            'caller_name' => $post['caller_name'],
            'contact' => $post['contact'],
            'case_type' => $post['case_type'],
            'call_category' => $post['call_category'],
            'location' => $post['location'],
            'Latitude' => $post['Latitude'],
            'Longitude' => $post['Longitude'],
            'case_particular' => $post['case_particular'],

            'Status' => $post['Status'],
            'remarks' => $post['remarks'],

            'uid' => $post['uid']
        );
        $qry_comcenter = $this->comdb->insert('comm', $arr_comcenter);

        return $qry_comcenter;
        exit();
    }

    public function saveAddResponderData($post) {

        if ( isset($post['report_id']) ) {
            // save to reponse unit
            if ( $post['unit'] !== '' && $post['unit'] !== 'NONE' ) {

                $qry_comcenter = $this->saveResponderData($post, $post['report_id']);
            }
        }

        return $qry_comcenter;
        exit();
    }

    public function updateAddResponderData($post) {
        $arr_response_unit = array(
            'unit' => $post['unit'],
            'Sub_unit' => $post['Sub_unit'],
            'Call_origin' => $post['Call_origin'],
            'time_call' => $post['time_call'],
            'Status' => $post['acknowledge'],
            'receive_by' => $post['receive_by']
        );
        $this->comdb->where(array('resp_id' => $post['update_id']));
        $qry_update_com = $this->comdb->update('response_unit', $arr_response_unit);

        return $qry_update_com;
        exit();
    }

    public function getUsers(){
        $this->comdb->select('admin_id, email');
        $this->comdb->order_by('email', 'ASC');
        return $this->comdb->get('users')->result();
    }

    public function FetchRecordData($post){
    	$from = '2019-08-01';//$data->from;
    	$to = '2019-08-31';//$data->to;
    	$pagenum = $post['pagenum'];//$_GET['pagenum'];
		$pagesize = $post['pagesize'];//$_GET['pagesize'];
		$start = $pagenum * $pagesize;

        /*
         * -------------------------------------------------------------------
         * Filter from grid
         * -------------------------------------------------------------------
         */
        $wherecom = array();
        $wherenine = array();

        $colcom = array('cname'=>'caller_name','ctype'=>'case_type','loc'=>'location',
            'cpart'=>'case_particular','rem'=>'remarks','ops'=>'operator_on_duty','stats'=>'Status','f'=>'"comcenter"');
        $colnine = array('cname'=>'NameCaller','ctype'=>'b.Type_Emergency','loc'=>'Address','rem'=>'Remarks','ops'=>'LogBy','f'=>'"ers"');

        $dtfiltercom = 'DATE(date) LIKE CURDATE()';
        $dtfiltercomnine = 'DATE(Date_Log) LIKE CURDATE()';
        /*
         * -------------------------------------------------------------------
         *  Filter result
         * -------------------------------------------------------------------
         */
        if (isset($post['filterscount'])){
            $filterscount = $post['filterscount'];
            if($filterscount > 0){
                $ctype = array(); $isIN = true;
                for ($i = 0; $i < $filterscount; $i++){
                    // get the filter's value.
                    $fval = $post["filtervalue" . $i];
                    // get the filter's column.
                    $fcol = $post["filterdatafield" . $i];
                    $fcond = $post["filtercondition".$i];
                    if($fcol == 'dt'){
                        $dtfiltercom = '';
                        $dtfiltercomnine = '';
                        $spdt = explode(',', $fval);
                        $wherecom[] = 'CONCAT(date," ",time) BETWEEN "'.$spdt[0].'" AND "'.$spdt[1].'"';
                        $wherenine[] = 'DATE_FORMAT(Date_Log,"%Y-%m-%d %H:%i") BETWEEN "'.$spdt[0].'" AND "'.$spdt[1].'"';
                    }elseif($fcol == 'ctype'){
                        $ctype[] = '"'.$fval.'"';
                        $isIN = ($fcond == 'EQUAL');
                    }else{
                        $wherecom[] = ($fcol == 'rid')?'report_id = '.$fval:(array_key_exists($fcol, $colcom)?$colcom[$fcol]:'"N/A"').' LIKE "%'.($fcol == 'f' && $fval == 'all'?'comcenter':$fval).'%"';
                        $wherenine[] = ($fcol == 'rid')?'CallLog_ID = '.$fval:(array_key_exists($fcol, $colnine)?$colnine[$fcol]:'"N/A"').' LIKE "%'.($fcol == 'f' && $fval == 'all'?'ers':$fval).'%"';
                    }
                }

                if(count($ctype) != 0){
                    $wherecom[] = 'case_type '.($isIN?'': 'NOT').' IN ('.implode(',', $ctype).')';
                    $wherenine[] = 'b.Type_Emergency '.($isIN?'': 'NOT').' IN ('.implode(',', $ctype).')';
                }
            }
        }

        /*
         * -------------------------------------------------------------------
         *  Sort result
         * -------------------------------------------------------------------
         */
        $sort = 'dt DESC';
        if (isset($post['sortdatafield'])){
            $sortfield = $post['sortdatafield'];
            $sortorder = $post['sortorder'];
            if ($sortorder != ''){
                $sort = $sortfield.' '.$sortorder;
            }
        }
        $strqry = 'SELECT SQL_CALC_FOUND_ROWS rid,dt,cname,ctype,loc,cpart,rem,ops,stats,f FROM ((SELECT report_id AS rid,CONCAT(date," ",time) AS dt,caller_name AS cname,case_type AS ctype,location AS loc,case_particular AS cpart,remarks AS rem,operator_on_duty AS ops,Status AS stats,"comcenter" AS f FROM comm WHERE '.implode(' AND ', $wherecom).' '.($dtfiltercom != '' && count($wherecom) > 0?' AND ':'').$dtfiltercom.') UNION ALL (SELECT CallLog_ID AS rid,DATE_FORMAT(Date_Log,"%Y-%m-%d %H:%i") AS dt,NameCaller AS cname,b.Type_Emergency AS ctype,Address AS loc,"N/A" AS cpart,Remarks AS rem,LogBy AS ops,"N/A" AS stats,"ers" AS f FROM fed_call_log AS a INNER JOIN fed_type_emergency AS b ON a.Type_Emergency_ID = b.Type_Emergency_ID WHERE '.implode(' AND ', $wherenine).' '.($dtfiltercomnine != '' && count($wherenine) > 0?' AND ':'').$dtfiltercomnine.')) AS test ORDER BY '.$sort.' LIMIT '.$start.','.$pagesize;

        

        $res = $this->comdb->query($strqry)->result();
        // log_message('error','test: '.$this->comdb->last_query());
        $qrycnt = $this->comdb->query("SELECT FOUND_ROWS() AS cnt")->row()->cnt;

    	$arr = array('TotalRows'=>$qrycnt,'Rows'=>$res);
    	return $arr;exit();
    }

    public function GetAllCallType(){
        $str = 'Type_Emergency';
        $this->db->select('Type_Emergency')->where('active',1)->order_by('Group_Name_A ASC,Type_Emergency ASC');
        $qry = $this->db->get('type_emergency');

        return $qry->result();exit();
    }
}
?>