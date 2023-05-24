const editName = {'Northeast monsoon':'Amihan (Northeast Monsoon)',LPA:'Low Pressure Area (LPA)','Localized thunderstorm':'Localized "Thunderstorm"'};
$(function(){
    var navbar_height = $('#navbar').innerHeight();
    var html_height = $('html').innerHeight();
    var htmH = $(window).innerHeight();
    /*************************************************************************************************************/
	//initialize splitter
	/*************************************************************************************************************/
    $("#vhsplit").jqxSplitter({width: '100%', height: (htmH-navbar_height - 5)+'px',orientation:'horizontal',panels:[{ size: 50,collapsible:false }],showSplitBar:false,theme:'metro'});
    $("#jqxpanel").jqxPanel({ width: '100%', height: '100%',theme:'metro',autoUpdate: true});

    $('#btnFilter').click(function(){
        var fdt = $('#fdt').val(),
        tdt = $('#tdt').val();        
        if(fdt == '' || tdt == ''){
            notif('Please input date.','error');
        }else{
            fdt = moment(fdt).format('YYYY-MM-DD HH:mm:ss');
            tdt = moment(tdt).format('YYYY-MM-DD HH:mm:ss');
            if(!moment(fdt,'YYYY-MM-DD').isBefore(moment(tdt, 'YYYY-MM-DD')) && fdt != tdt){
                notif('Invalid Date Range','error');
            }else{
                fetchWeatherSystem(fdt,tdt);
            }
        }
    });
});

function fetchWeatherSystem(fdt,tdt){
    var d = {fdt:fdt,tdt:tdt};
    $.ajax({
        url:BaseUrl()+'ajax/weather/GetWeatherSystem',
        async:true,
        data:d,
        method:'POST',
        success:function(data){
            
            if(IsJsonString(data)){
                var obj = JSON.parse(data);
                console.log(obj)
                var cdo = [], par = [], x = 1;
                $.each(obj,function(_i,e){
                    var ename = (editName[e.name] === undefined)?e.name:editName[e.name];
                    if(e.lst_group == 'cdo'){
                        cdo.push((x++)+'. '+ename);
                    }else{
                        
                        par.push(ename);
                    }
                });
                cdo.sort();
                par.sort();

                var html = '<br><div style="line-height:1.6;font-size:1rem;"><b>WEATHER SYSTEMS</b></div><table border="1" id="ws_table" width="550"  style="border-collapse:collapse; ">';
					html += '<tr style="line-height:1.6;"><th width="50%">AFFECTED THE COUNTRY</th><th width="50%">Affected CDO, Its watershed and tributaries</th></tr>';
				
                $.each(par,function(i,e){
                    
                    html += '<tr style="line-height:1.6;"><td>'+e+'</td>'+(i == 0?'<td rowspan="'+par.length+'">'+cdo.join('<br>')+'</td>':'')+'</tr>';
                });
                html += '</table>';
                $('#displayDataHere').html(html);
                fetchPWS(fdt,tdt);
            }else{
                console.log(data);
                if(data == 'NO_DATA'){
                    notif('No Data for Weather System.','error');
                }
            }
            //update data of the grid
        },
        error:function(_jqXHR,_textStatus,errorThrown ){
            console.log(errorThrown);
        },
        complete:function(_jqXHR,_textStatus){
            
        }
    });
}

function fetchPWS(fdt,tdt){
    var d = {fdt:fdt,tdt:tdt};
    $.ajax({
        url:BaseUrl()+'ajax/weather/GetPWS',
        async:true,
        data:d,
        method:'POST',
        success:function(data){
            
            if(IsJsonString(data)){
                var obj = JSON.parse(data);
                console.log(obj)
                
                var cdo = [];
                $.each(obj,function(_i,e){
                    var ename = (editName[e.name] === undefined)?e.name:editName[e.name];
                    cdo.push({name:ename,cnt:e.cnt});
                });
                cdo.sort();
                var html = '<br><b style="line-height:1.6;font-size:1rem;">Prevalent Weather System vs. Localized Thunderstorms experienced in CDO</b>';
                html += '<table border="1" style="border-collapse:collapse;">';
                $.each(cdo,function(_i,e){
                    html += '<tr style="line-height:1.6;"><td>'+e.name+'</td><td>'+e.cnt+'</td></tr>';
                });
                html += '</table>';
                
                $('#displayDataHere').append(html);
                fetchATF(fdt,tdt);
            }else{
                console.log(data);
                if(data == 'NO_DATA'){
                    notif('No Data for Prevalent Weather System vs. Localized Thunderstorms experienced in CDO.','error');
                }
            }
            //update data of the grid
        },
        error:function(_jqXHR,_textStatus,errorThrown ){
            console.log(errorThrown);
        },
        complete:function(_jqXHR,_textStatus){
            
        }
    });
}

