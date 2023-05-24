var userList = [];
$(function(){
	PopulateSelMissPostUsers();
	//initialize jqxpanel
	$("#new_entry_panel").jqxPanel({ width: '100%', height: '100%', theme:theme,autoUpdate:true});
	//Initialize jqxpopover
	$("#account_popover").jqxPopover({offset: {left: 0, top:0},width:150,arrowOffsetValue:37,animationType:'none',
		theme:theme,showArrow:true, selector: $("#account_btn")});
	//Initialize jqxsplitter
	$('#main_splitter').jqxSplitter({  width: '100%', height: '100%',theme:'metrodark', panels: [{ size: 150,min:150,collapsed:true },{ size: '100%',collapsed:true }],resizable:false,showSplitBar:false });
	$('#nested_splitter').jqxSplitter({orientation: 'horizontal', panels: [{ size: 40, min:40 }, { min: 100}], resizable:false, showSplitBar:false });
	$('#second_nested').jqxSplitter({ panels: [{ size: '80%',collapsible:false},{ size: 300,collapsed:true }],resizable:false,showSplitBar:false });
	$('#third_nested').jqxSplitter({ orientation: 'horizontal', panels: [{ size: 33 }],resizable:false,showSplitBar:false });
	
	/*Add Custom filter type*/
	var addDateRangefilter=function(){
		var datefiltergroup = new $.jqx.filter();
		var operator = 0;
		var today = new Date();

		var weekago = new Date();

		weekago.setDate((today.getDate() - 10));

		var  filtervalue = weekago;
		var  filtercondition = 'GREATER_THAN_OR_EQUAL';
		var filter4 = datefiltergroup.createfilter('datefilter', filtervalue, filtercondition);

		filtervalue = today;
		filtercondition = 'GREATER_THAN_OR_EQUAL';
		var filter5 = datefiltergroup.createfilter('datefilter', filtervalue, filtercondition); 

		datefiltergroup.addfilter(operator, filter4);
		datefiltergroup.addfilter(operator, filter5);

		//$("#jqxProgress").jqxGrid('addfilter', 'Status', statusfiltergroup);
		$("#grid").jqxGrid('addfilter', 'range', datefiltergroup);
		$("#grid").jqxGrid('applyfilters');
    }
	/*Set grid columns*/
	var cols = [
		{text:'ID',datafield:'id',width:50,align:'center',cellsalign:'center',pinned:true,resizable:false,filterdelay: 99999},
		{text:'',width:80,align:'center',cellsalign:'center',pinned:true,resizable:false,menu:false,sortable:false,filterable:false,
		cellsrenderer:function (_row, _columnfield, _value, _defaulthtml, _columnproperties){
			var delbtn = '<i class="custom-btn mdi mdi-trash-can m-2" title="Delete" id="del_btn"></i>';
			var editbtn = '<i class="custom-btn mdi mdi-database-edit" title="Edit" id="edit_btn"></i>';

			return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;font-size:16px;">'+delbtn+editbtn+'</div>';
		}},
		{text:'Date of Advisory',datafield:'date_advi',width:100,align:'center',cellsalign:'center',filtertype:'range', resizable:false,filterable:true,cellsformat:'yyyy-MM-dd'},
		{text:'Time of Advisory',datafield:'time_advi',width:100,align:'center',cellsalign:'center',resizable:false,filterable:false,cellsformat:'HH:mm'},
		{text:'Type of Advisory',datafield:'type_advi',width:100,align:'center',cellsalign:'center',resizable:false,filterdelay: 99999},
		{text:'Type of Runs',datafield:'rescues',width:100,align:'center',cellsalign:'center',resizable:false,filterdelay: 99999},
		{text:'CDO Affected',datafield:'affected',filtertype:'checkedlist',filteritems:['YES','NO','NOT APPLICABLE'],width:100,align:'center',filterdelay: 99999},
		{text:'PAGASA Link',datafield:'pagasa_link',width:80,align:'center',cellsalign:'center',resizable:false,menu:false,sortable:false,filterable:false,
		cellsrenderer:function (_row, _columnfield, value, _defaulthtml, _columnproperties){
			return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+
					'<a href="'+value+'" target="_blank"><img src="'+BaseUrl()+'assets/img/facebook.png'+'"/> Link</a></div>';
		}},
		{text:'Time Posted',datafield:'time_post',width:70,align:'center',cellsalign:'center',filterdelay: 99999},
		{text:'CDRRMD Link',datafield:'cdrrmd_link',filtertype:'checkedlist',width:80,align:'center',cellsalign:'center',resizable:false,menu:false,sortable:false,filterable:false,
		cellsrenderer:function (_row, _columnfield, value, _defaulthtml, _columnproperties){
			return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+
					'<a href="'+value+'" target="_blank"><img src="'+BaseUrl()+'assets/img/facebook.png'+'"/> Link</a></div>';
		}},
		{text:'Infocast',datafield:'infocast',width:50,filtertype:'checkedlist',filteritems:['YES','NO'],align:'center',cellsalign:'center',resizable:false,filterdelay: 99999},
		{text:'Area affected',datafield:'area_affected',width:70,filtertype:'checkedlist',filteritems:['NONE','URBAN','RIVERINE','BOTH'],align:'center',cellsalign:'center',resizable:false,filterdelay: 99999},
		{text:'Issues & Concerns',datafield:'issues_concern',width:'auto',align:'center',cellsalign:'left',resizable:false,filterdelay: 99999},
		{text:'Actions Taken/Comments',datafield:'action_taken',width:'auto',align:'center',cellsalign:'left',resizable:false,filterdelay: 99999},
		{text:'Remarks',datafield:'remarks',width:'auto',align:'center',cellsalign:'left',resizable:false,filterdelay: 99999},
		{text:'Staff on Duty',datafield:'logby',width:80,filtertype:'checkedlist',filteritems:userList, align:'center',cellsalign:'center',resizable:false,filterdelay: 99999}
	];
	/*Set grid options*/
	var jqOpt =  {
		width:'100%',
		height:'100%',
		theme:theme,
		columns:cols,
		autorowheight:true,
		pageable: true,
		// selectionmode:'multiplecellsadvanced',
		pagesize:20,
		pagesizeoptions:['10','15','20','50'],
		pagermode:'default',
		filterable:true,
		showfilterrow:true,
		columnsresize:true,
		sortable: true,
		enabletooltips:true,
		selectionmode:'none',
		enablebrowserselection:true,
		ready: function(){
			addDateRangefilter();
		}
	}
	/*Initialize grid*/
	$('#grid').jqxGrid(jqOpt);
	FetchData();
	//Toggle menu
	$('#toggle_menu').click(function(){
		var val = $(this).attr('data-value');
		if(val == 'max'){
			$(this).attr('data-value','min')
			.removeClass('mdi-menu-open').addClass('mdi-menu');
			$('#main_splitter').jqxSplitter('collapse');
		}else{
			$(this).attr('data-value','max')
			.removeClass('mdi-menu').addClass('mdi-menu-open');
			$('#main_splitter').jqxSplitter('expand');
		}
	});
	//action button click event
	$('.action-btn').click(function(){
		var val = $(this).data('value');
		switch(val){
			case 'new_entry':
				$('#second_nested').jqxSplitter('expand');
				$('#account_popover').jqxPopover('close'); 
				break;
		}
	});
	//change type of post event 
	SetAdviAffected();
	$('#sel_typepost').change(function(){
		SetAdviAffected();
	});
	$('#sel_typeadvi').change(function(){
		AdviOptChange();
	});
	//Initialize jqxdatetimeinput
	$("#txt_date").jqxDateTimeInput({ width: '100%', height: '32px',theme:theme,formatString:'dd/MM/yyyy',
	showFooter:true });
	
	//Initialize jqxComboBox
	$('#wsa_cdo').jqxComboBox({source:ws_cdo,theme:theme,width: '100%', height: '32px',multiSelect:true});
	$('#wsna_cdo').jqxComboBox({source:ws_cdo,theme:theme,width: '100%', height: '32px',multiSelect:true});
	
	function wsa_cdo_fn(event,sel1,sel2){
		var args = event.args;
	    if (args) {
		    // index represents the item's index.                      
		    var index = args.index;
		    var item = args.item;
		    // get item's label and value.
		    var label = item.label;
		    var value = item.value;
		    var selItms = GetValues($(sel1).jqxComboBox('getSelectedItems')); 
		    var tcarr = ['Tropical Cyclone','Trough of Cyclone'];
		    console.log(_.intersection(tcarr,selItms).length)
		    if(_.intersection(tcarr,selItms).length > 0){
		    	$(sel2).show();
		    }else{
		    	$(sel2).hide();
		    }
		}
	}
	$('#wsa_cdo').on({
		change:function(event){wsa_cdo_fn(event,'#wsa_cdo','#iftd')},
		select:function(event){wsa_cdo_fn(event,'#wsa_cdo','#iftd')},
		unselect:function(event){wsa_cdo_fn(event,'#wsa_cdo','#iftd')}
	});

	$('#wsna_cdo').on({
		change:function(event){wsa_cdo_fn(event,'#wsna_cdo','#iftdn')},
		select:function(event){wsa_cdo_fn(event,'#wsna_cdo','#iftdn')},
		unselect:function(event){wsa_cdo_fn(event,'#wsna_cdo','#iftdn')}
	});

	
	
	PopulateSel('.sel_tc',tc_type);
	PopulateSel('.sel_ln',localname);
	PopulateSel('.sel_inN',interName);

	$('.sel_ln').on('change',function(){
		var type = $(this).data('type'),
		val = $(this).val();
		if(val == 'OTHERS'){
			$('#'+(type == 'a'?'ifinter':'ifintern')).show();
		}else{
			$('#'+(type == 'a'?'ifinter':'ifintern')).hide();
		}
	});

	$('input:radio[name=rdo_infocast]').click(function(){
		var val = $(this).data('value');
		if(val == 'Yes'){
			$('#isInfoCast').show();
		}else{
			$('#isInfoCast').hide();
		}
	});
	$('input:radio[name=rdo_missed]').click(function(){
		var val = $(this).data('value');
		if(val == 'Yes'){
			$('#ismisspost').show();
		}else{
			$('#ismisspost').hide();
		}
	});

	$('#savebank').click(function(){
		var data = ValidateNewEntry();
		if(!data){

		}else{
			//{"dt":"11/11/2019","typepost":"Thunderstorm","typeadvi":"Thunderstorm Advisory",
			//"isAffectedCDO":"YES","isAffectedArea":"NONE","wsa_cdo":[],"wsna_cdo":[],
			//"tc":"TD","tcLN":"AMANG","tcn":"TD","tcLNn":"AMANG","timeIssued":"00:11",
			//"timePosted":"11:11","sourceLnk":"asd","cdrLnk":"asd","isInfoCast":"No",
			//"isMissPost":"No","totalTxt":0,"comment":"asdasd"}
			var type_advi = ($.inArray(data.typepost,['Local CDRRMD Advisory','Special Report']) !== -1)?data.typepost:data.typeadvi;
			var area_affected = '', Localized = '';
			$.each(data.wsa_cdo,function(_i,e){
				switch(e){
					case 'Trough of Cyclone':
						area_affected = 'Trough of '+(data.tcLN == 'OTHERS'?data.tc+' '+data.tcIN:data.tcn+' '+data.tcLN);
						break;
					case 'Tropical Cyclone':
						area_affected = (data.tcLN == 'OTHERS'?data.tc+' '+data.tcIN:data.tcn+' '+data.tcLN);
						break;
					case 'Localized thunderstorm':
					case 'None':
						Localized = e;
						area_affected = '';
						break;
				}
			});

			//id, type_advi, Sub_type, affected, date_advi, time_advi, pagasa_link, cdrrmd_link, 
			//firstname, infocast, area_affected, issues_concern,action_taken, time_post, 
			//text,missed_advisory, missed_by,remarks, Total_Text_Sent
			var arr = {type_advi:type_advi,Sub_type:data.typeadvi,affected:affected}
			console.log(data)
		}	
	});

	$('#close_newentry').click(function(){
		$('#second_nested').jqxSplitter('collapse');
		ResetNewEntry();
		$('#new_entry_panel').jqxPanel('scrollTo', 0, 0);
	});

	$('#reload_data').click(function(){
		FetchData();
	});

	$('#add_data').click(function(){
		$('#second_nested').jqxSplitter('expand');
	});
});

