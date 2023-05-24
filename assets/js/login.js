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
          	
			$.ajax({
				url:
			});
		}
	});
});