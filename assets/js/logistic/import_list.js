var uid = parseInt($('#nav-get-user').data('uid'));console.log(uid);
var utype = $('#nav-get-user').data('utype');console.log(utype);

$(function(){
    // $('#importExcelWindow').jqxWindow({height:'680px',width:'700px',isModal: true,autoOpen:false,animationType:'none',resizable:false,theme:'metro'}); 
    $('#jqxtabs').jqxTabs({ width: '100%', height: '100%', theme: 'metrodark' });

    /*************************************************************************************************************/
	// Disposable Grid
	/*************************************************************************************************************/
    var diposableCol = [
		{ text: '#', width: '40px', cellsalign:'center', align:'center', resizable:false, filterable:false, editable: false,
            cellsrenderer: function (row, column, value) {
                return "<div class='jqx-grid-cell-middle-align custom-red' style='margin-top:8px;'>" + (row + 1) + "</div>";
            }
        },
        { text: 'Action', datafield:'action', width: '70px', cellsalign:'center', align:'center', editable: false, resizable:false, filterable:true, filtertype:'checkedlist', filteritems: ['insert', 'update'] },
        { text: 'Item Name', datafield:'item_name', cellsalign:'center', align:'center' },
        { text: 'Qty', datafield:'qty', cellsalign:'center', align:'center', width: '60px',
            cellbeginedit: function(row, columnfield, e, value) {
                var action = $('#disposableGrid').jqxGrid('getcellvalue', row, "action");

                // prevent default behavior
                return (action == 'new') ? true : false;
            }
        },
        { text: 'Unit', datafield:'unit', cellsalign:'center', align:'center', width: '80px' },
        { text: 'Category', datafield:'category', cellsalign:'center', align:'center', filtertype:'checkedlist', filteritems: category_list,
            cellsrenderer: function (row, column, value) {
                var rdata = $('#disposableGrid').jqxGrid('getrowdata', row);
                if ( rdata.error.length !== 0 && _.some(rdata.error, {column:'category'}) ){
                    var obj = _.find(rdata.error, {column:'category'});
                    return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'><i style='cursor:pointer;' class='exclamation circle icon red custom-grid-error' data-row="+row+" data-remark='"+obj.remark+"'></i>" + value + "</div>";
                }
                return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + value + "</div>";
            }
        },
        { text: 'Delivery Receipt No.', datafield:'receipt_no', cellsalign:'center', align:'center', width: '150px' },
        { text: 'Remarks', datafield:'remarks', cellsalign:'center', align:'center' }
	];

	$('#disposableGrid').jqxGrid({
		width: '100%',height: '500px', theme:'metrodark',
		columns: diposableCol,
		columnsresize:true,
		enablebrowserselection:true,
		enabletooltips:true,
        groupable: false,
        filterable: true,
        showfilterrow: true,
        editable: true,
		editmode:'dblclick',
		pageable: true,
		pagesize: 50,
		pagesizeoptions:['20','50','100']
	});

    /*************************************************************************************************************/
	// Non Disposable Grid
	/*************************************************************************************************************/
    var nonDisposableCol = [
		{ text: '#', width: '40px', cellsalign:'center', align:'center', resizable:false, filterable:false, editable: false,
            cellsrenderer: function (row, column, value) {
                return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
            }
        },
        // { text: '', width: '70px',cellsalign:'center',align:'center',resizable:false,filterable:false,editable:false,sortable:false,menu:false,
		// 	cellsrenderer: function (row, column, value) {
        //         var qty = $('#nonDisposableGrid').jqxGrid('getcellvalue', row, "qty");
		// 		return '<div class="jqx-grid-cell-middle-align" style="margin-top:8px;" data-row="'+row+'"><i class="list ul icon importitemdetails" style="cursor:pointer;" title="Item Details"></i> ('+ qty.toString() +') </div>';
		// 	}
		// },
        { text: 'Action', datafield:'action', width: '70px', cellsalign:'center', align:'center', editable: false, resizable:false, filterable:true, filtertype:'checkedlist', filteritems: ['insert', 'update'] },
        { text: 'Item Name', datafield:'item_name', cellsalign:'center', align:'center', width: '150px' },
        { text: 'Qty', datafield:'qty', cellsalign:'center', align:'center', width: '60px',
            cellbeginedit: function(row, columnfield, e, value) {
                var action = $('#nonDisposableGrid').jqxGrid('getcellvalue', row, "action");

                // prevent default behavior
                return (action == 'new') ? true : false;
            }
        },
        { text: 'Unit', datafield:'unit', cellsalign:'center', align:'center', width: '60px' },
        { text: 'Description', datafield:'description', cellsalign:'center', align:'center' },
        { text: 'Category', datafield:'category', cellsalign:'center', align:'center', filtertype:'checkedlist', filteritems: category_list,
            cellsrenderer: function (row, column, value) {
                var rdata = $('#nonDisposableGrid').jqxGrid('getrowdata', row);
                if ( rdata.error.length !== 0 && _.some(rdata.error, {column:'category'}) ){
                    var obj = _.find(rdata.error, {column:'category'});
                    return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'><i style='cursor:pointer;' class='exclamation circle icon red custom-grid-error' data-row="+row+" data-remark='"+obj.remark+"'></i>" + value + "</div>";
                }
                return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + value + "</div>";
            }
        },
        // { text: 'Property No.', datafield:'property_no', cellsalign:'center', align:'center', width: '100px' },
        // { text: 'Serial No.', datafield:'serial_no', cellsalign:'center', align:'center', width: '100px' },
        { text: 'MR To', datafield:'mr_to', cellsalign:'center', align:'center', width: '150px',
            cellsrenderer: function (row, column, value) {
                var rdata = $('#nonDisposableGrid').jqxGrid('getrowdata', row);
                if ( rdata.error.length !== 0 && _.some(rdata.error, {column:'mr_to'}) ){
                    var obj = _.find(rdata.error, {column:'mr_to'});
                    return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'><i style='cursor:pointer;' class='exclamation circle icon red custom-grid-error' data-row="+row+" data-remark='"+obj.remark+"'></i>" + value + "</div>";
                }
                return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + value + "</div>";
            }
        },
        { text: 'Remarks', datafield:'remarks', cellsalign:'center', align:'center' }
	];

	$('#nonDisposableGrid').jqxGrid({
		width: '100%',height: '500px', theme:'metrodark',
		columns: nonDisposableCol,
		columnsresize:true,
		enablebrowserselection:true,
		enabletooltips:true,
        groupable: false,
        filterable: true,
        showfilterrow: true,
        editable: true,
		editmode:'dblclick',
		pageable: true,
		pagesize: 50,
		pagesizeoptions:['20','50','100']
	});

    
    /*************************************************************************************************************/
	// Get Data
	/*************************************************************************************************************/
    // GetData('disposableGrid', []);
    // GetData('nonDisposableGrid', []);


    $('#disposableGrid').on('cellendedit',function(event){
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

	    if(value !== oldvalue && value !== ''){
	    	updateGrid('disposableGrid');
	    }
	});

    $('#nonDisposableGrid').on('cellendedit',function(event){
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

	    if(value !== oldvalue && value !== ''){
	    	updateGrid('nonDisposableGrid');
	    }
	});


    /*************************************************************************************************************/
	// Upload Excel File
	/*************************************************************************************************************/
    $('#jqxFileUpload').jqxFileUpload({
        theme: 'summer',
        browseTemplate: 'success',
        uploadTemplate: 'primary',
        cancelTemplate: 'warning',
        width: 300,
        uploadUrl: BaseUrl()+'ajax/logistic/importExcel',
        fileInputName: 'importexcel',
        multipleFilesUpload: false,
        localization: { 
            uploadButton: 'Get Data', 
            cancelButton: 'Cancel', 
        },
        accept: '.xlsx,.xls,.csv'
    });

    $('#jqxFileUpload').on('uploadEnd', function (event) {
        console.log(event);
	    var args = event.args;
	    var fileName = args.file;
	    var serverResponse = args.response;
        // console.log(fileName,serverResponse);

	    // var cntins = obj.insert_data.length, cntdup = obj.dup_data.length;
	    // $('#existTabHead').text((cntdup == 0?'':'('+cntdup+')'));
	    // $('#addTabHead').text((cntins == 0?'':'('+cntins+')'));
	    // getGridData('existGrid',obj);
	    // getGridData('addedGrid',obj);
	    // $('#itemgrid').jqxGrid('updatebounddata');
        try {
            var obj = JSON.parse(serverResponse);
            // console.log(obj.disposable, obj.non_disposable);
            GetData('disposableGrid', obj.disposable);
            GetData('nonDisposableGrid', obj.non_disposable);

            $('#importFileName').text(fileName);
        }
        catch(err) {
            console.log('errororor', err);
            alert('error updating data in grid');
        }
        
	});

    $('#importNowBtn').click(function(){
		if(uid === undefined){
			alert('Session expired. Please re-login. Thank you!');
			location.reload();
			return false;
		}

        var fileName = $('#importFileName').text();
        importFile(fileName);
    });

    $('#disposableGrid').on('click','.custom-grid-error',function(){
        var doc = $(this);
        var remark = doc.data('remark');

        $.notify(
            remark,
            { 
                className: "error",
                position: "top center",
                autoHideDelay: 8000
            }
        );
    });
    
    $('#nonDisposableGrid').on('click','.custom-grid-error',function(){
        console.log('category err', this);
        var doc = $(this);

        var remark = doc.data('remark');
        var row = doc.data('row');
        var rdata = $('#nonDisposableGrid').jqxGrid('getrowdata', row);
        console.log('get row data', remark, rdata);

        $.notify(
            remark,
            { 
                className: "error",
                position: "top center",
                autoHideDelay: 8000
            }
        );
    });

    $('#dlTemplateBtn').click(function(e){
        e.preventDefault();  //stop the browser from following
        window.location.href = BaseUrl()+'assets/template/import_sample.xlsx';
    });


    //set admin access restrictions
	if(utype == 'viewer'){
        $("#jqxFileUploadBrowseButton").prop('disabled', true);
		$("#importNowBtn").prop('disabled', true);
	}

    $('#firstloading').hide();
});