function FetchData(){
	var source = {
		type:'POST',
        datatype: "json",
        datafields: [
			{ name: 'id', type: 'number'},
			{ name: 'date_advi', type: 'date',format:'yyyy-MM-dd'},
			{ name: 'time_advi', type: 'string'},
			{ name: 'affected', type: 'string'},
			{ name: 'rescues', type: 'string'},
			{ name: 'pagasa_link', type: 'string'},
			{ name: 'cdrrmd_link', type: 'string'},
			{ name: 'infocast', type: 'string'},
			{ name: 'area_affected', type: 'string'},
			{ name: 'issues_concern', type: 'string'},
			{ name: 'action_taken', type: 'string'},
			{ name: 'remarks', type: 'string'},
			{ name: 'logby', type: 'string'},
			{ name: 'time_post', type: 'string'},
			{ name: 'type_advi', type: 'string'}
        ],
	    url: BaseUrl()+'ajax/weather/fetch_records',
		root: 'Rows',
		beforeprocessing: function(data)
		{		
			source.totalrecords = data.TotalRows;
		},
		cache: false,
		filter: function()
		{
			// update the grid and send a request to the server.
			$("#grid").jqxGrid('updatebounddata', 'filter','data');
		},
		sort: function()
		{
			// update the grid and send a request to the server.
			$("#grid").jqxGrid('updatebounddata', 'sort','data');
		},
    };		
			
	var dataadapter = new $.jqx.dataAdapter(source,{
		loadError: function(_xhr, status, error)
		{
			console.log(error,status);
			alert(error);
		}
	});

	$('#grid').jqxGrid({
		virtualmode: true,
		source:dataadapter,
		rendergridrows: function()
		{
			return dataadapter.records;     
		}
	});
}

