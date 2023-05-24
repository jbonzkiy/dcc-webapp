var fdt = undefined, tdt = undefined,dtstr = false;
$(function(){
	$('#DispatchWindow').jqxWindow({
		autoOpen:false,animationType:'none',height:'500px',width:$(window).innerWidth(),resizable:true,theme:'web',
		minHeight:'300px',minWidth:'300px'
	});
	$('#horsplit').jqxSplitter({  width: '100%', height: '100%',resizable:false,splitBarSize:0,orientation:'horizontal', panels: [{ size:'10%',collapsible:false }],theme:'metro' });

	var col = [
		//CallLog_ID,Type_Emergency,Date_Log,Address,LandMark,Remarks
		{ text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,pinned:true,
		cellsrenderer: function (row, column, value) {
			var r = row;
			// console.log(r,row,r++,(r + 1))
			return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
		}},
		{ text: '', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,editable:false,pinned:true,menu:false,sortable:false,
		cellsrenderer: function (row, column, value) {
			var r = row;
			return '<div class="jqx-grid-cell-middle-align" style="margin-top:8px;"><i class="mdi mdi-clipboard-text-outline dispatch-team" data-row="'+row+'" style="cursor:pointer;" title="Dispatch Team"></i></div>';
		}},
		{ text: 'Dispatch ID',  datafield: 'CallLog_ID', width: '80px',cellsalign:'center',align:'center',resizable:false },
		{ text: 'Date',  datafield: 'ddate', width: '80px',cellsalign:'center',align:'center',filtertype:'date',cellsformat:'yyyy-MM-dd' },
		{ text: 'Time',  datafield: 'dtime', width: '60px',cellsalign:'center',align:'center' },
		{ text: 'Type_Emergency',  datafield: 'Type_Emergency', width: '150px',cellsalign:'center',align:'center' },
		{ text: 'Address',  datafield: 'Address', width: '200px',cellsalign:'center',align:'center' },
		{ text: 'LandMark',  datafield: 'LandMark', width: '200px',cellsalign:'center',align:'center' },
		{ text: 'Remarks',  datafield: 'Remarks', width: 'auto',cellsalign:'left',align:'center' },
		{ text: 'Log By',  datafield: 'LogBy', width: '80px',cellsalign:'left',align:'center' }
		
	]
	$('#grid').jqxGrid({
		width: '100%',height: '100%', theme:'metrodark',
		columns:col,
		columnsresize:true,
		enablebrowserselection:true,
		enabletooltips:true,
		showfilterrow: true,
		filterable: true,sortable:true,
		showstatusbar: true,
        statusbarheight: 50,
        renderstatusbar: function(statusbar){
        	var container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");
        	var totalrow = $('<div>Total Row<span id="with_s"></span>: <span id="totalrow">0</span></div>');
        	var dt = $('<div>Date: <span id="dt">Today ('+moment().format('YYYY-MM-DD')+')</span></div>');
        	container.append(totalrow);
        	container.append(dt);
            statusbar.append(container);
        }
	});
	GetData();

	//Time_Dispatched, Time_Departed, Time_Arrived, Time_Accomplished, Team,Remarks, Accomp_Type_Desc, DispatchBy, Depart_By, Onsite_By, Accomplish_By
	$('#dispatchTeamGrid').jqxGrid({
		width: '100%',height: '90%', theme:'metrodark',
		columns:[
			//{ text: 'ID',  datafield: 'id', width: '40px',cellsalign:'center',align:'center',resizable:false },
			{ text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,
			cellsrenderer: function (row, column, value) {
				var r = row;
				// console.log(r,row,r++,(r + 1))
				return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
			}},
			{ text: 'Time Dispatched',  datafield: 'Time_Dispatched', width: '120px',cellsalign:'center',align:'center',resizable:false },
			{ text: 'Time Accomplished',  datafield: 'Time_Accomplished', width: '120px',cellsalign:'center',align:'center',resizable:false },
			{ text: 'Team',  datafield: 'Team', width: '80px',cellsalign:'center',align:'center',resizable:false },
			{ text: 'Remarks',  datafield: 'Remarks', width: 'auto',cellsalign:'center',align:'center',resizable:true },
			{ text: 'Accomplish Type',  datafield: 'Accomp_Type_Desc', width: '250px',cellsalign:'center',align:'center',resizable:true },
			{ text: 'Dispatch By',  datafield: 'DispatchBy', width: '100px',cellsalign:'center',align:'center' }
		],
		columnsresize:true,
		enablebrowserselection:true,
		enabletooltips:true,
		showfilterrow: false,
		filterable: false,
		columnsmenu:false,
		sortable:true,groupable: true,
		selectionmode:'multiplerowsextended'
	});

	//filter date
	$('#btnSearch').click(function(){
		fdt = $('#fdt').val(),tdt = $('#tdt').val();
		fdt = moment(fdt).format('YYYY-MM-DD HH:mm:ss');
		tdt = moment(tdt).format('YYYY-MM-DD HH:mm:ss');
		if(fdt == '' || tdt == ''){
			notif('Please input date.','error');
		}else{
			if(!moment(fdt).isBefore(tdt) && fdt != tdt){
				notif('Invalid Date Range','error');
			}else{
				GetData();
			}
		}
	});
	$('#btnClearSearch').click(function(){
		fdt = undefined; tdt = undefined;
		$('#fdt,#tdt').val('');
		GetData();
	});

	$('body').on('click','.dispatch-team',function(){
		var row = $(this).data('row');
		var rdata = $('#grid').jqxGrid('getrowdata', row);
		getDispatchTeamData(rdata.CallLog_ID);
	});

	$('#DispatchWindow').on('resizing', function (event) {
		$('#dispatchTeamGrid').jqxGrid('refresh');
	}); 
});

