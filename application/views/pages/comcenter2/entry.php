<div>
    <div id="versplit" data-uid="<?php echo $uid; ?>" data-utype="<?php echo $utype; ?>">
        <div>
            <div id="vhsplit">
                <div>
                    <div style="
                        font-size: 16px;
                        text-align: center;
                        padding-top: 8px;
                        border-bottom: 5px solid #b3b3b3;
                        font-weight: bold;">Comcenter Data Entry Form
                    </div>
                </div>
                <div>
                    <div id="frmPanel" style="position: relative;">
                        
                        <div class="px-4 py-2">
                            <form autocomplete="on" class="p-3">
                                <div class="row">
                                    <div class="col">
                                        <label for="call_date">Date</label>
                                        <input type="date" id="call_date" class="form-control form-control-sm rounded-0"
                                            value="<?php 
                                                    $date = new DateTime("now", new DateTimeZone('Asia/Taipei') );
                                                    echo $date->format('Y-m-d'); ?>">
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col">
                                        <label for="call_time">Time</label>
                                        <input type="time" id="call_time" class="form-control form-control-sm rounded-0">
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col">
                                        <label for="call_origin">Call Origin</label>
                                        <select class="form-control form-control-sm rounded-0" id="call_origin">
                                            <option></option>
                                            <option>Radio</option>
                                            <option>Telephone</option>
                                            <option>Walk-in</option>
                                            <option>CDRRMD</option>
                                        </select>
                                    </div>
                                    <div class="col">
                                        <label for="source_of_info">Source of info</label>
                                        <select class="form-control form-control-sm rounded-0" id="source_of_info">
                                            <option></option>
                                            <option>Informant</option>
                                            <option>Complainant</option>
                                            <option>Victim</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group mt-2">
                                    <label for="caller_name">Caller's Name</label>
                                    <input type="text" class="form-control form-control-sm rounded-0" id="caller_name">
                                </div>
                                <div class="form-group mt-2">
                                    <label for="caller_number">Contact Number</label>
                                    <input type="text" class="form-control form-control-sm rounded-0" id="caller_number">
                                </div>
                                <fieldset class="custom-fieldset-border p-2">
                                    <legend class="w-auto" style="max-width: 49% !important;">Call Type Group</legend>
                                    <div class="form-group">
                                        <label for="call_type">Call Type</label>
                                        <select class="form-control form-control-sm rounded-0" id="call_type">
                                            <option></option>
                                        </select>
                                    </div>
                                    <div class="form-group mt-2">
                                        <label for="call_category">Call Category</label>
                                        <input class="form-control" type="text" id="call_category" readonly>
                                    </div>
                                </fieldset>
                                <fieldset class="custom-fieldset-border p-2 mt-3">
                                    <legend class="w-auto" style="max-width: 26% !important;">Location</legend>
                                    <div class="form-group">
                                        <label for="incident_location">Incident Location</label>
                                        <input list="incident_location_datalist" type="text" class="form-control form-control-sm rounded-0" id="incident_location">
                                        <datalist id="incident_location_datalist">
                                        </datalist>
                                    </div>
                                    <div class="form-group mt-2">
                                        <button type="button" class="btn btn-info" id="show_map">SHOW MAP</button>
                                    </div>
                                    <div class="form-group mt-2">
                                        <label for="latitude">Latitude</label>
                                        <input type="number" class="form-control form-control-sm rounded-0" id="latitude">
                                    </div>
                                    <div class="form-group mt-2">
                                        <label for="longitude">Longitude</label>
                                        <input type="number" class="form-control form-control-sm rounded-0" id="longitude">
                                    </div>
                                    <div class="form-group mt-3">
                                        <label for="details">Details</label>
                                        <textarea class="form-control form-control-sm rounded-0" rows="8" cols="50" id="details"></textarea >
                                    </div>
                                </fieldset>

                                <fieldset id="response_unit_fieldset" class="custom-fieldset-border p-2 mt-3">
                                    <legend class="w-auto" style="max-width: 45% !important;">Response Unit Group</legend>
                                    <div class="form-group">
                                        <label for="response_unit">Response Unit</label>
                                        <select class="form-control form-control-sm rounded-0" id="response_unit">
                                            <option></option>
                                        </select>
                                    </div>

                                    <!-- response unit other options -->
                                    <div id="response_unit_group">
                                        <div class="form-group mt-2">
                                            <div id="pnp_response_unit_fieldset">
                                                <label for="pnp_response_unit">Police Station</label>
                                                <select class="form-control form-control-sm rounded-0" id="pnp_response_unit">
                                                    <option></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group mt-2">
                                            <div id="others_response_unit_fieldset">
                                                <label for="others_response_unit">Others</label>
                                                <input type="text" class="form-control form-control-sm rounded-0" id="others_response_unit">
                                            </div>
                                        </div>
                                        <div class="form-group mt-2">
                                            <label for="response_call_origin">Call Origin</label>
                                            <select class="form-control form-control-sm rounded-0" id="response_call_origin">
                                                <option></option>
                                                <option>Radio</option>
                                                <option>Telephone</option>
                                                <option>Walk-in</option>
                                                <option>CDRRMD</option>
                                            </select>
                                        </div>
                                        <div class="form-group mt-2">
                                            <label for="response_time">Time</label>
                                            <input type="time" id="response_time" class="form-control form-control-sm rounded-0">
                                        </div>
                                        <fieldset class="custom-fieldset-border p-2">
                                            <legend class="w-auto" style="max-width: 50% !important;"><label for="acknowledge_field_group">Acknowledge?</label></legend>
                                            <div class="form-group">
            
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" name="acknowledge" id="acknowledge1" value="Negative Acknowledge">
                                                    <label class="form-check-label" for="acknowledge1">
                                                        Negative Acknowledge
                                                    </label>
                                                </div>
                                                <div class="form-check form-check-inline pt-2">
                                                    <input class="form-check-input" type="radio" name="acknowledge" id="acknowledge2" value="Acknowledged">
                                                    <label class="form-check-label" for="acknowledge2">
                                                        Acknowledged
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="form-group mt-2">
                                                <label for="acknowledge_by">Acknowledged By</label>
                                                <input type="text" class="form-control form-control-sm rounded-0" id="acknowledge_by">
                                            </div>
                                        </fieldset>
                                    </div>
                                    <!-- response unit other options -->
                                
                                </fieldset>

                                <fieldset class="custom-fieldset-border p-2 mt-3">
                                    <legend class="w-auto" style="max-width: 36% !important;"><label for="case_status_field_group">Case Status</label></legend>
                                    <div class="form-group">
        
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="case_status" id="case_status_noted" value="Noted">
                                            <label class="form-check-label" for="case_status_noted">
                                                Noted
                                            </label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="case_status" id="case_status_responded" value="Responded">
                                            <label class="form-check-label" for="case_status_responded">
                                                Responded
                                            </label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="case_status" id="case_status_disregard" value="Disregard">
                                            <label class="form-check-label" for="case_status_disregard">
                                                Disregard
                                            </label>
                                        </div>
                                    
                                    </div>
                                </fieldset>
                                <fieldset class="custom-fieldset-border p-2 mt-3">
                                    <legend class="w-auto" style="max-width: 75% !important;"><label for="ref_dispatch_field_group">Referred from/to Central Dispatch</label></legend>
                                    <div class="form-group">
        
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="ref_dispatch" id="ref_dispatch1" value="No">
                                            <label class="form-check-label" for="ref_dispatch1">
                                                No
                                            </label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="ref_dispatch" id="ref_dispatch2" value="Yes">
                                            <label class="form-check-label" for="ref_dispatch2">
                                                Yes
                                            </label>
                                        </div>
        
                                    </div>
                                    <div class="form-group mt-2">
                                        <label for="caller_id">Caller ID</label>
                                        <input type="text" class="form-control form-control-sm rounded-0" id="caller_id">
                                    </div>
                                </fieldset>
                                <div class="form-group mt-2">
                                    <label for="remarks">Remarks</label>
                                    <textarea class="form-control form-control-sm rounded-0" rows="8" cols="50" id="remarks"></textarea >
                                </div>

                                <button type="button" id="submit" class="btn btn-dark btn-sm rounded-0 btn-block" data-request="request">Create</button>
                                <button type="button" id="clearall" class="btn btn-light btn-sm rounded-0 btn-block custom-clear-border" >Clear</button>
                            </form>
                        </div>
                    
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div id="horsplit">
                <div>
                    <div class="p-2" id="filtercontainer" style="background-color: #F4F4F4;">
                        <fieldset>
                            <!-- <legend>Date Filter</legend> -->
                            <div class="float-left mr-2"><span class="date-filter-from-to">From:</span><input type="datetime-local" id="fdt"/></div>
                            <div class="float-left mr-2"><span class="date-filter-from-to">To:</span><input type="datetime-local" id="tdt"/></div>
                            <div class="float-left mr-2"><br><button class="btn btn-info btn-sm rounded-0 btn-block" type="button" id="dtFilter">Filter</button></div>
                            <div class="float-left mr-2"><br><button type="button" class="btn btn-light btn-sm rounded-0 custom-clear-border-2" id="dtClearFilter">Clear Filter</button></div>
                            
                            <!-- <div class="float-right mr-2"><br><button type="button" class="btn btn-primary btn-sm rounded-0" id="btnRefresh">Refresh Data</button></div> -->
                        </fieldset>
                    </div>
                </div>
                <div>
                    <div id="grid"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id='jqxwindow'>
    <h5>MAP</h5>
    <div width="100%" height="100%" id="mapid"></div>
