var fdt = '', tdt = '';
var defaultLatitude = mapcenter.lat, defaultLongitude = mapcenter.long;
var map = undefined;
var marker = undefined;
var formAction = 'create';
var update_id = 0;
var response_sub_id = 0;
var users_list = [];

$(function(){
	console.log('ready comcenter entry');
    var navbar_height = $('#navbar').innerHeight();
    var html_height = $(window).innerHeight();
	var navinnerheight = $('.navbar').innerHeight() + 5;

	$('#versplit').jqxSplitter({  width: '100%', height: (html_height-navinnerheight)+'px', panels: [{ size: 300,collapsible:true }],theme:'material' });
    $('#horsplit').jqxSplitter({  width: '100%', height: '100%',resizable:false,splitBarSize:0,orientation:'horizontal', panels: [{ size:$('#filtercontainer').innerHeight()+'px',collapsible:false }],theme:'metro' });
    $("#vhsplit").jqxSplitter({width: '100%', height: '100%',orientation:'horizontal',panels:[{ size: 30,collapsible:false }],showSplitBar:false,theme:'material'});
    $("#frmPanel").jqxPanel({ width: '100%', height: '100%',theme:'metro',autoUpdate: true});

    /*************************************************************************************************************/
	// MAP
	/*************************************************************************************************************/

    $('#jqxwindow').jqxWindow({
        autoOpen:false,animationType:'none',height:'500px',width:'700px',resizable:false,theme:'metrodark',
        minHeight:'500px',minWidth:'700px',
        initContent: function(){
            map = L.map('mapid',{
                fullscreenControl: true,
                fullscreenControlOptions: {
                    position: 'topleft'
                }
            }).setView([defaultLatitude,defaultLongitude], 13);

            // google map
            L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            }).addTo(map);
            
            var markerOptions = {
                title: "Location",
                clickable: true,
                draggable: false
            }

            marker = L.marker([defaultLatitude,defaultLongitude], markerOptions).addTo(map);

            map.addControl( new L.Control.Search({
                url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
                jsonpParam: 'json_callback',
                propertyName: 'display_name',
                propertyLoc: ['lat','lon'],
                zoom: 18,
                autoType: false,
                marker: marker.setLatLng(marker.getLatLng()).update(),
                autoCollapse: false,
                // minLength: 2,
                // position:'topleft'
            }).on('search:locationfound', function(ev){
                // console.log('search:locationfound', ev);
                var mapSetLatitude = ev.latlng.lat;
                var mapSetLongitude = ev.latlng.lng;

                // marker.bindPopup(ev.text).openPopup();

                $('#latitude').val(mapSetLatitude);
                $('#longitude').val(mapSetLongitude);
            }) );

            
            map.on('click', function(ev) {
                // console.log(ev); // ev is an event object (MouseEvent in this case)
                var mapSetLatitude = ev.latlng.lat;
                var mapSetLongitude = ev.latlng.lng;
                
                // console.log('lat lng', mapSetLatitude,mapSetLongitude);
                // console.log('marker', marker);
                marker.setLatLng([mapSetLatitude,mapSetLongitude]).update();
                map.panTo(marker.getLatLng());
                
                $('#latitude').val(mapSetLatitude);
                $('#longitude').val(mapSetLongitude);
            });

            console.log('DONE INIT MAP');
        }
    }); 

    // $(window).on('resize', function(){
	// 	var w = $(window).width();
	// 	var h = $(window).innerHeight();
	// 	// $('#vhsplit').jqxSplitter({});
	// 	$('#versplit').jqxSplitter({orientation:(w <= 768? 'horizontal':'vertical')});
	// });

    
    /**
     * Hide Elements
     */
    hideResponseUnitELements();
    /**
     * Hide Elements
     */

    
    // populate data in call type field.
    var call_type_options = "";
    $.each(call_type_list, function(i, value) {
        call_type_options +=('<option value="'+ value+'">'+ value +'</option>');
    });
    $('#call_type').append(call_type_options);

    // populate data in incident location field.
    // var incident_location_options = "";
    // $.each(incident_location_list, function(i, value) {
    //     incident_location_options +=('<option value="'+ value+'">'+ value +'</option>');
    // });
    // $('#incident_location_datalist').append(incident_location_options);

    // populate data in response unit field.
    var reponse_unit_options = "";
    $.each(response_unit_list, function(i, value) {
        reponse_unit_options +=('<option value="'+ value+'">'+ value +'</option>');
    });
    $('#response_unit,#rspdr_response_unit').append(reponse_unit_options);

    // set call category depends on selected input of call type
    $('#call_type').on('change', function() {
        var val = $(this).val();
        var res = callCategoryOnChange(val);

        // for call category
        $('#call_category').val(res);

        // for incident locations
        if ( val == 'Alarm' || val == 'Alarm Test' ) {
            var incident_location_options = "";
            $.each(incident_location_bank_list, function(i, value) {
                incident_location_options +=('<option value="'+ value+'">'+ value +'</option>');
            });
            $('#incident_location_datalist').append(incident_location_options);
        }
        else {
            $('#incident_location_datalist').empty();
        }
    });

    // populate data in pnp response unit field.
    var pnp_reponse_unit_options = "";
    for (let i = 1; i <= 10; i++) {
        pnp_reponse_unit_options += ('<option value="Police Station '+ i +'">Police Station '+ i +'</option>');
    }
    pnp_reponse_unit_options += ('<option value="COCPO">COCPO</option>');
    $('#pnp_response_unit,#rspdr_pnp_response_unit').append(pnp_reponse_unit_options);

    // response unit other options
    $('#response_unit').on('change', function() {
        var val = $(this).val();

        if ( val == 'PNP' ) {
            $("#pnp_response_unit_fieldset").show();
        }else{
            $("#pnp_response_unit_fieldset").hide();
        }

        if ( val == 'Others' || val == 'Barangay' ) {
            $("#others_response_unit_fieldset").show();
        }else{
            $("#others_response_unit_fieldset").hide();
        }

        if( val == 'Central Dispatch' ){
            $('#response_call_origin').val('CDRRMD');
        }else{
            $('#response_call_origin').val('');
        }

        if( val == 'NONE' || val == '' ){
            $("#response_unit_group").hide();
        }else{
            $("#response_unit_group").show();
        }

        // alert( "Handler for .change() called." );
    });

    $('#rspdr_response_unit').on('change', function() {
        var val = $(this).val();

        if ( val == 'PNP' ) {
            $("#rspdr_pnp_response_unit_fieldset").show();
        }else{
            $("#rspdr_pnp_response_unit_fieldset").hide();
        }

        if ( val == 'Others' || val == 'Barangay' ) {
            $("#rspdr_others_response_unit_fieldset").show();
        }else{
            $("#rspdr_others_response_unit_fieldset").hide();
        }

        if( val == 'Central Dispatch' ){
            $('#rspdr_response_call_origin').val('CDRRMD');
        }else{
            $('#rspdr_response_call_origin').val('');
        }

    });

    // acknowledge
    $( "#acknowledge_by,#rspdr_acknowledge_by" ).prop( "disabled", true ); // disable field first
    $('input[type=radio][name=acknowledge]').on('change', function() {
        switch ($(this).val()) {
          case 'Negative Acknowledge':
            // disable
            $( "#acknowledge_by" ).prop( "disabled", true );
            $( "#acknowledge_by" ).val( "" );
            break;
          case 'Acknowledged':
            // enable
            $( "#acknowledge_by" ).prop( "disabled", false );
            break;
        }
    });

    $('input[type=radio][name=rspdr_acknowledge]').on('change', function() {
        switch ($(this).val()) {
          case 'Negative Acknowledge':
            // disable
            $( "#rspdr_acknowledge_by" ).prop( "disabled", true );
            $( "#rspdr_acknowledge_by" ).val( "" );
            break;
          case 'Acknowledged':
            // enable
            $( "#rspdr_acknowledge_by" ).prop( "disabled", false );
            break;
        }
    });

    // Referred from/to Central Dispatch
    $( "#caller_id" ).prop( "disabled", true ); // disable field first
    $('input[type=radio][name=ref_dispatch]').on('change', function() {
        switch ($(this).val()) {
          case 'No':
            // disable
            $( "#caller_id" ).prop( "disabled", true );
            $( "#caller_id" ).val( "" );
            break;
          case 'Yes':
            // enable
            $( "#caller_id" ).prop( "disabled", false );
            break;
        }
    });

    // Submit Form
    $('#submit').click(function(){
        submitForm();
    });

    // Clear Form
    $('#clearall').click(function(){
        clearAll();
    });

    // Update Form
    // $('#update_form').onclick(function(){
    //     updateForm();
    // });
    $('#grid').on('click','#update_form',function(){
        updateForm($(this));
    });

    // View Form
    $('#grid').on('click','#view_form',function(){
        viewForm($(this));
    });

    // Add Responder
    $('#follow_up_grid').on('click','#add_responder',function(){
        responderForm($(this), 'add');
    });

    // Submit Follow-Up Form
    $('#fwu_submit').click(function(){
        submitFollowUpForm($(this));
    });

    // Responder Form
    $('#rspdr_submit').click(function(){
        submitResponderForm($(this));
    });

    // Edit Responder
    $('#responder_grid').on('click','#update_responder_form',function(){
        responderForm($(this), 'edit');
    });
    

    
    /*************************************************************************************************************/
	//grid
	/*************************************************************************************************************/
	var columns = [
        // rownumberer
		{
            text: '#', 
            width: '40px',
            cellsalign:'center',
            align:'center',
            resizable:false,
            filterable:false,
            menu:false,
            pinned:true,
            cellsrenderer: function (row, column, value) {
                var r = row;
                // console.log(r,row,r++,(r + 1))
                return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
	    	}
        },
        // edit, delete icon button
		{ 
            text: '', 
            width: '50px',
            cellsalign:'center',
            align:'center',
            resizable:false,
            filterable:false,
            menu:false,
            sortable: false,
            pinned:true,
            cellsrenderer: function (row, column, value) {
                var rdata = $('#grid').jqxGrid('getrowdata', row);
                // console.log(rdata);
                var btnarr = [
                    '<i class="grid-cell-icon mdi mdi-file-document-edit-outline action-btns" data-action="edit" id="update_form" title="Edit '+rdata.report_id+'"></i>',
                    '<i class="grid-cell-icon mdi mdi-file-search-outline action-btns" data-action="view" id="view_form" title="View '+rdata.report_id+'"></i>'
                ]
                return '<div class="jqx-grid-cell-middle-align" style="margin-top:8px;" data-row="'+row+'">'+btnarr.join('&nbsp;')+'</div>';
            }
        },
        // ID
		{ 
            text: 'ID',  
            datafield: 'report_id', 
            width: '70px',
            cellsalign: 'center',
            align: 'center',
            resizable: false,
            pinned: true 
        },
        // Date
        {
            text: 'Date',
            datafield: 'c_date',
            width: '100px',
            cellsalign: 'center',
            align: 'center',
            resizable: false,
            filtertype: 'date',
            cellsformat: 'yyyy-MM-dd'
        },
        // Time
        {
            text: 'Time',
            datafield: 'c_time',
            width: '80px',
            cellsalign: 'center',
            align: 'center',
            resizable: false,
        },
        // Caller's Name
        {
            text: 'Caller\'s Name',
            datafield: 'caller_name',
            width: '150px',
            cellsalign:'center',
            align:'center',
            resizable: true,
        },
        // Call Type
        {
            text: 'Call Type',
            datafield: 'call_type',
            width: '100px',
            cellsalign:'center',
            align:'center',
            resizable: true,
            filtertype:'checkedlist',
            filteritems: call_type_list
        },
        // Incident Location
        {
            text: 'Incident Location',
            datafield: 'incident_location',
            width: '200px',
            cellsalign:'center',
            align:'center',
            resizable: true,
        },
        // Details
        {
            text: 'Details',
            datafield: 'details',
            minwidth: '150px',
            cellsalign:'center',
            align:'center',
            resizable: true,
        },
        // Remarks
        {
            text: 'Remarks',
            datafield: 'remarks',
            minwidth: '150px',
            cellsalign:'center',
            align:'center',
            resizable: true,
        },
        // Status
        {
            text: 'Status',
            datafield: 'c_status',
            width: '100px',
            cellsalign:'center',
            align:'center',
            resizable: false,
            filtertype: 'checkedlist',
            filteritems: ['Noted', 'Responded', 'Disregard']
        },
        { 
            text: 'Modified By',  
            datafield: 'modified_by', 
            width: '100px',
            align: 'center', 
            cellsalign: 'center', 
            filtertype: 'checkedlist', 
            filteritems: users_list,
            editable: false 
        }
		
	];

    $('#grid').jqxGrid({
		width: '100%', height: '100%', theme:'office',
        columns: columns,
		columnsresize: true,
		enablebrowserselection: true,
		enabletooltips: true,
		showfilterrow: true,
		selectionmode:'single',
		columnsreorder: true,
		filterable: true,
        sortable: true,
        // groupable: true,
        
        pageable: true,
		pagesize: 20,
        pagesizeoptions: ['20','50','100'],
		ready:function(){
			console.log('ready function GRID!');
			
		}
	});

    // populate data
    GetData();
    getUsers();

    /*************************************************************************************************************/
	//grid
	/*************************************************************************************************************/

    

    /*************************************************************************************************************/
	// GRID TOOLBARS
	/*************************************************************************************************************/
	$('#dtFilter').click(function(){
		fdt = $('#fdt').val(),tdt = $('#tdt').val();
        
		if(fdt == '' || tdt == ''){
            // console.log('no date');
			notif('Please input date.','error');
		}else{
            fdt = moment(fdt).format('YYYY-MM-DD HH:mm:ss');
            tdt = moment(tdt).format('YYYY-MM-DD HH:mm:ss');
            
			if(!moment(fdt).isBefore(tdt) && fdt != tdt){
                notif('Invalid Date Range','error');
			}else{
                GetData('filter');
			}
            // console.log('date filter', fdt, tdt);
		}
	});
    
	$('#dtClearFilter').click(function(){
		fdt = ''; tdt = '';
		$('#fdt,#tdt').val('');
		$('#grid').jqxGrid('clearfilters',false);
		GetData();
	});
    /*************************************************************************************************************/
	// GRID TOOLBARS
	/*************************************************************************************************************/
    
    $('#show_map').click(function(){
        $('#jqxwindow').jqxWindow('open');
        
        if(formAction == 'update'){
            var setLat = $('#latitude').val();
            var setLong = $('#longitude').val();
            // console.log(setLat, setLong, typeof(setLat), typeof(setLong));
            
            if(setLat != '' && setLong != ''){
                marker.setLatLng([setLat,setLong]).update();
                map.panTo(marker.getLatLng());
            }
            else{
                map.panTo(marker.getLatLng());
            }
        }
        else if(formAction == 'create'){
            map.panTo(marker.getLatLng());
        }

        
        // var mymap = L.map('mapid').setView([8.46982559076231, 124.66884933349614], 13);
        // // // add the OpenStreetMap tiles
        // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        // { subdomains: ['a', 'b', 'c'] })
        // .addTo(mymap);

        // var map = L.map('mapid',{zoomControl:false }).setView([8.476834645946782, 124.64140181245084], 13);
        // mapG = map;
        // //Initialize google map
        // L.esri.basemapLayer("Imagery").addTo(map);
        // L.esri.basemapLayer('ImageryLabels').addTo(map);

        // //Initialize group for marker
        // var markerGroup = new L.layerGroup().addTo(map);
        // markGroup = markerGroup;
        // map.addControl( new L.Control.Search({
        //     url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
        //     jsonpParam: 'json_callback',
        //     propertyName: 'display_name',
        //     propertyLoc: ['lat','lon'],
        //     marker: false,//L.circleMarker([0,0],{radius:30})
        //     autoCollapse: true,
        //     autoType: false,
        //     minLength: 5,position:'topleft'
        // }) );

        // $('#jqxwindow').jqxWindow({initContent: function() { 
        //     var lat = $('#latitude').val();
        //     var long = $('#longitude').val();
        //     console.log(lat, long, typeof(lat), typeof(long));
        //     if(lat != '' && long != ''){
        //         console.log('okokokokoko lat long');
        //     }

        //     var map = L.map('mapid').setView([setLatitude,setLongitude], 13);
        //     // // add the OpenStreetMap tiles
        //     // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        //     // { subdomains: ['a', 'b', 'c'] })
        //     // .addTo(map);

        //     //open street map v2
        //     // var osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
        //     //     mqi = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png", {subdomains: ['otile1','otile2','otile3','otile4']});
        //     // var baseMaps = {
        //     //     "OpenStreetMap": osm,
        //     //     "MapQuestImagery": mqi
        //     // };
        //     // var overlays =  {//add any overlays here
        //     // };
        //     // L.control.layers(baseMaps,overlays, {position: 'bottomleft'}).addTo(map);

        //     // google map
        //     L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        //         maxZoom: 20,
        //         subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        //     }).addTo(map);
            
        //     var markerOptions = {
        //         title: "MyLocation",
        //         clickable: true,
        //         draggable: true
        //      }

        //     marker = L.marker([setLatitude,setLongitude], markerOptions).addTo(map);
        //     var popup = marker.bindPopup('<b>Hello world!</b><br />I am a popup.');

        //     // marker.setLatLng([setLatitude,setLongitude]);

        //     map.on('click', function(ev) {
        //         console.log(ev); // ev is an event object (MouseEvent in this case)
        //         setLatitude = ev.latlng.lat;
        //         setLongitude = ev.latlng.lng;

        //         console.log('lat lng', setLatitude,setLongitude);
        //         console.log('marker', marker);
        //         marker.setLatLng([setLatitude,setLongitude]).update();

        //         $('#latitude').val(setLatitude);
        //         $('#longitude').val(setLongitude);
        //     });

            // var map = L.map('mapid',{zoomControl:false }).setView([8.476834645946782, 124.64140181245084], 13);
            // mapG = map;
            // //Initialize google map
            // L.esri.basemapLayer("Imagery").addTo(map);
            // L.esri.basemapLayer('ImageryLabels').addTo(map);

            // //Initialize group for marker
            // var markerGroup = new L.layerGroup().addTo(map);
            // markGroup = markerGroup;

            // var markerOptions = {
            //     title: "MyLocation",
            //     clickable: true,
            //     draggable: true
            //  }

            // var marker = L.marker([8.476834645946782, 124.64140181245084], markerOptions).addTo(map);
            // var popup = marker.bindPopup('<b>Hello world!</b><br />I am a popup.');

            // map.on('click', function(ev) {
            //     alert(ev.latlng); // ev is an event object (MouseEvent in this case)
            // });
            
            // // search
            // map.addControl( new L.Control.Search({
            //     url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
            //     jsonpParam: 'json_callback',
            //     propertyName: 'display_name',
            //     propertyLoc: ['lat','lon'],
            //     marker: L.circleMarker([0,0],{radius:30}),
            //     autoCollapse: true,
            //     autoType: false,
            //     minLength: 5,position:'topleft'
            // }));
        // }});


        // var popup = L.popup()
        //     .setLatLng(8.476834645946782)
        //     .setContent('<p>Hello world!<br />This is a nice popup.</p>')
        //     .openOn(mapid);

        // $('#jqxwindow').jqxWindow({
        //     autoOpen:true,animationType:'none',height:'500px',width:'700px',resizable:false,theme:'metrodark',
        //     minHeight:'500px',minWidth:'700px',
        //     initContent: function () {
        //         console.log('init content');

        //         var mymap = L.map('mapid').setView([8.46982559076231, 124.66884933349614], 13);
        //         // add the OpenStreetMap tiles
        //         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        //         { subdomains: ['a', 'b', 'c'] })
        //         .addTo(mymap);
        //     }
        // }); 
    });

    $('#latitude').on('keyup', function() {
        console.log('latitude',$(this).val());

        // latlongOnChange({
        //     latitude: $(this).val()
        // });
        setLatitude = $(this).val();

        latlongOnChange();
    });

    $('#longitude').on('keyup', function() {
        console.log('longitude',$(this).val());

        // latlongOnChange({
        //     longitude: $(this).val()
        // });
        setLongitude = $(this).val();

        latlongOnChange();
    });



    /*************************************************************************************************************/
	// View Details
	/*************************************************************************************************************/
    $('#jqxwindow_details').jqxWindow({
        autoOpen:false,animationType:'none',height:'80%',width:'85%',resizable:false,theme:'metrodark',
        // minHeight:'500px',minWidth:'700px'
    });

    $('#jqxwindow_follow_up_form').jqxWindow({
        autoOpen:false,animationType:'none',height:'550px',width:'400px',resizable:false,theme:'metrodark'
    });

    $('#jqxwindow_responder_form').jqxWindow({
        autoOpen:false,animationType:'none',height:'550px',width:'400px',resizable:false,theme:'metrodark'
    });

    /****************************************************************
	// follow up grid
	*****************************************************************/
	$('#follow_up_grid').jqxGrid({
		width: '100%',height: '65%', theme:'metro',
		columns: gridColumn('follow_up_grid'),
		columnsresize: true,
		enablebrowserselection: true,
		enabletooltips: true,
		showfilterrow: true,
        selectionmode: 'none',
		columnsreorder: true,
		filterable: true,
		sortable: true,
		altrows: true,
		editable: false,
        showtoolbar: true,
        toolbarheight: 40,
        rendertoolbar: function (statusbar) {
			var container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");
			var followupbtn = $('<button type="button" class="btn btn-primary btn-sm">Follow-Up Call</button>');
			
            container.append(followupbtn);
			statusbar.append(container);

			followupbtn.click(function(){

                var row = $('#grid').jqxGrid('getselectedrowindex');
                var data = $('#grid').jqxGrid('getrowdata', row);
                console.log('data', data);

                // $('#fwu_call_date').val(moment(data.c_date).format('YYYY-MM-DD'));
                $('#fwu_call_time').val('');
                $('#fwu_call_origin').val('');

                $('#fwu_source_of_info').val('');
                $('#fwu_caller_name').val('');
                $('#fwu_caller_number').val('');

                $('#fwu_incident_location').val(data.incident_location);
                $('#fwu_latitude').val(data.latitude);
                $('#fwu_longitude').val(data.longitude);
                
                $('#fwu_details').val('');
                $("input:radio[name=fwu_case_status]:radio").prop('checked', false);
                $('#fwu_remarks').val('');

                $('#fwu_submit').attr('data-report-id',data.report_id);

                $('#jqxwindow_follow_up_form').jqxWindow('bringToFront');
                $('#jqxwindow_follow_up_form').jqxWindow('open');
			});
		}
	});

    /****************************************************************
	// responder grid
	*****************************************************************/
	$('#responder_grid').jqxGrid({
		width: '100%',height: '35%', theme:'metro',
		columns: gridColumn('responder_grid'),
		columnsresize: true,
		enablebrowserselection: true,
		enabletooltips: true,
		showfilterrow: true,
        selectionmode: 'none',
		columnsreorder: true,
		filterable: true,
		sortable: true,
		altrows: true,
		editable: false
	});

    $('#jqxwindow_details').on({
		close:function(event){
			$('#follow_up_grid').jqxGrid('clear');
            $('#responder_grid').jqxGrid('clear');

            $('#follow_up_grid').jqxGrid('clearselection');
            $('#responder_grid').jqxGrid('clearselection');
		}
	});

    $('#jqxwindow_follow_up_form').on({
		close:function(event){
            $('.err').remove();
	        $('.form-control').removeClass('err-input');
		}
	});

    $('#jqxwindow_responder_form').on({
		close:function(event){
            $('.err').remove();
	        $('.form-control').removeClass('err-input');
		}
	});


    // setTimeout(function(){
	// 	$('#firstloading').fadeOut(1000);
	// },1000);
    $('#firstloading').hide();
});


