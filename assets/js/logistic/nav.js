var isAdmin = $('#popcontainer').data('isadmin');
$(function(){
	

	$('#openpopupadmin').popup({
		popup:$('#popupAdmin'),
		on:'click'
	});

	$('#admincode').on('keypress keyup',function(){
		var val = $.trim($(this).val());
		$('#adminbtn').prop('disabled',(val == ''));
	});
	
	$('#adminbtn').click(function(){
		// var isAdmin = $('#popcontainer').data('isadmin');
		var addUrl = (isAdmin == 'YES')?'RemoveAdminAccess':'ValidateAdminAccessCode';

		var accessCode = $.trim($('#admincode').val());
		$('.adminaform').addClass('loading');
		$.post(BaseUrl()+'ajax/logistic/'+addUrl,{accesscode:accessCode},function(d){console.log(d)
			if($.trim(d) == 'INVALID'){
				$('.adminaform').addClass('error');
			}else{
				$('.adminaform').removeClass('error');
				window.location.reload();
			}
			$('.adminaform').removeClass('loading');
		});
	});
});