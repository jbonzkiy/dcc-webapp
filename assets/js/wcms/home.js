var EIDATA = [], GDATAFIELDS = [], EIDATAALL = [];
$(function(){
	$('body').tooltip({
		selector:'[data-tooltip="true"]'
	});
	console.log('Ready!');
	/**
	 * Load Event/Incident data on page load.
	 */
	GetEventIncident(true);

	/**
	 * Add new table field
	 */
	$('#AddNewField').click(function(){
		$('#fieldContainer').append(TableFieldTemplate());
	});
	/**
	 * Remove table field
	 */
	$('body').on('click','.fremove',function(){
		$(this).parent().remove();
	});
	/**
	 * If field type is select, checkbox or radio then display input for the options
	 */
	$('body').on('change','.ftype',function(){
		if($.inArray($(this).val(),['select','checkbox','radio']) !== -1){
			$('.fopt',$(this).parent()).show();
		}else{
			$('.fopt',$(this).parent()).hide();
		}
	});
	/**
	 * Open Event/incident form
	 */
	$('#addNewEI').click(function(){
		$('#addNewEIForm').show();
		resetForm();
	});
	/**
	 * Close Event/incident form and reset form
	 */
	$('#addNewEIFormClose').click(function(){
		$('#addNewEIForm').hide();
		resetForm();
	});
	/**
	 * Save Event/incedent
	 */
	$('#saveei').click(function(){
		$('#errmsg').text('').hide();
		var eid = $(this).attr('data-eid')
		title = $('#einame').val(),
		descipt = $('#eides').val(),
		fields = [];

		$('.tablefield').each(function(i,e){
			if($.trim($('.fname',this).val()) !== ''){
				var fname = $('.fname',this).val(),
				type = $('.ftype',this).val(),
				opt = $('.fopt',this).val();
				fields.push({num:i,fname:fname,ftype:type,fopt:opt});
			}
		});
		//validate
		var errmsg = [];
		if(title == ''){
			errmsg.push('-Please add Event/Incident name.');
		}
		if(fields.length == 0){
			errmsg.push('-Please add table fields.');
		}

		if(errmsg.length > 0){
			$('#errmsg').html(errmsg.join("<br>")).show();
		}else{
			var obj = {title:title,des:descipt,fields:fields,eid:eid};
			var r = confirm('Confirm saving of Event/Incident.');
			if(r){
				$.post(BaseUrl()+'ajax/wcms/SaveEventIncident',obj,function(data){
					if($.trim(data) == 'SUCCESS'){
						resetForm();
						GetEventIncident();
						alert('Success!!!');
					}else{
						alert("Something went wrong while trying to save the data./nSaving process has been cancelled/nNo changes has been made to the database.");
					}
				});
			}
		}

	});
	/**
	 * event for displaying data for this event/incident
	 */
	$('#eventlst').on('click','.eventdata',function(){
		$('.eventdata').removeClass('bg-dark text-white');
		$(this).addClass('bg-dark text-white');

		var eid = $(this).data('eid');
		var alldata = _.find(EIDATA,['eid',eid.toString()]);
		$('#etitle').text(alldata.title);
		$('#edes').text('('+alldata.description+')');
		$('#actionGrid,#savedata').attr('data-eid',eid);
		$('#grid').jqxGrid('clear');
		$('#grid').jqxGrid('showloadelement');
		EIDATAALL = alldata
		GridColumns();
	});
	/**
	 * edit delete event/incident action button event
	 */
	$('#eventlst').on('click','.action-btn div i',function(){
		resetForm();
		var action = $(this).data('action');
		var eid = $(this).parent().parent().parent().data('eid');
		if(action == 'edit'){
			var alldata = _.find(EIDATA,['eid',eid.toString()]);
			var fields = JSON.parse(alldata.fields);
			$.each(fields,function(i,e){
				if(i == 0){
					$('#fieldContainer .fname').val(e.fname);
					$('#fieldContainer .ftype').val(e.ftype);
					$('#fieldContainer .fopt').val(e.fopt);
				}else{
					$('#fieldContainer').append(TableFieldTemplate(e));
				}
			});
			$('#addNewEIForm').show();
			$('#einame').val(alldata.title);
			$('#eides').val(alldata.description);
			$('#saveei').attr('data-eid',eid);

		}else{//delete
			var r = confirm('Confirm delete action');
			if(r){
				$.post(BaseUrl()+'ajax/wcms/DeleteEventIncident',{eid:eid},function(data){
					if($.trim(data) == 'SUCCESS'){
						$('#addNewEIForm').hide();
						resetForm();
						GetEventIncident();
						alert('Success!!!');
					}else{
						alert("Something went wrong while trying to delete the data./nDelete process has been cancelled/nNo changes has been made to the database.");
					}
				});
			}
		}
	});
	/**
	 * Action button for event/incident data
	 * Actions (add, edit, delete)
	 */
	$('#actionGrid i').click(function(){
		var type = $(this).data('action');
		var eid = $(this).parent().attr('data-eid');
		switch(type){
			case 'add':
				ShowAddEditModal(eid);
				break;
			case 'delete':

				break;
		}
	});
	/**
	 * Save/edit Event/incident data
	 */
	$('#savedata').click(function(){
		var d = [],
		eid = $(this).attr('data-eid');
		did = $(this).attr('data-did');
		$('#fieldsContainer .form-group').each(function(i,e){
			var num = $(this).attr('data-num'),
			type = $(this).attr('data-type');
			var val = GetFieldValue(this,type);
			console.log(num,type,val)
			//{num:num, value:value}
			d.push({num:num,value:val});
		});
		var r = confirm('Confirm saving of data.');
		if(r){
			$.post(BaseUrl()+'ajax/wcms/SaveEIData',{eid:eid,data:d,did:did},function(data){
				if($.trim(data) == 'SUCCESS'){
					$('#addeditform').modal('hide');
					$('#fieldsContainer').empty();
					GetEIData(eid);
					// GetEventIncident();
					alert('Success!!!');
				}else{
					alert("Something went wrong while trying to save the data./nDelete process has been cancelled/nNo changes has been made to the database.");
				}
			});
		}
	});

	$('body').on('click','.eidata-btn',function(){
		var action = $(this).data('action'),
		row = $(this).data('row'),
		rowdata = $('#grid').jqxGrid('getrowdata', row);
		
		switch(action){
			case 'edit':
				var eid = $('#actionGrid').attr('data-eid');
				var fields = [];
				$.each(rowdata,function(i,e){
					if($.inArray(i,['boundindex','did','uid','uniqueid','visibleindex']) === -1){
						fields.push({fname:i,value:e});
					}
				});
				ShowAddEditModal({eid:eid,did:rowdata.did,fields:fields,rowdata:rowdata});
				break;
			case 'delete':
				var r = confirm('Confirm deletion of data.');
				if(r){
					$.post(BaseUrl()+'ajax/wcms/DeleteEIData',{did:rowdata.did},function(data){
						if($.trim(data) == 'SUCCESS'){
							GridColumns();
							// GetEventIncident();
							alert('Success!!!');
						}else{
							alert("Something went wrong while trying to delete the data./nDelete process has been cancelled/nNo changes has been made to the database.");
						}
					});
				}
				break;
		}
	});
	/*****************************************************************************************/
	//Codes for JQWidgets
	/*****************************************************************************************/
	var gridopt = {
		width:'99.8%',height:'94.5%',theme:'metrodark',altrows: true, columnsresize: true,
		selectionmode:'multiplerowsextended',filterable:true,showfilterrow:true
	};
	$('#grid').jqxGrid(gridopt);
});
/**
 * populate the grid column.
 */