function fetchATF(fdt,tdt){
    var d = {fdt:fdt,tdt:tdt};
    $.ajax({
        url:BaseUrl()+'ajax/weather/GetATF',
        async:true,
        data:d,
        method:'POST',
        success:function(data){
            
            if(IsJsonString(data)){
                var obj = JSON.parse(data);
                console.log(obj)
                var at = [], mlt = [], f = [];
                $.each(obj,function(_i,e){
                    if(e.type == 'Actual Thunderstorm'){
                        at.push({type:e.type,cnt:e.cnt});
                    }
                    else if (e.type == 'More Likely Thunderstorm') {
                        mlt.push({type:e.type,cnt:e.cnt});
                    }
                    // else if (e.type == 'Flooding') {
                    //     f.push({type:e.type,cnt:e.cnt});
                    // }
                });

                var html = '<br><b style="line-height:1.6;font-size:1rem;">Actual Thunderstorm vs. More Likely Thunderstorm</b>';
                html += '<table border="1" style="border-collapse:collapse;">';
                at = (at.length == 0)?[{type:'Actual Thunderstorm',cnt:0}]:at;
                $.each(at,function(_i,e){
                    html += '<tr style="line-height:1.6;"><td>'+e.type+'</td><td>'+e.cnt+'</td></tr>';
                });
                // more likely thunderstorm 
                mlt = (mlt.length == 0)?[{type:'More Likely Thunderstorm',cnt:0}]:mlt;
                $.each(mlt,function(_i,e){
                    html += '<tr style="line-height:1.6;"><td>'+e.type+'</td><td>'+e.cnt+'</td></tr>';
                });
                // urban flooding
                // f = (f.length == 0)?[{type:'Flooding',cnt:0}]:f;
                // $.each(f,function(i,e){
                //     html += '<tr style="line-height:1.6;"><td>'+e.type+'</td><td>'+e.cnt+'</td></tr>';
                // });
                
                $('#displayDataHere').append(html);
                fetchFlooding(fdt,tdt);
            }else{
                console.log(data);
                if(data == 'NO_DATA'){
                    notif('No Data for Actual Thunderstorm vs. Flooding.','error');
                }
            }
            //update data of the grid
        },
        error:function(_jqXHR,_textStatus,errorThrown ){
            console.log(errorThrown);
        },
        complete:function(_jqXHR,_textStatus){
            
        }
    });
}

