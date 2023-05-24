var mapCenter = [mapcenter.lat, mapcenter.long];

$(function(){
	console.log('ready');

	//Initialize jqx widgets
	$('#jqxsplit').jqxSplitter({ width: '100%', height: '100%', 
		panels: [{ size: '78%',collapsible: false },{ size: '22%' }],
		showSplitBar:false,resizable:false, theme:'metrodark'});

	$("#jqxExpander").jqxExpander({ width: '100%',height:'100%',theme:'darkblue',showArrow:false,toggleMode:'none'});

	var map = L.map('map',{zoomControl:false }).setView(mapCenter, zoomOut);

	L.esri.basemapLayer("Imagery").addTo(map);
	L.esri.basemapLayer('ImageryLabels').addTo(map);

	var markerGroup = new L.layerGroup().addTo(map);
	var cctvmarkergroup = new L.layerGroup().addTo(map);

	map.invalidateSize();//resize map on load
	//resize map on windows resize
	$(window).resize(function(){
		map.invalidateSize();
	});

	// setTimeout(function(){
	// 	$('#jqxsplit').jqxSplitter('collapse');console.log('collapse')
	// 	setTimeout(function(){$('#jqxsplit').jqxSplitter('expand');console.log('expand')},3000);
	// },3000)
});
