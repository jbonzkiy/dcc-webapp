var fdt = '', tdt = '', lnkExist = false,ambu = undefined,ambulst = [],pendingCurRow = undefined;
var uid = parseInt($('#versplit').data('uid'));
var utype = $('#versplit').data('utype');console.log(utype)
var transport_type_list = [],hospital_list = [];
var Time_Dispatched = undefined,Time_Departed = undefined,Time_Arrived = undefined,Time_Accomplished = undefined;
$(function(){
	console.log('ready');
	var htmH = $(window).innerHeight();
	var navinnerheight = $('.navbar').innerHeight() + 5;
	populateTeam(0);//populate team
	//initialize jqxwindow
	$('#pendingWindow').jqxWindow({
		autoOpen:false,animationType:'none',height:'500px',width:'700px',resizable:true,theme:'web',
		minHeight:'300px',minWidth:'300px'
	});
	$('#btnPending').click(function(){
		$('#pendingWindow').jqxWindow('open');
	});

	$('#versplit').jqxSplitter({  width: '100%', height: (htmH-navinnerheight)+'px',resizable:false,splitBarSize:0, panels: [{ size: 300,collapsible:false }],theme:'metrodark' });
	$('#horsplit').jqxSplitter({  width: '100%', height: '100%',resizable:false,splitBarSize:0,orientation:'horizontal', panels: [{ size:$('#filtercontainer').innerHeight()+'px',collapsible:false }],theme:'metro' });
	$("#vhsplit").jqxSplitter({width: '100%', height: '100%',orientation:'horizontal',panels:[{ size: 30,collapsible:false }],showSplitBar:false,theme:'metrodark'});
	$("#frmPanel").jqxPanel({ width: '100%', height: '100%',theme:'metro',autoUpdate: true});

	//prepare grid columns
	var col = [
		//{ text: 'ID',  datafield: 'id', width: '40px',cellsalign:'center',align:'center',resizable:false },
		{ text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,pinned:true,
		cellsrenderer: function (row, column, value) {
			var r = row;
			// console.log(r,row,r++,(r + 1))
			return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
		}},
		{ text: '', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,sortable:false,pinned:true,
		cellsrenderer: function (row, column, value) {
			
			var btns = [
				'<i class="mdi mdi-trash-can action-btns" style="cursor:pointer;font-size:24px;" data-action="delete" data-row="'+row+'" title="Delete"></i>'
			];
			return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>"+btns.join('&nbsp;&nbsp;')+"</div>";
		},hidden:(utype == "user")},
		{ text: 'PPCR <i class="mdi mdi-autorenew mdi-spin" id="hrg"></i>',datafield:'ppcr', width: '70px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,sortable:false,pinned:true,
			cellsrenderer: function (row, column, value) {
				var rdata = $('#grid').jqxGrid('getrowdata', row);
				$('#hrg').show();
				var dtmoment = moment(rdata.ddate,'YYYY-MM-DD');
				var monthyear = dtmoment.format('MMMM YYYY');
				var dt = dtmoment.format('MMMM D, YYYY'); 
				var yr = dtmoment.format('YYYY');//console.log(e.ddate,yr)
				var host = window.location.hostname;//'localhost';
				host = '127.0.0.1:8887';
				var nlnk = "http://127.0.0.1:8887/Emergency%20Medical%20Services%20(EMS)/PPCR/PPCR%20"+yr+"/"+monthyear.replace(' ','%20')+"%20Scanned%20PPCR/"+dt.replace(' ','%20').replace(',','%2c')+"/"+rdata.dispatch_id+".jpg";
				// var nlnk = "http://127.0.0.1:8887/Emergency%20Medical%20Services%20(EMS)/PPCR/PPCR%20"+yr+"/"+monthyear.replace(' ','%20')+"%20Scanned%20PPCR/"+e.dispatch_id+".jpg";
				var lnk = undefined;
				fetch(nlnk)
				.then(function(data) {
					if(data.status === 200){
						lnk = '<a href="'+nlnk+'" class="text-light" target="_blank"><i class="mdi mdi-file-link-outline"></i> PPCR</a>';
						$("#grid").jqxGrid('setcellvalue', row, 'ppcr', lnk);
					}else{
						lnk = '';
						$("#grid").jqxGrid('setcellvalue', row, 'ppcr', '');
					}
					$('#hrg').hide();
				}).catch(function() {
					$('#hrg').hide();
			    });
			}

		},
		{ text: 'Dispatch ID',  datafield: 'dispatch_id', width: '80px',cellsalign:'center',align:'center',resizable:false,pinned:true },
		// { text: 'dup',  datafield: 'no', width: '80px',cellsalign:'center',align:'center',resizable:false,hidden:(uid != 1) },
		{ text: 'Date', datafield: 'ddate', width: '80px',cellsalign:'center',align:'center',filtertype:'date',cellsformat:'yyyy-MM-dd',pinned:true },
		{ text: 'Time', datafield: 'dtime', width: '60px',cellsalign:'center',align:'center',pinned:true },
		{ text: 'Barangay',  datafield: 'Barangay', width: '80px',align:'center',cellsalign:'center',pinned:true},
		{ text: 'Location',  datafield: 'location', width: '200px',align:'center',pinned:true },
		{ text: 'Category',  datafield: 'cat',filtertype:'checkedlist',filteritems:['Medical','Trauma','Others'], width: '60px',cellsalign:'center',align:'center',resizable:false,pinned:true },
		{ text: 'Case type',  datafield: 'type', width: '125px',cellsalign:'center',align:'center',pinned:true },
		{ text: 'Sub case type',  datafield: 'name', width: '100px',cellsalign:'center',align:'center',
			cellsrenderer:function (row, column, value) {
				var rdata = $('#grid').jqxGrid('getrowdata', row);
				var val = (rdata.case_type != 45)?value:'';
				return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + val + "</div>";
			}
		},
		{ text: 'Patient',  datafield: 'pname', width: '150px',cellsalign:'left',align:'center' },
		{ text: 'Age',  datafield: 'p_agerange', width: '50px',cellsalign:'left',align:'center' },
		{ text: 'Gender',  datafield: 'p_gender',filtertype:'checkedlist',filteritems:['male','female'], width: '50px',cellsalign:'center',align:'center',resizable:false },
		{ text: 'CP Num',  datafield: 'pnum', width: '80px',cellsalign:'center',align:'center',resizable:false },
		{ text: 'Intoxicated',  datafield: 'intoxicated',filtertype:'checkedlist',filteritems:['yes','no'], width: '50px',cellsalign:'center',align:'center',resizable:false },
		{ text: 'Covid',  datafield: 'p_covid',filtertype:'checkedlist',filteritems:['yes','no','suspected'], width: '80px',cellsalign:'center',align:'center',resizable:false },

		{ text: 'Vacs Dose',  datafield: 'vdose',filtertype:'checkedlist',filteritems:['0','1','2'], width: '50px',cellsalign:'center',align:'center',resizable:false },
		{ text: 'Vacs Name',  datafield: 'vname', width: '80px',cellsalign:'center',align:'center',resizable:false },
		{ text: 'Vacs Date',  datafield: 'vdate',filtertype:'date',cellsformat:'yyyy-MM-dd', width: '100px',cellsalign:'center',align:'center',resizable:false, cellsrenderer:function (row, column, value) {
				var rdata = $('#grid').jqxGrid('getrowdata', row);console.log(value)
				var val = (rdata.vdose != 0)?moment(value).format('YYYY-MM-DD'):'';

				return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + val + "</div>";
			}
		},
		{ text: 'Transport Type',  datafield: 'transport_type', width: '100px',align:'center',filtertype:'checkedlist',filteritems:transport_type_list },
		{ text: 'Alpha',  datafield: 'ambu',filtertype:'checkedlist',filteritems:ambulst, width: '60px',cellsalign:'center',align:'center',resizable:false },
		{ text: 'Transported From', datafield: 'transport_from', width: '200px',align:'center',filtertype:'checkedlist',filteritems:hospital_list },
		{ text: 'Transported To', datafield: 'hospital', width: '200px',align:'center',filtertype:'checkedlist',filteritems:hospital_list },
		{ text: 'Remarks',  datafield: 'remarks', width: '200px',align:'center' },
		{ text: 'Dispatched',  datafield: 'Time_Dispatched', width: '120px',cellsalign:'center',align:'center' },
		{ text: 'Departed',  datafield: 'Time_Departed', width: '120px',cellsalign:'center',align:'center' },
		{ text: 'Arrived',  datafield: 'Time_Arrived', width: '120px',cellsalign:'center',align:'center' },
		{ text: 'Accomplished',  datafield: 'Time_Accomplished', width: '120px',cellsalign:'center',align:'center' },
		{ text: 'LogBy',  datafield: 'uname',filtertype:'checkedlist', width: '60px',cellsalign:'center',align:'center',resizable:false },
		

		{ datafield: 'tl_id', hidden:true },
		{ datafield: 'case_type', hidden:true },
		{ datafield: 'case_sub_type', hidden:true },
		{ datafield: 'id', hidden:true },
		{ datafield: 'dt_created', hidden:true }
	];
	$('#grid').on('click','.action-btns',function(){
		var action = $(this).data('action');
		var row = $(this).data('row');
		var data = $('#grid').jqxGrid('getrowdata', row);//console.log(row,data)
		var r = confirm('Confirm Delete. Dispatch ID = '+data.dispatch_id);
		if(r){
			$.post(BaseUrl()+'ajax/ems/MoveDataToArchive',{id:data.id},function(d){
				if($.trim(d) == 'OK'){
					$.notify('Delete Success!',{position:'top center',className:'success'});
					// GetPendingLog();
					$('#grid').jqxGrid('updatebounddata','data');
					// $('#grid').jqxGrid('deleterow', row);
				}else{
					console.log(d);
					alert('Unable to delete data.');
				}
			});
		}
		
	});

	$('#grid').jqxGrid({
		width: '100%',height: '100%', theme:'metrodark',
		columns:col,
		columnsresize:true,
		enablebrowserselection:true,
		enabletooltips:true,
		showfilterrow: true,
		selectionmode:'checkbox',
		columnsreorder: true,
		filterable: true,sortable:true,groupable: true,
		ready:function(){
			
			
		}
	});

	//export code ni diri
	$('#btnExporttoExcel').click(function(){//console.log('exec export code')
		$("#grid").jqxGrid('exportdata', 'xls','Exported_data_'+moment().format('YYYY.MM.DD_HHmm')+'H',true,null,true,BaseUrl()+'ems/export');
	});

	$("#grid").on("bindingcomplete", function (event) {

		// loadPPCR();
	});

	$(window).on('resize', function(){
		var w = $(window).width();
		var h = $(window).innerHeight();
		// $('#vhsplit').jqxSplitter({});
		$('#versplit').jqxSplitter({orientation:(w <= 768? 'horizontal':'vertical')});
	});


	//JQX EVENT
	$('#grid').on('rowdoubleclick',function(event){ 
		var args = event.args,
		d = args.row.bounddata,
		dt = d.ddate,
		intoxicated = (d.intoxicated == ''?'no':d.intoxicated),
		p_covid = (d.p_covid == ''?'no':d.p_covid);
		ambu = d.ambu;console.log('grid rowdoubleclick data: ',d)

		Time_Dispatched = d.Time_Dispatched;
		Time_Departed = d.Time_Departed;
		Time_Arrived = d.Time_Arrived;
		Time_Accomplished = d.Time_Accomplished;
		// GetCallLogData(d.dispatch_id,ambu);
		$('#clear').show();
		
		$('#submit').attr('data-id',d.id).removeClass('btn-dark').addClass('btn-warning').text('Update').attr('data-request','');
		$('#did').val(d.dispatch_id).prop('disabled',(utype == 'admin'?false:true));//.focusout();
		$('#edate').val(moment(dt).format('YYYY-MM-DD')).prop('disabled',true);
		$('#etime').val(d.dtime).prop('disabled',true);
		$('#location').val(d.location).attr({'data-brgyid':d.brgy,'disabled':true});
		$('#casetype').val(d.case_type).change();
		$('#subcasetype').val(d.case_sub_type);
		$('#age').val(d.p_agerange);
		$('input[type=radio][name=gender][value='+d.p_gender+']','#frmPanel').prop('checked',true);
		$('input[type=radio][name=nakainom][value='+intoxicated+']','#frmPanel').prop('checked',true);
		$('input[type=radio][name=iscovid][value='+p_covid+']','#frmPanel').prop('checked',true);
		$('input[type=radio][name=isvacs][value='+d.vdose+']','#frmPanel').prop('checked',true);
		if(d.vdose != 0){
			$('#vdt'+d.vdose).val(moment(d.vdate).format('YYYY-MM-DD'));
			$('#vname').val(d.vname);
		}
		$('#transport_type').val(d.transport_type).change();
		setTimeout(function(){
			$('#hospital').val(d.hospital);
			$('#trans_from').val(d.transport_from);
		},1000)
		
		$('#remarks').val(d.remarks);
		$('#pname').val(d.pname);
		// $('#spHospital').val(d.spHospital);
		$('#pnum').val(d.pnum);
		
		if( utype == 'user'){
			if(moment().isBetween(moment(d.dt_created,'YYYY-MM-DD HH:mm:ss'),moment(d.dt_created,'YYYY-MM-DD HH:mm:ss').add(1, 'day'))){
				$('#submit').show();
			}else{
				$('#submit').hide();
			}
		}
		$('#clearall').hide();
		setTeam(d.ambu);
		// populateTeam(d.dispatch_id);
		$('#team').prop('disabled',(utype == 'admin'?false:true));
		// $('#team').val(d.ambu);
		// $('#lnk').val(d.lnk);
	});
	$('#clear').click(function(){
		Time_Dispatched = undefined;
		Time_Departed = undefined;
		Time_Arrived = undefined;
		Time_Accomplished = undefined;
		$('#submit').removeAttr('data-id').removeClass('btn-warning').addClass('btn-dark').text('Save').attr('data-request','request');
		$('select').each(function(i,e){
			$(this).val($("option:first",this).val());
		});
		$('#casetype').change();
		$('#did').focus();
		$('input.form-control,textarea','#frmPanel').val('');

		// $('#itno,#vnone,#genderMale,#covidno','#frmPanel').prop('checked',true);
		$('#frmPanel input[type="radio"]').prop('checked', false);
		
		$('#clearall').show();
		$('#subcasetype,#vdt1,#vdt2,#vname').val('');
		$('#edate,#etime,#location').prop('disabled',false).attr('data-brgyid',0);
		$('#did,#team').prop('disabled',false);
		$(this).hide();
		// populateTeam(0);
		$('#team option').each(function(i,e){$(this).show();});
	});

	$('#clearall').click(function(){
		Time_Dispatched = undefined;
		Time_Departed = undefined;
		Time_Arrived = undefined;
		Time_Accomplished = undefined;
		$('#submit').removeAttr('data-id').removeClass('btn-warning').addClass('btn-dark').text('Save').attr('data-request','request');
		$('select').each(function(i,e){
			$(this).val($("option:first",this).val());
		});
		$('#casetype').change();
		$('#did').focus();
		$('input.form-control,textarea','#frmPanel').val('');
		
		// $('#itno,#vnone,#genderMale,#covidno','#frmPanel').prop('checked',true);
		$('#frmPanel input[type="radio"]').prop('checked', false);
		
		$('#clear').hide();
		$('#subcasetype,#vdt1,#vdt2,#vname').val('');
		$('#edate,#etime,#location').prop('disabled',false).attr('data-brgyid',0);
		$('#did,#team').prop('disabled',false);
		// $(this).hide();
		// populateTeam(0);
		$('#team option').each(function(i,e){$(this).show();});
	});

	// PopulateHospital();
	PopulateCaseType();
	PopulateTransportType();
	GetData();

	var sCase = GetSubCase();
	setTimeout(function(){
		$('#firstloading').fadeOut(1000);
	},1000);

	//populate show and populate sub case base on the case type
	$('#casetype').change(function(){
		var val = $(this).val();
		var cat = $('option[value='+val+']',this).data('cat');
		$('#subcase').hide();
		if(sCase[parseInt(val)] !== undefined){
			var html = '<option></option>';
			$.each(sCase[parseInt(val)],function(i,e){
				html += '<option value="'+e.sid+'">'+e.name+'</option>';
			});
			$('#subcasetype').html(html);
			$('#subcase').show();
		}
	});
	$('#btnRefresh').click(function(){
		GetPendingLog();
		$('#grid').jqxGrid('updatebounddata');
		$('#pendingRequestGrid').jqxGrid('updatebounddata');
		
	});

	var didfunction = function(val){
		if(val != ''){
			var request = $('#submit').attr('data-request');
			if(request == 'request'){

				GetCallLogData2(val,'data');

			}
		}else{
			$('#edate,#etime,#location').val('');
			$('#team option').each(function(i,e){$(this).show();});
			$('#team').val($("#team option:first").val());
			$('#didloading,#errDid').hide();``
			$('.form-control,.custom-control-input,.btn').prop('disabled',false);
		}
	}

	$('#did').on({
		focusout:function(){
			var val = $(this).val();
			didfunction(val);
		}
	});

	$('#submit').click(function(){
		var update_id = $(this).attr('data-id');
		var did = $('#did').val(),
		dt = $('#edate').val()+' '+$('#etime').val(),
		location = $('#location').val(),
		brgyid = $('#location').attr('data-brgyid'),
		casetype = $('#casetype').val(),
		subcase = $('#subcasetype').val(),
		age = $('#age').val(),
		gender = $('input[name="gender"]:radio:checked','#frmPanel').val(),
		hospital = $('#hospital').val(),
		trans_from = $('#trans_from').val(),
		remarks = $('#remarks').val(),
		pname = $('#pname').val(),
		// spHospital = $('#spHospital').val(),
		pnum = $('#pnum').val(),
		// lnk = $('#lnk').val();
		intoxicated = $('input[name="nakainom"]:radio:checked','#frmPanel').val(),
		pcovid = $('input[name="iscovid"]:radio:checked','#frmPanel').val(),
		subcase = (sCase[parseInt(casetype)] == undefined)?0:subcase,
		team = $('#team').val(),
		vdose = $('input[name="isvacs"]:radio:checked','#frmPanel').val(),
		vdate = (vdose == 0)?'':$('#vdt'+vdose).val(),
		vname = $('#vname').val(),
		transport_type = $('#transport_type').val();

		trans_from = ($('option[value="'+transport_type+'"]',$('#transport_type')).data('from') == 'na')?'':trans_from;
		// this is only available on trans_from field.
		var trans_from_arr = [
			'CIU-CIU', 'CIU-TTMF', 'CIU-HOME', 'CIU-FACILITY', 'CIU-HOSPITAL',
			'HOSPITAL-CIU', 'HOSPITAL-TTMF', 'HOSPITAL-HOME', 'HOSPITAL-HOSPITAL',
			'TTMF-TTMF', 'TTMF-CIU', 'TTMF-HOME', 'TTMF-FACILITY', 'TTMF-HOSPITAL'
		];

		var request = $(this).attr('data-request');
		var isrequest = (request == 'request');

		subcase = (subcase == null)?0:subcase;
		did = (did == '')?0:did;

		if(uid === undefined){
			alert('Session expired. Please re-login. Thank you!');
			location.reload();
			return false;
		}

		var d = {upid:update_id,did:did,dt:dt,loc:location,ct:casetype,sct:subcase,age:age,gender:gender,p_covid:pcovid,intoxicated:intoxicated,hospital:hospital,remarks:remarks,pname:pname,pnum:pnum,team:team,brgyid:brgyid,vdose:vdose,vdate:vdate,vname:vname,transport_type:transport_type,userid:uid,request:request,transport_from:trans_from,Time_Dispatched:Time_Dispatched,Time_Departed:Time_Departed,Time_Arrived:Time_Arrived,Time_Accomplished:Time_Accomplished};
		console.log(d)

		var errmsg = [];
		
		if($.trim(dt) == ''){errmsg.push({elemid:'edate',msg:'Empty'});}
		if($.trim($('#etime').val()) == ''){errmsg.push({elemid:'etime',msg:'Empty'});}
		if($.trim(location) == ''){errmsg.push({elemid:'location',msg:'Empty'});}
		if($.trim(team) == ''){errmsg.push({elemid:'team',msg:'Empty'});}

		if($.trim(pname) == ''){errmsg.push({elemid:'pname',msg:'Empty'});}
		if($.trim(pnum) == ''){errmsg.push({elemid:'pnum',msg:'Empty'});}
		if($.trim(age) == ''){errmsg.push({elemid:'age',msg:'Empty'});}
		if($.trim(gender) == ''){errmsg.push({elemid:'genderFieldSet',msg:'Empty'});}

		if($.trim(casetype) == '57'){errmsg.push({elemid:'casetype',msg:'Empty'});}
		// (4) body weakness, (12) edema, (49) obstetrics, (28) pain
		if( ( $.trim(casetype) == '4' || $.trim(casetype) == '12' || $.trim(casetype) == '49' || $.trim(casetype) == '28' ) && $.trim(subcase) == '' ){errmsg.push({elemid:'subcasetype',msg:'Empty'});}
		if($.trim(intoxicated) == ''){errmsg.push({elemid:'intoxicated',msg:'Empty'});}
		if($.trim(pcovid) == ''){errmsg.push({elemid:'pcovidFieldSet',msg:'Empty'});}

		if(vdose == undefined){errmsg.push({elemid:'vdoseFieldSet',msg:'Empty'});}
		if( (vdose != 0 && vdose != undefined) && $.trim(vname) == ''){errmsg.push({elemid:'vname',msg:'Empty'});}
		if($.trim(transport_type).toLowerCase() == ''){errmsg.push({elemid:'transport_type',msg:'Empty'});}
		if(trans_from_arr.includes($.trim(transport_type)) && $.trim(trans_from).toLowerCase() == ''){errmsg.push({elemid:'trans_from',msg:'Empty'});}
		if($.trim(hospital).toLowerCase() == ''){errmsg.push({elemid:'hospital',msg:'Empty'});}

		$('.err').remove();
		$('.form-control').removeClass('err-input');
		$('.custom-fieldset').removeClass('err-input');
		if(errmsg.length > 0){
			$.each(errmsg,function(i,e){

				$('label[for='+e.elemid+']').append('<small style="color:#9e1a1a" class="err"> ('+e.msg+')</small>');
				$('#'+e.elemid).addClass('err-input');
			});
			$('#'+errmsg[0].elemid).focus();
		}else{
			var r = confirm('Confirm submission of data.'+(isrequest?"\nData will be add to to pending request.":''));
			
			
			if(r){
				$('.form-control,.custom-control-input,.btn').prop('disabled',true);console.log('submit true');
				var urfn = (update_id === ''|| update_id === undefined)?'AddData':'UpdateData';
				$.post(BaseUrl()+'ajax/ems/'+urfn,d,function(data){
					if($.trim(data) == 'OK'){
						$.notify('Success!',{position:'top center',className:'success'});
						GetPatientList();
						// populateTeam(0);
						
						// GetData();

						var filtersinfo = $('#grid').jqxGrid('getfilterinformation');//console.log('filtersinfo: ',filtersinfo.length)
						if(!isrequest){
							if(filtersinfo.length != 0){
								loadPPCR();
								$('#grid').jqxGrid('updatebounddata','cells');
							}else{
								if(update_id === undefined){
									$('#grid').jqxGrid('updatebounddata','data');
								}else{//loadPPCR();
									$('#grid').jqxGrid('updatebounddata','cells');
								}
							}
							if(pendingCurRow !== undefined){
								$('#pendingLogGrid').jqxGrid('deleterow', pendingCurRow);
								var rowcnt = $('#grid').jqxGrid('getrows').length;console.log(rowcnt);
								$('.totalpendinglog').text(rowcnt);
								pendingCurRow = undefined;
							}
						}else{
							$('#pendingRequestGrid').jqxGrid('updatebounddata','data');
						}
						$('#did,#team').prop('disabled',false);
						$('input.form-control,textarea','#frmPanel').val('');
						$('#submit').removeAttr('data-id').removeClass('btn-warning').addClass('btn-dark').text('Save').attr('data-request','request');
						$('select').each(function(i,e){
							$(this).val($("option:first",this).val());
						});
						
						$('#team option').each(function(i,e){$(this).show();});

						$('#itno,#vnone,#genderMale,#covidno','#frmPanel').prop('checked',true);
						$('#clear').hide();
						$('#casetype').change();
						$('#subcasetype,#vdt1,#vdt2,#vname').val('');
						// GetPendingLog();
						
					}else{
						console.log(data)
						alert("An error occured while trying to save the data from the database.\nNo changes has been made to the database");
					}
					$('.form-control,.custom-control-input,.btn').prop('disabled',false);
					$('#did').focus();
				});
			}
		}
		// console.log(data)
	});
	//filter date
	$('#btnSearch').click(function(){
		fdt = $('#fdt').val(),tdt = $('#tdt').val();
		fdt = moment(fdt).format('YYYY-MM-DD HH:mm:ss');
		tdt = moment(tdt).format('YYYY-MM-DD HH:mm:ss');
		if(fdt == '' || tdt == ''){
			notif('Please input date.','error');
		}else{
			if(!moment(fdt).isBefore(tdt) && fdt != tdt){
				notif('Invalid Date Range','error');
			}else{
				$('#totalsni').show();
				$('#totalsniloading').show();
				$('#totalsnicontainer').hide();
				GetData('filter');
			}
		}
	});
	$('#btnClearSearch').click(function(){
		fdt = ''; tdt = '';
		$('#fdt,#tdt').val('');
		$('#totalsni').hide();
		$('#grid').jqxGrid('clearfilters',false);
		GetData();
	});

	$('#btnReport').click(function(){
		fdt = $('#fdt').val(),tdt = $('#tdt').val();
		fdt = moment(fdt).format('YYYY-MM-DD HH:mm:ss');
		tdt = moment(tdt).format('YYYY-MM-DD HH:mm:ss');
		if(fdt == '' || tdt == ''){
			notif('Please input date.','error');
		}else{
			if(!moment(fdt).isBefore(tdt) && fdt != tdt){
				notif('Invalid Date Range','error');
			}else{
				Cookies.set('fdt', fdt);
				Cookies.set('tdt', tdt);
				window.open(BaseUrl()+'ems/report','_blank');
			}
		}
		
	});

	//get pending log
	GetPendingLog();
	//initialize pending grid
	$('#pendingLogGrid').jqxGrid({
		width: '100%',height: '90%', theme:'metrodark',
		columns:[
			//{ text: 'ID',  datafield: 'id', width: '40px',cellsalign:'center',align:'center',resizable:false },
			{ text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,
			cellsrenderer: function (row, column, value) {
				var r = row;
				// console.log(r,row,r++,(r + 1))
				return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
			}},
			{ text: 'Dispatch ID',  datafield: 'cid', width: '80px',cellsalign:'center',align:'center',resizable:false },
			{ text: 'Datetime',  datafield: 'dt', width: '80px',cellsalign:'center',align:'center',resizable:false },
			{ text: 'Time',  datafield: 'tm', width: '80px',cellsalign:'center',align:'center',resizable:false },
			{ text: 'Type of Emergency',  datafield: 'Type_Emergency', width: '100px',cellsalign:'center',align:'center',resizable:false },
			{ text: 'Team',  datafield: 'Team', width: '80px',cellsalign:'center',align:'center',resizable:false },
			{ text: 'Address',  datafield: 'Address', width: '100px',cellsalign:'center',align:'center' },
			{ text: 'Land Mark',  datafield: 'LandMark', width: '100px',cellsalign:'center',align:'center' },
			{ text: 'Remarks',  datafield: 'rmarks', width: 'auto',cellsalign:'center',align:'center' },
			{ text: 'Dispatched',  datafield: 'Time_Dispatched', width: '80px',cellsalign:'center',align:'center' },
			{ text: 'Departed',  datafield: 'Time_Departed', width: '80px',cellsalign:'center',align:'center' },
			{ text: 'Arrived',  datafield: 'Time_Arrived', width: '80px',cellsalign:'center',align:'center' },
			{ text: 'Accomplished',  datafield: 'Time_Accomplished', width: '80px',cellsalign:'center',align:'center' },
			{ datafield: 'Brgy_ID', hidden:true }
		],
		columnsresize:true,
		enablebrowserselection:true,
		enabletooltips:true,
		showfilterrow: true,
		filterable: true,
		columnsmenu:false,
		sortable:true,groupable: true,
		selectionmode:'checkbox'
	});
	//pending grid double click event
	$('#pendingLogGrid').on('rowdoubleclick',function(event){ 
		var args = event.args,
		d = args.row.bounddata;console.log('pendingLogGrid rowdoubleclick data: ',d)
		ambu = d.Team;
		//clear form
		Time_Dispatched = d.Time_Dispatched;
		Time_Departed = d.Time_Departed;
		Time_Arrived = d.Time_Arrived;
		Time_Accomplished = d.Time_Accomplished;
		$('input.form-control,textarea','#frmPanel').val('');
		$('#submit').removeAttr('data-id').removeClass('btn-warning').addClass('btn-dark').text('Save').attr('data-request','');
		$('select').each(function(i,e){
			$(this).val($("option:first",this).val());
		});
		$('#itno','#frmPanel').prop('checked',true);
		$('#genderMale','#frmPanel').prop('checked',true);
		$('#covidno','#frmPanel').prop('checked',true);
		$('#clear').hide();
		$('#clearall').show();
		$('#casetype').change();
		$('#subcasetype').val('');

		$('#did').val(d.cid).prop('disabled',(utype == 'admin'?false:true));
		$('#location').val(d.Address).prop('disabled',true);
		$('#location').attr('data-brgyid',d.Brgy_ID);
		$('#edate').val(d.dt).prop('disabled',true);
		$('#etime').val(d.tm).prop('disabled',true);
		pendingCurRow = d.boundindex;
		checkEmsDataExist(d.cid);
		// populateTeam(d.cid,ambu);
		setTeam(d.Team);
		$('#team').prop('disabled',(utype == 'admin'?false:true));
		// GetCallLogData(d.cid,ambu);
		// $('#pendingModal').modal('hide');
		// $('#pendingWindow').jqxWindow('close');
	});
	$('#pendingWindow').on('resizing', function (event) {
		$('#pendingLogGrid').jqxGrid('refresh');
	}); 

	/***************************************************************************************/
	//code for vaccinated
	/***************************************************************************************/

	$('input[type=radio][name=isvacs]').change(function(){
		var vid = this.id;
		//disable all datepicker
		$('#vdt1,#vdt2,#vname').prop('disabled',true);
		if($.inArray(vid,['vd1','vd2']) !== -1){console.log($('#'+vid+' + input[type=date]'))
			//if 1st dose or completed is click then enabled there corresponding datepicker
			$('input[type=date][data-for='+vid+']').prop('disabled',false);
			$('#vname').prop('disabled',false);
		}else{
			$('#vdt1,#vdt2,#vname').val('');
		}
	});
	//*****************************************************************************************
	var $trans_type = $('#transport_type'),
	trans_type_val = $trans_type.val(),
	trans_type_type = $('option[value="'+trans_type_val+'"]',$trans_type).data('type'),
	trans_type_from = $('option[value="'+trans_type_val+'"]',$trans_type).data('from');
	console.log(trans_type_val,trans_type_type,trans_type_from)
	PopulateHospital(trans_type_type);
	PopulateHospital(trans_type_type,'trans_from',trans_type_from);
	$('#transport_type').change(function(){
		var val = this.value;
		var type = $('option[value="'+val+'"]',this).data('type');
		var from = $('option[value="'+val+'"]',this).data('from');
		console.log(type)
		PopulateHospital(type);
		PopulateHospital(type,'trans_from',from);
	});

	/***************************************************************************************/
	//code for pending request
	/***************************************************************************************/

	//initialize window
	$('#requestWindow').jqxWindow({
		autoOpen:false,animationType:'none',height:'600px',width:'800px',resizable:true,theme:'web',
		minHeight:'300px',minWidth:'300px'
	});
	$('#btnRequest').click(function(){
		$('#requestWindow').jqxWindow('open');
	});
//id, dispatch_id, dispatch_dt, location, brgy, ambu, case_type, case_sub_type, intoxicated, pname, p_agerange, p_gender, p_covid, vdose, vname, vdate, pnum, hospital, spHospital, transport_from, transport_type, tl_id, remarks, a.dt_created, type AS ct, name AS cst, uname, Barangay
	//intialize request grid
	$('#pendingRequestGrid').jqxGrid({
		width: '100%',height: '99%', theme:'metro',
		columns:[
			{ text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,
			cellsrenderer: function (row, column, value) {
				var r = row;
				// console.log(r,row,r++,(r + 1))
				return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
			}},
			{ text: '', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,editable:false,pinned:true,menu:false,sortable:false,
			cellsrenderer: function (row, column, value) {
				var r = row;
				return '<div class="jqx-grid-cell-middle-align" style="margin-top:4px;font-size:1vw;"><i title="Add data" class="mdi mdi-checkbox-marked text-success requestbtn" data-action="insert" data-row="'+row+'" style="cursor:pointer;"></i></div>';
			},hidden:(utype == 'user')},
			{ text: '', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,editable:false,pinned:true,menu:false,sortable:false,
			cellsrenderer: function (row, column, value) {
				var r = row;
				return '<div class="jqx-grid-cell-middle-align" style="margin-top:4px;font-size:1vw;"><i title="Delete data" class="mdi mdi-close-box text-danger requestbtn" data-action="delete" data-row="'+row+'" style="cursor:pointer;"></i></div>';
			}},
			{ text: 'Dispatch ID',  datafield: 'dispatch_id', width: '80px',cellsalign:'center',align:'center',resizable:false },
			{ text: 'Date/Time',  datafield: 'dispatch_dt', width: '100px',cellsalign:'center',align:'center' },
			{ text: 'Alpha',  datafield: 'ambu', width: '60px',cellsalign:'center',align:'center',resizable:false },
			{ text: 'Category',  datafield: 'cat', width: '60px',cellsalign:'center',align:'center',resizable:false },
			{ text: 'Case type',  datafield: 'ct', width: '100px',cellsalign:'center',align:'center' },
			{ text: 'Sub case type',  datafield: 'cst', width: '100px',cellsalign:'center',align:'center',
				cellsrenderer:function (row, column, value) {
					var rdata = $('#pendingRequestGrid').jqxGrid('getrowdata', row);
					var val = (rdata.case_type != 45)?value:'';
					return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + val + "</div>";
				}
			},
			{ text: 'Intoxicated',  datafield: 'intoxicated', width: '50px',cellsalign:'center',align:'center',resizable:false },
			{ text: 'Covid',  datafield: 'p_covid', width: '100px',cellsalign:'center',align:'center',resizable:false },

			{ text: 'Vacs Dose',  datafield: 'vdose', width: '60px',cellsalign:'center',align:'center',resizable:false },
			{ text: 'Vacs Date',  datafield: 'vdate', width: '80px',cellsalign:'center',align:'center',resizable:false, cellsrenderer:function (row, column, value) {
					var rdata = $('#pendingRequestGrid').jqxGrid('getrowdata', row);
					var val = (rdata.vdose != 0)?value:'';
					return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + val + "</div>";
				}
			},
			{ text: 'Vacs Name',  datafield: 'vname', width: '100px',cellsalign:'center',align:'center',resizable:false },

			{ text: 'Patient',  datafield: 'pname', width: '100px',cellsalign:'left',align:'center' },

			{ text: 'Gender',  datafield: 'p_gender', width: '50px',cellsalign:'center',align:'center',resizable:false },
			{ text: 'Barangay',  datafield: 'Barangay', width: '100px',align:'center' },
			{ text: 'Location',  datafield: 'location', width: '200px',align:'center' },
			{ text: 'Transport Type',  datafield: 'transport_type', width: '200px',align:'center',filtertype:'checkedlist',filteritems:transport_type_list },
			{ text: 'Transported From',  datafield: 'transport_from', width: '180px',align:'center' },
			{ text: 'Transported To',  datafield: 'hospital', width: '200px',align:'center',filtertype:'checkedlist',filteritems:hospital_list },
			{ text: 'Remarks',  datafield: 'remarks', width: '200px',align:'center' },
			{ text: 'CP Num',  datafield: 'pnum', width: '100px',cellsalign:'center',align:'center',resizable:false },
			{ text: 'LogBy',  datafield: 'uname',filtertype:'checkedlist', width: '60px',cellsalign:'center',align:'center',resizable:false },
			
			{ datafield: 'tl_id', hidden:true },
			{ datafield: 'case_type', hidden:true },
			{ datafield: 'case_sub_type', hidden:true },
			{ datafield: 'id', hidden:true },
			{ datafield: 'dt_created', hidden:true }
		],
		columnsresize:true,
		enablebrowserselection:true,
		enabletooltips:true,
		// showfilterrow: true,
		// filterable: true,
		columnsmenu:false,
		sortable:true,groupable: true,
		selectionmode:'none'
	});

	$('#requestWindow').on('resizing', function (event) {
		$('#pendingRequestGrid').jqxGrid('refresh');
	}); 

	GetRequestData(uid,utype);


	$('body').on('click','.requestbtn',function(){
		var action = $(this).data('action');
		var row = $(this).data('row');
		var rdata = $('#pendingRequestGrid').jqxGrid('getrowdata', row);

		if(action == 'insert'){
			var did = rdata.dispatch_id,
			dt = rdata.dispatch_dt,
			loc = rdata.location,
			ct = rdata.case_type,
			sct = rdata.case_sub_type,
			age = rdata.p_agerange,
			gender = rdata.p_gender,
			intoxicated = rdata.intoxicated,
			covid = rdata.p_covid,
			hospital = rdata.hospital,
			remarks = rdata.remarks,
			pname = rdata.pname,
			transport_from = rdata.transport_from,
			pnum = rdata.pnum,
			tl_id = rdata.tl_id,
			ambu = rdata.ambu,
			vdose = rdata.vdose,
			vdate = rdata.vdate,
			vname = rdata.vname,
			brgy = rdata.brgy,
			transport_type = rdata.transport_type,
			rid = rdata.id;

			var d = {did:did,dt:dt,loc:loc,ct:ct,sct:sct,age:age,gender:gender,p_covid:covid,intoxicated:intoxicated,hospital:hospital,remarks:remarks,pname:pname,transport_from:transport_from,pnum:pnum,team:ambu,brgyid:brgy,vdose:vdose,vdate:vdate,vname:vname,transport_type:transport_type,userid:tl_id,request:'approve',rid:rid};
			console.log('insert request data: ',d);
			var r = confirm('Confirm submission of data.');
			if(r){
				$.post(BaseUrl()+'ajax/ems/AddData',d,function(data){
					if($.trim(data) == 'OK'){
						$.notify('Success!',{position:'top center',className:'success'});
						GetPatientList();
						$('#pendingRequestGrid').jqxGrid('updatebounddata','data');
						// populateTeam(0);
						
						// GetData();

						var filtersinfo = $('#grid').jqxGrid('getfilterinformation');//console.log('filtersinfo: ',filtersinfo.length)
						
						if(filtersinfo.length != 0){
							loadPPCR();
							$('#grid').jqxGrid('updatebounddata','cells');
						}else{
							$('#grid').jqxGrid('updatebounddata','data');
						}
						
						
					}else{
						console.log(data)
						alert("An error occured while trying to save the data from the database.\nNo changes has been made to the database");
					}
				});
			}
		}else{//delete data from ems_request_data
			var r = confirm('Confirm the deletion of data.');
			if(r){
				$.post(BaseUrl()+'ajax/ems/RemoveRequest',{request:'',rid:rdata.id},function(data){
					if($.trim(data) == 'OK'){
						$.notify('Success!',{position:'top center',className:'success'});
						$('#pendingRequestGrid').jqxGrid('updatebounddata','data');
					}else{
						console.log(data)
						alert("An error occured while trying to save the data from the database.\nNo changes has been made to the database");
					}
				});
			}
		}
	});

	$('#refreshRequest').click(function(){
		$('#pendingRequestGrid').jqxGrid('updatebounddata','data');
	});
	/***************************************************************************************/
});

