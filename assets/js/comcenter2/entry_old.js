$(function(){
	$('#main_splitter').jqxSplitter({  width: '100%', height: '100%',theme:'office', panels: [{ size: 800,min:150,collapsed:false },{ size: '100%',collapsed:false }],resizable:false,showSplitBar:false });
	$('#nested_splitter').jqxSplitter({  width: '100%', height: '100%',theme:theme, panels: [{ size: 300,min:150,collapsed:false },{ size: '100%',collapsed:false }],resizable:false,showSplitBar:false });
	$("#new_entry_panel").jqxPanel({ width: '100%', height: '100%', theme:theme,autoUpdate:true});

	var map = L.map('map',{zoomControl:false }).setView([mapcenter.lat,mapcenter.long], zoomOut);
	mapG = map;
	//Initialize google map
	L.esri.basemapLayer("Imagery").addTo(map);
	L.esri.basemapLayer('ImageryLabels').addTo(map);

	//Initialize group for marker
	var markerGroup = new L.layerGroup().addTo(map);
	markGroup = markerGroup;
	map.addControl( new L.Control.Search({
		url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
		jsonpParam: 'json_callback',
		propertyName: 'display_name',
		propertyLoc: ['lat','lon'],
		marker: false,//L.circleMarker([0,0],{radius:30})
		autoCollapse: true,
		autoType: false,
		minLength: 2,position:'topleft'
	}) );

	$('#firstloading').hide();
});