var curLat = undefined, curLng = undefined, loc = undefined,control = undefined, teamid = 0, team = undefined,ispan = true;
var ismarker = false;
var marker = undefined;
var teamArr = {};
$(function(){
	getAllTeam();
	setMapSize();
	var zoomIn = 17, zoomOut = 13;
	//Initialize leaflet map
	var map = L.map('map',{zoomControl:false }).setView([8.4481079,124.5892236], zoomOut);
	//Initialize google map
	L.esri.basemapLayer("Imagery").addTo(map);
	L.esri.basemapLayer('ImageryLabels').addTo(map);
	// L.esri.basemapLayer('ImageryTransportation').addTo(map);
	var shpfile = new L.Shapefile(BaseUrl(false)+'assets/shp/CDO_Barangay_boundary_wgs_new1.zip',{
		onEachFeature: function(feature, layer) {//console.log(feature.properties)
            if (feature.properties) {
				//layer.bindTooltip(feature.properties.BARANGAY,{permanent: true,opacity:0.3});
            }
        },
        style: function(feature) {
            return {
                opacity: 0.4,
                fillOpacity: 0.0,
                radius: 6,
                color: "#FFE900"
            }
        }
	});
	shpfile.addTo(map);

	//check if ems crew cookies exist and value is not empty
	//if not exist then show #emscrew
	teamid = Cookies.get('teamid');//console.log(emscrew)
	team = Cookies.get('team');//console.log(emscrew)
	if(teamid === undefined){
		$('#alphaselection').show();
		$('#map,#controlsContainer,#togglepan').hide();
	}else{
		$('#vname').text(team);
		$('#alphaselection').hide();	
		$('#map,#controlsContainer,#togglepan').show();
	}

	//edit emd crew
	$('#editemscrew').click(function(){
		teamid = Cookies.get('teamid');

		$('#teamsel option[value='+teamid+']').prop('selected',true);

		$('#alphaselection').show();
		$('#map,#controlsContainer,#togglepan').hide();
	});
	
	//saving ems crew event
	$('#savebtnemscrew').click(function(){
		var tid = $('#teamsel').val();
		var tname = $('#teamsel option[value='+tid+']').text();
		Cookies.set('teamid', tid, { expires: 365 });
		Cookies.set('team', tname, { expires: 365 });
		teamid = tid; team = tname;
		$('#vname').text(team);
		$('#alphaselection').hide();	
		$('#map,#controlsContainer,#togglepan').show();
		if(ismarker){
			ismarker = false;
			
		}
		if(marker !== undefined){map.removeLayer(marker);}
		if(control !== undefined){map.removeControl(control);}
		setMapSize();
		getRunData(tid,false);
		getLocation(map);
	});

	//updating the marker location in the map
	setInterval(function(){
		if(teamid !== undefined){
			getLocation(map);
		}
	},500);

	//update the vehicle location to the db.
	setInterval(function(){
		if(teamid !== undefined){
			saveLocation();
		}
	},1000);

	//update the vehicle location to the db.
	setInterval(function(){
		if(teamid !== undefined){
			getRunData(teamid);
		}
	},20000);

	if(teamid !== undefined){getRunData(teamid);}

	$(window).resize(function(){
		setMapSize();
	});

	$('#changevh').click(function(){//console.log(teamid)
		$('#teamsel option[value='+teamid+']').prop('selected',true);
		$('#alphaselection').show();
		$('#map,#controlsContainer,#togglepan').hide();
	});
	//toggle pan
	$('#togglepan').click(function(){
		ispan = (ispan)?false:true;
	});
});

function getAllTeam(){
	$.ajax({
		url:'../ajax/maps/getAllTeam',
		async:true,
		success: function(result){
			obj = JSON.parse(result);
			var opt = [];
			$.each(obj,function(i,e){
				teamArr[e.tid] = e.name;
				opt.push('<option value="'+e.tid+'">'+e.name+'</option>');
			});
			$('#teamsel').html(opt.join(''));
		},
		error:function(jqXHR,textStatus,errorThrown){
			console.log('textStatus: ',textStatus);
			console.log('errorThrown: ',errorThrown);
		}
	});
}