</div>

<div id='jqxwindow_details'>
    <div id="jqxwindow_details_header">
        <h6 class="modal-title"></h6>
    </div>
    <div style="overflow: auto;" id="view_details">
        <div id="follow_up_grid"></div>
        <div id="responder_grid"></div>
    </div>
</div>


<div id='jqxwindow_follow_up_form'>
    <h5>Follow-Up Call</h5>
    <div style="background-color: white;" id="follow_up_form">
        <div class="px-3 py-1">
            <form autocomplete="on" class="p-3">
                <div class="row">
                    <div class="col">
                        <label for="fwu_call_date">Date</label>
                        <input type="date" id="fwu_call_date" class="form-control form-control-sm rounded-0"
                            value="<?php 
                                    $fwu_date = new DateTime("now", new DateTimeZone('Asia/Taipei') );
                                    echo $fwu_date->format('Y-m-d'); ?>">
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <label for="fwu_call_time">Time</label>
                        <input type="time" id="fwu_call_time" class="form-control form-control-sm rounded-0">
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col">
                        <label for="fwu_call_origin">Call Origin</label>
                        <select class="form-control form-control-sm rounded-0" id="fwu_call_origin">
                            <option></option>
                            <option>Radio</option>
                            <option>Telephone</option>
                            <option>Walk-in</option>
                            <option>CDRRMD</option>
                        </select>
                    </div>
                    <div class="col">
                        <label for="fwu_source_of_info">Source of info</label>
                        <select class="form-control form-control-sm rounded-0" id="fwu_source_of_info">
                            <option></option>
                            <option>Informant</option>
                            <option>Complainant</option>
                            <option>Victim</option>
                        </select>
                    </div>
                </div>

                <div class="form-group mt-2">
                    <label for="fwu_caller_name">Caller's Name</label>
                    <input type="text" class="form-control form-control-sm rounded-0" id="fwu_caller_name">
                </div>
                <div class="form-group mt-2">
                    <label for="fwu_caller_number">Contact Number</label>
                    <input type="text" class="form-control form-control-sm rounded-0" id="fwu_caller_number">
                </div>
                <fieldset class="custom-fieldset-border p-2">
                    <legend class="w-auto" style="max-width: 49% !important;">Call Type Group</legend>
                    <div class="form-group">
                        <label for="fwu_call_type">Call Type</label>
                        <input class="form-control" type="text" id="fwu_call_type" value="Follow-Up Call" readonly>
                    </div>
                    <div class="form-group mt-2">
                        <label for="fwu_call_category">Call Category</label>
                        <input class="form-control" type="text" id="fwu_call_category" value="Other Calls" readonly>
                    </div>
                </fieldset>
                <fieldset class="custom-fieldset-border p-2 mt-3">
                    <legend class="w-auto" style="max-width: 26% !important;">Location</legend>
                    <div class="form-group">
                        <label for="fwu_incident_location">Incident Location</label>
                        <input list="incident_location_datalist" type="text" class="form-control form-control-sm rounded-0" id="fwu_incident_location" readonly>
                    </div>
                    <div class="form-group mt-2">
                        <label for="fwu_latitude">Latitude</label>
                        <input type="number" class="form-control form-control-sm rounded-0" id="fwu_latitude" readonly>
                    </div>
                    <div class="form-group mt-2">
                        <label for="fwu_longitude">Longitude</label>
                        <input type="number" class="form-control form-control-sm rounded-0" id="fwu_longitude" readonly>
                    </div>
                    <div class="form-group mt-3">
                        <label for="fwu_details">Details</label>
                        <textarea class="form-control form-control-sm rounded-0" rows="8" cols="50" id="fwu_details"></textarea >
                    </div>
                </fieldset>

                <fieldset class="custom-fieldset-border p-2 mt-3">
                    <legend class="w-auto" style="max-width: 36% !important;"><label for="fwu_case_status_field_group">Case Status</label></legend>
                    <div class="form-group">

                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="fwu_case_status" id="fwu_case_status_noted" value="Noted">
                            <label class="form-check-label" for="fwu_case_status_noted">
                                Noted
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="fwu_case_status" id="fwu_case_status_responded" value="Responded">
                            <label class="form-check-label" for="fwu_case_status_responded">
                                Responded
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="fwu_case_status" id="fwu_case_status_disregard" value="Disregard">
                            <label class="form-check-label" for="fwu_case_status_disregard">
                                Disregard
                            </label>
                        </div>
                    
                    </div>
                </fieldset>
                <div class="form-group mt-2">
                    <label for="fwu_remarks">Remarks</label>
                    <textarea class="form-control form-control-sm rounded-0" rows="8" cols="50" id="fwu_remarks"></textarea >
                </div>
                
                <button type="button" id="fwu_submit" class="btn btn-dark btn-sm rounded-0 btn-block" data-request="request">Submit</button>
            </form>
        </div>
    </div>
