var jqwidgetTheme = 'metrodark';
var uid = parseInt($('#nav-get-user').data('uid'));console.log(uid);
var utype = $('#nav-get-user').data('utype');console.log(utype);
var mr_to_list = [];
var htmH = $(window).innerHeight();

$(function(){
	console.log('ready');
	$('.ui.modal.addnewitemform').modal();
	$('.ui.modal.wasteitemform').modal();
	$('.ui.modal.addqtyitemform').modal(); // {allowMultiple: true}

	$('#horizontal_splitter').jqxSplitter({
		width: '100%',
		height: '100%',
		orientation: 'vertical',
		panels: [
		   { size: "65%", min: "50%", collapsible: false},
		   { size: '35%', min: "10%", collapsible: true}
		]
	});

	$('#nested_splitter_1').jqxSplitter({ 
		width: "100%", 
		height: "100%", 
		orientation: 'horizontal', 
		panels: [
			{ size: "60%", min: "40%", collapsible: false},
			{ size: '40%', min: "10%", collapsible: true}
		]
	});


	// populate data in category field.
    var category_options = "";
    $.each(category_list, function(i, value) {
        category_options +=('<option value="'+ value+'">'+ value +'</option>');
    });
    $('#category').append(category_options);

	$("#total_qty,#aqty_item_qty").keypress(function (e) {
		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
			return false;
		}
	});
	
	$("#description_field").hide();
	$("#mrto_field").hide();
    $('input[type=radio][name=disp_or_non]').on('change', function() {
		//remove all error span
		$('.errmsg').remove();
		$('div.field.error').removeClass('error');
		
		console.log($(this).val());
        switch ($(this).val()) {
          case 'disposable':
			$("#receiptno_field").show();

            $("#description_field").hide();
			$("#mrto_field").hide();
            break;
          case 'non-disposable':
			$("#description_field").show();
			$("#mrto_field").show();

			$("#receiptno_field").hide();
            break;
        }
    });
	
	var cellclass = function(row, column, value, data){
		const qtySplitStringToArray = data.borrow_over_total_qty.split(" "); // ['1', '/', '1']
		// console.log('data', qtySplitStringToArray);
		if ( qtySplitStringToArray[0] !== qtySplitStringToArray[2] ) {
			var getPercentVal = qtySplitStringToArray[0] / qtySplitStringToArray[2];
			
			if ( qtySplitStringToArray[0] == 0 ) {
				return 'custom-red';
			}
			else if ( getPercentVal <= 0.5 ) {
				return 'custom-blue';
			}
		}
	};

	// to disable and enable cell editing in grid
	var cellbegineditND = function(row, columnfield, e, value, disp_or_non) {
		console.log(disp_or_non);
		// console.log(row, columnfield, e, value);
		var disp_or_non_value = $('#itemgrid').jqxGrid('getcellvalue', row, "disp_or_non");
		// console.log('disp_or_non', disp_or_non_value);

		// prevent default behavior
		if ( disp_or_non_value == disp_or_non ) {
			return true
		}
		else {
			return false;
		}
	} 

	var col = [
		// { text: 'ID',  datafield: 'id', width: '60px',cellsalign:'center',align:'center',resizable:false,filterable:false,editable:false,pinned:true },
		{ text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,editable:false,pinned:true,
			cellsrenderer: function (row, column, value) {
				var r = row;
				// console.log(r,row,r++,(r + 1))
				return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
			}
		},
		{ text: '', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,editable:false,pinned:true,sortable:false,menu:false,
			cellsrenderer: function (row, column, value) {
				return '<div class="jqx-grid-cell-middle-align" style="margin-top:8px;" data-row="'+row+'"><i class="list alternate outline icon logitem" style="cursor:pointer;" title="Log Item"></i></div>';
			}
		},
		(utype != 'viewer') ? { text: '', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,editable:false,pinned:true,sortable:false,menu:false,
			cellsrenderer: function (row, column, value) {
				return '<div class="jqx-grid-cell-middle-align" style="margin-top:8px;" data-row="'+row+'"><i class="plus circle icon add_total_item" style="cursor:pointer;" title="Add Total QTY"></i></div>';
			}
		} : null,
		{ text: 'Diposable/Non-Disposable',  datafield: 'disp_or_non', width: '120px',align:'center', pinned:true, filtertype:'checkedlist', filteritems:['disposable','non-disposable'], columntype:'dropdownlist',
			createeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
				editor.jqxDropDownList({ source: ['disposable', 'non-disposable'] });
			} 
		},
		{ text: 'Item Name',  datafield: 'item_name', width: '250px',align:'center', pinned:true },
		{ text: 'Available/Total Qty',  datafield: 'borrow_over_total_qty', width: '120px',align:'center',cellsalign:'center', editable:false, pinned:true, cellclassname:cellclass },
		// { text: 'Available Qty',  datafield: 'avail_qty', width: '80px',align:'center',cellsalign:'center',columntype:'numberinput', editable: false, pinned:true, cellclassname:cellclass, hidden: ( utype == 'admin' ) ? false : true },

		// change data for user or admin type
		// ( utype == 'admin' ) ? { text: 'Total Qty',  datafield: 'total_qty', width: '80px',align:'center',cellsalign:'center',columntype:'numberinput', pinned:true, cellclassname:cellclass,
		// 	validation: function (cell, value) {
		// 		var id = $("#itemgrid").jqxGrid('getcellvalue', cell.row, 'id');
		// 		var oldValue = cell.value;
		// 		var newValue = value;
		// 		var res = true;
		// 		// console.log('new value', newValue);
		// 		// console.log('old value', oldValue);

		// 		if ( newValue <= 0 ) {
		// 			res = { result: false, message: "Value cannot less than or equal to zero." };
		// 		}

		// 		$.ajax({
		// 			url:BaseUrl()+'ajax/logistic/validateTotalQty',
		// 			cache: false,
        //             async: false,
		// 			data:{
		// 				id: id,
		// 				oldValue: oldValue,
		// 				newValue: newValue
		// 			},
		// 			method:'POST',
		// 			success:function(data){
		// 				console.log('data',$.trim(data), typeof($.trim(data)));
		// 				console.log('callback', $.trim(data) == '0');
		// 				if($.trim(data) == '0'){
		// 					res = { result: false, message: "Cannot decrement value cause naa pani siya sa logs." };
		// 				}
		// 			},
		// 			error:function(jqXHR,textStatus,errorThrown ){
		// 				console.log(errorThrown);
		// 				res = { result: false, message: "Error validating data." };
		// 				alert('Error.');
		// 			}
		// 		});
				
		// 		return res;
		// 	}
		// } : { text: 'Qty',  datafield: 'borrow_over_total_qty', width: '70px',align:'center',cellsalign:'center', editable:false, pinned:true, cellclassname:cellclass },
		
		{ text: 'Unit',  datafield: 'unit', width: '70px',align:'center',cellsalign:'center', pinned:true },
		{ text: 'Have waste',  datafield: 'have_waste', width: '70px',align:'center',cellsalign:'center', editable: false, filtertype:'checkedlist', filteritems:['yes', 'no'],
			cellsrenderer: function (row, column, value) {
				var disp_or_non = $("#itemgrid").jqxGrid('getcellvalue', row, 'disp_or_non');
				var waste_qty = $("#itemgrid").jqxGrid('getcellvalue', row, 'waste_qty');
				var w_data = (waste_qty > 0) ? " ("+ waste_qty +") " : '';

				if(disp_or_non == 'non-disposable'){
					return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + value + w_data +"</div>";
				}
				return '';
			}
		},
		{ text: 'Category',  datafield: 'category', width: '120px',cellsalign:'center',align:'center',resizable:false,filtertype:'checkedlist',filteritems: category_list,columntype:'dropdownlist' },
		{ text: 'Description',  datafield: 'description', minwidth: '200px',align:'center' },

		// for disposable
		// { text: 'Receipt No.',  datafield: 'receipt_no', columngroup:'for_disposable', width: '150px',align:'center',
		// 	cellbeginedit: function(row, columnfield, e, value) {
		// 		return cellbegineditND(row, columnfield, e, value, 'disposable');
		// 	}
		// },

		// for non-disposable
		// { text: 'Property No.',  datafield: 'property_no', columngroup:'for_non_disposable', width: '100px',cellsalign:'center',align:'center',resizable:false,columntype:'numberinput',
		// 	cellbeginedit: function(row, columnfield, e, value) {
		// 		return cellbegineditND(row, columnfield, e, value, 'non-disposable');
		// 	} 
		// },
		// { text: 'Serial No.',  datafield: 'serial_no', columngroup:'for_non_disposable', width: '150px',align:'center', cellsalign:'center',
		// 	cellbeginedit: function(row, columnfield, e, value) {
		// 		return cellbegineditND(row, columnfield, e, value, 'non-disposable');
		// 	} 
		// },
		// { text: 'MR To',  datafield: 'mr_to', columngroup:'for_non_disposable', width: '200px',align:'center',filtertype:'checkedlist',filteritems:mr_to_list,columntype:'dropdownlist',
		// 	createeditor: function (row, value, editor) {
		// 		editor.jqxDropDownList({ source: mr_to_list });
		// 	},
		// 	cellbeginedit: function(row, columnfield, e, value) {
		// 		return cellbegineditND(row, columnfield, e, value, 'non-disposable');
		// 	} 
		// },
		
		{ text: 'Remarks',  datafield: 'remarks', minwidth: '200px',align:'center' },
		{ text: 'Modified By',  datafield: 'modified_by', width: '100px',align:'center', cellsalign:'center', editable:false },
		{ datafield: 'id', hidden:true }
	]

	$('#itemgrid').jqxGrid({
		width: '100%',height: '100%', theme:jqwidgetTheme,
		columns:col,
		columnsresize:true,
		enablebrowserselection:true,
		enabletooltips:true,
		showtoolbar: true,
		toolbarheight:40,
		showfilterrow: true,
		filterable: true,
		sortable:true,
		selectionmode:'singlerow',
		editable: true,
		editmode:'dblclick',
		pageable: true,
		pagesize: 50,
		pagesizeoptions:['20','50','100'],
		columngroups:[
			{ text: 'FOR DISPOSABLE', align: 'center', name: 'for_disposable' },
			{ text: 'FOR NON-DISPOSABLE', align: 'center', name: 'for_non_disposable' },
		],
		rendertoolbar: function (statusbar) {
			var container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");
			var importbtn = $('<button style="float: right; margin-left: 10px; display: none;" class="mini ui button border-radius-none"><i class="file excel outline icon"></i>Import Data from Excel</button>');
			var wasteBtn = $('<button style="float: right; margin-left: 10px;" class="mini ui button border-radius-none"><i class="trash icon"></i>Waste selected item</button>');
			var addnew = $('<button style="float: right; margin-left: 10px;" class="mini ui button border-radius-none"><i class="plus icon"></i>Add new item</button>');
			
			var mrtoSearchField = $('<select style="width: 200px; margin-left: 10px;" id="mrto_search"></select>');
			var filterSearchBtn = $('<button style="margin-left: 10px;" class="mini ui button border-radius-none">Filter</button>');
			var clearFilterSearchBtn = $('<button style="margin-left: 5px;" class="mini ui button border-radius-none">Clear Filter</button>');
			
			container.append(mrtoSearchField);
			container.append(filterSearchBtn);
			container.append(clearFilterSearchBtn);

			//set admin access restrictions
			if(utype != 'viewer'){
				container.append(wasteBtn);
				container.append(addnew);
				container.append(importbtn);
			}
			
			statusbar.append(container);

			customSelect2(
				// selector
				'mrto_search',
				// url
				BaseUrl()+'ajax/logistic/getRegularForMR',
				// post results function data
				function (item) {
					return {
						id: item.id,
						division: item.division,
						text: item.full_name
					}
				}, 
				// placeholder
				'CDRRMD personnel (Regular)', 
				// on select function 
				function(data) {
				}, 
				// on clear function
				function () {
				}
			);

			filterSearchBtn.click(function(){
				var mrto_search_id = $('#mrto_search').val();
				// console.log('mrto_search_id', mrto_search_id);

				if(mrto_search_id !== null){
					var fdata = {
						mrto_id: mrto_search_id
					}
					GetData('filtered', fdata);
				}

			});

			clearFilterSearchBtn.click(function(){
				$("#mrto_search").val(null).trigger('change');
				$('#itemgrid').jqxGrid('clearselection');

				$('#itemAddTotalGrid').jqxGrid('clear');
				$('#itemWasteGrid').jqxGrid('clear');
				$('#itemdetailsgrid').jqxGrid('clear');
				GetData();
			});
			
			var modalfirstopen2 = true;
			wasteBtn.click(function(){
				var row = $('#itemgrid').jqxGrid('getselectedrowindex');
				// console.log('waste rowindex', row);
				if (row > -1){
					var data = $('#itemgrid').jqxGrid('getrowdata', row);
					// console.log(data);

					if ( data.disp_or_non == 'non-disposable' ){
						var row = $('#itemgrid').jqxGrid('getselectedrowindex');
						var data = $('#itemgrid').jqxGrid('getrowdata', row);

						$('.ui.modal.wasteitemform').modal({closable: false}).modal('show');

						$('#itemWasteFormGrid').jqxGrid('clear');
						$('#itemWasteFormGrid').jqxGrid('clearselection');

						$('#w_disp_or_non').text(data.disp_or_non.toUpperCase());
						$('#w_item_name').text(data.item_name);

						$('#w_avail_qty').text(data.avail_qty.toString());
						$('#w_total_qty').text(data.total_qty.toString());
						$('#w_borrowed_qty').text((data.total_qty - data.avail_qty).toString());
						$('#w_category').text(data.category);
						$('#w_remarks').val('');

						if(modalfirstopen2){
							gridInit('itemWasteFormGrid');
							modalfirstopen2 = false;
						}
						getGridData('itemWasteFormGrid',{item_id:data.id});

						$('#save_waste').attr('data-item-id',data.id);

						//remove all error span
						$('.errmsg').remove();
						$('div.field.error').removeClass('error');

						
					}
					else{
						notif('Only for non-disposable items', 'warn');
					}
				}
				else{
					notif('Please select row first', 'error');
				}
			});

			importbtn.click(function(){
				$('#importExcelWindow').jqxWindow('open');
			});

			addnew.click(function(){
				$('.ui.modal.addnewitemform').modal({closable: false}).modal('show');

				//remove all error span
				$('.errmsg').remove();
				$('div.field.error').removeClass('error');

				//default value
				$('#itemname').val('');
				$('#total_qty').val('');
				$('#unit').val('');
				$('#category').val('');
				$('#remarks').val('');

				$('#description').val('');
				$("#mr_to").val(null).trigger('change');

				$('#receiptno').val('');
			});
		}
		// showfilterrow: true,
		// filterable: true
	});

	
	gridInit('itemAddTotalGrid');
	gridInit('itemWasteGrid');
	gridInit('itemdetailsgrid');
	GetData();
	getRegularForMR();

	
	/*************************************************************************************************************/
	// CDRRMD personnel (Regular)
	/*************************************************************************************************************/
	customSelect2(
		// selector
		'mr_to',
		// url
		BaseUrl()+'ajax/logistic/getRegularForMR',
		// post results function data
		function (item) {
			return {
				id: item.id,
				division: item.division,
				text: item.full_name
			}
		}, 
		// placeholder
		'CDRRMD personnel (Regular)', 
		// on select function 
		function(data) {
		}, 
		// on clear function
		function () {
		}
	);

	customSelect2(
		// selector
		'aqty_mr_to',
		// url
		BaseUrl()+'ajax/logistic/getRegularForMR',
		// post results function data
		function (item) {
			return {
				id: item.id,
				division: item.division,
				text: item.full_name
			}
		}, 
		// placeholder
		'CDRRMD personnel (Regular)', 
		// on select function 
		function(data) {
		}, 
		// on clear function
		function () {
		}
	);


	$('#itemgrid').on('cellendedit',function(event){
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

	    if(value !== oldvalue && value !== ''){
	    	notif('Updating...','warn');
	    	var d = {
				type:'item',
				subtype:'update',
				datafield:dataField,
				value:value,
				id:itemid,
				uid: uid
			};
	    	$.ajax({
				url:BaseUrl()+'ajax/logistic/parseData',
				async:true,
				data:d,
				method:'POST',
				success:function(data){console.log($.trim(data))
					if($.trim(data) == 'OK'){
						notif('Saved!');
						
						$('#itemgrid').jqxGrid('updatebounddata','cells');

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

	$('#itemdetailsgrid').on('cellendedit',function(event){
	    var args = event.args;
	    var dataField = event.args.datafield;
	    var value = args.value;
	    var oldvalue = args.oldvalue;d;

	    var itemid = args.row.id;

	    if(value !== oldvalue && value !== ''){
	    	notif('Updating...','warn');
	    	var d = {
				type:'item_details',
				subtype:'update',
				datafield:dataField,
				value:value,
				id:itemid,
				uid: uid
			};
			
	    	$.ajax({
				url:BaseUrl()+'ajax/logistic/parseData',
				async:true,
				data:d,
				method:'POST',
				success:function(data){
					console.log($.trim(data));
					if($.trim(data) == 'OK'){
						notif('Saved!');
						
						$('#itemdetailsgrid').jqxGrid('updatebounddata','cells');

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
	});

	$('#itemAddTotalGrid').on('cellendedit',function(event){
	    var args = event.args;
	    var dataField = event.args.datafield;
	    var value = args.value;
	    var oldvalue = args.oldvalue;d;

	    var itemid = args.row.id;

	    if(value !== oldvalue && value !== ''){
	    	notif('Updating...','warn');
	    	var d = {
				type:'add_qty',
				subtype:'update',
				datafield:dataField,
				value:value,
				id:itemid,
				uid: uid
			};
			
	    	$.ajax({
				url:BaseUrl()+'ajax/logistic/parseData',
				async:true,
				data:d,
				method:'POST',
				success:function(data){
					console.log($.trim(data));
					if($.trim(data) == 'OK'){
						notif('Saved!');
						
						$('#itemAddTotalGrid').jqxGrid('updatebounddata','cells');

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
	});

	$('#itemWasteGrid').on('cellendedit',function(event){
	    var args = event.args;
	    var dataField = event.args.datafield;
	    var value = args.value;
	    var oldvalue = args.oldvalue;d;

	    var itemid = args.row.wid;

	    if(value !== oldvalue && value !== ''){
	    	notif('Updating...','warn');
	    	var d = {
				type:'waste',
				subtype:'update',
				datafield:dataField,
				value:value,
				id:itemid,
				uid: uid
			};
			
	    	$.ajax({
				url:BaseUrl()+'ajax/logistic/parseData',
				async:true,
				data:d,
				method:'POST',
				success:function(data){
					console.log($.trim(data));
					if($.trim(data) == 'OK'){
						notif('Saved!');
						
						$('#itemWasteGrid').jqxGrid('updatebounddata','cells');

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
	});

	$('#itemSelectedTabs').on('selected', function (event) {
		console.log('itemSelectedTabs', event.args.item);
		var seletedTabsIndex = event.args.item;
		var row = $('#itemgrid').jqxGrid('getselectedrowindex');
		var data = $('#itemgrid').jqxGrid('getrowdata', row);


		if(data){
			if(seletedTabsIndex === 0){ // Added QTY
				getGridData('itemAddTotalGrid',{item_id:data.id});

				// show/hide column in grid details
				$('#itemdetailsgrid').jqxGrid('hidecolumn', 'mr_to');
				$('#itemdetailsgrid').jqxGrid({editable: (utype == 'viewer') ? false :true});
			}
			 
			if(seletedTabsIndex === 1 && data.disp_or_non == 'non-disposable'){ // Waste QTY
				getGridData('itemWasteGrid',{item_id:data.id});

				// show/hide column in grid details
				$('#itemdetailsgrid').jqxGrid('showcolumn', 'mr_to');
				$('#itemdetailsgrid').jqxGrid({editable:false});
			}
			else{
				$('#itemWasteGrid').jqxGrid('clear');
			}
	
			$('#itemdetailsgrid').jqxGrid('clear');
		}
	});


	$("#itemgrid").on('rowselect', function (event) {
		var id = event.args.row.id;
		var seletedTabsIndex = $("#itemSelectedTabs").jqxTabs('val');

		if(seletedTabsIndex === 0){ // Added QTY
			getGridData('itemAddTotalGrid',{item_id:id});

			if(event.args.row.disp_or_non == 'non-disposable'){
				$('#itemAddTotalGrid').jqxGrid('showcolumn', 'mr_to');
				$('#itemAddTotalGrid').jqxGrid('hidecolumn', 'dr_no');
			}
			else{
				$('#itemAddTotalGrid').jqxGrid('showcolumn', 'dr_no');
				$('#itemAddTotalGrid').jqxGrid('hidecolumn', 'mr_to');
	
				$('#itemAddTotalGrid').jqxGrid('autoresizecolumns'); 
			}

		}
		
		if(seletedTabsIndex === 1 && event.args.row.disp_or_non == 'non-disposable'){ // Waste QTY
			getGridData('itemWasteGrid',{item_id:id});
		}
		else{
			$('#itemWasteGrid').jqxGrid('clear');
		}

		$('#itemdetailsgrid').jqxGrid('clear');
	});

	$("#itemAddTotalGrid").on('rowselect', function (event) {
		var rowindex = $('#itemgrid').jqxGrid('getselectedrowindex');
		var data = $('#itemgrid').jqxGrid('getrowdata', rowindex);

		if(data && data.disp_or_non == 'non-disposable'){
			var id = event.args.row.id;
			getGridData('itemdetailsgrid',{type:'added',id:id});
		}
	});

	$("#itemWasteGrid").on('rowselect', function (event) {
		var rowindex = $('#itemgrid').jqxGrid('getselectedrowindex');
		var data = $('#itemgrid').jqxGrid('getrowdata', rowindex);

		if(data && data.disp_or_non == 'non-disposable'){
			var id = event.args.row.wid;
			getGridData('itemdetailsgrid',{type:'waste',id:id});
		}
	});


	var modalfirstopen = true;
	$('body').on('click','.logitem',function(){
		var row = $(this).parent().data('row');
		var data = $('#itemgrid').jqxGrid('getrowdata', row);
		$('.ui.modal.itemlogmodal').modal('show');
		$('.itemlogmodal .header').text(data.item_name);
		
		$('#itemloggrid').jqxGrid('clear');

		if(modalfirstopen){
			gridInit('itemloggrid');
			modalfirstopen = false;
		}
		getGridData('itemloggrid',{item_id:data.id});

		if(data.disp_or_non == 'non-disposable'){
			$('#itemloggrid').jqxGrid('showcolumn', 'dtr');
			$('#itemloggrid').jqxGrid('showcolumn', 'returner');
			$('#itemloggrid').jqxGrid('showcolumn', 'returner_div');
			$('#itemloggrid').jqxGrid('showcolumn', 'receive_by');
		}
		else{
			$('#itemloggrid').jqxGrid('hidecolumn', 'dtr');
			$('#itemloggrid').jqxGrid('hidecolumn', 'returner');
			$('#itemloggrid').jqxGrid('hidecolumn', 'returner_div');
			$('#itemloggrid').jqxGrid('hidecolumn', 'receive_by');

			$('#itemloggrid').jqxGrid('autoresizecolumns'); 
		}

		$('#itemloggrid').jqxGrid('addgroup', 'date_created');
		$("#itemloggrid").jqxGrid('showgroupsheader', false);
	});

	$('body').on('click','.add_total_item',function(){
		var row = $(this).parent().data('row');
		var data = $('#itemgrid').jqxGrid('getrowdata', row);

		$('.ui.modal.addqtyitemform').modal({closable: false}).modal('show');

		$('#aqty_disp_or_non').text(data.disp_or_non.toUpperCase());
		$('#aqty_item_name').text(data.item_name);
		$('#aqty_total_qty').text(data.total_qty.toString());
		$('#aqty_category').text(data.category);
		
		$('#aqty_item_qty').val('');
		$('#aqty_remarks').val('');
		
		if(data.disp_or_non == 'disposable'){
			$('#aqty_dr_no').val('');
			$('#aqty_dr_no_field').show();
			$('#aqty_mr_to_field').hide();
		}
		else if(data.disp_or_non == 'non-disposable'){
			$("#aqty_mr_to").val(null).trigger('change');
			$('#aqty_mr_to_field').show();
			$('#aqty_dr_no_field').hide();
		}

		$('#save_aqty').attr('data-item-id',data.id);

		//remove all error span
		$('.errmsg').remove();
		$('div.field.error').removeClass('error');
	});

	$('#jqxFileUpload').on('uploadEnd', function (event) {
	    var args = event.args;
	    var fileName = args.file;
	    var serverResponce = args.response;
	    var obj = JSON.parse(serverResponce);
	    var cntins = obj.insert_data.length, cntdup = obj.dup_data.length;
	    $('#existTabHead').text((cntdup == 0?'':'('+cntdup+')'));
	    $('#addTabHead').text((cntins == 0?'':'('+cntins+')'));
	    getGridData('existGrid',obj);
	    getGridData('addedGrid',obj);
	    $('#itemgrid').jqxGrid('updatebounddata');
	    // console.log(serverResponce)
	    console.log(obj);
	});

	var firstwinopen = true;
	$('#importExcelWindow').on('open', function (event){
		if(firstwinopen){
			gridInit('existGrid');
			gridInit('addedGrid');
			firstwinopen = false;
		}
	}); 
	$('#windowcontainer').show();

	$('#saveitem').click(function(){
		if(uid === undefined){
			alert('Session expired. Please re-login. Thank you!');
			location.reload();
			return false;
		}

		// disposable or non-disposable
		var disp_or_non = $('input[name="disp_or_non"]:checked').val();

		// get fields value
		var itemname = $('#itemname').val(),
		total_qty = $('#total_qty').val(),
		unit = $('#unit').val(),
		remarks = $('#remarks').val();

		// only for disposable
		var receiptno = $('#receiptno').val();
		
		// only for non-disposable
		var description = $('#description').val(),
		category = $('#category').val(),
		mrto_id = $('#mr_to').val(); // mr to id
		// get fields value

		//remove all error span
		$('.errmsg').remove();
		$('div.field.error').removeClass('error');

		// validate form input fields
		var errArr = [];

		if($.trim(itemname) == ''){errArr.push({elem:'itemname',msg:'Empty'});}
		if($.trim(total_qty) == ''){errArr.push({elem:'total_qty',msg:'Empty'});}
		if($.trim(unit) == ''){errArr.push({elem:'unit',msg:'Empty'});}
		if($.trim(category) == ''){errArr.push({elem:'category',msg:'Empty'});}
		// if($.trim(remarks) == ''){errArr.push({elem:'remarks',msg:'Empty'});}
		
		// for only disposable
		if ( disp_or_non == 'disposable' ) {
			if($.trim(receiptno) == ''){errArr.push({elem:'receiptno',msg:'Empty'});}
		}
		// for only non-disposable
		else if ( disp_or_non == 'non-disposable' ) {
			if($.trim(description) == ''){errArr.push({elem:'description',msg:'Empty'});}
			if($.trim(mrto_id) == ''){errArr.push({elem:'mr_to',msg:'Empty'});}
		}
		
		
		if(errArr.length > 0){
			$.each(errArr,function(i,e){
				var $parent = $('#'+e.elem).parent();
				$('label',$parent).append('<small class="errmsg" style="color: #DB2828;font-weight:normal;">&nbsp;&nbsp;&nbsp;'+e.msg+'</small>');
				$parent.addClass('error');
			});
			$('#'+errArr[0].elem).focus();
			$('#frmPanel').jqxPanel('scrollTo', $('#'+errArr[0].elem).offset().top, 0);
		}else{
			bootbox.confirm({
				title:'Confirm',
				size:'mini',
				message: 'Confirm add new item.',
				callback: function(r){
					if(r){
						$('.ui.form').addClass('loading');
						var data = {
							type: 'item',
							subtype: 'insert',
							uid: uid,
		
							disp_or_non: disp_or_non,
							
							itemname: itemname,
							total_qty: total_qty,
							unit: unit,
							category: category,
							remarks: remarks
						};
		
						if ( disp_or_non == 'disposable' ) {
							data.receiptno = receiptno;
						}
						else if ( disp_or_non == 'non-disposable' ) {
							data.description = description;
							data.mrto_id = mrto_id;
						}
						console.log('data', data);
						
						$.ajax({
							url:BaseUrl()+'ajax/logistic/parseData',
							async:true,
							data:data,
							method:'POST',
							success:function(data){
								console.log($.trim(data));
								
								if($.trim(data) == 'OK'){
									$('.ui.modal.addnewitemform').modal('hide');
									notif('Saved!');
									$('#itemgrid').jqxGrid('updatebounddata', 'data');
									
									clearForm();
								}
								else if ( $.trim(data) == 'duplicate' ) {
									$('.ui.modal.addnewitemform').modal('hide');
									notif('Duplicate data', 'error');
								}
								else{
									alert('Saving failed. Please report the problem to the webadmin.');
								}
								// console.log(data)
								$('.ui.form').removeClass('loading');
							},
							error:function(jqXHR,textStatus,errorThrown ){
								console.log(errorThrown);
								$('.ui.form').removeClass('loading');
								alert('Unable to fetch items from the database.');
							}
						});
					}
				}
			});
		}
	});

	$('#save_waste').click(function(){
		if(uid === undefined){
			alert('Session expired. Please re-login. Thank you!');
			location.reload();
			return false;
		}

		var item_id = $(this).attr('data-item-id'),
		avail_qty = $('#w_avail_qty').val()
		remarks = $('#w_remarks').val(),
		waste_arr_id = [];

		//remove all error span
		$('.errmsg').remove();
		$('div.field.error').removeClass('error');

		// validate form input fields
		var errArr = [];
		
		var getselectedrowindexes = $('#itemWasteFormGrid').jqxGrid('getselectedrowindexes');
		if($.trim(remarks) == ''){errArr.push({elem:'w_remarks',msg:'Empty'});}

		
		if(errArr.length > 0){
			$.each(errArr,function(i,e){
				var $parent = $('#'+e.elem).parent();
				$('label',$parent).append('<small class="errmsg" style="color: #DB2828;font-weight:normal;">&nbsp;&nbsp;&nbsp;'+e.msg+'</small>');
				$parent.addClass('error');
			});
			$('#'+errArr[0].elem).focus();
			$('#wasteFormPanel').jqxPanel('scrollTo', $('#'+errArr[0].elem).offset().top, 0);
		}
		else{
			if (getselectedrowindexes.length > 0){
				// returns the selected row's data.
				getselectedrowindexes.forEach(index => {
					var selectedRowData = $('#itemWasteFormGrid').jqxGrid('getrowdata', index);
					console.log('selectedRowData', selectedRowData);
					waste_arr_id.push(selectedRowData.id);
				});
				console.log('waste_arr_id', waste_arr_id, item_id, remarks);
	
				bootbox.confirm({
					title:'Confirm',
					size:'mini',
					message: 'Confirm waste item.',
					callback: function(r){
						if(r){
							var data = {
								type: 'waste',
								subtype: 'insert',
								uid: uid,
	
								item_id: item_id,
								log_id: null,
								avail_qty: avail_qty,
								waste_arr_id: waste_arr_id,
								waste_qty: getselectedrowindexes.length,
								remarks: remarks
							};
							
							$.ajax({
								url:BaseUrl()+'ajax/logistic/parseData',
								async:true,
								data:data,
								method:'POST',
								success:function(data){
									console.log($.trim(data));
									
									if($.trim(data) == 'OK'){
										$('.ui.modal.wasteitemform').modal('hide');
	
										notif('Saved!');
										$('#itemgrid').jqxGrid('updatebounddata','cells');
										$('#itemWasteGrid').jqxGrid('updatebounddata');
										$('#itemdetailsgrid').jqxGrid('clear');
									}
									else{
										alert('Saving failed. Please report the problem to the webadmin.');
									}
								},
								error:function(jqXHR,textStatus,errorThrown ){
									console.log(errorThrown);
									alert('Unable to fetch items from the database.');
								}
							});
						}
					}
				});
	
			}
			else{
				notif('NO Selected row', 'error');
			}
		}

	});

	$('#save_aqty').click(function(){
		if(uid === undefined){
			alert('Session expired. Please re-login. Thank you!');
			location.reload();
			return false;
		}

		var disp_or_non = $('#aqty_disp_or_non').text().toLowerCase();

		// get fields value
		var item_id = $(this).attr('data-item-id'),
		add_qty = $('#aqty_item_qty').val(),
		c_total_qty = $('#aqty_total_qty').text(),
		dr_no = $('#aqty_dr_no').val(),
		mrto_id = $('#aqty_mr_to').val(); // mr to id
		remarks = $('#aqty_remarks').val();
		// get fields value

		//remove all error span
		$('.errmsg').remove();
		$('div.field.error').removeClass('error');

		// validate form input fields
		var errArr = [];

		if($.trim(add_qty) == ''){errArr.push({elem:'aqty_item_qty',msg:'Empty'});}
		if(parseInt($.trim(add_qty)) == 0 && $.trim(add_qty) != ''){errArr.push({elem:'aqty_item_qty',msg:'value cannot equal to zero.'});}
		// if($.trim(remarks) == ''){errArr.push({elem:'aqty_remarks',msg:'Empty'});}

		// for only disposable
		if ( disp_or_non == 'disposable' ) {
			// if($.trim(dr_no) == ''){errArr.push({elem:'aqty_dr_no',msg:'Empty'});}
		}
		// for only non-disposable
		else if ( disp_or_non == 'non-disposable' ) {
			if($.trim(mrto_id) == ''){errArr.push({elem:'aqty_mr_to',msg:'Empty'});}
		}
		
		
		if(errArr.length > 0){
			$.each(errArr,function(i,e){
				var $parent = $('#'+e.elem).parent();
				$('label',$parent).append('<small class="errmsg" style="color: #DB2828;font-weight:normal;">&nbsp;&nbsp;&nbsp;'+e.msg+'</small>');
				$parent.addClass('error');
			});
			$('#'+errArr[0].elem).focus();
		}else{
			bootbox.confirm({
				title:'Confirm',
				size:'mini',
				message: 'Confirm Add QTY.',
				callback: function(r){
					if(r){
						var data = {
							type: 'add_qty',
							subtype: 'insert',
							uid: uid,
							disp_or_non: disp_or_non,

							item_id: item_id,
							add_qty: add_qty,
							c_total_qty: c_total_qty,
							dr_no: dr_no,
							mrto_id: mrto_id,
							remarks: remarks
						};
						
						$.ajax({
							url:BaseUrl()+'ajax/logistic/parseData',
							async:true,
							data:data,
							method:'POST',
							success:function(data){
								console.log($.trim(data));
								
								if($.trim(data) == 'OK'){
									$('.ui.modal.addqtyitemform').modal('hide');

									notif('Success!');
									$('#itemgrid').jqxGrid('updatebounddata','cells');
									$('#itemAddTotalGrid').jqxGrid('updatebounddata');
									$('#itemdetailsgrid').jqxGrid('clear');
								}
								else{
									alert('Saving failed. Please report the problem to the webadmin.');
								}
							},
							error:function(jqXHR,textStatus,errorThrown ){
								console.log(errorThrown);
								alert('Unable to fetch items from the database.');
							}
						});
					}
				}
			});
		}

	});

	//initialize jqxwidgets
	$('#importExcelWindow').jqxWindow({height:'680px',width:'700px',isModal: true,autoOpen:false,animationType:'none',resizable:false,theme:'metro'}); 
	$('#jqxFileUpload').jqxFileUpload({ width: '100%',browseTemplate: 'inverse',cancelTemplate: 'warning',uploadTemplate: 'primary', uploadUrl: BaseUrl()+'ajax/logistic/importExcel', fileInputName: 'importexcel',theme:'metro',accept:'.xlsx,.xls,.csv',multipleFilesUpload:false });
	$('#jqxTabs').jqxTabs({ width: '100%', height: '80%', position: 'top',theme:jqwidgetTheme});
	$('#itemListTabs').jqxTabs({ width: '100%', height: '80%', theme: 'metrodark' });
	$('#itemSelectedTabs').jqxTabs({ width: '100%', height: '100%', theme: 'metrodark' });


	if(utype == 'viewer'){
		$('#itemgrid').jqxGrid({selectionmode:'singlerow',editable:false});
		$('#itemdetailsgrid').jqxGrid({editable:false});
	}

	$('#firstloading').hide();
});

function clearForm(){
	//remove all error span
	$('.errmsg').remove();
	$('div.field.error').removeClass('error');

	$('#itemname').val(''),
	$('#total_qty').val(''),
	$('#unit').val(''),
	$('#remarks').val('');

	// only for disposable
	$('#receiptno').val('');

	// only for non-disposable
	$('#description').val('');
	$('#category').val('');

	$("#mr_to").val('').trigger('change');
}

function getRegularForMR(){
	$.ajax({
		url:BaseUrl()+'ajax/logistic/getRegularForMR',
		async:true,
		method:'GET',
		data: {
			q: ''
		},
		success:function(data){
			if(IsJsonString(data)){
				var obj = JSON.parse(data);

				var mr_to_full_name_list = _.map(obj,'full_name');
				mr_to_list = mr_to_full_name_list;
				$('#itemgrid').jqxGrid('setcolumnproperty', 'mr_to', 'filteritems', mr_to_full_name_list);
			}else{
				console.log(data)
				alert('Something went wrong while trying to fetch user list');
			}
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
		}
	});
}

function gridCol(elemid){
	var col = [];
	switch(elemid){
		case 'existGrid':
			col = [
				{ text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,
				cellsrenderer: function (row, column, value) {
					var r = row;
					// console.log(r,row,r++,(r + 1))
					return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
				}},
				{ text: 'Property No.',datafield:'property_no',cellsalign:'center',align:'center',width: '80px' },
				{ text: 'Item Name',datafield:'item_name' },
				{ text: 'Description',datafield:'description' },
				{ text: 'Serial No.',datafield:'serial_no' },
				{ text: 'Qty',datafield:'total_qty',cellsalign:'center',align:'center',width: '50px' },
				{ text: 'User',datafield:'mr_to' },
				{ datafield: 'dbinfo', hidden:true },
				{ datafield: 'id', hidden:true }
			];
			break;
		case 'addedGrid':
			col = [
				{ text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,
				cellsrenderer: function (row, column, value) {
					var r = row;
					// console.log(r,row,r++,(r + 1))
					return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
				}},
				{ text: 'Property No.',datafield:'property_no',cellsalign:'center',align:'center',width: '80px' },
				{ text: 'Item Name',datafield:'item_name' },
				{ text: 'Description',datafield:'description' },
				{ text: 'Serial No.',datafield:'serial_no' },
				{ text: 'Qty',datafield:'total_qty',cellsalign:'center',align:'center',width: '50px' },
				{ text: 'User',datafield:'mr_to' }
			];
			break;
		case 'itemloggrid':
			col = [
				// { text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,
				// cellsrenderer: function (row, column, value) {
				// 	var r = row;
				// 	// console.log(r,row,r++,(r + 1))
				// 	return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
				// }},
				{ text: 'Qty',datafield:'borrow_qty',cellsalign:'center',align:'center' },
				{ text: 'Datetime Borrowed',columngroup:'borrower',datafield:'dtb',cellsalign:'center',align:'center' },
				{ text: 'Borrowed By',datafield:'borrower',columngroup:'borrower',cellsalign:'center',align:'center', width: '150px' },
				{ text: 'Borrower-Division',datafield:'borrower_div',columngroup:'borrower',cellsalign:'center',align:'center',width: '110px' },
				{ text: 'Datetime Returned',datafield:'dtr',columngroup:'returner',cellsalign:'center',align:'center',width: '125px' },
				{ text: 'Returned By',datafield:'returner',columngroup:'returner',cellsalign:'center',align:'center',width: '100px' },
				{ text: 'Returner-Division',datafield:'returner_div',columngroup:'returner',cellsalign:'center',align:'center',width: '100px' },
				{ text: 'Received By',datafield:'receive_by',cellsalign:'center',align:'center',width: '100px' },
				{ text: 'Remarks',datafield:'remarks',align:'center',width: '230px' },
				{ text: 'Modified By',  datafield: 'modified_by', width: '150px',align:'center' },
				{ text: 'Date Created',datafield:'date_created',align:'center',cellsalign:'center', width: '125px', hidden: true },
			];
			break;
		case 'itemdetailsgrid':
			col = [
				{ text: 'Property No.', datafield: 'property_no', cellsalign:'center', align:'center' },
				{ text: 'Serial No.',  datafield: 'serial_no', align:'center', cellsalign:'center' },
				{ text: 'MR To', datafield: 'mr_to', cellsalign:'center', align:'center', hidden: true, width: '125px' },
				{ text: 'Modified By',  datafield: 'modified_by', align:'center', cellsalign:'center', width: '80px', editable: false },
				{ datafield: 'id', hidden:true }
			];
			break;
		case 'itemWasteGrid':
			col = [
				// { text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,
				// cellsrenderer: function (row, column, value) {
				// 	var r = row;
				// 	// console.log(r,row,r++,(r + 1))
				// 	return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
				// }},
				{ text: 'Waste Qty', datafield: 'waste_qty', cellsalign:'center', align:'center', width: '70px', editable: false },
				{ text: 'Unit',  datafield: 'unit', width: '60px', align:'center', cellsalign:'center', editable: false },
				// { text: 'MR To', datafield: 'mr_to', cellsalign:'center', align:'center' },
				{ text: 'Remarks',  datafield: 'remarks', minwidth: '200px',align:'center' },
				{ text: 'Date Created', datafield: 'date_created', align:'center', cellsalign:'center', width: '125px', editable: false },
				{ text: 'Modified By',  datafield: 'modified_by', align:'center', cellsalign:'center', width: '90px', editable: false },
				{ datafield: 'delivery_id', hidden:true },
				{ datafield: 'id', hidden:true }
			];
			break;
		case 'itemAddTotalGrid':
			col = [
				{ text: 'Added Qty', datafield: 'added_qty', cellsalign:'center', align:'center', width: '70px', editable: false,
					cellsrenderer: function (row, column, value) {
						var c_value = value === '' ? '' : ('+ '+ value);
						return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + c_value + "</div>";
					}
				},
				{ text: 'Current Total Qty', datafield: 'total_qty', align:'center', cellsalign:'center', width: '100px', editable: false },
				{ text: 'Delivery Receipt No.', datafield: 'dr_no', align:'center', cellsalign:'center' },
				{ text: 'MR To', datafield: 'mr_to', cellsalign:'center', align:'center', columntype:'dropdownlist', editable: (utype == 'admin') ? true : false, hidden: true,
					createeditor: function (row, value, editor) {
						editor.jqxDropDownList({ source: mr_to_list });
					},
				},
				{ text: 'Remarks',  datafield: 'remarks', minwidth: '200px',align:'center' },
				{ text: 'Date Created', datafield: 'date_created', align:'center', cellsalign:'center', width: '115px', editable: false },
				{ text: 'Modified By',  datafield: 'modified_by', width: '70px', align:'center', cellsalign:'center', editable: false },
				{ datafield: 'id', hidden:true }
			];
			break;
		case 'itemWasteFormGrid':
			col = [
				{ text: 'Property No.', datafield: 'property_no', cellsalign:'center', align:'center' },
				{ text: 'Serial No.',  datafield: 'serial_no', align:'center', cellsalign:'center' },
				{ text: 'MR To', datafield: 'mr_to', cellsalign:'center', align:'center', width: '140px' },
				{ text: 'Date Created', datafield: 'date_created', align:'center', cellsalign:'center', width: '125px' },
				{ text: 'Modified By',  datafield: 'modified_by', align:'center', cellsalign:'center', width: '90px' },
				{ datafield: 'id', hidden:true }
			];
			break;
	}
	return col;
}

function gridInit(elemid){
	var gridOpt = {
		width: '100%',height: '500px', theme:jqwidgetTheme,
		columns:gridCol(elemid),
		columnsresize:true,
		enablebrowserselection:true,
		enabletooltips:true,
		groupable: false,
	};

	if(elemid == 'itemloggrid'){
		gridOpt['groupsexpandedbydefault'] = true;
		gridOpt['groupable'] = true;
		gridOpt['columngroups'] = [
			{ text: 'BORROWER', align: 'center', name: 'borrower' },
			{ text: 'RETURNER', align: 'center', name: 'returner' }
		];
		gridOpt['groups'] = ['date_created'];
		gridOpt['pageable'] = true;
		gridOpt['pagesize'] = 50;
		gridOpt['pagesizeoptions'] = ['20','50','100'];
	}

	else if(elemid == 'itemdetailsgrid'){
		gridOpt['height'] = '40%';
		gridOpt['sortable'] = true;

		gridOpt['editable'] = true;
		gridOpt['editmode'] = 'dblclick';
		
		gridOpt['rendertoolbar'] = function (statusbar) {
			var container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");
			statusbar.append(container);
		}
	}

	else if(elemid == 'itemWasteGrid'){
		gridOpt['height'] = '60%';

		gridOpt['editable'] = true;
		gridOpt['editmode'] = 'dblclick';
	}

	else if(elemid == 'itemAddTotalGrid'){
		gridOpt['height'] = '60%';
		
		gridOpt['editable'] = true;
		gridOpt['editmode'] = 'dblclick';
	}

	else if(elemid == 'itemWasteFormGrid'){
		gridOpt['height'] = '200px';
		gridOpt['selectionmode'] = 'checkbox';
		gridOpt['editable'] = false;
	}

	else if(elemid == 'existGrid'){
		gridOpt['rowdetails'] = true;
		gridOpt['rowdetailstemplate'] = {rowdetailsheight: 130};
		gridOpt['initrowdetails'] = function (index, parentElement, gridElement, datarecord) {
			var html = '<table border="1" style="border-collapse:collapse;margin-top:10px;width:370px;">';
			html += '<tr><th>Property No.:</th><td>'+datarecord.property_no+'</td></tr>';
			html += '<tr><th>Item Name:</th><td>'+datarecord.item_name+'</td></tr>';
			html += '<tr><th>Description:</th><td style="max-width:290px;overflow:hidden;text-overflow: ellipsis;white-space:nowrap;">'+datarecord.description+'</td></tr>';
			html += '<tr><th>Qty:</th><td>'+datarecord.total_qty+'</td></tr>';
			html += '<tr><th>User Driver:</th><td>'+datarecord.mr_to+'</td></tr>';

			html += '</table>';
			$(parentElement).html(html);
		};
		gridOpt['selectionmode'] = 'checkbox';
		gridOpt['showtoolbar'] = true;
		gridOpt['toolbarheight'] = 40;
		gridOpt['rendertoolbar'] = function (statusbar) {
			var container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");
			var updatebtn = $('<button class="mini primary ui button">Update selected <span id="cntselected" data-cnt="0"></span></button>');
			container.append(updatebtn);
			statusbar.append(container);

			updatebtn.click(function(){
				var cnt = $('#cntselected').attr('data-cnt');
				if(cnt > 0){
					var conf = confirm('Update selected item'+(cnt > 1?'s':'')+' ('+cnt+').');
					if(conf){
						var updatedata = [];
						var rowindexes = $('#existGrid').jqxGrid('getselectedrowindexes');
						$.each(rowindexes,function(i,e){
							var data = $('#existGrid').jqxGrid('getrowdata', e);
							updatedata.push(data);
						});
						$.ajax({
							url:BaseUrl()+'ajax/logistic/parseData',
							async:true,
							data:{type:'update',updatedata:updatedata},
							method:'POST',
							success:function(data){
							if($.trim(data) == 'SUCCESS'){
									$.notify('Success!',{position:'top center',className:'success'});
									$('#itemgrid').jqxGrid('updatebounddata');
								}else{
									console.log(data);
									alert('Something went wrong while trying to update the data.');
								}
							},
							error:function(jqXHR,textStatus,errorThrown ){
								console.log(errorThrown);
							}
						});
					}
				}
			});
		}
	}
	$('#'+elemid).jqxGrid(gridOpt);

	if(elemid == 'existGrid'){
		var selcnt = 0;
		$('#existGrid').on('rowselect rowunselect', function(event){
		    var rowindexes = $('#existGrid').jqxGrid('getselectedrowindexes');
		    $('#cntselected').text((rowindexes.length == 0?'':'('+rowindexes.length+')')).attr('data-cnt',rowindexes.length);
		});
	}
}

function getGridData(elemid,objdata){
	var datafields = {};
	var localdata = {};
	switch(elemid){
		case 'existGrid':
			datafields = [
				{ name: 'id', type: 'int' },
	            { name: 'property_no', type: 'int' },
	            { name: 'description', type: 'string'},
	            { name: 'serial_no', type: 'string'},
	            { name: 'item_name', type: 'string'},
	            { name: 'mr_to', type: 'string'},
	            { name: 'total_qty', type: 'int'},
	            { name: 'dbinfo', type: 'string'}
			];
			localdata = objdata.dup_data;
			break;
		case 'addedGrid':
			datafields = [
	            { name: 'property_no', type: 'int' },
	            { name: 'description', type: 'string'},
	            { name: 'serial_no', type: 'string'},
	            { name: 'item_name', type: 'string'},
	            { name: 'mr_to', type: 'string'},
	            { name: 'total_qty', type: 'int'}
			];
			localdata = objdata.insert_data;
			break;
		case 'itemloggrid':
			datafields = [
				{ name: 'id', type: 'int' }, // logs id
	            { name: 'borrow_qty', type: 'int' }, // total borrowed qty
	            // { name: 'total_qty', type: 'int'}, // total default qty
	            { name: 'dtb', type: 'string'}, // datetime borrowed
	            { name: 'dtr', type: 'string'}, // datetime returned
	            { name: 'borrower', type: 'string'}, // name of borrower
	            { name: 'borrower_div', type: 'string'}, // borrower's division
	            { name: 'returner', type: 'string'}, // returner's name
	            { name: 'returner_div', type: 'string'}, // returner's division
	            { name: 'receive_by', type: 'string'}, // receiver's name
	            { name: 'remarks', type: 'string'},
				{ name: 'modified_by', type: 'string'},
				{ name: 'date_created', type: 'string'}
	        ];
			break;
		case 'itemWasteGrid':
			datafields = [
				{ name: 'wid', type: 'int' }, // waste id
				{ name: 'delivery_id', type: 'int' },
				{ name: 'item_name', type: 'string'},
				{ name: 'unit', type: 'string'},
				{ name: 'waste_qty', type: 'int' }, // total waste qty
				{ name: 'remarks', type: 'string'},
				{ name: 'modified_by', type: 'string'},
				{ name: 'date_created', type: 'string'}
			];
			break;
		case 'itemAddTotalGrid':
			datafields = [
				{ name: 'id', type: 'int' },
				{ name: 'unit', type: 'string'},
				{ name: 'item_name', type: 'string'}, // item name
				{ name: 'added_qty', type: 'int' },
				{ name: 'total_qty', type: 'int'},
				{ name: 'dr_no', type: 'string'},
				{ name: 'mr_to', type: 'string'},
				{ name: 'remarks', type: 'string'},
				{ name: 'modified_by', type: 'string'},
				{ name: 'date_created', type: 'string'}
			];
			break;
		case 'itemdetailsgrid':
			datafields = [
				{ name: 'id', type: 'int' },
				{ name: 'property_no', type: 'string'},
				{ name: 'serial_no', type: 'string'},
				{ name: 'mr_to', type: 'string'},
				{ name: 'modified_by', type: 'string'}
			];
			break;
		case 'itemWasteFormGrid':
			datafields = [
				{ name: 'id', type: 'int' },
				{ name: 'property_no', type: 'string'},
				{ name: 'serial_no', type: 'string'},
				{ name: 'mr_to', type: 'string'},
				{ name: 'date_created', type: 'string'},
				{ name: 'modified_by', type: 'string'}
			];
			break;
	}

	var source =
    {
        datafields:datafields,
        datatype: "json"
    };
    if(elemid == 'itemloggrid'){
    	// source['localdata'] = localdata;
    	source['id'] = 'id';
    	source['url'] = BaseUrl()+'ajax/logistic/GetItemLogData';
    	source['type'] = 'POST';
    	source['data'] = objdata;
    }
	else if(elemid == 'itemWasteGrid'){
    	source['id'] = 'id';
    	source['url'] = BaseUrl()+'ajax/logistic/GetItemWasteData';
    	source['type'] = 'POST';
    	source['data'] = objdata;
    }
	else if(elemid == 'itemAddTotalGrid'){
    	source['id'] = 'id';
    	source['url'] = BaseUrl()+'ajax/logistic/GetItemTotalQtyData';
    	source['type'] = 'POST';
    	source['data'] = objdata;
    }
	else if(elemid == 'itemdetailsgrid'){
    	source['id'] = 'id';
    	source['url'] = BaseUrl()+'ajax/logistic/GetItemDetailsData';
    	source['type'] = 'POST';
    	source['data'] = objdata;
    }
	else if(elemid == 'itemWasteFormGrid'){
    	source['id'] = 'id';
    	source['url'] = BaseUrl()+'ajax/logistic/GetItemWasteSpecificData';
    	source['type'] = 'POST';
    	source['data'] = objdata;
    }
    var dataAdapter = new $.jqx.dataAdapter(source,{
    	loadComplete: function(records){
			//console.log(source,objdata,records);
			if(elemid == 'itemAddTotalGrid'){
				$('#itemAddTotalGrid').jqxGrid('clearselection');
			}
			else if(elemid == 'itemWasteGrid'){
				$('#itemWasteGrid').jqxGrid('clearselection');
			}
    	},
		loadError: function (xhr, status, error){ 
			// data is not loaded.
			console.log('loadError', elemid, status, error);
		} 

    });
    $('#'+elemid).jqxGrid({source:dataAdapter});
}

function GetData(type, filterData){
	type = (type == undefined) ? 'default' : 'filtered';
	filterData = (filterData == undefined) ? '' : filterData;

	var source =
    {
        datafields:
        [
            { name: 'id', type: 'int' },
            { name: 'disp_or_non', type: 'string' },
            { name: 'item_name', type: 'string'},
			{ name: 'avail_qty', type: 'int'},
            { name: 'total_qty', type: 'int'},
			{ name: 'waste_qty', type: 'int'},
			{ name: 'borrow_over_total_qty', type: 'string'},
			{ name: 'unit', type: 'string' },
			{ name: 'have_waste', type: 'string' },
			{ name: 'category', type: 'string' },
			{ name: 'remarks', type: 'string' },

            // for disposable
			{ name: 'receipt_no', type: 'string' },

			// for non disposable
			{ name: 'description', type: 'string'},
            { name: 'property_no', type: 'int' },
            { name: 'serial_no', type: 'string'},
            { name: 'mr_to', type: 'string'},
			{ name: 'modified_by', type: 'string'},
        ],
        id:'id',
        datatype: "json",
        url:BaseUrl()+'ajax/logistic/GetData',
        data:{
			type: type,
			filter_data: filterData
		},
        type:'POST'
        // filter: function () {
        //     // update the grid and send a request to the server.
        //     $("#itemgrid").jqxGrid('updatebounddata', 'filter');
        // }
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $('#itemgrid').jqxGrid({source:dataAdapter});
}
