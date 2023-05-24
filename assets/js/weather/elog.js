$(function(){
	console.log('ready');

	var cols = [
		{text:'ID',width:50,align:'center',cellsalign:'center',pinned:true,resizable:false},
		{text:'Date',width:100,align:'center'},
		{text:'Log',align:'center'},
	];
	/*Set grid options*/
	var jqOpt =  {
		width:'100%',
		height:500,
		theme:'web',
		columns:cols,
		autorowheight:true,
		pageable: true,
		// selectionmode:'multiplecellsadvanced',
		pagesize:20,
		pagesizeoptions:['10','15','20','50'],
		pagermode:'default',
		filterable:true,
		showfilterrow:true,
		columnsresize:true,
		sortable: true,
		enabletooltips:true,
		selectionmode:'none',
		enablebrowserselection:true,
		ready: function(){
			// addDateRangefilter();
		}
	}
	$('#grid').jqxGrid(jqOpt);
});