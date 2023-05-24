var lastDailyCalls = {}, lastAverage = {}, lastMonthlyCalls = {}, lastStaffPerf = {},
lastIncidentData = {}, lastHistoryCalls = {}, lastMonthlyIncident = {};
var staff_perf_chart, incident_chart, history_chart;
var lastFilterDate = '';

$(function(){console.log("READY")
	GetDailyCallsToday();
	GetAverage();
	MonthlyCallsReceived();
	
	//Initialize Chart
	incident_chart = echarts.init(document.getElementById('incident_chart'));
	staff_perf_chart = echarts.init(document.getElementById('staff_perf_chart'));
	history_chart = echarts.init(document.getElementById('historical_chart'));
	GetStaffPerf();
	GetIncident();
	GetHistoryCalls();
	GetMonthlyIncident();
	
	//reload every 20 sec
	setInterval(function(){

		GetDailyCallsToday();
		GetAverage();
		GetIncident(undefined,true);
	},20000);
	//reload every hour
	setInterval(function(){
		MonthlyCallsReceived();

		GetStaffPerf(undefined,true);
		GetHistoryCalls(undefined,true);
		GetMonthlyIncident(undefined,true);
	},3600000);

	$('#filter_btn').click(function(){
		var dt = $('#filter_date').val();
		lastFilterDate = dt;
		dt = moment(dt).format('YYYY-MM-DD');
		
		GetDailyCallsToday(dt);
		GetAverage(dt);
		GetStaffPerf(dt);
		MonthlyCallsReceived(dt);
		GetIncident(dt);
		GetHistoryCalls(dt);
		GetMonthlyIncident(dt);
	});

	$('#reset_btn').click(function(){
		lastFilterDate = '';
		GetDailyCallsToday();
		GetAverage();
		GetStaffPerf();
		MonthlyCallsReceived();
		GetIncident();
		GetHistoryCalls();
		GetMonthlyIncident();
	});
});

function GetDailyCallsToday(dt){
	dt = (dt === undefined)?moment().format('YYYY-MM-DD'):dt;
	dt = (lastFilterDate != '')?lastFilterDate:dt;
	var r;
	$('.daily_loader').show();
	$.ajax({
		url:BaseUrl()+'ajax/ers/GetDailyCallsToday',
		async:true,
		data:{dt:dt},
		method:'POST',
		success:function(data){
			if(IsJsonString(data)){
				r = JSON.parse(data);
				if(!_.isEqual(lastDailyCalls, r)){
					lastDailyCalls = r;
					$('#total_daily_calls').text(r.today.today);
					$('#daily_emergency').text(r.today.emergency);
					$('#daily_others').text(r.today.other);
					$('#daily_hangup').text(r.today.hangup);

					$('#touch_total').text(r.touch.today);
					$('#touch_emergency').text(r.touch.emergency);
					$('#touch_others').text(r.touch.other);
					$('#touch_hangup').text(r.touch.hangup);

					$('#cared_total').text(r.cared.today);
					$('#cared_emergency').text(r.cared.emergency);
					$('#cared_others').text(r.cared.other);
					$('#cared_hangup').text(r.cared.hangup);

					$('#walkin_total').text(r.walkin.today);
					$('#walkin_emergency').text(r.walkin.emergency);
					$('#walkin_others').text(r.walkin.other);
					$('#walkin_hangup').text(r.walkin.hangup);

					$('#comcenter_total').text(r.comcenter.today);
					$('#comcenter_emergency').text(r.comcenter.emergency);
					$('#comcenter_others').text(r.comcenter.other);
					$('#comcenter_hangup').text(r.comcenter.hangup);
				}
			}else{
				console.log('INVALID DATA: ',data);
			}
			$('.daily_loader').hide();
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			// alert(textStatus);
			$('.daily_loader').hide();
		}
	});
	return r;
}