$(document).on({
    ajaxStart: function(){
        $("body").addClass("loading"); 
    },
    ajaxStop: function(){ 
        $("body").removeClass("loading"); 
    }    
});


function updateForm(doc){
    formAction = 'update';
    $("#submit").html("Update");
    
    console.log(doc);
    var action = doc.data('action');
    var row = doc.parent().data('row');
    var rdata = $('#grid').jqxGrid('getrowdata', row);
    console.log(action, rdata);
    
    if ( action == 'edit' ){
        update_id = rdata.report_id;
        response_sub_id = rdata.sub_id;
        
        // setting value in fields
        $('#call_date').val(moment(rdata.c_date).format('YYYY-MM-DD'));
        $('#call_time').val(rdata.c_time);
        $('#call_origin').val(rdata.call_origin);
        $('#source_of_info').val(rdata.source_of_info);
        $('#caller_name').val(rdata.caller_name);
        $('#caller_number').val(rdata.caller_number);
        
        $('#call_type').val(rdata.call_type).change();
        // $('#call_category').val(rdata.call_category);
        
        $('#incident_location').val(rdata.incident_location);
        $('#latitude').val(rdata.latitude);
        $('#longitude').val(rdata.longitude);
        $('#details').val(rdata.details);
        
        // response group
        $("#response_unit_fieldset").hide();
        // $("#response_unit").val(rdata.response_unit).change();
        // if ( rdata.response_unit == 'PNP' ){
        //     $('#pnp_response_unit').val(rdata.response_sub_unit).change();
        // }
        // else if ( rdata.response_unit == 'Others' || rdata.response_unit == 'Barangay' ){
        //     $('#others_response_unit').val(rdata.response_sub_unit).change();
        // }
        // $('#response_call_origin').val(rdata.response_call_origin);
        // $('#response_time').val(rdata.response_time);
        // // $("input:radio[name=acknowledge]:radio:first").prop('checked', true);
        // $('input:radio[name=acknowledge]').val([rdata.acknowledge]);
        // if ( rdata.acknowledge == 'Acknowledged' ){
        //     $('#acknowledge_by').val(rdata.acknowledge_by);
        //     $("#acknowledge_by").prop("disabled", false);
        // }
        // else{
        //     $('#acknowledge_by').val('');
        //     $("#acknowledge_by").prop("disabled", true);
        // }
        
        $('input:radio[name=case_status]').val([rdata.c_status]);
        // Referred from/to Central Dispatch
        if ( rdata.dispatch_id != null && rdata.dispatch_id != '' && ( rdata.dispatch_id != 0 || rdata.dispatch_id != '0' ) ){
            $('input:radio[name=ref_dispatch]').val(['Yes']);
            
            $('#caller_id').val(rdata.dispatch_id);
            $("#caller_id").prop("disabled", false);
        }
        else{
            $('input:radio[name=ref_dispatch]').val(['No']);

            $('#caller_id').val('');
            $("#caller_id").prop("disabled", true);
        }
        // $('input:radio[name=ref_dispatch]').val([rdata.acknowledge]);
        // $('#caller_id').val(rdata.dispatch_id); mag if else
        // $("#caller_id").prop("disabled", true);

        $('#remarks').val(rdata.remarks);
    }
}


