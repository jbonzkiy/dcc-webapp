$(function(){
	var firelist = [];//list of call id of fire incident so the siren wont alarm when ID is exist
	var zoomIn = 17, zoomOut = 13;
	// console.log(moment().format('HH:mm:ss'))
	//constantly checking the incident container for content.
	//every 30 secs.
	setInterval(function(){
		ShowHideIncidentContent();
	},30000);
	//setting dispatch team status
	setTeamContent();
	setInterval(function(){
		setTeamContent();
	},20000);

	//Initialize leaflet map
	var map = L.map('map2',{zoomControl:false }).setView([8.46982559076231, 124.66884933349614], zoomOut);
	//Initialize google map
	// var gmap = L.gridLayer.googleMutant({type: 'hybrid'}).addTo(map);
	L.esri.basemapLayer("Imagery").addTo(map);
	L.esri.basemapLayer('ImageryLabels').addTo(map);
	L.esri.basemapLayer('ImageryTransportation').addTo(map);
	//Initialize group for marker
	var markerGroup = new L.layerGroup().addTo(map);
	var cctvmarkergroup = new L.layerGroup().addTo(map);
	//var shpfile2 = new L.Shapefile(BaseUrl(false)+'CDO_Zone_sitios_pop2020_wgs_New1.zip'); 
	//shpfile2.addTo(map);
	var shpfile = new L.Shapefile(BaseUrl(false)+'assets/shp/CDO_Barangay_boundary_wgs_new1.zip',{
		onEachFeature: function(feature, layer) {console.log(feature.properties)
            if (feature.properties) {
				//layer.bindTooltip(feature.properties.BARANGAY,{permanent: true,opacity:0.3});
            }
        },
        style: function(feature) {
            return {
                opacity: 1,
                fillOpacity: 0.1,
                radius: 6,
                color: "#FF4500"
            }
        }
	});
	shpfile.addTo(map);

	$(window).on('resize',function(){
		map.invalidateSize();
	});
	//setting the polygon bounderies of the map.
	//SetCityBound(map);
	//Loading data for the first time.
	setTimeout(function(){getMarkersObject();},2000)
	
	//Reloading markers every 10 secs.
	setInterval(function(){
		getMarkersObject();
	},10000);
	GetMapLayerLocation();
	/*************************************/
	//Initialize marker icons
	/*************************************/
	var fireIcon = L.icon({iconUrl:GetIcon('Fire')});
	var lawIcon = L.icon({iconUrl:GetIcon('Law Enforcement')});
	var medicalIcon = L.icon({iconUrl:GetIcon('Medical Emergencies')});
	var rescueIcon = L.icon({iconUrl:GetIcon('Rescue')});
	var otherIcon = L.icon({iconUrl:GetIcon('Other Calls')});
	//Toggle incident container
	$('#open_incident, #close_incident').click(function(){
		var type = $(this).attr('id');
		if(type == 'open_incident'){
			$('#incidents').show();
		}else{
			$('#incidents').hide();
		}
	});

	var markers = [], m, oldResult = [], timeouts = [];
	/**
	*Get the json data for the markers.
	*/
	var isRemoveMarker = false;
	function getMarkersObject(type){
		type = (type == undefined)?'':"/"+type;
		
		var obj2 = {};
		//*********check if already 24 hours and oldResult is not empty then refresh data
		if(moment().format('HH') == '00' && isRemoveMarker === false){
			console.log('marker layer removed at ',moment().format('MMM D, YYY h:mm:ss A'));
			markerGroup.clearLayers();//remove all layers
			firelist = [];
			isRemoveMarker = true;
		}
		if(moment().format('HH') == '01' && isRemoveMarker ===true){
			isRemoveMarker = false;
		}
		$.ajax({
			url:BaseUrl()+'ajax/maps/get_call_logs_map'+type,
			async:true,
			success: function(result){
				obj = JSON.parse(result);
				var mid = [], h = [],latlng = [],icon = [];
				if(oldResult.length == 0){//oldResult.length == 0
					oldResult = obj;console.log(obj)
					
					$.each(obj,function(i,e){
						if(e.Type_Emergency == 'Fire'){
							//check if fire is recent like same time
							if(moment().isBetween(moment(e.dtlog,'YYYY-MM-DD HH:mm:ss').subtract(1, 'minute'),moment(e.dtlog,'YYYY-MM-DD HH:mm:ss'))){
							if($.inArray(parseInt(e.CallLog_ID),firelist) === -1){
								$('#firemp3')[0].pause();
								$('#firemp3')[0].currentTime = 0;
								$('#firemp3')[0].play();
							}
							}
						}
						latlng.push([parseFloat(e.Latitude),parseFloat(e.Longitude)]);
						icon.push(L.icon({iconUrl:GetIcon(e.Group_Name_A)}));
						mid.push(parseInt(e.CallLog_ID));
						h.push(''+
							'<b>Incident Type: </b>'+e.Type_Emergency+'</br></br>'+
							'<b>Address: </b></br>'+e.Address+'</br></br>'+
							'<b>Landmark: </b>'+e.LandMark+'</br></br>'+
							'<b>Remarks: </b></br>'+e.Remarks+'</br>'+
							'');
					});
					var nd = {mid:mid,h:h,latlng:latlng,icon:icon};
					obj2 = {changeData:[],newData:nd,removeData:[]};
					setMarkers(nd,false);
					SetIncident(oldResult);
					ShowHideIncidentContent();
				}else{
					if(!_.isEqual(oldResult, obj)){
						
						var removeIndex = [], changesIndex = [], newJson = [] ,nd = {};

						var changesJson = _.differenceWith(obj, oldResult, _.isEqual);//json with changes
						var removeData = _.differenceWith(oldResult, obj, _.isEqual);
						var removeJson = [];
						$.each(removeData,function(i,e){
							if(_.findIndex(changesJson,["CallLog_ID",e.CallLog_ID]) === -1){
								removeJson.push(e);
							}
						});

						//get the new data 
						if(obj.length > oldResult.length && removeJson.length == 0){
							newJson = _.xorWith(obj, oldResult, _.isEqual);
							$.each(newJson,function(i,e){
								if(e.Type_Emergency == 'Fire'){
									if($.inArray(parseInt(e.CallLog_ID),firelist) === -1){
										$('#firemp3')[0].pause();
										$('#firemp3')[0].currentTime = 0;
										$('#firemp3')[0].play();
									}
								}

								latlng.push([parseFloat(e.Latitude),parseFloat(e.Longitude)]);
								icon.push(L.icon({iconUrl:GetIcon(e.Group_Name_A)}));
								mid.push(parseInt(e.CallLog_ID));
								h.push(''+
									'<b>Incident Type: </b>'+e.Type_Emergency+'</br></br>'+
									'<b>Address: </b></br>'+e.Address+'</br></br>'+
									'<b>Landmark: </b>'+e.LandMark+'</br></br>'+
									'<b>Remarks: </b></br>'+e.Remarks+'</br>'+
									'');
							});
							nd = {mid:mid,h:h,latlng:latlng,icon:icon};
						}
						
						oldResult = obj;

						obj2 = {changeData:changesJson,newData:nd,removeData:removeJson};//,removeMarker:removeIndex,newData:newJson
					}
					reloadMarkers(obj2);
				}

			},
			error:function(jqXHR,textStatus,errorThrown){
				console.log('textStatus: ',textStatus);
				console.log('errorThrown: ',errorThrown);


			}
		});
	}
	var lastTimeout;
	//Put a marker on the map
	function setMarkers(location,isnew){
		var i = 0;
		for ( item in location.mid ) {
			var m = L.marker(location.latlng[i],
				{
					icon:location.icon[i],
					title:location.mid[i]
				});
			m.bindPopup(location.h[i]);
			m._leaflet_id = parseInt(location.mid[i]);
			// if(isnew && isnew != undefined){
			// 	m.bounce();
			// 	SetTimeoutAnimate(m);
			// }
			markerGroup.addLayer(m);
			if(isnew && isnew != undefined){
				m.bounce();
				SetTimeoutAnimate(m);
				map.flyTo(location.latlng[i],zoomIn);
				SetTimeoutZoomOut();
			}
			i++;
		}
	}

	/**
	*Reloading all markers from the map.
	*/
	function reloadMarkers(md){
		// var md = getMarkersObject();
		if(Object.keys(md).length > 0){
			//remove markers
			$.each(md.removeData,function(i,e){
				markerGroup.removeLayer(parseInt(e.CallLog_ID));
			});
			//add markers
			if(Object.keys(md.newData).length > 0){setMarkers(md.newData,true);}
			
			//update markers
			$.each(md.changeData,function(i,e){

				var cm = markerGroup.getLayer(parseInt(e.CallLog_ID));
				cm.setPopupContent(''+
								'<b>Incident Type: </b>'+e.Type_Emergency+'</br></br>'+
								'<b>Address: </b></br>'+e.Address+'</br></br>'+
								'<b>Landmark: </b>'+e.LandMark+'</br></br>'+
								'<b>Remarks: </b></br>'+e.Remarks+'</br>'+
								'');
				cm.setLatLng(new L.LatLng(parseFloat(e.Latitude),parseFloat(e.Longitude))).setIcon(L.icon({iconUrl:GetIcon(e.Group_Name_A)}));
				map.flyTo([parseFloat(e.Latitude),parseFloat(e.Longitude)],zoomIn);
				cm.bounce();
				SetTimeoutAnimate(cm);
				SetTimeoutZoomOut();
			});
			SetIncident(oldResult);
		}
	}
	/**
	*Stop marker animation after 5min
	*/
	function SetTimeoutAnimate(marker){
		setTimeout(function(){
			marker.stopBouncing();
		},300000);//300000
	}
	/**
	*Reset the zoom after 5mins.
	*/
	function SetTimeoutZoomOut(){
		if(lastTimeout !== undefined){clearTimeout(lastTimeout);}
		var ts = setTimeout(function(){
			map.flyTo([8.46982559076231, 124.66884933349614],zoomOut);
		},300000);//300000
		lastTimeout = ts;
	}
	$('body').on('click','.flymetothemoon',function(){
		var data = $(this).data();

		console.log("Fly to: ",[parseFloat(data.lat),parseFloat(data.long)]);
		
		map.flyTo([parseFloat(data.lat),parseFloat(data.long)],zoomIn);
		SetTimeoutZoomOut();
	});
	/**
	*Get cctv,fire stations,hospitals, and police stations marker on map.
	*/
	function GetMapLayerLocation(){
		var r;
		//get cctv locations
		$.ajax({
			url:BaseUrl()+'ajax/maps/get_map_layer',
			async:false,
			success:function(data){
				if(IsJsonString(data)){
					r = JSON.parse(data);
				}else{
					console.log('INVALID JSON STRING: ',data);
					alert('Invalid JSON string.');
				}
			},
			error:function(jqXHR,textStatus,errorThrown ){
				console.log(errorThrown);
				alert(textStatus);
			}
		});
		MarkerLayerLocation(r);
	}
	/**
	*Plot cctv marker on map.
	*/
	function MarkerLayerLocation(data){
		var icons = {cctv:'cctv_icon',hospital:'hospital',police:'police_station'};

		$.each(data,function(i,e){
			var cmarker = L.marker([e.Y, e.X],{
				icon:L.icon({
					iconUrl:"//"+location.host+"/dcc_project_final/img/"+(e.type == 'fire'?
						(e.Catname == 'Sub Station'?'SubStation':'MainStation'):icons[e.type])+".png"
					// iconSize:[16,16]
				}),
				title:e.Name
			});
			var html = '<b>Name: </b>'+e.Name+
						'<br><b>Station Commander: </b>'+e.Sec_Comder+
						'<br><b>Hotline: </b>'+e.Hotline+
						'<br><b>Address: </b>'+e.Address+
						'<br><b>Vehicles: </b>'+e.Vehicles;
			switch(e.type){
				case 'cctv':
					html = e.Name;
					break;
				case 'hospital':
					html = '<b>Description: </b>'+e.description;
					break;
				case 'police':
					html = '<b>Location: </b>'+e.location+
							'<br><b>Description: </b>'+e.description;
					break;
			}
			cmarker.bindPopup(html);
			cctvmarkergroup.addLayer(cmarker);
		});
	}
	if(map.getZoom() < 17){map.removeLayer(cctvmarkergroup);}
	/**
	*Event on map zoom
	*/
	map.on('zoomend', function() {
	    if (map.getZoom() == 17){
	        map.addLayer(cctvmarkergroup);
	    }
	    else {
            map.removeLayer(cctvmarkergroup);
        }
	});
});

