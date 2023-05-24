var VEHICLE = [],ACTIVITY = [],DRIVER = [];
$(function(){
	console.log('ok (~˘▾˘)~');
	fetchOptions('option_vehicle');
	fetchOptions('option_activity');
	fetchOptions('option_driver');

	$('.ui.checkbox').checkbox();
	$('select.dropdown').dropdown();
	//initialize jqxwidget
	var vgrid_opt = {width:'100%',height:'100%',
	selectionmode: 'singlerow',theme:'metro',autorowheight:false,autoheight:false,
	showfilterrow: true,filterable: true,sortable: true
	};

	var vactivity_grid = vgrid_opt;
		vactivity_grid['columns'] = gridColumns('vstat');
		vactivity_grid['ready'] = function(){
			loadSource({type:'activity_log',action:'load'})
		}
	$('#vactivity_grid').jqxGrid(vactivity_grid);

	$('.add-new-btn').click(function(){
		$('#entryformTitle').text('Add new activity log form');
		$('.ui.modal[data-type=entryform]').modal({closable:false,onHidden:function(){resetForm();}}).modal('show');
	});

	$('.btn-save-entry').click(function(){
		var d = {}, haserror = false, err = [];
		$('#errmsg').hide();
		$('#errlst').empty();
		//get all the values
		var date = $('#date').val(),
		etd = $('#etd').val(), eta = $('#eta').val(), etr = $('#etr').val(),
		activity = $('#activity').val(), 
		vass = $('#vass').val(), 
		driver = $('#driver').val(), 
		location = $('#location').val(), details = $('#details').val(),
		remarks = $('#remarks').val(),
		id = $('.btn-save-entry').attr('data-id');
		id = (id == undefined)?0:parseInt(id);
		// etd = moment(etd,'HH:mm').format('HHmm')+'H';
		// eta = moment(eta,'HH:mm').format('HHmm')+'H';
		// etr = moment(etr,'HH:mm').format('HHmm')+'H';
		var action = (id == 0)?'add':'edit';
		var d = {action:action,type:'activity_log',date:date,etd:etd,eta:eta,etr:etr,activity:activity, vass:JSON.stringify(vass),driver:JSON.stringify(driver),location:location,details:details,remarks:remarks,id:id};
		// console.log(d)
		if(date == ''){err.push('<li>Please input date.</li>');}
		if(etd == ''){err.push('<li>Please input ETD.</li>');}
		if(location == ''){err.push('<li>Please input location.</li>');}7
		if(vass.length == 0){err.push('<li>Please select at least one vehicle.</li>');}
		if(driver.length == 0){err.push('<li>Please select at least one driver.</li>');}
		if(err.length == 0){
			var r = confirm('Confirm '+(id == 0?'adding':'updating')+' of activity log.');
			if(r){
				loading(true);
				$.ajax({
					url:BaseUrl()+'ajax/vehicle/action',
					async:true,
					data:d,
					method:'POST',
					success:function(data){
						console.log(data);
						if($.trim(data) == 'SUCCESS'){
							if(d.action == 'add'){
								resetForm(d.type);
							}else{
								$('.ui.modal[data-type=entryform]').modal('hide');
							}
							$('#vactivity_grid').jqxGrid('updatebounddata');
						}
						
						loading(false);
					},
					error:function(jqXHR,textStatus,errorThrown ){
						console.log(errorThrown);
						loading(false);
					}
				});
			}
		}else{
			$('#errlst').html(err.join(' '));
			$('#errmsg').show();
			$('.scrolling.content').animate({ scrollTop: 0 }, 'fast');
		}
	});

	// $('#driver').change(function(){
	// 	if(parseInt(this.value) === -1){
	// 		$('#ifDOthers').show();
	// 	}else{
	// 		$('#ifDOthers').hide();
	// 	}
	// });
	// $('#vass').change(function(){
	// 	if(parseInt(this.value) === -1){
	// 		$('#ifVOthers').show();
	// 	}else{
	// 		$('#ifVOthers').hide();
	// 	}
	// });

	//edit grid (double click)
	$('#vactivity_grid').on('rowdoubleclick', function(event){ 
		var args = event.args;
	    // row's bound index.
	    var boundIndex = args.rowindex;
	    var data = $('#vactivity_grid').jqxGrid('getrowdata', boundIndex);
	    // console.log(data)
	    if(data.etd !== ''){
	    	$('#etaetr').show();
	    }else{
	    	$('#etaetr').hide();
	    }

	    $('#date').val(data.dt);
	    $('#etd').val(data.etd);
	    $('#eta').val(data.eta);
	    $('#etr').val(data.etr);
	    $('#activity').dropdown('set selected',data.aid);
	    $('#vass').dropdown('set selected',JSON.parse(data.vid));
	    $('#driver').dropdown('set selected',JSON.parse(data.did));
	    // $('#vothers').val(data.vid_other);
	    // $('#dothers').val(data.did_other);
	    $('#location').val(data.location);
	    $('#details').val(data.details);
	    $('#remarks').val(data.remarks);

	    // if(data.did === -1){
	    // 	$('#ifDOthers').show();
	    // }else{
	    // 	$('#ifDOthers').hide();
	    // }
	    // if(data.vid === -1){
	    // 	$('#ifVOthers').show();
	    // }else{
	    // 	$('#ifVOthers').hide();
	    // }

	    $('.btn-save-entry').attr({'data-id':data.uid});

	    $('#entryformTitle').text('Edit activity log form');
	    $('.ui.modal[data-type=entryform]').modal({closable:false,onHidden:function(){resetForm();}}).modal('show');
	});

	populateOption('vehicle');
	populateOption('activity');
	populateOption('driver');
});
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
function fetchOptions(type){
	$.ajax({
		url:BaseUrl()+'ajax/vehicle/action',
		async:false,
		data:{type:type,action:'load'},
		method:'POST',
		success:function(data){
			var obj = JSON.parse(data);
			switch(type){
				case 'option_vehicle':
					VEHICLES = obj;
					break;
				case 'option_activity':
					ACTIVITY = obj;
					break;
				case 'option_driver':
					DRIVER = obj;
					break;
			}
			
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
		}
	});
}

