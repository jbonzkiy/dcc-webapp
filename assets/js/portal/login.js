$(function(){

	$('.ui.form').form({
		fields:{
			uname:{
				identifier: 'uname',
				rules:[
					{type:'empty',prompt:'Username empty'}
				]
			},
			upass:{
				identifier: 'upass',
				rules:[
					{type:'empty',prompt:'Password empty'}
				]
			}
		},
		onSuccess: function(e,f){
			e.preventDefault();
			
			$form  = $(this);
          	$form.addClass('loading');
          	
          	f['type'] = 'login';

			$.ajax({
				url:BaseUrl()+'ajax/portal/validation',
				async:true,
				data:f,
				method:'POST',
				success:function(data){
					data = data.replace(/\"/g,'');console.log(data)
					if(data == 'OK'){
						//redirect to home page
					}else{
						if(data == 'NOT EXIST'){
							$form.form('add errors',['Username does not exist']);
						}else{
							$form.form('add errors',['Password is incorrect']);
						}
						
                		$form.find('.ui.error.message').show();
					}
					$form.removeClass('loading');
				},
				error:function(jqXHR,textStatus,errorThrown ){
					console.log(errorThrown);
					alert(textStatus);
					$form.removeClass('loading');
				}
			});
			
		}
	});
});