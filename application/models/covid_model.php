<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Covid_model extends CI_Model {
	private $ldb;
	public function __construct()
    {
        parent::__construct();
        $this->ldb = $this->load->database('nineoneone_local',TRUE);
    }

    public function GetBrgyAor(){
        $selArr = array('Longitude','latitude','Brgy_name','Brgy_ID');
        $this->ldb->select(implode(',', $selArr));
        $this->ldb->from('barangay_aor');
        $this->ldb->where('Brgy_ID !=',458);
        $this->ldb->order_by('Brgy_ID,Point_sequence');

        $qry = $this->ldb->get();
        $res = $qry->result();
        return $res;exit();
    }

    public function GetExcelData(){
        $this->load->library('excel');
        $file = base_url().'public/for-mark.xlsx';
        //read file from path
        $objPHPExcel = $this->excel->load($file);

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
                if ($row == 2){
                    // $header[$row][$column] = $data_value;
                }else{
                    $arr_data[$row][$column] = $data_value;
                }
            }
        }

        return $arr_data;
    }

    
}

?>