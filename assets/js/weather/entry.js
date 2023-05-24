var utype = 'user';
var userid = $('#versplit').data('uid');
var update_id = 0, update_dt = '',update_uid = 0, update_type_of_advi = '',update_ws = null,update_tc = null;
var fdt = '', tdt = '';
$(function(){
	var navbar_height = $('#navbar').innerHeight();
	var html_height = $('html').innerHeight();
	var htmH = $(window).innerHeight();
	/*************************************************************************************************************/
	//initialize splitter
	/*************************************************************************************************************/
	$('#versplit').jqxSplitter({  width: '100%', height: (htmH-navbar_height)+'px',resizable:false,splitBarSize:0, panels: [{ size: 300,collapsible:false }],theme:'metro' });
	$("#vhsplit").jqxSplitter({width: '100%', height: '100%',orientation:'horizontal',panels:[{ size: 30,collapsible:false }],showSplitBar:false,theme:'metro'});
	$("#frmPanel").jqxPanel({ width: '100%', height: '100%',theme:'metro',autoUpdate: true});
	/*************************************************************************************************************/
	//Initialize listbox
	/*************************************************************************************************************/
	weather_systems.sort();
	// weather_systems.unshift('None');
	$("#ws_cdo_lst").jqxListBox({source: weather_systems, checkboxes: true, height: 350,width:'100%'});
	$("#ws_par_lst").jqxListBox({source: weather_systems, checkboxes: true, height: 350,width:'100%'});
	listEvents('ws_cdo_lst');
	listEvents('ws_par_lst');	
	/*************************************************************************************************************/
	//Type of post and advisories codes
	/*************************************************************************************************************/
	populateTypeOfPost();
	populateTypeOfAdvi($('#type_of_post').val());

	$('#type_of_post').change(function(){
		populateTypeOfAdvi(this.value);
		// forDailyForecastDefaults();
	});

	$('#type_of_advi').change(function(){
		var d = $('option[value="'+this.value+'"]',this).data('default');
		if(d != 'none'){
			$('#cdoaffected_container,#affected_area_container,#for_rescues').show();
			$('#daily_ws_container').hide();
			$('#cdoaffected').val(d);
			$('#rescues').val(d);
		}else{
			$('#cdoaffected_container,#affected_area_container,#for_rescues').hide();
			$('#daily_ws_container').show();
			// setTimeout(function(){$('#ws_cdo_lst,#ws_par_lst').jqxListBox('render');},500);
		}
		if(this.value == 'Earthquake Advisory'){
			$('input[name=estat]:radio:first-child').prop('checked',true);
			$('#for_earthquake').show();
		}else{
			$('#for_earthquake').hide();
		}
		if(this.value == 'Oro Rescue RUNS'){
			$('input[name=rescues]:radio:first-child').prop('checked',true);
			$('#for_rescues').show();
			$('#rescues').val(d);
		}else{
			$('#for_rescues').hide();
		}


		// setTimeout(function(){
			forDailyForecastDefaults();
			setWS_TC();
		// },600);
		
	});
	/*************************************************************************************************************/
	//Other events codes
	/*************************************************************************************************************/
	$('#chk_infocast').change(function(){
		if(this.checked){
			$('#infocast_sent_text,#total_contacts_excluded').prop('disabled',false);
			$('#infocast_sent_text,#total_contacts_excluded').parent().removeClass('disabled');
		}else{
			$('#infocast_sent_text,#total_contacts_excluded').prop('disabled',true);
			$('#infocast_sent_text,#total_contacts_excluded').parent().addClass('disabled');
		}
	});
	$('#chk_missedpost').change(function(){
		if(this.checked){
			$('#missed_user').prop('disabled',false);
			$('#missed_user').parent().removeClass('disabled');
		}else{
			$('#missed_user').prop('disabled',true);
			$('#missed_user').parent().addClass('disabled');
		}
	});
	/*************************************************************************************************************/
	//Submit codes
	/*************************************************************************************************************/
	$('#btn_submit').click(function(){
		//remove all error span
		$('.errmsg').remove();
		$('div.field.error').removeClass('error');

		//get all data
		var slnk = $('#slnk').val(),
			slnkdt = moment($('#slnk_dt').val(),'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss'),
			clnk = $('#cdrrmdlnk').val(),
			clnkdt = moment($('#cdrrmdlnk_dt').val(),'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss'),
			tpost = $('#type_of_post').val(),
			tadvi = $('#type_of_advi').val(),
			estat = $('input[name=estat]:checked').val(),
			rescues = $('input[name=rescues]:checked').val(),
			rescues = $('#rescues').val(),
			cdoaffected = $('#cdoaffected').val(),
			//rescuesrun = $('#rescuesrun').val(),
			infocast = $('#chk_infocast').prop('checked'),
			txtsent = parseInt($('#infocast_sent_text').val()),
			exludecontacts = parseInt($('#total_contacts_excluded').val()),
			missedpost = $('#chk_missedpost').prop('checked'),
			missedby = parseInt($('#missed_user').val()),
			xprain = $('#xprain').prop('checked'),
			remarks = $('#remarks').val();

			cdoaffected = (tadvi == 'Daily Forecast')?'na':cdoaffected;
			estat = (tadvi != 'Earthquake Advisory')?'na':estat;
			rescues = (tadvi != 'Oro Rescue RUNS')?'na':rescues;
			//rescues = (tadvi != 'Oro Rescue RUNS')?'na':rescues;
			
			var affected_area = 'na',aaarr = [];
			$('input[name=affected_area]:checked').each(function(){
				aaarr.push(this.value);
			});
			affected_area = (aaarr.length == 2)?'both':(aaarr.length == 0?'na':aaarr[0]);

			infocast = (infocast)?1:0;
			txtsent = (infocast)?txtsent:0;
			missedpost = (missedpost)?1:0;
			missedby = (missedpost)?missedby:0;
			xprain = (xprain)?1:0;

			var cdo_ws_tc_list = DailyForecastData('cdo');
			var par_ws_tc_list = DailyForecastData('par');

		userid = (update_id != 0)?update_uid:userid;

		var d = {tp:'entry',update_id:update_id,update_dt:update_dt,userid:userid,slnk:slnk,slnkdt:slnkdt,clnk:clnk,clnkdt:clnkdt,tpost:tpost,tadvi:tadvi,estat:estat,rescues:rescues,cdoaffected:cdoaffected,affected_area:affected_area,infocast:infocast,txtsent:txtsent,missedpost:missedpost,missedby:missedby,xprain:xprain,remarks:remarks,cdo_ws_tc_list:cdo_ws_tc_list,par_ws_tc_list:par_ws_tc_list,exludecontacts:exludecontacts};
		console.log(d,cdo_ws_tc_list,par_ws_tc_list)
		var errArr = [];

		if(slnk == ''){errArr.push({elem:'slnk',msg:'Empty'});}
		if(clnk == ''){errArr.push({elem:'cdrrmdlnk',msg:'Empty'});}

		if(errArr.length > 0){
			$.each(errArr,function(_i,e){
				var $parent = $('#'+e.elem).parent();
				$('label',$parent).append('<small class="errmsg" style="color: #DB2828;font-weight:normal;">&nbsp;&nbsp;&nbsp;'+e.msg+'</small>');
				$parent.addClass('error');
			});
			$('#'+errArr[0].elem).focus();
			$('#frmPanel').jqxPanel('scrollTo', $('#'+errArr[0].elem).offset().top, 0);

		}else{
			bootbox.confirm({
				title:'Confirm',
				size:'mini',
				message: 'Confirm saving.',
				callback: function(r){
					if(r){
						$('.custom.form').addClass('loading');
						$.ajax({
							url:BaseUrl()+'ajax/weather/saveData',
							async:true,
							data:d,
							method:'POST',
							success:function(data){
								console.log(data)
								formDefaults();
								$('#frmPanel').jqxPanel('scrollTo', 0, 0);
								var filtersinfo = $('#grid').jqxGrid('getfilterinformation');
								if(filtersinfo.length != 0){
									$('#grid').jqxGrid('updatebounddata','cells');
								}else{
									if(update_id === undefined){
										$('#grid').jqxGrid('updatebounddata','data');
									}else{//loadPPCR();
										$('#grid').jqxGrid('updatebounddata','cells');
									}
								}
								//update data of the grid
							},
							error:function(_jqXHR,_textStatus,errorThrown ){
								console.log(errorThrown);
							},
							complete:function(_jqXHR,_textStatus){
								$('.custom.form').removeClass('loading');
							}
						});
					}
					
				}
			});
		}
	});

	/*************************************************************************************************************/
	//grid
	/*************************************************************************************************************/
	var col = [
		//CallLog_ID,Type_Emergency,Date_Log,Address,LandMark,Remarks
		{ text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,pinned:true,
		cellsrenderer: function (row, _column, _value) {
			var r = row;
			// console.log(r,row,r++,(r + 1))
			return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
		}},
		{ text: '', width: '50px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,pinned:true,
		cellsrenderer: function (row, _column, _value) {
			var rdata = $('#grid').jqxGrid('getrowdata', row);
			// console.log(r,row,r++,(r + 1))
			var btnarr = [
				'<i class="edit icon btncontrol" data-action="edit" title="Edit '+rdata.id+'" style="cursor:pointer;"></i>',
				'<i class="trash icon btncontrol" data-action="delete" title="Delete '+rdata.id+'" style="cursor:pointer;"></i>'
			]
			return '<div class="jqx-grid-cell-middle-align" style="margin-top:8px;" data-row="'+row+'">'+btnarr.join('&nbsp;')+'</div>';
		}},
		{ text: 'ID',  datafield: 'id', width: '70px',cellsalign:'center',align:'center',resizable:false,pinned:true },
//$('#jqxGrid').jqxGrid('setcolumnproperty', 'firstname', 'width', 100);
		{ text: 'Type of Post',  datafield: 'type_post', width: '120px',cellsalign:'center',align:'center',resizable:false,filtertype:'checkedlist',filteritems:_.map(type_of_post_and_advi,'post')},
		{ text: 'Type of Advisory',  datafield: 'type_advi', width: '120px',cellsalign:'center',align:'center',resizable:false,filtertype:'checkedlist',filteritems:[]},
		{ text: 'Type of Runs',  datafield: 'rescues', width: '120px',cellsalign:'center',align:'center',resizable:false,filtertype:'checkedlist',filteritems:['FIRE','FLOOD','DB','LANDSLIDE','VA','SIMULATION']},
		{ text: 'Date',  datafield: 'sdate', columngroup:'source', width: '100px',cellsalign:'center',align:'center',resizable:false, filtertype:'date', cellsformat:'yyyy-MM-dd' },
		{ text: 'Time',  datafield: 'stime', columngroup:'source', width: '80px',cellsalign:'center',align:'center',resizable:false},
		{ text: 'Link',  datafield: 'slnk', columngroup:'source', width: '70px',cellsalign:'center',align:'center',resizable:false, filterable:false, sortable:false, menu:false,
			cellsrenderer:function (_row, _columnfield, value, _defaulthtml, _columnproperties){
				var ico = (value.search('facebook') !== -1)?'mdi-facebook-box':'mdi-file-link';				
				return '<div class="jqx-grid-cell-middle-align" style="margin-top:8px;">'+
						'<a href="'+value+'" target="_blank"><i class="mdi '+ico+'" style="font-size:3vw;"></i></a></div>';
			}
		},

		{ text: 'Date',  datafield: 'cdate', columngroup:'local', width: '100px',cellsalign:'center',align:'center',resizable:false, filtertype:'date', cellsformat:'yyyy-MM-dd' },
		{ text: 'Time',  datafield: 'ctime', columngroup:'local', width: '80px',cellsalign:'center',align:'center',resizable:false},
		{ text: 'Link',  datafield: 'clnk', columngroup:'local', width: '70px',cellsalign:'center',align:'center',resizable:false, filterable:false, sortable:false, menu:false,
			cellsrenderer:function (_row, _columnfield, value, _defaulthtml, _columnproperties){
				var ico = (value.search('facebook') !== -1)?'mdi-facebook-box':'mdi-file-link';
				return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+
						'<a href="'+value+'" target="_blank"><i class="mdi '+ico+'" style="font-size:3vw;"></i></a></div>';
			}
		},
		
		{ text: 'Rain',  datafield: 'xp_rain', columngroup:'cdoaffected', width: '80px',cellsalign:'center',align:'center',resizable:false,filtertype:'checkedlist',filteritems:['YES','NO']},
		{ text: 'Affected',  datafield: 'cdo_affect', columngroup:'cdoaffected', width: '80px',cellsalign:'center',align:'center',resizable:false,filtertype:'checkedlist',filteritems:['Affected','Not','NA'] },
		{ text: 'Area',  datafield: 'affect_area', columngroup:'cdoaffected', width: '80px',cellsalign:'center',align:'center',resizable:false,filtertype:'checkedlist',filteritems:['Urban','Riverine','NA'] },

		{ text: 'CDO',  datafield: 'ws_cdo', columngroup:'ws', width: '150px',cellsalign:'left',align:'center',resizable:false},
		{ text: 'PAR',  datafield: 'ws_par', columngroup:'ws', width: '150px',cellsalign:'left',align:'center',resizable:false},

		{ text: 'CDO',  datafield: 'tc_cdo', columngroup:'tc', width: '150px',cellsalign:'left',align:'center',resizable:false },
		{ text: 'PAR',  datafield: 'tc_par', columngroup:'tc', width: '150px',cellsalign:'left',align:'center',resizable:false },

		{ text: 'Remarks',  datafield: 'remarks', width: '300px',cellsalign:'left',align:'center' },

		{ text: 'Infocast',  datafield: 'infocast', columngroup:'infoc', width: '80px',cellsalign:'center',align:'center',resizable:false,filtertype:'checkedlist',filteritems:['YES','NO'] },
		{ text: 'Total',  datafield: 'total_text', columngroup:'infoc', width: '80px',cellsalign:'center',align:'center',resizable:false },

		{ text: 'Missed',  datafield: 'missed_post', columngroup:'missedpost', width: '80px',cellsalign:'center',align:'center',resizable:false,filtertype:'checkedlist',filteritems:['YES','NO']},
		{ text: 'Staff',  datafield: 'mname', columngroup:'missedpost', width: '80px',cellsalign:'center',align:'center',resizable:false,filtertype:'checkedlist',filteritems:[]},

		{ text: 'Staff',  datafield: 'uname', width: '80px',cellsalign:'center',align:'center',resizable:false,filtertype:'checkedlist',filteritems:[] },
		{ datafield: 'dt_created', hidden:true },
		{ datafield: 'estat', hidden:true },
		//{ datafield: 'rescues', hidden:true },
		{ datafield: 'missed_by', hidden:true },
		{ datafield: 'userid', hidden:true }
		
	];

	$('#grid').jqxGrid({
		width: '100%',height: (html_height - navbar_height), theme:'metro',
		columns:col,
		columnsresize:true,
		enablebrowserselection:true,
		enabletooltips:true,
		showfilterrow: true,
		selectionmode:'checkbox',
		columnsreorder: true,
		filterable: true,
		sortable:true,
		groupable: false,
		altrows:false,

		pageable: true,
		pagesize: 50,
		pagesizeoptions:['20','50','100'],
		autorowheight:true,
		toolbarheight:100,
		showtoolbar: true,
		columngroups:[
			{ text: 'SOURCE', align: 'center', name: 'source' },
			{ text: 'CDRRMD', align: 'center', name: 'local' },
			{ text: 'CDO AFFECTED', align: 'center', name: 'cdoaffected' },
			{ text: 'INFOCAST', align: 'center', name: 'infoc' },
			{ text: 'MISSED POST', align: 'center', name: 'missedpost' },
			{ text: 'WEATHER SYSTEMS', align: 'center', name: 'ws' },
			{ text: 'TROPICAL CYCLONE', align: 'center', name: 'tc' }
		],
		rendertoolbar: function(statusbar){
			var container = $('<div style="overflow: hidden; position: relative; margin: 5px;"></div>');
			var dtfilter = '<div style="float:left;"><fieldset><legend>Date Filter</legend><table><tr><td>From:</td><td>To:</td></tr><tr><td><input type="datetime-local" id="fdt"></td><td><input type="datetime-local" id="tdt"></td><td><button data-action="filter" style="border-radius:0;" class="ui primary button mini dtfilter">Filter</button></td><td><button data-action="clear" style="border-radius:0;" class="ui button mini dtfilter">Clear Filter</button></td></tr></table></fieldset></div>';
			var multidelete = $('<button class="ui mini labeled negative icon button" style="float: right; margin-left: 5px;" disabled><i class="trash icon"></i>Delete selected entry<span id="ws"></span> <span class="cnt_selected"></span></button>');
			container.append(dtfilter);
			container.append(multidelete);
			statusbar.append(container);
			multidelete.click(function(){
				let rowindex = $('#grid').jqxGrid('getselectedrowindexes');
				var dids = [];
				$.each(rowindex,function(_i,e){
					let data = $('#grid').jqxGrid('getrowdata', e);
					dids.push(data.id);
				});
				if(dids.length == 0){
					notif('No item selected','error','top center');
				}else{
					bootbox.confirm({
						title:'Confirm',
						size:'mini',
						message: "Confirm deleting selected user"+(dids.length > 1?"s":"")+"<br>Total selected item"+(dids.length > 1?"s":"")+": "+dids.length,
						callback: function(r){
							if(r){
								$.ajax({
									url:BaseUrl()+'ajax/weather/saveData',
									async:true,
									data:{tp:'entry delete',update_id:1,dids:dids},
									method:'POST',
									success:function(_data){
										notif(dids.length+' item'+(dids.length > 1?"s":"")+' has been deleted',undefined,'top center');
										$('#grid').jqxGrid('clearselection');
										var filtersinfo = $('#grid').jqxGrid('getfilterinformation');
										if(filtersinfo.length != 0){
											$('#grid').jqxGrid('updatebounddata','cells');
										}else{
											if(update_id === undefined){
												$('#grid').jqxGrid('updatebounddata','data');
											}else{
												$('#grid').jqxGrid('updatebounddata','cells');
											}
										}
									},
									error:function(_jqXHR,_textStatus,errorThrown ){
										console.log(errorThrown);
									},
									complete:function(_jqXHR,_textStatus){
										$('.custom.form').removeClass('loading');
									}
								});
							}
							
						}
					});//
				}
			});
		}
	});

	GetData();
	getUsers();

	$('body').on('click','.dtfilter',function(){
		var action = $(this).data('action');
		if(action == 'filter'){
			fdt = $('#fdt').val(),tdt = $('#tdt').val();
			
			if(fdt == '' || tdt == ''){
				notif('Please input date.','error');
			}else{
				fdt = moment(fdt).format('YYYY-MM-DD HH:mm:ss');
				tdt = moment(tdt).format('YYYY-MM-DD HH:mm:ss');
				if(!moment(fdt).isBefore(tdt) && fdt != tdt){
					notif('Invalid Date Range','error');
				}else{
					GetData('filter');
				}
			}
		}else{
			fdt = ''; tdt = '';
			$('#fdt,#tdt').val('');
			$('#grid').jqxGrid('clearfilters',false);
			GetData();
		}
	});

	$('body').on('click','.btncontrol',function(){
		var $this = $(this);
		var action = $this.data('action');
		var row = $this.parent().data('row');
		var rdata = $('#grid').jqxGrid('getrowdata', row);
		console.log(rdata)
		if(action == 'edit'){//put data to form
			update_id = rdata.id;
			update_uid = parseInt($('#versplit').data('uid')); //rdata.userid; //update kung kinsa ang naka login
			update_dt = rdata.dt_created;
			update_type_of_advi = rdata.type_advi;

			//weather system
			var ws_cdo = (rdata.ws_cdo == null)?[]:rdata.ws_cdo.split(", ");
			var ws_par = (rdata.ws_par == null)?[]:rdata.ws_par.split(", ");
			var tc_cdo = (rdata.tc_cdo == null)?[]:rdata.tc_cdo.split(", ");
			var tc_par = (rdata.tc_par == null)?[]:rdata.tc_par.split(", ");

			update_ws = [ws_cdo,ws_par];
			update_tc = [tc_cdo,tc_par];

			$('#slnk').val(rdata.slnk);
			$('#cdrrmdlnk').val(rdata.clnk);
			$('#slnk_dt').val(moment(rdata.sdate).format('YYYY-MM-DD')+'T'+rdata.stime);
			$('#cdrrmdlnk_dt').val(moment(rdata.cdate).format('YYYY-MM-DD')+'T'+rdata.ctime);
			$('#type_of_post').val(rdata.type_post).change();
			$(`input[name=estat][value=${rdata.estat}]`).click();
			$(`input[name=rescues][value=${rdata.rescues}]`).click();
			var cdoaffected = (rdata.cdo_affect == 'N/A')?'na':rdata.cdo_affect.toLowerCase();
			$('#cdoaffected').val(cdoaffected);
			var rescues = (rdata.rescues == 'N/A')?'na':rdata.rescues.toLowerCase();
			$('#rescues').val(rescues);

			$('input[name=affected_area]:checked').each(function(){this.checked = false;});//unchecked all affected area checkbox first
			if(rdata.affect_area != 'N/A'){
				if(rdata.affect_area == 'BOTH'){
					$('input[name=affected_area]').each(function(){this.checked = true;});
				}else{
					$(`input[name=estat][value=${rdata.estat}]`).click();
					$(`input[name=rescues][value=${rdata.rescues}]`).click();
				}
			}

			var isInfocast = (rdata.infocast == 'YES');
			$('#chk_infocast').prop('checked',isInfocast);
			$('#infocast_sent_text').val(rdata.total_text);
			$('#total_contacts_excluded').val(rdata.offset_contact);
			if(isInfocast){
				$('#infocast_sent_text,#total_contacts_excluded').parent().removeClass('disabled');
			}else{

				$('#infocast_sent_text,#total_contacts_excluded').parent().addClass('disabled');
			}
			
			var isMissed = (rdata.missed_post == 'YES');
			$('#chk_missedpost').prop('checked',isMissed);
			$('#missed_user').val(rdata.mname);
			if(isMissed){
				$('#missed_user').parent().removeClass('disabled');
			}else{

				$('#missed_user').parent().addClass('disabled');
			}

			$('#xprain').prop('checked',(rdata.xp_rain == 'YES'));

			$('#remarks').val(rdata.remarks);
			
		}else{
			bootbox.confirm({
				title:'Confirm',
				size:'mini',
				message: 'Confirm deleting entry '+rdata.id,
				callback: function(r){
					if(r){
						$.ajax({
							url:BaseUrl()+'ajax/weather/saveData',
							async:true,
							data:{tp:'entry delete',update_id:1,dids:[rdata.id]},
							method:'POST',
							success:function(_data){
								notif(rdata.id+' has been deleted',undefined,'top center');
								var filtersinfo = $('#grid').jqxGrid('getfilterinformation');
								if(filtersinfo.length != 0){
									$('#grid').jqxGrid('updatebounddata','cells');
								}else{
									if(update_id === undefined){
										$('#grid').jqxGrid('updatebounddata','data');
									}else{
										$('#grid').jqxGrid('updatebounddata','cells');
									}
								}
							},
							error:function(_jqXHR,_textStatus,errorThrown ){
								console.log(errorThrown);
							},
							complete:function(_jqXHR,_textStatus){
								$('.custom.form').removeClass('loading');
							}
						});
					}
					
				}
			});
		}
	});
	//grid event/s
	$('#grid').on('rowselect rowunselect',function(_event){
	    var totalSelected = $('#grid').jqxGrid('getselectedrowindexes').length;
	    var txt = (totalSelected > 0)?'('+totalSelected+')':'';
	    $('.cnt_selected').text(txt);
	    $('.cnt_selected').parent().prop('disabled',(totalSelected == 0));
	    $('#ws').text((totalSelected > 1?'s':''));
	});

	$(window).resize(function(){
		$('#grid').jqxGrid('refresh');
	});

	$('#btn_clear').click(function(){
		formDefaults();
	});
	//filter date range
	//filter date
	$('body').on('click','#dtfilter',function(){
		fdt = $('#fdt').val(),tdt = $('#tdt').val();
		fdt = moment(fdt).format('YYYY-MM-DD HH:mm:ss');
		tdt = moment(tdt).format('YYYY-MM-DD HH:mm:ss');
		if(fdt == '' || tdt == ''){
			notif('Please input date.','error');
		}else{
			if(!moment(fdt).isBefore(tdt) && fdt != tdt){
				notif('Invalid Date Range','error');
			}else{
				GetData('filter');
			}
		}
	});
	//custom filter event
	$("#grid").on("filter", function(_event){
	    var filterinfo = $("#grid").jqxGrid('getfilterinformation');
	    if(filterinfo.length != 0){
	    	var type_of_post = [];
	    	$.each(filterinfo,function(_i,e){
	    		if(e.datafield == 'type_post'){
	    			//get all the selected items of type_post
	    			var type_of_post = _.map(e.filter.getfilters(),'value');
	    			//get and array of data base on the selected type post
	    			var type_advi = [];
	    			$.each(type_of_post,function(_i2,e2){
	    				var advis = _.map(_.filter(type_of_post_and_advi,['post',e2]),'advi');
	    				$.each(advis[0],function(_i3,e3){
	    					type_advi.push(e3.advi);
	    				});
	    			});
	    			//set filter items for type of advi
	    			$('#grid').jqxGrid('setcolumnproperty', 'type_advi', 'filteritems', type_advi);
	    		}
	    	});
		}
	});  
	  
});
/**
 * Populate type of post select
 */