function GetAverage(dt){
	dt = (dt === undefined)?moment().format('YYYY-MM-DD'):dt;
	dt = (lastFilterDate != '')?lastFilterDate:dt;
	var r;
	$('.average-loader').show();
	$.ajax({
		url:BaseUrl()+'ajax/ers/GetAverageCalls',
		async:true,
		data:{dt:dt},
		method:'POST',
		success:function(data){
			if(IsJsonString(data)){
				r = JSON.parse(data);
				if(!_.isEqual(lastAverage, r)){
					lastAverage = r;
					//{"avg_monthly_emer":"483.8333","avg_daily_emer":"20.4828","avg_daily":"524.3736"}
					$('#daily_ave_calls').text(parseFloat(r.avg_daily).toFixed(0));
					$('#daily_ave_emergency').text(parseFloat(r.avg_daily_emer).toFixed(0));
					$('#monthly_ave_emergency').text(parseFloat(r.avg_monthly_emer).toFixed(0));
				}
			}else{
				console.log('INVALID DATA: ',data);
			}
			$('.average-loader').hide();
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			// alert(textStatus);
			$('.average-loader').hide();
		}
	});
	return r;
}

function MonthlyCallsReceived(dt){
	dt = (dt === undefined)?moment().format('YYYY-MM-DD'):dt;
	dt = (lastFilterDate != '')?lastFilterDate:dt;
	var r;
	$('#monthly_loader').show();
	$.ajax({
		url:BaseUrl()+'ajax/ers/GetMonthlyCalls',
		async:true,
		data:{dt:dt},
		method:'POST',
		success:function(data){
			if(IsJsonString(data)){
				r = JSON.parse(data);
				if(!_.isEqual(lastMonthlyCalls, r)){
					lastMonthlyCalls = r;
					$('#total_monthly_calls').text(r.total_calls);
					$('#total_emergency').text(r.total_emerg);
					$('#total_others').text(r.total_other);
					$('#total_hangup').text(r.total_hangup);

					$('#total_emergency_percentage').text(GetPercentage(r.total_emerg,r.total_calls));
					$('#total_others_percentage').text(GetPercentage(r.total_other,r.total_calls));
					$('#total_hangup_emergency').text(GetPercentage(r.total_hangup,r.total_calls));
				}
			}else{
				console.log('INVALID DATA: ',data);
			}
			$('#monthly_loader').hide();
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			// alert(textStatus);
			$('#monthly_loader').hide();
		}
	});
	return r;
}

function GetStaffPerf(dt,isDataOnly){
	dt = (dt === undefined)?moment().format('YYYY-MM-DD'):dt;
	dt = (lastFilterDate != '')?lastFilterDate:dt;
	var r;
	$('#staffperf_loader').show();
	$.ajax({
		url:BaseUrl()+'ajax/ers/GetStaffPerf',
		async:true,
		data:{dt:dt},
		method:'POST',
		success:function(data){
			if(IsJsonString(data)){
				var obj = JSON.parse(data);
				if(!_.isEqual(lastStaffPerf, obj)){
					lastStaffPerf = obj;
					var lbl = [], cvalid = [], cinvalid = [],gchartdata = [];

					gchartdata.push(['Name', 'Valid Calls', 'Dropped Calls']);
					$.each(obj,function(i,k){
						lbl.push(k.fn); 
						cvalid.push(Number(k.call_valid));
						cinvalid.push(Number(k.call_hangup));
						gchartdata.push([k.fn, Number(k.call_valid), Number(k.call_hangup)]);
					});
					r = {label:lbl,data:[
					{name:'Valid Calls',type:'bar',data:cvalid,
						itemStyle : {
			                normal : {color:'#1abb9c'}
			            }
		        	},
					{name:'Dropped Calls',type:'bar',data:cinvalid,
						itemStyle : {
			                normal : {color:'#FF5555'}
			            }
					}
					]};
					if(isDataOnly){
						staff_perf_chart.setOption({
							yAxis : [
						        {
						            data : r.label
						        }
						    ],
						    series : r.data
						});
					}else{
						staff_perf_chart.setOption(ChartOption('staff_perf',r), true);
					}
				}
			}else{
				console.log('INVALID DATA: ',data);
			}
			$('#staffperf_loader').hide();
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			// alert(textStatus);
			$('#staffperf_loader').hide();
		}
	});
	return r;
}

