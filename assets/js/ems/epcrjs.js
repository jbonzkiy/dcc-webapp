$(function(){

	//check if ems crew cookies exist and value is not empty
	//if not exist then show #emscrew
	var emscrew = Cookies.get('emscrew');//console.log(emscrew)
	if(emscrew === undefined){
		$('#emscrew').show();
		$('#mainapp').hide();
	}else{
		$('#emscrew').hide();	
		$('#mainapp').show();
	}
	//edit emd crew
	$('#editemscrew').click(function(){
		emscrew = JSON.parse(Cookies.get('emscrew'));
		//{"ambu":"9","ea1":"M71","ea2":"","ea3":"","eo":"D04"}
		var ambu = emscrew.ambu,
		eic = emscrew.eic,
		ea1 = emscrew.ea1,
		ea2 = emscrew.ea2,
		ea3 = emscrew.ea3,
		eo = emscrew.eo;

		$('#ambuno').val(ambu);
		$('#eic').val(eic);
		$('#ea1').val(ea1);
		$('#ea2').val(ea2);
		$('#ea3').val(ea3);
		$('#eo').val(eo);

		$('#emscrew').show();
		$('#mainapp').hide();
	});

	//saving ems crew event
	$('#savebtnemscrew').click(function(){
		var ambu = $('#ambuno').val(),
		eic = $('#eic').val(),
		ea1 = $('#ea1').val(),
		ea2 = $('#ea2').val(),
		ea3 = $('#ea3').val(),
		eo = $('#eo').val();

		var crew = {ambu:ambu,eic:eic,ea1:ea1,ea2:ea2,ea3:ea3,eo};
		Cookies.set('emscrew', JSON.stringify(crew), { expires: 365 });
		$('#emscrew').hide();	
		$('#mainapp').show();
	});

	//initialize summernote plugin for rich textarea
	$('.summernote').summernote({
        tabsize: 2,
        height: 150,maxHeight: 150,minHeight:150, 
        toolbar:[
        	['para', ['ul', 'ol', 'paragraph']],
        	['table', ['table']]
        ]
	});

	//Initialize Signiture
	$('#sigcanvas').signature({color:'#242526',
		change:function(e,ui){
			if($('#sigcanvas').signature('isEmpty')){
				$('#sigclr').hide();
			}else{
				$('#sigclr').show();
			}
		}
	});

	//clear signature event
	$('#sigclr').click(function(){
		$('#sigcanvas').signature('clear');
	});
});