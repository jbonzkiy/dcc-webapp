var VEHICLE = [],DRIVER = [];
var STATUS_COLOR = {'DEPARTED':'#2185D0','ARRIVED':'#21BA45'};
$(function(){
	console.log('ok (~˘▾˘)~');

	//initialize splitter
	$('#mainSplitter').jqxSplitter({ width: '100%', height: '87%', 
		panels: [{ size: '80%',collapsible:false,collapsed:false }],showSplitBar:false});
	$("#jpanel").jqxPanel({ width: '100%', height: '96%'});

	fetchOptions('option_vehicle');
	fetchOptions('option_driver');
	fetchData();
	fetchDoneToday();
	
	setInterval(function(){fetchData();fetchDoneToday();},10000);
});

function fetchData(){

	$.ajax({
		url:BaseUrl()+'ajax/vehicle/action',
		async:true,
		data:{type:'activity_log',action:'load',monitoring:'active'},
		method:'POST',
		success:function(data){
			var obj = JSON.parse(data);
			var cards = [];
			$.each(obj,function(i,e){
				var stat = (e.eta != '' && e.etr == '')?'ARRIVED':'DEPARTED';
				// var driver = (parseInt(did) !== -1)?e.dname:e.did_other;
				// var car = (parseInt(e.vid) !== -1)?e.vname:e.vid_other;
				var vidArr = JSON.parse(e.vid);
				var didArr = JSON.parse(e.did);
				var caropt = [];
				$.each(vidArr,function(i,e){
					var car = _.map(VEHICLES, function(o) {if (o.vid == e) return o;});
					car = _.without(car, undefined);
					caropt.push(car[0].name);
				});	
				var driveropt = [];
				$.each(didArr,function(i,e){
					var driver = _.map(DRIVER, function(o) {if (o.did == e) return o;});
					driver = _.without(driver, undefined);
					driveropt.push(driver[0].name);
				});	
				driveropt.sort();

				var html = '<div class="card">';
				html += '<div class="content">';
				html += '<div class="header" title="'+e.activity+'">'+e.activity+'</div>';
				html += '<div class="meta">'+e.dt+'</div>';
				html += '<div class="description">';
				html += '<b>Vehicle/s: </b><span>'+caropt.join(', ')+'</span><br>';
				html += '<b>Driver/s: </b><span>'+driveropt.join(', ')+'</span><br>';
				html += '<b>ETD: </b><span>'+e.etd+'</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				html += '<b>ETA: </b><span>'+(e.eta == ''?'--:--':e.eta)+'</span><br>';
				html += '<b>Details: </b>';
				html += '<div style="height:100px;overflow:auto;overflow-x:hidden;">';
				html += '<div style="white-space:pre-line;">'+e.details+'</div>';
				html += '</div>';

				html += '</div>';
				html += '</div>';
				html += '<div class="extra content" style="color:#fff;background-color:'+STATUS_COLOR[stat]+'"><b>STATUS: </b><span>'+stat+'</span></div>';
				html += '</div>';
				cards.push(html);
			});
			$('#act').html(cards.join(' '));
			
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
		}
	});
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

function fetchDoneToday(){
	$.ajax({
		url:BaseUrl()+'ajax/vehicle/action',
		async:true,
		data:{type:'activity_log',action:'load',monitoring:'done'},
		method:'POST',
		success:function(data){
			var obj = JSON.parse(data);
			var html = [];
			$.each(obj,function(i,e){
				var str = '<div class="item">';
				str += '<h3 class="header">'+e.activity+'</h3>';
				if($.trim(e.route) !== ''){
					str += '<b>Route: </b>'+e.route+'<br>';
				}
				str += '<b><abbr title="Estimated time of return">ETR</abbr>: </b>'+e.etr;
				str += '</div>';
				html.push(str);
			});
			$('#done_today_container').html(html.join(' '));
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
		}
	});
}