function populateTypeOfPost(){
	var post = [];
	$.each(type_of_post_and_advi,function(_i,e){
		post.push('<option value="'+e.post+'">'+e.post+'</option>');
	});
	$('#type_of_post').html(post.join(''));
}
/**
 * Populate type of advisories select
 */
function populateTypeOfAdvi(post){
	var advi = [];
	var adviarr = _.filter(type_of_post_and_advi,['post',post]);
	// console.log(adviarr)
	$.each(adviarr[0].advi,function(_i,e){
		adviarr.push('<option value="'+e.advi+'" data-default="'+e.default+'">'+e.advi+'</option>');
	});
	$('#type_of_advi').html(adviarr.join(''));
	if(update_type_of_advi != ''){
		$('#type_of_advi').val(update_type_of_advi)
	}
	$('#type_of_advi').change();
}
/**
 * 
 * @param {string} elem element ID
 */
function listEvents(elem){
	var $parent = $('#'+elem).parent().parent();
	$("#"+elem).on('checkChange',function(event){
		var args = event.args;
	    // get new check state.
	    var checked = args.checked;
	    // get the item and it's label and value fields.
	    var item = args.item;
	    var itemLabel = item.label;
	    var itemValue = item.value;
	    // get all checked items.
	    var checkedItems = $("#"+elem).jqxListBox('getCheckedItems');
	    
	    var withTCcnt = 0;
	    $.each(checkedItems,function(_i,e){
	    	if($.inArray(e.value,['Trough of Cyclone','Tropical Cyclone']) !== -1){
	    		withTCcnt++;
	    	}
	    });
	    
	    if(withTCcnt >  0){
	    	$('.tc_container',$parent).show();
	    }else{
	    	$('.tc_container',$parent).hide();
	    	
	    	$('.toberemove',$parent).remove();
	    	var type = (/par/i.test(elem))?'par':'cdo';
	    	$('#'+type+'_tc_type').val($('#'+type+'_tc_type option:first-child').val());
			$('#'+type+'_tc_name').val($('#'+type+'_tc_name option:first-child').val()).change();
	    }
	});

	var tc_opt = [];
	$.each(tropical_cyclone_names[moment().format('YYYY')],function(_i,e){
		tc_opt.push('<option value="'+e+'">'+e+'</option>');
	});
	tc_opt.push('<option value="OTHERS">OTHERS</option>');
	$('.tc_name',$parent).html(tc_opt.join(''));

	var int_tc_opt = [];tc_inter_name.sort();
	$.each(tc_inter_name,function(_i,e){
		int_tc_opt.push('<option value="'+e+'">'+e+'</option>');
	});
	// int_tc_opt.push('<option value="OTHERS">OTHERS</option>');
	$('.int_tc_name',$parent).html(int_tc_opt.join(''));

	var template = '<fieldset class="toberemove"><select class="tc_type" style="float:left;width: 35% !important;"><option value="TD">TD</option><option value="TS">TS</option><option value="STS">STS</option><option value="TY">TY</option><option value="STY">STY</option></select><select class="tc_name" style="float:left;width: 54% !important">'+tc_opt.join('')+'</select><i class="minus icon tc_btn" data-action="sub" style="float:left;cursor:pointer;margin: 10px 0 0 5px;"></i><select class="int_tc_name" style="display: none;width:90% !important;">'+int_tc_opt.join('')+'</select></fieldset>';

	$($parent).on('click','.tc_btn',function(){
		if($(this).data('action') == 'add'){
			$('.tc_list_container',$parent).append(template);
		}else{
			$(this).parent().remove();
		}
	});

	$($parent).on('change','.tc_name',function(){
		var i = $(this).data('index');
		if(this.value == 'OTHERS'){
			$('.int_tc_name',$(this).parent()).show();
		}else{
			$('.int_tc_name',$(this).parent()).hide();
		}
	});
}
/**
 * default values and selections of the form
 */
