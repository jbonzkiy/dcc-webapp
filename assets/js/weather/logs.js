var WeatherData = [], observableArray;
var TypeOfPost = {
	'Thunderstorm':['Thunderstorm Advisory','Thunderstorm Watch','Thunderstorm Termination'],
	'Weather Forecast':['Daily Forecast','Weekly Weather Outlook','Weekend Weather Outlook'],
	'Earthquake':['Earthquake Advisory'],
	'Flooding':['General Flood Advisory','General Flood Termination','Urban Flooding','Urban Flooding Termination'],
	'Tropical Cyclone':['Severe Weather Advisory','Hourly Update','DILG CODIX'],
	'WeatherUpdate':['Rainfall Termination','Rainfall Warning','Heavy Rainfall Termination','Weather Advisory','Rainfall Update','Gale Warning','Tropical Cyclone'],
	'Local CDRRMD Advisory':['Hydromet-Yellow','Hydromet-Orange','Hydromet-Red','CDRRMD Activities','Local Street Advisory','Local Rainfall Advisory','Local Earthquake Advisory','Landslide Advisory','Hydromet Termination','EOC Press Release','IMT Activities','Oro Rescue RUNS','Oro Rescue RUNS (Fire)','Oro Rescue RUNS (Dead Body)','Oro Rescue RUNS (Flood)','Oro Rescue RUNS (Landslide)','Oro Rescue RUNS (Vehicular Accident)','Oro Rescue RUNS (Simulation)'],

	'Special Report':['El Niño','La Niña','Amihan','Habagat','Special Report Termination','CDRRMD Shared Advisory','Climate Advisory','Press Statement','PAGASA Holiday Special Outlook']
};
//Weather System (Affected and not affected) = {name:value}
var WeatherSystem = {'None (No Weather System)':'None','Localized thunderstorm':'Localized thunderstorm','Northeast monsoon':'Amihan','Southwest monsoon':'Habagat','Tropical Cyclone':'Tropical Cyclone','Easterlies':'Easterlies','Tail-End of a Cold Front':'Tail-End of a Cold Front','ITCZ':'ITCZ','Low Pressure Area':'LPA','High Pressure Area':'HPA','Trough of LPA':'Trough of LPA','Trough of Cyclone':'Trough of Cyclone','Northeasterly surface windflow':'Northeasterly surface windflow','Frontal System':'Frontal System','Monsoon Trough':'Monsoon Trough','Southwesterlies':'Southwesterlies','Southwesterly surface windflow':'Southwesterly surface windflow','Northwesterly':'Northwesterly','NWSW Winds Convergence':'Northwesterly and Southwesterly Winds Convergence','Northeasterlies':'Northeasterlies'};

$(function(){
	//populate type of post
	var TypeOfPostOpt = [];
	$.each(TypeOfPost,function(i,_e){
		TypeOfPostOpt.push('<option value="'+i+'">'+i+'</option>');
	});
	$('#typeofpost').html(TypeOfPostOpt.join(' '));
	PopulateTypeofAdvi('Thunderstorm');
	$('#typeofpost').change(function(){
		PopulateTypeofAdvi(this.value);
		ShowHideForForecase();
	});
	$('#typeofadvi').change(function(){
		ShowHideForForecase();
	});
	//get not affected
	// var type_of_advi_val = $("#typeofadvi").dropdown("get value");console.log(type_of_advi_val)
	// $("#typeofadvi").dropdown({
	// 	onChange:function(v,t,c){
	// 		console.log(v,t,c)
	// 	}
	// });

	//populate affected and not affected weather system
	var WeatherSystemOpt = [];
	$.each(WeatherSystem,function(i,e){
		WeatherSystemOpt.push('<option value="'+e+'">'+i+'</option>');
	});
	$('#weather_affect_cdo,#weather_not_affect_cdo').html(WeatherSystemOpt.join(' '));
	
	/**
	 * Binding events
	 */
	 $('input:radio[name="infocast"]').change(function(){
	 	(this.value == 'YES')?$('#forInfocast').show():$('#forInfocast').hide();
	 });
	 $('input:radio[name="missed_post"]').change(function(){
	 	(this.value == 'YES')?$('#forMissedPost').show():$('#forMissedPost').hide();
	 });

	console.log('ready');
	$('.ui.checkbox').checkbox();
	$('.ui.dropdown').dropdown();
	var gridOpt = {
		width:'100%',
		height:'88.8%',
		columns:GridCol(),
		autorowheight:true,
		theme:'metrodark',
		showtoolbar: true,
		altrows: true, 
		columnsresize: true,
		// selectionmode:'multiplerowsextended',
		filterable:true,
		showfilterrow:true,
		pageable: true,
		pagesize: 20,
		pagesizeoptions:['20','50','100'],
		enablebrowserselection:true,
		sortable: true,
		selectionmode:'checkbox',
		ready: function(){
			
		},
		rendertoolbar: function (statusbar) {
			var container = $("<div style='overflow: hidden; position: relative; margin:3px;'></div>");
			var addbtn = $('<button class="ui primary labeled mini icon button" style="border-radius:2px;margin-right:5px;"><i class="plus square icon"></i>New Entry</button>');
			var delbtn = $('<button class="ui primary labeled mini icon button" style="border-radius:2px;"><i class="trash alternate icon"></i>Delete Selected</button>');
			container.append(addbtn);
			container.append(delbtn);
			statusbar.append(container);

			addbtn.click(function(){
				$('.ui.modal')
				.modal({blurring: true,centered: false})
				.modal('show');
			});

			delbtn.click(function(){
				console.log('delete Selected.');
			});

		}
	}

	$('#grid').jqxGrid(gridOpt);
	LoadData();
});