function setMapSize(){
	var wH = $(window).innerHeight();
	var wW = $(window).innerWidth();
	$('#map').css({'height':wH,'width':wW});
}


function getLocation(map) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
    	var lat = position.coords.latitude, lng = position.coords.longitude;
    	curLat = lat; curLng = lng;
    	
    	// console.log('lat: ',lat,'long: ',lng)
    	// map.setView([position.coords.latitude, position.coords.longitude], 17);
    	
    	if(!ismarker){
    		ismarker = true;
    		map.flyTo([lat,lng],17);
    		marker = L.marker([lat, lng]).addTo(map);
    		if(loc !== undefined){
    			Routing(map,[lat,lng],loc);
    		}
    	}else{//console.log(156, lat, lng,control)
    		var latlng = L.latLng(lat,lng);//console.log(ispan)
    		if(ispan){
    			map.panTo([lat,lng]);
    		}
    		marker.setLatLng(new L.LatLng(lat,lng));
    		var nlatlng = new L.LatLng(lat,lng);
    		if(control !== undefined){
    			control.spliceWaypoints(control.getWaypoints().length - 2,1,nlatlng);
    		}
    	}
    	
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function saveLocation(){
	var latlng = [curLat,curLng],
	vid = teamid;//$('#alphaselection').val();

	$.ajax({
		url:'../ajax/maps/updateVehicleLocation',
		async:true,
		method:'POST',
		data:{vid:vid,latlng:JSON.stringify(latlng)},
		success: function(result){
			console.log(result);
		},
		error:function(jqXHR,textStatus,errorThrown){
			console.log('textStatus: ',textStatus);
			console.log('errorThrown: ',errorThrown);
		}
	});
}

//CallLog_ID, Time_Dispatched, Time_Departed, Time_Arrived, Time_Accomplished, Address, Landmark, a.Remarks AS rmarks, Latitude, Longitude
function getRunData(vid,async){//console.log(vid,async)
	var isAsync = (async === undefined)?true:false;
	// vid = $('#alphaselection').val();

	$.ajax({
		url:'../ajax/maps/getRunData',
		async:isAsync,
		method:'POST',
		data:{vid:vid},
		success: function(result){//console.log('getRunData raw: ',result)
			if($.trim(result) !== ''){
				if(IsJsonString(result)){
					var obj = JSON.parse(result);//console.log('getRunData object: ',obj)
					loc = [parseFloat(obj.Latitude),parseFloat(obj.Longitude)];
					$('#cid').text(obj.CallLog_ID);
					$('#tdispatch').text(obj.Time_Dispatched);
					$('#tdepart').text(obj.Time_Departed);
					$('#tarrive').text(obj.Time_Arrived);
					$('#taccom').text(obj.Time_Accomplished);
					$('#landmark').text(obj.Landmark);
					$('#remarks').text(obj.rmarks);
				}else{
					alert("INVALID DATA \n"+result);
					console.log(result)
				}
			}
		},
		error:function(jqXHR,textStatus,errorThrown){
			console.log('textStatus: ',textStatus);
			console.log('errorThrown: ',errorThrown);
		}
	});
}

//Routing(map,[lat,lng],[lat,lng]);
function Routing(map,from,to){//console.log(from,to)

	control = L.Routing.control({
		router: L.Routing.mapbox('pk.eyJ1IjoibWV0dWJlMDAxIiwiYSI6ImNrc3BmNTJteTAxZzQybmxlaDFobTZjNXMifQ._fyT5lItVjBV6nngIJLl1g'),
		waypoints: [
			L.latLng(from[0],from[1]),
			L.latLng(to[0],to[1])
		],
		routeWhileDragging: false,
		showAlternatives: true,
		altLineOptions: {
			styles: [
				{color: 'black', opacity: 0.15, weight: 9},
				{color: 'white', opacity: 0.8, weight: 6},
				{color: 'blue', opacity: 0.5, weight: 2}
			]
		}
	}).addTo(map);

}