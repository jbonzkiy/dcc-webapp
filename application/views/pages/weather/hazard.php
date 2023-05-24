<style type="text/css">
  select,button,.segment,input{border-radius: 0 !important;}
  legend{text-align: center;font-weight: bolder;padding: 0 .5vw;}
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
  .btn_edit,{border: none;background-color: #E0E1E2;color: #5A5A5A;}
  .btn_edit:hover{color: #fff;background-color: #2185D0;cursor: pointer;}
  .flood-street:hover{color: #2185D0;cursor: pointer;}
</style>

<div id="versplit">
  <div>
    <div id="vhsplit">
      <div>
        <div style="font-size: 14px;text-align: center;padding: 10px; font-weight: bolder;">Incident Form</div>
      </div>
      <div>
        <div id="frmPanel">
          <div style="overflow: auto; overflow-x: hidden;">
            <div class="ui tiny form custom" style="padding:10px 10px 30px 10px;">
              <div class="field">
                <label>Date:</label>
                <input type="datetime-local" id="frm_rdt" value="<?php echo date('Y-m-d\TH:i'); ?>">
              </div>
              <br>
              <fieldset>
                <legend>AFFECTED AREA</legend>
                <div class="inline field">
                  <div class="ui radio checkbox">
                    <input type="radio" name="affected_area" value="urban" class="hidden" checked>
                    <label>Urban</label>
                  </div>
                  <div class="ui radio checkbox">
                    <input type="radio" name="affected_area" value="riverine" class="hidden">
                    <label>Riverine</label>
                  </div>
                  <div class="ui radio checkbox">
                    <input type="radio" name="affected_area" value="landslide" class="hidden">
                    <label>Landslide</label>
                  </div>
                  <div class="ui radio checkbox">
                    <input type="radio" name="affected_area" value="surge" class="hidden">
                    <label>Surge</label>
                  </div>
                  <div class="ui radio checkbox">
                    <input type="radio" name="affected_area" value="public disturbance" class="hidden">
                    <label>Public Disturbance</label>
                  </div>
                  <div class="ui radio checkbox">
                    <input type="radio" name="affected_area" value="earthquake" class="hidden">
                    <label>Earthquake</label>
                  </div>
                </div>
              </fieldset>
              <br>

              <div id="for_urban">
                <table>
                  <thead>
                    <tr>
                      <th width="40%">Street Name</th>
                      <th width="40%">Status</th>
                      <th width="10%"><i class="plus icon flood-street" id="btn_addstreet"></i></th>
                    </tr>
                  </thead>
                  <tbody id="street_container">
                    <tr><td><input type="text"></td><td><select></select></td></tr>
                  </tbody>
                </table>
              </div>

              <div id="for_riverine" style="display:none;">
                <div class="field">
                  <label>Riverine:</label>
                  <select id="frm_riverine"></select>
                </div>
                <br>
                <fieldset>
                  <legend>ARG</legend>
                  <table>
                    <thead><tr><th width="45%">Guage</th><th width="20%">(mm)</th><th>Time Span</th></tr></thead>
                    <tbody id="arg_container"></tbody>
                  </table>
                </fieldset>
                <br>
                <fieldset>
                  <legend>WLMS</legend>
                  <table>
                    <thead><tr><th width="45%">Guage</th><th width="20%">(m)</th><th>Time of Peak</th></tr></thead>
                    <tbody id="wlms_container"></tbody>
                  </table>
                </fieldset>
              </div> 
              
              <div id="for_landslide" style="display:none;">
                <div class="field">
                  <label>Location:</label>
                  <input type="text" id="location">
                </div>
              </div>

              <div id="for_surge" style="display:none;">
                <div class="field">
                    <label>Location:</label>
                    <input type="text" id="surge_location">
                  </div>
              </div>
              
              <div id="for_public_disturbance" style="display:none;">
                <div class="field">
                  <label>Location:</label>
                  <input type="text" id="public_disturbance_location">
                </div>
              </div>

              <div id="for_earthquake" style="display:none;">
                <div class="field">
                    <label>Location:</label>
                    <input type="text" id="earthquake_location">
                  </div>
              </div>

              <br>
              <div class="field">
                <label>Remarks:</label>
                  <textarea id="remarks"></textarea>
              </div>
              <button class="ui fluid positive button" id="btn_submit">Save</button>
              <br>
              <button class="ui fluid button" id="btn_clear">Clear</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
     <div id="dsplit">
       <div>

        <div style="padding:10px;height: 100%;overflow-y: scroll;">
          <div id='calendar'></div>
          <br>
          <fieldset style="height: 15vh; width: 90%;">
            <legend>URBAN LIST (<span id="ucnt">0</span>)</legend>
            <div id="urban_lst_container"></div>
          </fieldset>
          <br>
          <fieldset style="height: 15vh; width: 90%;">
            <legend>RIVERINE LIST (<span id="rcnt">0</span>)</legend>
            <div id="riverine_lst_container"></div>
          </fieldset> 
          <br>
          <fieldset style="height: 15vh; width: 90%;">
            <legend>LANDSLIDE LIST (<span id="lcnt">0</span>)</legend>
            <div id="landslide_lst_container"></div>
          </fieldset>              
          <br>
          <fieldset style="height: 15vh; width: 90%;">
            <legend>SURGE LIST (<span id="scnt">0</span>)</legend>
            <div id="surge_lst_container"></div>
          </fieldset>
          <br>
          <fieldset style="height: 15vh; width: 90%;">
            <legend>PUBLIC DISTURBANCE LIST (<span id="pdcnt">0</span>)</legend>
            <div id="public_disturbance_lst_container"></div>
          </fieldset>
          <br>
          <fieldset style="height: 15vh; width: 90%;">
            <legend>EARTHQUAKE LIST (<span id="ecnt">0</span>)</legend>
            <div id="earthquake_lst_container"></div>
          </fieldset>
        </div>

       </div>

       <div>
         <div id="dpanel">
           <div id="display_container" style="padding: 10px;"></div>
         </div>
       </div>
     </div>
  </div>
</div>