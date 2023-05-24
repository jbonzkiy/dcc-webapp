var zoomIn = 17, zoomOut = 13;
var mapcenter = {lat:8.47680266405839, long:124.64139461517335};
var incident_type_law = ['Alarm','Assault','Bomb Threat','Burglary','Carnapping','Child Abuse','Curfew Violation','Dead Body',
'Death Threat','Demolition','Domestic Problem','Drag Racing','Drill','Drugs','Electrical','Explosion','Extortion','Found Items',
'Found Person','Harassment','Hit and Run','Hostage Taking','Illegal Activities','Intoxicated Pedestrian','Kidnapping',
'Land Dispute','Lost items','Loud Reports','Mental Case','Missing Person','Noise Complaint','Prowler','Rape','Riot','Robbery',
'Sexual Harrasment','Shooting Incident','Smoking Violation','Stabbing','Stoning','Suicide','Suspicious Circumstance','Theft',
'Trespassing','Vehicular Accident','Vehicular Accident with Patient','Weapons'];
var incident_type_med = ['Medical','Medical Transport','Trauma'];
var incident_type_rescue = ['Animal Case','Chemical Emergencies','Drowning','Earthquake','Rescue','Electrical','Flood','Landslide','Public Disturbance','Structural Collapse','Trapped','Water'];
var incident_type_others = ['Alarm Test','Follow-up Call','Inquiry','Outside CDO Boundary'];
var other_agency = ['AFP','Barangay','BFP','Carmen Rescue','CEO','CEPALCO','COWD','CSWD',
'CVO','IPM','PDRRMO','Phil Coast Guard','PNP','RED CROSS','RTA','Others'];


$(function(){
    var isSemantic = false;
    $('script').each(function(){
        if($(this).attr('src') !== undefined && $(this).attr('src').indexOf('semantic') !== -1){
            isSemantic = true;
            return false;
        }
    });
    console.log('isSemantic: ',isSemantic);
    if(isSemantic){
        $('.ui.dropdown').dropdown();
        $('.ui.checkbox').checkbox();
    }

    // moment.updateLocale('en', {
    //     invalidDate : 'No available data'
    // });
});

function notif(msg,type,pos){
    type = (type === undefined || type == '')?'success':type;
    pos = (pos === undefined || pos == '')?'top center':pos;
    $.notify(msg,{position:pos,className:type,showAnimation:'fadeIn',hideAnimation:'fadeOut'});
}
/**
 * jQWidgets default theme
 */
var theme = 'metrodark';
/**
 * Weather Systems
 */
var ws_cdo = ['Localized thunderstorm','Northeast monsoon','Southwest monsoon','Tropical Cyclone',
'Easterlies','Tail-End of a Cold Front','ITCZ','Low Pressure Area','High Pressure Area','Trough of LPA',
'Trough of Cyclone','Northeasterly surface windflow','Frontal System','Monsoon Trough','Southwesterlies',
'Southwesterly surface windflow','Northwesterly','NWSW Winds Convergence','None (No Weather System)'];
/**
 * Tropical Cyclone Type
 */
var tc_type = ['TD','TS','STS','TY','STY'];
/**
 * Storm Local Names
 */
var localname = ['AMANG','BETTY','CHEDENG','DODONG','EGAY','FALCON','GORING','HANNA',
'INENG','JENNY','KABAYAN','LIWAYWAY','MARILYN','NIMFA','ONYOK','PERLA','QUIEL','RAMON',
'SARAH','TISOY','URSULA','VIRING','WENG','YOYOY','ZIGZAG','OTHERS'];
/**
 * Storm International Names
 */