function GridCol(){
	
	var col = [
	{ text: 'ID',datafield:'wid', width:45},
	{ text: 'Date of Advisory',datafield:'date_advi', filtertype:'range', cellsformat:'yyyy-MM-dd', width:80},
	{ text: 'Time Issued/ Reported',datafield:'time_advi', width:60, filterable:false,cellsformat:'HH:mm:ss'},
	{ text: 'Type of Advisory',datafield:'type_advi', width:150},
	{ text: 'Type of Runs',datafield:'rescues', width:150},
	{ text: 'CDO Affected',datafield:'affected', width:100,filtertype:'checkedlist',filteritems:['YES','NO','NOT APPLICABLE']},
	{ text: 'Source Link',datafield:'pagasa_link', width:40, filterable:false, cellsrenderer:function (_row, _columnfield, value, _defaulthtml, _columnproperties){
			return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+
					'<a href="'+value+'" target="_blank"><i class="linkify icon"></i></a></div>';
	}},
	{ text: 'Time Posted',datafield:'time_post', width:60,filterable:false,cellsformat:'HH:mm:ss'},
	{ text: 'CDRRMD Link',datafield:'cdrrmd_link', width:40, filterable:false, cellsrenderer:function (_row, _columnfield, value, _defaulthtml, _columnproperties){
			return '<div class="jqx-grid-cell-middle-align" style="margin-top: 8px;">'+
					'<a href="'+value+'" target="_blank"><i class="linkify icon"></i></a></div>';
	}},
	{ text: 'Infocast',datafield:'infocast', width:50,filtertype:'checkedlist',filteritems:['YES','NO']},
	{ text: 'Area Affected',datafield:'area_affected', width:50,filtertype:'checkedlist',filteritems:['NONE','URBAN','RIVERINE','BOTH']},
	{ text: 'Issues & Concerns',datafield:'issues_concern', width:160},
	{ text: 'Action Taken/ Comments',datafield:'action_taken'},
	{ text: 'Remarks',datafield:'remarks', width:75},
	{ text: 'Staff',datafield:'firstname', width:75,filtertype:'checkedlist',filteritems:['SAGRADO','SALUNTAO','ECOT','MANJAC','ESCOBAR']}
	];
	return col;
}

function LoadData(){
	var url = BaseUrl()+'ajax/weather/LoadData';
	var source =
    {
        datatype: "json",
        type:'POST',
        datafields: [
            { name: 'wid', type: 'int' },
            { name: 'date_advi', type: 'date'},
            { name: 'time_advi',type:'date'},
            { name: 'type_advi',type:'string' },
			{ name: 'rescues',type:'string' },
            { name: 'affected',type:'string' },
            { name: 'pagasa_link',type:'string' },
            { name: 'time_post',type:'date' },
            { name: 'cdrrmd_link',type:'string' },
            { name: 'infocast',type:'string' },
            { name: 'area_affected',type:'string' },
            { name: 'issues_concern',type:'string' },
            { name: 'action_taken',type:'string' },
            { name: 'remarks',type:'string' },
            { name: 'firstname',type:'string' }
        ],
        id: 'wid',
        url: url,
        root: 'data'
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $('#grid').jqxGrid({source:dataAdapter});
}

function FetchData(){
	$.ajax({
		url:BaseUrl()+'ajax/weather/LoadData',
		async:true,
		method:'POST',
		success:function(data){
			if(IsJsonString(data)){
				WeatherData = JSON.parse(data);console.log(WeatherData);
				observableArray = new $.jqx.observableArray(WeatherData, function (changed) {console.log(changed)}); 
				var source =  {  
					localdata: observableArray,  
					datatype: "obserableArray",  
					datafields:  
					[  
						{ text: 'ID', type: 'number'},
						{ text: 'Date of Advisory', type: 'string'},
						{ text: 'Time Issued/ Reported', type: 'string'},
						{ text: 'Type of Advisory', type: 'string'},
						{ text: 'Type of Runs', type: 'string'},
						{ text: 'CDO Affected', type: 'string'},
						{ text: 'Source Link', type: 'string'},
						{ text: 'Time Posted', type: 'string'},
						{ text: 'CDRRMD Link', type: 'string'},
						{ text: 'Infocast', type: 'string'},
						{ text: 'Area Affected', type: 'string'},
						{ text: 'Issues & Concerns', type: 'string'},
						{ text: 'Action Taken/ Comments', type: 'string'},
						{ text: 'Remarks', type: 'string'},
						{ text: 'Staff on Duty', type: 'string'} 
					]  
		        };  
				var dataAdapter = new $.jqx.dataAdapter(source);  
				$('#grid').jqxGrid({source:dataAdapter});
			}else{
				console.log('INVALID DATA: ',data);
				alert('INVALID DATA');
			}
		},
		error:function(_jqXHR,_textStatus,errorThrown ){
			console.log(errorThrown);
			// alert(textStatus);
			$('.daily_loader').hide();
		}
	});

	
}

function PopulateTypeofAdvi(post){
	var TypeOfAdviOpt = [];
	$.each(TypeOfPost[post],function(_i,e){
		TypeOfAdviOpt.push('<option value="'+e+'">'+e+'</option>');
	});
	$('#typeofadvi').html(TypeOfAdviOpt.join(' '));
}

function ShowHideForForecase(){
	var tp = $('#typeofpost').val(),//type of post
	ta = $('#typeofadvi').val();//type of advi
	console.log(tp,ta)
	$('#'+(tp == 'Weather Forecast' && ta == 'Daily Forecast'?'forDaily':'forDefault')).removeClass('display-none');
	$('#'+(tp == 'Weather Forecast' && ta == 'Daily Forecast'?'forDefault':'forDaily')).removeClass('display-none');
}