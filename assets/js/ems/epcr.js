// var casetype = {};

$(function(){
	$('#sigcanvas').signature({color:'#242526'});

	$('#print_epcr').click(function(){
		$('#epcrform').printThis();
	});
	
	$('.avpu').click(function(){
		var cnt = $(this).parent();
		var isActive = $(this).attr('data-active');console.log(isActive)
		$('.avpu',cnt).each(function(i,e){
			$(this).removeAttr('data-active');
		});
		if(isActive === undefined){
			$(this).attr('data-active','true');
		}
		
	});

	$('#addesig,#sig').click(function(){//open modal
		var oldsig = $('#sig').attr('src');//console.log(oldsig)
		var h = ($(this).attr('id') == 'addesig')?'Add':'Update';
		if(oldsig !== undefined && oldsig != ''){
			$('#sigcanvas').signature('draw',oldsig);
		}
		$('.sigmodalheader').text(h);
		$('#sigmodal').modal('show');
	});

	$('#savesig').click(function(){
		var output = $('#sigcanvas').signature('toDataURL');
		$('#sigmodal').modal('hide');
		if($('#sigcanvas').signature('isEmpty')){
			$('#addesig').show();
			$('#sig').attr({'src':''});
			$('#sig').hide();
		}else{
			$('#addesig').hide();
			$('#sig').attr({'src':output});
			$('#sig').show();
		}
		
	});
	$('#clearsig').click(function(){
		$('#sigcanvas').signature('clear');
	});

	$('#save_epcr').click(function(){
		// $('#loading').show();

		var dtdate = $('#dt_date').val(),//date/ time
		dttime = $('#dt_time').val(),//date /time
		loc = $('#loc').val(),//location
		ct = $('#casetype').val(),//case type
		pname = $('#pname').val(),//patient's name
		pgender = $('#pgender').val(),//patient's gender
		pnum = $('#pnum').val(),//patient's num
		tas = $('#dt_tas').val(),//time arrived at scene
		tls = $('#dt_tls').val(),//time left scene
		tah = $('#dt_tah').val(),//time arrived at hospital
		ctdesc = $('#ct_desc').val(),//case type description eg..OB CASE, etc....
		ht = $('#ht').val(),//hospital transported to
		age = $('#age').val(),//age
		w = $('#pweight').val(),//weight
		h = $('#pheight').val(),//height
		rteam = $('#rteam').val(),//response team
		rcode = $('#rcode').val(),//response code
		padd = $('#padd').val(),//patient's address
		rfrom = $('#rfrom').val(),//response from
		amnum = $('#amnum').val(),//ambulance number
		rp = $('#rp').val(),//relation to patient's
		cc = $('#cc').val(),//chief complaints
		interventions = $('#interventions').val(),
		notes = $('#notes').val(),
		revname = $('#revname').val(),//receiver's name
		revdt = $('#revdt').val(),//date received
		sig = $('#sig').attr('src');//receiver's signature

		epcr_dt = dtdate+' '+dttime+':00';
		tas = moment(tas).format('YYYY-MM-DD HH:mm:ss');
		tls = moment(tls).format('YYYY-MM-DD HH:mm:ss');
		tah = moment(tah).format('YYYY-MM-DD HH:mm:ss');

		//get dntp
		var dntp = {};
		$('.dntp').each(function(i,e){
			dntp[$(this).data('field')] = $(this).val();
		});
		//get s.a.m.p.l.e.
		var sample = {};
		$('.sample').each(function(i,e){
			sample[$(this).data('field')] = $(this).val();
		});
		//get crew
		var crew = {};
		$('.crew').each(function(i,e){
			crew[$(this).data('field')] = $(this).val();
		});
		//get vsign
		var vsignf = {}, vsigns = {}, vsignt = {};
		$('.vsign').each(function(i,e){
			switch($(this).data('cnt')){
				case 'first':
					vsignf[$(this).data('field')] = $(this).val();
					break;
				case 'second':
					vsigns[$(this).data('field')] = $(this).val();
					break;
				case 'third':
					vsignt[$(this).data('field')] = $(this).val();
					break;
			}
		});
		//get remarks
		var vrf = {}, vrs = {}, vrt = {};
		$('.vsignr').each(function(i,e){
			switch($(this).data('cnt')){
				case 'first':
					vrf[$(this).data('field')] = $(this).val();
					break;
				case 'second':
					vrs[$(this).data('field')] = $(this).val();
					break;
				case 'third':
					vrt[$(this).data('field')] = $(this).val();
					break;
			}
		});
		vsignf['remarks'] = vrf;
		vsigns['remarks'] = vrs;
		vsignt['remarks'] = vrt;
		//get avpu
		$('.avpu').each(function(i,e){
			var cnt = $(this).parent().data('cnt');
			var isActive = $(this).attr('data-active');
			if(isActive === 'true')
			switch(cnt){
				case 'first':
					vsignf['avpusel'] = $(this).data('val');
					break;
				case 'second':
					vsigns['avpusel'] = $(this).data('val');
					break;
				case 'third':
					vsignt['avpusel'] = $(this).data('val');
					break;
			}
		});


		var vsign = {first:vsignf,second:vsigns,third:vsignt};
		var receiving = {name:revname,dt:revdt,signature:sig};

		var d = {dispatch_dt:epcr_dt,epcr_dt:epcr_dt,location:loc,case_type:ct,pname:pname,p_gender:pgender,pnum:pnum,epcr_tas:tas,epcr_tls:tls,epcr_tah:tah,epcr_ct_desc:ctdesc,epcr_ht:ht,epcr_age:age,epcr_w:w,epcr_h:h,epcr_rteam:rteam,epcr_rcode:rcode,epcr_address:padd,epcr_rfrom:rfrom,epcr_ambnum:amnum,epcr_rp:rp,epcr_cc:cc,epcr_interventions:interventions,epcr_notes:notes,epcr_dntp:JSON.stringify(dntp),epcr_sample:JSON.stringify(sample),epcr_vitalsigns:JSON.stringify(vsign),epcr_crew:JSON.stringify(crew),epcr_receiving:JSON.stringify(receiving)};
		// console.log(sig)
		bootbox.confirm({ 
			size: "small",
			message: "Confirm saving of EPCR",
			callback: function(result){
				if(result){
					$('#loading').show();
					$.ajax({
						url:BaseUrl()+'ajax/ems/saveEPCR',
						data:d,
						async:false,
						method:'POST',
						success:function(data){
							if($.trim(data) == 'OK'){
								$.notify('Saved!',{position:'top center',className:'success'});
							}else{
								console.log(data)
								alert("An error occured while trying to save the data from the database.\nNo changes has been made to the database");
							}
						},
						error:function(jqXHR,textStatus,errorThrown ){
							console.log(errorThrown);
							alert(textStatus);
						}
					});
				}
				$('#loading').hide();
			}
		});
		
	});
});

// function PopulateCaseType(){
// 	$.ajax({
// 		url:BaseUrl()+'ajax/ems/GetCaseType',
// 		async:false,
// 		success:function(data){
// 			if(IsJsonString(data)){
// 				var obj = JSON.parse(data),temp = '',html = '';
// 				var cttemp = {};
// 				$.each(obj,function(i,e){
// 					if(temp !== e.cat){
// 						temp = e.cat;
// 						cttemp.push({temp:});
// 					}
// 					html += '<option value="'+e.cid+'" data-cat="'+e.cat+'">'+e.type+'</option>';
// 				});
// 				$('#casetype').html(html);
// 			}else{
// 				console.log(data);
// 				alert('Data is not a valid JSON string.');
// 			}
// 		},
// 		error:function(jqXHR,textStatus,errorThrown ){
// 			console.log(errorThrown);
// 			alert(textStatus);
// 		}
// 	});
// }