function ResetNewEntry(){
	$('#sel_typepost').val($("#sel_typepost option:first").val());
	$('#sel_typeadvi').val($("#sel_typeadvi option:first").val());
	$("input:radio[name=rdo_cdo]:first").click();
	$("input:radio[name=rdo_affected]:first").click();
	$("input:radio[name=rdo_infocast]:first").click();
	$("input:radio[name=rdo_missed]:first").click();
	$('#new_entry_window input:text, #txtarea_comment').val('');
}

function SetAdviAffected(){
	var typepost = $('#sel_typepost').val();

	var adviarr = {Thunderstorm:['Thunderstorm Advisory','Thunderstorm Watch','Thunderstorm Termination'],
		Forecast:['Daily Forecast','Weekly Weather Outlook','Weekend Weather Outlook'],
		Earthquake:['Earthquake Advisory'],
		//Rescues:['Oro Rescue RUNS'],
		Flooding:['General Flood Advisory','General Flood Termination','Urban Flooding','Urban Flooding Termination'],
		'Tropical Cyclone':['Severe Weather Advisory','Hourly Update','DILG CODIX'],
		WeatherUpdate:['Rainfall Termination','Rainfall Warning','Heavy Rainfall Termination','Weather Advisory','Rainfall Update','Gale Warning','Tropical Cyclone'],
		'Local CDRRMD Advisory':['Hydromet-Yellow','Hydromet-Orange','Hydromet-Red','CDRRMD Activities','Local Rainfall Advisory','Landslide Advisory','Hydromet Termination','EOC Press Release','IMT Activities','Oro Rescue RUNS'],
		'Special Report':['El Niño','La Niña','Amihan','Habagat','Special Report Termination','CDRRMD Shared Advisory']
	}
	var arr = [];
	$.each(adviarr[typepost],function(_i,e){
		arr.push('<option value="'+e+'">'+e+'</option>');
	});
	$('#sel_typeadvi').html(arr.join(''));
	AdviOptChange();
}