function clearAll(){
    console.log('clear all');
    formAction = 'create';
    $("#submit").html("Create");

	//input type=datetime-local default current datetime
	$('#call_date').val(moment().format('YYYY-MM-DD'));

	//input type=text default blank
	$('#call_time,#call_origin,#source_of_info,#caller_name,#caller_number,#call_type,#call_category,#incident_location,#incident_location_datalist,#latitude,#longitude,#details').val('');

    //response group
    $('#response_unit').val('');
    $('#pnp_response_unit,#others_response_unit,#response_call_origin,#response_time').val('');
    $("input:radio[name=acknowledge]:radio").prop('checked', false);
    $('#acknowledge_by').val('');
    $("#acknowledge_by").prop("disabled", true);
    $("#response_unit_group").hide();
    
    $("input:radio[name=case_status]:radio").prop('checked', false);
    //Referred from/to Central Dispatch
    $("input:radio[name=ref_dispatch]:radio").prop('checked', false);
	$('#caller_id').val('');
    $("#caller_id").prop("disabled", true);

    $('#remarks').val('');

    $("#response_unit_fieldset").show();
}


function latlongOnChange(obj){
    console.log('latlongOnChange', setLatitude, setLongitude);

    // mapcenter.lat = setLatitude;
    // mapcenter.long = setLongitude;
    if ( setLatitude != '' && setLongitude != '' ) {
        marker.setLatLng([setLatitude,setLongitude]).update();
    }
}