function fetchFlooding(fdt,tdt){
    var d = {fdt:fdt,tdt:tdt};
    $.ajax({
        url:BaseUrl()+'ajax/weather/GetFlooding',
        async:true,
        data:d,
        method:'POST',
        success:function(data){
            
            if(IsJsonString(data)){
                var obj = JSON.parse(data);
                console.log('fetchFlooding', obj);

                // var rf = [], uf = [], lf = [], sf = [];
                // $.each(obj,function(i,e){
                //     if (e.type == 'riverine') {
                //         rf.push({type:e.type, cnt:e.cnt, fdata:e.fdata, remarks:e.remarks});
                //     }
                //     else if (e.type == 'urban') {
                //         uf.push({type:e.type, cnt:e.cnt, fdata:e.fdata, remarks:e.remarks});
                //     }
                //     else if (e.type == 'landslide') {
                //         lf.push({type:e.type, cnt:e.cnt, fdata:e.fdata, remarks:e.remarks});
                //     }
                //     else if (e.type == 'surge') {
                //         sf.push({type:e.type, cnt:e.cnt, fdata:e.fdata, remarks:e.remarks});
                //     }
                // });
                // console.log('fetchFlooding asd', rf, uf, lf, sf);

                var html = '<br><b style="line-height:1.6;font-size:1rem;">Hazard</b>';
                html += '<table border="1" style="border-collapse:collapse;">';
                // // riverine flooding
                // rf = (rf.length == 0)?[{type:'Riverine',cnt:0}]:rf;
                // $.each(rf,function(i,e){
                //     html += '<tr style="line-height:1.6;"><td>'+e.type+'</td><td>'+e.cnt+'</td></tr>';
                // });
                // // urban flooding
                // uf = (uf.length == 0)?[{type:'Urban',cnt:0}]:uf;
                // $.each(uf,function(i,e){
                //     html += '<tr style="line-height:1.6;"><td>'+e.type+'</td><td>'+e.cnt+'</td></tr>';
                // });
                // // landslide flooding
                // lf = (lf.length == 0)?[{type:'Landslide',cnt:0}]:lf;
                // $.each(lf,function(i,e){
                //     html += '<tr style="line-height:1.6;"><td>'+e.type+'</td><td>'+e.cnt+'</td></tr>';
                // });
                // // surge flooding
                // sf = (sf.length == 0)?[{type:'Landslide',cnt:0}]:sf;
                // $.each(sf,function(i,e){
                //     html += '<tr style="line-height:1.6;"><td>'+e.type+'</td><td>'+e.cnt+'</td></tr>';
                // });

                var html = '<br><div style="line-height:1.6;font-size:1rem;"><b>HAZARD</b></div><table border="1" style="border-collapse:collapse;">';
					html += '<tr style="line-height:1.6;"><th style="width: 130px;">AFFECTED AREA</th><th style="width: 100px;">COUNT/DAY</th><th>DATE & LOCATION</th></tr>';
				
                $.each(obj,function(_i,e){
                    // var dates = e.dates.replace(/,/g, '<br>');
                    var dates_array = e.dates.split(',');
                    // console.log('dates_array', dates_array);

                    var arr = []; // mao ni ang final data sa fdata
                    var fdata_array = e.fdata.split('<>');
                    $.each(fdata_array, function(_i,val){
                        // console.log(val, typeof(val), tryParseJSONObject(val));
                        var riverine_arr = [];
                        
                        if ( e.type == 'Riverine' || e.type == 'Urban' ){
                            arr.push('');
                            // var obj = JSON.parse(val);
                            // console.log('parse json', e.type ,obj);

                            // if ( e.type == 'Riverine' ) {
                            //     // var riverine_arr = [];
                            //     // $.each(obj, function(i,u){
                            //     //     urban_arr.push(u.name);
                            //     // });
                            //     console.log('riverine obj', obj);

                            //     riverine_arr.push(obj.riverine);
                            //     arr.push(riverine_arr);
                            // }

                            // if ( e.type == 'Urban' ) {
                            //     var urban_arr = [];
                            //     $.each(obj, function(i,u){
                            //         urban_arr.push(u.name);
                            //     });

                            //     console.log('urban_arr', urban_arr.toString());
                            //     arr.push(urban_arr.join(';'));
                            // }

                        }else{
                            arr.push(val);
                        }

                    });
                    console.log('fdata', arr);
                    // console.log('riverine_arr', riverine_arr);

                    var fdata = arr.toString().replace(/,/g, '<br>');

                    var sub_table_html = '<table style="border-collapse:collapse;">';
                    $.each(dates_array, function(i, u){
                        var date = (u != null || u != undefined) ? u.toString() : '';
                        var location = (arr[i] != null || arr[i] != undefined) ? arr[i].toString() : '';
                        sub_table_html += '<tr><td>'+date+' - </td><td><span id="too-long" title="'+location+'">'+location+'</span></td></tr>';
                    });
                    sub_table_html += '</table>';
                    
                    html += '<tr style="line-height:1.6;"><td>'+e.type+'</td><td style="text-align: center;">'+e.cnt+'</td><td>'+sub_table_html+'</td></tr>';
                });
                html += '</table>';
                
                $('#displayDataHere').append(html);
                fetchInfocastSubs(fdt,tdt);
            }else{
                console.log(data);
                if(data == 'NO_DATA'){
                    notif('No Data for Flooding.','error');
                }
            }
            //update data of the grid
        },
        error:function(_jqXHR,_textStatus,errorThrown ){
            console.log(errorThrown);
        },
        complete:function(_jqXHR,_textStatus){
            
        }
    });
}