function PopulateCaseType(){
	$.ajax({
		url:BaseUrl()+'ajax/ems/GetCaseType',
		async:false,
		success:function(data){
			if(IsJsonString(data)){
				var obj = JSON.parse(data),temp = '',html = '';
				$.each(obj,function(i,e){
					if(temp !== e.cat){
						temp = e.cat;
						html += '<optgroup label="'+e.cat+'">';
					}
					html += '<option value="'+e.cid+'" data-cat="'+e.cat+'">'+e.type+'</option>';
				});
				$('#casetype').html(html);
			}else{
				console.log(data);
				alert('Data is not a valid JSON string.');
			}
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			alert(textStatus);
		}
	});
}

function GetSubCase(){
	r = {};
	$.ajax({
		url:BaseUrl()+'ajax/ems/GetCaseTypeSub',
		async:false,
		success:function(data){
			if(IsJsonString(data)){
				var obj = JSON.parse(data),temp = '',temparr = [];
				r = _.groupBy(obj,'cid');
				
			}else{
				console.log(data);
				alert('Data is not a valid JSON string.');
			}
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			alert(textStatus);
		}
	});
	return r;
}

function checkEmsDataExist(did){
	$('#didloading').show();

	$.ajax({
		url:BaseUrl()+'ajax/ems/checkEmsDataExist',
		async:true,
		data:{did:did},
		method:'POST',
		success:function(data){
			
			var extname = ['','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
			$('#did').val($('#did').val()+extname[parseInt(data)]);
			
			$('#didloading').hide();
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			alert(textStatus);
			$('#didloading').hide();
		}
	});

}

/**
 * did  = dispatch/calllog_id
 * type = count/data
 * 			count - count the number of existing data from ems_data
 * 			data  - get datetime, location, vehicle name/s
 */
function GetCallLogData2(did,type){
	$('#didloading').show();
	$('#errDid').hide();
	$('.form-control,.custom-control-input,.btn,#team').prop('disabled',true);
	$('#edate,#etime,#location').prop('disabled',false);
	$('#location').attr('data-brgyid',0);
	var didValid = false;
	$.ajax({
		url:BaseUrl()+'ajax/ems/GetCallLogData2',
		async:true,
		data:{did:did,type:type},
		method:'POST',
		success:function(data){
			if(IsJsonString(data)){
				var obj = JSON.parse(data);console.log(obj)
				didValid = true;

				var dt = moment(obj.Date_Log,"YYYY-MM-DD HH:mm:ss");
				$('#edate').val(dt.format("YYYY-MM-DD"));
				$('#etime').val(dt.format("HH:mm:ss"));
				$('#location').val(obj.Address).attr('data-brgyid',obj.Brgy_ID);
				if(obj.ambu != 'NOTHING'){
					checkEmsDataExist(did);
					setTeam(obj.ambu);
				}else{
					$('#errDid').html('(No Team Dispatch)').show();
				}

			}else{
				if($.trim(data) == ''){
					$('#errDid').html('<abbr title="No data match with the given Dispatch ID">(Invalid Dispatch ID)</abbr>').show();
				}else{
					console.log(data);
					alert('Data is not a valid JSON string.');
				}
			}
			$('#didloading').hide();
			$('.form-control,.custom-control-input,.btn,#team').prop('disabled',false);	

			if(didValid){
				$('#edate,#etime,#location').prop('disabled',true);
			}
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			alert(textStatus);
			$('#didloading,#errDid').hide();
			$('.form-control,.custom-control-input,.btn,#team').prop('disabled',false);
		}
	});
}

function PopulateHospital(type,elem,from){
	elem = (elem === undefined)?'hospital':elem;
	if(elem == 'trans_from'){
		$('#transfromcontainer').hide();
		if(from == 'na'){
			return false;
		}
	}else{
		$('#hospital').remove();
		if(type == 'sp'){
			$('label[for=hospital]').after('<input type="text" class="form-control form-control-sm rounded-0" id="hospital" placeholder="Specify...">');
			return false;
		}else{
			$('label[for=hospital]').after('<select class="form-control form-control-sm rounded-0" id="hospital"></select>');
		}
	}
	

	
	var arr = {
		osp:[
			{name:'',title:''},
			{name:'Cagayan de Oro Medical Center',title:''},
			{name:'Capitol University Hospital',title:''},
			{name:'J.R Borja General Hospital',title:''},
			{name:'German Doctors Hospital',title:''},
			{name:'Madonna and Child Hospital',title:''},
			{name:'Maria Reyna-Xavier University Hospital',title:''},
			{name:'Northern Mindanao Medical Center',title:''},
			{name:'NMMC-CEREID',title:''},
			{name:'Polymedic General Hospital',title:''},
			{name:'Polymedic Medical Plaza',title:''},
			{name:'Puerto Community Hospital',title:''},
			{name:'Sabal Hospital',title:''}
			
		],
		ciu:[
			{name:'',title:''},
			{name:'D Santes Place Business Hotel',title:'City Isolation Unit (CIU)'},
			{name:'Hotel Conchita',title:'City Isolation Unit (CIU)'},
			{name:'Amarea travel lodge',title:'City Isolation Unit (CIU)'},
			{name:'Rosarios Place Business Hotel',title:'City Isolation Unit (CIU)'},
			{name:'Kyross Inn',title:'City Isolation Unit (CIU)'},
			{name:'Demiren Hotel',title:'City Isolation Unit (CIU)'},
			{name:'Wills Place Business Hotel',title:'City Isolation Unit (CIU)'},
			{name:'PJ Suites',title:'City Isolation Unit (CIU)'},
			{name:'Middleton Apartelle',title:'City Isolation Unit (CIU)'}
		],
		ttmf:[
			{name:'',title:''},
			{name:'Southwinds',title:'Temporary Treatment and Monitoring Facility (TTMF+)'},
			{name:'Boystown',title:'Temporary Treatment and Monitoring Facility (TTMF)'},
			{name:'Tablon Evacuation Center',title:'Temporary Treatment and Monitoring Facility (TTMF)'},
			{name:'Eco Village',title:'Temporary Treatment and Monitoring Facility (TTMF)'},
			{name:'Cursillo House',title:'Temporary Treatment and Monitoring Facility (TTMF)'},
			{name:'Win Min Transient Inn',title:'Temporary Treatment and Monitoring Facility (TTMF)'},
			{name:'Emerald Suites',title:'Temporary Treatment and Monitoring Facility (TTMF)'},
			{name:'G-Galyx InnHotel',title:'Temporary Treatment and Monitoring Facility (TTMF)'},
			{name:'Silver Inn',title:'Temporary Treatment and Monitoring Facility (TTMF)'},
			{name:'Lestonac Youth Center',title:'Temporary Treatment and Monitoring Facility (TTMF)'},
			{name:'Catalina Inn',title:'Temporary Treatment and Monitoring Facility (TTMF)'},
			{name:'Marianne Suites',title:'Temporary Treatment and Monitoring Facility (TTMF)'},
			{name:'Natures Pensionne House',title:'Temporary Treatment and Monitoring Facility (TTMF)'},
			{name:'Manresa',title:'Temporary Treatment and Monitoring Facility (TTMF)'},
			{name:'Searsolin',title:'Temporary Treatment and Monitoring Facility (TTMF)'},
			{name:'Balay Mindanaw Foundation, Inc.',title:'Temporary Treatment and Monitoring Facility (TTMF)'},
		],
		sp:[
			{name:'Specify',title:''}
		],
		na:[
			{name:'N/A',title:''}
		]

	};
	var html = '';

	$.each(arr,function(i,e){
		$.each(e,function(i2,e2){
			hospital_list.push(e2.name);
		});
	});

	type = (elem == 'trans_from')?from:type;

	$.each(arr[type],function(i,e){
		html += '<option value="'+e.name+'" title="'+e.title+'" '+(i == 0?'selected':'')+'>'+e.name+'</option>';
	});
	
	$('#'+elem).html(html);
	
	// $('#'+elem).change();

	if(elem == 'trans_from'){//console.log('show trans from')
		$('#transfromcontainer').show();
	}

}
function PopulateTransportType(){
	var arr = [
		{name:'',title:'',type:'',from:''},
		{name:'CIU-CIU',title:'',type:'ciu',from:'ciu'},
		{name:'CIU-TTMF',title:'',type:'ttmf',from:'ciu'},
		{name:'CIU-HOME',title:'',type:'sp',from:'ciu'},
		{name:'CIU-FACILITY',title:'',type:'sp',from:'ciu'},
		{name:'CIU-HOSPITAL',title:'',type:'osp',from:'ciu'},
		{name:'FACILITY-HOME',title:'',type:'sp',from:'na'},
		{name:'FACILITY-CIU',title:'',type:'ciu',from:'na'},
		{name:'FACILITY-TTMF',title:'',type:'ttmf',from:'na'},
		{name:'FACILITY-HOSPITAL',title:'',type:'osp',from:'na'},
		{name:'HOME-HOME',title:'',type:'sp',from:'na'},
		{name:'HOME-CIU',title:'',type:'ciu',from:'na'},
		{name:'HOME-TTMF',title:'',type:'ttmf',from:'na'},
		{name:'HOME-HOSPITAL',title:'',type:'osp',from:'na'},
		{name:'HOME-FACILITY',title:'',type:'sp',from:'na'},
		{name:'HOME-FACILITY-HOME',title:'',type:'sp',from:'na'},
		{name:'HOSPITAL-CIU',title:'',type:'ciu',from:'osp'},
		{name:'HOSPITAL-TTMF',title:'',type:'ttmf',from:'osp'},
		{name:'HOSPITAL-HOME',title:'',type:'sp',from:'osp'},
		{name:'HOSPITAL-HOSPITAL',title:'',type:'osp',from:'osp'},
		{name:'TTMF-TTMF',title:'',type:'ttmf',from:'ttmf'},
		{name:'TTMF-CIU',title:'',type:'ciu',from:'ttmf'},
		{name:'TTMF-HOME',title:'',type:'sp',from:'ttmf'},
		{name:'TTMF-FACILITY',title:'',type:'sp',from:'ttmf'},
		{name:'TTMF-HOSPITAL',title:'',type:'osp',from:'ttmf'},
		{name:'Others-HOSPITAL',title:'',type:'osp',from:'na'},
		{name:'Others',title:'',type:'sp',from:'na'},
		{name:'Outside CDO Boundary',title:'',type:'sp',from:'na'},
		{name:'Refused Transport',title:'',type:'na',from:'na'},
		{name:'Not transported',title:'',type:'na',from:'na'}
	]


	var html = '';
	$.each(arr,function(i,e){
		transport_type_list.push(e.name);
		html += '<option value="'+e.name+'" data-type="'+e.type+'" data-from="'+e.from+'" title="'+e.title+'" '+(i == 0?'selected':'')+'>'+e.name+'</option>';
	});
	$('#transport_type').html(html);
}

function GetData(type){
	type = (type == undefined)?'default':'filtered';
	var mdt = moment().format('YYYY-MM-DD');console.log(type,fdt,mdt)
	// fdt = (fdt === undefined ||fdt == '')?mdt:fdt;
	// tdt = (tdt === undefined ||tdt == '')?mdt:tdt;
	var source =
    {
        datafields:
        [
            { name: 'id', type: 'int' },
            { name: 'dispatch_id', type: 'string' },
            { name: 'ddate', type: 'date' },
            { name: 'dtime', type: 'string' },
            { name: 'location', type: 'string'},
            { name: 'case_type', type: 'int' },
            { name: 'case_sub_type', type: 'int' },
            { name: 'p_gender', type: 'string' },
            { name: 'intoxicated', type: 'string' },
            { name: 'p_agerange', type: 'int' },
            { name: 'hospital', type: 'string' },
            { name: 'remarks', type: 'string' },
            { name: 'tl_id', type: 'int'},
            { name: 'brgy', type: 'int'},
            { name: 'uname', type: 'string' },
            { name: 'type', type: 'string' },
            { name: 'cat', type: 'string' },
            { name: 'name', type: 'string'},
            { name: 'dt_created', type: 'string' },
            { name: 'pname', type: 'string' },
            { name: 'transport_from', type: 'string' },
            { name: 'pnum', type: 'string' },
            { name: 'p_covid', type: 'string' },
            { name: 'ppcr', type: 'string' },
            { name: 'ambu', type: 'string' },
            { name: 'Barangay', type: 'string' },
            { name: 'vdose', type: 'int' },
            { name: 'vdate', type: 'date' },
            { name: 'vname', type: 'string' },
            { name: 'transport_type', type: 'string' },
            { name: 'Time_Dispatched', type: 'string' },
            { name: 'Time_Departed', type: 'string' },
            { name: 'Time_Arrived', type: 'string' },
            { name: 'Time_Accomplished', type: 'string' }
            //diri esumpay tong upat
        ],
        id:'id',
        datatype: "json",
        url:BaseUrl()+'ajax/ems/GetData',
        data:{fdt:fdt,tdt:tdt,type:type},
        type:'POST',
        filter: function () {
            // update the grid and send a request to the server.
            $("#grid").jqxGrid('updatebounddata', 'filter');
        }
    };
    var dataAdapter = new $.jqx.dataAdapter(source,{
    	loadComplete: function (records) {console.log(type)
    		if(type == 'filtered'){
    			GetCountNotLog(records);
    		}
    		console.log('record',records)
    	}
    });
    $('#grid').jqxGrid({source:dataAdapter});
}

 function GetPendingLog(){console.log('get pending')
 	$('#pendingLogLoading').show();
 	$('#btnPending').prop('disabled',true);
 	$.ajax({
 		url:BaseUrl()+'ajax/ems/GetGetNotLog',
 		async:true,
 		method:'POST',
 		success:function(data){
 			if(IsJsonString(data)){
 				var obj = JSON.parse(data);console.table(obj)
 				$('.totalpendinglog').text(obj.length);
 				getGridDataForPending(obj);
 			}else{
 				console.log(data);
 				alert('Data is not a valid JSON string.');
 			}
 			$('#pendingLogLoading').hide();
 			$('#btnPending').prop('disabled',false);
 		},
 		error:function(jqXHR,textStatus,errorThrown ){
 			console.log(errorThrown);
 			alert(textStatus);
 			$('#pendingLogLoading').hide();
 			$('#btnPending').prop('disabled',false);
 		}
 	});
 }

function getGridDataForPending(objdata){

	var source =
    {
        datafields:[
				{ name: 'cid', type: 'int' },
	            { name: 'dt', type: 'string' },
	            { name: 'tm', type: 'string' },
	            { name: 'Type_Emergency', type: 'string' },
	            { name: 'Address', type: 'string'},
	            { name: 'LandMark', type: 'string'},
	            { name: 'rmarks', type: 'string'},
	            { name: 'Team', type: 'string'},
	            { name: 'Brgy_ID', type: 'int'},
	            { name: 'Time_Dispatched', type: 'string' },
	            { name: 'Time_Departed', type: 'string' },
	            { name: 'Time_Arrived', type: 'string' },
	            { name: 'Time_Accomplished', type: 'string' }
			],
        datatype: "json",
        localdata:objdata
    };
    var dataAdapter = new $.jqx.dataAdapter(source,{
    	loadComplete: function(records){//console.log(source,objdata,records);
    	}

    });
    $('#pendingLogGrid').jqxGrid({source:dataAdapter});
}
function setTeam(ambu){
	var ambuarr = ambu.split(',');console.log(ambuarr)

	$("#team option").each(function(i,e) {
		$(this).show();
    });
	$("#team option").each(function(i,e) {
		if($.inArray(this.value,ambuarr) === -1){
  			$(this).hide();
  		}
    });
    $('#team').val(ambuarr[0]);
}
function populateTeam(did,ambu){
	$('#teamloading').show();
	$.ajax({
		url:BaseUrl()+'ajax/ems/GetTeam',
		async:true,
		method:'POST',
		data:{did:did},
		success:function(data){
			if(IsJsonString(data)){
				var obj = JSON.parse(data);console.log(obj)
				var html = ['<option></option>'];
				$.each(obj,function(i,e){
					ambulst.push(e.Team);
					html.push('<option value="'+e.Team+'" '+(ambu == e.Team?'selected':'')+'>'+e.Team+'</option>');
				});
				$('#team').html(html.join(''));
			}else{
				console.log(data);
				alert('Data is not a valid JSON string.');
			}
			$('#teamloading').hide();
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			$('#teamloading').hide();
			alert(textStatus);
		}
	});
}

function GetPatientList(){

	$.ajax({
		url:BaseUrl()+'ajax/ems/GetPatientList',
		async:true,
		method:'POST',
		success:function(data){
			if(IsJsonString(data)){
				var obj = JSON.parse(data);
				var html = [];console.log(obj)
				$.each(obj,function(i,e){
					html.push('<option value="'+e.pname+'">');
				});
				$('#plist').html(html.join(''));
			}else{
				console.log(data);
				alert('Data is not a valid JSON string.');
			}
			
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			alert(textStatus);
		}
	});
}

function GetCountNotLog(records){
	
	$.ajax({
		url:BaseUrl()+'ajax/ems/GetCountNotLog',
		async:true,
		method:'POST',
		data:{fdt:fdt,tdt:tdt},
		success:function(data){
			var rows = records;
			var cntrows = rows.length;
			$('#totallog').text(cntrows);
			$('#totalpending').text(data);
			$('#totalrun').text((cntrows + parseInt(data)));
			$('#totalsniloading').hide();
			$('#totalsnicontainer').show();
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			alert(textStatus);
		}
	});
}

function loadPPCR(){
	var interval = setInterval(function(){
		var isCompleted = $("#grid").jqxGrid('isBindingCompleted');console.log(isCompleted)
		if(isCompleted){console.log('clearInterval')
			clearInterval(interval);
			var rows = $('#grid').jqxGrid('getrows');console.log('loadPPCR: ',rows)
			$('#hrg').show();
			$(rows).each(function(i,e){
				var dtmoment = moment(e.ddate,'YYYY-MM-DD');
				var monthyear = dtmoment.format('MMMM YYYY');
				var dt = dtmoment.format('MMMM D, YYYY'); 
				var yr = dtmoment.format('YYYY');//console.log(e.ddate,yr)
				var host = window.location.hostname;//'localhost';
				host = '127.0.0.1:8887';
				var nlnk = "http://127.0.0.1:8887/Emergency%20Medical%20Services%20(EMS)/PPCR/PPCR%20"+yr+"/"+monthyear.replace(' ','%20')+"%20Scanned%20PPCR/"+dt.replace(' ','%20').replace(',','%2c')+"/"+e.dispatch_id+".jpg";
				// var nlnk = "http://127.0.0.1:8887/Emergency%20Medical%20Services%20(EMS)/PPCR/PPCR%20"+yr+"/"+monthyear.replace(' ','%20')+"%20Scanned%20PPCR/"+e.dispatch_id+".jpg";
				
				fetch(nlnk)
				.then(function(data) {
					if(data.status === 200){
						var lnk = '<a href="'+nlnk+'" class="text-light" target="_blank"><i class="mdi mdi-file-link-outline"></i> PPCR</a>';
						console.log(lnk)
						$("#grid").jqxGrid('setcellvalue', e.boundindex, 'ppcr', lnk);
					}else{
						$("#grid").jqxGrid('setcellvalue', e.boundindex, 'ppcr', '');
					}
					if(rows.length == (i+1)){
						$('#hrg').hide();
					}
				}).catch(function() {
			        $('#hrg').hide();
			    });
				
			});
			if(rows.length == 0){
				$('#hrg').hide();
			}
			
		}
	},1000);
}

function GetRequestData(uid,type){
	
	var source =
    {
        datafields:
        [
            { name: 'id', type: 'int' },
            { name: 'dispatch_id', type: 'string' },
            { name: 'dispatch_dt', type: 'string' },
            { name: 'location', type: 'string'},
            { name: 'brgy', type: 'int'},
            { name: 'ambu', type: 'string' },
            { name: 'case_type', type: 'int' },
            { name: 'case_sub_type', type: 'int' },
            { name: 'intoxicated', type: 'string' },
            { name: 'pname', type: 'string' },
            { name: 'p_agerange', type: 'int' },
            { name: 'p_gender', type: 'string' },
            { name: 'p_covid', type: 'string' },
            { name: 'vdose', type: 'int' },
            { name: 'vname', type: 'string' },
            { name: 'vdate', type: 'string' },
            { name: 'pnum', type: 'string' },
            { name: 'hospital', type: 'string' },
            { name: 'transport_from', type: 'string' },
            { name: 'transport_from', type: 'string' },
            { name: 'transport_type', type: 'string' },
            { name: 'tl_id', type: 'int'},
            { name: 'remarks', type: 'string' },
            { name: 'dt_created', type: 'string' },
            { name: 'ct', type: 'string' },
            { name: 'cat', type: 'string' },
            { name: 'cst', type: 'string'},
            { name: 'uname', type: 'string' },
            { name: 'Barangay', type: 'string' }
        ],
        id:'id',
        datatype: "json",
        url:BaseUrl()+'ajax/ems/GetRequestData',
        data:{uid:uid,type:type},
        type:'POST'
    };
    var dataAdapter = new $.jqx.dataAdapter(source,{
    	beforeSend: function(xhr){
    		$('#pendingRequestLoading').show();
    	},
    	loadComplete: function (records) {
    		
    		console.log('pendingRequestGrid: ',records,records.length)
    		$('#pendingRequestLoading').hide();
    		$('.totalpendingrequest').text(records.length);
    	}
    });
    $('#pendingRequestGrid').jqxGrid({source:dataAdapter});
}