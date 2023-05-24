const uid = $('#navbar').data('uid');
var curgid = 0,hasLogChanges = false;
$(function(){
	var navbar_height = $('#navbar').innerHeight();
	var html_height = $('html').innerHeight();
	var htmH = $(window).innerHeight();
	var bh = $('body').innerHeight();

	$('#window').jqxWindow({
		autoOpen:false,animationType:'none',height:'500px',width:'700px',resizable:true,theme:'metrodark',
		minHeight:'300px',minWidth:'300px'
	});
	/*************************************************************************************************************/
	//grid
	/*************************************************************************************************************/
	$('#grid').jqxGrid({
		width: '100%',height: (html_height - navbar_height-5), theme:'metro',
		columns:gridColumn('grid'),
		columnsresize:false,
		enablebrowserselection:true,
		enabletooltips:true,
		showfilterrow: true,
		selectionmode:'none',
		columnsreorder: false,
		filterable: true,
		sortable:true,
		altrows:true,
		editable:true
	});
	populateGuages('grid');

	$('#grid,#guageLogGrid').on('cellendedit',function(event){
		var thisID = this.id;
		// event arguments.
	    var args = event.args;
	    // column data field.
	    var dataField = event.args.datafield;
	    // row's bound index.
	    var rowBoundIndex = event.args.rowindex;
	    // cell value
	    var value = args.value;
	    // cell old value.
	    var oldvalue = args.oldvalue;
	    // row's data.
	    var rowData = args.row;

	    var itemid = rowData.id;
	    console.log(this.id,args)
	    console.log(dataField,value,rowData)
	    if(value !== oldvalue && value !== ''){
	    	notif('Updating...','warn','top right');
	    	value = (dataField == 'last_data')?moment(value).format('YYYY-MM-DD HH:mm:ss'):value;
	    	dt_created = (rowData.dt_created === undefined)?moment().format('YYYY-MM-DD'):rowData.dt_created;
	    	var d = {gid:rowData.gid,field:dataField,name:rowData.name,type:rowData.type,value:value,dt_created:dt_created,uid:uid,elemid:thisID};console.log(d)
	    	$.ajax({
				url:BaseUrl()+'ajax/weather/updateGaugeStatus',
				async:true,
				data:d,
				method:'POST',
				success:function(data){console.log(rowData.gid,curgid,(rowData.gid == curgid))
					if($.trim(data) == 'OK'){
						notif('Saved!',undefined,'top right');
						if(rowData.gid == curgid){//refresh grid
							populateGuages('grid');
						}
					}else{
						alert('Saving failed. Please report the problem to the webadmin.');
					}
				},
				error:function(jqXHR,textStatus,errorThrown ){
					console.log(errorThrown);
					alert('Unable to fetch items from the database.');
				}
			});
	    }
	    // console.log(dataField,value,rowData);
	});

	$('#grid,#guageLogGrid').on('click','.btncontrol',function(){
		const action = $(this).data('action');
		var row = $(this).parent().data('row');
		var data = $('#grid').jqxGrid('getrowdata', row);
		console.log('data: ',data)
		if(action === 'open_log'){
			populateGuages('guageLogGrid',{gname:data.name,gtype:data.type});
			$('#windowHeader h5').html(data.name.toUpperCase()+'&nbsp;('+data.cnt+')');
			curgid = data.gid;
			$('#window').jqxWindow('open');
		}else{
			data = $('#guageLogGrid').jqxGrid('getrowdata', row);
			console.log('data: ',data)
			var d = {gname:data.name,gtype:data.type};
			//delete
			bootbox.confirm({
				title:'Confirm',
				size:'mini',
				message: 'Confirm deleting gauge log of '+data.name,
				callback: function(r){
					if(r){
						$.ajax({
							url:BaseUrl()+'ajax/weather/saveData',
							async:true,
							data:{tp:'gauges log delete',update_id:1,gids:[data.gid]},
							method:'POST',
							success:function(data){
								hasLogChanges = true;
								notif('Log has been deleted',undefined,'top center');
								populateGuages('guageLogGrid',d);
							},
							error:function(jqXHR,textStatus,errorThrown ){
								console.log(errorThrown);
							}
						});
					}
					
				}
			});
		}
	});
	$('#window').on({
		resizing:function (event) {
			$('#guageLogGrid').jqxGrid('refresh');
		},
		close:function(event){
			if(hasLogChanges){
				hasLogChanges = false;
				populateGuages('grid');
			}
		}
	});
	/****************************************************************
	*guageLogGrid
	*****************************************************************/
	$('#guageLogGrid').jqxGrid({
		width: '100%',height: '99%', theme:'metro',
		columns:gridColumn('guageLogGrid'),
		columnsresize:false,
		enablebrowserselection:true,
		enabletooltips:true,
		showfilterrow: true,
		selectionmode:'none',
		columnsreorder: false,
		filterable: true,
		sortable:true,
		altrows:true,
		editable:true
	});
	
});
/**
 * 
 * @param {string} gridID grid element ID
 * @param {json} dd data parameters to be passed to though ajax
 */