function AdviOptChange(){
	var typepost = $('#sel_typepost').val();
	var advi = $('#sel_typeadvi').val();
	if(GetValues($("#wsa_cdo").jqxComboBox('getSelectedItems')).length > 0){
		$("#wsa_cdo").jqxComboBox('clearSelection'); 
		$('#iftd,#ifinter').hide();
	}
	if(GetValues($("#wsna_cdo").jqxComboBox('getSelectedItems')).length > 0){
		$("#wsna_cdo").jqxComboBox('clearSelection'); 
		$('#iftdn,#ifintern').hide();
	} 
	if(typepost == 'Forecast' && advi == 'Daily Forecast'){
		$('.a_cdo_opt:nth-of-type(2)').show();
		$('.a_area_opt:nth-of-type(2)').show();

		$('.a_cdo_opt:nth-of-type(1)').hide();
		$('.a_area_opt:nth-of-type(1)').hide();



		$('#a_cdo_legend').text('Weather System affecting CDO:');
		$('#a_area_legend').text('Not affecting CDO:');
	}else{
		$('.a_cdo_opt:nth-of-type(1)').show();
		$('.a_area_opt:nth-of-type(1)').show();

		$('.a_cdo_opt:nth-of-type(2)').hide();
		$('.a_area_opt:nth-of-type(2)').hide();

		$('#a_cdo_legend').text('Affecting CDO:');
		$('#a_area_legend').text('Affected Area:');
	}
}
/**
 *This will return the values selected from jqxcombobox
 */
function GetValues(arr){
	var arr2 = [];
	$.each(arr,function(_i,e){
		arr2.push(e.label);
	});
	return arr2;
}
/**
 *This will validate the new entry form and return a JSON Format string
 */
