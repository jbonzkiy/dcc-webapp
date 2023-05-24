<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Weather_model extends CI_Model {
	private $cdrrmd;
    private $comdb;
    private $comcenter;
	public function __construct()
    {
            parent::__construct();
            // $this->load->database();
             $this->cdrrmd = $this->load->database('cdrrmd',TRUE);
             $this->comdb = $this->load->database('comcenter',TRUE);
    }

    
    public function LoginVerification($post){
        $uname = $post['uname'];
        $upass = $post['upass'];
        $r = 'ERROR';
        $str = 'SELECT uid, upass, uname, access,fname,active FROM w_user WHERE uname LIKE "'.$uname.'" LIMIT 1';
        $qry = $this->comdb->query($str);
        if($qry->num_rows() == 0){
            $r = 'INVALID_USERNAME';
        }else{
            $row = $qry->row();
            //check if user is active
            if((int)$row->active == 1){
                if($upass == $row->upass){
                    $r = $row;
                }else{
                    $r = 'INVALID_PASSWORD';
                }
            }else{
                $r = 'INACTIVE_USER';
            }
            
        }
        return $r;exit();
    }
    //get all user list
    public function getUserList(){
        $str = 'SELECT uid,uname,upass,fname,access FROM w_user WHERE active = 1';
        $qry = $this->comdb->query($str);
        return $qry->result();exit();
    }

    public function saveData($p){
        $r = 'WTF';
        if((int)$p['update_id'] == 0){
            switch($p['tp']){
                case 'entry':
                  $r = $this->insertEntryData($p);
                  break;
                case 'flood':
                  $r = $this->insertFloodData($p);
                  break;
                case 'infocast':
                  $r = $this->insertInfocastData($p);
                  break;
                case 'user':
                  $r = $this->insertUserData($p);
                  break;
            }
            
        }else{
            switch($p['tp']){
                case 'entry':
                  $r = $this->updateEntryData($p);
                  break;
                case 'entry delete':
                  $r = $this->deleteEntry($p);
                  break;
                case 'flood':
                  $r = $this->updateFloodData($p);
                  break;
                case 'flood delete':
                  $r = $this->deleteFloodData($p);
                  break;
                case 'infocast':
                  $r = $this->updateInfocastData($p);
                  break;
                case 'infocast delete':
                  $r = $this->deleteInfocast($p);
                  break;
                case 'user':
                  $r = $this->updateUserData($p);
                  break;
                case 'user delete':
                  $r = $this->deleteUser($p);
                  break;
                case 'gauges log delete':
                    $r = $this->deleteGaugeLog($p);
                    break;
            }
            
        }
        return $r; exit();
    }
    /***************************************************************************
    * ENTRY
    ****************************************************************************/
    private function deleteEntry($p){
        $r = 'OK';
        
        $this->comdb->trans_start();

        $this->comdb->where_in('did', $p['dids']);
        $this->comdb->delete(array('w_data','w_tc','w_ws'));

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
    }
    private function insertEntryData($p){
        //get total infocast subscribers
        $qry = $this->comdb->query('SELECT COUNT(cid) AS cnt FROM w_infocast');
        $totalSubs = (int)$qry->row()->cnt;
        $qry->free_result();

        $r = 'OK';
        //prepare insert array
        $wdata = array(
            'slnk'=>$p['slnk'],
            'slnk_dt'=>$p['slnkdt'],
            'clnk'=>$p['clnk'],
            'clnk_dt'=>$p['clnkdt'],
            'type_post'=>$p['tpost'],
            'type_advi'=>$p['tadvi'],
            'estat'=>$p['estat'],
            'rescues'=>$p['rescues'],
            'cdo_affect'=>$p['cdoaffected'],
            'affect_area'=>$p['affected_area'],
            'infocast'=>$p['infocast'],
            'total_text'=>$p['txtsent'],
            'offset_contact'=>$p['exludecontacts'],
            'total_contact'=>$totalSubs,
            'missed_post'=>$p['missedpost'],
            'missed_by'=>$p['missedby'],
            'xp_rain'=>$p['xprain'],
            'remarks'=>$p['remarks'],
            'uid'=>$p['userid'],
            'dt_created'=>date('Y-m-d H:i:s')
        );
        
        $this->comdb->trans_begin();

        $this->comdb->insert('w_data',$wdata);
        
        $did = $this->comdb->insert_id();
        $wws = array();$wtc = array();

        if(isset($p['cdo_ws_tc_list'])){
            $cdo_wc_tc_list = $p['cdo_ws_tc_list'];
            if(isset($cdo_wc_tc_list['ws'])){
                foreach($cdo_wc_tc_list['ws'] as $val){
                    $wws[] = array('did'=>$did,'name'=>$val,'lst_group'=>'cdo','dt_created'=>date('Y-m-d H:i:s'));
                }
            }
            if(isset($cdo_wc_tc_list['tc'])){
                foreach($cdo_wc_tc_list['tc'] as $val){
                    $wtc[] = array('did'=>$did,'type'=>$val['type'],'name'=>$val['name'],'intr_name'=>$val['intr_name'],'lst_group'=>'cdo','dt_created'=>date('Y-m-d H:i:s'));
                }
            }
        }
        if(isset($p['par_ws_tc_list'])){
            $par_ws_tc_list = $p['par_ws_tc_list'];
            if(isset($par_ws_tc_list['ws'])){
                foreach($par_ws_tc_list['ws'] as $val){
                    $wws[] = array('did'=>$did,'name'=>$val,'lst_group'=>'par','dt_created'=>date('Y-m-d H:i:s'));
                }
            }
            if(isset($par_ws_tc_list['tc'])){
                foreach($par_ws_tc_list['tc'] as $val){
                    $wtc[] = array('did'=>$did,'type'=>$val['type'],'name'=>$val['name'],'intr_name'=>$val['intr_name'],'lst_group'=>'par','dt_created'=>date('Y-m-d H:i:s'));
                }
            }
        }

        if(count($wws) > 0){
            $this->comdb->insert_batch('w_ws',$wws);
        }
        if(count($wtc) > 0){
            $this->comdb->insert_batch('w_tc',$wtc);
        }
        if ($this->comdb->trans_status() === FALSE){//if error on query then rollback insert
            $this->comdb->trans_rollback();
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }else{
            $this->comdb->trans_commit();
        }

        return $r;
    }

    private function updateEntryData($p){
        $r = 'OK';
        //{update_id:update_id,dt:dt,userid:userid,slnk:slnk,slnkdt:slnkdt,clnk:clnk,clnkdt:clnkdt,tpost:tpost,tadvi:tadvi,estat:estat,cdoaffected:cdoaffected,affected_area:affected_area,infocast:infocast,txtsent:txtsent,missedpost:missedpost,missedby:missedby,xprain:xprain,remarks:remarks,cdo_ws_tc_list:cdo_ws_tc_list,par_ws_tc_list:par_ws_tc_list};
        $did = $p['update_id'];
        //update wdata
        $wdata = array(
            'slnk'=>$p['slnk'],
            'slnk_dt'=>$p['slnkdt'],
            'clnk'=>$p['clnk'],
            'clnk_dt'=>$p['clnkdt'],
            'type_post'=>$p['tpost'],
            'type_advi'=>$p['tadvi'],
            'estat'=>$p['estat'],
            'rescues'=>$p['rescues'],
            'cdo_affect'=>$p['cdoaffected'],
            'affect_area'=>$p['affected_area'],
            'infocast'=>$p['infocast'],
            'total_text'=>$p['txtsent'],
            'offset_contact'=>$p['exludecontacts'],
            'missed_post'=>$p['missedpost'],
            'missed_by'=>$p['missedby'],
            'xp_rain'=>$p['xprain'],
            'remarks'=>$p['remarks'],
            'uid'=>$p['userid']
        );

        $this->comdb->trans_start();

        $this->comdb->update('w_data',$wdata,'did = '.$did);

        //delete old data from w_ws and w_tc where did = update_id
        $this->comdb->delete(array('w_ws','w_tc'),'did = '.$did);

        //insert the new list of w_ws and w_tc
        $wws = array();$wtc = array();

        if(isset($p['cdo_ws_tc_list'])){
            $cdo_wc_tc_list = $p['cdo_ws_tc_list'];
            if(isset($cdo_wc_tc_list['ws'])){
                foreach($cdo_wc_tc_list['ws'] as $val){
                    $wws[] = array('did'=>$did,'name'=>$val,'lst_group'=>'cdo','dt_created'=>$p['update_dt']);
                }
            }
            if(isset($cdo_wc_tc_list['tc'])){
                foreach($cdo_wc_tc_list['tc'] as $val){
                    $wtc[] = array('did'=>$did,'type'=>$val['type'],'name'=>$val['name'],'intr_name'=>$val['intr_name'],'lst_group'=>'cdo','dt_created'=>$p['update_dt']);
                }
            }
        }
        if(isset($p['par_ws_tc_list'])){
            $par_ws_tc_list = $p['par_ws_tc_list'];
            if(isset($par_ws_tc_list['ws'])){
                foreach($par_ws_tc_list['ws'] as $val){
                    $wws[] = array('did'=>$did,'name'=>$val,'lst_group'=>'par','dt_created'=>$p['update_dt']);
                }
            }
            if(isset($par_ws_tc_list['tc'])){
                foreach($par_ws_tc_list['tc'] as $val){
                    $wtc[] = array('did'=>$did,'type'=>$val['type'],'name'=>$val['name'],'intr_name'=>$val['intr_name'],'lst_group'=>'par','dt_created'=>$p['update_dt']);
                }
            }
        }

        if(count($wws) > 0){
            $this->comdb->insert_batch('w_ws',$wws);
        }
        if(count($wtc) > 0){
            $this->comdb->insert_batch('w_tc',$wtc);
        }

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }

        return $r;
        
    }

    public function getWData($p){
        log_message('error',json_encode($p));
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];
        $type = $p['type'];
        $filter = array();
        if(isset($p['filterscount'])){

            
            $forLikeWildCardArr = array('remarks'=>'remarks');// LIKE "%value%"
            $forLikeBeginArr = array('id'=>'did','stime'=>'TIME(slnk_dt)','ctime'=>'TIME(clnk_dt)');// LIKE "value%"
            $forLikeArr = array();// LIKE "value"
            $forIn = array('type_post'=>'type_post','type_advi'=>'type_advi','xp_rain'=>'xp_rain','cdo_affect'=>'cdo_affect','affect_area'=>'affect_area','infocast'=>'infocast','missed_post'=>'missed_post','mname'=>'c.uname','uname'=>'b.uname');// IN(value,...)
            $forBetween = array();// BETWEEN

            $addFilter = array();
            if(isset($p['filterGroups'])){
                foreach($p['filterGroups'] AS $value){
                    if(in_array($value['field'], array('ws_cdo','ws_par','tc_cdo','tc_par'))){
                        $varr = explode('+', $value['filters'][0]['value']);
                        foreach($varr AS $val){
                            switch ($value['field']) {
                                case 'ws_cdo':
                                    $addFilter[] = '(SELECT COUNT(*) FROM w_ws WHERE did = a.did AND lst_group = "cdo" AND name LIKE "'.$val.'%" ) > 0';
                                    break;
                                case 'ws_par':
                                    $addFilter[] = '(SELECT COUNT(*) FROM w_ws WHERE did = a.did AND lst_group = "par" AND name LIKE "'.$val.'%" ) > 0';
                                    break;
                                case 'tc_cdo':
                                    $addFilter[] = '(SELECT COUNT(*) FROM w_tc WHERE did = a.did AND lst_group = "cdo" AND CONCAT(type," ",IF(name LIKE "%others%",intr_name,name)) LIKE "'.$val.'%" ) > 0';
                                    break;
                                case 'tc_par':
                                    $addFilter[] = '(SELECT COUNT(*) FROM w_tc WHERE did = a.did AND lst_group = "par" AND CONCAT(type," ",IF(name LIKE "%others%",intr_name,name)) LIKE "'.$val.'%" ) > 0';
                                    break;
                            }
                        }
                    }
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
                            $val = $v['value'];
                            //overwrite value if field is within the given array
                            if(in_array($value['field'], array('xp_rain','infocast','missed_post'))){
                                $val = ($val == 'YES')?1:0;
                            }else{
                                $val = '"'.$v['value'].'"';
                            }
                            $inArrVal[] = $val;
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

                    if($fdfield == 'sdate'){
                        $addFilter[] = 'DATE(slnk_dt) LIKE CAST("'.$fval.'" AS DATE)';
                    }
                    if($fdfield == 'cdate'){
                        $addFilter[] = 'DATE(clnk_dt) LIKE CAST("'.$fval.'" AS DATE)';
                    }
                }
                
            }
        }

        if($type != 'default'){
            $addFilter[] = 'clnk_dt BETWEEN CAST("'.$fdt.'" AS DATETIME) AND CAST("'.$tdt.'" AS DATETIME)';
        }

        if(count($addFilter) == 0){
            $addFilter[] = 'clnk_dt BETWEEN CAST(CONCAT(DATE_ADD(CURDATE(), INTERVAL -1 DAY)," 19:00:00") AS DATETIME) AND CURRENT_TIMESTAMP()';
        }

        $sel = array('did AS id','slnk','DATE(slnk_dt) AS sdate','TIME(slnk_dt) AS stime','clnk','DATE(clnk_dt) AS cdate','TIME(clnk_dt) AS ctime','type_post','type_advi','IF(cdo_affect LIKE "na","N/A",UPPER(cdo_affect)) AS cdo_affect','IF(affect_area LIKE "na","N/A", UPPER(affect_area)) AS affect_area','estat','IF(infocast = 1,"YES","NO") AS infocast','total_text','IF(missed_post = 1,"YES","NO") AS missed_post','missed_by','IF(xp_rain = 1,"YES","NO") AS xp_rain','remarks','a.uid AS userid','b.uname','a.dt_created',
            'c.uname AS mname',
            '(SELECT GROUP_CONCAT(name SEPARATOR ", ") FROM w_ws WHERE did = id AND lst_group = "cdo") AS ws_cdo',
            '(SELECT GROUP_CONCAT(name SEPARATOR ", ") FROM w_ws WHERE did = id AND lst_group = "par") AS ws_par',
            '(SELECT GROUP_CONCAT(CONCAT(type," ",IF(name LIKE "%others%",intr_name,name)) SEPARATOR ", ") FROM w_tc WHERE did = id AND lst_group = "cdo") AS tc_cdo',
            '(SELECT GROUP_CONCAT(CONCAT(type," ",IF(name LIKE "%others%",intr_name,name)) SEPARATOR ", ") FROM w_tc WHERE did = id AND lst_group = "par") AS tc_par',
            'offset_contact'
        );

        $str = 'SELECT '.implode(',',$sel).' FROM w_data AS a LEFT JOIN w_user AS b ON b.uid = a.uid LEFT JOIN w_user c ON c.uid = a.missed_by '.(count($addFilter) == 0?'':'WHERE '.implode(' AND ', $addFilter)).' ORDER BY clnk_dt DESC';

        $qry = $this->comdb->query($str);
        log_message('error',$str);
        return $qry->result();exit();
    }
   
    public function getTCData($p){
        $did = $p['did'];
        $str = 'SELECT lst_group,type,name,intr_name FROM w_tc WHERE did = '.$did.' ORDER BY lst_group';
        $qry = $this->comdb->query($str);
        return $qry->result();exit();
    }
    /***************************************************************************
    * HAZARD
    ****************************************************************************/
    private function insertFloodData($p){
        $r = 'OK';//{tp:'flood',update_id:update_id,rdt:rdt,affected_area:affected_area,fdata:rdata,remarks:remarks};
        $arr = array(
            'affected_area'=>$p['affected_area'],
            'fdata'=>$p['fdata'],
            'remarks'=>$p['remarks'],
            'rdt'=>$p['rdt'],
            'dt_created'=>date('Y-m-d H:i:s')
        );

        $this->comdb->trans_start();

        $this->comdb->insert('w_flooding',$arr);

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }

        return $r;exit();
    }
    private function updateFloodData($p){
        $r = 'OK';//{tp:'flood',update_id:update_id,rdt:rdt,affected_area:affected_area,fdata:rdata,remarks:remarks};
        $arr = array(
            'affected_area'=>$p['affected_area'],
            'fdata'=>$p['fdata'],
            'remarks'=>$p['remarks'],
            'rdt'=>$p['rdt']
        );

        $this->comdb->trans_start();

        $this->comdb->update('w_flooding',$arr,'rid = '.$p['update_id']);

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }

        return $r;exit();
    }

    public function getFloodData($p){
        $r = 'NO DATA';
        switch($p['type']){
            case 'dates':
                $str = 'SELECT DATE(rdt) AS dt, COUNT(`rid`) AS cnt FROM `w_flooding` GROUP BY DATE(`rdt`)';
                break;
            case 'data':
                $rdt = $p['rdt'];
                $str = 'SELECT rid, affected_area, fdata, remarks, rdt FROM w_flooding WHERE DATE(rdt) LIKE CAST("'.$rdt.'" AS DATE) ORDER BY rdt DESC';
                break;
        }

        $qry = $this->comdb->query($str);
        $r = $qry->result();
        return $r; exit();
    }

    private function deleteFloodData($p){
        $r = 'OK';
        $this->comdb->trans_start();

        $this->comdb->delete('w_flooding',array('rid'=>$p['update_id']));

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
    }
    /***************************************************************************
    * GAUGES
    ****************************************************************************/
    public function getGaugesStatus($p){
        $sel = array('gid', 'riverine', 'type', 'name', 'status', 'remarks', 'uid AS userid', 'last_data', '(SELECT uname FROM w_user WHERE uid = userid) AS uname', 'DATE(dt_created) AS dt_created');
        // $str = 'SELECT gid, riverine, type, name, status, remarks, uid AS userid, last_data, (SELECT uname FROM w_user WHERE uid = userid) AS uname, DATE(dt_created) AS dt_created FROM w_gauge_status_log GROUP BY name, type ORDER BY dt_created';

        if(isset($p['gname'])){
            $this->comdb->like('name',$p['gname']);
            $this->comdb->like('type',$p['gtype']);
            $this->comdb->order_by('last_data','desc');
        }else{
            $sel[] = '(SELECT COUNT(gid) FROM w_gauge_status_log WHERE name LIKE a.name) AS cnt';
            $this->comdb->group_by(array('name','type'));
            $this->comdb->where('gid IN (SELECT MAX(gid) FROM w_gauge_status_log GROUP BY name, type)');
        }
        
        $qry = $this->comdb->select($sel);
        $r = $qry->get('w_gauge_status_log AS a')->result();
        // log_message('error','last_query: '.$this->comdb->last_query());
        return $r; exit();
    }

    public function updateGaugeStatus($p){
        $r = 'OK';
        //{field:dataField,name:rowData.name,type:rowData.type,value:value,dt_created:rowData.dt_created};
        $gid = $p['gid'];
        $uid = $p['uid'];
        $field = $p['field'];
        $name = $p['name'];
        $type = $p['type'];
        $value = $p['value'];
        $dt_created = $p['dt_created'];
        $curdate = date('Y-m-d');

        $this->comdb->trans_start();
        //check if gid == 0 then insert
        if($gid == 0){
            $this->comdb->insert('w_gauge_status_log',array('uid'=>$uid,'type'=>$type,'name'=>$name,$field=>$value,'last_data'=>date('Y-m-d H:i:s'),'dt_created'=>date('Y-m-d H:i:s')));
        }else{
            //check if dt_created = current date
            if($dt_created == $curdate || $p['elemid'] == 'guageLogGrid'){
                //update
                // $this->comdb->update('w_gauge_status_log',array($field=>$value),'DATE(dt_created) LIKE "'.$dt_created.'" AND name LIKE "'.$name.'" AND type LIKE "'.$type.'"');
                $this->comdb->update('w_gauge_status_log',array($field=>$value),'gid = '.(int)$gid);
            }else{
                //insert
                $this->comdb->insert('w_gauge_status_log',array('uid'=>$uid,'type'=>$type,'name'=>$name,$field=>$value,'last_data'=>date('Y-m-d H:i:s'),'dt_created'=>date('Y-m-d H:i:s')));
            }
        }


        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r; exit();
    }
    private function deleteGaugeLog($p){
        $r = 'OK';
        
        $this->comdb->trans_start();

        $this->comdb->where_in('gid', $p['gids']);
        $this->comdb->delete('w_gauge_status_log');

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
    }
    /***************************************************************************
    * INFOCAST
    ****************************************************************************/
    private function insertInfocastData($p){
        $r = 'OK';//{update_id:update_id, tp:'infocast', name:cname, num:cnum, net_ops:netops, address:caddress, affiliated:affiliated};
        $arr = array(
            'name'=>$p['name'],
            'num'=>$p['num'],
            'net_ops'=>$p['net_ops'],
            'address'=>$p['address'],
            'affiliated'=>$p['affiliated'],
            'uid'=>$p['uid'],
            'dt_created'=>date('Y-m-d H:i:s')
        );

        $this->comdb->trans_start();

        $this->comdb->insert('w_infocast',$arr);

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }

        return $r;exit();
    }

    private function updateInfocastData($p){
        $r = 'OK';//{update_id:update_id, tp:'infocast', name:cname, num:cnum, net_ops:netops, address:caddress, affiliated:affiliated};
        $arr = array(
            'name'=>$p['name'],
            'num'=>$p['num'],
            'net_ops'=>$p['net_ops'],
            'address'=>$p['address'],
            'affiliated'=>$p['affiliated']
        );

        $this->comdb->trans_start();

        $this->comdb->update('w_infocast',$arr,'cid = '.$p['update_id']);

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }

        return $r;exit();
    }
    private function deleteInfocast($p){
        $r = 'OK';
        
        $this->comdb->trans_start();

        $this->comdb->where_in('cid', $p['cids']);
        $this->comdb->delete('w_infocast');

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
    }
    public function getInfocastData($p){
        $str = 'SELECT cid, name, num, net_ops, address, affiliated, uid AS userid, (SELECT uname FROM w_user WHERE uid = userid) AS uname, DATE(dt_created) AS dt_created FROM w_infocast ORDER BY dt_created DESC';
        $qry = $this->comdb->query($str);
        $r = $qry->result();
        return $r; exit();
    }
    /***************************************************************************
    * USER MANAGEMENT
    ****************************************************************************/
    public function getUserData($p){
        $str = 'SELECT uid,uname,upass,fname,access,active FROM w_user ORDER BY uname';
        $qry = $this->comdb->query($str);
        $r = $qry->result();
        return $r; exit();
    }
    private function deleteUser($p){
        $r = 'OK';
        
        $this->comdb->trans_start();

        $this->comdb->where_in('uid', $p['uids']);
        $this->comdb->delete('w_user');

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
    }
    private function insertUserData($p){
        $r = 'OK';
        //check if user already exist
        $str = 'SELECT uid FROM w_user WHERE uname LIKE "'.$p['uname'].'" LIMIT 1';
        $qry = $this->comdb->query($str);
        if($qry->num_rows() > 0){
            $r = 'USERNAME_EXIST';
        }else{

            $arr = array(
                'uname'=>$p['uname'],
                'upass'=>$p['upass'],
                'fname'=>$p['fname'],
                'access'=>$p['access'],
                'active'=>1,
                'dt_created'=>date('Y-m-d H:i:s')
            );

            $this->comdb->trans_start();

            $this->comdb->insert('w_user',$arr);

            $this->comdb->trans_complete();
            if ($this->comdb->trans_status() === FALSE){
                $r = 'ERROR';
                log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
            }
        }

        return $r;exit();
    }

    private function updateUserData($p){
        $r = 'OK';
        
        if(isset($p['active'])){
            $arr = array('active'=>$p['active']);
        }else{
            //check if username already exist if username is not equal to old username
            if(strtolower($p['uname']) !== strtolower($p['old_username'])){
                $str = 'SELECT uid FROM w_user WHERE uname LIKE "'.$p['uname'].'" LIMIT 1';
                $qry = $this->comdb->query($str);
                if($qry->num_rows() > 0){
                    return 'USERNAME_EXIST'; exit();
                }
            }

            $arr = array(
                'uname'=>$p['uname'],
                'upass'=>$p['upass'],
                'fname'=>$p['fname'],
                'access'=>$p['access']
            );
        }

        $this->comdb->trans_start();

        $this->comdb->update('w_user',$arr,'uid = '.$p['update_id']);

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }

        return $r;exit();
    }
    /***************************************************************************
    * Report
    ****************************************************************************/
    /**
     * Getting list of weather system inside and outside PARTICULAR
     *
     * @param mixed $p
     * @return mixed
     */
    public function GetWeatherSystem($p){
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];
        //get all did base on dt
        $qry = $this->comdb->query('SELECT did FROM w_data WHERE DATE(clnk_dt) BETWEEN CAST("'.$fdt.'" AS DATE) AND CAST("'.$tdt.'" AS DATE)');
        if($qry->num_rows() > 0){
            //loop through did
            $didArr = array();
            foreach($qry->result() as $row){
                $didArr[] = (int)$row->did;
            }
            $qry->free_result();

            //get weather systems
            $qry = $this->comdb->query('SELECT w,name,lst_group FROM ((SELECT "ws" AS w,name,lst_group FROM w_ws WHERE did IN('.implode(',',$didArr).'))
             UNION (SELECT "tc" AS w,CONCAT(type," ",IF(name LIKE "OTHERS",intr_name,name)) AS name,lst_group FROM w_tc WHERE did IN('.implode(',',$didArr).'))) AS tbl ORDER BY lst_group,name');
            
            return $qry->result();exit();
        }else{
            return 'NO_DATA';exit();
        }

    }
    /**
     * Prevalent Weather System vs. Localized Thunderstorms experienced in CDO
     *
     * @param mixed $p
     * @return mixed
     */
    public function GetPWS($p){
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];
        //get all did base on dt
        $qry = $this->comdb->query('SELECT did FROM w_data WHERE DATE(clnk_dt) BETWEEN CAST("'.$fdt.'" AS DATE) AND CAST("'.$tdt.'" AS DATE)');
        if($qry->num_rows() > 0){
            //loop through did
            $didArr = array();
            foreach($qry->result() as $row){
                $didArr[] = (int)$row->did;
            }
            $qry->free_result();

            //get weather systems
            $qry = $this->comdb->query('SELECT name,cnt FROM ((SELECT name,COUNT(did) AS cnt FROM w_ws WHERE did IN('.implode(',',$didArr).') AND lst_group LIKE "cdo" GROUP BY name) UNION (SELECT CONCAT(type," ",IF(name LIKE "OTHERS",intr_name,name)) AS name, COUNT(did) AS cnt FROM w_tc WHERE did IN('.implode(',',$didArr).') AND lst_group LIKE "cdo" GROUP BY name)) AS tbl');
            return $qry->result();exit();
        }else{
            return 'NO_DATA';exit();
        }
    }
    /**
     * Actual Thunderstorm vs. More Likely Thunderstorm
     *
     * @param mixed $p
     * @return mixed
     */
    public function GetATF($p){
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];

        // (
        //     SELECT "Flooding" AS type 
        //     FROM w_data WHERE DATE(clnk_dt) BETWEEN CAST("'.$fdt.'" AS DATE) AND 
        //     CAST("'.$tdt.'" AS DATE) AND 
        //     type_advi LIKE "urban flooding" 
        //     GROUP BY DATE(clnk_dt)
        // ) UNION ALL 

        $qry = $this->comdb->query('
            SELECT type,COUNT(type) AS cnt 
            FROM (
                (
                    SELECT "Actual Thunderstorm" AS type 
                    FROM w_data 
                    WHERE DATE(clnk_dt) BETWEEN CAST("'.$fdt.'" AS DATE) AND 
                    CAST("'.$tdt.'" AS DATE) AND 
                    xp_rain = 1
                    GROUP BY DATE(clnk_dt)
                ) UNION ALL 
                (
                    SELECT "More Likely Thunderstorm" AS type 
                    FROM w_data 
                    WHERE DATE(clnk_dt) BETWEEN CAST("'.$fdt.'" AS DATE) AND 
                    CAST("'.$tdt.'" AS DATE) AND 
                    type_advi="Thunderstorm Watch" AND
                    cdo_affect="affected"
                    GROUP BY DATE(clnk_dt)
                )
            ) AS tbl GROUP BY type'
        );

        return $qry->result();exit();
    }
    /**
     * Hazard: Riverine, Urban, Landslide, Surge, Public Disturbance, Earthquake
     *
     * @param mixed $p
     * @return mixed
     */
    public function GetFlooding($p){
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];

        $qry = $this->comdb->query('
            SELECT type, COUNT(type) AS cnt, GROUP_CONCAT(day) AS dates, GROUP_CONCAT(fdata SEPARATOR "<>") AS fdata
            FROM (
                (
                    SELECT "Riverine" AS type, (DATE(rdt)) AS day, fdata 
                    FROM w_flooding 
                    WHERE DATE(rdt) BETWEEN CAST("'.$fdt.'" AS DATE) AND 
                    CAST("'.$tdt.'" AS DATE) AND 
                    affected_area="riverine" 
                    GROUP BY DATE(rdt)
                ) UNION ALL 
                (
                    SELECT "Urban" AS type, (DATE(rdt)) AS day, fdata 
                    FROM w_flooding 
                    WHERE DATE(rdt) BETWEEN CAST("'.$fdt.'" AS DATE) AND 
                    CAST("'.$tdt.'" AS DATE) AND 
                    affected_area="urban" 
                    GROUP BY DATE(rdt)
                ) UNION ALL 
                (
                    SELECT "Landslide" AS type, (DATE(rdt)) AS day, fdata 
                    FROM w_flooding 
                    WHERE DATE(rdt) BETWEEN CAST("'.$fdt.'" AS DATE) AND 
                    CAST("'.$tdt.'" AS DATE) AND 
                    affected_area="landslide" 
                    GROUP BY DATE(rdt)
                ) UNION ALL 
                (
                    SELECT "Surge" AS type, (DATE(rdt)) AS day, fdata 
                    FROM w_flooding 
                    WHERE DATE(rdt) BETWEEN CAST("'.$fdt.'" AS DATE) AND 
                    CAST("'.$tdt.'" AS DATE) AND 
                    affected_area="surge" 
                    GROUP BY DATE(rdt)
                ) UNION ALL 
                (
                    SELECT "Public Disturbance" AS type, (DATE(rdt)) AS day, fdata 
                    FROM w_flooding 
                    WHERE DATE(rdt) BETWEEN CAST("'.$fdt.'" AS DATE) AND 
                    CAST("'.$tdt.'" AS DATE) AND 
                    affected_area="public disturbance" 
                    GROUP BY DATE(rdt)
                ) UNION ALL 
                (
                    SELECT "Earthquake" AS type, (DATE(rdt)) AS day, fdata 
                    FROM w_flooding 
                    WHERE DATE(rdt) BETWEEN CAST("'.$fdt.'" AS DATE) AND 
                    CAST("'.$tdt.'" AS DATE) AND 
                    affected_area="earthquake" 
                    GROUP BY DATE(rdt)
                ) 
            ) AS tbl GROUP BY type'
        );

        return $qry->result();exit();
    }
    /**
     * Get infocast subscribers list
     *
     * @return mixed
     */
    public function GetInfocastSubs(){
        $qry = $this->comdb->query('SELECT affiliated, COUNT(cid) AS cnt FROM w_infocast GROUP BY affiliated ORDER BY affiliated');
        return $qry->result();exit();
    }
    /**
     * Get total text sent
     *
     * @param mixed $p
     * @return mixed
     */
    public function GetTotalTextSent($p){
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];

        $qry = $this->comdb->query('SELECT SUM((total_text * (total_contact - offset_contact))) AS cnt FROM w_data WHERE DATE(clnk_dt) BETWEEN CAST("'.$fdt.'" AS DATE) AND CAST("'.$tdt.'" AS DATE) AND infocast = 1');

        return  $qry->row()->cnt;exit();
    }
    /**
     * Get info dessemination
     *
     * @param mixed $p
     * @return mixed
     */
    public function GetInfoDessemination($p){
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];

        $qry = $this->comdb->query('SELECT type_advi, COUNT(did) AS cnt FROM w_data WHERE DATE(clnk_dt) BETWEEN CAST("'.$fdt.'" AS DATE) AND CAST("'.$tdt.'" AS DATE) AND infocast = 1 GROUP BY type_advi');
        return $qry->result();exit();
    }

    public function GetFB($p){
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];

        $qry = $this->comdb->query('SELECT SUM(IF(missed_post = 0,1,0)) AS tpost, SUM(missed_post) AS mpost FROM w_data WHERE DATE(clnk_dt) BETWEEN CAST("'.$fdt.'" AS DATE) AND CAST("'.$tdt.'" AS DATE)');
        return  $qry->row();exit();
    }

    public function GetFBPosted($p){
        $fdt = $p['fdt'];
        $tdt = $p['tdt'];

        $qry = $this->comdb->query('SELECT type_advi, COUNT(did) AS cnt FROM w_data WHERE DATE(clnk_dt) BETWEEN CAST("'.$fdt.'" AS DATE) AND CAST("'.$tdt.'" AS DATE) AND missed_post = 0 GROUP BY type_advi');
        return $qry->result();exit();
    }
}

?>