</div>


<div id='jqxwindow_responder_form'>
    <!-- <h5>Responder Form</h5> -->
    <div style="background-color: white;" id="responder_form">
        <div class="px-3 py-1">
            <form autocomplete="on" class="p-3">
                <div class="form-group">
                    <label for="rspdr_response_unit">Response Unit</label>
                    <select class="form-control form-control-sm rounded-0" id="rspdr_response_unit">
                        <option></option>
                    </select>
                </div>

                <!-- response unit other options -->
                <div id="rspdr_response_unit_group">
                    <div class="form-group mt-2">
                        <div id="rspdr_pnp_response_unit_fieldset">
                            <label for="rspdr_pnp_response_unit">Police Station</label>
                            <select class="form-control form-control-sm rounded-0" id="rspdr_pnp_response_unit">
                                <option></option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group mt-2">
                        <div id="rspdr_others_response_unit_fieldset">
                            <label for="rspdr_others_response_unit">Others</label>
                            <input type="text" class="form-control form-control-sm rounded-0" id="rspdr_others_response_unit">
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col">
                            <label for="rspdr_response_call_origin">Call Origin</label>
                            <select class="form-control form-control-sm rounded-0" id="rspdr_response_call_origin">
                                <option></option>
                                <option>Radio</option>
                                <option>Telephone</option>
                                <option>Walk-in</option>
                                <option>CDRRMD</option>
                            </select>
                        </div>
                        <div class="col">
                            <label for="rspdr_response_time">Time</label>
                            <input type="time" id="rspdr_response_time" class="form-control form-control-sm rounded-0">
                        </div>
                    </div>

                    <fieldset class="custom-fieldset-border mt-2 p-2">
                        <legend class="w-auto" style="max-width: 50% !important;"><label for="rspdr_acknowledge_field_group">Acknowledge?</label></legend>
                        <div class="form-group">

                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="rspdr_acknowledge" id="rspdr_acknowledge1" value="Negative Acknowledge">
                                <label class="form-check-label" for="rspdr_acknowledge1">
                                    Negative Acknowledge
                                </label>
                            </div>
                            <div class="form-check form-check-inline pt-2">
                                <input class="form-check-input" type="radio" name="rspdr_acknowledge" id="rspdr_acknowledge2" value="Acknowledged">
                                <label class="form-check-label" for="rspdr_acknowledge2">
                                    Acknowledged
                                </label>
                            </div>
                        </div>
                        <div class="form-group mt-2">
                            <label for="rspdr_acknowledge_by">Received By</label>
                            <input type="text" class="form-control form-control-sm rounded-0" id="rspdr_acknowledge_by">
                        </div>
                    </fieldset>
                </div>
                <!-- response unit other options -->

                <br/>
                <button type="button" id="rspdr_submit" class="btn btn-dark btn-sm rounded-0 btn-block" data-request="request">Submit</button>
            </form>
        </div>
    </div>
</div>