function formDefaults(){
	//disabled inputs and selects
	$('#infocast_sent_text,#missed_user').parent().addClass('disabled');
	//input type=text default blank
	$('#slnk,#cdrrmdlnk,#infocast_sent_text,#remarks').val('');
	//input type=datetime-local default current datetime
	$('#slnk_dt,#cdrrmdlnk_dt').val(moment().format('YYYY-MM-DDTHH:mm'));
	//select default first option
	$('#missed_user').val($('#missed_user option:first-child').val());	
	$('#type_of_post').val($('#type_of_post option:first-child').val()).change();
	//removing elements
	$('.toberemove').remove();
	//uncheck all from jqxListBox
	$("#ws_cdo_lst,#ws_par_lst").jqxListBox('uncheckAll');
	//checkbox defaults
	$('input:checked').each(function(){
		this.checked = false;
	});
	$('input[name=estat]:radio:first-child').prop('checked',true);
	$('input[name=rescues]:radio:first-child').prop('checked',true);
	update_id = 0;
	update_dt = '';
	update_uid = 0;
	update_type_of_advi = '';
	update_ws = null;
	update_tc = null;
}

function forDailyForecastDefaults(){
	var advi = $('#type_of_advi').val();
	if(advi != 'Daily Forecast'){
		$('.toberemove').remove();
		//uncheck all from jqxListBox
		$("#ws_cdo_lst,#ws_par_lst").jqxListBox('uncheckAll');
	}	
}