function GridColumns(){
	var data = EIDATAALL;
	var fields = JSON.parse(data.fields);console.log(data)
	var cols = [],datafields = [];
	var rowCol = {text:'#',pinned:true,align:'center',sortable:false,filterable:false,resizable:false,datafield:'rowcol',columntype:'number',width:35,
				cellsrenderer:function(row,column,value){
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">' + (value + 1) + '</div>';
				}};
	var rowCtrl = {text:'',pinned:true,align:'center',sortable:false,filterable:false,resizable:false,datafield:'rowctrl',columntype:'number',width:70,
				cellsrenderer:function(row,column,value){
					var html = '<i class="mdi mdi-square-edit-outline mr-2 cursor-pointer eidata-btn" data-tooltip="true" title="Edit" data-row="'+row+'" data-action="edit"></i>'+
					'<i class="mdi mdi-trash-can-outline cursor-pointer eidata-btn" data-tooltip="true" title="Delete" data-row="'+row+'" data-action="delete"></i>';
					return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">' + html + '</div>';
				}};
	var rowID = {text:'',datafield:'did',hidden:true};
	cols.push(rowCol);
	cols.push(rowCtrl);
	cols.push(rowID);
	datafields.push({name:'did',type:'number'});
	$.each(fields,function(i,e){
		cols.push({ text: e.fname.toUpperCase(), align:'center',classname:'grid-header', datafield: e.fname.replace(/\s/g, "") });
		datafields.push({name:fields[i].fname.replace(/\s/g, ""),type:'string'});
	});
	$('#grid').jqxGrid({columns:cols});
	GDATAFIELDS = datafields;
	GetEIData(data.eid);
}