function ValidateNewEntry(){
	var r = false;
	var dt = $('#txt_date').val(),
	typepost = $('#sel_typepost').val(),
	typeadvi = $('#sel_typeadvi').val(),
	rescues = $('input:radio[name=rescues]:checked').data('value'),
	isAffectedCDO = $('input:radio[name=rdo_cdo]:checked').data('value'),
	isAffectedArea = $('input:radio[name=rdo_affected]:checked').data('value'),
	wsa_cdo = GetValues($('#wsa_cdo').jqxComboBox('getSelectedItems')),
	wsna_cdo = GetValues($('#wsna_cdo').jqxComboBox('getSelectedItems')),
	tc = $('#sel_tc').val(), tcLN = $('#sel_ln').val(),tcIN = $('#sel_inN').val(),
	tcn = $('#sel_tcn').val(), tcLNn = $('#sel_lnn').val(),tcINn = $('#sel_inNn').val(),
	sourceLnk = $('#txt_souce_link').val(), timeIssued = $('#txt_time_issued').val(),
	cdrLnk = $('#txt_cdrrmd_link').val(), timePosted = $('#txt_time_posted').val(),
	isInfoCast = $('input:radio[name=rdo_infocast]:checked').data('value'),
	isMissPost = $('input:radio[name=rdo_missed]:checked').data('value'),
	totalTxt = (isInfoCast == 'No'?0:$('#txt_num_txt').val()), missedby = $('#sel_misspost').val(),
	comment = $('#txtarea_comment').val();

	//remove errmsg
	$('.errmsg').remove();$('.iserror').removeClass('border-danger iserror');
	var errmsg = [];//contains object array {elem:elem,msg:msg}
	//validations
	if(typepost == 'Forecast' && typeadvi == 'Daily Forecast'){
		if(wsa_cdo.length == 0){errmsg.push({elem:$('#wsa_cdo'),msg:'Please select weather system'});}
		if(wsna_cdo.length == 0){errmsg.push({elem:$('#wsna_cdo'),msg:'Please select weather system'});}
	}
	if(sourceLnk == ''){errmsg.push({elem:$('#txt_souce_link'),msg:'Please input source link.'});}
	if(cdrLnk == ''){errmsg.push({elem:$('#txt_cdrrmd_link'),msg:'Please input CDRRMD post link.'});}
	if(timeIssued == ''){errmsg.push({elem:$('#txt_time_issued'),msg:'Please input time issued.'});}
	if(timePosted == ''){errmsg.push({elem:$('#txt_time_posted'),msg:'Please input time posted.'});}
	if(totalTxt == '' && isInfoCast == 'Yes'){errmsg.push({elem:$('#txt_num_txt'),msg:'Please input total sms sent.'});}

	
	if(errmsg.length > 0){
		$.each(errmsg,function(i,e){
			if(i == 0){
				$('#new_entry_panel').jqxPanel('scrollTo', 0, $(e.elem).offset().top);
				console.log($('#new_entry_panel').jqxPanel('getVScrollPosition'),
					$('#new_entry_panel').jqxPanel('getHScrollPosition'))
			}
			e.elem.after('<span class="text-danger errmsg">'+e.msg+'</span>');
			e.elem.addClass('border-danger iserror');
		});
	}else{
		r = {dt:dt,typepost:typepost,typeadvi:advi,isAffectedCDO:isAffectedCDO,rescues:rescues,
			isAffectedArea:isAffectedArea,wsa_cdo:wsa_cdo,wsna_cdo:wsna_cdo,tc:tc,tcLN:tcLN,tcIN,tcINn,
			tcn:tcn,tcLNn:tcLNn,timeIssued:timeIssued,timePosted:timePosted,
			sourceLnk:sourceLnk,cdrLnk:cdrLnk,isInfoCast:isInfoCast,isMissPost:isMissPost,
			totalTxt:totalTxt,comment:comment};
	}
	return r;
}

function PopulateSel(selector,arr){
	var arr2 = [];
	$.each(arr,function(_i,e){
		arr2.push('<option value="'+e+'">'+e+'</option>');
	});
	$(selector).html(arr2.join(''));
}

function PopulateSelMissPostUsers(){
	$.ajax({
		url:BaseUrl()+'ajax/weather/fetch_user',
		async:true,
		success:function(data){
			if(IsJsonString(data)){
				if(IsJsonString(data)){
					var obj = JSON.parse(data);
					var arr = [];
					$.each(obj,function(_i,e){
						userList.push(e.lastname);
						arr.push('<option value="'+e.id+'">'+e.lastname+'</option>');
					});
					$('#sel_misspost').html(arr.join(''));
				}else{
					console.log('INVALID DATA: ',data);
					alert('INVALID DATA');
				}
				
			}else{
				console.log(data);
				alert('Data is not a valid JSON string.');
			}
		},
		error:function(_jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			alert(textStatus);
		}
	});
}