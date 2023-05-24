<div id="loading"><div class="center-loading"><i class="mdi-database-check mdi"></i>Saving...</div></div>
<div id="forceportrait">Landscape mode only!!!</div>
<div id="menucontainer">
  <button type="button" id="history_epcr" class="btn btn-info" style="float: left;margin-right: 5px;display: none;"><i class="mdi mdi-history"></i> History</button>
  <button type="button" id="save_epcr" class="btn btn-success" style="float: left;"><i class="mdi mdi-database-check"></i> Save</button>
  <button type="button" id="print_epcr" class="btn btn-light" style="float: right;"><i class="mdi mdi-printer"></i> Print</button>
</div>
<div id="epcrformcontainer">
    <div class="px-3 pb-3" style="background-color: #E6E6E6; padding-top: 4.5rem !important;">
      <div id="epcrform">
        <div class="p-5 bg-white"style="font-family: Calibri;font-size: 16px;box-shadow: 0  0 5px #282923;">
          <img src="<?php echo base_url(); ?>assets/img/cdo_logo_100px.png" style="height: 100px; width: auto;float: left;"/>
          <img src="<?php echo base_url(); ?>assets/img/oro_rescue_logo_100px.png" style="height: 100px; width: auto;float: right;"/>
          <center class="f16">
            REPUBLIC OF THE PHILIPPINES<br>CITY OF CAGAYAN DE ORO<br>CITY DISASTER RISK REDUCTION AND MANAGEMENT DEPT.<br>GROUND FLR. LEGISLATIVE BUILDING, CITY HALL COMPOUND<br>CAPISTRANO-HAYES ST., CAGAYAN DE ORO CITY<br><span style="font-weight: bold;font-size: 25px;" class="f25">ORO RESCUE 911</span><br><span style="font-size: 22px;" class="f22">PRE-HOSPITAL PATIENT CARE REPORT</span>
          </center>
          <table style="border-collapse: collapse;width: 100%;">
            <tr style="border-bottom:1px solid #000;" class="f16">
              <td style="border-right:1px solid #000; width: 50% !important;" colspan="6">CASE TYPE - DESCRIPTION:
                <select id="casetype">
                  <option value="53">Medical</option>
                  <option value="54">Trauma</option>
                </select>
                <input id="ct_desc" type="text" placeholder="Additional description. eg.(OB Case, OB Transport, etc...)" /></td>
              <td style="border-right:1px solid #000; width: 25% !important;" colspan="3">DATE:<input type="date" id="dt_date" /></td>
              <td colspan="3" style=" width: 25% !important;border-right:1px solid #000;">TIME ARRIVED AT SCENE:<input type="datetime-local" id="dt_tas"/></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16">
              <td style="border-right:1px solid #000;" colspan="6">LOCATION:<input type="text" id="loc"/></td>
              <td style="border-right:1px solid #000;" colspan="3">TIME:<input type="time" id="dt_time" /></td>
              <td colspan="3" style="border-right:1px solid #000;">TIME LEFT SCENE:<input type="datetime-local" id="dt_tls" /></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16">
              <td style="border-right:1px solid #000;" colspan="6">NAME OF PATIENT:<input type="text" id="pname"></td>
              <td style="border-right:1px solid #000;" colspan="3">HOSPITAL TRANSPORTED TO:<input type="text" id="ht" /></td>
              <td colspan="3" style="border-right:1px solid #000;">TIME ARRIVED AT HOSPITAL:<input type="datetime-local" id="dt_tah"/></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16">
              <td style="border-right:1px solid #000;">AGE:<input type="number" min="1" id="age" /></td>
              <td style="border-right:1px solid #000;">GENDER:<br>
                <select id="pgender">
                  <option value="male">Male</option><option value="female">Female</option>
                </select></td>
              <td style="border-right:1px solid #000;">WEIGHT:<input type="number" min="1" id="pweight" /></td>
              <td style="border-right:1px solid #000;">HEIGHT:<input type="number" min="1" id="pheight" /></td>
              <td style="border-right:1px solid #000;" colspan="2">CONTACT NO.<input type="text" id="pnum" /></td>
              <td style="border-right:1px solid #000;" colspan="3">RESPONSE TEAM:<input type="text" id="rteam" /></td>
              <td colspan="3" style="border-right:1px solid #000;">RESPONSE CODE:<input type="text" id="rcode" /></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16">
              <td style="border-right:1px solid #000;" colspan="6">HOME ADDRESS:<input type="text" id="padd" /></td>
              <td style="border-right:1px solid #000;" colspan="3">RESPONSE FROM:<input type="text" id="rfrom" /></td>
              <td colspan="3" style="border-right:1px solid #000;">AMBULANCE No.<input type="text" id="amnum" /></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16">
              <td style="border-right:1px solid #000;" colspan="6">NAME/S OF SIGNIFICANT OTHER/S:<input type="text" id="pso" /></td>
              <td colspan="6" style="border-right:1px solid #000;">RELATION TO PATIENT:<input type="text" id="rp" /></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16"> 
              <td colspan="6" style="border-right:1px solid #000;"><b>DOI:</b> <input type="text" class="dntp" data-field="d"></td>
              <td colspan="6" style="border-right:1px solid #000;"><b>NOI:</b> <input type="text" class="dntp" data-field="n"></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16"> 
              <td colspan="6" style="border-right:1px solid #000;"><b>TOI:</b> <input type="text" class="dntp" data-field="t"></td>
              <td colspan="6" style="border-right:1px solid #000;"><b>POI:</b> <input type="text" class="dntp" data-field="p"></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f17"> 
              <th colspan="2" style="border-right:1px solid #000;">CHIEF COMPLAINT/S:</th>
              <td colspan="10" style="border-right:1px solid #000;"><textarea rows="2" id="cc"></textarea></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16">
              <th style="border-right:1px solid #000;text-align: center;" colspan="6">HISTORY</th>
              <th colspan="6" style="text-align: center;border-right:1px solid #000;">INTERVENTIONS</th>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f21"> 
              <td style="border-right:1px solid #000;font-weight: bold;" align="center">S:</td>
              <td colspan="5" style="border-right:1px solid #000;"><textarea rows="2" class="sample" data-field="s"></textarea></td>
              <td colspan="6" rowspan="6" style="border-right:1px solid #000;"><textarea rows="15" id="interventions"></textarea></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f21"> 
              <td style="border-right:1px solid #000;font-weight: bold;" align="center">A:</td>
              <td colspan="5" style="border-right:1px solid #000;"><textarea rows="2" class="sample" data-field="a"></textarea></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f21"> 
              <td style="border-right:1px solid #000;font-weight: bold;" align="center">M:</td>
              <td colspan="5" style="border-right:1px solid #000;"><textarea rows="2" class="sample" data-field="m"></textarea></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f21"> 
              <td style="border-right:1px solid #000;font-weight: bold;" align="center">P:</td>
              <td colspan="5" style="border-right:1px solid #000;"><textarea rows="2" class="sample" data-field="p"></textarea></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f21"> 
              <td style="border-right:1px solid #000;font-weight: bold;" align="center">L:</td>
              <td colspan="5" style="border-right:1px solid #000;"><textarea rows="2" class="sample" data-field="l"></textarea></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f21"> 
              <td style="border-right:1px solid #000;font-weight: bold;" align="center">E:</td>
              <td colspan="5" style="border-right:1px solid #000;"><textarea rows="2" class="sample" data-field="e"></textarea></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16"> 
              <td style="font-weight: bold;border-right:1px solid #000;" align="center" colspan="12">VITAL SIGNS</td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16"> 
              <td style="background-color: #A6A6A6;border-right:1px solid #000;" colspan="12">FIRST TAKING</td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16">
              <td rowspan="2" style="border-right:1px solid #000;">TIME:<input type="time" class="vsign" data-field="time" data-cnt="first" /></td>
              <td style="border-right:1px solid #000;">GCS:<input type="text" class="vsign" data-field="gcs" data-cnt="first"></td>
              <td rowspan="2" style="border-right:1px solid #000;">BP:<textarea rows="2" class="vsign" data-field="bp" data-cnt="first"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">PULSE:<textarea rows="2" class="vsign" data-field="pulse" data-cnt="first"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">RR:<textarea rows="2" class="vsign" data-field="rr" data-cnt="first"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">TEMP:<textarea rows="2" class="vsign" data-field="temp" data-cnt="first"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">O2 SAT:<textarea rows="2" class="vsign" data-field="o2sat" data-cnt="first"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">CAP REFILL:<textarea rows="2" class="vsign" data-field="caprefill" data-cnt="first"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">HGT:<textarea rows="2" class="vsign" data-field="hgt" data-cnt="first"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">SKIN COLOR:<textarea rows="2" class="vsign" data-field="skincolor" data-cnt="first"></textarea></td>
              <td colspan="2" style="border-bottom:1px solid #000;border-right:1px solid #000;">PUPIL SIZE:</td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f14">
              <td style="border-right:1px solid #000;">
                <div data-cnt="first"><div class="avpu" data-val="a">A</div><div class="avpu" data-val="v">V</div><div class="avpu" data-val="p">P</div><div class="avpu" data-val="u">U</div></div>
                </td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsign" data-field="ps1" data-cnt="first"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsign" data-field="ps2" data-cnt="first"></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16">
              <td style="border-right:1px solid #000;">REMARKS:</td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks1" data-cnt="first"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks2" data-cnt="first"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks3" data-cnt="first"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks4" data-cnt="first"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks5" data-cnt="first"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks6" data-cnt="first"></td>
              <td colspan="2" style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks7" data-cnt="first"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks8" data-cnt="first"></td>
              <td colspan="2" style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks9" data-cnt="first"></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16"> 
              <td style="background-color: #A6A6A6;border-right:1px solid #000;" colspan="12">SECOND TAKING</td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16">
              <td rowspan="2" style="border-right:1px solid #000;">TIME:<input type="time" class="vsign" data-field="time" data-cnt="second" /></td>
              <td style="border-right:1px solid #000;">GCS:<input type="text" class="vsign" data-field="gcs" data-cnt="second"></td>
              <td rowspan="2" style="border-right:1px solid #000;">BP:<textarea rows="2" class="vsign" data-field="bp" data-cnt="second"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">PULSE:<textarea rows="2" class="vsign" data-field="pulse" data-cnt="second"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">RR:<textarea rows="2" class="vsign" data-field="rr" data-cnt="second"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">TEMP:<textarea rows="2" class="vsign" data-field="temp" data-cnt="second"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">O2 SAT:<textarea rows="2" class="vsign" data-field="o2sat" data-cnt="second"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">CAP REFILL:<textarea rows="2" class="vsign" data-field="caprefill" data-cnt="second"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">HGT:<textarea rows="2" class="vsign" data-field="hgt" data-cnt="second"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">SKIN COLOR:<textarea rows="2" class="vsign" data-field="skincolor" data-cnt="second"></textarea></td>
              <td colspan="2" style="border-bottom:1px solid #000;border-right:1px solid #000;">PUPIL SIZE:</td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f14">
              <td style="border-right:1px solid #000;">
                <div data-cnt="second"><div class="avpu" data-val="a">A</div><div class="avpu" data-val="v">V</div><div class="avpu" data-val="p">P</div><div class="avpu" data-val="u">U</div></div>
                </td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsign" data-field="ps1" data-cnt="second"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsign" data-field="ps2" data-cnt="second"></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16">
              <td style="border-right:1px solid #000;">REMARKS:</td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks1" data-cnt="second"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks2" data-cnt="second"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks3" data-cnt="second"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks4" data-cnt="second"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks5" data-cnt="second"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks6" data-cnt="second"></td>
              <td colspan="2" style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks7" data-cnt="second"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks8" data-cnt="second"></td>
              <td colspan="2"  style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks9" data-cnt="second"></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16"> 
              <td style="background-color: #A6A6A6;border-right:1px solid #000;" colspan="12">THIRD TAKING</td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16">
              <td rowspan="2" style="border-right:1px solid #000;">TIME:<input type="time" class="vsign" data-field="time" data-cnt="third" /></td>
              <td style="border-right:1px solid #000;">GCS:<input type="text" class="vsign" data-field="gcs" data-cnt="third"></td>
              <td rowspan="2" style="border-right:1px solid #000;">BP:<textarea rows="2" class="vsign" data-field="bp" data-cnt="third"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">PULSE:<textarea rows="2" class="vsign" data-field="pulse" data-cnt="third"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">RR:<textarea rows="2" class="vsign" data-field="rr" data-cnt="third"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">TEMP:<textarea rows="2" class="vsign" data-field="temp" data-cnt="third"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">O2 SAT:<textarea rows="2" class="vsign" data-field="o2sat" data-cnt="third"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">CAP REFILL:<textarea rows="2" class="vsign" data-field="caprefill" data-cnt="third"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">HGT:<textarea rows="2" class="vsign" data-field="hgt" data-cnt="third"></textarea></td>
              <td rowspan="2" style="border-right:1px solid #000;">SKIN COLOR:<textarea rows="2" class="vsign" data-field="skincolor" data-cnt="third"></textarea></td>
              <td colspan="2" style="border-bottom:1px solid #000;border-right:1px solid #000;">PUPIL SIZE:</td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f14">
              <td style="border-right:1px solid #000;">
                <div data-cnt="third"><div class="avpu" data-val="a">A</div><div class="avpu" data-val="v">V</div><div class="avpu" data-val="p">P</div><div class="avpu" data-val="u">U</div></div>
                </td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsign" data-field="ps1" data-cnt="third"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsign" data-field="ps2" data-cnt="third"></td>
            </tr>

            <tr style="border-bottom:1px solid #000;" class="f16">
              <td style="border-right:1px solid #000;">REMARKS:</td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks1" data-cnt="third"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks2" data-cnt="third"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks3" data-cnt="third"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks4" data-cnt="third"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks5" data-cnt="third"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks6" data-cnt="third"></td>
              <td colspan="2" style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks7" data-cnt="third"></td>
              <td style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks8" data-cnt="third"></td>
              <td colspan="2" style="border-right:1px solid #000;"><input type="text" class="vsignr" data-field="remarks9" data-cnt="third"></td>
            </tr>

            <tr>
              <td colspan="12" align="center" class="f17" style="border-right:1px solid #000;"><b><u>NOTES</u></b></td>
            </tr>
            <tr style="border-bottom:1px solid #000;">
              <td colspan="12" style="border-right:1px solid #000;"><textarea rows="3" id="notes"></textarea></td>
            </tr>

            <tr style="border-bottom:1px solid #000;"><td colspan="12" style="border-right:1px solid #000;"></td></tr>

            <tr style="border-bottom:1px solid #000;font-weight: bold;" class="f18">
              <td colspan="6" align="center" style="border-right:1px solid #000;" class="f16">EMS CREW</td>
              <td colspan="6" align="center" class="f16" style="border-right:1px solid #000;">RECEIVING</td>
            </tr>

            <tr>
              <td colspan="2" align="right" class="f16">EMS IN CHARGE:</td>
              <td colspan="2" class="f16"><input type="text" style="border-bottom: 1px solid #000;" class="crew" data-field="eic"></td>
              <td></td><td style="border-right:1px solid #000;"></td>

              <td colspan="3" align="center" class="f17">PHYSICIAN / NURSE ON DUTY:</td>
              <td colspan="3" align="center" class="f17" style="border-right:1px solid #000;">DATE/TIME RECEIVED:</td>
            </tr>

            <tr class="f16">
              <td colspan="2" align="right">EMS ASSISTANT:</td>
              <td colspan="2"><input type="text" style="border-bottom: 1px solid #000;" class="crew" data-field="ea1"></td>
              <td colspan="2" style="border-right:1px solid #000;"></td>
              <td colspan="3" rowspan="3" style="position: relative;" align="center">
                <button type="button" class="btn btn-sm btn-outline-secondary" id="addesig">Add E-Signature</button>
                <img id="sig" width="auto" height="100%" style="position: absolute;bottom: 0rem;left:4rem;z-index: 1;display: block;cursor: pointer;" />
                <!-- <div id="sigcanvas" style="position: absolute;bottom: -2rem;border:1px solid #000;left:2rem;z-index: 9999;"><canvas id="signature-pad" class="signature-pad" width="300px" height="100%"></canvas></div> -->
              </td>
              <td colspan="3" style="border-right:1px solid #000;"></td>
            </tr>

            <tr class="f16">
              <td colspan="2" align="right">EMS ASSISTANT:</td>
              <td colspan="2"><input type="text" style="border-bottom: 1px solid #000;" class="crew" data-field="ea2"></td>
              <td colspan="2" style="border-right:1px solid #000;"></td>
              <td colspan="6" style="border-right:1px solid #000;"></td>
              
            </tr>

            <tr>
              <td colspan="2" align="right" class="f16">EMS ASSISTANT:</td>
              <td colspan="2" class="f16"><input type="text" style="border-bottom: 1px solid #000;" class="crew" data-field="ea3"></td>
              <td colspan="2" style="border-right:1px solid #000;"></td>
              <td colspan="6" style="border-right:1px solid #000;"></td>
              
            </tr>

            <tr class="f16">
              <td colspan="2" align="right" valign="bottom">EMS OPERATOR:</td>
              <td colspan="2"><input type="text" style="border-bottom: 1px solid #000;" class="crew" data-field="eo"></td>
              <td colspan="2" style="border-right:1px solid #000;"></td>
              <!-- <td colspan="6" style="border-right:1px solid #000;"></td> -->

              <td colspan="3" style="position: relative;"><input type="text" style="border-bottom: 1px solid #000;z-index: 2;position: inherit;text-align: center;" id="revname"></td>
              <td colspan="3" style="padding: 0 1rem;border-right:1px solid #000;"><input type="date" style="border-bottom: 1px solid #000;" id="revdt"></td>
            </tr>

            <tr><td colspan="6" style="border-right:1px solid #000;">&nbsp;</td>
              <td colspan="3" align="center" class="f15">SIGNATURE OVER PRINTED NAME</td>
              <td colspan="3" align="center" class="f15" style="border-right:1px solid #000;">DATE & TIME</td>
            </tr>
            <tr>
              <td width="8%"></td><td width="12%"></td>
              <td width="8%"></td><td width="8%"></td>
              <td width="8%"></td><td width="8%"></td>
              <td width="8%"></td><td width="8%"></td>
              <td width="8%"></td><td width="8%"></td>
              <td width="8%"></td><td width="8%"></td>
            </tr>
          </table>
        </div>
        <!----------------2nd page------------------------>
        <div class="mt-5 p-5 bg-white mt-3"style="font-family: Calibri;font-size: 16px;box-shadow: 0  0 5px #282923; display: none;">
          <table border="1" style="border-collapse: collapse;width: 100%;">
            <tr class="f16">
              <td colspan="12" align="center"><b>APGAR SCORING GUIDE</b></td>
            </tr>
            <tr class="f15">
              <td colspan="3" width="25%" align="center"><b>AREA OF ACTIVITY</b></td>
              <td colspan="3" width="25%" align="center"><b>2</b></td>
              <td colspan="3" width="25%" align="center"><b>1</b></td>
              <td colspan="3" width="25%" align="center"><b>0</b></td>
            </tr>
            <tr class="f14">
              <td colspan="3"><b>A - APPEARANCE</b></td>
              <td colspan="3">Entire infant is pink</td>
              <td colspan="3">Body is pink, but hands and feet remain blue</td>
              <td colspan="3">Entire infant is blue or pale</td>
            </tr>
            <tr class="f14">
              <td colspan="3"><b>P - PULSE</b></td>
              <td colspan="3">More than 100 beats/min</td>
              <td colspan="3">Fewer than 100 beats/min</td>
              <td colspan="3">Absent pulse</td>
            </tr>
            <tr class="f14">
              <td colspan="3"><b>G - GRIMACE & IRRITABILITY</b></td>
              <td colspan="3">Infant cries and tries to move foot  away from finger snapped against its sole</td>
              <td colspan="3">Gives weak cry in response to stimulus</td>
              <td colspan="3">Infant does not cry or react to stimulus</td>
            </tr>
            <tr class="f14">
              <td colspan="3"><b>A - ACTIVITY OR MUSCLE TONE</b></td>
              <td colspan="3">Resist attempts to straighten out hips and knees</td>
              <td colspan="3">Makes weak cry in response to resist straightening</td>
              <td colspan="3">Infant is completely limp with no muscle tone</td>
            </tr>
            <tr class="f14">
              <td colspan="3"><b>R - RESPIRATION</b></td>
              <td colspan="3">Rapid respiration</td>
              <td colspan="3">Slow respiration</td>
              <td colspan="3">Absent pulse</td>
            </tr>
            <tr class="f16">
              <td colspan="9" align="right"><b>NEWBORN APGAR SCORE:</b></td>
              <td colspan="3"></td>
            </tr>
            <tr class="f16">
              <td colspan="12" align="center"><b>GLASGLOW COMMA SCALE GUIDE</b></td>
            </tr>
            <tr class="f16">
              <td colspan="12" align="center"><b>ADULT</b></td>
            </tr>
            <tr class="f14">
              <td colspan="4" align="center"><b>EYES</b></td>
              <td colspan="4" align="center"><b>VERBAL</b></td>
              <td colspan="4" align="center"><b>MOTOR</b></td>
            </tr>
            <tr class="f14">
              <td colspan="4">4- SPONTANEOUS</td>
              <td colspan="4">5- ORIENTED</td>
              <td colspan="4">6- OBEYS COMMAND</td>
            </tr>
            <tr class="f14">
              <td colspan="4">3- VERBAL/COMMAND</td>
              <td colspan="4">4- CONFUSED</td>
              <td colspan="4">5- LOCALIZES PAIN</td>
            </tr>
            <tr class="f14">
              <td colspan="4">2- TO PAIN</td>
              <td colspan="4">3- INNAPPRORIATE WORDS</td>
              <td colspan="4">4- WITHDRAWS FROM PAIN</td>
            </tr>
            <tr class="f14">
              <td colspan="4">1- NO RESPONSE</td>
              <td colspan="4">2- INCOMPREHENSIBLE</td>
              <td colspan="4">3- ABNORMAL FLEXION</td>
            </tr>
            <tr class="f14">
              <td colspan="4"></td>
              <td colspan="4">1- NO RESPONSE</td>
              <td colspan="4">2- EXTENSION</td>
            </tr>
            <tr class="f14">
              <td colspan="4"></td>
              <td colspan="4"></td>
              <td colspan="4">1- NO RESPONSE</td>
            </tr>
            <tr class="f14">
              <td colspan="12" align="center"><b>PEDIA</b></td>
            </tr>
            <tr class="f14">
              <td colspan="4" align="center"><b>EYES</b></td>
              <td colspan="4" align="center"><b>VERBAL</b></td>
              <td colspan="4" align="center"><b>MOTOR</b></td>
            </tr>
            <tr class="f14">
              <td colspan="4">4- SPONTANEOUS</td>
              <td colspan="4">5- APPROPRIATE WORDS</td>
              <td colspan="4">6- SPONTANEOUS</td>
            </tr>
            <tr class="f14">
              <td colspan="4">3- VERBAL</td>
              <td colspan="4">4- INAPPROPRIATE WORDS</td>
              <td colspan="4">5- LOCALIZES PAIN</td>
            </tr>
            <tr class="f14">
              <td colspan="4">2- TO PAIN</td>
              <td colspan="4">3- CRIES, SCREAMS</td>
              <td colspan="4">4- FLEXION WITHDRAWAL</td>
            </tr>
            <tr class="f14">
              <td colspan="4">1- NO RESPONSE</td>
              <td colspan="4">2- GRUNTS</td>
              <td colspan="4">3- ABNORMAL FLEXION</td>
            </tr>
            <tr class="f14">
              <td colspan="4"></td>
              <td colspan="4">1- NO RESPONSE</td>
              <td colspan="4">2- EXTENSION</td>
            </tr>
            <tr class="f14">
              <td colspan="4"></td>
              <td colspan="4"></td>
              <td colspan="4">1- NO RESPONSE</td>
            </tr>
            <tr class="f18">
              <td colspan="12" align="center" class="bb-0"><b><u>RELEASE FROM RESPONSIBILITY WHEN PATIENT REFUSES CARE / TRANSPORT</u></b></td>
            </tr>
            <tr class="f17">
              <td colspan="12" class="by-0">
                <br>
                <p>This is to  certify that I, ____________________________________, am refusing the CARE / TRANSPORT offered by the ORO RESCUE Medical Services Provider/s. I acknowledge that I have been informed of the risk involved and hereby release the Emergency Medical Services Provider/s, the medical consultant and the ORO RESCUE 911 from all responsibility and for any ill effects which may result from this action.</p><br><br>
              </td>
            </tr>
            <tr class="f17">
              <td colspan="4" align="center" class="b-0">_____________________________</td>
              <td colspan="4" align="center" class="b-0">_____________________________</td>
              <td colspan="4" align="center" class="b-0">_____________________________</td>
            </tr>
            <tr class="f17">
              <td colspan="4" align="center" class="b-0">Patient Name or nearest relative</td>
              <td colspan="4" align="center" class="b-0">Patient Name or nearest relative</td>
              <td colspan="4" align="center" class="b-0">Patient Name or nearest relative</td>
            </tr>
            <tr class="f17">
              <td colspan="4" align="center" class="b-0">_____________________________</td>
              <td colspan="4" align="center" class="b-0">_____________________________</td>
              <td colspan="4" align="center" class="b-0"></td>
            </tr>
            <tr class="f17">
              <td colspan="4" align="center" class="b-0">Relationship</td>
              <td colspan="4" align="center" class="b-0">Witness</td>
              <td colspan="4" align="center" class="b-0"></td>
            </tr>
            <tr class="f18">
              <td colspan="12" align="center" class="bb-0"><b><u>RELEASE FROM RESPONSIBILITY WHEN PATIENT REFUSES IV THERAPY</u></b></td>
            </tr>
            <tr>
              <td colspan="12" class="by-0">
                <br>
                <p>This is to  certify that I, _____________________________________, am refusing IV treatment. I acknowledge that I have been informed ORO RESCUE EMS providers of the risk involved and hereby release the Emergency Medical Services Provider/s, and the Physician conultant from all responsibility and for any ill effects which may result from this action.</p><br><br>
              </td>
            </tr>
            <tr class="f17">
              <td colspan="4" align="center" class="b-0">_____________________________</td>
              <td colspan="4" align="center" class="b-0">_____________________________</td>
              <td colspan="4" align="center" class="b-0">_____________________________</td>
            </tr>
            <tr class="f17">
              <td colspan="4" align="center" class="b-0">Patient Name or nearest relative</td>
              <td colspan="4" align="center" class="b-0">Patient Name or nearest relative</td>
              <td colspan="4" align="center" class="b-0">Patient Name or nearest relative</td>
            </tr>
            <tr class="f17">
              <td colspan="4" align="center" class="b-0">_____________________________</td>
              <td colspan="4" align="center" class="b-0">_____________________________</td>
              <td colspan="4" align="center" class="b-0"></td>
            </tr>
            <tr class="f17">
              <td colspan="4" align="center" class="b-0">Relationship</td>
              <td colspan="4" align="center" class="b-0">Witness</td>
              <td colspan="4" align="center" class="b-0"></td>
            </tr>
            <tr class="f17">
              <td colspan="12" align="center" class="bb-0"><b><u>WAIVER</u></b></td>
            </tr>
            <tr class="f17">
              <td colspan="12" class="by-0">
                <br>
                <p>I _______________________ waived my rights / Patient's rights to the Oro Rescue 911 EMS ambulance crew; that if untoward conditions arise while patient is still on board the ambulance, Oro Rescue 911 EMS crew will not be liable.</p><br><br>
              </td>
            </tr>
            <tr class="f17">
              <td colspan="12" class="b-0 pl-4">SIGNED: ___________________________________</td>
            </tr>
            <tr class="f17"><td class="b-0"></td><td colspan="11" class="b-0">REQUESTING PARTY / RELATIONSHIP</td></tr>
            <tr class="f18">
              <td colspan="12" align="center" class="bb-0"><b><u>HOSPITAL REFUSED TO RECEIVE PATIENT</u></b></td>
            </tr>
            <tr class="f17">
              <td colspan="12" class="b-0">DUE TO THE FOLLOWING REASONS:<br><br></td>
            </tr>
            <tr class="f17"><td colspan="8" class="b-0"></td>
              <td colspan="4" class="b-0 pr-3" align="right">_________________________________________</td>
            </tr>
            <tr class="f17"><td colspan="8" class="b-0"></td>
              <td colspan="4" class="b-0 pr-5" align="right">NURSE ON DUTY / PHYSICIAN ON DUTY</td>
            </tr>

            <tr>
              <td width="8.33%"></td><td width="8.33%"></td>
              <td width="8.33%"></td><td width="8.33%"></td>
              <td width="8.33%"></td><td width="8.33%"></td>
              <td width="8.33%"></td><td width="8.33%"></td>
              <td width="8.33%"></td><td width="8.33%"></td>
              <td width="8.33%"></td><td width="8.33%"></td>
            </tr>
          </table>
        </div>
      </div>

    </div>
</div>
<div class="modal fade" id="sigmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-sm modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel"><span class="sigmodalheader"></span> E-Signature</h5>
        <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button> -->
      </div>
      <div class="modal-body">
        <div id="sigcanvas" style="border:1px solid #000; overflow: hidden;">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-sm btn-primary" id="savesig"><span class="sigmodalheader"></span> signature</button>
        <button type="button" class="btn btn-sm btn-primary" id="clearsig">Clear</button>
        <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>