function setWS_TC(){
	if(update_ws !== null){
		$("#ws_cdo_lst,#ws_par_lst").jqxListBox('uncheckAll');
		$.each(update_ws[0],function(_i,e){
			$("#ws_cdo_lst").jqxListBox('checkItem', e ); 
		});
		$.each(update_ws[1],function(_i,e){
			$("#ws_par_lst").jqxListBox('checkItem', e ); 
		});
	}

	if(update_tc !== null){
		var tc_opt = $('#cdo_tc_name').html();
		var intr_tc_opt = $('#cdo_int_tc_name').html();
		var template = '<fieldset class="toberemove"><select class="tc_type" style="float:left;width: 35% !important;"><option value="TD">TD</option><option value="TS">TS</option><option value="STS">STS</option><option value="TY">TY</option><option value="STY">STY</option></select><select class="tc_name" style="float:left;width: 54% !important">'+tc_opt+'</select><i class="minus icon tc_btn" data-action="sub" style="float:left;cursor:pointer;margin: 10px 0 0 5px;"></i><select class="int_tc_name" style="display: none;width:90% !important;">'+intr_tc_opt+'</select></fieldset>';
		$('.toberemove').remove();
		$('.tc_loading').show();
		$.ajax({
			url:BaseUrl()+'ajax/weather/getTCData',
			async:true,
			data:{did:update_id},
			method:'POST',
			success:function(data){
				if(IsJsonString(data)){
					var obj = JSON.parse(data);console.log(obj)
					var temp_grp = '';
					$.each(obj,function(i,e){
						if(temp_grp != e.lst_group){
							$('#'+e.lst_group+'_tc_type').val(e.type);
							$('#'+e.lst_group+'_tc_name').val(e.name);
							if(e.name == 'OTHERS'){
								$('#'+e.lst_group+'_int_tc_name').val(e.intr_name).show();
							}
							
							temp_grp = e.lst_group;
						}else{
							$('.tc_list_container[data-type='+e.lst_group+']').append(template);
							var $fset = $('.tc_list_container[data-type='+e.lst_group+'] fieldset:nth-child('+(i + 1)+')');
							$('.tc_type',$fset).val(e.type);
							$('.tc_name',$fset).val(e.name);
							if(e.name == 'OTHERS'){
								$('.int_tc_name',$fset).val(e.intr_name).show();
							}
							
						}
					});
				}else{
					console.log(data);
					alert('INVALID DATA FORMAT [getTCData]');
				}
				$('.tc_loading').hide();
			},
			error:function(_jqXHR,_textStatus,errorThrown ){
				console.log(errorThrown);
				$('.tc_loading').hide();
			}
		});
	}	
}
/**
 * Return a collection of data containing a list of weather system selected and tropical cyclones
 * @param {string} type cdo or par
 */
