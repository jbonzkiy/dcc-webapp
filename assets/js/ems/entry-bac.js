var fdt = '', tdt = '';
$(function(){
	console.log('ready');
	var htmH = $(window).innerHeight();
	$('#gridcontainer').css('height',(htmH-57)+'px');
	$('#frmPanel').css('height',(htmH-100)+'px');
	//Initialize JQWidget
	// $("#frmPanel").jqxPanel({ width: '100%', height: '100%',theme:'metrodark',autoUpdate:true});

	//prepare grid columns
	var col = [
		//{ text: 'ID',  datafield: 'id', width: '40px',cellsalign:'center',align:'center',resizable:false },
		{ text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,
		cellsrenderer: function (row, column, value) {
			var r = row;
			// console.log(r,row,r++,(r + 1))
			return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
		}},
		{ text: 'Dispatch ID',  datafield: 'dispatch_id', width: '80px',cellsalign:'center',align:'center',resizable:false },
		{ text: 'Datetime',  datafield: 'dispatch_dt', width: '120px',cellsalign:'center',align:'center' },
		{ text: 'Category',  datafield: 'cat', width: '60px',cellsalign:'center',align:'center',resizable:false },
		{ text: 'Case type',  datafield: 'type', width: '100px',cellsalign:'center',align:'center' },
		{ text: 'Sub case type',  datafield: 'name', width: '100px',cellsalign:'center',align:'center' },
		{ text: 'Patient',  datafield: 'pname', width: '100px',cellsalign:'center',align:'center',resizable:false },
		{ text: 'Gender',  datafield: 'p_gender', width: '50px',cellsalign:'center',align:'center',resizable:false },
		{ text: 'Location',  datafield: 'location', width: '200px',align:'center' },
		{ text: 'Hospital',  datafield: 'hospital', width: '200px',align:'center' },
		{ text: 'Specify',  datafield: 'spHospital', width: '200px',align:'center' },
		{ text: 'Remarks',  datafield: 'remarks', width: 'auto',align:'center' },
		{ text: 'LogBy',  datafield: 'uname', width: '60px',cellsalign:'center',align:'center',resizable:false },
		{ text: 'LINK', width: '100px',cellsalign:'center',align:'center',resizable:false,filterable:false,
		cellsrenderer: function (row, column, value) {
			var data = $('#grid').jqxGrid('getrowdata', row);//console.log(data)
			var dtmoment = moment(data.dispatch_dt,'YYYY-MM-DD HH:mm:ss');
			var monthyear = dtmoment.format('MMMM YYYY');
			var dt = dtmoment.format('MMMM D, YYYY');
			var host = window.location.hostname;//'localhost';
			var nlnk = "\\\\"+host+"\\2 network forlder\\Emergency Medical Services (EMS)\\PPCR\\PPCR 2021\\"+monthyear+" Scanned PPCR\\"+dt+"\\"+data.dispatch_id+".jpg"
			//dispatch_dt: "2021-05-17 10:25:41"
			//\\192.168.0.200\2 network forlder\Emergency Medical Services (EMS)\PPCR\PPCR 2021\May 2021 Scanned PPCR\May 17, 2021\262276.jpg
			// var lnk = (data.lnk == ''?'':'<a href="'+BaseUrl()+'sample.html" target="_blank">'+data.lnk+'</a>');
			
			// var h = data.lnk.search('192.168.0.200');
			// var hst = (h !== -1)?'192.168.0.200':'192.168.0.2';
			// var dlnk = data.lnk.replace(hst, host);console.log(dlnk)
			var lnk = '<a href="'+nlnk+'" target="_blank">'+nlnk+'</a>';
			// var lnk = (data.lnk == ''?'':dlnk);
			//jqx-grid-cell-left-align
			// return '<div class="jqx-grid-cell-middle-align" style="margin-top:8px;">'+lnk+'</div>';
			return '<div class="jqx-grid-cell-left-align" style="margin-top:8px;">'+lnk+'</div>';
		}},
		{ datafield: 'tl_id', hidden:true },
		{ datafield: 'case_type', hidden:true },
		{ datafield: 'case_sub_type', hidden:true },
		{ datafield: 'id', hidden:true }
		// { datafield: 'lnk', hidden:true }
	]
	$('#grid').jqxGrid({
		width: '100%',height: '88%', theme:'metrodark',
		columns:col,
		columnsresize:true,
		enablebrowserselection:true,
		enabletooltips:true,
		showfilterrow: true,
		filterable: true,sortable:true
	});
	

	
	
	// $('#grid').jqxGrid({height: '100%'});

	$(window).on('resize', function(){
		var w = $(window).width();
		var h = $(window).innerHeight();
		$('#gridcontainer').css('height',(htmH-57)+'px');
		$('#grid').jqxGrid({height: (w <= 768?'100%':'88%')});
	});
	

	$('input[type=file]').change(function () {
		var fd = new FormData();
		console.log(fd)
			// $.ajax({
   //                  url: BaseUrl()+'ajax/ems/GetCaseType',
   //                  type: 'post',
   //                  data: fd,
   //                  contentType: false,
   //                  processData: false,
   //                  success: function(response){
   //                      if(response != 0){
   //                         alert('file uploaded');
   //                      }
   //                      else{
   //                          alert('file not uploaded');
   //                      }
   //                  },
   //              });
	});
	// $('#closepopup').click(function(){
	// 	$('#popcontainer').hide();
	// });
	// $(document).on('click','.pops',function(){
	// 	var src = $(this).text();
	// 	$('#popcontainer').show();
	// 	$('#popcontent').html('<img src="'+src+'" style="height:90%;width:100%;" />');
	// });

	//JQX EVENT
	$('#grid').on('rowdoubleclick',function(event){ 
		var args = event.args,
		d = args.row.bounddata,
		dt = d.dispatch_dt;//console.log(d)

		$('#clear').show();
		$('#submit').attr('data-id',d.id).removeClass('btn-dark').addClass('btn-warning').text('Update');
		$('#did').val(d.dispatch_id).focusout();
		$('#edate').val(moment(dt,"YYYY-MM-DD HH:mm:ss").format('YYYY-MM-DD'));
		$('#etime').val(moment(dt,"YYYY-MM-DD HH:mm:ss").format('HH:mm:ss'));
		$('#location').val(d.location);
		$('#casetype').val(d.case_type).change();
		$('#subcasetype').val(d.case_sub_type);
		$('#age').val(d.p_agerange);
		$('input[type=radio][name=gender][value='+d.p_gender+']','#frmPanel').prop('checked',true);
		$('#hospital').val(d.hospital);
		$('#remarks').val(d.remarks);
		$('#pname').val(d.pname);
		$('#spHospital').val(d.spHospital);
		// $('#lnk').val(d.lnk);
	});
	$('#clear').click(function(){
		$('input.form-control,texarea').val('');
		$('#submit').removeAttr('data-id').removeClass('btn-warning').addClass('btn-dark').text('Save');
		$('select').each(function(i,e){
			$(this).val($("option:first",this).val());
		});
		$('#casetype').change();
		$('#did').focus();
		$(this).hide();
	});
	PopulateHospital();
	PopulateCaseType();
	GetData();

	var sCase = GetSubCase();
	setTimeout(function(){
		$('#firstloading').fadeOut(1000);
	},1000);

	//populate show and populate sub case base on the case type
	$('#casetype').change(function(){
		var val = $(this).val();
		$('#subcase').hide();
		if(sCase[parseInt(val)] !== undefined){
			var html = '';
			$.each(sCase[parseInt(val)],function(i,e){
				html += '<option value="'+e.sid+'">'+e.name+'</option>';
			});
			$('#subcasetype').html(html);
			$('#subcase').show();
		}
	});
	$('#btnRefresh').click(function(){
		$('#grid').jqxGrid('updatebounddata');
	});
	$('#hospital').on('change',function(){
		var v = $(this).val();

		if(v == 'Specify'){
			$('#spHospitalContainer').show();
		}else{
			$('#spHospitalContainer').hide();
		}
	});

	$('#did').on('focusout',function(){
		var val = $(this).val();
		if(val != ''){
			GetCallLogData(parseInt(val));
		}else{
			$('#didloading,#errDid').hide();
			$('.form-control,.custom-control-input,.btn').prop('disabled',false);	
		}
	});
	$('#did').keyup(function(e){
		if(e.which == 13){
			var val = $(this).val();
			if(val != ''){
				GetCallLogData(parseInt(val));
			}else{
				$('#didloading,#errDid').hide();
				$('.form-control,.custom-control-input,.btn').prop('disabled',false);	
			}
		}
	})

	$('#submit').click(function(){
		var update_id = $(this).attr('data-id');
		var did = $('#did').val(),
		dt = $('#edate').val()+' '+$('#etime').val(),
		location = $('#location').val(),
		casetype = $('#casetype').val(),
		subcase = $('#subcasetype').val(),
		age = $('#age').val(),
		gender = $('input:radio:checked','#frmPanel').val(),
		hospital = $('#hospital').val(),
		remarks = $('#remarks').val(),
		pname = $('#pname').val(),
		spHospital = $('#spHospital').val(),
		// lnk = $('#lnk').val();

		subcase = (sCase[parseInt(casetype)] == undefined)?0:subcase;


		subcase = (subcase == null)?0:subcase;
		did = (did == '')?0:did;

		var errmsg = [];
		if($.trim(dt) == ''){errmsg.push({elemid:'edate',msg:'Empty'});}
		if($.trim($('#etime').val()) == ''){errmsg.push({elemid:'etime',msg:'Empty'});}
		if($.trim(location) == ''){errmsg.push({elemid:'location',msg:'Empty'});}
		$('.err').remove();
		$('.form-control').removeClass('err-input');
		if(errmsg.length > 0){
			$.each(errmsg,function(i,e){

				$('label[for='+e.elemid+']').append('<small style="color:#9e1a1a" class="err"> ('+e.msg+')</small>');
				$('#'+e.elemid).addClass('err-input');
			});
			$('#'+errmsg[0].elemid).focus();
		}else{
			var r = confirm('Confirm submission of data.');
			var d = {upid:update_id,did:parseInt(did),dt:dt,loc:location,ct:casetype,sct:subcase,age:age,gender:gender,hospital:hospital,remarks:remarks,pname:pname,spHospital:spHospital};
			console.log(d)
			if(r){
				$('.form-control,.custom-control-input,.btn').prop('disabled',true);
				var urfn = (update_id === ''|| update_id === undefined)?'AddData':'UpdateData';
				$.post(BaseUrl()+'ajax/ems/'+urfn,d,function(data){
					if($.trim(data) == 'OK'){
						$('input.form-control,textarea','#frmPanel').val('');
						$('#submit').removeAttr('data-id').removeClass('btn-warning').addClass('btn-dark').text('Save');
						$('select').each(function(i,e){
							$(this).val($("option:first",this).val());
						});
						$('#clear').hide();
						$('#casetype').change();
						$('#subcasetype').val('');
						
						$.notify('Success!',{position:'top center',className:'success'});
						// GetData();
						$('#grid').jqxGrid('updatebounddata');
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
	$('#btnClearSearch').click(function(){
		fdt = ''; tdt = '';
		$('#fdt,#tdt').val('');
		GetData();
	});

	$('#btnReport').click(function(){
		fdt = $('#fdt').val(),tdt = $('#tdt').val();
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
					html += '<option value="'+e.cid+'">'+e.type+'</option>';
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

function GetCallLogData(did){
	$('#didloading').show();
	$('#errDid').hide();
	$('.form-control,.custom-control-input,.btn').prop('disabled',true);
	$('#edate,#etime,#location').prop('disabled',false);
	var didValid = false;
	$.ajax({
		url:BaseUrl()+'ajax/ems/GetCallLogData',
		async:true,
		data:{did:did},
		method:'POST',
		success:function(data){
			if(IsJsonString(data)){
				var obj = JSON.parse(data);console.log(obj)
				if(obj !==  null){
					var dt = moment(obj.Date_Log,"YYYY-MM-DD HH:mm:ss");
					$('#edate').val(dt.format("YYYY-MM-DD"));
					$('#etime').val(dt.format("HH:mm:ss"));
					$('#location').val(obj.Address);
					didValid = true;
				}else{
					$('#errDid').show();
				}
			}else{
				console.log(data);
				alert('Data is not a valid JSON string.');
			}
			$('#didloading').hide();
			$('.form-control,.custom-control-input,.btn').prop('disabled',false);	
			if(didValid){
				$('#edate,#etime,#location').prop('disabled',true);
			}
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			alert(textStatus);
			$('#didloading,#errDid').hide();
			$('.form-control,.custom-control-input,.btn').prop('disabled',false);
		}
	});
}

function PopulateHospital(){
	var harr = ['Polymedic Medical Plaza','Capitol University Hospital',
	'J.R Borja General Hospital','Sabal Hospital','Cagayan de Oro Medical Center',
	'German Doctors Hospital','Northern Mindanao Medical Center','Maria Reyna-Xavier University Hospital',
	'Xavier University Community Health Care Center','Puerto Community Hospital',
	'Polymedic General Hospital','Madonna and Child Hospital','Outside CDO Hospital','Refuse to Transport'];
	harr.sort();
	var html = '';
	$.each(harr,function(i,e){
		html += '<option value="'+e+'">'+e+'</option>';
	});
	html += '<option value="Specify">Specify</option>';
	$('#hospital').html(html);
}

function GetData(type){
	type = (type == undefined)?'default':'filtered';
	var mdt = moment().format('YYYY-MM-DD');
	fdt = (fdt === undefined ||fdt == '')?mdt:fdt;
	tdt = (tdt === undefined ||tdt == '')?mdt:tdt;
	var source =
    {
        datafields:
        [
            { name: 'id', type: 'int' },
            { name: 'dispatch_id', type: 'string' },
            { name: 'dispatch_dt', type: 'string' },
            { name: 'location', type: 'string'},
            { name: 'case_type', type: 'int' },
            { name: 'case_sub_type', type: 'int' },
            { name: 'p_gender', type: 'string' },
            { name: 'p_agerange', type: 'int' },
            { name: 'hospital', type: 'string' },
            { name: 'remarks', type: 'string' },
            { name: 'tl_id', type: 'int'},
            { name: 'uname', type: 'string' },
            { name: 'type', type: 'string' },
            { name: 'cat', type: 'string' },
            { name: 'name', type: 'string'},
            { name: 'dt_created', type: 'string' },
            { name: 'pname', type: 'string' },
            { name: 'spHospital', type: 'string' }
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
    var dataAdapter = new $.jqx.dataAdapter(source);
    $('#grid').jqxGrid({source:dataAdapter});
	// $.ajax({
	// 	url:BaseUrl()+'ajax/ems/GetData',
	// 	async:true,
	// 	data:{dt:moment().format('YYYY-MM-DD')+'/'+moment().format('YYYY-MM-DD')},
	// 	method:'POST',
	// 	success:function(data){
	// 		if(IsJsonString(data)){
	// 			var obj = JSON.parse(data);console.log(obj)
				
	// 		}else{
	// 			console.log(data);
	// 			alert('Data is not a valid JSON string.');
	// 		}
	// 	},
	// 	error:function(jqXHR,textStatus,errorThrown ){
	// 		console.log(errorThrown);
	// 		alert(textStatus);
	// 	}
	// });
}