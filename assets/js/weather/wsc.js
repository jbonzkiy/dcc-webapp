$(function(){
	var icon_default = 'arrows alternate horizontal',
	icon_loader = 'sync alternate spinner loading';

	$('.ui.dropdown').dropdown();

	$('#btn_filter').click(function(){
		$('#vdivider_icn').removeClass(icon_default).addClass(icon_loader);
		//get weather system seleted
		var ws = $('#ws').val(),
		//get affecting cdo selected
		acdo = $('#acdo').val(),
		//get from date
		fdt = $('#fdt').val(),
		//get to date
		tdt = $('#tdt').val();
		
		if(fdt == '' || tdt == ''){
			fdt = moment().subtract(1,'month').startOf('month').format('YYYY-MM-DD');
			tdt = moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD');
			//getData({dt:fdt+'/'+tdt,ws:ws,acdo:acdo});
		}else{
			if(!moment(fdt).isBefore(tdt) && fdt != tdt){
				alert('Invalid Date Range');
			}else{console.log(fdt,tdt)
				// EmptyData();
				//getData({dt:fdt+'/'+tdt,ws:ws,acdo:acdo});
			}
		}

		setTimeout(function(){
			$('#vdivider_icn').removeClass(icon_loader).addClass(icon_default);
		},3000)
	});
});

function getData(param){
	$.ajax({
		url:BaseUrl()+'ajax/report/GetData',
		async:true,
		data:param,
		method:'POST',
		success:function(_data){

		},
		error:function(_jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			alert(textStatus);
		}
	});
}