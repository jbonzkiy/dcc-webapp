var uid = parseInt($('#nav-get-user').data('uid'));console.log(uid);
var utype = $('#nav-get-user').data('utype');console.log(utype);
var isEdit = false;
var select2Data = {};
var formAction = 'insert';
var update_id = 0;

$(function(){
	
	var htmH = $(window).innerHeight();
	var navinnerheight = $('.menu.nav').innerHeight();
	$('.ui.modal.editform').modal();

	$('#versplit').jqxSplitter({  width: '100%', height: (htmH-45)+'px',resizable:false,splitBarSize:0, panels: [{ size: 300,collapsible:true }],showSplitBar:false,theme:'metrodark' });
	$("#vhsplit").jqxSplitter({width: '100%', height: '100%',orientation:'horizontal',panels:[{ size: 30,collapsible:false }],showSplitBar:false,theme:'metrodark'});
	$("#frmPanel").jqxPanel({ width: '100%', height: '100%',theme:'metro',autoUpdate: true});

	
	// populate data in vehicle field.
    var vehicles_options = "";
    $.each(vehicle_list, function(i, value) {
        vehicles_options +=('<option value="'+ value+'">'+ value +'</option>');
    });
    $('#vehicle').append(vehicles_options);
	
	
	disableQTY();
	$("#vehicle_field").hide();
	$("#waste_qty_field").hide();

	
	$("#custom_numeric,#waste_qty").keypress(function (e) {
		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
			return false;
		}
	});

	$('#is_waste').on('change', function() {
		$(this).is(":checked") ? $('#waste_qty_field').show() : $('#waste_qty_field').hide();
	});
	
	$("#add_qty").click(function(){
		var current_qty_val = $("#custom_numeric").val();
		var add_current_qty_val = current_qty_val == '' ? 0 : current_qty_val;

		add_current_qty_val = parseInt(add_current_qty_val) + 1; // add
		
		$("#custom_numeric").val(add_current_qty_val).trigger('change'); // set value
    }); 

	$("#minus_qty").click(function(){
        var current_qty_val = $("#custom_numeric").val();
		var minus_current_qty_val = parseInt(current_qty_val) - 1;
		
		if( minus_current_qty_val > 0 ) {
			$("#custom_numeric").val(minus_current_qty_val).trigger('change');
		}
		else if ( minus_current_qty_val == 0 ) {
			$("#custom_numeric").val('').trigger('change');
		}
		else{
			notif('Cannot input less than or equal to zero','warn');
		}

    }); 

	$('#custom_numeric').on({
		'change input':function(){
			console.log('inputchange', this.value);
			var data_items = select2Data;
			console.log('date items', data_items, $(this).val());

			if ( data_items ) {

				if ( $(this).val() == 0 ) {
					$(this).val('');
				}
				// set to total sa qty if ang number input is mulapas sa bty na value
				else if( $(this).val() > parseInt(data_items.bqty) ) {
					$(this).val(data_items.bqty);
				}

				// add qty
				if ( $(this).val() > 0 && $(this).val() < parseInt(data_items.bqty) ) {
					$("#add_qty").prop('disabled', false);
				}
				else if ( $(this).val() == parseInt(data_items.bqty) ){
					$("#add_qty").prop('disabled', true);
				}

				// minus qty
				if ( $(this).val() > 0 && $(this).val() <= parseInt(data_items.bqty) ) {
					$("#minus_qty").prop('disabled', false);
				}
				else if ( $(this).val() == 0 || $(this).val() == '' ){
					$("#minus_qty").prop('disabled', true);
					$("#add_qty").prop('disabled', false);
				}

				// display update qty data
				if( $(this).val() == 0 && $(this).val() == '' ) {
					$("#current_qty").html('('+data_items.borrow_qty+')');
				}

				if( $(this).val() > 0 && $(this).val() !== null && $(this).val() !== '' ) {
					
					var cur_qty = data_items.borrow_qty == null ? '0' : data_items.borrow_qty.toString();
					var input_qty = $(this).val().toString();


					$("#current_qty").html('('+cur_qty+'  <strong>+ '+input_qty+'</strong>)');
				}
				
			}
		}
	});

	$('#waste_qty').on({
		'change input':function(){
			// get borrowed total qty
			var b_total_qty = $('#update_borrowed_qty').text();

			if ( $(this).val() == 0 ) {
				$(this).val('');
			}
			// set to total sa qty if ang number input is mulapas sa bty na value
			else if( $(this).val() > parseInt(b_total_qty) ) {
				$(this).val( (b_total_qty == '0') ? '' : b_total_qty );
			}
		}
	});

	var col = [
		//{ text: 'ID',  datafield: 'id', width: '40px',cellsalign:'center',align:'center',resizable:false },
		// { text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,pinned:true,
		// 	cellsrenderer: function (row, column, value) {
		// 		return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
		// 	}
		// },
		(utype != 'viewer') ? { text: '', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,pinned:true,
			cellsrenderer: function (row, column, value) {
				return '<div class="jqx-grid-cell-middle-align" style="margin-top:8px;"><i class="edit icon rowedit" style="cursor:pointer;" data-row="'+row+'" title="edit"></i></div>';
			}
		} : null,
		(utype != 'viewer') ? { text: '', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,pinned:true,
			cellsrenderer: function (row, column, value) {
				var disp_or_non = $("#loggrid").jqxGrid('getcellvalue', row, 'disp_or_non');
				if(disp_or_non === 'non-disposable'){
					return '<div class="jqx-grid-cell-middle-align" style="margin-top:8px;"><i class="reply icon rowreturn" style="cursor:pointer;" data-row="'+row+'" title="return"></i></div>';
				}
				return null;
			}
		} : null,
		{ text: 'Item ID',  datafield: 'item_id', width: '80px',cellsalign:'center',align:'center',resizable:false,hidden: true },
		{ text: '',  datafield: 'disp_or_non', width: '300px',align:'center', hidden:true,pinned:true },
		{ text: 'Item Name',  datafield: 'item_name', width: '300px',align:'center',pinned:true },
		{ text: 'QTY',  datafield: 'borrow_qty', width: '80px',cellsalign:'center',align:'center',pinned:true },
		{ text: 'Borrower',  datafield: 'borrower', columngroup:'borrower', width: '200px',cellsalign:'center',align:'center' },
		{ text: "Borrower Division",  datafield: 'borrower_div', columngroup:'borrower', width: '100px',cellsalign:'center',align:'center' },
		{ text: 'Datetime Borrowed',  datafield: 'dt_borrowed', columngroup:'borrower', width: '150px',cellsalign:'center',align:'center',resizable:false },
		{ text: 'Category',  datafield: 'category', width: '150px',cellsalign:'center',align:'center',resizable:false,filtertype:'checkedlist',filteritems: category_list },
		{ text: 'Vehicle',  datafield: 'vehicle', width: '100px',cellsalign:'center',align:'center',resizable:false },
		{ text: 'Returner',  datafield: 'returner', columngroup:'returner', width: '200px',cellsalign:'center',align:'center',resizable:false, hidden:true },
		{ text: "Returner Division",  datafield: 'returner_div', columngroup:'returner', width: '100px',align:'center', hidden:true },
		{ text: 'Datetime Returned',  datafield: 'dt_returner', columngroup:'returner', width: '150px',cellsalign:'center',align:'center',resizable:false, hidden:true },
		{ text: 'Received By',  datafield: 'receive_by', width: '200px',align:'center', hidden:true },
		{ text: 'Remarks',  datafield: 'remarks', width: '300px',align:'center' },
		{ text: 'Modified By',  datafield: 'modified_by', cellsalign:'center',align:'center' },
		// { datafield: 'uid', hidden:true },
		// { datafield: 'item_id', hidden:true },
		{ datafield: 'lid', hidden:true }
	];

	$('#loggrid').jqxGrid({
		width: '100%',height: '100%', theme:'metrodark',
		columns:col,
		columnsresize:true,
		enablebrowserselection:true,
		enabletooltips:true,
		showtoolbar: false,
		toolbarheight:40,
		showfilterrow: true,
		filterable: true,
		sortable:true,
		groupable: true,
		groupsexpandedbydefault: true,
		pageable: true,
		pagesize: 50,
		pagesizeoptions:['20','50','100'],
		columngroups:[
			{ text: 'BORROWER', align: 'center', name: 'borrower' },
			{ text: 'RETURNER', align: 'center', name: 'returner' },
		],
		rendertoolbar: function (statusbar) {
			// var container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");
			// var addnew = $('<button class="mini ui button border-radius-none"><i class="plus icon"></i>Add Log</button>');

			// container.append(addnew);
			// statusbar.append(container);

			// addnew.click(function(){
			// 	$('#AddnewlogWindow').jqxWindow({width:'700px',height:'680px'});
			// 	$('#AddnewlogWindow').jqxWindow('open');
			// });
		}
	});
	
	
	GetLogData();
	$('#loggrid').jqxGrid('addgroup', 'disp_or_non');
	$("#loggrid").jqxGrid('showgroupsheader', false);
	$('#loggrid').jqxGrid('expandallgroups');


	/*************************************************************************************************************/
	// item selected data
	/*************************************************************************************************************/
	customSelect2(
		// selector
		'data-items',
		// url
		BaseUrl()+'ajax/logistic/getSelectedItemData',
		// post results function data
		function (item) {
			return {
				id: item.id,
				text: item.item_name,
				lqty: item.lqty,
				bqty: item.bqty,
				unit: item.unit,
				total_qty: item.total_qty,
				category: item.category
			}
		}, 
		// placeholder
		'Search items', 
		// on select function
		function(data) {
			select2Data = data;

			// naka select na ang data, then e output na didto sa qty field
			var unit = data.unit == '' ? 'unit' : data.unit;

			// available items
			$("#current_qty_desc").html( (data.bqty == 0) ? 'out of stack' : data.bqty.toString()+' '+unit+' '+'available' );
			$('#current_qty_desc').css('color', (data.bqty == 0) ? 'red' : '#757575');

			(data.bqty == 0) ? disableQTY() : enableQTY();

			// custom_numeric
			$("#custom_numeric").val('');

			// log category
			$("#log_category").val(data.category);

			// set vehicle field depends on selected input of user in data items
			if( data.category == 'Motorpool Supplies' ) {
				$("#vehicle_field").show();
			}
			else{
				$("#vehicle_field").hide();
			}
		}, 
		// on clear function
		function () {
			resetForm();
		}
	);

	
	/*************************************************************************************************************/
	// borrower
	/*************************************************************************************************************/
	customSelect2(
		// selector
		'borrower',
		// url
		BaseUrl()+'ajax/logistic/getPersonnelData',
		// post results function data
		function (item) {
			return {
				id: item.id,
				division: item.division,
				text: item.full_name,
				first_name: item.first_name,
				middle_name: item.middle_name,
				last_name: item.last_name,
				suffix_name: item.suffix_name
			}
		}, 
		// placeholder
		'CDRRMD personnel', 
		// on select function 
		function(data) {
			$("#borrowers_division").val(data.division.toUpperCase());
		}, 
		// on clear function
		function () {
			$("#borrowers_division").val('');
		}
	);

	// Reset Form
    $('#clear').click(function(){
        resetForm();
    });

	$('#save').click(function(){
		saveForm();
	});

	// $('#loggrid').on('rowdoubleclick', function(event){ 
	//     var args = event.args;
	//     // row's bound index.
	//     var boundIndex = args.rowindex;
	//     var data = $('#loggrid').jqxGrid('getrowdata', boundIndex);
	//     console.log(data)
	//     $('.ui.modal.editform').modal('show');
	// });

	/*************************************************************************************************************/
	// update returner
	/*************************************************************************************************************/
	customSelect2(
		// selector
		'update_returner',
		// url
		BaseUrl()+'ajax/logistic/getPersonnelData',
		// post results function data
		function (item) {
			return {
				id: item.id,
				division: item.division,
				text: item.full_name,
				first_name: item.first_name,
				middle_name: item.middle_name,
				last_name: item.last_name,
				suffix_name: item.suffix_name
			}
		}, 
		// placeholder
		'CDRRMD personnel', 
		// on select function 
		function(data) {
			$("#update_returner_div").val(data.division.toUpperCase());
		}, 
		// on clear function
		function () {
			$("#update_returner_div").val('');
		}
	);


	// set data to update/edit
	$('body').on('click','.rowedit',function(){
		updateForm($(this));
	});

	// returned item
	$('body').on('click','.rowreturn',function(){
		var rowboundindex = $(this).data('row');
		var data = $('#loggrid').jqxGrid('getrowdata', rowboundindex);
		console.log(data);

		$('#update_disp_or_non').text(data.disp_or_non.toUpperCase());
		$('#update_item_name').text(data.item_name);

		$('#update_borrower').text(data.borrower);
		$('#update_borrower_div').text(data.borrower_div);

		$('#update_borrowed_qty').text(data.borrow_qty.toString());
		$('#update_log_category').text(data.category);
		
		$('#update_dt_borrowed').text(moment(data.dt_borrowed).format('YYYY/MM/DD hh:mm A'));
		$('#update_vehicle').text(data.vehicle);

		// waste item
		( data.disp_or_non === 'non-disposable' ) ? $('#waste_item_fieldset').show() : $('#waste_item_fieldset').hide();
		$('#is_waste').prop('checked', false).change();
		$('#waste_qty').val('');

		// returner
		$('#update_dt_returned').val(moment().format('YYYY-MM-DDTHH:mm'));
		$('#update_returner').val(null).trigger('change');
		$('#update_returner_div').val('');
		$('#update_received_by').val('');
		$('#update_remarks').val(data.remarks);

		$('#save_return_item').attr('data-log-id',data.lid);
		$('#save_return_item').attr('data-item-id',data.item_id);

		//remove all error span
		$('.errmsg').remove();
		$('div.field.error').removeClass('error');

		$('.ui.modal.editform').modal({closable: false}).modal('show');
	});

	$('#save_return_item').click(function(){
		saveReturnItem($(this));
	});

	//set admin access restrictions
	if(utype == 'viewer'){
		$("#versplit").jqxSplitter('collapse');
	}
	$('#firstloading').hide();
});


