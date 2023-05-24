$(function(){
	var wH = $(window).innerHeight(),
	wW = $(window).innerWidth();
	//initialize jqxwindow
	$('#window').jqxWindow({
		autoOpen:false,
		height:(wH * 0.7)+'px',//get 70% of the actual window height
		Width:(wW * 0.7)+'px',//get 70% of the actual window width
		// minHeight:(wH * 0.3)+'px',
		// minWidth:(wW * 0.3)+'px',
		// maxWidth: wW+'px', minHeight: wH+'px',
		resizable:true,
		theme:'metro',
		title:'NOTES!!!&nbsp;&nbsp;<button class="mini ui teal button" id="editbtn"><i class="edit icon"></i> Edit</button>'
	});
	$('#window').on('close', function (event) {
		$('#editbtn').show();
		$('#notes').summernote('destroy');
	}); 

	//initialize summernote plugin for rich textarea
	$('body').on('click','#editbtn',function(){
		var $this = $(this);
		$this.hide();
		$('#notes').summernote({
	        tabsize: 2,
	        height: ($('#windowContent').innerHeight()*0.9),
	        minHeight: null,
	      	maxHeight: null,
	      	dialogsInBody: true,
	      	disableResizeEditor: true,
	        toolbar:[
	        	['mybutton',['save_button']],
	        	['style', ['style']],
	        	['para', ['ul', 'ol', 'paragraph']],
	        	['font', ['bold', 'italic', 'underline', 'clear']],
	        	['font', ['fontsize', 'color']],
				['font', ['fontname']],
	        	['table', ['table']],
	        	['insert', ['link']]
	        ],
	        buttons:{
	        	save_button:function(context){
	        		var ui = $.summernote.ui;
	        		// create button
					var button = ui.button({
						contents: '<i class="mdi mdi-content-save"></i> Save',
						click: function () {
							var val = $("#notes").summernote('code');
							$.ajax({
								url:BaseUrl()+'ajax/weather/saveNote',
								async:true,
								data:{note:val},
								method:'POST',
								success:function(data){
									if($.trim(data) == 'OK'){
										$.notify('Success!',{position:'top center',className:'success'});
										$('#notes').summernote('destroy');
										$this.show();
									}else{
										alert('Failed to save note.');
									}
								},
								error:function(jqXHR,textStatus,errorThrown ){
									console.log(errorThrown);
									alert(textStatus);
								}
							});
						}
					});

					return button.render();   // return button as jquery object
	        	}
	        }
		});
	});
	var htmH = $(window).innerHeight();

	var col = [
		//CallLog_ID,Type_Emergency,Date_Log,Address,LandMark,Remarks
		{ text: '#', width: '80px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,
		cellsrenderer: function (row, column, value) {
			var r = row;
			// console.log(r,row,r++,(r + 1))
			return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
		}},
		{ text: 'ID',  datafield: 'cid', width: '70px',cellsalign:'center',align:'center',resizable:false, filtertype:'number' },
		{ text: 'Date', columngroup:'dt_advi', datafield: 'date_advi', width: '80px',cellsalign:'center',align:'center', filtertype:'range',cellsformat: 'yyyy-MM-dd'},
		{ text: 'Time', columngroup:'dt_advi', datafield: 'time_advi', width: '70px',cellsalign:'center',align:'center'},
		{ text: 'Time posted',  datafield: 'time_post', width: '70px',cellsalign:'center',align:'center' },
		{ text: 'Type of Advisory',  datafield: 'type_advi', width: '150px',cellsalign:'center',align:'center' },
		{ text: 'CDO Affected',  datafield: 'affected', width: '80px',cellsalign:'center',align:'center', filtertype:'checkedlist',cellsrenderer:function (row, columnfield, value, defaulthtml, columnproperties){
			value = (value == 'NOT APPLICABLE')?'N/A':value;
			return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+value+'</div>';
		}},
		{ text: 'Source', columngroup:'lnks', datafield: 'pagasa_link', width: '80px',cellsalign:'center',align:'center',filterable:false, menu:false, cellsrenderer:function (row, columnfield, value, defaulthtml, columnproperties){
			var ico = (value.search('facebook') !== -1)?'mdi-facebook-box':'mdi-file-link';
			return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+
					'<a href="'+value+'" target="_blank"><i class="mdi '+ico+'" style="font-size:24px;"></i></a></div>';
		}},
		{ text: 'CDRRMD', columngroup:'lnks', datafield: 'cdrrmd_link', width: '80px',cellsalign:'center',align:'center',filterable:false, menu:false, cellsrenderer:function (row, columnfield, value, defaulthtml, columnproperties){
			var ico = (value.search('facebook') !== -1)?'mdi-facebook-box':'mdi-file-link';
			return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+
					'<a href="'+value+'" target="_blank"><i class="mdi '+ico+'" style="font-size:24px;"></i></a></div>';
		}},
		{ text: 'Infocast',  datafield: 'infocast', width: '80px',cellsalign:'center',align:'center', filtertype:'checkedlist' },
		{ text: 'Rain(CDO)',  datafield: 'xprain', width: '80px',cellsalign:'center',align:'center', filtertype:'checkedlist' },
		{ text: 'Area Affected',  datafield: 'area_affected', width: '80px',cellsalign:'center',align:'center', filtertype:'checkedlist' },
		{ text: 'Issues & Concern',  datafield: 'issues_concern', width: '200px',cellsalign:'left',align:'center',hidden:true },
		{ text: 'Affecting CDO', columngroup:'weathersystem', datafield: 'acdo', width: '150px',cellsalign:'center',align:'center' },
		{ text: 'Not Affecting CDO', columngroup:'weathersystem', datafield: 'ncdo', width: '150px',cellsalign:'center',align:'center'},
		{ text: 'Action Taken', datafield: 'action_taken', width: 'auto',cellsalign:'left',align:'center'},
		{ text: 'Remarks',  datafield: 'remarks', width: '150px',cellsalign:'left',align:'center',hidden:true  },
		{ text: 'Staff',  datafield: 'firstname', width: '100px',cellsalign:'center',align:'center', filtertype:'checkedlist' },
		{ text: 'Missed Advisory',  datafield: 'missed_advisory', width: '200px',cellsalign:'center',align:'center',hidden:true },
		{ text: 'Missed By',  datafield: 'missed_by', width: '100px',cellsalign:'center',align:'center',hidden:true }
		
	];
	$("#grid").jqxTooltip({autoHideDelay:100,theme:'office'});
	$('#grid').jqxGrid({
		width: '100%',height: (htmH)+'px', theme:'metrodark',
		columns:col,
		columnsresize:true,
		enablebrowserselection:true,
		enabletooltips:false,
		showfilterrow: true,
		filterable: true,sortable:true,
		pageable: true,
		pagesize: 50,
		pagesizeoptions:['20','50','100'],
		selectionmode:'none',
		altrows:true,
		showtoolbar: true,
		autorowheight:true,
		columngroups:[
			{ text: 'Weather System', align: 'center', name: 'weathersystem' },
			{ text: 'Links', align: 'center', name: 'lnks' },
			{ text: 'Datetime Advisory', align: 'center', name: 'dt_advi' },
		],
		// cellhover: function(element, pageX, pageY){
		// 	var cell = $('#grid').jqxGrid('getcellatposition', pageX, pageY);
		// 	if($.inArray(cell.column,['type_advi','acdo','ncdo','action_taken','remarks']) !== -1){
		// 		var cellValue = cell.value;
		// 		//if(cellValue != null && $.trim(cellValue) != ''){
		// 			$("#grid").jqxTooltip({ content: cellValue});
		// 			$("#grid").jqxTooltip('open',pageX + 15, pageY + 15);
		// 		//}
		// 	}
  //       },
        rendertoolbar: function (statusbar) {
        	var container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");
        	var btnlinks = $('<button class="ui primary button">Notes</button>');
        	container.append(btnlinks);
        	statusbar.append(container);

        	btnlinks.click(function(){
        		$('#window').jqxWindow('open');
        		$.ajax({
					url:BaseUrl()+'ajax/weather/getNote',
					async:true,
					success:function(data){//console.log(data)
						// $('#notes').summernote('code', data);
						$('#notes').html(data);
					},
					error:function(jqXHR,textStatus,errorThrown ){
						console.log(errorThrown);
						alert(textStatus);
					}
				});
        	});
        }
	});

	GetData();
});