function fetchInfocastSubs(fdt,tdt){

    $.ajax({
        url:BaseUrl()+'ajax/weather/GetInfocastSubs',
        async:true,
        method:'POST',
        success:function(data){
            
            if(IsJsonString(data)){
                var obj = JSON.parse(data);
                console.log(obj)
                const names = {'BARANGAY OFFICIALS':'Barangay Officials',LGU:'CDO LGU',FOUNDATIONS:'Foundations','HOME OWNERS ASSOCIATIONS':'Home Owners Associations','TASKFORCE PANGBAHAY':'Task Force Pangbahay'};
                var sum = _.sumBy(obj, function(o){return parseInt(o.cnt);});

                var html = '<br><div style="line-height:1.6;font-size:1rem;"><b>INFOCAST</b></div>';
                html += '<br><b style="line-height:1.6;font-size:1rem;">Total Subcribers: </b>'+sum;
                html += '<br><b style="line-height:1.6;font-size:1rem;">INFOCAST Subcribers</b>';
                html += '<br><table border="1" style="line-height:1.6;border-collapse:collapse;">';
                $.each(obj,function(_i,e){
                    html += '<tr><td>'+(names[e.affiliated] === undefined?e.affiliated:names[e.affiliated])+'</td><td>'+e.cnt+'</td></tr>';
                });
                html += '</table>';
                
                $('#displayDataHere').append(html);
                fetchTotalTextSent(fdt,tdt)
            }else{
                console.log(data);
                if(data == 'NO_DATA'){
                    notif('No Data for INFOCAST.','error');
                }
            }
            //update data of the grid
        },
        error:function(_jqXHR,_textStatus,errorThrown ){
            console.log(errorThrown);
        },
        complete:function(_jqXHR,_textStatus){
            
        }
    });
}

function fetchTotalTextSent(fdt,tdt){
    var d = {fdt:fdt,tdt:tdt};
    $.ajax({
        url:BaseUrl()+'ajax/weather/GetTotalTextSent',
        async:true,
        data:d,
        method:'POST',
        success:function(data){
            
            if(IsJsonString(data)){
                var obj = JSON.parse(data);
                console.log(obj)
                var html = '<br><b style="line-height:1.6;font-size:1rem;">Total text sent: </b>'+obj;
                html += '<br><b style="line-height:1.6;font-size:1rem;">Infocast Utilization ('+DateDisplayFormat(fdt,tdt).toUpperCase()+')</b>';
                html += '<br><table border="1" style="line-height:1.6;border-collapse:collapse;">';
                html += '<tr><td>Used</td><td>'+obj.toLocaleString()+'</td></tr>';
                html += '<tr><td>Unused</td><td>'+(50000 - parseInt(obj)).toLocaleString()+'</td></tr>';
                html += '</table>';
                
                $('#displayDataHere').append(html);
                fetchInfoDessemination(fdt,tdt)
            }else{
                console.log(data);
                if(data == 'NO_DATA'){
                    notif('No Data for Infocast Utilization.','error');
                }
            }
            //update data of the grid
        },
        error:function(_jqXHR,_textStatus,errorThrown ){
            console.log(errorThrown);
        },
        complete:function(_jqXHR,_textStatus){
            
        }
    });
}

function fetchInfoDessemination(fdt,tdt){
    var d = {fdt:fdt,tdt:tdt};
    $.ajax({
        url:BaseUrl()+'ajax/weather/GetInfoDessemination',
        async:true,
        data:d,
        method:'POST',
        success:function(data){
            
            if(IsJsonString(data)){
                var obj = JSON.parse(data);
                console.log(obj)
                var html = '<br><br><b style="line-height:1.6;font-size:1rem;">Information Dessemination via Infocast ('+DateDisplayFormat(fdt,tdt).toUpperCase()+')</b>';
                html += '<br><table border="1" style="line-height:1.6;border-collapse:collapse;">';
                $.each(obj,function(_i,e){
                    html += '<tr><td>'+e.type_advi+'</td><td>'+e.cnt+'</td></tr>';
                });
                html += '</table>';
                
                $('#displayDataHere').append(html);
                fetchFB(fdt,tdt)
            }else{
                console.log(data);
                if(data == 'NO_DATA'){
                    notif('No Data for Information Dessemination via Infocast.','error');
                }
            }
            //update data of the grid
        },
        error:function(_jqXHR,_textStatus,errorThrown ){
            console.log(errorThrown);
        },
        complete:function(_jqXHR,_textStatus){
            
        }
    });
}

