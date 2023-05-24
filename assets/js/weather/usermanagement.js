var update_id = 0,old_username;
const userid = $('#navbar').data('uid');
$(function(){
	var navbar_height = $('#navbar').innerHeight();
	var html_height = $('html').innerHeight();
	var htmH = $(window).innerHeight();
	/************************************************************************************************************
	initialize splitter
	************************************************************************************************************/
	$('#versplit').jqxSplitter({  width: '100%', height: (htmH-navbar_height-2)+'px',resizable:false,splitBarSize:0, panels: [{ size: 300,collapsible:false }],theme:'metro' });
	$("#vhsplit").jqxSplitter({width: '100%', height: '100%',orientation:'horizontal',panels:[{ size: 30,collapsible:false }],showSplitBar:false,theme:'metro'});
	$("#frmPanel").jqxPanel({ width: '100%', height: '100%',theme:'metro',autoUpdate: true});

	/***********************************************************************************************************
	Clear form
	************************************************************************************************************/
	$('#btn_clear').click(function(){
		defaultForm();
	});
	/***********************************************************************************************************
	Submit
	************************************************************************************************************/
	$('#btn_submit').click(function(){
		//remove all error span
		$('.errmsg').remove();
		$('div.field.error').removeClass('error');

		var uname = $('#uname').val(),
		upass = $('#upass').val(),
		fname = $('#fname').val(),
		access = $('input[name=access]:checked').val();

		var d = {update_id:update_id, tp:'user', uname:uname, upass:upass, fname:fname, access:access, old_username:old_username};
		// console.log(d)
		//validation
		var errmsg = [];
		if($.trim(uname) == ''){errmsg.push({elem:'uname',msg:'Empty'});}
		if($.trim(upass) == ''){errmsg.push({elem:'upass',msg:'Empty'});}
		if(errmsg.length > 0){
			$.each(errmsg,function(i,e){
				var $parent = $('#'+e.elem).parent();
				$('label',$parent).append('<small class="errmsg" style="color: #DB2828;font-weight:normal;">&nbsp;&nbsp;&nbsp;'+e.msg+'</small>');
				$parent.addClass('error');
			});
			$('#'+errmsg[0].elem).focus();
			// $('#frmPanel').jqxPanel('scrollTo', $('#'+errmsg[0].elem).offset().top, 0);
		}else{
			bootbox.confirm({
				title:'Confirm',
				size:'mini',
				message: 'Confirm saving infocast contact '+upass,
				callback: function(r){
					if(r){
						$('.custom.form').addClass('loading');
						$.ajax({
							url:BaseUrl()+'ajax/weather/saveData',
							async:true,
							data:d,
							method:'POST',
							success:function(data){
								if($.trim(data) == 'USERNAME_EXIST'){
									notif('Username ('+uname+') already exist.','error','top center');
									$('#uname').focus();
								}else{
									// console.log(data)
									defaultForm();
									notif('Saved!',undefined,'top center');
									var filtersinfo = $('#grid').jqxGrid('getfilterinformation');
									if(filtersinfo.length != 0){
										$('#grid').jqxGrid('updatebounddata','cells');
									}else{
										if(update_id === undefined){
											$('#grid').jqxGrid('updatebounddata','data');
										}else{//loadPPCR();
											$('#grid').jqxGrid('updatebounddata','cells');
										}
									}
								}
								//update data of the grid
							},
							error:function(jqXHR,textStatus,errorThrown ){
								console.log(errorThrown);
							},
							complete:function(jqXHR,textStatus){
								$('.custom.form').removeClass('loading');
							}
						});
					}
					
				}
			});
		}
	});
	/***********************************************************************************************************
	grid
	************************************************************************************************************/
	var col = [//grid column
		{ text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,pinned:true,editable:false,
		cellsrenderer: function (row, column, value) {
			var r = row;
			// console.log(r,row,r++,(r + 1))
			return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
		}},
		{ text: '', width: '50px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,pinned:true,editable:false,
		cellsrenderer: function (row, column, value) {
			var rdata = $('#grid').jqxGrid('getrowdata', row);
			// console.log(r,row,r++,(r + 1))
			var btnarr = [
				'<i class="edit icon btncontrol" data-action="edit" title="Edit '+rdata.name+'" style="cursor:pointer;"></i>',
				'<i class="trash icon btncontrol" data-action="delete" title="Delete '+rdata.name+'" style="cursor:pointer;"></i>'
			]
			return '<div class="jqx-grid-cell-middle-align" style="margin-top:8px;" data-row="'+row+'">'+btnarr.join('&nbsp;')+'</div>';
		}},
		{ text: 'Username',  datafield: 'uname', width: '120px',cellsalign:'center',align:'center',resizable:false,editable:false},
		{ text: 'Password',  datafield: 'upass', width: '120px',cellsalign:'center',align:'center',resizable:false,editable:false},
		{ text: 'Fullname',  datafield: 'fname', width: 'auto',cellsalign:'center',align:'center',resizable:false},
		{ text: 'Access',  datafield: 'access', width: 'auto',cellsalign:'center',align:'center',resizable:false, filtertype:'checkedlist', filteritems:['admin','user'],editable:false},
		{ text: 'Active',  datafield: 'active', columntype:'checkbox', width: '120px',cellsalign:'center',align:'center',resizable:false},
		{datafield: 'uid', hidden:true},
	];
	//initialize grid
	$('#grid').jqxGrid({
		width: '100%',height: '100%', theme:'metro',
		columns:col,
		columnsresize:false,
		enablebrowserselection:true,
		enabletooltips:true,
		showfilterrow: true,
		selectionmode:'checkbox',
		columnsreorder: false,
		filterable: true,
		sortable:true,
		altrows:false,
		showtoolbar: true,
		editable:true,
		// toolbarheight:50,
		rendertoolbar: function(statusbar){
			var container = $('<div style="overflow: hidden; position: relative; margin: 5px;"></div>');
			var multidelete = $('<button class="ui mini labeled negative icon button" style="float: left; margin-left: 5px;" disabled><i class="trash icon"></i>Delete selected user<span id="ws"></span> <span class="cnt_selected"></span></button>');
			container.append(multidelete);
			statusbar.append(container);
			multidelete.click(function(){
				let rowindex = $('#grid').jqxGrid('getselectedrowindexes');
				var uids = [];
				$.each(rowindex,function(i,e){
					let data = $('#grid').jqxGrid('getrowdata', e);
					uids.push(data.uid);
				});
				if(uids.length == 0){
					notif('No item selected','error','top center');
				}else{
					bootbox.confirm({
						title:'Confirm',
						size:'mini',
						message: "Confirm deleting selected user"+(uids.length > 1?"s":"")+"<br>Total selected item"+(uids.length > 1?"s":"")+": "+uids.length,
						callback: function(r){
							if(r){
								if($.inArray(parseInt(userid),uids) !== -1){
									bootbox.alert('Since you deleted you\'r own account, you will now be force to logout.', function(){
										window.location.replace(BaseUrl()+'weather/logout');
									});
								}
								$.ajax({
									url:BaseUrl()+'ajax/weather/saveData',
									async:true,
									data:{tp:'user delete',update_id:1,uids:uids},
									method:'POST',
									success:function(data){
										notif(uids.length+' item'+(uids.length > 1?"s":"")+' has been deleted',undefined,'top center');
										$('#grid').jqxGrid('clearselection');
										var filtersinfo = $('#grid').jqxGrid('getfilterinformation');
										if(filtersinfo.length != 0){
											$('#grid').jqxGrid('updatebounddata','cells');
										}else{
											if(update_id === undefined){
												$('#grid').jqxGrid('updatebounddata','data');
											}else{
												$('#grid').jqxGrid('updatebounddata','cells');
											}
										}
									},
									error:function(jqXHR,textStatus,errorThrown ){
										console.log(errorThrown);
									},
									complete:function(jqXHR,textStatus){
										$('.custom.form').removeClass('loading');
									}
								});
							}
							
						}
					});//
				}
			});
		}
	});
	//fetch data for the grid for the first time.
	GetUserData();
	//grid event/s
	$('#grid').on({
		'rowselect rowunselect':function(event){
		    var totalSelected = $('#grid').jqxGrid('getselectedrowindexes').length;
		    var txt = (totalSelected > 0)?'('+totalSelected+')':'';
		    $('.cnt_selected').text(txt);
		    $('.cnt_selected').parent().prop('disabled',(totalSelected == 0));
		    $('#ws').text((totalSelected > 1?'s':''));
		},
		'cellendedit':function(event){
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
			console.log(dataField,oldvalue,value,rowData)
			if(oldvalue != value){
				$.post(BaseUrl()+'ajax/weather/saveData',{update_id:rowData.uid, tp:'user', active:(value?1:0)},function(data){
					console.log(data)
				});
			}
		}
	});

	$('body').on('click','.btncontrol',function(){
		var $this = $(this);
		var action = $this.data('action');
		var row = $this.parent().data('row');
		var rdata = $('#grid').jqxGrid('getrowdata', row);
		// console.log(rdata)
		if(action == 'edit'){
			update_id = rdata.uid;
			old_username = rdata.uname;
			$('#uname').val(rdata.uname);
			$('#upass').val(rdata.upass);
			$('#fname').val(rdata.fname);
			$('input[name=access][value='+rdata.access+']').prop('checked',true);
		}else{//delete
			bootbox.confirm({
				title:'Confirm',
				size:'mini',
				message: 'Confirm deleting user '+rdata.uname,
				callback: function(r){
					if(r){
						$.ajax({
							url:BaseUrl()+'ajax/weather/saveData',
							async:true,
							data:{tp:'user delete',update_id:1,uids:[rdata.uid]},
							method:'POST',
							success:function(data){
								notif(rdata.uname+' has been deleted',undefined,'top center');
								//redirect to logout if userid = uid
								if(parseInt(userid) === parseInt(rdata.uid)){
									bootbox.alert('Since you deleted you\'r own account, you will now be force to logout.', function(){
										window.location.replace(BaseUrl()+'weather/logout');
									});
								}
								var filtersinfo = $('#grid').jqxGrid('getfilterinformation');
								if(filtersinfo.length != 0){
									$('#grid').jqxGrid('updatebounddata','cells');
								}else{
									if(update_id === undefined){
										$('#grid').jqxGrid('updatebounddata','data');
									}else{
										$('#grid').jqxGrid('updatebounddata','cells');
									}
								}
							},
							error:function(jqXHR,textStatus,errorThrown ){
								console.log(errorThrown);
							},
							complete:function(jqXHR,textStatus){
								$('.custom.form').removeClass('loading');
							}
						});
					}
					
				}
			});
		}
	});
});
/**
 * retore form values to default
 */
function defaultForm(){
	update_id = 0;

	$('input:text,input:password,textarea').val('');
	$('input[name=access][value=admin]').prop('checked',true);
	//focus in first input of the form
	$('#uname').focus();
	//remove all error span
	$('.errmsg').remove();
	$('div.field.error').removeClass('error');
}

function GetUserData(){
	var source =
    {
        datafields:
        [
            { name: 'uid', type: 'int' },
            { name: 'uname', type: 'string' },
            { name: 'upass', type: 'string' },
            { name: 'fname', type: 'string'},
            { name: 'access', type: 'string'},
            { name: 'active', type: 'int' }
        ],
        id:'uid',
        datatype: "json",
        url:BaseUrl()+'ajax/weather/getUserData',
        // data:{uid:uid,type:type},
        type:'POST'
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $('#grid').jqxGrid({source:dataAdapter});
}