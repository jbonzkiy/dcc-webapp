var elemByType = {status:'stat_grid',vehicle:'vinfo_grid',driver:'dinfo_grid',activity:'ainfo_grid'},
VEHICLES = [];

$(function(){
	console.log('ok (~˘▾˘)~');
	fetchVehicles();
	
	$('.ui.checkbox').checkbox();
	$('select.dropdown').dropdown();
	// $('.coupled.modal').modal({allowMultiple: false});
	$("#statColorPicker").spectrum({
		preferredFormat: "hex",
		color: "#000000",showInput: true,
		showPalette: true,
		showPaletteOnly: true,
	    togglePaletteOnly: true,
	    togglePaletteMoreText: 'More',
	    togglePaletteLessText: 'Less',
	    hideAfterPaletteSelect:true,
	    showInitial: true
	});
	//initialize jqxwidget
	var vgrid_opt = {width:'100%',height:170,
	selectionmode: 'singlerow',theme:'fresh',autorowheight:false,autoheight:false
	};

	var stat_grid = vgrid_opt;
		stat_grid['columns'] = gridColumns('stat');
	$('#stat_grid').jqxGrid(stat_grid);

	var dinfo_grid = vgrid_opt;
		dinfo_grid['columns'] = gridColumns('dinfo');
	$('#dinfo_grid').jqxGrid(dinfo_grid);

	var vinfo_grid = vgrid_opt;
		vinfo_grid['columns'] = gridColumns('vinfo');
	$('#vinfo_grid').jqxGrid(vinfo_grid);

	var ainfo_grid = vgrid_opt;
		ainfo_grid['columns'] = gridColumns('ainfo');
		ainfo_grid['ready'] = function(){
			source({type:'status',action:'load'});
			source({type:'driver',action:'load'});
			source({type:'vehicle',action:'load'});
			source({type:'activity',action:'load'});
		}
	$('#ainfo_grid').jqxGrid(ainfo_grid);

	//open model for adding new entry
	$('.add-new-btn').click(function(){
		var type = $(this).data('type');
		$('#entryformTitle').text('Add new '+type+' form');
		$('.btn-save-entry').attr('data-type',type);
		$('.ui.form').hide();
		$('.ui.form[data-type='+type+']').show();
		$('.ui.modal[data-type=entryform]').modal({closable:false,onHidden:function(){resetForm();}}).modal('show');

	});

	//save button event for modal
	$('.btn-save-entry').click(function(){
		var type = $(this).attr('data-type');
		var d = {}, haserror = false, err = [];
		$('#errmsg').hide();
		$('#errlst').empty();
		// console.log(type)
		switch(type){
			case 'status':
				// $('.ui.modal[data-type='+type+']').modal('show');
				var stat_name = $('#stat_name').val(),
				color = $('#statColorPicker').spectrum('get').toHexString(),
				desc = $('#stat_desc').val(), isActive = ($('.isActive[data-type='+type+']').prop('checked')?1:0),
				id = $('.btn-save-entry[data-type='+type+']').attr('data-id');
				id = (id == undefined)?0:parseInt(id);
				var action = (id == 0)?'add':'edit';
				d = {type:type,action:action,name:stat_name,color:color,desc:desc,active:isActive,sid:id};
				if($.trim(stat_name) == ''){
					err.push('<li>Please input the name of status.</li>');
				}
				break;
			case 'vehicle':
				var vname = $('#vehicle_name').val(),
				vtype = $('#vehicle_type').val(),
				vpnum = $('#vehicle_plate_num').val(),
				vremarks = $('#vehicle_remarks').val(),
				isActive = ($('.isActive[data-type='+type+']').prop('checked')?1:0);
				id = $('.btn-save-entry[data-type='+type+']').attr('data-id');
				id = (id == undefined)?0:parseInt(id);
				var action = (id == 0)?'add':'edit';
				d = {type:type,action:action,name:vname,vtype:vtype,pnum:vpnum,remarks:vremarks,active:isActive,vid:id};
				if($.trim(vname) == ''){
					err.push('<li>Please input the name of vehicle.</li>');
				}
				break;
			case 'driver':
				var isActive = ($('.isActive[data-type='+type+']').prop('checked')?1:0),
				dname = $('#dname').val(),
				dnum = $('#dnum').val(),
				vass = $('#vass').val(),
				id = $('.btn-save-entry[data-type='+type+']').attr('data-id');
				id = (id == undefined)?0:parseInt(id);
				var action = (id == 0)?'add':'edit';
				d = {type:type,action:action,name:dname,num:dnum,vass:JSON.stringify(vass),active:isActive,did:id};
				if($.trim(dname) == ''){
					err.push('<li>Please input the name of driver.</li>');
				}
				if(vass.length == 0){
					err.push('<li>Please select at least one assigned vehicle.</li>');
				}
				break;
			case 'activity':
				var isActive = ($('.isActive[data-type='+type+']').prop('checked')?1:0),
				aname = $('#aname').val(),
				route = $('#route').val(),
				resperson = $('#resperson').val(),
				vact = $('#vact').val(),
				id = $('.btn-save-entry[data-type='+type+']').attr('data-id');
				id = (id == undefined)?0:parseInt(id);
				var action = (id == 0)?'add':'edit';
				d = {type:type,action:action,activity:aname,route:route,resperson:resperson,vehicle:JSON.stringify(vact),active:isActive,eid:id};
				if($.trim(aname) == ''){
					err.push('<li>Please input the name of activity.</li>');
				}
				if(vact.length == 0){
					err.push('<li>Please select at least one vehicle.</li>');
				}
				break;
		}
		if(err.length == 0){
			var r = confirm('Confirm '+(id == 0?'adding':'updating')+' of '+type+'.');
			if(r){
				submitData(d);
			}
		}else{
			$('#errlst').html(err.join(' '));
			$('#errmsg').show();
			$('.scrolling.content').animate({ scrollTop: 0 }, 'fast');
		}

		console.log(d);
	});


	//editing data from grid
	gridEvent('status');
	gridEvent('vehicle');
	gridEvent('driver');
	gridEvent('activity');

	populateAssignedVehicle();

});