function saveReturnItem(doc){
	if(uid === undefined){
		alert('Session expired. Please re-login. Thank you!');
		location.reload();
		return false;
	}

	// get fields value
	var item_id = doc.attr('data-item-id'),
	log_id = doc.attr('data-log-id'),

	update_dt_returned = moment($('#update_dt_returned').val()).format('YYYY-MM-DD HH:mm:ss'),
	update_returner_id = $('#update_returner').val(),

	update_received_by = $('#update_received_by').val(),
	update_remarks = $('#update_remarks').val(),
	is_waste = $('#is_waste').is(":checked"),
	waste_qty = $('#waste_qty').val();
	// get fields value

	//remove all error span
	$('.errmsg').remove();
	$('div.field.error').removeClass('error');

	// validate form input fields
	var errArr = [];

	if($.trim(update_dt_returned) == '' || $.trim(update_dt_returned) == 'Invalid date'){errArr.push({elem:'update_dt_returned',msg:'Empty'});}
	if($.trim(update_returner_id) == ''){errArr.push({elem:'update_returner',msg:'Empty'});}
	if($.trim(update_received_by) == ''){errArr.push({elem:'update_received_by',msg:'Empty'});}
	if($.trim(update_remarks) == ''){errArr.push({elem:'update_remarks',msg:'Empty'});}
	if(is_waste && $.trim(waste_qty) == ''){errArr.push({elem:'waste_qty',msg:'Empty'});}


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
			message: 'Confirm Return log item.',
			callback: function(r){
				if(r){
					$('#update-form').addClass('loading');
					var data = {
						type: 'log',
						subtype: 'update_return',
						uid: uid,
						item_id: item_id,
						log_id: log_id,

						update_dt_returned: update_dt_returned,
						update_returner_id: update_returner_id,
						update_received_by: update_received_by,
						update_remarks: update_remarks,

						is_waste: is_waste,
						waste_qty: waste_qty
					};
					$.ajax({
						url:BaseUrl()+'ajax/logistic/parseData',
						async:true,
						data:data,
						method:'POST',
						success:function(data){console.log($.trim(data))
							if($.trim(data) == 'OK'){
								$('.ui.modal.editform').modal('hide');
								notif('Updated!');
								
								$('#loggrid').jqxGrid('updatebounddata', 'data');
							}else{
								alert('Saving failed. Please report the problem to the webadmin.');
							}
							// console.log(data)
							$('#update-form').removeClass('loading');
						},
						error:function(jqXHR,textStatus,errorThrown ){
							console.log(errorThrown);
							$('#update-form').removeClass('loading');
							alert('Unable to fetch items from the database.');
						}
					});
				}
			}
		});
	}
}