/**
*Set the bounderies of every barangay in cagayan de oro.
*/
function SetCityBound(map){
	var colors = GetColorPalette();
	$.post(BaseUrl()+'ajax/maps/get_city_bound',{},function(data){
		var obj = JSON.parse(data);
		var aor = [],curbrng = '',x = 1;
		$.each(obj,function(i,e){
			if(curbrng != e.Brgy_name && aor.length > 0){
				curbrng = e.Brgy_name;
				var c = '#'+colors[x++];
				var polygon = L.polygon(aor,{color:'#FF0000',fillColor:c,interactive:false}).addTo(map);
				aor = [];
			}else{
				aor.push([parseFloat(e.latitude),parseFloat(e.Longitude)]);
			}
		});
	});
}
/**
*Set the dispatch team status
*/
function setTeamContent(){

	// var not_available = ['car wash','conduct checkpoint','defective unit','negative delta','negative team leader',
	// 'no crew','no gas','no radio','onboard shop','road security','special tasking'];
	var tobeNA = ['conduct check point','negative team leader','road security','breakfast','dinner break','for inquest','lunch break'];
	var changeName = {'for servicing':'TRANSPORT','special tasking':'SPECIAL TASK','under staff':'U.S.'};
	$.post(BaseUrl()+'ajax/maps/get_team_status',{},function(data){
		var obj = JSON.parse(data);//console.table(obj)
		$('.team_stat').each(function(){
			var type = $(this).data('type'), $this = $(this);
			$.each(obj,function(i,k){
				
				if(k.Team.toLowerCase() == type){
					var isDispatch = ($.inArray(k.Time_Accomplished,['','NULL',null]) !== -1);
					var cid = (isDispatch)?'('+k.Call_Log_ID+')':'';
					var stat = (isDispatch)?'DISPATCHED':($.inArray(k.NR_Type.toLowerCase(),tobeNA) !== -1 ?'N/A':k.NR_Type);

					stat = (k.NR == '0' && !isDispatch)?'AVAILABLE':stat;
					stat = ($.inArray(stat.toLowerCase(),['for servicing','special tasking','under staff']) !== -1)?changeName[stat.toLowerCase()]:stat;
					var color = (stat == 'AVAILABLE')?'#008000':(stat == 'N/A'?'#8B0000':'#FF4500');
					var c = (isDispatch?'#90EE90':'#FFFFFF');
					// $('.callerID[data-cid="'+k.Call_Log_ID+'"]').css('background-color',c);
					
					if($.inArray(parseInt(k.tid),[60,151]) !== -1 && k.Time_Accomplished != null){
						//countdown to 30mins
						if(moment().isBetween(moment(k.Time_Accomplished,'YYYY-MM-DD HH:mm:ss'),moment(k.Time_Accomplished,'YYYY-MM-DD HH:mm:ss').add(30, 'minute'))){
							//console.log(moment().format('YYYY-MM-DD HH:mm:ss'),' ',moment(k.Time_Accomplished,"YYYY-MM-DD HH:mm:ss").add(30,'minutes').format('YYYY-MM-DD HH:mm:ss'))
							//console.log(moment().diff(moment(k.Time_Accomplished,"YYYY-MM-DD HH:mm:ss").add(30,'minutes'),'minutes'))
							var mins = Math.abs(moment().diff(moment(k.Time_Accomplished,"YYYY-MM-DD HH:mm:ss").add(31,'minutes'),'minutes'));
							var minstr = (mins > 1)?'mins':'min';
							stat = 'DISINFECTING';
							cid = '('+mins+' '+minstr+' left)';
							color = '#BE8C02';
						}
					}
					
					$('span:first',$this).text(stat).css('color',color);
					$('span:last',$this).text(cid);
				}
			});
		});
	});
}
/**
*Toggle incident container display base on
*the availability of the content
*/
function ShowHideIncidentContent(){
	if($('#incident_content .media').length > 0){
		$('#incidents').show();
	}else{
		$('#incidents').hide();
	}
}
/**
*loading the content of the incident container
*/
function SetIncident(data){
	var html = [], darr = [], pArr = [], doaArr = [];
	data = _.reverse(data);
	console.log('setincident data:',data)
	$.each(data,function(i,e){
		var isDispatch = ($.inArray(e.ta,['','NULL',null]) !== -1 && $.inArray(e.td,['','NULL',null]) === -1);
		var isDispatchOtherAgencies = (e.ta === null && e.td === null) && parseInt(e.cnt_other_agency) != 0 && parseInt(e.cnt_completed) == 0;
		var isPending = (parseInt(e.cnt_completed) == 0 && parseInt(e.cnt_other_agency) == 0 && parseInt(e.dcnt) == 0)?true:(parseInt(e.cnt_completed) == 0 && parseInt(e.cnt_other_agency) == 1 && parseInt(e.dcnt) == 0 && e.ta === null);

		var ispastdate = (moment(e.dtlog,'YYYY-MM-DD HH:mm:ss').isBefore(moment(),'day'));
		var dt = (ispastdate)?'<small>'+moment(e.dtlog,'YYYY-MM-DD HH:mm:ss').format('D MMM HHmm')+'H</small>':e.dt+'H';

		if(isDispatchOtherAgencies){
			doaArr.push('<div class="media" data-callid="'+e.CallLog_ID+'" data-lat="'+e.Latitude+'" data-long="'+e.Longitude+'" style="border-bottom:1px solid #999;cursor:pointer;background-color:#87ceeb ">'+//'+(i == 0?'background-color:#90EE90':'')+'
			'<div class="media-left media-middle">'+
			'<a href="#">'+
			'<img class="media-object flymetothemoon" data-callid="'+e.CallLog_ID+'" data-lat="'+e.Latitude+'" data-long="'+e.Longitude+'" src="' + GetIcon(e.Group_Name_A) + '" alt="'+e.Group_Name_A+'"></a></div>'+
			'<div class="media-body">'+
			'<b class="media-heading"><span style="font-size:2vw;">'+e.CallLog_ID+'</span><span style="font-size:1.5vw;float:right;">'+dt+'</span> </b></br>'+
			'<b></b><span style="font-size:1.5vw;font-weight:bold;">'+e.Type_Emergency+'</span></br>'+
			'<b></b><span style="font-size:1.5vw;">'+e.Address+'</span></div></div>');
		}
		else if(isDispatch){
			darr.push('<div class="media" data-callid="'+e.CallLog_ID+'" data-lat="'+e.Latitude+'" data-long="'+e.Longitude+'" style="border-bottom:1px solid #999;cursor:pointer;background-color:#90EE90;">'+//'+(i == 0?'background-color:#90EE90':'')+'
			'<div class="media-left media-middle">'+
			'<a href="#">'+
			'<img class="media-object flymetothemoon" data-callid="'+e.CallLog_ID+'" data-lat="'+e.Latitude+'" data-long="'+e.Longitude+'" src="' + GetIcon(e.Group_Name_A) + '" alt="'+e.Group_Name_A+'"></a></div>'+
			'<div class="media-body">'+
			'<b class="media-heading"><span style="font-size:2vw;">'+e.CallLog_ID+'</span><span style="font-size:1.5vw;float:right;">'+dt+'</span> </b></br>'+
			'<b></b><span style="font-size:1.5vw;font-weight:bold;">'+e.Type_Emergency+'</span></br>'+
			'<b></b><span style="font-size:1.5vw;">'+e.Address+'</span></div></div>');
		}else if(isPending){
			pArr.push('<div class="media" data-callid="'+e.CallLog_ID+'" data-lat="'+e.Latitude+'" data-long="'+e.Longitude+'" style="border-bottom:1px solid #999;cursor:pointer;background-color:#FBBD08">'+//'+(i == 0?'background-color:#90EE90':'')+'
			'<div class="media-left media-middle">'+
			'<a href="#">'+
			'<img class="media-object flymetothemoon" data-callid="'+e.CallLog_ID+'" data-lat="'+e.Latitude+'" data-long="'+e.Longitude+'" src="' + GetIcon(e.Group_Name_A) + '" alt="'+e.Group_Name_A+'"></a></div>'+
			'<div class="media-body">'+
			'<b class="media-heading"><span style="font-size:2vw;">'+e.CallLog_ID+'</span><span style="font-size:1.5vw;float:right;">'+dt+'</span> </b></br>'+
			'<b></b><span style="font-size:1.5vw;font-weight:bold;">'+e.Type_Emergency+'</span></br>'+
			'<b></b><span style="font-size:1.5vw;">'+e.Address+'</span></div></div>');
		}else{
			html.push('<div class="media" data-callid="'+e.CallLog_ID+'" data-lat="'+e.Latitude+'" data-long="'+e.Longitude+'" style="border-bottom:1px solid #999;cursor:pointer;">'+//'+(i == 0?'background-color:#90EE90':'')+'
			'<div class="media-left media-middle">'+
			'<a href="#">'+
			'<img class="media-object flymetothemoon" data-callid="'+e.CallLog_ID+'" data-lat="'+e.Latitude+'" data-long="'+e.Longitude+'" src="' + GetIcon(e.Group_Name_A) + '" alt="'+e.Group_Name_A+'"></a></div>'+
			'<div class="media-body">'+
			'<b class="media-heading"><span style="font-size:2vw;">'+e.CallLog_ID+'</span><span style="font-size:1.5vw;float:right;">'+dt+'</span> </b></br>'+
			'<b></b><span style="font-size:1.5vw;font-weight:bold;">'+e.Type_Emergency+'</span></br>'+
			'<b></b><span style="font-size:1.5vw;">'+e.Address+'</span></div></div>');
		}
		//get team time (AM or PM) dtlog: "2021-07-16 15:39:42"
		
	});
	$('#incident_content').html(darr.join('')+''+doaArr.join('')+''+pArr.join('')+''+html.join(''));
	
	$('#incident_count').text("("+data.length+")");
}
/**
*Get icon.
*/
function GetIcon(type){

	var icon = {'Fire':'icon_fire',
	'Law Enforcement':'icon_law_enforcement',
	'Medical Emergencies':'icon_medical',
	'Other Calls':'icon_rescue',
	'Rescue':'icon_other_calls'};

	return BaseUrl(false)+'assets/img/map-img/incident_category_icon/'+icon[type]+'.png';
}