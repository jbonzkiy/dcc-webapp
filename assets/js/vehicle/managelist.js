var VEHICLES = [], elemByType = {status:'stat_grid',vehicle:'vinfo_grid',driver:'dinfo_grid',activity:'ainfo_grid'};
$(function(){
	console.log('ok (~˘▾˘)~');
	fetchVehicles();
	populateAssignedVehicle();
	//initialized semantic ui
	$('.ui.checkbox').checkbox();
	$('select.dropdown').dropdown();

	//Initialize jqxwidget
	$('#parentSplit').jqxSplitter({ width: '100%', height: '87vh', theme:'metrodark',showSplitBar:false, panels: [{ size: '76%', collapsible:false,collapsed:false}] });
	$('#lsttabs').jqxTabs({ width: '100%', height: '100%', position: 'top',theme:'energyblue'});
	$('#jqxPanel').jqxPanel({width:'100%',height:'94%',theme:'metrodark'});
	

	//LoadGrid
	GridOption('vinfo_grid','vehicle');
	GridOption('dinfo_grid','driver');
	GridOption('ainfo_grid','activity');

	//Grid Event
	gridEvent('vehicle');
	gridEvent('driver');
	gridEvent('activity');


	//jqx widget events
	$('#lsttabs').on('tabclick',function(event){
		var itm = event.args.item; 
		var showElem = ['vehicle','driver','activity'],title = '';

		$('#btn-save-entry').attr('data-type',showElem[itm]);
		$('#addedittitle').text('Add new '+showElem[itm]);
		$('form[data-type='+showElem[itm]+']').show();
		$('form:not([data-type='+showElem[itm]+'])').hide();
		$('#addedittitle').text('Add new '+showElem[itm]);
		resetForm();
	});


	//save button event for modal
	$('#btn-save-entry').click(function(){
		var type = $(this).attr('data-type'),origName = $(this).attr('data-orig-name');
		var d = {}, haserror = false, err = [];
		var id = $('#btn-save-entry[data-type='+type+']').attr('data-id');
		id = (id == undefined)?0:parseInt(id);
		var action = (id == 0)?'add':'edit';
		$('#errmsg').hide();
		$('#errlst').empty();
		// console.log(type)
		switch(type){
			case 'vehicle':
				var vname = $('#vehicle_name').val(),
				vtype = $('#vehicle_type').val(),
				vpnum = $('#vehicle_plate_num').val(),
				vremarks = $('#vehicle_remarks').val(),
				isActive = ($('.isActive[data-type='+type+']').prop('checked')?1:0);
				if($.trim(vname) != ''){
					if(action == 'edit'){
						if(vname != origName){
							if(ValidateData(type,vname) == 'EXIST'){err.push('<li>Vehicle\'s name already exist.</li>');}
						}
					}else{
						if(ValidateData(type,vname) == 'EXIST'){err.push('<li>Vehicle\'s name already exist.</li>');}
					}
				}				
				if($.trim(vname) == ''){
					err.push('<li>Please input the name of vehicle.</li>');
				}
				d = {type:type,action:action,name:vname,vtype:vtype,pnum:vpnum,remarks:vremarks,active:isActive,vid:id};
				break;
			case 'driver':
				var isActive = ($('.isActive[data-type='+type+']').prop('checked')?1:0),
				dname = $('#dname').val(),
				dnum = $('#dnum').val(),
				vass = $('#vass').val();

				if($.trim(dname) != ''){
					if(action == 'edit'){
						if(dname != origName){
							if(ValidateData(type,dname) == 'EXIST'){err.push('<li>Driver\'s name already exist.</li>');}
						}
					}else{
						if(ValidateData(type,dname) == 'EXIST'){err.push('<li>Driver\'s name already exist.</li>');}
					}
				}
				if($.trim(dname) == ''){
					err.push('<li>Please input the name of driver.</li>');
				}
				if(vass.length == 0){
					err.push('<li>Please select at least one assigned vehicle.</li>');
				}
				d = {type:type,action:action,name:dname,num:dnum,vass:JSON.stringify(vass),active:isActive,did:id};
				break;
			case 'activity':
				var isActive = ($('.isActive[data-type='+type+']').prop('checked')?1:0),
				aname = $('#aname').val(),
				route = $('#route').val(),
				resperson = $('#resperson').val(),
				vact = $('#vact').val();
				d = {type:type,action:action,activity:aname,route:route,resperson:resperson,vehicle:JSON.stringify(vact),active:isActive,eid:id};
				if($.trim(aname) == ''){
					err.push('<li>Please input the name of activity.</li>');
				}
				if(vact.length == 0){
					err.push('<li>Please select at least one vehicle.</li>');
				}
				break;
		}
		if(err.length == 0){console.log(d)
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
});

function submitData(d){
	$('#loader').addClass('active');
	$.ajax({
		url:BaseUrl()+'ajax/vehicle/action',
		async:true,
		data:d,
		method:'POST',
		success:function(data){
			// console.log(data);
			if($.trim(data) == 'SUCCESS'){
				resetForm(d.type);
				if(d.type == 'vehicle'){fetchVehicles();populateAssignedVehicle();}
				$('#'+elemByType[d.type]).jqxGrid('updatebounddata');
				var arrTab = ['vehicle','driver','activity'];
				var selTab = $('#lsttabs').val();
				$('#addedittitle').text('Add new '+arrTab[selTab]);
			}
			
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
		},
		complete:function(data){
			$('#loader').removeClass('active');
		}
	});
	
}

function GridOption(elem,type){
	var grid_opt = {width:'99%',height:'96%',selectionmode: 'singlerow',theme:'energyblue',autorowheight:false,autoheight:false,showfilterrow: true,filterable: true,sortable: true};

	var grid = grid_opt;
	grid['columns'] = gridColumns(type);
	grid['ready'] = function(){
		source({type:type,action:'load'});
	};

	$('#'+elem).jqxGrid(grid);
}

function gridColumns(type){
	var col = [];
	switch(type){
		case 'activity':
			col = [
				{text: '#',width:30,cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+(row+1)+'</div>';
				},filterable:false,sortable:false,menu:false},
				{text: 'ACTIVITY',datafield: 'activity' },
				{text: 'ROUTE', width: 150,datafield: 'route' },
				{text: 'VEHICLE', width: 150,datafield: 'vehicle',cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
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
				{text: 'REPONSIBLE PERSON',datafield: 'responsible_person',width: 200 },
				{text: 'ACTIVE', width: 60, datafield: 'active', cellsalign:'center',cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;"><i class="'+(value == 1?'check green':'times red')+' icon" style="color:'+value+';"></i></div>';
				}},
				{datafield: 'eid',hidden:true}
			];
			break;
		case 'driver':
			col = [
				{text: '#',width:30,cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+(row+1)+'</div>';
				},filterable:false,sortable:false,menu:false},
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
		case 'vehicle':
			col = [
				{text: '#',width:30,cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+(row+1)+'</div>';
				},filterable:false,sortable:false,menu:false},
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

function source(d){
	var source = {datatype:'json',url:BaseUrl()+'ajax/vehicle/action',data:d,type:'POST'};
	var elem = '';
	switch(d.type){
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

function ValidateData(type,val){
	var r = 'OK';
	$.ajax({
		url:BaseUrl()+'ajax/vehicle/action',
		async:false,
		data:{type:type,action:'validate',val:val},
		method:'POST',
		success:function(data){
			r = $.trim(data);
			console.log(r)
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
		}
	});
	return r;
}

function resetForm(){
	$('.ui.form .field input, .ui.form .field textarea').val('');
	$('.isActive').prop('checked',true);
	$('#btn-save-entry').removeAttr('data-id data-orig-name');
	$('#errmsg,#btn-cancel').hide();
	$('#errlst').empty();
	$('#vass,#vact').dropdown('clear');	
}

function gridEvent(type){
	
	resetForm();
	$('#'+elemByType[type]).on('rowdoubleclick', function(event){ 
	    var args = event.args;
	    // row's bound index.
	    var boundIndex = args.rowindex;
	    var data = $('#'+elemByType[type]).jqxGrid('getrowdata', boundIndex);
	    var id = 0;
	    console.log(data)
	    //set data to fields
	    $('#addedittitle').text('Update '+type);
	    $('.ui.form').hide();
		$('.ui.form[data-type='+type+'],#btn-cancel').show();
	    switch(type){
	    	case 'vehicle':
	    		$('#vehicle_name').val(data.name);
	    		$('#vehicle_type').val(data.type);
	    		$('#vehicle_plate_num').val(data.plate_num);
	    		$('#vehicle_remarks').val(data.remarks);
	    		$('#btn-save-entry').attr('data-orig-name',data.name);
	    		break;
	    	case 'driver':
	    		$('#dname').val(data.name);
	    		$('#dnum').val(data.contact_num);
	    		$('#vass').dropdown('clear');
	    		$('#vass').dropdown('set selected',JSON.parse(data.assigned_vehicle));
	    		$('#btn-save-entry').attr('data-orig-name',data.name);
	    		break;
	    	case 'activity':
	    		$('#aname').val(data.activity);
	    		$('#route').val(data.route);
	    		$('#resperson').val(data.responsible_person);
	    		$('#vact').dropdown('clear');
	    		$('#vact').dropdown('set selected',JSON.parse(data.vehicle));
	    		break;
	    }
	    $('.isActive[data-type='+type+']').prop('checked',(data.active?true:false));
	    $('#btn-save-entry').attr({'data-id':data.uid,'data-type':type});
	});
}