function GetEIData(eid){
	console.log(eid)
	$.post(BaseUrl()+'ajax/wcms/GetEIData',{eid:eid},function(data){
		if(IsJsonString(data)){
			var obj = JSON.parse(data),
			ndata = [];

			$.each(obj,function(i,e){
				var dta = JSON.parse(e.data);
				var tempfields = {did:Number(e.did)};
				$.each(dta,function(i1,e1){
					var v = (Array.isArray(e1.value))?e1.value.join(', '):e1.value;
					tempfields[GDATAFIELDS[(i1 + 1)].name] = v;
				});
				ndata.push(tempfields);console.log('tempfields: ',tempfields)
			});
			// console.log('ndata: ',ndata)
			var source = {
				datatype: "json",
				datafields:GDATAFIELDS,
				localdata:ndata
			}
			// console.log(source)
			var dataAdapter = new $.jqx.dataAdapter(source);
			$('#grid').jqxGrid({source:dataAdapter});
			$.each(GDATAFIELDS,function(i,e){
				if(i > 0){
					$("#grid").jqxGrid('autoresizecolumn',e.name);
				}
			});
			// $("#grid").jqxGrid('autoresizecolumns');
			// $('#grid').jqxGrid('setcolumnproperty', 'rowctrl', 'width', 100);

		}else{
			console.log('ERROR: '.data);
			alert('Something went wrong while trying to fetch the data.');
		}
	});
}

function ShowAddEditModal(x){
	$('#fieldsContainer').empty();
	var isObject = (typeof x === 'object');
	var modalTitle = (isObject)?'Edit data':'Add new data';
	var eid = (isObject)?x.eid:x;//{eid:eid,rowdata:rowdata}


	var alldata = _.find(EIDATA,['eid',eid.toString()]);
	$('#modalTitle').text(modalTitle);
	$('#eititle').text(alldata.title);
	$('#addeditform').modal('show');

	var fields = JSON.parse(alldata.fields);
	var merge = [];
	if(isObject){
		$('#savedata').attr({'data-eid':eid,'data-did':x.did});
		merge = _.map(fields,function(obj){
			return _.assign(obj,_.find(x.fields,function(o){
				return o.fname.toLowerCase() == obj.fname.replace(/\s/g, "").toLowerCase();
			}));
		});
	}
	var html = '',fieldtemp = (isObject)?merge:fields;console.log(fieldtemp)
	$.each(fieldtemp,function(i,e){
		html += fieldTemplate(e);
	});
	$('#fieldsContainer').append(html);
}
/**
 * Get the even/incident data from the database in and display the data in a list style.
 */
function GetEventIncident(bool){
	$.post(BaseUrl()+'ajax/wcms/GetEventIncident',{},function(data){
		if(IsJsonString(data)){
			var obj = JSON.parse(data);EIDATA = obj;
			var html = '';
			$.each(obj,function(i,e){
				html += '<div style="width: 100%;" class="p-1 eventdata border-bottom border-info" data-eid="'+e.eid+'">';
				html += '<div class="eventtitle">';
				html += '<b>'+e.title+'</b><br>';
				html += '<small class="text-secondary">'+e.description+'</small>';
				html += '</div><div style="float: right;" class="action-btn">';
				html += '<div><i class="mdi mdi-square-edit-outline action-edit" data-tooltip="true" title="Edit" data-action="edit"></i></div>';
				html += '<div><i class="mdi mdi-trash-can-outline action-delete" data-tooltip="true" title="Delete" data-action="delete"></i></div></div></div>';
			});
			$('#eventlst').html(html);
			if(bool){
				$('.eventdata:first-child',$('#eventlst')).click();
			}
			console.log(obj)
		}else{
			console.log('ERROR: '.data);
			alert('Something went wrong while trying to fetch the data.');
		}
	});
}
/**
 * This will reset the form of add/edit incident form.
 */
function resetForm(){
	$('#fieldContainer .tablefield:not(.tablefield:first-child)').remove();
	$('input,textarea',$('#addNewEIForm')).val('');
	$('#saveei').removeAttr('data-eid');
}
/**
 *This function will add additional table field template for the add/edit incident form.
 */