function updateGrid(elemID){
    notif('Updating...','warn');

    setTimeout(() => {

        var gridData = $('#'+elemID).jqxGrid('getrows');
        var keyData = (elemID == 'disposableGrid') ? 'disposable' : 'non_disposable';

        var jsondata = {
            [keyData]: gridData
        };
        console.log('jsondata asdasdasd', jsondata);

        $.ajax({
            url: BaseUrl()+'ajax/logistic/updateImportExcel',
            async: true,
            dataType: "json",
            data: JSON.stringify(jsondata),
            contentType : 'application/json',
            method: 'POST',
            success: function(res){
                // console.log('objData', res);

                if(res.success){
                	notif('Saved!');

                    GetData(elemID, res[keyData]);
                    // $('#'+elemID).jqxGrid('updatebounddata', 'cells');
                    // $('#nonDisposableGrid').jqxGrid('updatebounddata', 'cells');
                }else{
                	alert('Saving failed. Please report the problem to the webadmin.');
                }
            },
            error:function(jqXHR,textStatus,errorThrown ){
                console.log(errorThrown);
                alert('Unable to fetch items from the database.');
            }
        });

    }, 200);
}


function importFile(fileName) {
    if ( fileName == '' ) {
        notif('Import File Name is empty','error');
        return false;
    }

    $('#import-form').addClass('loading');

    var disposableData = $('#disposableGrid').jqxGrid('getrows');
    var nonDisposableData = $('#nonDisposableGrid').jqxGrid('getrows');
    // console.log('disposableData', disposableData);
    // console.log('nonDisposableData', nonDisposableData);

    var insert_disposable = _.filter(disposableData, ['is_unique', true]); // will insert
    var update_disposable = _.filter(disposableData, ['is_unique', false]); // will update

    var insert_non_disposable = _.filter(nonDisposableData, ['is_unique', true]); // will insert
    var update_non_disposable = _.filter(nonDisposableData, ['is_unique', false]); // will update
    
    var data = {
        type: 'import',
        subtype: 'insert_update',
        uid: uid,

        disposable: {
            insert: insert_disposable,
            update: update_disposable
        },
        non_disposable: {
            insert: insert_non_disposable,
            update: update_non_disposable
        }
    };
    console.log(data);

    $.ajax({
        url: BaseUrl()+'ajax/logistic/parseData',
        async: true,
        data: data,
        method: 'POST',
        success: function(data){
            console.log($.trim(data));

            if($.trim(data) == 'OK'){
                alertify.alert("Success", "The "+fileName+" is successfully saved.");
            }else{
                alert('Saving failed. Please report the problem to the webadmin.');
            }
            
            // reset import file form
            $('#importFileName').text('');
            $('#disposableGrid').jqxGrid('clear');
		    $('#nonDisposableGrid').jqxGrid('clear');
            
            $('#import-form').removeClass('loading');
        },
        error:function(jqXHR,textStatus,errorThrown ){
            console.log(errorThrown);
            $('#import-form').removeClass('loading');
        }
    });

}