function viewForm(doc){
    // console.log('view form', doc);
    // var action = doc.data('action');
    var row = doc.parent().data('row');
    var rdata = $('#grid').jqxGrid('getrowdata', row);
    // console.log(action, rdata);
    
    
    $('#jqxwindow_details_header h6').html(rdata.caller_name);
    $('#jqxwindow_details').jqxWindow('open');
    
    getViewDetailsData('follow_up_grid', {report_id: rdata.report_id});
    getViewDetailsData('responder_grid', {report_id: rdata.report_id});
}


function responderForm(doc, action){
    var row = doc.parent().data('row');
    var title = action === 'add' ? 'Add' : 'Edit';
    
    if(action === 'add'){
        var data = $('#follow_up_grid').jqxGrid('getrowdata', row);
        console.log('data', data);

        $("#rspdr_submit").html("Submit");
        $('#rspdr_submit').attr('data-report-id',data.report_id);
        $('#rspdr_submit').attr('data-update-id',null);
        $('#rspdr_submit').attr('data-form-action','add');

        $('#rspdr_response_unit').val('');
        $('#rspdr_pnp_response_unit').val('');
        $('#rspdr_others_response_unit').val('');

        $('#rspdr_response_call_origin').val('');
        $('#rspdr_response_time').val('');

        $("input:radio[name=rspdr_acknowledge]:radio").prop('checked', false);
        $('#rspdr_acknowledge_by').val('');
        $("#rspdr_acknowledge_by").prop( "disabled", true );
    }
    else if(action === 'edit'){
        var data = $('#responder_grid').jqxGrid('getrowdata', row);
        console.log('data', data);

        $("#rspdr_submit").html("Update");
        $('#rspdr_submit').attr('data-report-id',data.id);
        $('#rspdr_submit').attr('data-update-id',data.resp_id);
        $('#rspdr_submit').attr('data-form-action','edit');

        $('#rspdr_response_unit').val(data.response_unit).change();
        if ( data.response_unit == 'PNP' ) {
            $('#rspdr_pnp_response_unit').val(data.response_sub_unit);
        }
        else if ( data.response_unit == 'Others' || data.response_unit == 'Barangay' )  {
            $('#rspdr_others_response_unit').val(data.response_sub_unit);
        }

        $('#rspdr_response_call_origin').val(data.response_call_origin);
        $('#rspdr_response_time').val(data.response_time);

        $('input:radio[name=rspdr_acknowledge]').val([data.acknowledge]);
        if ( data.acknowledge == 'Acknowledged' ){
            $('#rspdr_acknowledge_by').val(data.acknowledge_by);
            $("#rspdr_acknowledge_by").prop("disabled", false);
        }
        else{
            $('#rspdr_acknowledge_by').val('');
            $("#rspdr_acknowledge_by").prop("disabled", true);
        }
    }

    $('#rspdr_submit').attr('data-report-id',data.report_id);

    $('#jqxwindow_responder_form').jqxWindow('setTitle', title+' Responder');
    $('#jqxwindow_responder_form').jqxWindow('bringToFront');
    $('#jqxwindow_responder_form').jqxWindow('open');
}