function fetchFB(fdt,tdt){
    var d = {fdt:fdt,tdt:tdt};
    $.ajax({
        url:BaseUrl()+'ajax/weather/GetFB',
        async:true,
        data:d,
        method:'POST',
        success:function(data){
            
            if(IsJsonString(data)){
                var obj = JSON.parse(data);
                console.log(obj)
                var html = '<br><br><b style="line-height:1.6;font-size:1rem;">FACEBOOK</b>';
                html += '<br><b style="line-height:1.6;font-size:1rem;">Total PAGASA Advisories: </b>'+(parseInt(obj.tpost) + parseInt(obj.mpost));
                html += '<br><b style="line-height:1.6;font-size:1rem;">Total Posted Advisories: </b>'+obj.tpost;
                html += '<br><b style="line-height:1.6;font-size:1rem;">Total Missed Advisories: </b>'+obj.mpost;
                html += '<br><b style="line-height:1.6;font-size:1rem;">Staff Performacne: </b>'+obj.mpost;
                
                $('#displayDataHere').append(html);
                fetchFBPosted(fdt,tdt)
            }else{
                console.log(data);
                if(data == 'NO_DATA'){
                    notif('No Data for FB.','error');
                }
            }
            //update data of the grid
        },
        error:function(_jqXHR,_textStatus,errorThrown ){
            console.log(errorThrown);
        },
        complete:function(_jqXHR,_textStatus){
            
        }
    });
}

function fetchFBPosted(fdt,tdt){
    var d = {fdt:fdt,tdt:tdt};
    $.ajax({
        url:BaseUrl()+'ajax/weather/GetFBPosted',
        async:true,
        data:d,
        method:'POST',
        success:function(data){
            
            if(IsJsonString(data)){
                var obj = JSON.parse(data);
                console.log(obj)
                var html = '<br><br><b style="line-height:1.6;font-size:1rem;">Actual Advisories Posted</b>';
                html += '<br><table border="1" style="line-height:1.6;border-collapse:collapse;">';
                $.each(obj,function(_i,e){
                    html += '<tr><td>'+e.type_advi+'</td><td>'+e.cnt+'</td></tr>';
                });
                html += '</table>';
                
                $('#displayDataHere').append(html);
            }else{
                console.log(data);
                if(data == 'NO_DATA'){
                    notif('No Data for Actual Advisories Posted.','error');
                }
            }
            //update data of the grid
        },
        error:function(_jqXHR,_textStatus,errorThrown ){
            console.log(errorThrown);
        },
        complete:function(_jqXHR,_textStatus){
            
        }
    });
}

/**
 *Format date to be displayed and make it user readable.
 */
 function DateDisplayFormat(fdt,tdt){
	var r = '';
	if(fdt == tdt){
		r = moment(fdt, 'YYYY-MM-DD').format('MMMM D, YYYY');
	}else if(moment(fdt, 'YYYY-MM-DD').isSame(moment(fdt, 'YYYY-MM-DD').startOf('month')) && moment(tdt, 'YYYY-MM-DD').isSame(moment(tdt, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD'))){
		r = moment(fdt, 'YYYY-MM-DD').format('MMMM YYYY');
	}else if(moment(fdt).isSame(tdt, 'month') && moment(fdt).isSame(tdt, 'year')){
		r = moment(fdt, 'YYYY-MM-DD').format('MMMM D')+' - '+moment(tdt, 'YYYY-MM-DD').format('D, YYYY');
	}else if(moment(fdt).isSame(tdt, 'year')){
		r = moment(fdt, 'YYYY-MM-DD').format('MMMM D')+' - '+moment(tdt, 'YYYY-MM-DD').format('MMMM D, YYYY');
	}else if(moment(fdt, 'YYYY-MM-DD').isSame(moment(fdt, 'YYYY-MM-DD').startOf('month')) && moment(tdt, 'YYYY-MM-DD').isSame(moment(tdt, 'YYYY-MM-DD').endOf('month'))){
		r = moment(fdt, 'YYYY-MM-DD').format('MMMM YYYY');
	}else{
		r = moment(fdt, 'YYYY-MM-DD').format('MM/DD/YYYY')+' - '+moment(tdt, 'YYYY-MM-DD').format('MM/DD/YYYY')
	}
	return r;
}