function saveForm(){
	if(uid === undefined){
		alert('Session expired. Please re-login. Thank you!');
		location.reload();
		return false;
	}

	// get fields value
	var item_id = $('#data-items').val(),
	qty = $("#custom_numeric").val(),
	borrower_id = $('#borrower').val(),
	log_category = $('#log_category').val(),
	vehicle = $('#vehicle').val(),
	dt = moment($('#dtb').val()).format('YYYY-MM-DD HH:mm:ss'),
	remarks = $('#remarks').val();

	

	//remove all error span
	$('.errmsg').remove();
	$('div.field.error').removeClass('error');

	// validate form input fields
	var errArr = [];

	if($.trim(item_id) == ''){errArr.push({elem:'data-items',msg:'Empty'});}
	if(formAction == 'insert' && $.trim(qty) == ''){errArr.push({elem:'qty_fields',msg:'Empty'});}
	if($.trim(borrower_id) == ''){errArr.push({elem:'borrower',msg:'Empty'});}
	if($.trim(dt) == '' || $.trim(dt) == 'Invalid date'){errArr.push({elem:'dtb',msg:'Empty'});}
	if($.trim(log_category) == 'Motorpool Supplies' && $.trim(vehicle) == ''){errArr.push({elem:'vehicle',msg:'Empty'});}


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
			message: 'Confirm Update log item.',
			callback: function(r){
				if(r){
					$('#create-form').addClass('loading');
					var data = {
						type: 'log',
						subtype: formAction,
						update_id: update_id,
						uid: uid,

						item_id: item_id,
						qty: qty,
						vehicle: vehicle,
						borrower_id: borrower_id,
						dt: dt,
						remarks: remarks
					};
					$.ajax({
						url:BaseUrl()+'ajax/logistic/parseData',
						async:true,
						data:data,
						method:'POST',
						success:function(data){console.log($.trim(data))
							if($.trim(data) == 'OK'){
								notif('Saved!');

								$('#loggrid').jqxGrid('updatebounddata','data');
							}else{
								alert('Saving failed. Please report the problem to the webadmin.');
							}

							// console.log(data)
							resetForm();
							$('#create-form').removeClass('loading');
						},
						error:function(jqXHR,textStatus,errorThrown ){
							console.log(errorThrown);
							$('#create-form').removeClass('loading');
							alert('Unable to fetch items from the database.');
						}
					});
				}
			}
		});
	}
}

