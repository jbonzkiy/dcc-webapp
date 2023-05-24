var update_id = 0;
const userid = $('#navbar').data('uid');
$(function(){
	populateAffiliated();
	populateNetOps();

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

		var cname = $('#name').val(),
		cnum = $('#num').val(),
		caddress = $('#address').val(),
		netops = $('#netops').val(),
		affiliated = $('#affiliated').val();

		var d = {update_id:update_id, tp:'infocast', name:cname, num:cnum, net_ops:netops, address:caddress, affiliated:affiliated, uid:userid};
		// console.log(d)
		//validation
		var errmsg = [];
		if($.trim(cname) == ''){errmsg.push({elem:'name',msg:'Empty'});}
		if($.trim(cnum) == ''){errmsg.push({elem:'num',msg:'Empty'});}
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
				message: 'Confirm saving infocast contact '+cname,
				callback: function(r){
					if(r){
						$('.custom.form').addClass('loading');
						$.ajax({
							url:BaseUrl()+'ajax/weather/saveData',
							async:true,
							data:d,
							method:'POST',
							success:function(data){
								console.log(data)
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
		{ text: '#', width: '40px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,pinned:true,
		cellsrenderer: function (row, column, value) {
			var r = row;
			// console.log(r,row,r++,(r + 1))
			return "<div class='jqx-grid-cell-middle-align' style='margin-top:8px;'>" + (row + 1) + "</div>";
		}},
		{ text: '', width: '50px',cellsalign:'center',align:'center',resizable:false,filterable:false,menu:false,pinned:true,
		cellsrenderer: function (row, column, value) {
			var rdata = $('#grid').jqxGrid('getrowdata', row);
			// console.log(r,row,r++,(r + 1))
			var btnarr = [
				'<i class="edit icon btncontrol" data-action="edit" title="Edit '+rdata.name+'" style="cursor:pointer;"></i>',
				'<i class="trash icon btncontrol" data-action="delete" title="Delete '+rdata.name+'" style="cursor:pointer;"></i>'
			]
			return '<div class="jqx-grid-cell-middle-align" style="margin-top:8px;" data-row="'+row+'">'+btnarr.join('&nbsp;')+'</div>';
		}},
		{ text: 'Name',  datafield: 'name', width: '120px',cellsalign:'center',align:'center',resizable:false},
		{ text: 'Number',  datafield: 'num', width: '120px',cellsalign:'center',align:'center',resizable:false},
		{ text: 'Operator',  datafield: 'net_ops', width: '120px',cellsalign:'center',align:'center',resizable:false, filtertype:'checkedlist', filteritems:netops},
		{ text: 'Address',  datafield: 'address', width: 'auto',cellsalign:'center',align:'center',resizable:false},
		{ text: 'Affiliation',  datafield: 'affiliated', width: '120px',cellsalign:'center',align:'center',resizable:false, filtertype:'checkedlist', filteritems:affiliation},
		{ text: 'Staff',  filtertype:'checkedlist', datafield: 'uname', width: '120px',cellsalign:'center',align:'center',resizable:false},
		{datafield: 'cid', hidden:true},
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
		// toolbarheight:50,
		rendertoolbar: function(statusbar){
			var container = $('<div style="overflow: hidden; position: relative; margin: 5px;"></div>');
			var multidelete = $('<button class="ui mini labeled negative icon button" style="float: left; margin-left: 5px;" disabled><i class="trash icon"></i>Delete selected item<span id="ws"></span> <span class="cnt_selected"></span></button>');
			container.append(multidelete);
			statusbar.append(container);
			multidelete.click(function(){
				let rowindex = $('#grid').jqxGrid('getselectedrowindexes');
				var cids = [];
				$.each(rowindex,function(i,e){
					let data = $('#grid').jqxGrid('getrowdata', e);
					cids.push(data.cid);
				});
				if(cids.length == 0){
					notif('No item selected','error','top center');
				}else{
					bootbox.confirm({
						title:'Confirm',
						size:'mini',
						message: "Confirm deleting selected infocast contact"+(cids.length > 1?"s":"")+"<br>Total selected item"+(cids.length > 1?"s":"")+": "+cids.length,
						callback: function(r){
							if(r){
								$.ajax({
									url:BaseUrl()+'ajax/weather/saveData',
									async:true,
									data:{tp:'infocast delete',update_id:1,cids:cids},
									method:'POST',
									success:function(data){
										notif(cids.length+' item'+(cids.length > 1?"s":"")+' has been deleted',undefined,'top center');
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
	GetInfocastData();
	//grid event/s
	$('#grid').on('rowselect rowunselect',function(event){
	    var totalSelected = $('#grid').jqxGrid('getselectedrowindexes').length;
	    var txt = (totalSelected > 0)?'('+totalSelected+')':'';
	    $('.cnt_selected').text(txt);
	    $('.cnt_selected').parent().prop('disabled',(totalSelected == 0));
	    $('#ws').text((totalSelected > 1?'s':''));
	});

	$('body').on('click','.btncontrol',function(){
		var $this = $(this);
		var action = $this.data('action');
		var row = $this.parent().data('row');
		var rdata = $('#grid').jqxGrid('getrowdata', row);
		// console.log(rdata)
		if(action == 'edit'){
			update_id = rdata.cid;
			$('#name').val(rdata.name);
			$('#num').val(rdata.num);
			$('#address').val(rdata.address);
			$('#netops').val(rdata.net_ops);
			$('#affiliated').val(rdata.affiliated);
		}else{//delete
			bootbox.confirm({
				title:'Confirm',
				size:'mini',
				message: 'Confirm deleting infocast contact '+rdata.name,
				callback: function(r){
					if(r){
						$.ajax({
							url:BaseUrl()+'ajax/weather/saveData',
							async:true,
							data:{tp:'infocast delete',update_id:1,cids:[rdata.cid]},
							method:'POST',
							success:function(data){
								notif(rdata.name+' has been deleted',undefined,'top center');
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
 * populate affiliated select
 */
function populateAffiliated(){
	var html = '';
	affiliation.sort();
	$.each(affiliation,function(i,e){
		html += '<option value="'+e+'">'+e+'</option>';
	});
	$('#affiliated').html(html);
}
/**
 * populate netops select
 */
function populateNetOps(){
	var html = '';
	netops.sort();
	$.each(netops,function(i,e){
		html += '<option value="'+e+'">'+e+'</option>';
	});
	$('#netops').html(html);
}
/**
 * retore form values to default
 */
function defaultForm(){
	update_id = 0;

	$('input:text,textarea').val('');

	$('select').each(function(){
		$(this).val($('option:first-child()',this).prop('value'));
	});

	//focus in first input of the form
	$('#name').focus();
	//remove all error span
	$('.errmsg').remove();
	$('div.field.error').removeClass('error');
}

function GetInfocastData(){
	var source =
    {
        datafields:
        [
            { name: 'cid', type: 'int' },
            { name: 'name', type: 'string' },
            { name: 'num', type: 'string' },
            { name: 'net_ops', type: 'string'},
            { name: 'address', type: 'string'},
            { name: 'affiliated', type: 'string' },
            { name: 'uname', type: 'string' }
        ],
        id:'cid',
        datatype: "json",
        url:BaseUrl()+'ajax/weather/getInfocastData',
        // data:{uid:uid,type:type},
        type:'POST'
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $('#grid').jqxGrid({source:dataAdapter});
}