function getViewDetailsData(gridId, data){
    var _dataFields;

    switch(gridId){
        case 'follow_up_grid':
            _dataFields = [
                { name: 'report_id', type: 'int' },
                { name: 'follow_up_id', type: 'int' },
                { name: 'dispatch_id', type: 'int' },
                { name: 'c_date', type: 'date' },
                { name: 'c_time', type: 'string' },
                { name: 'call_origin', type: 'string' },
                { name: 'source_of_info', type: 'string' },
                { name: 'caller_name', type: 'string' },
                { name: 'caller_number', type: 'string' },
                { name: 'call_type', type: 'string' },
                { name: 'call_category', type: 'string' },
                { name: 'incident_location', type: 'string' },
                { name: 'details', type: 'string' },
                { name: 'remarks', type: 'string' },
                { name: 'c_status', type: 'string'},
                { name: 'latitude', type: 'string'},
                { name: 'longitude', type: 'string'},
                { name: 'modified_by', type: 'string'},
            ];
            break;
        case 'responder_grid':
            _dataFields = [
                { name: 'resp_id', type: 'int' },
                { name: 'id', type: 'int' },
                { name: 'response_unit', type: 'string'},
                { name: 'response_sub_unit', type: 'string'},
                { name: 'response_call_origin', type: 'string'},
                { name: 'response_time', type: 'string'},
                { name: 'acknowledge', type: 'string'},
                { name: 'acknowledge_by', type: 'string'},
                { name: 'modified_by', type: 'string'},
            ];
            break;
    }

    var source = {
        datatype: "json",
        datafields: _dataFields,
    };
    if(gridId == 'follow_up_grid'){
    	source['id'] = 'id';
    	source['url'] = BaseUrl()+'ajax/comcenter2/getFollowUpData';
    	source['type'] = 'POST';
        source['data'] = data;
    }
	else if(gridId == 'responder_grid'){
    	source['id'] = 'id';
    	source['url'] = BaseUrl()+'ajax/comcenter2/getAddResponderData';
    	source['type'] = 'POST';
        source['data'] = data;
    }
    
    var dataAdapter = new $.jqx.dataAdapter(source,{
        loadComplete: function(_records){
            // console.log(source,records);
        }
    });
    $('#'+gridId).jqxGrid({
        source:dataAdapter,
        // ready: function(){
        //     if ( gridId == 'nonDisposableGrid' ){
        //     }
        // },
    });

}


function gridColumn(gridID){
    var col = [];

    if(gridID == 'follow_up_grid'){
        col = [
            { text: '', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,editable:false,pinned:true,sortable:false,menu:false,
                cellsrenderer: function (row, _column, _value) {
                    return '<div class="jqx-grid-cell-middle-align" style="margin-top:8px;" data-row="'+row+'"><i class="grid-cell-icon mdi mdi-plus-circle-outline action-btns" data-action="view" id="add_responder" title="Add Responder"></i></div>';
                }
            },
            { text: 'ID', datafield: 'report_id', cellsalign:'center', align:'center', width: '60px', editable: false, pinned: true },
            { text: 'Date',  datafield: 'c_date', align:'center', cellsalign:'center', filtertype: 'date', cellsformat: 'yyyy-MM-dd', width: '90px' },
            { text: 'Time', datafield: 'c_time', cellsalign:'center', align:'center', width: '80px' },
            { text: 'Memory of Call', datafield: 'call_origin', align:'center', cellsalign:'center', width: '100px', filtertype:'checkedlist', filteritems: ['Radio', 'Telephone', 'Walk-in', 'CDRRMD'], columntype:'dropdownlist',
                createeditor: function (_row, _value, editor) {
                    editor.jqxDropDownList({ source: ['Radio', 'Telephone', 'Walk-in', 'CDRRMD'] });
                }
            },
            { text: 'Caller\'s Name', datafield: 'caller_name', align:'center', cellsalign:'center', width: '120px' },
            { text: 'Contact', datafield: 'caller_number', cellsalign:'center', align:'center', width: '80px' },
            { text: 'Call Type', datafield: 'call_type', cellsalign:'center', align:'center', filtertype:'checkedlist', filteritems: call_type_list, width: '100px', editable:false },
            { text: 'Incident Location', datafield: 'incident_location', cellsalign:'center', align:'center', minwidth: '100px', editable: false },
            { text: 'Details', datafield: 'details', cellsalign:'center', align:'center', minwidth: '100px' },
            { text: 'Remarks', datafield: 'remarks', cellsalign:'center', align:'center', minwidth: '100px' },
            { text: 'Status', datafield: 'c_status', cellsalign:'center', align:'center', minwidth: '100px', filtertype:'checkedlist', filteritems: ['Noted', 'Responded', 'Disregard'], columntype:'dropdownlist',
                createeditor: function (_row, _value, editor) {
                    editor.jqxDropDownList({ source: ['Noted', 'Responded', 'Disregard'] });
                }
            },
            { text: 'Modified By', datafield: 'modified_by', align:'center', cellsalign:'center', editable:false, width: '90px' }
        ];
    }
    else if(gridID == 'responder_grid'){
        col = [
            { text: '', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,editable:false,pinned:true,sortable:false,menu:false,
                cellsrenderer: function (row, _column, _value) {
                    return '<div class="jqx-grid-cell-middle-align" style="margin-top:8px;" data-row="'+row+'"><i class="grid-cell-icon mdi mdi-file-document-edit-outline action-btns" data-action="edit" id="update_responder_form" title="Edit"></i></div>';
                }
            },
            { text: 'ID', datafield: 'id', cellsalign:'center', align:'center', width: '60px', editable: false, pinned: true },
            { text: 'Unit',  datafield: 'response_unit', align:'center', cellsalign:'center', width: '120px', filtertype:'checkedlist', filteritems: response_unit_list, columntype:'dropdownlist',
                createeditor: function (_row, _value, editor) {
                    editor.jqxDropDownList({ source: response_unit_list });
                }
            },
            { text: 'Responder', datafield: 'response_sub_unit', cellsalign:'center', align:'center', width: '100px' },
            { text: 'Call Origin', datafield: 'response_call_origin', align:'center', cellsalign:'center', width: '100px', filtertype:'checkedlist', filteritems: ['Radio', 'Telephone', 'Walk-in', 'CDRRMD'], columntype:'dropdownlist',
                createeditor: function (_row, _value, editor) {
                    editor.jqxDropDownList({ source: ['Radio', 'Telephone', 'Walk-in', 'CDRRMD'] });
                }
            },
            { text: 'Time of Call',  datafield: 'response_time', align:'center', cellsalign:'center', width: '80px' },
            { text: 'Status', datafield: 'acknowledge', cellsalign:'center', align:'center', width: '130px', filtertype:'checkedlist', filteritems: ['Acknowledged', 'Negative Acknowledge'], columntype:'dropdownlist',
                createeditor: function (_row, _value, editor) {
                    editor.jqxDropDownList({ source: ['Acknowledged', 'Negative Acknowledge'] });
                }
            },
            { text: 'Received By', datafield: 'acknowledge_by', cellsalign:'center', align:'center', minWidth: '100px' },
            { text: 'Modified By', datafield: 'modified_by', align:'center', cellsalign:'center', editable:false, width: '90px' },
            { datafield: 'resp_id', hidden:true }
        ];
    }

    return col;
}