function submitData(d){
	loading(true);
	$.ajax({
		url:BaseUrl()+'ajax/vehicle/action',
		async:true,
		data:d,
		method:'POST',
		success:function(data){
			// console.log(data);
			if($.trim(data) == 'SUCCESS'){
				if(d.action == 'add'){
					resetForm(d.type);
				}else{
					$('.ui.modal[data-type=entryform]').modal('hide');
				}
				if(d.type == 'vehicle'){fetchVehicles();populateAssignedVehicle();}
				$('#'+elemByType[d.type]).jqxGrid('updatebounddata');
			}
			
			loading(false);
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			loading(false);
		}
	});
	
}

function loading(bool){
	if(bool){
		$('#stat_loading>div').removeClass('green');
		$('#stat_loading>div i').removeClass('check circle outline');
		$('#stat_loading>div i').addClass('circle notch loading');
		$('#stat_loading>div span').text('SUBMITTING...');
		$('#stat_loading').show();
	}else{
		$('#stat_loading>div').addClass('green');
		$('#stat_loading>div i').removeClass('circle notch loading');
		$('#stat_loading>div i').addClass('check circle outline');
		$('#stat_loading>div span').text('SUCCESS!!!');
		setTimeout(function(){$('#stat_loading').hide();},600);
	}
}