function GetData(){
	var mdt = moment().format('YYYY-MM-DD');
	dtstr = (fdt === undefined)?'Today ('+mdt+')':fdt+' - '+tdt;
	fdt = (fdt === undefined ||fdt == '')?'':fdt;
	tdt = (tdt === undefined ||tdt == '')?'':tdt;
	var source =
    {
        datafields:
        [
            { name: 'CallLog_ID', type: 'int' },
            { name: 'Type_Emergency', type: 'string' },
            { name: 'ddate', type: 'date' },
            { name: 'dtime', type: 'string' },
            { name: 'Address', type: 'string'},
            { name: 'LandMark', type: 'string' },
            { name: 'Remarks', type: 'string' },
            { name: 'LogBy', type: 'string' }
        ],
        datatype: "json",
        data:{fdt:fdt,tdt:tdt},
        url:BaseUrl()+'ajax/ems/GetErsData',
        type:'POST',
        filter: function () {
            // update the grid and send a request to the server.
            $("#grid").jqxGrid('updatebounddata', 'filter');
        }
    };
    var dataAdapter = new $.jqx.dataAdapter(source,{
    	loadComplete: function (records) {
    		$('#dt').text(dtstr);
    		$('#totalrow').text(records.length);
    		$('#with_s').text((records.length > 1?'s':''));
    		// console.log('record',records)
    	}
    });
    $('#grid').jqxGrid({source:dataAdapter});
}

function getDispatchTeamData(cid){console.log('get dispatch')
	$.ajax({
		url:BaseUrl()+'ajax/ems/getDispatchTeamData',
		async:true,
		data:{cid:cid},
		method:'POST',
		success:function(data){
			if(IsJsonString(data)){
				var obj = JSON.parse(data);console.log(obj.length)
				if(obj.length == 0){
					notif('No Dispatched Team.','error');
				}else{
					$('.totalDispatch').text(obj.length);
					if(!$('#DispatchWindow').jqxWindow('isOpen')){
						$('#DispatchWindow').jqxWindow('open');
					}
					
					getGridDataForDispatchTeam(obj);
				}
			}else{
				console.log(data)
				alert("Something is wrong with the data.");
			}
			
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			alert('Unable to fetch items from the database.');
		}
	});
}

function getGridDataForDispatchTeam(objdata){
//Time_Dispatched, Time_Departed, Time_Arrived, Time_Accomplished, Team,Remarks, Accomp_Type_Desc, DispatchBy, Depart_By, Onsite_By, Accomplish_By
	var source =
    {
        datafields:[
			{ name: 'Time_Dispatched', type: 'string' },
            { name: 'Time_Departed', type: 'string' },
            { name: 'Time_Arrived', type: 'string' },
            { name: 'Time_Accomplished', type: 'string' },
            { name: 'Team', type: 'string'},
            { name: 'Remarks', type: 'string'},
            { name: 'Accomp_Type_Desc', type: 'string'},
            { name: 'DispatchBy', type: 'string'},
            { name: 'Depart_By', type: 'string'},
            { name: 'Onsite_By', type: 'string'},
            { name: 'Accomplish_By', type: 'string'}
		],
        datatype: "json",
        localdata:objdata
    };
    var dataAdapter = new $.jqx.dataAdapter(source,{
    	loadComplete: function(records){//console.log(source,objdata,records);
    	}

    });
    $('#dispatchTeamGrid').jqxGrid({source:dataAdapter});
}