function updateForm(doc){
	isEdit = true;
	formAction = 'update';
	$("#save").html("Update");
	
	// console.log(doc);
	var row = doc.data('row');
	var rdata = $('#loggrid').jqxGrid('getrowdata', row);
	// console.log(row, rdata);
	
	// clear cache on select2
	$("#data-items").html(null);
	$("#borrower").html(null);
	
	$("#current_qty").html('');
	update_id = rdata.lid;

	// setting value in fields
	$('#dtb').val(moment(rdata.dt_borrowed).format('YYYY-MM-DDTHH:mm'));

	// set item
	var item_select = $("#data-items");
	var item_select2_data = {
		id: rdata.item_id,
		category: rdata.category,
		selected: false,
		text: rdata.item_name,
		unit: rdata.unit,
		bqty: rdata.bqty,
		total_qty: rdata.total_qty,
		borrow_qty: rdata.borrow_qty
	}
	// create the option and append to Select2
	var option = new Option(item_select2_data.text, item_select2_data.id, true, true);
	item_select.append(option).trigger('change');
	
	// manually trigger the `select2:select` event
	item_select.trigger({
		type: 'select2:select',
		params: {
			data: item_select2_data
		}
	});
	
	select2Data = item_select2_data;
	// set item


	// qty
	$("#minus_qty").prop('disabled', true);
	$("#current_qty").show();
	$("#current_qty").html('('+rdata.borrow_qty+')');


	// set borrower
	var borrower_select = $("#borrower");
	var borrower_select2_data = {
		id: rdata.borrower_id,
		selected: false,
		text: rdata.borrower,
		division: rdata.borrower_div
	}
	// create the option and append to Select2
	var option = new Option(borrower_select2_data.text, borrower_select2_data.id, true, true);
	borrower_select.append(option).trigger('change');
	
	// manually trigger the `select2:select` event
	borrower_select.trigger({
		type: 'select2:select',
		params: {
			data: borrower_select2_data
		}
	});
	// set borrower

	// vehicle motorpool
	var v_category = (rdata.category != null && rdata.category != '') ? rdata.category.toLowerCase() : '';
	if ( v_category == 'motorpool supplies' ) {
		$('#vehicle').val(rdata.vehicle).change();
	}
	else{
		$('#vehicle').val('').change();
	}

	// remarks
	$('#remarks').val(rdata.remarks);
}