function GetData(elemId, data){
    var _dataFields;

    switch(elemId){
		case 'disposableGrid':
			_dataFields = [
                { name: 'item_name', type: 'string'},
                { name: 'qty', type: 'int'},
                { name: 'unit', type: 'string' },
                { name: 'category', type: 'string' },
                { name: 'receipt_no', type: 'string' },
                { name: 'remarks', type: 'string'},

                { name: 'is_unique', type: 'boolean'},
                { name: 'action', type: 'string'},
                { name: 'error', type: 'array' }
			];
			break;
		case 'nonDisposableGrid':
			_dataFields = [
                { name: 'item_name', type: 'string'},
                { name: 'qty', type: 'int'},
                { name: 'unit', type: 'string' },
                { name: 'description', type: 'string'},
                { name: 'category', type: 'string' },
                { name: 'property_no', type: 'int' },
                { name: 'serial_no', type: 'string'},
                { name: 'mr_to', type: 'string'},
                { name: 'remarks', type: 'string'},

                { name: 'is_unique', type: 'boolean'},
                { name: 'action', type: 'string'},
                { name: 'error', type: 'array' }
			];
			break;
	}

	var source = {
        datatype: "json",
        datafields: _dataFields,
        localdata: data
    };
    var dataAdapter = new $.jqx.dataAdapter(source,{
    	loadComplete: function(records){
            // console.log(source,records);
    	}
    });
    $('#'+elemId).jqxGrid({
        source:dataAdapter,
        // ready: function(){
        //     if ( elemId == 'nonDisposableGrid' ){
        //     }
        // },
    });
}
