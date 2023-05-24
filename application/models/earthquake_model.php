<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class Earthquake_model extends CI_Model {
	private $cdrrmd;
	public function __construct()
    {
            parent::__construct();
            $this->load->database();
            // $this->cdrrmd = $this->load->database('cdrrmd',TRUE);
    }


     /*
     * Get all earthquake
     */

    public function get_all_earthquake()
    {
        $this->db->order_by('RECORDED BY', 'desc');
        return $this->db->get('earthquake')->result_array();
    
    }

       
}

?>