function DailyForecastData(type){
	var $parent = $('#ws_'+type+'_lst').parent();
	var items = $('#ws_'+type+'_lst').jqxListBox('getCheckedItems'); 
	var hasTC = _.find(items,function(o){return ($.inArray(o.value,['Trough of Cyclone','Tropical Cyclone']) !== -1)});

	var ws = [];//weather system array
	$.each(items,function(_i,e){
		ws.push(e.value);
	});
	var tc = [];
	if(hasTC !== undefined){
		$('.tc_list_container[data-type='+type+'] fieldset').each(function(){
			var tc_type = $('.tc_type',$(this)).val(),
				tc_name = $('.tc_name',$(this)).val(),
				tc_int_name = $('.int_tc_name',$(this)).val();
				tc_int_name = (tc_name == 'OTHERS')?tc_int_name:'na';
			tc.push({type:tc_type,name:tc_name,intr_name:tc_int_name});
		});
	}
	return {ws:ws,tc:tc};
}

function GetData(type){
	type = (type == undefined)?'default':'filtered';
	var mdt = moment().format('YYYY-MM-DD');//console.log(type,fdt,mdt)
	$('#grid').jqxGrid('showloadelement');
	var source =
    {
        datafields:
        [
            { name: 'id', type: 'int' },
            { name: 'slnk', type: 'string' },
            { name: 'sdate', type: 'date' },
            { name: 'stime', type: 'string' },
            { name: 'clnk', type: 'string' },
            { name: 'cdate', type: 'date'},
            { name: 'ctime', type: 'string' },
            { name: 'type_post', type: 'string' },
            { name: 'type_advi', type: 'string' },
            { name: 'cdo_affect', type: 'string' },
            { name: 'affect_area', type: 'string' },
            { name: 'estat', type: 'string'},
			{ name: 'rescues', type: 'string'},
			//{ name: 'rescuesrun', type: 'string'},
            { name: 'infocast', type: 'int' },
            { name: 'total_text', type: 'int' },
            { name: 'missed_post', type: 'int' },
            { name: 'missed_by', type: 'int' },
            { name: 'mname', type: 'string' },
            { name: 'xp_rain', type: 'int' },
            { name: 'remarks', type: 'string' },
            { name: 'userid', type: 'int' },
            { name: 'uname', type: 'string' },
            { name: 'dt_created', type: 'string' },
            { name: 'ws_cdo', type: 'string' },
            { name: 'ws_par', type: 'string' },
            { name: 'tc_cdo', type: 'string' },
            { name: 'tc_par', type: 'string' }
        ],
        datatype: "json",
        url:BaseUrl()+'ajax/weather/getWData',
        type:'POST',
        data:{fdt:fdt,tdt:tdt,type:type},
        filter: function () {
            // update the grid and send a request to the server.
            $("#grid").jqxGrid('updatebounddata', 'filter');
        }
    };
    var dataAdapter = new $.jqx.dataAdapter(source,{
    	loadComplete: function (records) {
    		// $('#grid').jqxGrid('hideloadelement');
    		console.log('record',records)
    	}
    });
    $('#grid').jqxGrid({source:dataAdapter});
}

function getUsers(){
	$.ajax({
		url:BaseUrl()+'ajax/weather/getUserData',
		async:true,
		method:'POST',
		success:function(data){
			if(IsJsonString(data)){
				var obj = JSON.parse(data);
				$('#grid').jqxGrid('setcolumnproperty', 'uname', 'filteritems', _.map(obj,'uname'));
				$('#grid').jqxGrid('setcolumnproperty', 'mname', 'filteritems', _.map(obj,'uname'));
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