function populateGuages(gridID,dd){
	var others = false;
	var d = dd, g = [];
	if(d == undefined){
		
		$.each(gauges,function(i,e){
			$.each(e.gauges,function(i2,e2){
				g.push({gid:0,last_data:'',name:e2.name,remarks:'',status:'',type:e2.type,uname:'',userid:0});
			});		
		});
		g = _.uniqBy(g,'name');
		g = _.sortBy(g,o=>o.type);
	}
	console.log('g: ',g);
	//get gauges status from database
	$.ajax({
		url:BaseUrl()+'ajax/weather/getGaugesStatus',
		async:true,
		data:d,
		method:'POST',
		success:function(data){
			var cdo = [], iponan = [], other = [], bitanag = [];
			if(IsJsonString(data)){
				var obj = JSON.parse(data);console.log('obj: ',obj)
				var values = obj;
				if(d == undefined){
					var merged = _.merge(_.keyBy(g, 'name'), _.keyBy(obj, 'name'));
					values = _.values(merged);
				}
				console.log('values: ',values);

				var source ={
	                datatype: "json",
	                datafields: [
	                    { name: 'gid', type: 'int' },
	                    { name: 'last_data', type: 'date', format:'yyyy-MM-dd HH:mm:ss' },
	                    { name: 'name', type: 'string' },
	                    { name: 'remarks', type: 'string' },
	                    { name: 'status', type: 'string' },
	                    { name: 'type', type: 'string' },
	                    { name: 'uname', type: 'string' },
	                    { name: 'dt_created', type: 'string' },
	                    { name: 'cnt', type: 'int' }
	                ],
	                localdata: values
	            };
	            var dataAdapter = new $.jqx.dataAdapter(source);
	            $('#'+gridID).jqxGrid({source:dataAdapter});
			}else{
				console.log(data)
			}
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
		}
	});


}

/**
 * returns an array of columns for jqxgrid.
 * @param {string} gridID grid element ID
 * @returns array
 */