function disableQTY(){
	$("#minus_qty").prop('disabled', true);
	$("#custom_numeric").prop('disabled', true);
	$("#add_qty").prop('disabled', true);

	$("#current_qty").hide();
}

function enableQTY(){
	$("#custom_numeric").prop('disabled', false);
	$("#add_qty").prop('disabled', false);
}

function resetForm(){
	isEdit = false;
	select2Data = {};

	formAction = 'insert';
	update_id = 0;
	$("#save").html("Save");

	//remove all error span
	$('.errmsg').remove();
	$('div.field.error').removeClass('error');

	$("#data-items").val(null).trigger('change');
	$("#log_category").val('');
	$("#custom_numeric").val('');
	$("#current_qty").html('');
	$("#current_qty_desc").html('');
	disableQTY();

	$("#borrower").val(null).trigger('change');
	$("#borrowers_division").val('');
	$("#vehicle").val('');
	$("#vehicle_field").hide();

	$("#dtb").val(moment().format('YYYY-MM-DDTHH:mm'));
	$("#remarks").val('');
}

function GetLogData(){
	//lid, item_id, a.qty AS bqty, b.qty dqty, dtb, dtr, bby, bdiv, rby, rdiv, recby, remarks, uid, item_name, description
	var source =
    {
        datafields:
        [
            { name: 'lid', type: 'int' },
			{ name: 'disp_or_non', type: 'string'},
            { name: 'item_id', type: 'int' },
            { name: 'item_name', type: 'string'},
            // { name: 'description', type: 'string'},
            { name: 'borrow_qty', type: 'int' }, //total borrowed qty
			{ name: 'bqty', type: 'int' }, //total available qty
            { name: 'total_qty', type: 'int'}, //total default qty
			{ name: 'category', type: 'string'},
			{ name: 'vehicle', type: 'string'},
			{ name: 'unit', type: 'string'},

            { name: 'borrower_id', type: 'int'},
			{ name: 'borrower', type: 'string'}, //name of borrower
            { name: 'borrower_div', type: 'string'}, //borrower's division
            { name: 'dt_borrowed', type: 'string'}, //datetime borrowed
			
            { name: 'returner', type: 'string'}, //returner's name
            { name: 'returner_div', type: 'string'}, //returner's division
            { name: 'dt_returner', type: 'string'}, //datetime returned
			
            { name: 'receive_by', type: 'string'}, //receiver's name
            { name: 'remarks', type: 'string'},
			{ name: 'modified_by', type: 'string'},
        ],
        id:'id',
        datatype: "json",
        url:BaseUrl()+'ajax/logistic/GetLogData',
        // data:{fdt:fdt,tdt:tdt,type:type},
        type:'POST'
        // filter: function () {
        //     // update the grid and send a request to the server.
        //     $("#itemgrid").jqxGrid('updatebounddata', 'filter');
        // }
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $('#loggrid').jqxGrid({source:dataAdapter});
}