function gridColumns(type){
	var col = [];
	switch(type){
		case 'vstat':
			col = [
				{text: 'STATUS', width: 100 },
				{text: 'VEHICLE NAME', width: 100 },
				{text: 'VEHICLE TYPE', width: 100 },
				{text: 'PLATE NUMBER', width: 100 },
				{text: 'ASSIGNED DRIVER', width: 200 },
				{text: 'ASSISTANT', width: 200 },
				{text: 'SCHEDULED ROUTE' }
			];
			break;
		case 'vlog':
			col = [
				{text: 'DATE/TIME', width: 100 },
				{text: 'VEHICLE', width: 100 },
				{text: 'LOCATION', width: 300 },
				{text: 'REMARKS' }
			];
			break;
		case 'ainfo':
			col = [
				{text: 'ACTIVITY', width: 150,datafield: 'activity' },
				{text: 'ROUTE', width: 100,datafield: 'route' },
				{text: 'VEHICLE', width: 100,datafield: 'vehicle',cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
					var vidArr = JSON.parse(value);
					var caropt = [];
					$.each(vidArr,function(i,e){
						var car = _.map(VEHICLES, function(o) {if (o.vid == e) return o;});
						car = _.without(car, undefined);
						caropt.push(car[0].name);
					});	
					caropt.sort();
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+caropt.join(', ')+'</div>';
				}},
				{text: 'REPONSIBLE PERSON',datafield: 'responsible_person' },
				{text: 'ACTIVE', width: 60, datafield: 'active', cellsalign:'center',cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;"><i class="'+(value == 1?'check green':'times red')+' icon" style="color:'+value+';"></i></div>';
				}},
				{datafield: 'eid',hidden:true}
			];
			break;
		case 'stat':
			col = [
				{text: 'NAME', width: 100,datafield: 'name' },
				{text: 'DESCRIPTION',datafield: 'description'},
				{text: 'COLOR', width: 85,datafield: 'color',cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
					
					return '<div class="" style="margin-top: 8px;"><i class="square full icon" style="color:'+value+';"></i>'+value+'</div>';
				}},
				{text: 'ACTIVE', width: 60, datafield: 'active', cellsalign:'center',cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;"><i class="'+(value == 1?'check green':'times red')+' icon" style="color:'+value+';"></i></div>';
				}},
				{datafield: 'sid',hidden:true}
			];
			break;
		case 'dinfo':
			col = [
				{text: 'NAME',datafield: 'name' },
				{text: 'NUMBER', width: 100,datafield: 'contact_num' },
				{text: 'VEHICLE', width: 200,datafield: 'assigned_vehicle',cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
					var vidArr = JSON.parse(value);
					var caropt = [];
					$.each(vidArr,function(i,e){
						var car = _.map(VEHICLES, function(o) {if (o.vid == e) return o;});
						car = _.without(car, undefined);
						caropt.push(car[0].name);
					});	
					caropt.sort();
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+caropt.join(', ')+'</div>';
				}},
				{text: 'ACTIVE', width: 60, datafield: 'active', cellsalign:'center',cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;"><i class="'+(value == 1?'check green':'times red')+' icon" style="color:'+value+';"></i></div>';
				}},
				{datafield: 'did',hidden:true}
			];
			break;
		case 'vinfo':
			col = [
				{text: 'NAME',width: 200,datafield: 'name' },
				{text: 'TYPE', width: 100,datafield: 'type', cellsalign:'center' },
				{text: 'PLATE No.', width: 100,datafield: 'plate_num',cellsalign:'center' },
				{text: 'REMARKS',datafield: 'remarks' },
				{text: 'ACTIVE', width: 60, datafield: 'active', cellsalign:'center',cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;"><i class="'+(value == 1?'check green':'times red')+' icon" style="color:'+value+';"></i></div>';
				}},
				{datafield: 'vid',hidden:true}
			];
			break;

	}
	return col;
}

function resetForm(){
	$("#statColorPicker").spectrum("set", '#000000');
	$('.ui.form .field input, .ui.form .field textarea').val('');
	$('.isActive').prop('checked',true);
	$('.btn-save-entry').removeAttr('data-id');
	$('#errmsg').hide();
	$('#errlst').empty();
	$('#vass,#vact').dropdown('clear');
}