function TableFieldTemplate(data){
	var fname = '', ftype = '', fopt = '';
	if(data !== undefined){
		fname = data.fname;
		ftype = data.ftype;
		fopt = data.fopt;
	}
	return '<div class="tablefield"><br>'+
		'<input type="text" placeholder="Field Name" class="border fname" value="'+fname+'"/>'+
		'<select class="border ftype">'+
			'<optgroup label="Field Type">'+
				'<option value="input" '+(ftype == 'input'?'selected':'')+'>Input</option>'+
				'<option value="textarea" '+(ftype == 'textarea'?'selected':'')+'>Textarea</option>'+
				'<option value="select" '+(ftype == 'select'?'selected':'')+'>select</option>'+
				'<option value="checkbox" '+(ftype == 'checkbox'?'selected':'')+'>checkbox</option>'+
				'<option value="radio" '+(ftype == 'radio'?'selected':'')+'>radio</option>'+
			'</optgroup>'+
		'</select>'+
		'<input type="text" value="'+fopt+'" class="border fopt" style="display: '+($.inArray(ftype,['select','checkbox','radio']) !== -1?'block':'none')+';" placeholder="Separate by semi-colon (;)"/>'+
		'<i class="mdi mdi-close fremove"></i>'+
	'</div>';
}
/**
 * This will append a field for the form base on the given field type.
 * Field type: (input, textarea, select, checkbox, radio).
 */
function fieldTemplate(data){
	var r = '';
	switch(data.ftype){
		case 'input':
			r = '<div class="form-group" data-num="'+data.num+'" data-type="'+data.ftype+'">'+
    			'<label for="f'+data.num+'" class="font-weight-bold">'+data.fname+':</label>'+
    			'<input type="text" value="'+(data.value !== undefined?data.value:'')+'" class="form-control form-control-sm rounded-0" id="f'+data.num+'"></div>';
			break;
		case 'textarea':
			r = '<div class="form-group" data-num="'+data.num+'" data-type="'+data.ftype+'">'+
    			'<label for="f'+data.num+'" class="font-weight-bold">'+data.fname+':</label>'+
    			'<textarea class="form-control form-control-sm rounded-0" rows="3" id="f'+data.num+'" style="resize:none;">'+(data.value !== undefined?data.value:'')+'</textarea></div>';
			break;
		case 'select':
			r = '<div class="form-group" data-num="'+data.num+'" data-type="'+data.ftype+'">'+
				'<label for="f'+data.num+'" class="font-weight-bold">'+data.fname+':</label>'+
				'<select class="form-control form-control-sm rounded-0" id="f'+data.num+'">';
				$.each(data.fopt.split(';'),function(i,e){

					r += '<option value="'+e+'" '+(data.value === e?'selected':'')+'>'+e+'</option>';
				});
			r += '</select></div>';
			break;
		case 'checkbox':
			r = '<div class="font-weight-bold">'+data.fname+':</div>'+
				'<div class="form-group" data-num="'+data.num+'" data-type="'+data.ftype+'">';
				var chklst = data.value.replace(/, /g,";");
				chklst = chklst.split(';');
				$.each(data.fopt.split(';'),function(i,e){
					r += '<div class="form-check">'+
					'<input class="form-check-input" '+($.inArray(e,chklst) !== -1?'checked':'')+' type="checkbox" name="fchk'+data.num+'" id="fchk'+data.num+'i'+i+'" value="'+e+'">'+
          			'<label class="form-check-label" for="fchk'+data.num+'i'+i+'">'+e+'</label></div>';
				});
			r += '</div>';
			break;
		case 'radio':
			r = '<div class="font-weight-bold">'+data.fname+'</div>'+
				'<div class="form-group" data-num="'+data.num+'" data-type="'+data.ftype+'">';
				$.each(data.fopt.split(';'),function(i,e){
					r += '<div class="form-check">'+
					'<input class="form-check-input" type="radio" name="frdo'+data.num+'" id="frdo'+data.num+'i'+i+'" value="'+e+'" '+(data.value === e?'checked':'')+'>'+
          			'<label class="form-check-label" for="frdo'+data.num+'i'+i+'">'+e+'</label></div>';
				});
			r += '</div>';
			break;
	}
	return r;
}
/**
 * Get field value from add/edit data form base on the field type.
 * Since some fields can't get the value by val() function, this
 * function will get that value.
 */
function GetFieldValue(elem,type){
	var r = $(type,elem).val();
	switch(type){
		case 'checkbox':
			r = [];
			$('input:checkbox:checked',elem).each(function(i,e){
				r.push($(this).val());
			});
			break;
		case 'radio':
			r = $('input:radio:checked',elem).val();
			break;
	}
	return r;
}