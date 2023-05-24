/**
 * Tropical Cyclone Names and corresponding set of year
 */
const tc_names_set1 = ['AURING','BISING','CRISING','DANTE','EMONG','FABIAN','GORIO','HUANING','ISANG','JOLINA','KIKO','LANNIE','MARING','NANDO','ODETTE','PAOLO','QUEDAN','RAMIL','SALOME','TINO','UWAN','VERBENA','WILMA','YASMIN','ZORAIDA','ALAMID','BRUNO','CONCHING','DOLOR','ERNIE','FLORANTE','GERARDO','HERNAN','ISKO','JEROME'];
const tc_names_set2 = ['AGATON','BASYANG','CALOY','DOMENG','ESTER','FLORITA','GARDO','HENRY','INDAY','JOSIE','KARDING','LUIS','MAYMAY','NENENG','OBET','PAENG','QUEENIE','ROSAL','SAMUEL','TOMAS','UMBERTO','VENUS','WALDO','YAYANG','ZENY','AGILA','BAGWIS','CHITO','DIEGO','ELENA','FELINO','GUNDING','HARRIET','INDANG','JESSA'];
const tc_names_set3 = ['AMANG','BETTY','CHEDENG','DODONG','EGAY','FALCON','GORING','HANNA','INENG','JENNY','KABAYAN','LIWAYWAY','MARILYN','NIMFA','ONYOK','PERLA','QUIEL','RAMON','SARAH','TAMARAW','UGONG','VIRING','WENG','YOYOY','ZIGZAG','ABE','BERTO','CHARO','DADO','ESTOY','FELION','GENING','HERMAN','IRMA','JAIME'];
const tc_names_set4 = ['AGHON','BUTCHOY','CARINA','DINDO','ENTENG','FERDIE','GENER','HELEN','IGME','JULIAN','KRISTINE','LEON','MARCE','NIKA','OFEL','PEPITO','QUERUBIN','ROMINA','SIONY','TONYO','UPANG','VICKY','WARREN','YOYONG','ZOSIMO','ALAKDAN','BALDO','CLARA','DENCIO','ESTONG','FELIPE','GOMER','HELING','ISMAEL','JULIO'];

const tropical_cyclone_names = {
	2021:tc_names_set1,2025:tc_names_set1,2029:tc_names_set1,2033:tc_names_set1,
	2022:tc_names_set2,2026:tc_names_set1,2030:tc_names_set1,2034:tc_names_set1,
	2023:tc_names_set3,2027:tc_names_set1,2031:tc_names_set1,2035:tc_names_set1,
	2024:tc_names_set4,2028:tc_names_set1,2032:tc_names_set1,2036:tc_names_set1
};
/**
 * Tropical Cyclone International Names.
 * Additional names can be added at the end of the array.
 */
const tc_inter_name = ["KROVANH", "DUJUAN", "SURIGAE", "CHOI-WAN", "KOGUMA", "CHAMPI", "IN-FA", "CEMPAKA", "NEPARTAK", "LUPIT", "MIRINAE", "NIDA", "OMAIS", "CONSON", "CHANTHU", "DIANMU", "MINDULLE", "LIONROCK", "KOMPASU", "NAMTHEUN", "MALOU", "NYATOH", "RAI", "MALAKAS", "MEGI", "CHABA", "AERE", "SONGDA", "TRASES", "MULAN", "MEARI", "MA-ON", "TOKAG", "MUIFA", "MERBOK", "NANMADOL", "TALAS", "NORU", "KULAP", "ROKE", "SONCA", "NESAT", "HAITANG", "NALGAE", "BANYAN", "YAMANEKO", "PAKHAR", "SANVU", "MAWAR", "GUCHOL", "TALIM", "DOKSURI", "KHANUN", "LAN", "SAOLA"];
/**
 * Type of post and type of advisory
 * {post:name_of_post,advi:[list of advisories {advi:name_of_advi,default:default value for `Is CDO Affected`}]}
 */
