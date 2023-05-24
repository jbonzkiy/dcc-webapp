var ersData = [], ersFire = [], ersLaw = [], ersMed = [], ersRescue = [], ersOthers = [], ersHang = [], ersPrank = [], ersBlank = [], 
comData = [], comFire = [], comLaw = [], comMed = [], comRescue = [], comOthers = [], comHang = [], comPrank = [], comBlank = [],
totalErsCnt = 0, totalComCnt = 0; 

var dt_disp = '';
$(function(){
	console.log('ready');

	$('.btn,.chk,#fdt,#tdt').prop('disabled',false);
	// GetRefOtherAgencyData(moment().subtract(1,'month').startOf('month').format('YYYY-MM-DD')+'/'+moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD'));
	$('#apply_filter').click(function(){
		var fdt = $('#fdt').val(),
		tdt = $('#tdt').val(), 
		dt_display = DateDisplayFormat(moment().subtract(1,'month').startOf('month').format('YYYY-MM-DD'),moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD'));
		dt_disp = dt_display;
		$('#merge_table,#chart_data,#ref_other_data,#ws_data,#responded_data,#infocast_data').empty();
		if(fdt == '' || tdt == ''){
			fdt = moment().subtract(1,'month').startOf('month').format('YYYY-MM-DD');
			tdt = moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD');
			GetErsMonthlyCallsReceived(fdt+'/'+tdt);
		}else{
			if(!moment(fdt).isBefore(tdt) && fdt != tdt){
				alert('Invalid Date Range');
			}else{console.log(fdt,tdt)
				dt_display = DateDisplayFormat(fdt,tdt);
				EmptyData();
				GetErsMonthlyCallsReceived(fdt+'/'+tdt);
			}
		}
		$('#date_display').text(dt_display);
	});

	$('#clear_filter').click(function(){
		$('#fdt,#tdt').val('');
	});
});

function GetErsMonthlyCallsReceived(dt){
	if($('#chk_monthly_calls').prop("checked")){

		$('.btn,.chk').attr('disabled',true);
		$('.loading.col1').show();
		$('.loading.col1 .loading-text').text('Monthly Emergency Calls');
		$('.loading.col1 .loading-sub').text('Getting ERS Calls Data...');
		
		$.ajax({
			url:BaseUrl()+'ajax/report/GetErsMonthlyCallsReceive',
			async:true,
			data:{dt:dt},
			method:'POST',
			success:function(data){
				if(IsJsonString(data)){
					var ersd = JSON.parse(data);
					var tempGT = ''//temporary group type
					
					$.each(ersd, function(_i,e){
						if(tempGT !== e.group_type){
							tempGT = e.group_type;

						}
						switch(tempGT.toLowerCase()){
							case 'fire': 
								ersFire.push({incident_type:e.incident_type,ers:e.ERS});
								break;
							case 'law enforcement': 
								ersLaw.push({incident_type:e.incident_type,ers:e.ERS});
								break;
							case 'medical emergencies': 
								ersMed.push({incident_type:e.incident_type,ers:e.ERS});
								break;
							case 'rescue': 
								ersRescue.push({incident_type:e.incident_type,ers:e.ERS});
								break;
							case 'other calls': 
								if($.inArray(e.incident_type.toLowerCase(),['hang up','hang-up/non-sense','non-sense']) !== -1){
									ersHang.push({incident_type:e.incident_type,ers:e.ERS});
								}else{
									ersOthers.push({incident_type:e.incident_type,ers:e.ERS});
								}
								break;
							case 'prank': 
								ersPrank.push({incident_type:e.incident_type,ers:e.ERS});
								break;
							default:
								ersBlank.push({incident_type:e.incident_type,ers:e.ERS});
								break;
						}
					});
					ersData = [ersFire,ersLaw,ersMed,ersRescue,ersOthers,ersHang,ersPrank,ersBlank];
					
					GetComcenterMonthlyCallsReceived(dt);
				}else{
					console.log('INVALID DATA: ',data);
				}
			},
			error:function(_jqXHR,textStatus,errorThrown ){
				console.log(errorThrown);
				alert(textStatus);
			}
		});

	}else{
		GetChartData(dt);
	}
}

function GetComcenterMonthlyCallsReceived(dt){
	$('.loading.col1 .loading-sub').text('Getting COMCENTER Calls Data...');
	$.ajax({
		url:BaseUrl()+'ajax/report/GetComcenterMonthlyCallsReceive',
		async:true,
		data:{dt:dt},
		method:'POST',
		success:function(data){
			if(IsJsonString(data)){
				var comd = JSON.parse(data);
				var tempGT = ''//temporary group type
				
				$.each(comd, function(_i,e){
					if(tempGT !== e.group_type){
						tempGT = e.group_type;

					}
					switch(tempGT.toLowerCase()){
						case 'fire': 
							comFire.push({incident_type:e.incident_type,com:e.COMCENTER});
							break;
						case 'law enforcement': 
							comLaw.push({incident_type:e.incident_type,com:e.COMCENTER});
							break;
						case 'medical emergencies': 
							comMed.push({incident_type:e.incident_type,com:e.COMCENTER});
							break;
						case 'rescue': 
							comRescue.push({incident_type:e.incident_type,com:e.COMCENTER});
							break;
						case 'other calls': 
							if($.inArray(e.incident_type.toLowerCase(),['hang up','hang-up/non-sense','non-sense']) !== -1){
								comHang.push({incident_type:e.incident_type,com:e.COMCENTER});
							}else{
								comOthers.push({incident_type:e.incident_type,com:e.COMCENTER});
							}
							break;
						default:
							comBlank.push({incident_type:e.incident_type,com:e.COMCENTER});
							break;
					}
				});
				comData = [comFire,comLaw,comMed,comRescue,comOthers,comHang,comBlank];
				parseData();
				GotoEndPage();
				GetChartData(dt);
			}else{
				console.log('INVALID DATA: ',data);
			}
		},
		error:function(_jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			alert(textStatus);
		}
	});
	return comData;
}

var emsData = [], emsFire = [], emsLaw = [], emsMed = [], emsRescue = [], emsOthers = [],
	usarData = [], usarFire = [], usarLaw = [], usarMed = [], usarRescue = [], usarOthers = [];
function GetTeamMonthlyDispatch(dt){
	if($('#chk_responded').prop("checked")){
		totalErsCnt = 0, totalComCnt = 0;
		$('.btn,.chk').attr('disabled',true);
		$('.loading.col1').show();
		$('.loading.col1 .loading-text').text('Monthly Calls Responded');
		$('.loading.col1 .loading-sub').text('Getting EMS and USAR Reponded Data...');
		
		$.ajax({
			url:BaseUrl()+'ajax/report/GetMonthlyCallsResponded',
			async:true,
			data:{dt:dt},
			method:'POST',
			success:function(data){
				if(IsJsonString(data)){
					var rdata = JSON.parse(data);console.log(rdata);console.log(data)

					//separate EMS and USAR
					var ems = [], usar = [];
					$.each(rdata,function(_i,e){
						if(e.team == 'EMS'){
							ems.push(e);
						}else{
							usar.push(e);
						}
					});
					
					//separate data for fire,law,medical, and rescue for each team
					var tempGT = '';
					$.each(ems, function(_i,e){
						if(tempGT !== e.group_type){tempGT = e.group_type;}
						switch(tempGT?.toLowerCase() ?? ''){
							case 'fire': 
								emsFire.push({incident_type:e.incident_type,ers:e.cnt});
								break;
							case 'law enforcement': 
								emsLaw.push({incident_type:e.incident_type,ers:e.cnt});
								break;
							case 'medical emergencies': 
								emsMed.push({incident_type:e.incident_type,ers:e.cnt});
								break;
							case 'rescue': 
								emsRescue.push({incident_type:e.incident_type,ers:e.cnt});
								break;
							case 'other calls': 
								emsOthers.push({incident_type:e.incident_type,ers:e.cnt});
								break;
						}
					});
					tempGT = '';
					emsData = [emsFire,emsLaw,emsMed,emsRescue,emsOthers];

					$.each(usar, function(_i,e){
						if(tempGT !== e.group_type){tempGT = e.group_type;}
						switch(tempGT.toLowerCase()){
							case 'fire': 
								usarFire.push({incident_type:e.incident_type,com:e.cnt});
								break;
							case 'law enforcement': 
								usarLaw.push({incident_type:e.incident_type,com:e.cnt});
								break;
							case 'medical emergencies': 
								usarMed.push({incident_type:e.incident_type,com:e.cnt});
								break;
							case 'rescue': 
								usarRescue.push({incident_type:e.incident_type,com:e.cnt});
								break;
							case 'other calls': 
								usarOthers.push({incident_type:e.incident_type,com:e.cnt});
								break;
						}
					});
					usarData = [usarFire,usarLaw,usarMed,usarRescue,usarOthers];
					// console.log('first: ',emsData,usarData);
					var html = '<div style="font-weight: bold;">MONTHLY CALLS RESPONDED PER CATEGORY AND TYPE OF EMERGENCY</div>';
						html += '<table id="report_table">';
						html += '<tr><th>Category</th><th>Type of Emergency</th><th>EMS</th><th>USAR</th><th>TOTAL RUN</th></tr>';

					var total = GetTotal('fire',true);
					var ecnt = total.ers, ccnt = total.com;
					totalErsCnt += ecnt;
					totalComCnt += ccnt;
					html += '<tr><th colspan="2" style="text-align:left !important;">A. Fire</th><th>'+ecnt+'</th><th>'+ccnt+'</th><th>'+(ecnt+ccnt).toLocaleString('en')+'</th></tr>';

					html += createTable('law',true);
					html += createTable('med',true);
					html += createTable('rescue',true);
					html += createTable('others',true);

					html += '<tr style="text-align:center;"><th colspan="2">TOTAL</th><th>'+totalErsCnt.toLocaleString('en')+'</th><th>'+totalComCnt.toLocaleString('en')+'</th><th>'+(totalErsCnt + totalComCnt).toLocaleString('en')+'</th></tr>';

					html += '</table>';
					$('#responded_data').html(html);

					GotoEndPage();
					GetRefOtherAgencyData(dt);
				}else{
					console.log('INVALID DATA: ',data);
				}
			},
			error:function(_jqXHR,textStatus,errorThrown ){
				console.log(errorThrown);
				alert(textStatus);
			}
		});

	}else{
		GetRefOtherAgencyData(dt);
	}
}

function GetChartData(dt){
	if($('#chk_chart_data').prop("checked")){
		//0{"cat":"ers","type":"Globe","cnt":"97570"},
		//1{"cat":"ers","type":"PLDT","cnt":"8342"},
		//2{"cat":"ers","type":"radioers","cnt":"1556"},
		//3{"cat":"com","type":"CDRRMD","cnt":"795"},
		//3 4{"cat":"com","type":"Radio","cnt":"5579"},
		//4 5{"cat":"com","type":"Telephone","cnt":"6503"},
		//5 6{"cat":"com","type":"Walk-in","cnt":"105"},
		//6 7{"cat":"ers","type":"walkin","cnt":"517"}]
		var test = [
		{cat:"ers",type:"CARED",cnt:0},
		{cat:"ers",type:"TOUCHPOINT",cnt:0},
		{cat:"ers",type:"radioers",cnt:0},
		// {cat:"com",type:"CDRRMD",cnt:0},
		{cat:"com",type:"Radio",cnt:0},
		{cat:"com",type:"Telephone",cnt:0},
		{cat:"com",type:"Walk-in",cnt:0},
		{cat:"ers",type:"walkin",cnt:0}
		];
		$('.btn,.chk').attr('disabled',true);
		$('.loading.col1').show();
		$('.loading.col1 .loading-text').text('Chart Data...');
		$('.loading.col1 .loading-sub').text('');
		$.ajax({
			url:BaseUrl()+'ajax/report/GetChartData',
			async:true,
			data:{dt:dt},
			method:'POST',
			success:function(data){
				if(IsJsonString(data)){
					var cdata = JSON.parse(data);
					var merg = _.map(test,function(obj){ 
						return _.assign(obj,_.find(cdata,function(o){
							return (o.type.toLowerCase() == obj.type.toLowerCase() && o.cat.toLowerCase() == obj.cat.toLowerCase());
						}));
					});
					var html = '<br><table class="table table-bordered">';
					html += '<tr><th colspan="2" style="text-align:center;">Chart Data:</th></tr>';
					html += '<tr><th>Type</th><th>Total</th></tr>';
					html += '<tr><td>TOUCHPOINT</td><td>'+merg[1].cnt+'</td></tr>';
					html += '<tr><td>CARED</td><td>'+merg[0].cnt+'</td></tr>';
					html += '<tr><td>Radio/Landline</td><td>'+(parseInt(merg[3].cnt) + parseInt(merg[4].cnt))+'</td></tr>';
					html += '<tr><td>Walk-in</td><td>'+(parseInt(merg[5].cnt) + parseInt(merg[6].cnt))+'</td></tr>';
					html += '<tr><td>Cellphone</td><td>'+parseInt(merg[2].cnt)+'</td></tr>';
					var tot = 0;
					$.each(merg,function(_i,e){
						tot = tot + parseInt(e.cnt);
					});
					html += '<tr><th>TOTAL</th><th>'+tot+'</th></tr>';

					html += '</table>';
					html += '<br>'
					html += '<table class="table table-bordered">';
					html += '<tr><th colspan="3" style="text-align:center;">Chart Breakdown of Data:</th></tr>';
					html += '<tr><th>Origin</th><th>Type</th><th>Total</th></tr>';
					$.each(merg,function(_i,e){
						var orig = (e.cat == 'ers')?'ERS':'COMCENTER',
						t = (e.type == 'radioers')?'Cellphone':e.type;
						html += '<tr><td>'+orig+'</td><td>'+t+'</td><td>'+e.cnt+'</td></tr>';
					});
					html += '</table>';
					$('#chart_data').html(html);
					
				}else{
					console.log('INVALID DATA: ',data);
				}
				GetTeamMonthlyDispatch(dt);
				GotoEndPage();
			},
			error:function(_jqXHR,textStatus,errorThrown ){
				console.log(errorThrown);
				alert(textStatus);
			}
		});

	}else{
		GetTeamMonthlyDispatch(dt);
	}
	// return comData;
}

function GetRefOtherAgencyData(dt){
	if($('#chk_ref_other').prop("checked")){

		$('.btn,.chk').attr('disabled',true);
		$('.loading.col1').show();
		$('.loading.col1 .loading-text').text('Reffered to Other Agencies Data...');
		$('.loading.col1 .loading-sub').text('');
		$.ajax({
			url:BaseUrl()+'ajax/report/GetRefOtherAgency',
			async:true,
			data:{dt:dt},
			method:'POST',
			success:function(data){
				if(IsJsonString(data)){
					var d = JSON.parse(data);
					var ersd = d.ERS, comd = d.COMCENTER;
					var source = [];
					$.each(other_agency,function(_i,e){
						source.push({cat:e,ers:0,com:0});
					});

					adjustRefOtherAgencyObject('ers',ersd);
					adjustRefOtherAgencyObject('com',comd);
					
					var nersd = _.chain(ersd)
					.groupBy('type')
					.map((i,e)=>({cat:e,ers:_.sumBy(i,function(o) { return parseInt(o.cnt); })}))
					.value();

					var ncomd = _.chain(comd)
					.groupBy('type')
					.map((i,e)=>({cat:e,com:_.sumBy(i,function(o) { return parseInt(o.cnt); })}))
					.value();
					
					var merg = _.map(source,function(obj){
						return _.assign(obj,_.find(nersd,function(o){
							return o.cat.toLowerCase() == obj.cat.toLowerCase();
						}),_.find(ncomd,function(o){
							return o.cat.toLowerCase() == obj.cat.toLowerCase();
						}));
					});
					
					var html = '<br><div><b>REFFERED TO OTHER AGENCIES</b></div><table border="1" width="80%">';
					html += '<tr><td>CATEGORY</td><td>ERS</td><td>COMMU</td><td>SUB-TOTAL</td></tr>';
					var tots = 0;
					$.each(merg,function(_i,e){
						var txt_e = (e.ers == 0)?'-':e.ers,
						txt_c = (e.com == 0)?'-':e.com;
						var t = (e.ers + e.com);
						tots += t;
						html += '<tr><td width="30%">'+e.cat+'</td><td width="20%">'+txt_e+'</td><td width="20%">'+txt_c+'</td><td width="25%">'+t+'</td></tr>';					
					});

					html += '<tr><td colspan="3">TOTAL</td><td>'+tots+'</td></tr>';
					$('#ref_other_data').html(html);
				}
				GetWeatherSystem(dt);
				GotoEndPage();
				
			},
			error:function(_jqXHR,textStatus,errorThrown ){
				console.log(errorThrown);
				alert(textStatus);
			}
		});

	}else{
		GetWeatherSystem(dt);
	}
}

function GetWeatherSystem(dt){
	if($('#chk_ws').prop("checked")){
		$('.btn,.chk').attr('disabled',true);
		$('.loading.col1').show();
		$('.loading.col1 .loading-text').text('WEATHER SYSTEM');
		$('.loading.col1 .loading-sub').text('Getting affected the country and CDO...');
		$.ajax({
			url:BaseUrl()+'ajax/report/GetWeatherSystem',
			async:true,
			data:{dt:dt},
			method:'POST',
			success:function(data){
				if(IsJsonString(data)){
					var d = JSON.parse(data);
					var editName = {Amihan:'Amihan (Northeast Monsoon)',LPA:'Low Pressure Area (LPA)','Localized thunderstorm':'Localized "Thunderstorm"'};
					var af = [],naf = [],x = 1;
					$.each(d,function(_i,e){
						if(e.type == 'affected'){
							af.push((x++)+'. '+(editName[e.weather] === undefined?e.weather:editName[e.weather]));
						}else{
							naf.push(e.weather);
						}
					});

					var html = '<br><div><b>WEATHER SYSTEMS</b></div><table border="1" id="ws_table" width="550">';
					html += '<tr><th width="50%">AFFECTED THE COUNTRY</th><th width="50%">Affected CDO, Its watershed and tributaries</th></tr>';
					
					$.each(naf,function(i,e){
						
						var ename = (editName[e] === undefined)?e:editName[e];
						html += '<tr><td>'+ename+'</td>'+(i == 0?'<td rowspan="'+naf.length+'">'+af.join('<br>')+'</td>':'')+'</tr>';
					});
					html += '</table>';
					
				}else{
					console.log('INVALID DATA: ',data);
				}
				/*
				 * WEATHER SYSTEMS - Get Prevalent Weather Systems Data
				 */
				$('.loading.col1 .loading-sub').text('Getting Prevalent Weather System...');
				$.ajax({
					url:BaseUrl()+'ajax/report/GetPWS',
					async:true,
					data:{dt:dt},
					method:'POST',
					success:function(data){
						if(IsJsonString(data)){
							var d = JSON.parse(data);
							html += '<br><b>Prevalent Weather System vs. Localized Thunderstorms experienced in CDO</b>';
							html += '<table border="1">';
							$.each(d,function(_i,e){
								html += '<tr><td>'+e.affecting_CDO+'</td><td>'+e.cnt+'</td></tr>';
							});
							html += '</table>';
						}else{
							console.log('INVALID DATA: ',data);
						}
						/*
						 * WEATHER SYSTEMS - Get Actual Thunderstorm vs Flooding data
						 */
						$('.loading.col1 .loading-sub').text('Getting total actual thunderstorm and flooding data...');
						$.ajax({
							url:BaseUrl()+'ajax/report/GetATF',
							async:true,
							data:{dt:dt},
							method:'POST',
							success:function(data){
								if(IsJsonString(data)){
									var d = JSON.parse(data);
									html += '<br><b>Actual Thunderstorm vs. Flooding</b>';
									html += '<table border="1">';
									$.each(d,function(_i,e){
										html += '<tr><td>'+e.type+'</td><td>'+e.cnt+'</td></tr>';
									});
									html += '</table>';
									$('#ws_data').html(html);
								}else{
									console.log('INVALID DATA: ',data);
								}
								GetSummaryResponseTime(dt)
								GotoEndPage();
							},
							error:function(_jqXHR,textStatus,errorThrown ){
								console.log(errorThrown);
								alert(textStatus);
							}
						});

					},
					error:function(_jqXHR,textStatus,errorThrown ){
						console.log(errorThrown);
						alert(textStatus);
					}
				});

			},
			error:function(_jqXHR,textStatus,errorThrown ){
				console.log(errorThrown);
				alert(textStatus);
			}
		});
	}else{
		GetSummaryResponseTime(dt)
	}
}

function GetSummaryResponseTime(dt){
	if($('#chk_response_time').prop("checked")){
		$('.btn,.chk').attr('disabled',true);
		$('.loading.col1').show();
		$('.loading.col1 .loading-text').text('Getting Summary of Response Time');
		$('.loading.col1 .loading-sub').text('Getting data from CARED database');
		$.ajax({
			url:BaseUrl()+'ajax/report/GetSummaryResponseTime',
			async:true,
			data:{dt:dt},
			method:'POST',
			success:function(data){
				if(IsJsonString(data)){
					var d = JSON.parse(data);
					console.log('GetSummaryResponseTime',d);

					var html = '<br><div style="line-height:1.6;font-size:1.2rem;"><b>SUMMARY OF RESPONSE TIME</b></div>';
					
					$.each(d,function(i,e){
						html += i === 0 ? '' : '<br>';
						html += '<div style="line-height:1.6;font-size:1rem;"><b>'+e.type.replaceAll("_", " ").toUpperCase()+'</b></div><table class="resp_time_style" border="1" width="500" style="border-collapse:collapse;">';

						html += '<tr><td style="font-weight: bold;"># OF EMERGENCY RESPONDED</td> <td style="text-align: right; padding-right: 20px;">'+e.total_cnt+'</td></tr>';
						html += (e.type === 'dispatched_to_depart') ? '<tr><td>TOTAL INVALID COUNT: (time response >= 15mins)</td> <td style="text-align: right; padding-right: 20px;">(-) '+e.invalid_cnt+'</td></tr>' : '';
						html += '<tr><td>TOTAL INVALID COUNT: (NULL/Time Not Reported)</td> <td style="text-align: right; padding-right: 20px;">(-) '+e.null_cnt+'</td></tr>';
						html += '<tr><td>TOTAL INVALID COUNT: (NEGATIVE VALUE)</td> <td style="text-align: right; padding-right: 20px;">(-) '+e.negative_cnt+'</td></tr>';
						html += '<tr><td>TOTAL VALID COUNT</td> <td style="text-align: right; padding-right: 20px;">'+e.total_valid_cnt+'</td></tr>';
						html += '<tr><td>TOTAL RESPONSE TIME (seconds)</td> <td style="text-align: right; padding-right: 20px;">'+e.sum_response_time+'</td></tr>';
						html += '<tr><td>AVERAGE RESPONSE TIME (minutes)</td> <td style="text-align: right; padding-right: 20px;">'+(parseFloat(e.average_response_time)/60).toFixed(4)+'</td></tr>';
						
						html += '</table>';
					});
					$('#response_time_data').html(html);


					INFOCAST(dt)
					GotoEndPage();
					
				}else{
					console.log('INVALID DATA: ',data);
				}

			},
			error:function(_jqXHR,textStatus,errorThrown ){
				console.log(errorThrown);
				alert(textStatus);
			}
		});
	}else{
		INFOCAST(dt)
	}
}

/********************************************************************************/
//INFOCAST
/********************************************************************************/
function INFOCAST(dt){
	if($('#chk_ic').prop("checked")){
		var names = {'BARANGAY OFFICIALS':'Barangay Officials',LGU:'CDO LGU',FOUNDATIONS:'Foundations','HOME OWNERS ASSOCIATIONS':'Home Owners Associations','TASKFORCE PANGBAHAY':'Task Force Pangbahay'};
		$('.btn,.chk').attr('disabled',true);
		$('.loading.col1').show();
		$('.loading.col1 .loading-text').text('INFOCAST');
		$('.loading.col1 .loading-sub').text('Getting Total Subcribers...');
		$.ajax({
			url:BaseUrl()+'ajax/report/GetInfocastSubs',
			async:true,
			method:'POST',
			success:function(data){
				if(IsJsonString(data)){
					var d = JSON.parse(data);
					var sum = _.sumBy(d, function(o){return parseInt(o.cnt);});

					var html = '<br><div><b>INFOCAST</b></div>';
					html += '<br><b>Total Subcribers: </b>'+sum;
					html += '<br><b>INFOCAST Subcribers</b>';
					html += '<br><table border="1">';
					$.each(d,function(_i,e){
						html += '<tr><td>'+(names[e.cat] === undefined?e.cat:names[e.cat])+'</td><td>'+e.cnt+'</td></tr>';
					});
					html += '</table>';
					
				}else{
					console.log('INVALID DATA: ',data);
				}
				/*
				 * Getting infocast utilization
				 */
				 $('.loading.col1 .loading-sub').text('Getting infocast utilization...');
				 $.ajax({
					url:BaseUrl()+'ajax/report/GetTotalTextSent',
					async:true,
					data:{dt:dt},
					method:'POST',
					success:function(data2){
						if(IsJsonString(data2)){
							var d2 = JSON.parse(data2);
							html += '<br><b>Total text sent: </b>'+d2;
							html += '<br><b>Infocast Utilization ('+dt_disp.toUpperCase()+')</b>';
							html += '<br><table border="1">';
							html += '<tr><td>Used</td><td>'+d2.toLocaleString()+'</td></tr>';
							html += '<tr><td>Unused</td><td>'+(50000 - parseInt(d2)).toLocaleString()+'</td></tr>';
							html += '</table>';
						}else{
							console.log('INVALID DATA: ',data2);
						}
						/*
						 * Getting infocast dessemination
						 */
						 $('.loading.col1 .loading-sub').text('Getting information dessemination...');
						 $.ajax({
							url:BaseUrl()+'ajax/report/GetInfoDessemination',
							async:true,
							data:{dt:dt},
							method:'POST',
							success:function(data3){
								if(IsJsonString(data3)){
									var d3 = JSON.parse(data3);
									html += '<br><br><b>Information Dessemination via Infocast ('+dt_disp.toUpperCase()+')</b>';
									html += '<br><table border="1">';
									$.each(d3,function(_i,e){
										html += '<tr><td>'+e.type_advi+'</td><td>'+e.cnt+'</td></tr>';
									});
									html += '</table>';

								}else{
									console.log('INVALID DATA: ',data3);
								}
								/*
								 * Getting fb post total
								 */
								$('.loading.col1 .loading-sub').text('Getting total facebook post...');
								$.ajax({
									url:BaseUrl()+'ajax/report/GetFB',
									async:true,
									data:{dt:dt},
									method:'POST',
									success:function(data4){
										if(IsJsonString(data4)){
											var d4 = JSON.parse(data4);
											html += '<br><br><b>FACEBOOK</b>';
											html += '<br><b>Total PAGASA Advisories: </b>'+d4.tpost;
											html += '<br><b>Total Posted Advisories: </b>'+(parseInt(d4.tpost) - parseInt(d4.mpost));
											html += '<br><b>Total Missed Advisories: </b>'+d4.mpost;
											
										}else{
											console.log('INVALID DATA: ',data3);
										}
										
										/*
										 * Getting fb post total
										 */
										$('.loading.col1 .loading-sub').text('Getting Actual Advisories Posted...');
										$.ajax({
											url:BaseUrl()+'ajax/report/GetFBPosted',
											async:true,
											data:{dt:dt},
											method:'POST',
											success:function(data5){
												if(IsJsonString(data5)){
													var d5 = JSON.parse(data5);
													html += '<br><br><b>Actual Advisories Posted</b>';
													html += '<br><table border="1">';
													$.each(d5,function(_i,e){
														html += '<tr><td>'+e.type_advi+'</td><td>'+e.cnt+'</td></tr>';
													});
													html += '</table>';

													$('#infocast_data').html(html);
												}else{
													console.log('INVALID DATA: ',data3);
												}
												$('.loading.col1').hide();
												$('.btn,.chk').removeAttr('disabled');
												GotoEndPage();
											},
											error:function(_jqXHR,textStatus,errorThrown ){
												console.log(errorThrown);
												alert(textStatus);
											}
										});


									},
									error:function(_jqXHR,textStatus,errorThrown ){
										console.log(errorThrown);
										alert(textStatus);
									}
								});

							},
							error:function(_jqXHR,textStatus,errorThrown ){
								console.log(errorThrown);
								alert(textStatus);
							}
						});

					},
					error:function(_jqXHR,textStatus,errorThrown ){
						console.log(errorThrown);
						alert(textStatus);
					}
				});

			},
			error:function(_jqXHR,textStatus,errorThrown ){
				console.log(errorThrown);
				alert(textStatus);
			}
		});
	}else{
		$('.loading.col1').hide();
		$('.btn,.chk').removeAttr('disabled');
		GotoEndPage();
	}
}

/********************************************************************************/
//Custom functions
/********************************************************************************/
function adjustRefOtherAgencyObject(type,arr){
	
	$.each(arr,function(_i,e){
		var str = (type == 'ers')?e.Reason:e.unit;
		t = str;
		if(~str.toLowerCase().indexOf('afp')){
			t = 'AFP';
		}else if(~str.toLowerCase().indexOf('bfp')){
			t = 'BFP';
		}else if(str.toLowerCase() == 'carest'){
			t = 'Carmen Rescue';
		}else if(~str.toLowerCase().indexOf('ceo')){
			t = 'CEO';
		}else if(~str.toLowerCase().indexOf('cvo')){
			t = 'CVO';
		}else if($.inArray(str.toLowerCase(),['pdrrmc','pdrrmo']) !== -1){
			t = 'PDRRMO';
		}else if(~str.toLowerCase().indexOf('pcg')){
			t = 'Phil Coast Guard';
		}else if(~str.toLowerCase().indexOf('pnp')){
			t = 'PNP';
		}else if(~str.toLowerCase().indexOf('police')){
			t = 'PNP';
		}else if(str.toLowerCase() == 'cocpo'){
			t = 'PNP';
		}else if(str.toLowerCase() == 'phil red cross'){
			t = 'RED CROSS';
		}else if(str.toLowerCase() == 'red cross'){
			t = 'RED CROSS';
		}else if(~str.toLowerCase().indexOf('rta')){
			t = 'RTA';
		}else if(~str.toLowerCase().indexOf('prc')){
			t = 'RED CROSS';
		}
		if(type == 'ers'){
			t = ($.inArray(t.toLowerCase(),['afp','barangay','bfp','carmen rescue','ceo','cepalco','cowd','cswd','cvo','ipm','pdrrmo','phil coast guard','pnp','red cross','rta','others']) !== -1)?t:'Others';
		}
		e['type'] = t;
	});
	// return arr;
}
/**
 *Parse data from monthly emergency calls recieved and create a table
 */
function parseData(){
	var html = '<div style="font-weight: bold;">Monthly Emergencies Reported per Category and Type of Emergency</div>';
	html += '<table id="report_table">';
	html += '<tr><th>Category</th><th>Type of Emergency</th><th>ERS</th><th>COMCENTER</th><th>TOTAL</th></tr>';
	
	var total = GetTotal('fire');
	var ecnt = total.ers, ccnt = total.com;
	totalErsCnt += ecnt;
	totalComCnt += ccnt;
	html += '<tr><th colspan="2" style="text-align:left !important;">A. Fire</th><th>'+ecnt+'</th><th>'+ccnt+'</th><th>'+(ecnt + ccnt).toLocaleString('en')+'</th></tr>';

	html += createTable('law');
	html += createTable('med');
	html += createTable('rescue');
	html += createTable('others');

	var total = GetTotal('hang');
	var ecnt = total.ers, ccnt = total.com;
	totalErsCnt += ecnt;
	totalComCnt += ccnt;
	html += '<tr><th colspan="2" style="text-align:left !important;">F. Hang-up/Non-sense</th><th>'+ecnt.toLocaleString('en')+'</th><th>'+ccnt.toLocaleString('en')+'</th><th>'+(ecnt + ccnt).toLocaleString('en')+'</th></tr>';

	var total = GetTotal('prank');
	var ecnt = total.ers;
	totalErsCnt += ecnt;
	// totalComCnt += ccnt;
	html += '<tr><th colspan="2" style="text-align:left !important;">G. Prank Call</th><th>'+ecnt+'</th><th>-</th><th>'+ecnt+'</th></tr>';

	html += '<tr style="text-align:center;"><th colspan="2">TOTAL</th><th>'+totalErsCnt.toLocaleString('en')+'</th><th>'+totalComCnt.toLocaleString('en')+'</th><th>'+(totalErsCnt + totalComCnt).toLocaleString('en')+'</th></tr>';

	html += '</table>';
	$('#merge_table').html(html);
}
/**
 *Additional row for type of emergencies for the monthly emergency calls recieved
 */
function createTable(type,others){
	var total = GetTotal(type,others)
	var ecnt = total.ers, ccnt = total.com;

	totalErsCnt += ecnt;
	totalComCnt += ccnt;
	var typeHeader = '';
	switch(type){
		case 'law':
			typeHeader = 'B. Law Enforcement';
			break;
		case 'med':
			typeHeader = 'C. Medical Emergency';
			break;
		case 'rescue':
			typeHeader = 'D. Rescue';
			break;
		case 'others':
			typeHeader = 'E. Other Calls';
			break;
	}
	var merg = mergeJSON(type,others);//console.log('merge: ',type,merg);
	var html = '<tr><th colspan="2" style="text-align:left !important;">'+typeHeader+'</th><th align="center">'+ecnt+'</th><th align="center">'+ccnt+'</th><th align="center">'+(ecnt + ccnt).toLocaleString('en')+'</th></tr>';
	$.each(merg,function(_i,e){
		var erscnt = (e.ers == 0)?'-':e.ers,
		comcnt = (e.com == 0)?'-':e.com,
		tots = (parseInt(e.ers) + parseInt(e.com)); totscnt = (tots == 0)?'-':tots;
		html += '<tr><td style="border-right:none;"></td><td>'+e.incident_type+'</td><td align="right">'+erscnt+'</td><td align="right">'+comcnt+'</td><td align="right">'+totscnt.toLocaleString('en')+'</td></tr>';
	});

	return html;
}
/**
 *Get the total ERS and Comcenter count for monthly emergency calls recieved per type
 */
function GetTotal(type,others){
	var ecnt = 0, ccnt = 0, all = 0;
	var uj = usedJson(type,others);//console.log(uj.all)
	$.each(uj.ers,function(_i,e){
		ecnt = ecnt + parseInt(e.ers);
	});
	$.each(uj.com,function(_i,e){
		ccnt = ccnt + parseInt(e.com);
	});
	if(others){
		$.each(uj.all,function(_i,e){
			all = all + parseInt(e.all);
		});
	}
	//console.log('all: ',all)
	return (others?{ers:ecnt,com:ccnt,all:all}:{ers:ecnt,com:ccnt});
}
/**
 *Merge the JSON data of the monthly emergency calls recieved (SOURCE, ERS, COMCENTER)
 */
function mergeJSON(type,others){
	var uj = usedJson(type,others);//console.log('mergeJSON uj: ',uj)
	var ed = uj.ers, cd = uj.com, msource = mainSourceJson(type,others);
	
	var merg = _.map(msource,function(obj){
			return _.assign(obj,_.find(ed,function(o){
				return o.incident_type.toLowerCase() == obj.incident_type.toLowerCase();
			}),_.find(cd,function(o){
				return o.incident_type.toLowerCase() == obj.incident_type.toLowerCase();
			}));
		});
	return merg;
}
/**
 *Return the source JSON to be used base on type
 */
function mainSourceJson(type,_others){
	var r = [], src = [];
	switch(type){
		case 'law':
			src = incident_type_law;
			break;
		case 'med':
			src = incident_type_med;
			break;
		case 'rescue':
			src = incident_type_rescue;
			break;
		case 'others':
			src = incident_type_others;
			break;
	}
	$.each(src,function(_i,e){
		r.push({incident_type:e,ers:0,com:0});
	});
	return r;
}
/**
 *Return the ERS/COMCENTER JSON to be used basea on type
 */
function usedJson(type,others){
	var ed = [], cd = [], all = [];
	switch(type){
		case 'fire':
			ed = (others)?emsFire:ersFire;
			cd = (others)?usarFire:comFire;
			break;
		case 'law':
			ed = (others)?emsLaw:ersLaw;
			cd = (others)?usarLaw:comLaw;
			break;
		case 'med':
			ed = (others)?emsMed:ersMed;
			cd = (others)?usarMed:comMed;
			break;
		case 'rescue':
			ed = (others)?emsRescue:ersRescue;
			cd = (others)?usarRescue:comRescue;
			break;
		case 'others':
			ed = (others)?emsOthers:ersOthers;
			cd = (others)?usarOthers:comOthers;
			break;
		case 'hang':
			ed = ersHang;
			cd = comHang;
			break;
		case 'prank':
			ed = ersPrank;
			cd = comPrank;
			break;
	}
	//console.log('userJSON: ',ed);
	return {ers:ed,com:cd};
}
/**
 *Empty global variables
 */
function EmptyData(){
	ersData = []; ersFire = []; ersLaw = []; ersMed = []; ersRescue = []; ersOthers = []; ersHang = []; ersPrank = [];
	ersBlank = []; comData = []; comFire = []; comLaw = []; comMed = []; comRescue = []; comOthers = []; comHang = [];
	comPrank = []; comBlank = []; emsData = []; emsFire = []; emsLaw = []; emsMed = []; emsRescue = []; emsOthers = [];
	usarData = []; usarFire = []; usarLaw = []; usarMed = []; usarRescue = []; usarOthers = [];
	totalComCnt = 0; totalErsCnt = 0;
}
/**
 *Format date to be displayed and make it user readable.
 */
function DateDisplayFormat(fdt,tdt){
	var r = '';
	if(fdt == tdt){
		r = moment(fdt, 'YYYY-MM-DD').format('MMMM D, YYYY');
	}else if(moment(fdt, 'YYYY-MM-DD').isSame(moment(fdt, 'YYYY-MM-DD').startOf('month')) && moment(tdt, 'YYYY-MM-DD').isSame(moment(tdt, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD'))){
		r = moment(fdt, 'YYYY-MM-DD').format('MMMM YYYY');
	}else if(moment(fdt).isSame(tdt, 'month') && moment(fdt).isSame(tdt, 'year')){
		r = moment(fdt, 'YYYY-MM-DD').format('MMMM D')+' - '+moment(tdt, 'YYYY-MM-DD').format('D, YYYY');
	}else if(moment(fdt).isSame(tdt, 'year')){
		r = moment(fdt, 'YYYY-MM-DD').format('MMMM D')+' - '+moment(tdt, 'YYYY-MM-DD').format('MMMM D, YYYY');
	}else if(moment(fdt, 'YYYY-MM-DD').isSame(moment(fdt, 'YYYY-MM-DD').startOf('month')) && moment(tdt, 'YYYY-MM-DD').isSame(moment(tdt, 'YYYY-MM-DD').endOf('month'))){
		r = moment(fdt, 'YYYY-MM-DD').format('MMMM YYYY');
	}else{
		r = moment(fdt, 'YYYY-MM-DD').format('MM/DD/YYYY')+' - '+moment(tdt, 'YYYY-MM-DD').format('MM/DD/YYYY')
	}
	return r;
}