function source(d){
	var source = {datatype:'json',url:BaseUrl()+'ajax/vehicle/action',data:d,type:'POST'};
	var elem = '';
	switch(d.type){
		case 'status':
			elem = 'stat_grid';
			source['id'] = 'sid';
			source['datafields'] = [
				{name:'sid', type:'int'},
				{name:'name'},
				{name:'description'},
				{name:'color'},
				{name:'active',type:'int'}
			]	
			break;
		case 'vehicle':
			elem = 'vinfo_grid';
			source['id'] = 'vid';
			source['datafields'] = [
				{name:'vid', type:'int'},
				{name:'name'},
				{name:'type'},
				{name:'plate_num'},
				{name:'remarks'},
				{name:'active',type:'int'}
			]	
			break;
		case 'driver':
			elem = 'dinfo_grid';
			source['id'] = 'did';
			source['datafields'] = [
				{name:'did', type:'int'},
				{name:'name'},
				{name:'contact_num'},
				{name:'assigned_vehicle'},
				{name:'active',type:'int'}
			]	
			break;
		case 'activity':
			elem = 'ainfo_grid';
			source['id'] = 'aid';
			source['datafields'] = [
				{name:'aid', type:'int'},
				{name:'activity'},
				{name:'route'},
				{name:'vehicle'},
				{name:'responsible_person'},
				{name:'active',type:'int'}
			]	
			break;
	}
	var dataAdapter = new $.jqx.dataAdapter(source,{
		loadComplete:function(records){
			if(d.type == 'status'){
				$('.blurry-top').show();
			}
		}
	});
	$('#'+elem).jqxGrid({source:dataAdapter});
}

function gridEvent(type){
	
	
	$('#'+elemByType[type]).on('rowdoubleclick', function(event){ 
	    var args = event.args;
	    // row's bound index.
	    var boundIndex = args.rowindex;
	    var data = $('#'+elemByType[type]).jqxGrid('getrowdata', boundIndex);
	    var id = 0;
	    console.log(data)
	    //set data to fields
	    $('#entryformTitle').text('Update '+type+' form');
	    $('.ui.form').hide();
		$('.ui.form[data-type='+type+']').show();
	    switch(type){
	    	case 'status':
	    		$('#stat_name').val(data.name);
	    		$('#stat_desc').val(data.desc);
	    		$("#statColorPicker").spectrum("set", data.color);
	    		break;
	    	case 'vehicle':
	    		$('#vehicle_name').val(data.name);
	    		$('#vehicle_type').val(data.type);
	    		$('#vehicle_plate_num').val(data.plate_num);
	    		$('#vehicle_remarks').val(data.remarks);
	    		break;
	    	case 'driver':
	    		$('#dname').val(data.name);
	    		$('#dnum').val(data.contact_num);
	    		$('#vass').dropdown('set selected',JSON.parse(data.assigned_vehicle));
	    		break;
	    	case 'activity':
	    		$('#aname').val(data.activity);
	    		$('#route').val(data.route);
	    		$('#resperson').val(data.responsible_person);
	    		$('#vact').dropdown('set selected',JSON.parse(data.vehicle));
	    		break;
	    }
	    $('.isActive[data-type='+type+']').prop('checked',(data.active?true:false));
	    $('.btn-save-entry').attr({'data-id':data.uid,'data-type':type});

	    $('.ui.modal[data-type=entryform]').modal({closable:false,onHidden:function(){resetForm();}}).modal('show');
	});
}
function fetchVehicles(){
	$.ajax({
		url:BaseUrl()+'ajax/vehicle/action',
		async:false,
		data:{type:'option_vehicle',action:'load'},
		method:'POST',
		success:function(data){
			var obj = JSON.parse(data);
			VEHICLES = obj;
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
		}
	});
}
function populateAssignedVehicle(){
	var opt = [];
	$.each(VEHICLES,function(i,e){
		if(parseInt(e.active) == 1){
			opt.push('<option value="'+e.vid+'">'+e.name+'</option>');
		}
	});
	$('#vass,#vact').html(opt.join(' '));
}