function populateOption(type){
	var opt = [],arr = [], elem = '';
	switch(type){
		case 'vehicle':
			arr = VEHICLES;
			elem = 'vass';
			break;
		case 'activity':
			arr = ACTIVITY;
			elem = 'activity';
			break;
		case 'driver':
			arr = DRIVER;
			elem = 'driver';
			break;
	}
	$.each(arr,function(i,e){
		var htmlOpt = '';
		switch(type){
			case 'vehicle':
				if(parseInt(e.active) == 1){
					htmlOpt = '<option value="'+e.vid+'">'+e.name+'</option>';
				}
				break;
			case 'activity':
				var r = (e.route == '')?'':' ('+e.route+')';
				htmlOpt = '<option value="'+e.aid+'">'+e.activity+r+'</option>';
				break;
			case 'driver':
				if(parseInt(e.active) == 1){
					htmlOpt = '<option value="'+e.did+'">'+e.name+'</option>';
				}
				break;
		}
		opt.push(htmlOpt);
	});
	if($.inArray(type,['vehicle','driver']) !== -1){
		//opt.push('<option value="-1">Others</option>');
	}
	$('#'+elem).html(opt.join(' '));
}

function gridColumns(type){
	var col = [];
	switch(type){
		case 'vstat':
			col = [
				{text: '#',width:30,cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
					return '<div class="jqx-grid-cell-left-align" style="margin-top: 8px;">'+(row+1)+'</div>';
				},filterable:false,sortable:false,menu:false},
				{text: 'DATE',datafield: 'dt', filtertype: 'range'},
				{text: 'ACTIVITY', width: 100,datafield: 'activity' },
				{text: 'VEHICLE NAME', width: 100,datafield: 'vid',cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
					// var data = $('#vactivity_grid').jqxGrid('getrowdata', row);
					// if(value == ''){
					// 	return '<div class="jqx-grid-cell-left-align" style="margin-top: 8px;">'+data.vid_other+'</div>';
					// }

					var vidArr = JSON.parse(value);
					var caropt = [];
					$.each(vidArr,function(i,e){
						var car = _.map(VEHICLES, function(o) {if (o.vid == e) return o;});
						car = _.without(car, undefined);
						caropt.push(car[0].name);
					});	
					caropt.sort();
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+caropt.join(', ')+'</div>';
				} },
				{text: 'ASSIGNED DRIVER', width: 200,datafield: 'did',cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
					// var data = $('#vactivity_grid').jqxGrid('getrowdata', row);
					// if(value == ''){
					// 	return '<div class="jqx-grid-cell-left-align" style="margin-top: 8px;">'+data.did_other+'</div>';
					// }
					var didArr = JSON.parse(value);
					var driveropt = [];//console.log($('#vactivity_grid').jqxGrid('getrowdata', row));
					$.each(didArr,function(i,e){
						var driver = _.map(DRIVER, function(o) {if (o.did == e) return o;});
						driver = _.without(driver, undefined);
						driveropt.push(driver[0].name);
					});	
					driveropt.sort();
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+driveropt.join(', ')+'</div>';
				} },				
				{text: 'ETD',datafield: 'etd',columntype:'custom',filterable:false,menu:false},
				{text: 'ETA',datafield: 'eta',filterable:false,menu:false },
				{text: 'ETR',datafield: 'etr',filterable:false,menu:false },
				{text: 'LOCATION',datafield: 'location' },
				{text: 'DETAILS',datafield: 'details' },
				{text: 'REMARKS',datafield: 'remarks' }
			];
			break;
	}
	return col;
}

function resetForm (){
	$('.ui.form .field input:not([type=date]), .ui.form .field textarea').val('');
	$('.btn-save-entry').removeAttr('data-id');
	$('#errmsg,#etaetr').hide();
	$('#errlst').empty();
	$('#vass,#driver').dropdown('clear');
}

function loadSource(d){
	// valog.remarks as remarks
	var source = {datatype:'json',url:BaseUrl()+'ajax/vehicle/action',data:d,type:'POST',id:'id',
		datafields:[
			{name:'id', type:'int'},//hidden
			{name:'aid', type:'int'},//hidden
			{name:'vid'},//hidden
			{name:'did'},//hidden
			{name:'activity'},
			{name:'route'},
			{name:'dt'},
			{name:'etd'},
			{name:'eta'},
			{name:'etr'},
			{name:'location'},
			{name:'details'},
			{name:'remarks'},
			{name:'stat'}
		]};

	var dataAdapter = new $.jqx.dataAdapter(source,{
		loadComplete:function(records){
			$('.blurry-top').hide();
		},
		loadError: function(jqXHR, status, error){
			console.log(status,error)
		},
		beforeLoadComplete: function (records) {
			// console.log(records) 
		}
	});
	$('#vactivity_grid').jqxGrid({source:dataAdapter});
}