function GetData(){
	$('#grid').jqxGrid('showloadelement');
	var source =
    {
        datafields:
        [
            { name: 'cid', type: 'int' },
            { name: 'date_advi', type: 'date' },
            { name: 'time_advi', type: 'string' },
            { name: 'time_post', type: 'string' },
            { name: 'type_advi', type: 'string' },
			{ name: 'rescues', type: 'string' },
            { name: 'affected', type: 'string'},
            { name: 'pagasa_link', type: 'string' },
            { name: 'cdrrmd_link', type: 'string' },
            { name: 'infocast', type: 'string' },
            { name: 'xprain', type: 'string' },
            { name: 'area_affected', type: 'string' },
            { name: 'issues_concern', type: 'string'},
            { name: 'action_taken', type: 'string' },
            { name: 'remarks', type: 'string' },
            { name: 'firstname', type: 'string' },
            { name: 'acdo', type: 'string' },
            { name: 'ncdo', type: 'string' },
            { name: 'missed_advisory', type: 'string' },
            { name: 'missed_by', type: 'string' }
        ],
        datatype: "json",
        url:BaseUrl()+'ajax/weather/LoadViewerData',
        type:'POST'
    };
    var dataAdapter = new $.jqx.dataAdapter(source,{
    	loadComplete: function (records) {
    		$('#grid').jqxGrid('hideloadelement');
    		console.log('record',records)
    	}
    });
    $('#grid').jqxGrid({source:dataAdapter});
}