function GetData(type){
	type = (type == undefined)?'default':'filtered';
	var mdt = moment().format('YYYY-MM-DD');
    console.log(type,fdt,mdt);
	$('#grid').jqxGrid('showloadelement');
	var source =
    {
        datafields:
        [
            // comm
            { name: 'report_id', type: 'int' },
            { name: 'follow_up_id', type: 'int' },
            { name: 'dispatch_id', type: 'int' },
            { name: 'c_date', type: 'date' },
            { name: 'c_time', type: 'string' },
            { name: 'call_origin', type: 'string' },
            { name: 'source_of_info', type: 'string' },
            { name: 'caller_name', type: 'string' },
            { name: 'caller_number', type: 'string' },
            { name: 'call_type', type: 'string' },
            { name: 'call_category', type: 'string' },
            { name: 'incident_location', type: 'string' },
            { name: 'details', type: 'string' },
            { name: 'remarks', type: 'string' },
            { name: 'c_status', type: 'string'},
            { name: 'latitude', type: 'string'},
            { name: 'longitude', type: 'string'},
            { name: 'modified_by', type: 'string'},
            
            // response_unit
            // { name: 'sub_id', type: 'int' },
            // { name: 'response_unit', type: 'string'},
            // { name: 'response_sub_unit', type: 'string'},
            // { name: 'response_call_origin', type: 'string'},
            // { name: 'response_time', type: 'string'},
            // { name: 'acknowledge', type: 'string'},
            // { name: 'acknowledge_by', type: 'string'},
        ],
        datatype: "json",
        url:BaseUrl()+'ajax/comcenter2/getData',
        type:'POST',
        data:{ fdt:fdt, tdt:tdt, type:type },
        filter: function () {
            // update the grid and send a request to the server.
            $("#grid").jqxGrid('updatebounddata', 'filter');
        }
    };
    var dataAdapter = new $.jqx.dataAdapter(source,{
    	loadComplete: function (records) {
    		// console.log('record', records);
    	}
    });
    $('#grid').jqxGrid({source: dataAdapter});
}


function hideResponseUnitELements() {
    $("#response_unit_group").hide();

    $("#rspdr_pnp_response_unit_fieldset").hide();
    $("#rspdr_others_response_unit_fieldset").hide();
}


function submitForm(){
	var uid = parseInt($('#versplit').data('uid'));console.log(uid);
    var utype = $('#versplit').data('utype');console.log(utype);

    if(uid === undefined){
        alert('Session expired. Please re-login. Thank you!');
        location.reload();
        return false;
    }

    // fields
    var call_date = $('#call_date').val(),
    call_time = $('#call_time').val(),
    call_origin = $('#call_origin').val(),
    source_of_info = $('#source_of_info').val(),
    caller_name = $('#caller_name').val(),
    caller_number = $('#caller_number').val(),

    call_type = $('#call_type').val(),
    call_category = $('#call_category').val(),

    incident_location = $('#incident_location').val(),
    latitude = $('#latitude').val(),
    longitude = $('#longitude').val(),
    details = $('#details').val(),

    //responder
    response_unit = $('#response_unit').val(),
    pnp_response_unit = $('#pnp_response_unit').val(),
    others_response_unit = $('#others_response_unit').val(),
    response_call_origin = $('#response_call_origin').val(),
    response_time = $('#response_time').val(),
    acknowledge = $('input[name="acknowledge"]:checked').val(),
    acknowledge_by = $('#acknowledge_by').val(),

    case_status = $('input[name="case_status"]:checked').val(),
    
    ref_dispatch = $('input[name="ref_dispatch"]:checked').val(),
    caller_id = $('#caller_id').val(),
    
    remarks = $('#remarks').val();

    // fields

	$('.err').remove();
	$('.form-control').removeClass('err-input');

	// validate form input fields
    var errmsg = [];

    if($.trim(call_date) == ''){errmsg.push({elemid:'call_date',msg:'Empty'});}
    if($.trim(call_time) == ''){errmsg.push({elemid:'call_time',msg:'Empty'});}
    if($.trim(call_origin) == ''){errmsg.push({elemid:'call_origin',msg:'Empty'});}
    if($.trim(source_of_info) == ''){errmsg.push({elemid:'source_of_info',msg:'Empty'});}
    if($.trim(caller_name) == ''){errmsg.push({elemid:'caller_name',msg:'Empty'});}
    if($.trim(caller_number) == ''){errmsg.push({elemid:'caller_number',msg:'Empty'});}

    if($.trim(call_type) == ''){errmsg.push({elemid:'call_type',msg:'Empty'});}

    if($.trim(incident_location) == ''){errmsg.push({elemid:'incident_location',msg:'Empty'});}
    if($.trim(latitude) == ''){errmsg.push({elemid:'latitude',msg:'Empty'});}
    if($.trim(longitude) == ''){errmsg.push({elemid:'longitude',msg:'Empty'});}
    if($.trim(details) == ''){errmsg.push({elemid:'details',msg:'Empty'});}

    // if($.trim(response_unit) == ''){errmsg.push({elemid:'response_unit',msg:'Empty'});}
    if($.trim(response_unit) == 'PNP' && $.trim(pnp_response_unit) == ''){errmsg.push({elemid:'pnp_response_unit',msg:'Empty'});}
    if( ( $.trim(response_unit) == 'Others' || $.trim(response_unit) == 'Barangay' ) && $.trim(others_response_unit) == ''){errmsg.push({elemid:'others_response_unit',msg:'Empty'});}
    if( ( $.trim(response_unit) != 'NONE' && $.trim(response_unit) != '' ) && $.trim(response_call_origin) == ''){errmsg.push({elemid:'response_call_origin',msg:'Empty'});}
    if( ( $.trim(response_unit) != 'NONE' && $.trim(response_unit) != '' ) && $.trim(response_time) == ''){errmsg.push({elemid:'response_time',msg:'Empty'});}
    if( ( $.trim(response_unit) != 'NONE' && $.trim(response_unit) != '' ) && $.trim(acknowledge) == ''){errmsg.push({elemid:'acknowledge_field_group',msg:'Empty'});}
    if( ( $.trim(response_unit) != 'NONE' && $.trim(response_unit) != '' ) && acknowledge == 'Acknowledged' && $.trim(acknowledge_by) == ''){errmsg.push({elemid:'acknowledge_by',msg:'Empty'});}
    
    if($.trim(case_status) == ''){errmsg.push({elemid:'case_status_field_group',msg:'Empty'});}

    if($.trim(ref_dispatch) == ''){errmsg.push({elemid:'ref_dispatch_field_group',msg:'Empty'});}
    if(ref_dispatch == 'Yes' && $.trim(caller_id) == ''){errmsg.push({elemid:'caller_id',msg:'Empty'});}

    if($.trim(remarks) == ''){errmsg.push({elemid:'remarks',msg:'Empty'});}
    // validate form input fields


	if(errmsg.length > 0){
		$.each(errmsg,function(i,e){

            $('label[for='+e.elemid+']').append('<small style="color:red" class="err"> ('+e.msg+')</small>');
            $('#'+e.elemid).addClass('err-input');
        });
        $('#'+errmsg[0].elemid).focus();
        $('#frmPanel').jqxPanel('scrollTo', $('#'+errmsg[0].elemid).offset().top, 0);
	}else{
		console.log('data entry form sending data!');
        // sub unit
        sub_unit = 'N/A';
        if ( response_unit == 'PNP' ) {
            sub_unit = pnp_response_unit;
        }
        else if ( response_unit == 'Others' || response_unit == 'Barangay' )  {
            sub_unit = others_response_unit;
        }

        var data = {
            // for update
            update_id: update_id,
            uid: uid,
            response_sub_id: response_sub_id,
            // for update

            Dispatch_ID: caller_id,

            // for comm
            date: call_date,
            time: call_time,
            memory_of_call: call_origin,
            icv: source_of_info,
            caller_name: caller_name,
            contact: caller_number,
            call_category: call_category,
            case_type: call_type,
            location: incident_location,
            case_particular: details,
            remarks: remarks,
            Status: case_status,
            Latitude: latitude,
            Longitude: longitude   
        }
        console.log('save update data', data);

        // create or update data
        var ajaxAction = '';
        if( formAction == 'create' ){
            ajaxAction = 'saveData';

            // for response_unit
            data.unit = response_unit;
            data.Sub_unit = sub_unit; // pnp_response_unit, others_response_unit, N/A
            data.Call_origin = response_call_origin;
            data.time_call = response_time;
            data.acknowledge = acknowledge; // acknowledged or not
            data.receive_by = acknowledge_by;
        }
        else if ( formAction == 'update' ){
            ajaxAction = 'updateData';
        }

        bootbox.confirm({
            title:'Confirm',
            size:'mini',
            message: 'Confirm saving.',
            callback: function(r){
                
                // console.log(r, data);
                if(r){
                    // add loading
                    // $('.custom.form').addClass('loading');
                    $.ajax({
                        url: BaseUrl()+'ajax/comcenter2/'+ajaxAction,
                        async: true,
                        data: data,
                        method: 'POST',
                        success: function(data){
                            console.log(data)

                            $('#frmPanel').jqxPanel('scrollTo', 0, 0);
                            var filtersinfo = $('#grid').jqxGrid('getfilterinformation');
                            console.log('filtersinfo', filtersinfo);

                            if(filtersinfo.length != 0){
                                $('#grid').jqxGrid('updatebounddata','cells');
                            }else{
                                // $('#grid').jqxGrid('updatebounddata','data');
                                if(update_id === undefined){
                                    $('#grid').jqxGrid('updatebounddata','data');
                                }else{
                                    $('#grid').jqxGrid('updatebounddata','cells');
                                }
                            }

                            clearAll();
                        },
                        error: function(jqXHR,textStatus,errorThrown ){
                            console.log(errorThrown);
                        },
                        complete: function(jqXHR,textStatus){
                            // $('.custom.form').removeClass('loading');
                        }
                    });
                }
                
            }
        });
	}
}