function gridColumn(gridID){
	var cellclass = function(row, column, value, data){
		if(data.status == 'down'){
			return 'red';
		}else if(data.status == 'intermittent'){
			return 'orange';
		}
	};
	var col = [];
	if(gridID == 'grid'){
		col = [
			//CallLog_ID,Type_Emergency,Date_Log,Address,LandMark,Remarks
			{ text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,pinned:false,editable:false,sortable:false,
			cellsrenderer: function (row, column, value) {
				var r = row;
				// console.log(r,row,r++,(r + 1))
				return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
			},cellclassname:cellclass},
			{ text: '', width: '70px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,pinned:false,editable:false,sortable:false,
			cellsrenderer: function (row, column, value) {
				var rdata = $('#grid').jqxGrid('getrowdata', row);//console.log(rdata.cnt)
				// console.log(r,row,r++,(r + 1))<i class="list alternate outline icon"></i>
				var btnarr = [
					'<i class="list alternate icon btncontrol" data-action="open_log" style="cursor:pointer;font-size:1.5rem;float:left;margin-left:5px;"></i>'
				]
				if(rdata.cnt > 1){
					var isplus = (rdata.cnt > 9)?'-plus':'';
					var cnt = (rdata.cnt > 9)?9:rdata.cnt;
					btnarr.push('<i class="mdi mdi-numeric-'+cnt+isplus+'-box-outline" style="margin-left:2px;font-size:1.5rem;"></i>');
				}
				return '<div class="jqx-grid-cell-middle-align" style="margin-top:5px;color:#252526;" data-row="'+row+'">'+btnarr.join('&nbsp;')+'</div>';
			},cellclassname:cellclass},
			{ text: 'Gauge',  datafield: 'name', width: '200px',cellsalign:'center',align:'center',resizable:false,editable:false,
				cellsrenderer:function (row, columnfield, value, defaulthtml, columnproperties){
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+value.toUpperCase()+'</div>';
				},cellclassname:cellclass
			},
			{ text: 'Type',  datafield: 'type', filtertype: 'checkedlist', filteritems: ['arg','wlms','wp','tandem'], width: '80px',cellsalign:'center',align:'center',resizable:false,editable:false,
				cellsrenderer:function (row, columnfield, value, defaulthtml, columnproperties){
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+value.toUpperCase()+'</div>';
				},cellclassname:cellclass
			},
			{ text: 'Status',  datafield: 'status', filtertype: 'checkedlist', filteritems: ['up','down','intermittent'], width: '100px',cellsalign:'center',align:'center',resizable:false, columntype:'dropdownlist',createeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
			        var dataSource = ['up', 'down', 'intermittent'];
			        editor.jqxDropDownList({source: dataSource });
			    },cellclassname:cellclass
			},
			{ text: 'Date of last data',  datafield: 'last_data', columntype:'datetimeinput', width: '150px',cellsalign:'center',align:'center',resizable:false, filtertype:'date', cellsformat:'yyyy-MM-dd HH:mm:ss',filterable:false,sortable:false,menu:false, 
				initeditor:function (row, cellvalue, editor, celltext, pressedkey) {
					cellvalue = (cellvalue == '')?moment()._d:cellvalue;
					editor.jqxDateTimeInput({formatString:'yyyy-MM-dd HH:mm:ss',showTimeButton:true,value:cellvalue});
					
				},geteditorvalue: function (row, cellvalue, editor) {
					return editor.val();
				},cellclassname:cellclass
			},
			{ text: 'Remarks',  datafield: 'remarks', width: 'auto',cellsalign:'left',align:'center',resizable:false,cellclassname:cellclass},
			{ text: 'Updated by',  datafield: 'uname', width: '100px',cellsalign:'center',align:'center',resizable:false,editable:false,cellclassname:cellclass},
			{datafield: 'dt_created',hidden:true},
			{datafield: 'cnt',hidden:true}
		];
	}else{
		col = [
			{ text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,pinned:false,editable:false,sortable:false,
			cellsrenderer: function (row, column, value) {
				var r = row;
				return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
			},cellclassname:cellclass},
			{ text: '', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,pinned:false,editable:false,sortable:false,
			cellsrenderer: function (row, column, value) {
				var rdata = $('#grid').jqxGrid('getrowdata', row);//console.log(rdata.cnt)
				// console.log(r,row,r++,(r + 1))<i class="list alternate outline icon"></i>
				var btnarr = [
					'<i class="trash icon btncontrol" data-action="delete" style="cursor:pointer;font-size:1.5rem;float:left;margin-left:5px;"></i>'
				]
				return '<div class="jqx-grid-cell-middle-align" style="margin-top:5px;color:#252526;" data-row="'+row+'">'+btnarr.join('&nbsp;')+'</div>';
			},cellclassname:cellclass},
			{ text: 'Status',  datafield: 'status', filtertype: 'checkedlist', filteritems: ['up','down','intermittent'], width: '100px',cellsalign:'center',align:'center',resizable:false, columntype:'dropdownlist',createeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
			        var dataSource = ['up', 'down', 'intermittent'];
			        editor.jqxDropDownList({source: dataSource });
			    },cellclassname:cellclass
			},
			{ text: 'Date of last data',  datafield: 'last_data', columntype:'datetimeinput', width: '150px',cellsalign:'center',align:'center',resizable:false, filtertype:'date', cellsformat:'yyyy-MM-dd HH:mm:ss',filterable:false,sortable:false,menu:false, 
				initeditor:function (row, cellvalue, editor, celltext, pressedkey) {
					cellvalue = (cellvalue == '')?moment()._d:cellvalue;
					editor.jqxDateTimeInput({formatString:'yyyy-MM-dd HH:mm:ss',showTimeButton:true,value:cellvalue});
					
				},geteditorvalue: function (row, cellvalue, editor) {
					return editor.val();
				},cellclassname:cellclass
			},
			{ text: 'Remarks',  datafield: 'remarks', width: 'auto',cellsalign:'left',align:'center',resizable:false,cellclassname:cellclass},
			{ text: 'Updated by',  datafield: 'uname', width: '100px',cellsalign:'center',align:'center',resizable:false,editable:false,cellclassname:cellclass},
			{datafield: 'gid',hidden:true},
			{datafield: 'name',hidden:true},
			{datafield: 'type',hidden:true}
		];
	}

	return col;
}