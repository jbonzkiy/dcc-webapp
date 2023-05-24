$(function(){
	console.log('ready');
	$('#uname').focus();
	$('#uname,#upass').on('keypress',function(e){
		if(e.which == 13){
			LoginValidation();
		}
	});

	$('#login').click(function(){
		LoginValidation();
	});
});

function LoginValidation(){
	$('#login_btn_text').hide();
	$('#login_btn_loading').show();
	$('.form-control,.btn').prop('disabled',true);

	$('.err').remove();
	$('.form-control').removeClass('err-input');

	var uname = $('#uname').val(), upass = $('#upass').val(), rm = $('#chk_rm').prop('checked'),
	errMsg = [];


	if(uname == ''){errMsg.push({indi:'uname',msg:'Username is empty.'});}
	if(upass == ''){errMsg.push({indi:'upass',msg:'Password is empty.'});}

	if(errMsg.length > 0){
		$.each(errMsg,function(i,e){
			
			$('label[for='+e.indi+']').append('<small style="color:#9e1a1a" class="err"> '+e.msg+'</small>');
			$('#'+e.indi).addClass('err-input');
		});
		$('#login_btn_text').show();
		$('#login_btn_loading').hide();
		$('.form-control,.btn').prop('disabled',false);
		$('#'+errMsg[0].indi).focus();
	}else{

		$.ajax({
			url:BaseUrl()+'ajax/weather/LoginVerification',
			async:true,
			data:{uname:uname,upass:upass,rm:rm},
			method:'POST',
			success:function(data){
				errMsg = [];
				data = (IsJsonString(data))?data:$.trim(data);
				if(IsJsonString(data)){
					window.location = BaseUrl()+'weather/home';
				}else if($.inArray(data,['INVALID_USERNAME','INVALID_PASSWORD','INACTIVE_USER']) !== -1){
					
					if(data == 'INVALID_USERNAME'){errMsg.push({indi:'uname',msg:'Wrong username.'});}
					if(data == 'INVALID_PASSWORD'){errMsg.push({indi:'upass',msg:'Wrong password.'});}
					if(data == 'INACTIVE_USER'){errMsg.push({indi:'uname',msg:'User account is deactivated.'});}
					if(errMsg.length > 0){
						$.each(errMsg,function(i,e){
							$('label[for='+e.indi+']').append('<small style="color:#9e1a1a" class="err"> '+e.msg+'</small>');
							$('#'+e.indi).addClass('err-input');
						});
					}
				}else{
					alert('An error encountered while trying to validate the user account info.');
					console.log(data);
				}

				$('#login_btn_text').show();
				$('#login_btn_loading').hide();
				$('.form-control,.btn').prop('disabled',false);
				if(errMsg.length > 0){
					$('#'+errMsg[0].indi).focus();
				}
			},
			error:function(jqXHR,textStatus,errorThrown ){
				console.log(errorThrown);
				$('#login_btn_text').show();
				$('#login_btn_loading').hide();
				$('.form-control,.btn').prop('disabled',false);
			}
		});
	}
}