var update_id = 0,update_data = [];
$(function(){
	var navbar_height = $('#navbar').innerHeight();
	var html_height = $('html').innerHeight();
	var htmH = $(window).innerHeight();
	var bh = $('body').innerHeight();

	var optstreet = [];
	$.each(street_status,function(i,e){
		optstreet.push('<option value="'+e+'">'+e+'</option>');
	});
	$('#street_container select:first-child').html(optstreet.join(''));
	/*************************************************************************************************************/
	//initialize splitter
	/*************************************************************************************************************/
	$('#versplit').jqxSplitter({  width: '100%', height: (htmH-navbar_height-5)+'px',resizable:false,splitBarSize:0, panels: [{ size: 400,collapsible:false }],theme:'metro' });
	$("#vhsplit").jqxSplitter({width: '100%', height: '100%',orientation:'horizontal',panels:[{ size: 30,collapsible:false }],showSplitBar:false,theme:'metro'});
	$('#dsplit').jqxSplitter({  width: '100%', height: '100%',resizable:false,splitBarSize:0, panels: [{ size: 200,collapsible:false }],theme:'metro' });
	$("#frmPanel,#dpanel").jqxPanel({ width: '100%', height: '100%',theme:'metro',autoUpdate: true});

	$("#calendar").jqxCalendar({width: '100%', height: 200,theme:'metro'});

	$("#urban_lst_container,#riverine_lst_container,#landslide_lst_container,#surge_lst_container,#public_disturbance_lst_container,#earthquake_lst_container").jqxListBox({displayMember:'rdt',valueMember:'rid', width: '100%', height: '100%', theme:'metro' });

	$(window).resize(function(){
		$('#versplit').jqxSplitter({height: ($(window).innerHeight()-$('#navbar').innerHeight()-5)+'px'});
	});

	populateRiverine();
	defaultGauges('cdo');
	getDates();
	getData();
	$('#frm_riverine').change(function(){
		defaultGauges(this.value);
	});

	$('#btn_submit').click(function(){
		var riverine = $('#frm_riverine').val(),
		rdt = moment($('#frm_rdt').val(),'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss'),
		affected_area = $('input[name=affected_area]:checked').val(),
		remarks = $('#remarks').val();
		//get arg data
		var rdata = [],fdata = '';
		if(affected_area == 'urban'){
			$('#street_container tr').each(function(){
				var name = $('input[type=text]',$(this)).val(),
				stat = $('select',$(this)).val();
				rdata.push({name:name,status:stat});
			});
			fdata = JSON.stringify(rdata);
		}else if(affected_area == 'riverine'){
			var gauges = [];
			$('#for_riverine .gauges').each(function(){
				var typ = $(this).data('type'),
				name = $(this).data('name'),
				val = $('input[type=number]',$(this)).val(),
				tm = $('.custom-input',$(this)).val();
				gauges.push({type:typ,name:name,value:val,time:tm});
			});
			rdata = {riverine:$('#frm_riverine').val(),gauges:gauges};
			fdata = JSON.stringify(rdata);
		}else if (affected_area == 'landslide'){
			fdata = $('#location').val();
		}else if (affected_area == 'surge'){
			fdata = $('#surge_location').val();
		}else if (affected_area == 'public disturbance'){
			fdata = $('#public_disturbance_location').val();
		}else if (affected_area == 'earthquake'){
			fdata = $('#earthquake_location').val();
		}
		var d = {tp:'flood',update_id:update_id,rdt:rdt,affected_area:affected_area,fdata:fdata,remarks:remarks};

		console.log(d)
		bootbox.confirm({
			title:'Confirm',
			size:'mini',
			message: 'Confirm saving.',
			callback: function(r){
				if(r){
					$('.form').addClass('loading');
					$.ajax({
						url:BaseUrl()+'ajax/weather/saveData',
						async:true,
						data:d,
						method:'POST',
						success:function(data){
							console.log(data)
							if($.trim(data) === 'OK'){
								defaulData();
								getDates();
								getData();
								$('#frmPanel').jqxPanel('scrollTo', 0, 0);
								$.notify('Success!',{position:'top center',className:'success'});
							}else{
								console.log(data);
								alert('Something went wrong while trying to save data.');
							}
							
						},
						error:function(jqXHR,textStatus,errorThrown ){
							console.log(errorThrown);
						},
						complete:function(jqXHR,textStatus){
							$('.form').removeClass('loading');
						}
					});
				}
				
			}
		});

	});

	/**
	 * Toggle between urban, riverine, landslide, surge, public disturbance and earthquake
	 */
	$('input[name=affected_area]:radio').change(function(){
		var val = this.value;
		if(val === 'urban'){
			$('#for_urban').show();
			$('#for_riverine,#for_landslide,#for_surge,#for_public_disturbance,#for_earthquake').hide();
		}else if(val == 'riverine'){
			$('#for_riverine').show();
			$('#for_urban,#for_landslide,#for_surge,#for_public_disturbance,#for_earthquake').hide();
		}else if(val == 'landslide'){
			$('#for_landslide').show();
			$('#for_urban,#for_riverine,#for_surge,#for_public_disturbance,#for_earthquake').hide();
		}else if(val == 'surge'){
			$('#for_surge').show();
			$('#for_urban,#for_riverine,#for_landslide,#for_public_disturbance,#for_earthquake').hide();
		}else if(val == 'public disturbance'){
			$('#for_public_disturbance').show();
			$('#for_urban,#for_riverine,#for_landslide,#for_surge,#for_earthquake').hide();
		}else if(val == 'earthquake'){
			$('#for_earthquake').show();
			$('#for_urban,#for_riverine,#for_landslide,#for_surge,#for_public_disturbance').hide();
		}else{
			$('#for_urban,#for_riverine,#for_landslide,#for_surge,#for_public_disturbance,#for_earthquake').hide();
		}
	});
	/**
	 * Clear to default
	 */
	 $('#btn_clear').click(function(){console.log('clear')
	 	defaulData();
	 });

	 $('#calendar').on('change', function(event){
	 	getData();
	 });
	 /**
	  * Listbox Event
	  */
	  $('#urban_lst_container').on('select', function(event){
	  	var index = $("#riverine_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#riverine_lst_container').jqxListBox('unselectIndex',index);
	  	var index2 = $("#landslide_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#landslide_lst_container').jqxListBox('unselectIndex',index2);
		var index3 = $("#surge_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#surge_lst_container').jqxListBox('unselectIndex',index3);
		var index4 = $("#public_disturbance_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#public_disturbance_lst_container').jqxListBox('unselectIndex',index4);
		var index5 = $("#earthquake_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#earthquake_lst_container').jqxListBox('unselectIndex',index5);

		var args = event.args;
		if (args) {
			var index = args.index;
        	var item = args.item;
        	var value = item.value;
        	var data = _.find(update_data,['rid',value.toString()]);
        	displayData(data);
		}
	  });
	  $('#riverine_lst_container').on('select', function(event){
	  	var index = $("#urban_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#urban_lst_container').jqxListBox('unselectIndex',index);
	  	var index2 = $("#landslide_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#landslide_lst_container').jqxListBox('unselectIndex',index2);
		var index3 = $("#surge_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#surge_lst_container').jqxListBox('unselectIndex',index3);
		var index4 = $("#public_disturbance_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#public_disturbance_lst_container').jqxListBox('unselectIndex',index4);
		var index5 = $("#earthquake_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#earthquake_lst_container').jqxListBox('unselectIndex',index5);

	  	var args = event.args;
		if (args) {
			var index = args.index;
        	var item = args.item;
        	var value = item.value;
        	var data = _.find(update_data,['rid',value.toString()]);
        	displayData(data);
		}
	  });
	  $('#landslide_lst_container').on('select', function(event){
	  	var index = $("#urban_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#urban_lst_container').jqxListBox('unselectIndex',index);
	  	var index2 = $("#riverine_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#riverine_lst_container').jqxListBox('unselectIndex',index2);
		var index3 = $("#surge_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#surge_lst_container').jqxListBox('unselectIndex',index3);
		var index4 = $("#public_disturbance_lst_container").jqxListBox('getSelectedIndex');
		$('#public_disturbance_lst_container').jqxListBox('unselectIndex',index4);
		var index5 = $("#earthquake_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#earthquake_lst_container').jqxListBox('unselectIndex',index5);

	  	var args = event.args;
		if (args) {
			var index = args.index;
        	var item = args.item;
        	var value = item.value;
        	var data = _.find(update_data,['rid',value.toString()]);
        	displayData(data);
		}
	  });
	  $('#surge_lst_container').on('select', function(event){
		var index = $("#urban_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#urban_lst_container').jqxListBox('unselectIndex',index);
	  	var index2 = $("#riverine_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#riverine_lst_container').jqxListBox('unselectIndex',index2);
		var index3 = $("#landslide_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#landslide_lst_container').jqxListBox('unselectIndex',index3);
		var index4 = $("#public_disturbance_lst_container").jqxListBox('getSelectedIndex');
		$('#public_disturbance_lst_container').jqxListBox('unselectIndex',index4);
		var index5 = $("#earthquake_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#earthquake_lst_container').jqxListBox('unselectIndex',index5);

		var args = event.args;
		if (args) {
			var index = args.index;
			var item = args.item;
			var value = item.value;
			var data = _.find(update_data,['rid',value.toString()]);
			displayData(data);
		}
	});
	$('#public_disturbance_lst_container').on('select', function(event){
		var index = $("#urban_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#urban_lst_container').jqxListBox('unselectIndex',index);
	  	var index2 = $("#riverine_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#riverine_lst_container').jqxListBox('unselectIndex',index2);
		var index3 = $("#landslide_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#landslide_lst_container').jqxListBox('unselectIndex',index3);
		var index4 = $("#surge_lst_container").jqxListBox('getSelectedIndex');
		$('#surge_lst_container').jqxListBox('unselectIndex',index4);
		var index5 = $("#earthquake_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#earthquake_lst_container').jqxListBox('unselectIndex',index5);

		var args = event.args;
		if (args) {
			var index = args.index;
			var item = args.item;
			var value = item.value;
			var data = _.find(update_data,['rid',value.toString()]);
			displayData(data);
		}
	});
	$('#earthquake_lst_container').on('select', function(event){
		var index = $("#urban_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#urban_lst_container').jqxListBox('unselectIndex',index);
	  	var index2 = $("#riverine_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#riverine_lst_container').jqxListBox('unselectIndex',index2);
		var index3 = $("#landslide_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#landslide_lst_container').jqxListBox('unselectIndex',index3);
		var index4 = $("#surge_lst_container").jqxListBox('getSelectedIndex');
		$('#surge_lst_container').jqxListBox('unselectIndex',index4);
		var index5 = $("#public_disturbance_lst_container").jqxListBox('getSelectedIndex'); 
	  	$('#public_disturbance_lst_container').jqxListBox('unselectIndex',index5);

		var args = event.args;
		if (args) {
			var index = args.index;
			var item = args.item;
			var value = item.value;
			var data = _.find(update_data,['rid',value.toString()]);
			displayData(data);
		}
	});
	  /**
	   * Code for edit
	   */
		$('#display_container').on('click','.action-btn',function(){
			var action = $(this).data('action');
			var rid = $(this).parent().data('rid');console.log(rid,action)
			var data = _.find(update_data,['rid',rid.toString()]);
			update_id = parseInt(rid);
			if(action == 'edit'){
				$('#frm_rdt').val(moment(data.rdt,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm'));
				$('#remarks').val(data.remarks);
				$('input[name=affected_area][value="'+data.affected_area+'"]').click();


				var obj = [];
				
				if(data.affected_area == 'urban'){
					obj = JSON.parse(data.fdata);
					$.each(obj,function(i,e){
						if(i == 0){
							$('#street_container input[type=text]:first-child').val(e.status);
							$('#street_container select:first-child').val(e.status);
						}else{
							var html = '<tr class="to-be-remove" data-name="'+e.name+'"><td><input type="text" value="'+e.name+'"></td><td><select>'+optstreet.join('')+'</select></td><td><i class="minus icon flood-street removeself"></i></td></tr>';
							$('#street_container').append(html);
							$('#street_container tr[data-name="'+e.name+'"] select').val(e.status);
						}
					});
				}else if(data.affected_area == 'riverine'){
					obj = JSON.parse(data.fdata);
					$('#frm_riverine').val(obj.riverine);
					defaultGauges(obj.riverine);
					$.each(obj.gauges,function(i,e){
						
						var $parent = $('#for_riverine');
						$('tr[data-type='+e.type+'][data-name="'+e.name+'"] input[type=number]',$parent).val(e.value);
						$('tr[data-type='+e.type+'][data-name="'+e.name+'"] .custom-input',$parent).val(e.time);
					});
				}else if(data.affected_area == 'landslide'){
					$('#location').val(data.fdata);
				}else if(data.affected_area == 'surge'){
					$('#surge_location').val(data.fdata);
				}else if(data.affected_area == 'public disturbance'){
					$('#public_disturbance_location').val(data.fdata);
				}else if(data.affected_area == 'earthquake'){
					$('#earthquake_location').val(data.fdata);
				}
			}else{
				bootbox.confirm({
					title:'Confirm',
					size:'mini',
					message: 'Confirm delete.',
					callback: function(r){
						if(r){
							$.ajax({
								url:BaseUrl()+'ajax/weather/saveData',
								async:true,
								data:{update_id:rid,tp:'flood delete'},
								method:'POST',
								success:function(data){
									console.log(data)
									if($.trim(data) === 'OK'){
										defaulData();
										getDates();
										getData();
										$('#frmPanel').jqxPanel('scrollTo', 0, 0);
										$.notify('Success!',{position:'top center',className:'success'});
									}else{
										console.log(data);
										alert('Something went wrong while trying to delete data.');
									}
									
								},
								error:function(jqXHR,textStatus,errorThrown ){
									console.log(errorThrown);
								}
							});
						}
						
					}
				});
			}
			
		});

	/**
	 * For urban flooding adding and removing element that contains street and status
	 */
	$('#btn_addstreet').click(function(){
		var html = '<tr class="to-be-remove"><td><input type="text"></td><td><select>'+optstreet.join('')+'</select></td><td><i class="minus icon flood-street removeself"></i></td></tr>';
		$('#street_container').append(html);
	});
	$('#street_container').on('click','.removeself',function(){
		$(this).parent().parent().remove();
	});
});

function populateRiverine(){
	var riverine = [];
	$.each(gauges,function(i,e){
		riverine.push('<option value="'+e.riverine+'">'+e.riverine.toUpperCase()+'</option>')
	});
	$('#frm_riverine').html(riverine.join(''));
}

function defaultGauges(riverine){
	$('#arg_container,#wlms_container').empty();
	var arg = [], wlms = [];
	$.each(_.find(gauges,['riverine',riverine]).gauges,function(i,e){
		if(e.type == 'arg'){
			arg.push('<tr class="gauges" data-type="arg" data-name="'+e.name+'"><td>'+e.name.toUpperCase()+'</td><td><input type="number"></td><td><input class="custom-input time1"></td></tr>');
		}else{
			wlms.push('<tr class="gauges" data-type="wlms" data-name="'+e.name+'"><td>'+e.name.toUpperCase()+'</td><td><input type="number"></td><td><input class="custom-input time2"></td></tr>');
		}
	});

	$('#arg_container').html(arg.join(''));
	$(".time1").jqxMaskedInput({ mask: '##:## - ##:##',width:'100%',height:'100%', theme:'metro'});

	if(wlms.length > 0){
		$('#wlms_container').html(wlms.join(''));
		$(".time2").jqxMaskedInput({ mask: '##:##',width:'100%',height:'100%', theme:'metro'});
	}
}
function defaulData(){
	update_id = 0;
	$('input[name=affected_area][value=urban]').click();
	$('#frm_rdt').val(moment().format('YYYY-MM-DDTHH:mm'));
	$('#frm_riverine').val($('#frm_riverine option:first-child').val());
	$('#remarks,#location,#surge_location,#public_disturbance_location,#earthquake_location').val('');
	$('#display_container').empty();
	defaultGauges('cdo');
	$('.to-be-remove').remove();
	$('#street_container input[type=text]').val('');
	$('#street_container select').val($('#street_container select option:first-child').val());
}

function getDates(){
	$("#calendar").jqxCalendar('specialDates',[]);
	$.ajax({
		url:BaseUrl()+'ajax/weather/getFloodData',
		async:true,
		data:{type:'dates'},
		method:'POST',
		success:function(data){
			
			if(IsJsonString(data)){
				var obj = JSON.parse(data);
				$.each(obj,function(i,e){
					$("#calendar").jqxCalendar('addSpecialDate',moment(e.dt,'YYYY-MM-DD')._d , '', 'Total: '+e.cnt);
				});
			}else{
				console.log(data)
			}
			// 
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
		}
	});
}

function getData(){
	var rdt = moment($('#calendar').val()).format('YYYY-MM-DD')
	$.ajax({
		url:BaseUrl()+'ajax/weather/getFloodData',
		async:true,
		data:{type:'data',rdt:rdt},
		method:'POST',
		success:function(data){
			
			if(IsJsonString(data)){
				var obj = JSON.parse(data);console.log(obj)
				update_data = obj;
				var uobj = [], robj = [], lobj = [], sobj = [], pdobj = [], eobj = [];
				$.each(update_data,function(i,e){
					if(e.affected_area == 'urban'){
						uobj.push(e);
					}else if(e.affected_area == 'riverine'){
						robj.push(e);
					}else if(e.affected_area == 'landslide'){
						lobj.push(e);
					}else if(e.affected_area == 'surge'){
						sobj.push(e);
					}else if(e.affected_area == 'public disturbance'){
						pdobj.push(e);
					}else if(e.affected_area == 'earthquake'){
						eobj.push(e);
					}
				});
				$('#ucnt').text(uobj.length);
				$('#rcnt').text(robj.length);
				$('#lcnt').text(lobj.length);
				$('#scnt').text(sobj.length);
				$('#pdcnt').text(pdobj.length);
				$('#ecnt').text(pdobj.length);

				$('#urban_lst_container').jqxListBox({source:loadSourceToListBox(uobj)});
				$('#riverine_lst_container').jqxListBox({source:loadSourceToListBox(robj)});
				$('#landslide_lst_container').jqxListBox({source:loadSourceToListBox(lobj)});
				$('#surge_lst_container').jqxListBox({source:loadSourceToListBox(sobj)});
				$('#public_disturbance_lst_container').jqxListBox({source:loadSourceToListBox(pdobj)});
				$('#earthquake_lst_container').jqxListBox({source:loadSourceToListBox(eobj)});
				
			}else{
				console.log(data)
			}
			// 
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
		},complete:function(jqXHR,textStatus){
			$('#urban_lst_container').jqxListBox('render');
			$('#riverine_lst_container').jqxListBox('render');
		}
	});
}

function loadSourceToListBox(data){
	var source = {
        datatype: "json",
        datafields: [
            { name: 'rid', type: 'int' },
            { name: 'affected_area', type: 'string' },
            { name: 'fdata', type: 'string' },
            { name: 'remarks', type: 'string' },
            { name: 'rdt', type: 'string' }
        ],
        localdata: data
    };
	var dataAdapter = new $.jqx.dataAdapter(source);
	return dataAdapter;
}

function displayData(data){
	$('#display_container').html('');
	
	var fdata = data.fdata;
	

	var html = '<div data-rid="'+data.rid+'"><button class="mini ui button yellow action-btn" data-action="edit"><i class="edit icon"></i>Edit</button><button class="mini ui button red action-btn" data-action="delete"><i class="trash alternate icon"></i>Delete</button></div>';
	if(data.affected_area == 'urban'){
		html += '<fieldset><legend>URBAN FLOODING</legend>';
		html += '<table class="ui celled table"><thead><tr><th>Street Name</th><th>Status</th></tr></thead><tbody>';
		fdata = JSON.parse(fdata);
		$.each(fdata,function(i,e){
			html += '<tr><td>'+e.name+'</td><td>'+e.status+'</td></tr>';
		});
		html += '</tbody></table>';
	}else if(data.affected_area == 'riverine'){
		fdata = JSON.parse(fdata);
		var travel = _.find(gauges,['riverine',fdata.riverine]).travel; 
		html += '<fieldset><legend>RIVERINE FLOODING ('+fdata.riverine.toUpperCase()+')</legend>';

		var arg = [], wlms = [];

		$.each(fdata.gauges,function(i,e){
			if(e.type == 'arg'){
				arg.push(e);
			}else{
				wlms.push(e);
			}
		});

		var ahtml = '<table class="ui celled table"><thead><tr><th>Automatic Rain Gauge<br>(ARG)</th><th>Accumulated Rain<br>(mm)</th><th>Time Span</th></tr></thead><tbody>';
		$.each(arg,function(i,e){
			var tarr = e.time.split(' - ');
			// var time = moment(data.rdt,'YYYY-MM-DD HH:mm:ss').format('MMMM D, YYYY')+' '+moment(tarr[0],'HH:mm').format('h:mma')+'-'+moment(tarr[1],'HH:mm').format('h:mma');
			var datetime = '';
			var time = '';
			var date = moment(data.rdt,'YYYY-MM-DD HH:mm:ss').format('MMMM D, YYYY');
			var from_time = moment(tarr[0],'HH:mm').format('h:mma');
			var to_time = moment(tarr[1],'HH:mm').format('h:mma');
			time = ( from_time == 'Invalid date' && to_time == 'Invalid date' ) ? 'No available data' : from_time+'-'+to_time;
			datetime = date+' '+time;
			ahtml += '<tr><td style="text-transform:capitalize;">'+e.name+'</td><td>'+e.value+'</td><td>'+datetime+'</td></tr>';
		});
		ahtml += '</tbody></table>';
		var whtml = ''
		if(wlms.length > 0){
			whtml += '<table class="ui celled table"><thead><tr><th>Location of WLMS</th><th>Peak (m)</th><th>Time</th></tr></thead><tbody>';
			$.each(wlms,function(i,e){
				// var time = moment(data.rdt,'YYYY-MM-DD HH:mm:ss').format('MMMM D, YYYY')+' '+moment(e.time,'HH:mm').format('h:mma');
				var datetime = '';
				var date = moment(data.rdt,'YYYY-MM-DD HH:mm:ss').format('MMMM D, YYYY');
				var time = ( moment(e.time,'HH:mm').format('h:mma') == 'Invalid date' ) ? 'No available data' : moment(e.time,'HH:mm').format('h:mma');
				datetime = date+' '+time;
				whtml += '<tr><td>'+e.name+'</td><td>'+e.value+'</td><td>'+datetime+'</td></tr>';
			});
			whtml += '</tbody></table>';

			var tthtml = '';
			if(travel !== undefined){
				tthtml += '<table class="ui celled table">';
				tthtml += '<thead><tr><th colspan="2">Travel Time</th></tr></thead>';
				$.each(travel,function(i,e){
					var from = _.find(wlms,['name',e.from]);
					var to = _.find(wlms,['name',e.to]);
					var timed = '--:--';
					if(from.time !== '__:__' && to.time !== '__:__'){
						var df = moment(to.time,'HH:mm').diff(moment(from.time,'HH:mm'));
						var dur = moment.duration(df);
						var time = [(dur.hours() == 0?'':dur.hours()+' hours')];
						time.push((dur.minutes() == 0?'':dur.minutes()+' minutes'));
						timed = time.join(' ');
					}

					tthtml += '<tr><td>'+from.name.toUpperCase()+' -> '+to.name.toUpperCase()+'</td><td>'+timed+'</td></tr>';
				});
				tthtml += '</table>';
			}
			whtml += tthtml;
		}

		html += '<div class="ui stackable two column grid">';
		html += '<div class="column">'+ahtml+'</div>';
		html += '<div class="column">'+whtml+'</div>';
		html += '</div>';
	}else if(data.affected_area == 'landslide'){
		html += '<fieldset><legend>URBAN FLOODING</legend>';
		html += '<strong>Location: </strong><span>'+fdata+'<span>';
	}else if(data.affected_area == 'surge'){
		html += '<fieldset><legend>SURGE</legend>';
		html += '<strong>Location: </strong><span>'+fdata+'<span>';
	}else if(data.affected_area == 'public disturbance'){
		html += '<fieldset><legend>PUBLIC DISTURBANCE</legend>';
		html += '<strong>Location: </strong><span>'+fdata+'<span>';
	}else if(data.affected_area == 'earthquake'){
		html += '<fieldset><legend>EARTHQUAKE</legend>';
		html += '<strong>Location: </strong><span>'+fdata+'<span>';
	}
	html += '<br><fieldset><legend>REMARKS</legend><div style="padding:10px;">'+data.remarks+'</div></fieldset>'
	html += '</fieldset>';

	$('#display_container').html(html);
}