function GetIncident(dt,isDataOnly){
	dt = (dt === undefined)?moment().format('YYYY-MM-DD'):dt;
	dt = (lastFilterDate != '')?lastFilterDate:dt;
	var r;
	$('#incident_loader').show();
	$.ajax({
		url:BaseUrl()+'ajax/ers/GetIncidentData',
		async:true,
		data:{dt:dt},
		method:'POST',
		success:function(data){
			if(IsJsonString(data)){
				var obj = JSON.parse(data);
				if(!_.isEqual(lastIncidentData, obj)){
					lastIncidentData = obj; console.log(obj)
					var lbl = [], dset = [], bgcolor = [], hvcolor = [], testechart = [];
					$.each(obj,function(i,k){
						// Change Hang Up name to Dropped Calls
						if(k.Name == 'Hang Up'){
							k.Name = 'Dropped Calls';
						}

						lbl.push(k.Name); dset.push(Number(k.cnt));
						testechart.push({value:k.cnt,name:k.Name})
					});
					r = {data:testechart,label:lbl};
					if(isDataOnly){
						incident_chart.setOption({
							series : [
						        {
						            data:r.data
						        }
						    ],
						    legend:{
						    	data: r.label
						    }
						});
					}else{
						incident_chart.setOption(ChartOption('incident',r), true);
					}
				}
			}else{
				console.log('INVALID DATA: ',data);
			}
			$('#incident_loader').hide();
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			// alert(textStatus);
			$('#incident_loader').hide();
		}
	});
	return r;
}

function GetMonthlyIncident(dt){
	dt = (dt === undefined)?moment().format('YYYY-MM-DD'):dt;
	dt = (lastFilterDate != '')?lastFilterDate:dt;
	var r;
	$('#monthlyincident_loader').show();
	$.ajax({
		url:BaseUrl()+'ajax/ers/GetMonthlyIncidentData',
		async:true,
		data:{dt:dt},
		method:'POST',
		success:function(data){
			if(IsJsonString(data)){
				var obj = JSON.parse(data);
				if(!_.isEqual(lastMonthlyIncident, obj)){
					lastMonthlyIncident = obj;
					var lbl = [], dset = [], bgcolor = [], hvcolor = [], testechart = [];
					$.each(obj,function(i,k){
						lbl.push(k.Name); dset.push(Number(k.cnt));
						testechart.push({value:k.cnt,name:k.Name})
					});
					r = {data:testechart,label:lbl};
					var html = [];
					$.each(r.data,function(i,k){//console.log(i,k)
						var h = '<div style="margin-top:-10px; margin-bottom:5px">';
						h += '<span style="font-size:'+(i > 4?'10':'12')+'px;font-weight:'+(i > 4?'normal':'bold')+';">'+k.name+
						(i > 4?'('+k.value+'%)':'')+'</span>';
						// h += '<span style="float:right;font-size:10px;">'+data.dset[i]+'</span>';
						h += '<div class="progress" style="margin-bottom:-5px; !important;margin-top:-5px;height:'+(i > 4?'3':'15')+'px;border-radius:0 !important;">';
						h += '<div class="progress-bar" role="progressbar" style="width:'+k.value+'%;"></div>';
						h += '<div style="text-align:right;padding-right:10px;color:#2A3F54;font-size:'+(i > 4?'5':'10')+'px !important;font-weight:'+(i > 4?'normal':'900')+';">'+(i > 4?'':k.value+'%')+'</div>';
						h += '</div>';
						h += '</div>';
						html.push(h);
					});
					$('#monthly_container').html(html);
				}
			}else{
				console.log('INVALID DATA: ',data);
			}
			$('#monthlyincident_loader').hide();
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			// alert(textStatus);
			$('#monthlyincident_loader').hide();
		}
	});
	return r;
}

function GetHistoryCalls(dt,isDataOnly){
	dt = (dt === undefined)?moment().format('YYYY-MM-DD'):dt;
	dt = (lastFilterDate != '')?lastFilterDate:dt;
	var r;
	$('#historycalls_loader').show();
	$.ajax({
		url:BaseUrl()+'ajax/ers/GetHistoryCalls',
		async:true,
		data:{dt:dt},
		method:'POST',
		success:function(data){
			if(IsJsonString(data)){
				var obj = JSON.parse(data);
				if(!_.isEqual(lastHistoryCalls, obj)){
					lastHistoryCalls = obj;
					var lbl = [], tcalls = [], temer = [];
					$.each(obj,function(i,k){
						lbl.push(k.m);
						tcalls.push(k.tcalls);
						temer.push(k.temer);
					});
					r = {label:lbl,tcalls:tcalls,temer:temer};
					if(isDataOnly){
						history_chart.setOption({
							series : [
						    	{
						    		data:r.tcalls
						    	},
						    	{
						    		data:r.temer
						    	}
						    ]
						});
					}else{
						history_chart.setOption(ChartOption('history',r), true);
					}
				}
			}else{
				console.log('INVALID DATA: ',data);
			}
			$('#historycalls_loader').hide();
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			// alert(textStatus);
			$('#historycalls_loader').hide();
		}
	});
	return r;
}

