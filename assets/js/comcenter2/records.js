$(function(){

	//Initialize JQWidget
	var cellStyle = function (row, column, value, data) {
		if(data.f == 'comcenter'){
			return 'text-warning';
		}
	}

	var calltypesource = function(){
		var r = [];
        $.ajax({
			url:BaseUrl()+'ajax/comcenter2/get_call_type',
			async:false,
			success:function(data){
				if(IsJsonString(data)){
					var obj = JSON.parse(data);
					$.each(obj,function(i,e){
						r.push(e.Type_Emergency);
					});
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
	};
	var firstNameColumnFilter = function () {
        var filtergroup = new $.jqx.filter();
        var filter_or_operator = 0;
        var filtervalue = 'Hang Up';
        var filtercondition = 'DOES_NOT_CONTAIN';
        var filter = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);
        filtergroup.addfilter(filter_or_operator, filter);
        return filtergroup;
    }();
	var cols = [
		{text:'ID',datafield:'rid',width:50,align:'center',cellsalign:'center',cellclassname:cellStyle,resizable:false,filterdelay: 99999},
		{text:'',width:100,align:'center',cellsalign:'center',cellclassname:cellStyle,resizable:false,menu:false,sortable:false,filterable:false},
		{text:'Date/Time',datafield:'dt',width:100,align:'center',cellsalign:'center',cellclassname:cellStyle,resizable:false,filterable:false,cellsformat:'yyyy-MM-dd HH:mm'},
		{text:'Caller\'s Name',datafield:'cname',width:100,align:'center',cellclassname:cellStyle,resizable:false,filterdelay: 99999},
		{text:'Call Type',datafield:'ctype',width:100,filtertype:'checkedlist',filteritems:calltypesource(),filter:firstNameColumnFilter,align:'center',cellsalign:'center',cellclassname:cellStyle,resizable:false,filterdelay: 99999},
		{text:'Incident Location',datafield:'loc',width:200,align:'center',cellclassname:cellStyle,filterdelay: 99999},
		{text:'Details',datafield:'cpart',width:'auto',align:'center',cellclassname:cellStyle,filterdelay: 99999},
		{text:'Remarks',datafield:'rem',width:200,align:'center',cellclassname:cellStyle,filterdelay: 99999},
		{text:'Operator on Duty',datafield:'ops',filtertype:'checkedlist',width:100,align:'center',cellsalign:'center',cellclassname:cellStyle,resizable:false,filterdelay: 99999},
		{text:'Status',datafield:'stats',width:100,filtertype:'checkedlist',align:'center',cellsalign:'center',cellclassname:cellStyle,resizable:false,filterdelay: 99999},
		{datafield:'f',hidden:true}
	];
	var toolbar = function(statusbar){
		var container = $("<div style='overflow: hidden; margin: 2px 10px;'></div>");
		var fromdtcontainer = $('<div style="float:left;margin-right:5px;"><div>From:</div></div>');
		var todtcontainer = $('<div style="float:left;margin-right:5px;"><div>To:</div></div>');
		var fcontainer = $('<div style="float:left;margin-right:5px;"><div>Record Filter:</div></div>');
		var fromdt = $('<div id="fromdt"></div>');
		var todt = $('<div id="todt"></div>');
		var sel = $('<select id="sel" class="form-control form-control-sm rounded-0 p-0" style="height:25px;"><option value="all">All</option>'+
			'<option value="comcenter">Comcenter Only</option><option value="ers">ERS Only</option></select>');

		var gobtn = $('<div style="float:left;margin-top:17px;margin-right:5px;cursor:pointer;" id="gobtn">Go!</div>');
		var todaybtn = $('<div style="float:left;margin-top:17px;margin-right:5px;cursor:pointer;" id="gobtn">Today</div>');

        var toolbartheme = 'metro';
        fromdtcontainer.append(fromdt);
        todtcontainer.append(todt);
        fcontainer.append(sel);

        container.append(fromdtcontainer);
        container.append(todtcontainer);
        container.append(gobtn);
        container.append(todaybtn);
        container.append(fcontainer);
        statusbar.append(container);

        fromdt.jqxDateTimeInput({theme:toolbartheme,formatString:'yyyy-MM-dd HH:mm',showTimeButton:true,width: '150px', height: '25px'});
        todt.jqxDateTimeInput({theme:toolbartheme,formatString:'yyyy-MM-dd HH:mm',showTimeButton:true,width: '150px', height: '25px'});
        gobtn.jqxButton({theme:toolbartheme,width:'20px',height:'13px'});
        todaybtn.jqxButton({theme:toolbartheme,width:'30px',height:'13px'});
        // sel.jqxDropDownList({ width: '100px', height: '25px', theme:toolbartheme,autoDropDownHeight: true });

        todt.val(moment().format('YYYY-MM-DD')+' 23:59');
 		gobtn.click(function(){
 			var fdt = fromdt.val();
 			var tdt = todt.val();


 			var filtergroup = new $.jqx.filter();
 			var filter_or_operator = 1;
			var filtervalue = fdt+','+tdt;
			var filtercondition = 'contains';
			var filter = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);

			filtergroup.addfilter(filter_or_operator, filter);
			$("#grid").jqxGrid('addfilter', 'dt', filtergroup);
			$("#grid").jqxGrid('applyfilters');
 		});

 		todaybtn.click(function(){
 			$('#grid').jqxGrid('removefilter', 'dt', true);
 		});

 		$('#sel').on('change',function(e){
 			var val = $(this).val();console.log(val)
 			var filtergroup = new $.jqx.filter();
 			var filter_or_operator = 1;
			var filtervalue = val;
			var filtercondition = 'contains';
			var filter = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);

			filtergroup.addfilter(filter_or_operator, filter);
			$("#grid").jqxGrid('addfilter', 'f', filtergroup);
			$("#grid").jqxGrid('applyfilters');
 		});
	};

	var jqOpt =  {
		width:'100%',
		height:'100%',
		theme:theme,
		columns:cols,
		showtoolbar: true,
		toolbarheight:50,
		rendertoolbar:toolbar,
		pageable: true,
		// selectionmode:'multiplecellsadvanced',
		pagesize:20,
		pagesizeoptions:['10','15','20','50','100'],
		pagermode:'default',
		filterable:true,
		showfilterrow:false,
		columnsresize:true,
		sortable:true,
		enabletooltips:true
	}


	$('#grid').jqxGrid(jqOpt);
	fetchData();
	//update grid size on window resize
	$(window).on('resize',function(){
		$('#grid').jqxGrid('render');
	});
});

function fetchData(){

	var source = {
		type:'POST',
        datatype: "json",
        datafields: [
			{ name: 'rid', type: 'number'},
			{ name: 'dt', type: 'date', format:'yyyy-MM-dd HH:mm'},
			{ name: 'cname', type: 'string'},
			{ name: 'ctype', type: 'string'},
			{ name: 'loc', type: 'string'},
			{ name: 'cpart', type: 'string'},
			{ name: 'rem', type: 'string'},
			{ name: 'ops', type: 'string'},
			{ name: 'stats', type: 'string'},
			{ name: 'f', type: 'string'},
        ],
	    url: BaseUrl()+'ajax/comcenter2/fetch_records',
		root: 'Rows',
		beforeprocessing: function(data)
		{		
			source.totalrecords = data.TotalRows;
		},
		cache: false,
		filter: function()
		{
			// update the grid and send a request to the server.
			$("#grid").jqxGrid('updatebounddata', 'filter');
		},
		sort: function()
		{
			// update the grid and send a request to the server.
			$("#grid").jqxGrid('updatebounddata', 'sort');
		},
    };		
			
	var dataadapter = new $.jqx.dataAdapter(source,{
		loadError: function(xhr, status, error)
		{
			console.log(error,status);
			alert(error);
		}
	});

	$('#grid').jqxGrid({
		virtualmode: true,
		source:dataadapter,
		rendergridrows: function()
		{
			return dataadapter.records;     
		}
	});
}