function submitFollowUpForm(doc){
	var uid = parseInt($('#versplit').data('uid'));;console.log(uid);
    var utype = $('#versplit').data('utype');console.log(utype);

    if(uid === undefined){
        alert('Session expired. Please re-login. Thank you!');
        location.reload();
        return false;
    }

    // fields
    var report_id = $(doc).attr('data-report-id'),
    call_date = $('#fwu_call_date').val(),
    call_time = $('#fwu_call_time').val(),
    call_origin = $('#fwu_call_origin').val(),
    source_of_info = $('#fwu_source_of_info').val(),
    caller_name = $('#fwu_caller_name').val(),
    caller_number = $('#fwu_caller_number').val(),

    call_type = $('#fwu_call_type').val(),
    call_category = $('#fwu_call_category').val(),

    incident_location = $('#fwu_incident_location').val(),
    latitude = $('#fwu_latitude').val(),
    longitude = $('#fwu_longitude').val(),
    details = $('#fwu_details').val(),

    case_status = $('input[name="fwu_case_status"]:checked').val(),
    remarks = $('#fwu_remarks').val();

    // fields

	$('.err').remove();
	$('.form-control').removeClass('err-input');

	// validate form input fields
    var errmsg = [];

    if($.trim(call_date) == ''){errmsg.push({elemid:'fwu_call_date',msg:'Empty'});}
    if($.trim(call_time) == ''){errmsg.push({elemid:'fwu_call_time',msg:'Empty'});}
    if($.trim(call_origin) == ''){errmsg.push({elemid:'fwu_call_origin',msg:'Empty'});}
    if($.trim(source_of_info) == ''){errmsg.push({elemid:'fwu_source_of_info',msg:'Empty'});}
    if($.trim(caller_name) == ''){errmsg.push({elemid:'fwu_caller_name',msg:'Empty'});}
    if($.trim(caller_number) == ''){errmsg.push({elemid:'fwu_caller_number',msg:'Empty'});}

    if($.trim(details) == ''){errmsg.push({elemid:'fwu_details',msg:'Empty'});}
    
    if($.trim(case_status) == ''){errmsg.push({elemid:'fwu_case_status_field_group',msg:'Empty'});}
    if($.trim(remarks) == ''){errmsg.push({elemid:'fwu_remarks',msg:'Empty'});}
    // validate form input fields


	if(errmsg.length > 0){
		$.each(errmsg,function(i,e){

            $('label[for='+e.elemid+']').append('<small style="color:red" class="err"> ('+e.msg+')</small>');
            $('#'+e.elemid).addClass('err-input');
        });
        $('#'+errmsg[0].elemid).focus();
        $('#follow_up_form').jqxPanel('scrollTo', $('#'+errmsg[0].elemid).offset().top, 0);
	}else{
		console.log('data entry form sending data!');

        var data = {
            report_id: report_id,
            uid: uid,

            // for comm
            date: call_date,
            time: call_time,
            memory_of_call: call_origin,
            icv: source_of_info,
            caller_name: caller_name,
            contact: caller_number,
            case_type: call_type,
            call_category: call_category,
            location: incident_location,
            Latitude: latitude,
            Longitude: longitude,
            case_particular: details,

            Status: case_status,
            remarks: remarks
        }

        bootbox.confirm({
            title:'Confirm',
            size:'mini',
            message: 'Confirm saving.',
            callback: function(r){
                if(r){
                    $.ajax({
                        url: BaseUrl()+'ajax/comcenter2/saveFollowUpData',
                        async: true,
                        data: data,
                        method: 'POST',
                        success: function(data){
                            // console.log(data);
                            if(data){
                                // refresh/update grid data
                                $("#follow_up_grid").jqxGrid('updatebounddata', 'data');
                                $("#grid").jqxGrid('updatebounddata');
                            }

                            $('#jqxwindow_follow_up_form').jqxWindow('close');
                        },
                        error: function(jqXHR,textStatus,errorThrown ){
                            console.log(errorThrown);
                        },
                        complete: function(jqXHR,textStatus){
                            // $('.custom.form').removeClass('loading');
                        }
                    });
                }
                
            }
        });
	}
}

