$(function(){
	console.log('ready');
	PopulateDateFilter();
	//get data
	// var xlsxData = getExcelData('../public/data/04.14.2020.xlsx');
	var brgyAor = GetBrgyAor();
	//Initialize splitter
	$('#mainSplitter').jqxSplitter({theme:'bootstrap',width:'100%',height:'100%',resizable: false,showSplitBar: false,orientation:'horizontal',panels:[{size:50}]});
	$('#secondSplitter').jqxSplitter({theme:'metro',width:'100%',height:'100%',showSplitBar: false,panels:[{size:200}]});
	$('#thirdSplitter').jqxSplitter({theme:'metro',width:'100%',height:'100%',showSplitBar: false,panels:[{size:'70%'}]});
	$('#tabs').jqxTabs({width:'100%',position:'bottom',theme:'metro'});
	$("#accordion").jqxNavigationBar({ width: '100%', height: '45%', theme:'bootstrap'});
	$('#statPanel').jqxPanel({width:'100%',height:200,theme:'metro'});
	$('#miscPanel').jqxPanel({width:'100%',height:'100%',theme:'metro'});
	//Initialize leaflet map
	var southWest = L.latLng(8.134687469479577, 124.32883758860405),
    northEast = L.latLng(8.547071744923766, 124.88776703196342),
    bounds = L.latLngBounds(southWest, northEast);

	var map = L.map('map',{zoomControl:true,maxBounds:bounds,maxZoom: 17,minZoom: 11 }).setView([8.33957523586266, 124.58941725522892], 11);
	L.esri.basemapLayer("Imagery").addTo(map);
	L.esri.basemapLayer('ImageryLabels').addTo(map);

	





	LoadData(brgyAor,map);
	
	var geojson = GetCSVData();
	var totalPUM = _.sumBy(geojson.features,function(o){return parseInt(o.properties['TOTAL PUM:']);});

	$('#totalPUM').text(totalPUM);

	// new L.geoJson(geojson,{style:style,onEachFeature: onEachFeature}).addTo(map);
	setTimeout(function(){$('#firstloader').fadeOut(500);},2000);
});
function GetBrgyAor(){
	var r = [];
	$.ajax({
		url:'../public/cdo_brgy_aor2.json',
		async:false,dataType: "json",
		success:function(data){
			r = data;//console.log(data)
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			alert(textStatus);
		}
	});
	return r;
}

function GetCSVData(){
	var brgyAor = GetBrgyAor();
	var r = {};
	$.ajax({
		url:'../public/data.csv',
		async:false,dataType: "text",
		success:function(data){
			data = $.csv.toObjects(data);
			data = _.sortBy(data,[function(o) { return parseInt(o.FID_1); }]);

			var merg = _.map(data,function(obj){
				return _.assign(obj,_.find(brgyAor,function(o){
					return parseInt(obj.FID_1) == parseInt(o.FID_1);
				}));
			});
			var feat = [];
			
			$.each(merg,function(i,e){
				var geo = {type:'Polygon',coordinates:e.geometry};
				var arr = e; delete arr['geometry'];
				feat.push({type:"Feature",id:"0"+(i+1),properties:arr,geometry:geo});
			});
			var geojson = {"type":"FeatureCollection","features":feat};
			r = geojson;
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			alert(textStatus);
		}
	});
	return r;
}
function style(feature) {
	var fill = (feature.properties['TOTAL PUM:'] != 0);
	var obj = {
        fillColor: getColor(feature.properties['TOTAL PUM:']),
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7,
        fill:fill
    };
    return obj;
}
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer) {
    layer.on({
        // mouseover: highlightFeature,
        // mouseout: resetHighlight,
        click: zoomToFeature
    });
}
function getColor(d) {
    return d >= 51 ? '#F50000' :
    	   d >= 41 && d <= 50  ? '#F53100' :
           d >= 31 && d <= 40  ? '#F55200' :
           d >= 21 && d <= 30  ? '#F56200' :
           d >= 11 && d <= 20   ? '#F59300' :
           d >= 1 && d <= 10   ? '#F5F500' : '#FFFFFF';
}

function PopulateBHEARTHotline(){
	var tel = [{}]
}

function getExcelData(path){console
	var r = {};
	// read Excel file and convert to json format using fetch
	var promise = fetch(path).then(function (res) {
	    /* get the data as a Blob */
	    if (!res.ok) throw new Error("fetch failed");
	    return res.arrayBuffer();
	})
	.then(function (ab) {
	    /* parse the data when it is received */
	    var data = new Uint8Array(ab);
	    var workbook = XLSX.read(data, {
	        type: "array"
	    });
	    // console.log(workbook)
	    $.each(workbook.SheetNames,function(i,e){
	    	var worksheet = workbook.Sheets[e];
	    	var _JsonData = XLSX.utils.sheet_to_json(worksheet, { header:1 });
	    	var temp = [];
	    	$.each(_JsonData,function(i2,e2){
	    		if(i2 != 0){
	    			var t = {};
	    			$.each(e2,function(i3,e3){
	    				t[_JsonData[0][i3]] = e3;
	    			});
	    			temp.push(t)
	    		}
	    	});
	    	r[e] = temp;
	    });
	   // console.log(r)
	   return r;
	});
	return promise;
	// console.log(JSON.stringify(r))
	
}
function GetExcelDataList(){
	var arr = [];
	$.ajax({
		url: "../public/data/",async:false,
		success: function(data){
			var patt = /(<img([^>]+)>)/g;
  			var result = data.replace(patt,'');
			$(result).find("td > a").each(function(i,e){
				if(i != 0){
					arr.push($(this).attr("href"));
				}
			});
		}
	});
	return arr;
}

function PopulateDateFilter(){
	var lst = GetExcelDataList();
	var arr = [];
	$.each(lst,function(i,e){
		var str = e.replace('.xlsx','');
		arr.push('<option value="'+str+'">'+moment(str,'M.D.Y').format('MMM D')+'</option>');
	});
	$('#dtfilter').html(arr.join(''));
}

function LoadData(brgyAor,map){
	var dt = $('#dtfilter').val();
	var xlsxData = getExcelData('../public/data/'+dt+'.xlsx');
	var test = {};
	xlsxData.then(function(defs){

		var pum = _.map(defs.PUM,function(obj){
			return _.assign(obj,_.find(brgyAor,function(o){
				return parseInt(obj.PUI_ID) == parseInt(o.FID_1);
			}));
		});

		var feat = [];
		
		$.each(pum,function(i,e){
			var geo = {type:'Polygon',coordinates:e.geometry};
			var arr = e; delete arr['geometry'];
			feat.push({type:"Feature",id:"0"+(i+1),properties:arr,geometry:geo});
		});
		var geojson = {"type":"FeatureCollection","features":feat};
		test = geojson;
		// console.log(geojson);
		// new L.geoJson(geojson,{style:style,onEachFeature: onEachFeature}).addTo(map);
		
	});
}