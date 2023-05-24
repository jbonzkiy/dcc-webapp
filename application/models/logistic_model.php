<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Logistic_model extends CI_Model {
	private $comdb;
	public function __construct()
    {
        parent::__construct();
        $this->comdb = $this->load->database('comcenter',TRUE);
    }

    public function LoginVerification($post){
        $uname = $post['uname'];
        $upass = $post['upass'];
        $r = 'ERROR';
        $str = 'SELECT uid, upass, uname, access FROM logistic_tbl_user WHERE uname LIKE "'.$uname.'" LIMIT 1';
        $qry = $this->comdb->query($str);
        if($qry->num_rows() == 0){
            $r = 'INVALID_USERNAME';
        }else{
            $row = $qry->row();
            if($upass == $row->upass){
                $r = $row;
            }else{
                $r = 'INVALID_PASSWORD';
            }
        }
        return $r;exit();
    }

    public function validateTotalQty($p){
        $id = $p['id'];
        $old_value = $p['oldValue'];
        $new_value = $p['newValue'];

        $this->comdb->select_sum('qty', 'sum_qty');
        $this->comdb->where(array( 'returner_id' => 0, 'item_id' => $id ));
        $query = $this->comdb->get('logistic_tbl_logs');

        $row = $query->row();
        if ( isset($row) ) {
            // compare ang new value ug ang summary sa qty sa borrower na wala pa na uli.
            if ( $new_value < $row->sum_qty ) {
                return '0';
            }
            else {
                return '1';
            }

        }

        return '0';
    }

    public function GetExcelData(){
        $this->load->library('excel');
        $file = 'test.xlsx';
        //read file from path
        $objPHPExcel = PHPExcel_IOFactory::load($file);

        //get only the Cell Collection
        $cell_collection = $objPHPExcel->getActiveSheet()->getCellCollection();

        $arr_data = array();
        //extract to a PHP readable array format
        foreach ($cell_collection as $cell) {
            $column = $objPHPExcel->getActiveSheet()->getCell($cell)->getColumn();
            $row = $objPHPExcel->getActiveSheet()->getCell($cell)->getRow();
            $data_value = $objPHPExcel->getActiveSheet()->getCell($cell)->getValue();

            //The header will/should be in row 1 only. of course, this can be modified to suit your need.
            if($row != 1){
                $arr_data[$row][$column] = $data_value;
            }
        }

        return $arr_data;
    }

    function validateImportData($arr, $name){
        $category_arr = array(
            'Medical Supplies',
            'Office Supplies',
            'Motorpool Supplies',
            'Rescue Supplies',
            'Computer Supplies'
        );
        $item_name_arr = [];
        
        if ( !empty($arr) ) {
            foreach ($arr as $obj_k => $obj_v) {
                $isUnique = true;
                $error = array();

                foreach($obj_v as $key => $value) {

                    if ( $key == 'item_name' ) {
                        // check also ang item name sa list/array na data
                        $in_item_name_arr = in_array($value, $item_name_arr);

                        if(!$in_item_name_arr){
                            $item_name_arr[] = $value; 

                            // check item name sa database if duplicate
                            $isUnique = $this->checkInsertItemData($value);
                        }
                        else{
                            $isUnique = false;
                        }

                    }
    
                    if ( $key == 'category' ) {
                        $in_category = in_array($value, $category_arr);
    
                        if(!$in_category){
                            $string_version = implode(',', $category_arr);
                            $error[] = array(
                                'column' => $key,
                                'remark' => 'Value should be equal to => '.$string_version
                            );
                        }
                        
                    }
    
                    if ( $name == 'non_disposable' && $key == 'mr_to' ) {
                        $mr_data = preg_replace('/\s+/', '', $this->get_mr($value));
                        
                        if( $mr_data == FALSE ){
                            $error[] = array(
                                'column' => $key,
                                'remark' => 'Cannot find: '.(string)$value
                            );
                        }
                    }
    
                }

                $arr[$obj_k]['is_unique'] = $isUnique;
                $arr[$obj_k]['action'] = $isUnique ? 'new' : 'no action';
                $arr[$obj_k]['error'] = $error;
            
            }
        }

        return $arr;
    }

    function transformExcelData($sheet, $highestRow, $name){
        $data_arr = array();

        //Loop through each row of the worksheet in turn
        for ($row = 2; $row <= $highestRow; $row++){ 
            //  Read a row of data into an array
            $highestColumnLetter =  ($name === 'disposable') ? 'F' : 'G';
            $row_header_arr = $sheet->rangeToArray('A1:'. $highestColumnLetter .'1', NULL, TRUE, FALSE);
            $row_data_arr = $sheet->rangeToArray('A' . $row . ':'. $highestColumnLetter . $row, NULL, TRUE, FALSE);
            
            
            foreach ($row_data_arr as $row_data_arr_value) {
                $obj_arr = array(); // associative array

                foreach ($row_data_arr_value as $data_key => $data_value) {
                    $header_value = str_replace( " ", "_", strtolower($row_header_arr[0][$data_key]) );
                    $obj_arr[$header_value] = (string)$data_value;
                }

                $data_arr[] = $obj_arr;
            }
        
        }

        return $data_arr;
    }

    public function GetExcelDataFromFile($f){

        $return = '';
        //Check valid spreadsheet has been uploaded
        if(isset($f)){
            if($f['tmp_name']){
                if(!$f['error']){
                    $this->load->library('excel');
                    $inputFile = $f['tmp_name']; // "D:\\xampp\\tmp\\php56F1.tmp"
                    $extension = strtoupper(explode(".", $f['name'])[1]);
        
                    if(in_array($extension, array('XLSX','CSV','XLS'))){
        
                        //Read spreadsheeet workbook
                        try {
                            $inputFileType = PHPExcel_IOFactory::identify($inputFile);
                            $objReader = PHPExcel_IOFactory::createReader($inputFileType);
                            $objPHPExcel = $objReader->load($inputFile);
                        } catch(Exception $e) {
                            die('Error loading file "'.pathinfo($inputFile,PATHINFO_BASENAME).'": '.$e->getMessage());
                        }
        
                        //Get worksheet dimensions
                        $disposable_sheet = $objPHPExcel->getSheet(0); // first sheet: Disposable
                        $non_disposable_sheet = $objPHPExcel->getSheet(1); // Second sheet: Non-Disposable
                        
                        
                        $disposable_highestRow = $disposable_sheet->getHighestRow(); 
                        $disposable_highestColumn = $disposable_sheet->getHighestColumn();
                        
                        $non_disposable_highestRow = $non_disposable_sheet->getHighestRow(); 
                        $non_disposable_highestColumn = $non_disposable_sheet->getHighestColumn();
                        
                        $disposable_data = $this->transformExcelData($disposable_sheet, $disposable_highestRow, 'disposable');
                        $non_disposable_data = $this->transformExcelData($non_disposable_sheet, $non_disposable_highestRow, 'non_disposable');

                        // $activeSheetData = $objPHPExcel->getActiveSheet()->toArray(null, true, true, true);
                        // $return = var_dump($activeSheetData);
                        $validate_disposable = $this->validateImportData($disposable_data, 'disposable');
                        $validate_non_disposable = $this->validateImportData($non_disposable_data, 'non_disposable');

                        return array(
                            'disposable' => $validate_disposable,
                            'non_disposable' => $validate_non_disposable
                        );
                    
                    }
                    else{
                        $return = "Please upload an XLSX, XLS OR CSV file";
                    }
                }
                else{
                    $return = $f['error'];
                }
            }
        }
        return $return; exit();
    }

    private function excelToDb($data,$ids){

    	//check for duplicate property number.
    	$strselqry = 'SELECT id,property_no,article,item_name,description,total_qty,dt_created FROM logistic_tbl_item WHERE property_no IN('.implode(',', $ids).')';//will return item that is in the given propid.
    	$selqry = $this->comdb->query($strselqry);
    	$insarr = array();$duparr = array();
        
    	//insert data if no data from db returned/ if data already exist then add to duparr while also removing that existing data from $data
    	foreach ($data as $k => $value) {
    		// if($selqry->num_rows() == 0){
    		// 	$insarr[] = array('property_no'=>$value[0],'item_name'=>$value[1],'article'=>$value[2],'description'=>$value[3],'total_qty'=>$value[4],'dt_created'=>date('Y-m-d H:i:s'));
    		// }else{
			foreach ($selqry->result() as $row) {
    			if((int)$row->property_no == (int)$value[0]){//dup
    				$duparr[] = array('property_no'=>$value[0],'item_name'=>$value[1],'article'=>$value[2],'description'=>$value[3],'total_qty'=>$value[4],'id'=>$row->id,'dbinfo'=>json_encode($row));
    				unset($data[$k]);
    				break;
    			}
    		}
    		// }

    	}
    	//add the remaining $data to insarr for db insert.
    	foreach ($data as $value) {
    		$insarr[] = array('property_no'=>$value[0],'item_name'=>$value[1],'article'=>$value[2],'description'=>$value[3],'total_qty'=>$value[4],'dt_created'=>date('Y-m-d H:i:s'));
    	}
    	

    	$selqry->free_result();
    	
    	if(count($insarr) > 0){//insert data
    		$this->comdb->trans_start();
	        $qry = $this->comdb->insert_batch('logistic_tbl_item',$insarr);
	        $this->comdb->trans_complete();
	        if ($this->comdb->trans_status() === FALSE){
	            $r = 'ERROR';
	            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
	        }
    	}

    	return array('insert_data'=>$insarr,'dup_data'=>$duparr);
    }

    public function updateImportExcel($post){
        $data = null;
        $key = '';

        if( isset($post['disposable']) && $post['disposable'] !== "" ) {
            $data = $post['disposable'];
            $key = 'disposable';
        }
        else if ( isset($post['non_disposable']) && $post['non_disposable'] !== "" ) {
            $data = $post['non_disposable'];
            $key = 'non_disposable';
        }

        $validate_data = $this->validateImportData($data, $key);

        return json_encode([
			'success' => TRUE,
            $key => $validate_data
		]);
    }

    public function parseData($post){
    	$type = $post['type'];
    	$r = '';
    	switch ($type) {
    		case 'insert':
    			$r = $this->insertData($post);
    			break;
    		case 'update':
    			$r = $this->updateData($post);
    			break;
            case 'import':
                $subtype = $post['subtype'];
                switch ($subtype) {
                    case 'insert_update':
                        $r = $this->insertUpdateImportData($post);
                        break;
                    case 'delete':
                        # code...
                        break;
                }
                break;
            case 'log':
                $subtype = $post['subtype'];
                switch ($subtype) {
                    case 'insert':
                        $r = $this->insertLogData($post);
                        break;
                    case 'update':
                        $r = $this->UpdateLogData($post);
                        break;
                    case 'update_return':
                        $r = $this->UpdateReturnLogData($post);
                        break;
                }
                break;
            case 'item':
                $subtype = $post['subtype'];
                switch ($subtype) {
                    case 'insert':
                        $r = $this->insertItemData($post);
                        break;
                    case 'update':
                        $r = $this->UpdateItemData($post);
                        break;
                    case 'delete':
                        # code...
                        break;
                }
                break;
            case 'waste':
                $subtype = $post['subtype'];
                switch ($subtype) {
                    case 'insert':
                        $r = $this->insertWasteData($post);
                        break;
                    case 'update':
                        $r = $this->updateWasteData($post);
                        break;
                }
                break;
            case 'add_qty':
                $subtype = $post['subtype'];
                switch ($subtype) {
                    case 'insert':
                        $r = $this->insertAddQtyData($post);
                        break;
                    case 'update':
                        $r = $this->updateAddQtyData($post);
                        break;
                }
                break;
            case 'item_details':
                $subtype = $post['subtype'];
                switch ($subtype) {
                    case 'update':
                        $r = $this->updateItemDetailsData($post);
                        break;
                }
                break;
    	}
    	return $r;exit();
    }

    private function deleteLogs($p){
        $r = 'OK';
        
        $this->comdb->trans_start();

        $this->comdb->where_in('lid', $p['lids']);
        $this->comdb->delete(array('logistic_tbl_logs'));

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
    }

    // [first name] [last name]
    function get_mr_to_id($name){
        $id = 0;

        $this->comdb->trans_start();
        
        $this->comdb->select('id,division,full_name', FALSE);
        $this->comdb->where(array( 'CONCAT(first_name, " ", last_name)=' => $name, 'regular' => 1 ));
        $row = $this->comdb->get('cdrrmd_personnel')->row();

        if (isset($row)) {
            $id = $row->id;
        }
        
        $this->comdb->trans_complete();

        if ($this->comdb->trans_status() === FALSE){
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }

        return $id;
    }

    // full name
    function get_mr_to_id_fullname($name){
        $id = 0;

        $this->comdb->trans_start();
        
        $this->comdb->select('id,division,full_name', FALSE);
        $this->comdb->where(array( 'full_name' => $name, 'regular' => 1 ));
        $row = $this->comdb->get('cdrrmd_personnel')->row();

        if (isset($row)) {
            $id = $row->id;
        }
        
        $this->comdb->trans_complete();

        if ($this->comdb->trans_status() === FALSE){
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }

        return $id;
    }

    function get_mr($name){
        $this->comdb->trans_start();
        
        $str = 'SELECT id,division,full_name FROM cdrrmd_personnel WHERE CONCAT( first_name, " ", last_name ) = "'.$name.'" AND regular=1';
        $qry = $this->comdb->query($str);
        $countRows = $qry->num_rows();
        
        $this->comdb->trans_complete();

        if ($this->comdb->trans_status() === FALSE){
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }

        return ( $countRows > 0 ) ? TRUE : FALSE;
    }

    function insertImport($insert_arr, $row, $p, $disp_or_non) {
        $this->comdb->trans_start();
        // check first if ang data is naa na sa database.
        $isUnique = $this->checkInsertItemData($row['item_name']);
        
        if($isUnique){
            $this->comdb->insert('logistic_tbl_item',$insert_arr);
            $item_id = $this->comdb->insert_id(); // get last inserted id

            // disposable/non-disposable: insert sa logistic_tbl_item_delivery
            $disp_arr = array(
                'item_id' => $item_id,

                'add_total_qty' => $row['qty'],
                'c_total_qty' => $row['qty'],
                'dr_no' => $row['receipt_no'],
                'mr_to' => ( $disp_or_non == 'non-disposable' ) ? preg_replace('/\s+/','',$this->get_mr_to_id($row['mr_to'])) : 0,
                // 'remarks' => $row['remarks'],

                'uid' => $p['uid'],
                'date_created' => date('Y-m-d H:i:s')
            );
            $this->comdb->insert('logistic_tbl_item_delivery', $disp_arr);

            // non-disposable: insert sa logistic_tbl_item_specific 
            if($disp_or_non == 'non-disposable'){
                $delivery_id = $this->comdb->insert_id(); // get last inserted id

                // add kung pila ang qty kada-isa para sa property ug serial no.
                $qty_i =  (int)$row['qty'];
                for ($x = 0; $x < $qty_i; $x++) {

                    $non_disp_arr = array(
                        'delivery_id' => $delivery_id,
    
                        'property_no' => '',
                        'serial_no' => '',
    
                        'uid' => $p['uid'],
                        'date_created' => date('Y-m-d H:i:s')
                    );
                    $this->comdb->insert('logistic_tbl_item_specific', $non_disp_arr);

                }
            }
        }
        
        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
    }

    function updateImport($arr) {
        $this->comdb->trans_start();

        $this->comdb->select('id,item_name', FALSE);
        $this->comdb->where('item_name', $arr['item_name']);
        $row = $this->comdb->get('logistic_tbl_item')->row();

        if (isset($row)) {
            $id = $row->id;
            $this->comdb->update('logistic_tbl_item',$arr,'id = '.$id);
        }
        
        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
    }

    private function insertUpdateImportData($p){
        $r = 'OK';
        $disp = $p['disposable'];
        $non_disp = $p['non_disposable'];
        $category_arr = array(
            'Medical Supplies',
            'Office Supplies',
            'Motorpool Supplies',
            'Rescue Supplies',
            'Computer Supplies'
        );

        // disposable insert data
        if( !empty($disp['insert']) ){
            foreach ($disp['insert'] as $key => $value) {
                $category = ( in_array($value['category'], $category_arr) ) ? $value['category'] : '';

                $disposable_arr = array(
                    'disp_or_non' => 'disposable',
    
                    'item_name' => $value['item_name'],
                    'total_qty' => $value['qty'],
                    'unit' => $value['unit'],
                    'category' => $category,
                    'remarks' => $value['remarks'],
    
                    'uid' => $p['uid'],
                    'dt_created' => date('Y-m-d H:i:s')
                );
    
                $this->insertImport($disposable_arr, $value, $p, 'disposable');
            }
        }

        // disposable update data
        // if( !empty($disp['update']) ){
        //     foreach ($disp['update'] as $key => $value) {
        //         $category = ( in_array($value['category'], $category_arr) ) ? $value['category'] : '';

        //         $disposable_arr = array(
        //             'disp_or_non' => 'disposable',
    
        //             'item_name' => $value['item_name'],
        //             // 'total_qty' => $value['qty'],
        //             'unit' => $value['unit'],
        //             'category' => $category,
        //             // 'remarks' => $value['remarks'],
    
        //             'uid' => $p['uid']
        //         );
    
        //         $this->updateImport($disposable_arr);
        //     }
        // }

        // non disposable insert data
        if( !empty($non_disp['insert']) ){
            foreach ($non_disp['insert'] as $key => $value) {
                $category = ( in_array($value['category'], $category_arr) ) ? $value['category'] : '';
    
                $non_disposable_arr = array(
                    'disp_or_non' => 'non-disposable',
    
                    'item_name' => $value['item_name'],
                    'total_qty' => $value['qty'],
                    'unit' => $value['unit'],
    
                    'description' => $value['description'],
                    'category' => $category,
                    'remarks' => $value['remarks'],
    
                    'uid' => $p['uid'],
                    'dt_created' => date('Y-m-d H:i:s')
                );
    
                $this->insertImport($non_disposable_arr, $value, $p, 'non-disposable');
            }
        }

        // non disposable update data
        // if( !empty($non_disp['update']) ){
        //     foreach ($non_disp['update'] as $key => $value) {
        //         $mr_to_id = $this->get_mr_to_id($value['mr_to']);
        //         $category = ( in_array($value['category'], $category_arr) ) ? $value['category'] : '';
    
        //         $non_disposable_arr = array(
        //             'disp_or_non' => 'non-disposable',
    
        //             'item_name' => $value['item_name'],
        //             // 'total_qty' => $value['qty'],
        //             'unit' => $value['unit'],
    
        //             'description' => $value['description'],
        //             'category' => $category,
        //             // 'property_no' => $value['property_no'],
        //             // 'serial_no' => $value['serial_no'],
        //             'mr_to' => $mr_to_id,
        //             // 'remarks' => $value['remarks'],
    
        //             'uid' => $p['uid']
        //         );
    
        //         $this->updateImport($non_disposable_arr);
        //     }
        // }
        

        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }

        return $r;
    }

    // check mr_to personnel
    function checkMRToPersonnel($name){
        $likeArr = array(
            'full_name' => $name,
            'regular' => TRUE
        );
        $this->comdb->or_like($whereArr);
        $countRows = $this->comdb->get('cdrrmd_personnel')->num_rows();

        if ($countRows > 0) {
            // not unique data (duplicate)
            return FALSE;
        } else {
            // unique data (no duplicate)
            return TRUE;
        }
    }

    // check duplicate data
    function checkInsertItemData($item_name){
        $whereArr = array(
            'item_name' => $item_name,
        );
        $this->comdb->where($whereArr);
        $countRows = $this->comdb->get('logistic_tbl_item')->num_rows();

        if ($countRows > 0) {
            // not unique data (duplicate)
            return FALSE;
        } else {
            // unique data (no duplicate)
            return TRUE;
        }
    }

    private function insertItemData($p){
        //{type:'item',subtype:'insert',pnum:pnum,itemname:itemname,article:article,description:description,total_qty:total_qty};
        $r = 'OK';

        $arr = array(
            'disp_or_non' => $p['disp_or_non'],

            'item_name' => $p['itemname'],
            'total_qty' => $p['total_qty'],
            'unit' => $p['unit'],
            'category' => $p['category'],

            'remarks' => $p['remarks'],
            'uid' => $p['uid'],
            'dt_created'=>date('Y-m-d H:i:s')
        );

        if ( $p['disp_or_non'] == 'disposable' ) {
        }
        else if ( $p['disp_or_non'] == 'non-disposable' ) {
            $arr['description'] = $p['description'];
        }

        $this->comdb->trans_start();

        // check duplicate data
        $isUnique = $this->checkInsertItemData($p['itemname']);
        
        if ( $isUnique ) {
            $qry = $this->comdb->insert('logistic_tbl_item',$arr);

            // after sa insert e insert ang additional data sa lain na table
            if($qry){
                $item_id = $this->comdb->insert_id(); // get last inserted id

                // disposable/non-disposable: insert sa logistic_tbl_item_delivery
                $disp_arr = array(
                    'item_id' => $item_id,
    
                    'add_total_qty' => $p['total_qty'],
                    'c_total_qty' => $p['total_qty'],
                    'dr_no' => $p['receiptno'],
                    'mr_to' => ( $p['disp_or_non'] == 'non-disposable' ) ? $p['mrto_id'] : 0,
                    // 'remarks' => $p['remarks'],
    
                    'uid' => $p['uid'],
                    'date_created' => date('Y-m-d H:i:s')
                );
                $this->comdb->insert('logistic_tbl_item_delivery', $disp_arr);

                // non-disposable: insert sa logistic_tbl_item_specific 
                if($p['disp_or_non'] == 'non-disposable'){
                    $delivery_id = $this->comdb->insert_id(); // get last inserted id

                    // add kung pila ang qty kada-isa para sa property ug serial no.
                    $qty_i =  (int)$p['total_qty'];
                    for ($x = 0; $x < $qty_i; $x++) {

                        $non_disp_arr = array(
                            'delivery_id' => $delivery_id,
        
                            'property_no' => '',
                            'serial_no' => '',
        
                            'uid' => $p['uid'],
                            'date_created' => date('Y-m-d H:i:s')
                        );
                        $this->comdb->insert('logistic_tbl_item_specific', $non_disp_arr);

                    }
                }
            }
        }
        else{
            $r = 'duplicate';
        }
        
        $this->comdb->trans_complete();
        
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }

        return $r;
    }

    private function UpdateItemData($p){
        $r = 'OK';
        $arr = array(
            $p['datafield']=>$p['value'],
            'uid'=>$p['uid']
        );

        $this->comdb->trans_start();
        $qry = $this->comdb->update('logistic_tbl_item',$arr,'id = '.$p['id']);
        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
    }

    private function updateItemDetailsData($p){
        $r = 'OK';
        $arr = array(
            $p['datafield']=>$p['value'],
            'uid'=>$p['uid']
        );

        $this->comdb->trans_start();
        $qry = $this->comdb->update('logistic_tbl_item_specific',$arr,'id = '.$p['id']);
        $this->comdb->trans_complete();

        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
    }

    private function updateAddQtyData($p){
        $r = 'OK';
        $arr = array(
            $p['datafield'] => ( $p['datafield'] == 'mr_to' ) ? preg_replace('/\s+/','',$this->get_mr_to_id_fullname($p['value'])) : $p['value'],
            'uid' => $p['uid']
        );

        $this->comdb->trans_start();
        $qry = $this->comdb->update('logistic_tbl_item_delivery',$arr,'id = '.$p['id']);
        $this->comdb->trans_complete();

        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
    }

    private function updateWasteData($p){
        $r = 'OK';
        $arr = array(
            $p['datafield']=>$p['value'],
            'uid'=>$p['uid']
        );

        $this->comdb->trans_start();
        $qry = $this->comdb->update('logistic_tbl_waste',$arr,'wid = '.$p['id']);
        $this->comdb->trans_complete();

        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
    }

    private function insertLogData($p){
        //var d = {itemid:itemid,qty:qty,dt:dt,remarks:remarks,type:'log',subtype:'insert'};
        $r = 'OK';

        $arr = array(
            'item_id'=>$p['item_id'],
            'qty'=>$p['qty'],
            'vehicle'=>$p['vehicle'],
            'borrower_id'=>$p['borrower_id'],
            'dtb'=>$p['dt'],
            'remarks'=>$p['remarks'],
            'dt_created'=>date('Y-m-d H:i:s'),
            'uid'=>$p['uid']
        );
        $this->comdb->trans_start();
        $qry = $this->comdb->insert('logistic_tbl_logs',$arr);
        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
    }

    private function insertWasteData($p){
        $r = 'OK';
        $avail_qty = (int)$p['avail_qty'];
        $waste_qty = (int)$p['waste_qty'];

        if($waste_qty >= $avail_qty) {
            $arr = array(
                'item_id' => $p['item_id'],
                'log_id' => $p['log_id'] ,
                'w_qty' => $p['waste_qty'],
                'remarks' => $p['remarks'],
                
                'uid' => $p['uid'],
                'date_created' => date('Y-m-d H:i:s')
            );
            $this->comdb->trans_start();
            
            $qry = $this->comdb->insert('logistic_tbl_waste',$arr);

            if($qry){
                // insert sa specific item na waste id
                $waste_id = $this->comdb->insert_id(); // get last inserted id

                $waste_specific_arr = array(
                    'waste_id' => $waste_id,
                    'uid' => $p['uid']
                );
                $this->comdb->where_in('id', $p['waste_arr_id']);
                $this->comdb->update('logistic_tbl_item_specific', $waste_specific_arr);

                // after ma insert sa waste sa table sa database, e minus ang total qty sa item
                $this->comdb->set('total_qty', 'total_qty-'.$waste_qty, FALSE);
                $this->comdb->where('id', $p['item_id']);
                $this->comdb->update('logistic_tbl_item');
            }
        }

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
    }

    private function UpdateReturnLogData($p){
        $r = 'OK';

        $arr = array(
            'dtr' => $p['update_dt_returned'],
            'returner_id' => $p['update_returner_id'],
            'recby' => $p['update_received_by'],
            'remarks' => $p['update_remarks'],
            'uid' => $p['uid']
        );

        $this->comdb->trans_start();
        
        // update return data
        $this->comdb->update('logistic_tbl_logs',$arr,'lid = '.$p['log_id']);

        // insert waste data here if naa
        $is_waste = filter_var($p['is_waste'], FILTER_VALIDATE_BOOLEAN);
        if( $is_waste ) {
            $this->insertWasteData($p);
        }

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
    }

    private function UpdateLogData($p){
        $r = 'OK';
        $arr = array(
            'dtb' => $p['dt'],
            'borrower_id' => $p['borrower_id'],
            'vehicle' => $p['vehicle'],
            'remarks' => $p['remarks'],
            'uid' => $p['uid']
        );

        $this->comdb->trans_start();
        
        if( $p['qty'] !== null && $p['qty'] !== '' ){
            $update_qty = (int)$p['qty'];
            $this->comdb->set('qty', 'qty+'.$update_qty, FALSE);
        }
        $qry = $this->comdb->update('logistic_tbl_logs',$arr,'lid = '.$p['update_id']);

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
    }

    private function updateData($post){
    	$obj = $post['updatedata'];
    	$ids = array();
    	$r = 'FAILED';

    	$article = 'article = CASE ';
    	$description = 'description = CASE ';
    	$itemname = 'item_name = CASE ';
    	$total_qty = 'total_qty = CASE ';
    	foreach ($obj as $key => $value) {
    		$ids[] = (int)$value['id'];
    		$article .= 'WHEN id = '.$value['id'].' THEN "'.$value['article'].'" ';
    		$description .= 'WHEN id = '.$value['id'].' THEN "'.$value['description'].'" ';
    		$itemname .= 'WHEN id = '.$value['id'].' THEN "'.$value['item_name'].'" ';
    		$total_qty .= 'WHEN id = '.$value['id'].' THEN '.$value['total_qty'].' ';

    	}
    	$article .= ' ELSE article END';
    	$description .= ' ELSE description END';
    	$itemname .= ' ELSE item_name END';
    	$total_qty .= ' ELSE total_qty END';

    	$colArrUpdate = array($article,$description,$itemname,$total_qty,$userdriver);

    	$qrystr = 'UPDATE logistic_tbl_item SET '.implode(',', $colArrUpdate).' WHERE id IN('.implode(',', $ids).')';

    	$this->comdb->trans_start();
        $qry = $this->comdb->simple_query($qrystr);
        if($qry){
        	$r = 'SUCCESS';
        }else{
        	$r = $this->comdb->error();
        }
        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }

        return $r;
    }

    public function GetData($p){
        $type = $p['type']; // type of filter
        $filter_data = $p['filter_data']; // filter data
        $addFilter = array();


        if($type != 'default'){
            $addFilter[] = 'c.mr_to="'.$filter_data['mrto_id'].'"';
        }

        $groupby = ' GROUP BY a.id';
        $orderby = ' ORDER BY a.item_name';
        // $limit = ($type == 'default' && count($addFilter) == 0)?' LIMIT 50':'';
        $limit = '';


        $str = 'SELECT a.id,a.disp_or_non,a.item_name,a.total_qty,a.unit,a.description,a.category,a.remarks,
                (CASE
                    WHEN ( a.total_qty - (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = a.id AND returner_id = 0) ) IS NULL THEN a.total_qty
                    WHEN ( a.total_qty - (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = a.id AND returner_id = 0) ) < 0 THEN 0
                    ELSE ( a.total_qty - (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = a.id AND returner_id = 0) )
                END) AS avail_qty,
                (CASE
                    WHEN (SELECT SUM(w_qty) FROM logistic_tbl_waste WHERE item_id = a.id) IS NULL THEN 0
                    WHEN (SELECT SUM(w_qty) FROM logistic_tbl_waste WHERE item_id = a.id) < 0 THEN 0
                    ELSE (SELECT SUM(w_qty) FROM logistic_tbl_waste WHERE item_id = a.id)
                END) AS waste_qty,
                (CASE
                    WHEN (SELECT SUM(w_qty) FROM logistic_tbl_waste WHERE item_id = a.id) > 0 THEN "yes"
                    ELSE "no"
                END) AS have_waste,
                CONCAT(
                    CASE
                        WHEN ( a.total_qty - (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = a.id AND returner_id = 0) ) IS NULL THEN a.total_qty
                        WHEN ( a.total_qty - (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = a.id AND returner_id = 0) ) < 0 THEN 0
                        ELSE ( a.total_qty - (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = a.id AND returner_id = 0) )
                    END,
                    " / ",
                    total_qty
                ) AS borrow_over_total_qty,
                d.fname AS modified_by 
                FROM `logistic_tbl_item` a
                LEFT JOIN logistic_tbl_item_delivery c ON c.item_id=a.id
                LEFT JOIN logistic_tbl_user d ON d.uid=a.uid '.(count($addFilter) == 0?'':' WHERE ').implode(' AND ',$addFilter).$groupby.$orderby.$limit;

        $qry = $this->comdb->query($str);
        return $qry->result();exit();
    }

    public function GetLogData(){

        //-bqty = total qty borrowed
        //-dqty = default total qty
        $str = 'SELECT a.lid, a.item_id, a.qty AS borrow_qty, a.vehicle, a.dtb AS dt_borrowed, a.dtr AS dt_returner, a.recby AS receive_by, a.remarks, 
            b.disp_or_non, b.item_name, b.unit, b.category, b.total_qty AS total_qty, b.description, 
            CASE
                WHEN ( b.total_qty - (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = b.id AND returner_id = 0) ) IS NULL THEN total_qty
                WHEN ( b.total_qty - (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = b.id AND returner_id = 0) ) < 0 THEN 0
                ELSE ( b.total_qty - (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = b.id AND returner_id = 0) )
            END AS bqty,
            c.id AS borrower_id, UPPER(c.division) AS borrower_div, c.first_name AS borrower_first_name, c.middle_name AS borrower_middle_name, c.last_name AS borrower_last_name, c.suffix_name AS borrower_suffix_name, c.full_name AS borrower, 
            d.id AS returner_id, UPPER(d.division) AS returner_div, d.full_name AS returner, 
            e.fname AS modified_by 
            FROM logistic_tbl_logs a 
            JOIN logistic_tbl_item b ON a.item_id = b.id 
            JOIN cdrrmd_personnel c ON a.borrower_id=c.id 
            LEFT JOIN cdrrmd_personnel d ON a.returner_id=d.id 
            JOIN logistic_tbl_user e ON a.uid=e.uid 
            WHERE returner_id = 0
            ORDER BY b.item_name';
        $qry = $this->comdb->query($str);
        return $qry->result();exit();
    }

    public function GetItemLogData($p){
        $id = $p['item_id'];
        // log_message('error','test GetItemLogData: '.$id);

        $this->comdb->select('
            a.lid, a.item_id, a.qty AS borrow_qty, a.dtb, a.dtr, a.recby AS receive_by, a.remarks, DATE(a.dt_created) AS date_created,
            b.full_name AS borrower, UPPER(b.division) AS borrower_div,
            c.full_name AS returner, UPPER(c.division) AS returner_div,
            d.fname AS modified_by ', FALSE);
        $this->comdb->join('cdrrmd_personnel b', 'b.id = a.borrower_id');
        $this->comdb->join('cdrrmd_personnel c', 'c.id = a.returner_id', 'left');
        $this->comdb->join('logistic_tbl_user d', 'd.uid = a.uid');
        $this->comdb->where('a.item_id', $id);
        $this->comdb->order_by('a.dtb', 'desc');
        return $this->comdb->get('logistic_tbl_logs a')->result();
    }

    public function GetItemWasteData($p){
        $id = $p['item_id'];

        $this->comdb->select('
            a.wid, a.item_id, a.w_qty AS waste_qty, a.date_created,a.remarks AS remarks,
            b.item_name, b.unit,
            CASE
                WHEN ( a.log_id IS NULL || a.log_id = 0 ) THEN a.remarks
                WHEN a.log_id > 0 THEN c.remarks
                ELSE a.remarks
            END AS remarks,
            d.fname AS modified_by', FALSE);
        $this->comdb->join('logistic_tbl_item b', 'b.id = a.item_id');
        $this->comdb->join('logistic_tbl_logs c', 'c.lid = a.log_id', 'left');
        $this->comdb->join('logistic_tbl_user d', 'd.uid = a.uid');
        $this->comdb->where('a.item_id', $id);
        $this->comdb->order_by('a.date_created', 'desc');
        return $this->comdb->get('logistic_tbl_waste a')->result();
    }

    /*Get data to populate select item
    */
    public function GetSelItem(){
        $str = 'SELECT id,disp_or_non,item_name,total_qty,unit,description,category,remarks, (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = id AND returner_id = 0) AS lqty FROM logistic_tbl_item ORDER BY item_name';
        //-bqty = total qty borrowed
        //-dqty = default total qty
        $qry = $this->comdb->query($str);
        return $qry->result();exit();
    }

    /**
     * Get Items data in select2 field
     */
    public function getSelectedItemData($get){
        $query = $get['q'];
        if( isset($query) && $query != '' ){
            $this->comdb->like('item_name', $query);
        }

        $this->comdb->select('id,disp_or_non,item_name,total_qty,unit,description,category,remarks, (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = id AND returner_id = 0) AS lqty, 
            CASE
                WHEN ( total_qty - (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = id AND returner_id = 0) ) IS NULL THEN total_qty
                WHEN ( total_qty - (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = id AND returner_id = 0) ) < 0 THEN 0
                ELSE ( total_qty - (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = id AND returner_id = 0) )
            END AS bqty', FALSE);
        $this->comdb->order_by('item_name');
        return $this->comdb->get('logistic_tbl_item')->result();
    }

    /**
     * Get Non Disposable Items data in select2 field
     */
    public function getNonDisposableItemData($get){
        $query = $get['q'];
        if( isset($query) && $query != '' ){
            $this->comdb->like('item_name', $query);
        }

        $this->comdb->select('id,disp_or_non,item_name,total_qty,unit,description,category,remarks, (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = id AND returner_id = 0) AS lqty, 
            CASE
                WHEN ( total_qty - (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = id AND returner_id = 0) ) IS NULL THEN total_qty
                WHEN ( total_qty - (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = id AND returner_id = 0) ) < 0 THEN 0
                ELSE ( total_qty - (SELECT SUM(qty) FROM logistic_tbl_logs WHERE item_id = id AND returner_id = 0) )
            END AS bqty', FALSE);
        $this->comdb->where('disp_or_non', 'non-disposable');
        $this->comdb->order_by('item_name');
        return $this->comdb->get('logistic_tbl_item')->result();
    }

    /**
     * Get CDRRMD Personnel data
     */
    public function getPersonnelData($get){
        $query = $get['q'];
        if( isset($query) && $query != '' ){
            $this->comdb->like('first_name', $query); 
            $this->comdb->or_like('middle_name', $query);
            $this->comdb->or_like('last_name', $query);
            $this->comdb->or_like('suffix_name', $query);
        }

        $this->comdb->select('id,division,last_name,first_name,middle_name,suffix_name,position,full_name', FALSE);
        $this->comdb->order_by('full_name');
        return $this->comdb->get('cdrrmd_personnel')->result();
    }

    public function getRegularForMR($get){
        $query = $get['q'];
        if( isset($query) && $query != '' ){
            $this->comdb->like('full_name', $query);
        }

        $this->comdb->select('id,division,full_name', FALSE);
        $this->comdb->where('regular', 1);
        $this->comdb->order_by('full_name');
        return $this->comdb->get('cdrrmd_personnel')->result();
    }


    public function getTotalAddQtyData($item_id){
        $output = 0;

        $str = 'SELECT SUM(add_total_qty) AS total FROM `logistic_tbl_item_delivery` WHERE item_id="'.$item_id.'"';
        $qry = $this->comdb->query($str);
        $row = $qry->row();

        if (isset($row)){
            $output = $row->total;
        }

        return $output;
    }

    private function insertAddQtyData($p){
        $r = 'OK';

        $this->comdb->trans_start();
        
        $add_qty = (int)$p['add_qty'];
        $current_total_qty = $add_qty + $this->getTotalAddQtyData($p['item_id']);
        
        $arr = array(
            'item_id' => $p['item_id'],
            'add_total_qty' => $add_qty,
            'c_total_qty' => $current_total_qty,
            'dr_no' => $p['dr_no'],
            'mr_to' => ( $p['disp_or_non'] == 'non-disposable' ) ? $p['mrto_id'] : 0,
            'remarks' => $p['remarks'],
            'uid' => $p['uid'],
            
            'date_created' => date('Y-m-d H:i:s')
        );
        
        $qry = $this->comdb->insert('logistic_tbl_item_delivery',$arr);
        
        if($qry){
            // non-disposable: insert sa logistic_tbl_item_specific 
            if($p['disp_or_non'] == 'non-disposable'){
                $delivery_id = $this->comdb->insert_id(); // get last inserted id

                // add kung pila ang qty kada-isa para sa property ug serial no.
                $qty_i =  $add_qty;
                for ($x = 0; $x < $qty_i; $x++) {

                    $non_disp_arr = array(
                        'delivery_id' => $delivery_id,

                        'property_no' => '',
                        'serial_no' => '',

                        'uid' => $p['uid'],
                        'date_created' => date('Y-m-d H:i:s')
                    );
                    $this->comdb->insert('logistic_tbl_item_specific', $non_disp_arr);

                }
            }

            // after ma insert sa table sa database, e add ang total qty sa item
            $this->comdb->set('total_qty', 'total_qty+'.$add_qty, FALSE);
            $this->comdb->where('id', $p['item_id']);
            $this->comdb->update('logistic_tbl_item');
        }

        $this->comdb->trans_complete();
        if ($this->comdb->trans_status() === FALSE){
            $r = 'ERROR';
            log_message('error', sprintf('%s : %s : DB transaction failed. Error no: %s, Error msg:%s, Last query: %s', __CLASS__, __FUNCTION__, $this->comdb->_error_number(), $this->comdb->_error_message(), print_r($this->comdb->last_query(), TRUE)));
        }
        return $r;
    }

    public function GetItemTotalQtyData($p){
        $id = $p['item_id'];

        $this->comdb->select('
            a.id,a.add_total_qty AS added_qty,a.c_total_qty AS total_qty,a.dr_no,a.date_created AS date_created,a.remarks AS remarks,
            b.item_name, b.unit,
            c.fname AS modified_by,
            d.full_name AS mr_to', FALSE);
        $this->comdb->join('logistic_tbl_item b', 'b.id = a.item_id', 'left');
        $this->comdb->join('logistic_tbl_user c', 'c.uid = a.uid');
        $this->comdb->join('cdrrmd_personnel d', 'd.id = a.mr_to', 'left');
        $this->comdb->where('a.item_id', $id);
        $this->comdb->order_by('a.date_created', 'desc');
        return $this->comdb->get('logistic_tbl_item_delivery a')->result();
    }

    public function GetItemDetailsData($p){
        $id = $p['id'];
        $type = $p['type'];
        $key = ( $type === 'added' ) ? 'a.delivery_id' : 'a.waste_id';

        $this->comdb->select('
            a.id,a.property_no,a.serial_no,
            c.full_name AS mr_to,
            d.fname AS modified_by', FALSE);
        $this->comdb->join('logistic_tbl_item_delivery  b', 'b.id = a.delivery_id', 'left');
        $this->comdb->join('cdrrmd_personnel c', 'c.id = b.mr_to', 'left');
        $this->comdb->join('logistic_tbl_user d', 'd.uid = a.uid');
        $this->comdb->where($key, $id);
        $this->comdb->order_by('a.date_created', 'desc');
        return $this->comdb->get('logistic_tbl_item_specific a')->result();
    }

    public function GetItemWasteSpecificData($p){
        $id = $p['item_id'];

        $this->comdb->select('
            a.id,a.property_no,a.serial_no,a.date_created AS date_created,
            c.full_name AS mr_to,
            d.fname AS modified_by', FALSE);
        $this->comdb->join('logistic_tbl_item_delivery  b', 'b.id = a.delivery_id', 'left');
        $this->comdb->join('cdrrmd_personnel c', 'c.id = b.mr_to', 'left');
        $this->comdb->join('logistic_tbl_user d', 'd.uid = a.uid');
        $this->comdb->where('b.item_id', $id);
        $this->comdb->where('a.waste_id', 0);
        return $this->comdb->get('logistic_tbl_item_specific a')->result();
    }

}

?>