function submitResponderForm(doc){
	var uid = parseInt($('#versplit').data('uid'));;console.log(uid);
    var utype = $('#versplit').data('utype');console.log(utype);

    if(uid === undefined){
        alert('Session expired. Please re-login. Thank you!');
        location.reload();
        return false;
    }

    // fields
    var report_id = $(doc).attr('data-report-id'),
    update_id = $(doc).attr('data-update-id'),
    form_action = $(doc).attr('data-form-action'),

    response_unit = $('#rspdr_response_unit').val(),
    pnp_response_unit = $('#rspdr_pnp_response_unit').val(),
    others_response_unit = $('#rspdr_others_response_unit').val(),
    response_call_origin = $('#rspdr_response_call_origin').val(),
    response_time = $('#rspdr_response_time').val(),
    acknowledge = $('input[name="rspdr_acknowledge"]:checked').val(),
    acknowledge_by = $('#rspdr_acknowledge_by').val();

    // fields

	$('.err').remove();
	$('.form-control').removeClass('err-input');

	// validate form input fields
    var errmsg = [];

    if($.trim(response_unit) == ''){errmsg.push({elemid:'rspdr_response_unit',msg:'Empty'});}
    if($.trim(response_unit) == 'PNP' && $.trim(pnp_response_unit) == ''){errmsg.push({elemid:'rspdr_pnp_response_unit',msg:'Empty'});}
    if( ( $.trim(response_unit) == 'Others' || $.trim(response_unit) == 'Barangay' ) && $.trim(others_response_unit) == ''){errmsg.push({elemid:'rspdr_others_response_unit',msg:'Empty'});}
    if( $.trim(response_call_origin) == ''){errmsg.push({elemid:'rspdr_response_call_origin',msg:'Empty'});}
    if( $.trim(response_time) == ''){errmsg.push({elemid:'rspdr_response_time',msg:'Empty'});}
    if( $.trim(acknowledge) == ''){errmsg.push({elemid:'rspdr_acknowledge_field_group',msg:'Empty'});}
    if( acknowledge == 'Acknowledged' && $.trim(acknowledge_by) == ''){errmsg.push({elemid:'rspdr_acknowledge_by',msg:'Empty'});}
    
    // validate form input fields


	if(errmsg.length > 0){
		$.each(errmsg,function(i,e){

            $('label[for='+e.elemid+']').append('<small style="color:red" class="err"> ('+e.msg+')</small>');
            $('#'+e.elemid).addClass('err-input');
        });
        $('#'+errmsg[0].elemid).focus();
        $('#responder_form').jqxPanel('scrollTo', $('#'+errmsg[0].elemid).offset().top, 0);
	}else{
        var sub_unit = 'N/A';
        if ( response_unit == 'PNP' ) {
            sub_unit = pnp_response_unit;
        }
        else if ( response_unit == 'Others' || response_unit == 'Barangay' )  {
            sub_unit = others_response_unit;
        }

        var formAction = '';
        if(form_action == 'add'){
            formAction = 'saveAddResponderData';
        }
        else if(form_action == 'edit'){
            formAction = 'updateAddResponderData';
        }

        var data = {
            update_id: update_id,
            report_id: report_id,
            uid: uid,

            // for response_unit
            unit: response_unit,
            Sub_unit: sub_unit, // pnp_response_unit, others_response_unit, N/A
            Call_origin: response_call_origin,
            time_call: response_time,
            acknowledge: acknowledge, // acknowledged or not
            receive_by: acknowledge_by
        }

        bootbox.confirm({
            title:'Confirm',
            size:'mini',
            message: 'Confirm saving.',
            callback: function(r){
                if(r){
                    $.ajax({
                        url: BaseUrl()+'ajax/comcenter2/'+formAction,
                        async: true,
                        data: data,
                        method: 'POST',
                        success: function(data){
                            // console.log(data);
                            if(data){
                                // refresh/update grid data
                                $("#responder_grid").jqxGrid('updatebounddata', 'data');
                            }

                            $('#jqxwindow_responder_form').jqxWindow('close');
                        },
                        error: function(_jqXHR,_textStatus,errorThrown ){
                            console.log(errorThrown);
                        },
                        complete: function(_jqXHR,_textStatus){
                            // $('.custom.form').removeClass('loading');
                        }
                    });
                }
                
            }
        });
	}
}

function getUsers(){
	$.ajax({
		url:BaseUrl()+'ajax/comcenter2/getUsers',
		async:true,
		method:'GET',
		success:function(data){
			if(IsJsonString(data)){
				var obj = JSON.parse(data);

				var get_name_list = _.map(obj,'email');
				users_list = get_name_list;
				$('#grid').jqxGrid('setcolumnproperty', 'modified_by', 'filteritems', users_list);
			}else{
				console.log(data)
				alert('Something went wrong while trying to fetch user list');
			}
		},
		error:function(_jqXHR,_textStatus,errorThrown ){
			console.log(errorThrown);
		}
	});
}

function callCategoryOnChange(x) {
    var result = '';

    if(x == "Alarm" || x=="Assault" || x=="Bomb Threat"|| x == "Burglary" || x == "Carnapping" 
        || x == "Child Abuse" || x == "Curfew Violation"
        || x == "Dead Body" || x == "Death Threat" || x == "Demolition" || x == "Domestic Problem"
        || x == "Drag Racing" || x == "Drill" || x == "Drugs" || x == "Explosion"
        || x == "Extortion" || x == "Found Items" || x == "Found Person" || x == "Harassment"
        || x == "Hit and Run" || x == "Hostage Taking" || x == "Illegal Activities" || x == "Intoxicated Pedestrian"
        || x == "Kidnapping" || x == "Land Dispute" || x == "Lost items" || x == "Loud Reports"
        || x == "Mental Case" || x == "Missing Person" || x == "Missing/Lost and Found" || x == "Noise Complaint"
        || x == "Prowler" || x == "Rape" || x == "Riot" || x == "Robbery"
        || x == "Sexual Harrasment" || x == "Shooting Incident" || x == "Smoking Violation" || x == "Stabbing"
        || x == "Stoning" || x == "Suicide" || x == "Suspicious Circumstance" || x == "Swindling"
        || x == "Theft" || x == "Trespassing" || x == "Vehicular Accident" || x == "Vehicular Accident with Patient"
        || x == "Weapons"){
        
        result = 'Law Enforcement';
    }
    
    else if(x == "Public Disturbance" || x == "Animal Case" || x == "Drowning"
        || x == "Flood" || x == "Landslide" || x == "Structural Collapse" || x == "Trapped"
        || x == "Electrical" || x == "Water" || x == "Earthquake" || x == "Chemical Emergencies"){
        
        result = 'Rescue';
    }
    
    else if(x == "Medical" || x == "Medical Transport" || x == "Trauma"){
        result = 'Medical Emergencies';
    }
    
    else if(x == "Test Call" ||x == "Inquiry" ||x == "Follow-Up Call" ||x == "Alarm Test" ||x == "Outside CDO Boundary"
        || x == "Administrative" ||x == "Fogging" ||x == "Rain" ||x == "Hang-up/Non-sense"||x == "Weather Update"
        || x == "Information"){
        
        result = 'Other Calls';
    }
       
    else if(x == "Fire" ||x == "Commercial Fire" ||x == "Electrical Fire" ||x == "Grass Fire" ||x == "Residential Fire"
        ||x == "Rubbish Fire" ||x == "Vehicular Fire"){
        
        result = 'Fire';
    }
       
   return result;
}