function ChartOption(type,datasource){
	var opt = {
		'incident':{
			tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c}"
		    },
		    legend:{
		    	type:'scroll',
		    	orient:'vertical',
		    	data: datasource.label,
		    	left:0,
		        top: 20,
		        textStyle:{
		        	color:'#fff'
		        }
		    },
		    color:ColorPallete(),
		    calculable : true,
		    avoidLabelOverlap:true,
		    series : [
		        {
		            name:'Incidents',
		            type:'pie',
		            radius : '30%',
		            center: ['75%', '30%'],
		            data:datasource.data,
		            label:{
		            	formatter:'{c}',position:'outside'
		            }
		        }
		    ]
		},

		'staff_perf':{
		    tooltip : {
		        trigger: 'axis'
		    },
		     legend: {
		        data:['Valid Calls', 'Dropped Calls'],
		        textStyle:{
			  		color:'#fff',fontSize:18
			  	}
		    },
		    calculable : true,
		    xAxis : [
		        {
		            type : 'value',
		            boundaryGap : [0, 0.01],
		            axisLabel:{
		            	color:'#fff',fontSize:14
		            },
		            axisLine:{
		            	lineStyle:{
		            		color:'#ccc'
		            	}
		            }
		        }
		    ],
		    yAxis : [
		        {
		            type : 'category',
		            data : datasource.label,
		            axisLabel:{
		            	color:'#fff',fontSize:8,
		            	showMinLabel:true,showMaxLabel:true
		            },
		            axisLine:{
		            	lineStyle:{
		            		color:'#ccc'
		            	}
		            }
		        }
		    ],
		    grid:{
		    	containLabel:true,left:0
		    },
		    series : datasource.data
		},

		'history':{
			tooltip : {
		        trigger: 'axis'
		    },
		     legend: {
		        data:['Total Calls', 'Total Emergency Calls'],
		        textStyle:{
			  		color:'#fff',
			  		fontSize:18
			  	}
		    },
		    calculable : true,
		    xAxis : [
		        {
		            type : 'category',
		            data : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'],//datasource.label,
		            axisLabel:{
		            	color:'#fff',fontSize:14
		            },
		            axisLine:{
		            	lineStyle:{
		            		color:'#ccc'
		            	}
		            }
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value',
		            boundaryGap : [0, 0.01],
		            axisLabel:{
		            	color:'#fff',fontSize:14
		            },
		            axisLine:{
		            	lineStyle:{
		            		color:'#ccc'
		            	}
		            }
		        }
		    ],
		    grid:{
		    	containLabel:true,left:0,width:'100%'
		    },
		    series : [
		    	{
		    		name:'Total Calls',
		    		type:'bar',
		    		data:datasource.tcalls,
		    		itemStyle : {
		                normal : {color:'#128872'}
		            },
		            label:{
		            	show:true,
		            	position:'top',
		            	// backgroundColor:'#337AB7',
		            	borderWidth:1,
		            	color:'#fff',
		            	padding:[6,3,3,3],
		            	textShadowColor:'#999',
		            	fontSize:14
		            }
		    	},
		    	{
		    		name:'Total Emergency Calls',
		    		type:'bar',
		    		data:datasource.temer,
		    		itemStyle : {
		                normal : {color:'#3072AB'}
		            },
		            label:{
		            	show:true,
		            	position:'top',
		            	// backgroundColor:'#FF5555',
		            	borderWidth:1,
		            	color:'#fff',
		            	padding:[6,3,3,3],
		            	fontSize:14
		            }
		    	}
		    ]
		}
	};

	return opt[type];
}