const type_of_post_and_advi = [
	{post:'Thunderstorm',advi:
		[
			{advi:'Thunderstorm Advisory',default:'affected'},
			{advi:'Thunderstorm Watch',default:'affected'},
			{advi:'Thunderstorm Termination',default:'na'}
		]
	},
	{post:'Weather Forecast',advi:
		[
			{advi:'Daily Forecast',default:'none'},
			{advi:'Weekly Weather Outlook',default:'na'},
			{advi:'Weekend Weather Outlook',default:'na'}
		]
	},
	{post:'Earthquake',advi:
		[
			{advi:'Earthquake Advisory',default:'affected'}
		]
	},
	/*{post:'Rescues',advi:
		[
			{advi:'Oro Rescue RUNS',default:'affected'}
		]
	},*/
	{post:'Flooding',advi:
		[
			{advi:'General Flood Advisory',default:'affected'},
			{advi:'General Flood Termination',default:'na'},
			{advi:'Flooding Advisory (Local Tributaries)',default:'affected'},
			{advi:'Flooding Advisory (Termination)',default:'affected'},
			{advi:'Urban Flooding Termination',default:'na'}
		]
	},
	{post:'Tropical Cyclone',advi:
		[
			{advi:'Severe Weather Bulletin',default:'na'},
			{advi:'Tropical Cyclone Bulletin (inside PAR)',default:'na'},
			{advi:'Tropical Cyclone Advisory (outside PAR)',default:'na'},
			{advi:'Hourly Update',default:'na'},
			{advi:'DILG CODIX',default:'na'}
		]
	},
	{post:'Weather Update',advi:
		[
			{advi:'Rainfall Termination',default:'affected'},
			{advi:'Rainfall Warning',default:'affected'},
			{advi:'Heavy Rainfall Termination',default:'na'},
			{advi:'Weather Advisory',default:'affected'},
			{advi:'Rainfall Advisory',default:'affected'},
			{advi:'Gale Warning',default:'affected'},
			{advi:'Shipping Forecast',default:'affected'}

		]
	},
	{post:'Local CDRRMD Post',advi:
		[
			{advi:'Hydromet-Yellow',default:'affected'},
			{advi:'Hydromet-Orange',default:'affected'},
			{advi:'Hydromet-Red',default:'affected'},
			{advi:'CDRRMD Activities',default:'na'},
			{advi:'Local Street Advisory',default:'affected'},
			{advi:'Local Fire Advisory',default:'affected'},
			{advi:'Local Traffic Advisory',default:'affected'},
			{advi:'Local Rainfall Advisory',default:'affected'},
			{advi:'Local Earthquake Advisory',default:'affected'},
			{advi:'Landslide Advisory',default:'affected'},
			{advi:'Hydromet Termination',default:'na'},
			{advi:'EOC Press Release',default:'na'},
			{advi:'IMT Activities',default:'na'},
			{advi:'Oro Rescue RUNS',default:'affected'},
			{advi:'Oro Rescue RUNS (Fire)',default:'affected'},
			{advi:'Oro Rescue RUNS (Dead Body)',default:'affected'},
			{advi:'Oro Rescue RUNS (Flood)',default:'affected'},
			{advi:'Oro Rescue RUNS (Landslide)',default:'affected'},
			{advi:'Oro Rescue RUNS (Vehicular Accident)',default:'affected'},
			{advi:'Oro Rescue RUNS (Simulation)',default:'affected'},
			{advi:'Riverine Status',default:'affected'},
			{advi:'Riverine Update Termination',default:'affected'},
			{advi:'Tropical Cyclone Local Update',default:'affected'},
			{advi:'911 Advisory',default:'affected'}
		]
	},
	{post:'Special Report',advi:
		[
			{advi:'El Niño',default:'affected'},
			{advi:'La Niña',default:'affected'},
			{advi:'Amihan',default:'affected'},
			{advi:'Habagat',default:'affected'},
			{advi:'Special Report Termination',default:'na'},
			{advi:'CDRRMD Shared Advisory',default:'affected'},
			{advi:'Climate Advisory',default:'affected'},
			{advi:'Press Statement',default:'affected'},
			{advi:'PAGASA Holiday Special Outlook',default:'affected'},
			{advi:'Extreme Temperature Advisory',default:'affected'},
			{advi:'Heat Index',default:'affected'},
		]
	}
];
/**
 * Weather System List
 */
const weather_systems = ['Localized thunderstorm','Easterlies','ITCZ','Northeast monsoon','Southwest monsoon','Northeasterly surface windflow','Tail-End of a Cold Front','Frontal System','Monsoon Trough','Southwesterlies','Southwesterly surface windflow','Northwesterly','NWSW Winds Convergence','Northeasterlies','Tail-End of a Frontal System','High Pressure Area','Low Pressure Area','Trough of LPA','Trough of LPA Outside PAR','Trough of Cyclone','Tropical Cyclone','Shearline'];
/**
 * List of Guages
 * Group by Riverine
 */