var interName = ['Bolaven','Sanba','Jelawat','Ewiniar','Maliksi','Gaemi','Prapiroon',
'Maria','Son-Tinh','Ampil','Wukong','Jongdari','Shanshan','Yagi','Leepi','Bebinca',
'Rumbia','Soulik','Cimaron','Jebi','Mangkhut','Barijat','Trami','Kong-rey','Yutu',
'Toraji','Man-yi','Usagi','Nakri','Maysak','Krovanh','Chanthu','Trases','Nesat',
'Fengshen','Haishen','Dujuan','Dianmu','Mulan','Haitang','Kalmaegi','Noul','Surigae',
'Mindulle','Meari','Fung-wong','Dolphin','Choi-wan','Lionrock','Ma-on','Banyan','Kammuri',
'Kujira','Koguma','Kompasu','Tokage','Yamaneko','Phanfone','Chan-hom','Champi','Namtheum',
'Hinnamnor','Pakhar','Vongfong','Linfa','In-fa','Malou','Muifa','Sanvu','Nuri','Nangka',
'Cempaka','Nyato','Merbok','Mawar','Sinlaku','Saudel','Nepartak','Rai','Nanmadol','Guchol',
'Hagibis','Hagupit','Molave','Lupit','Malakas','Talas','Talim','Neoguri','Jangmi','Goni',
'Mirinae','Megi','Noru','Doksuri','Bualoi','Mekkhala','Atsani','Nida','Chaba','Kulap',
'Matmo','Higos','Ethau','Omais','Aere','Roke','Lan','Halong','Bavi','Vamco','Conson',
'Songda','Sonca','Saola'];

function BaseUrl(isTruePath){
	var host = window.location.hostname;//'localhost';
    var path = (isTruePath)?'www/':'';//online.cagayandeoro.gov.ph
    var url = (host == 'online.cagayandeoro.gov.ph')?'https://online.cagayandeoro.gov.ph:8079/':'http://'+host+'/dcc-webapp/'+path;
	return url;
}

function IsJsonString(json)
{     
    try{
        JSON.parse(json);
    }catch (e){
        return false;
    }
     
    return true;
}

/**
 * If you don't care about primitives and only objects then this function
 * is for you, otherwise look elsewhere.
 * This function will return `false` for any valid json primitive.
 * EG, 'true' -> false
 *     '123' -> false
 *     'null' -> false
 *     '"I'm a string"' -> false
 */
 function tryParseJSONObject (jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
};

function GetPercentage(value,base,isSign){
    base = ($.inArray(base,[null,undefined,0]) !== -1)?100:base;
    var s = (isSign)?'':'%';
    return ((parseInt(value) / parseInt(base)) * 100).toFixed(1)+s;
}

/**
*Color pallete to be use for the pie chart
*/
function ColorPallete(){
    var color = [ // Add custom color borders
        'rgba(255, 85, 85,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgb(22, 156, 178,1)',
        'rgb(160, 169, 179,1)',
        'rgb(23, 92, 153,1)',
        'rgb(14, 104, 118,1)',
        'rgb(104, 113, 121,1)',
        'rgb(0, 123, 255,1)',
        'rgb(255, 132, 0,1)',
        'rgb(66, 127, 0,1)',
        'rgb(66, 0, 127,1)',
        'rgb(127, 0, 66,1)',
        'rgb(0, 63, 33,1)',
        'rgb(85, 44, 0,1)',
        'rgb(0, 16, 31,1)',
        'rgb(127, 96, 111,1)'
    ]
    return color;
}

function GotoEndPage(){
    $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
}


function customSelect2(selector = '', url = '', processResults, placeholder = '', onSelect, onClear){
    var _selector = $('#'+selector);

	_selector.select2({
		ajax: {
			url: url,
			dataType: 'json',
			delay: 250,
			data: function (params) {
				// console.log('data params', params);
				return {
					q: params.term, // search term
				};
			},
			processResults: function (data, params) {
				// console.log('processResults', data, params);
				// parse the results into the format expected by Select2
				return {
					results: $.map(data, processResults)
				};
			},
			cache: false
		},
		placeholder: placeholder,
		minimumInputLength: 1,
		allowClear: true,
		theme: "classic"
	});

	_selector.on('select2:select', function (e) { 
		var data = e.params.data;

		if(data){
            // console.log('select2:select', data);
            return onSelect(data);
		}
	});

	_selector.on('select2:clear', function (e) { 
        // console.log('select2:clear', e);
		return onClear();
	});
}