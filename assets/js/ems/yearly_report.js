$(function(){
	//getData();
	$('#btnGenerate').click(function(){
		var y = $('#selYear').val();
		$('#dtcreated').val(moment().format('MMMM')+' '+y);
		$('#cencusyr').val(y);
		getData(y)
	});

	$('#btnPrint').click(function(){
		$('#controlContainer').hide();
		window.print();
		$('#controlContainer').show();

	});

});

function getData(year){
	// console.log(fdt,tdt);
	$('#btnGenerate').text('Please Wait...');
	$('#output').empty();
	$.ajax({
		url:BaseUrl()+'ajax/ems/GetDataReport',
		async:true,
		data:{year:year,type:'yearly'},
		method:'GET',
		success:function(data){
			if(IsJsonString(data)){
				var obj = JSON.parse(data),html = '';console.log(obj)
				var newobj = _.groupBy(obj,'cat');
				console.log(obj);
				console.log(newobj);
				// html += '<table id="reptable" style="height:100%;width:100%;font-family:Calibri;font-size:14px;">';
				// html += '<tr>';
				// html += '<td rowspan="3" class="pr-3"><b>I. MEDICAL</b>'+setTable(newobj['Medical'])+'</td>';
				// html += '<td valign="top" class="pl-3"><b>II. TRAUMA</b>'+setTable(newobj['Trauma'])+'</td>';
				// html += '</tr>';
				// html += '<tr><td valign="top" style="height:100%;" class=" pl-3"><b>III. OTHERS</b>'+setTable(newobj['Others'])+'</td></tr>';
				// html += '<tr><td valign="bottom" class="pl-3">For your reference<br><br>Prepared by:<br><b><u><input type="text" value="TUMULAK, ESCOLTOS, AGUSTIN" style="font-weight: bold;border: none;text-transform: uppercase; color: #212529; width:100%;text-decoration:underline;"/></u></b><br><input type="text" value="EMS LOGISTICS" style="border: none;text-transform: uppercase; color: #212529; width:100%;"/><br><br><br>Noted by:<br><b><u>JOHN ROSS L. ESCOLTOS, RN</u></b><br>EMS UNIT CHIEF</td></tr>';
				// html += '</table>';
				// $('#output').html(html);
			}else{
				console.log(data);
				alert('Data is not a valid JSON string.');
			}
			$('#btnGenerate').text('Generate Report');
		},
		error:function(jqXHR,textStatus,errorThrown ){
			console.log(errorThrown);
			$('#btnGenerate').text('Generate Report');
			alert(textStatus);
		}
	});
}

function setTable(e){
	var html = '<table border="1" style="width:100%;">';
	html += '<tr style="text-align:center;"><th>CASE</th><th class="px-2" style="width:100px;"># OF CASES</th></tr>';

	var total = 0, temp = '';
	$.each(e,function(i2,e2){
		html += '<tr>';
		// console.log(temp)
		if(e2.styp != 'NONE'){
			if(temp != e2.typ){//add first type
				html += '<th class="px-2">'+e2.typ+'</th><td></td>';
				html += '<tr><td class="px-2">&#8226;'+e2.styp+'</td><td style="text-align:center;">'+e2.cnt+'</td></tr>';
			}else{
				html += '<td class="px-2">&#8226;'+e2.styp+'</td><td style="text-align:center;">'+e2.cnt+'</td>';
			}
			temp = e2.typ;

		}else{
			html += '<td class="px-2">'+e2.typ+'</td><td style="text-align:center;">'+e2.cnt+'</td>';
		}

		html += '</tr>';
		total = total + parseInt(e2.cnt);

	});

	html += '<tr><th class="px-2" style="text-align:right;">TOTAL</th><th style="text-align:center;">'+total+'</th></tr>'
	html += '</table>';

	return html;
}