const gauges = [
	{riverine:'iponan',gauges:
		[
			{type:'arg',name:'rogongon'},
			{type:'arg',name:'pigsag-an'},
			{type:'arg',name:'taglimao'},
			{type:'arg',name:'san simon'},
			{type:'arg',name:'bulao'},
			// {type:'wlms',name:'rogongon'},
			// {type:'wlms',name:'pigsag-an'},
			{type:'wlms',name:'san simon'},
			{type:'wlms',name:'bulao'}
		],travel:
		[
			{from:'san simon',to:'bulao'}
		]
	},
	{riverine:'cdo',gauges:
		[
			{type:'arg',name:'tikalaan'},
			{type:'arg',name:'cosina'},
			{type:'arg',name:'dagumbaan'},
			{type:'arg',name:'kalilangan, baungon'},
			{type:'arg',name:'baungon poblacion'},
			{type:'arg',name:'bubunawan'},
			{type:'arg',name:'mambuaya'},
			{type:'arg',name:'kabula'},
			{type:'arg',name:'pelaez bridge'},
			{type:'arg',name:'cdo bridge'},
			{type:'arg',name:'macapaya'},
			{type:'arg',name:'camaman-an nhs'},
			// {type:'arg',name:'bontong, camaman-an'},
			{type:'wlms',name:'uguiaban'},
			{type:'wlms',name:'tumalaong'},
			{type:'wlms',name:'bubunawan'},
			{type:'wlms',name:'kabula'},
			{type:'wlms',name:'wla-pelaez'},
			{type:'wlms',name:'wla-ndmi pelaez'},
			{type:'wlms',name:'cdo bridge'},
			{type:'wlms',name:'puntod'}
		],travel:
		[
			{from:'uguiaban',to:'kabula'},
			{from:'bubunawan',to:'kabula'},
			{from:'kabula',to:'wla-pelaez'},
			{from:'kabula',to:'wla-ndmi pelaez'},
			{from:'wla-pelaez',to:'puntod'},
			{from:'wla-ndmi pelaez',to:'puntod'}
		]
	},
	{riverine:'bigaan',gauges:
		[
			{type:'arg',name:'dahilayan'},
			{type:'arg',name:'sumilao poblacion'},
			{type:'arg',name:'guihian'},
			{type:'arg',name:'alae'},
			{type:'arg',name:'san luiz, malit-bog'}
		]
	},
	{riverine:'cugman',gauges:
		[
			{type:'arg',name:'dahilayan'},
			{type:'arg',name:'sumilao poblacion'},
			{type:'arg',name:'guihian'},
			{type:'arg',name:'alae'},
			{type:'arg',name:'san luiz, malit-bog'}
		]
	},
	{riverine:'umalag',gauges:
		[
			{type:'arg',name:'dahilayan'},
			{type:'arg',name:'sumilao poblacion'},
			{type:'arg',name:'guihian'},
			{type:'arg',name:'alae'},
			{type:'arg',name:'san luiz, malit-bog'}
		]
	},
	{riverine:'agusan',gauges:
		[
			{type:'arg',name:'dahilayan'},
			{type:'arg',name:'sumilao poblacion'},
			{type:'arg',name:'guihian'},
			{type:'arg',name:'alae'},
			{type:'arg',name:'san luiz, malit-bog'}
		]
	},
	{riverine:'alae',gauges:
		[
			{type:'arg',name:'dahilayan'},
			{type:'arg',name:'sumilao poblacion'},
			{type:'arg',name:'guihian'},
			{type:'arg',name:'alae'},
			{type:'arg',name:'san luiz, malit-bog'}
		]
	},
	{riverine:'bitan-ag creek',gauges:
		[
			{type:'arg',name:'macapaya'},
			{type:'arg',name:'camaman-an nhs'},
			{type:'wlms',name:'bontong'}
		]
	}	
];
/**
 * List of streets and status
 */
const flood_street = ['Kauswagan','Villarin','CM recto Highway','JR Borja Ext','Macanhan','Pimentel','CM Recto-Osmena st.'];
const street_status = ['Passable to all vehicle','Not passable to light vehicle','Not passable to all vehicle'];
/**
 * Infocast list of affiliation
 */
const affiliation = ['AFP','BARANGAY OFFICIALS','BMFI','CDO CITIZEN','CDO MEDIA','CDRRMD','COWD','DEPED','FOUNDATIONS','HOME OWNERS ASSOCIATIONS','LGU','NMMC','PNP','RTA','SMART','SOP R10','TASKFORCE PANGBAHAY','TOG10'];
/**
 * Infocast list of network operator
 */
const netops = ['SUNPOS','BDYSU','TNT','BROPRE','SUNPRE','BUDDY','POSTPD'];