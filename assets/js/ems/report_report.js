const editName = {'Northeast monsoon':'Amihan (Northeast Monsoon)',LPA:'Low Pressure Area (LPA)','Localized thunderstorm':'Localized "Thunderstorm"'};

$(function(){
    var navbar_height = $('#navbar').innerHeight();
    var html_height = $('html').innerHeight();
    var htmH = $(window).innerHeight();
    /*************************************************************************************************************/
	//initialize splitter
	/*************************************************************************************************************/
    $("#vhsplit").jqxSplitter({width: '100%', height: '100%',orientation:'horizontal',panels:[{ size: 50,collapsible:false }],showSplitBar:false,theme:'metro'});
    $("#jqxpanel").jqxPanel({ width: '100%', height: '100%',theme:'metro',autoUpdate: true});

    $('#btnFilter').click(function(){
        var fdt = $('#fdt').val(),
        tdt = $('#tdt').val();        
        if(fdt == '' || tdt == ''){
            notif('Please input date.','error');
        }else{
            // fdt = moment(fdt).format('YYYY-MM-DD HH:mm:ss');
            // tdt = moment(tdt).format('YYYY-MM-DD HH:mm:ss');
            // if(!moment(fdt,'YYYY-MM-DD').isBefore(moment(tdt, 'YYYY-MM-DD')) && fdt != tdt){
            //     notif('Invalid Date Range','error');
            // }else{
                fetchDispatchedToDepart(fdt,tdt);
            // }
        }
    });
});


function fetchDispatchedToDepart(fdt,tdt){
    var d = {fdt:fdt,tdt:tdt};
    $.ajax({
        url:BaseUrl()+'ajax/ems/getDispatchedToDepart',
        async:true,
        data:d,
        method:'POST',
        success:function(data){
            
            if(IsJsonString(data)){
                var obj = JSON.parse(data);
                console.log(obj);

                var html = '<br><div style="line-height:1.6;font-size:1rem;"><b>DISPATCHED TO DEPART</b></div><table border="1" width="450" style="border-collapse:collapse;">';
				
                $.each(obj,function(i,e){
                    html += '<tr style="line-height:1.6;"><td style="font-weight: bold;"># OF EMERGENCY RESPONDED</td> <td style="text-align: right; padding-right: 20px;">'+e.total_cnt+'</td></tr>';

                    html += '<tr style="line-height:1.6;"><td>TOTAL INVALID COUNT: (time response >= 15mins)</td> <td style="text-align: right; padding-right: 20px;">(-) '+e.invalid_cnt+'</td></tr>';
                    html += '<tr style="line-height:1.6;"><td>TOTAL INVALID COUNT: (NULL/Time Not Reported)</td> <td style="text-align: right; padding-right: 20px;">(-) '+e.null_cnt+'</td></tr>';
                    html += '<tr style="line-height:1.6;"><td>TOTAL INVALID COUNT: (NEGATIVE VALUE)</td> <td style="text-align: right; padding-right: 20px;">(-) '+e.negative_cnt+'</td></tr>';
                    html += '<tr style="line-height:1.6;"><td>TOTAL INVALID COUNT: (Medical Transport)</td> <td style="text-align: right; padding-right: 20px;">(-) '+e.medical_transport_cnt+'</td></tr>';

                    html += '<tr style="line-height:1.6;"><td>TOTAL VALID COUNT</td> <td style="text-align: right; padding-right: 20px;">'+e.total_valid_cnt+'</td></tr>';
                    html += '<tr style="line-height:1.6;"><td>TOTAL RESPONSE TIME (seconds)</td> <td style="text-align: right; padding-right: 20px;">'+e.sum_response_time+'</td></tr>';
                    html += '<tr style="line-height:1.6;"><td>AVERAGE RESPONSE TIME (minutes)</td> <td style="text-align: right; padding-right: 20px;">'+(parseFloat(e.average_response_time)/60).toFixed(4)+'</td></tr>';
                });

                html += '</table>';
                $('#displayDataHere').html(html);

                fetchDispatchedToArrived(fdt,tdt);
            }else{
                console.log(data);
                if(data == 'NO_DATA'){
                    notif('No Data for EMS System.','error');
                }
            }
        },
        error:function(jqXHR,textStatus,errorThrown ){
            console.log(errorThrown);
        },
        complete:function(jqXHR,textStatus){
        }
    });
}

function fetchDispatchedToArrived(fdt,tdt){
    var d = {fdt:fdt,tdt:tdt};
    $.ajax({
        url:BaseUrl()+'ajax/ems/getDispatchedToArrived',
        async:true,
        data:d,
        method:'POST',
        success:function(data){
            
            if(IsJsonString(data)){
                var obj = JSON.parse(data);
                console.log(obj);

                var html = '<br><div style="line-height:1.6;font-size:1rem;"><b>DISPATCHED TO ARRIVED SCENE</b></div><table border="1" width="450" style="border-collapse:collapse;">';

                $.each(obj,function(i,e){
                    html += '<tr style="line-height:1.6;"><td style="font-weight: bold;"># OF EMERGENCY RESPONDED</td> <td style="text-align: right; padding-right: 20px;">'+e.total_cnt+'</td></tr>';

                    html += '<tr style="line-height:1.6;"><td>TOTAL INVALID COUNT: (NULL/Time Not Reported)</td> <td style="text-align: right; padding-right: 20px;">(-) '+e.null_cnt+'</td></tr>';
                    html += '<tr style="line-height:1.6;"><td>TOTAL INVALID COUNT: (NEGATIVE VALUE)</td> <td style="text-align: right; padding-right: 20px;">(-) '+e.negative_cnt+'</td></tr>';
                    html += '<tr style="line-height:1.6;"><td>TOTAL INVALID COUNT: (Medical Transport)</td> <td style="text-align: right; padding-right: 20px;">(-) '+e.medical_transport_cnt+'</td></tr>';
                    
                    html += '<tr style="line-height:1.6;"><td>TOTAL VALID COUNT</td> <td style="text-align: right; padding-right: 20px;">'+e.total_valid_cnt+'</td></tr>';
                    html += '<tr style="line-height:1.6;"><td>TOTAL RESPONSE TIME (seconds)</td> <td style="text-align: right; padding-right: 20px;">'+e.sum_response_time+'</td></tr>';
                    html += '<tr style="line-height:1.6;"><td>AVERAGE RESPONSE TIME (minutes)</td> <td style="text-align: right; padding-right: 20px;">'+(parseFloat(e.average_response_time)/60).toFixed(4)+'</td></tr>';
                });

                html += '</table>';
                $('#displayDataHere').append(html);

                fetchDispatchedToAccomplished(fdt,tdt);
            }else{
                console.log(data);
                if(data == 'NO_DATA'){
                    notif('No Data for EMS System.','error');
                }
            }
        },
        error:function(jqXHR,textStatus,errorThrown ){
            console.log(errorThrown);
        },
        complete:function(jqXHR,textStatus){
        }
    });
}

function fetchDispatchedToAccomplished(fdt,tdt){
    var d = {fdt:fdt,tdt:tdt};
    $.ajax({
        url:BaseUrl()+'ajax/ems/getDispatchedToAccomplished',
        async:true,
        data:d,
        method:'POST',
        success:function(data){
            
            if(IsJsonString(data)){
                var obj = JSON.parse(data);
                console.log(obj);

                var html = '<br><div style="line-height:1.6;font-size:1rem;"><b>DISPATCHED TO ACCOMPLISHED</b></div><table border="1" width="450" style="border-collapse:collapse;">';

                $.each(obj,function(i,e){
                    html += '<tr style="line-height:1.6;"><td style="font-weight: bold;"># OF EMERGENCY RESPONDED</td> <td style="text-align: right; padding-right: 20px;">'+e.total_cnt+'</td></tr>';
                    
                    html += '<tr style="line-height:1.6;"><td>TOTAL INVALID COUNT: (NULL/Time Not Reported)</td> <td style="text-align: right; padding-right: 20px;">(-) '+e.null_cnt+'</td></tr>';
                    html += '<tr style="line-height:1.6;"><td>TOTAL INVALID COUNT: (NEGATIVE VALUE)</td> <td style="text-align: right; padding-right: 20px;">(-) '+e.negative_cnt+'</td></tr>';
                    
                    html += '<tr style="line-height:1.6;"><td>TOTAL VALID COUNT</td> <td style="text-align: right; padding-right: 20px;">'+e.total_valid_cnt+'</td></tr>';
                    html += '<tr style="line-height:1.6;"><td>TOTAL RESPONSE TIME (seconds)</td> <td style="text-align: right; padding-right: 20px;">'+e.sum_response_time+'</td></tr>';
                    html += '<tr style="line-height:1.6;"><td>AVERAGE RESPONSE TIME (minutes)</td> <td style="text-align: right; padding-right: 20px;">'+(parseFloat(e.average_response_time)/60).toFixed(4)+'</td></tr>';
                });

                html += '</table>';
                $('#displayDataHere').append(html);

                fetchTimeCallToDispatched(fdt,tdt);
            }else{
                console.log(data);
                if(data == 'NO_DATA'){
                    notif('No Data for EMS System.','error');
                }
            }
        },
        error:function(jqXHR,textStatus,errorThrown ){
            console.log(errorThrown);
        },
        complete:function(jqXHR,textStatus){
        }
    });
}

function fetchTimeCallToDispatched(fdt,tdt){
    var d = {fdt:fdt,tdt:tdt};
    $.ajax({
        url:BaseUrl()+'ajax/ems/getTimeCallToDispatched',
        async:true,
        data:d,
        method:'POST',
        success:function(data){
            
            if(IsJsonString(data)){
                var obj = JSON.parse(data);
                console.log(obj);

                var html = '<br><div style="line-height:1.6;font-size:1rem;"><b>TIME CALL TO DISPATCHED</b></div><table border="1" width="450" style="border-collapse:collapse;">';

                $.each(obj,function(i,e){
                    html += '<tr style="line-height:1.6;"><td style="font-weight: bold;"># OF EMERGENCY RESPONDED</td> <td style="text-align: right; padding-right: 20px;">'+e.total_cnt+'</td></tr>';
                    
                    html += '<tr style="line-height:1.6;"><td>TOTAL INVALID COUNT: (NULL/Time Not Reported)</td> <td style="text-align: right; padding-right: 20px;">(-) '+e.null_cnt+'</td></tr>';
                    html += '<tr style="line-height:1.6;"><td>TOTAL INVALID COUNT: (NEGATIVE VALUE)</td> <td style="text-align: right; padding-right: 20px;">(-) '+e.negative_cnt+'</td></tr>';
                    
                    html += '<tr style="line-height:1.6;"><td>TOTAL VALID COUNT</td> <td style="text-align: right; padding-right: 20px;">'+e.total_valid_cnt+'</td></tr>';
                    html += '<tr style="line-height:1.6;"><td>TOTAL RESPONSE TIME (seconds)</td> <td style="text-align: right; padding-right: 20px;">'+e.sum_response_time+'</td></tr>';
                    html += '<tr style="line-height:1.6;"><td>AVERAGE RESPONSE TIME (minutes)</td> <td style="text-align: right; padding-right: 20px;">'+(parseFloat(e.average_response_time)/60).toFixed(4)+'</td></tr>';
                });

                html += '</table>';
                $('#displayDataHere').append(html);
            }else{
                console.log(data);
                if(data == 'NO_DATA'){
                    notif('No Data for EMS System.','error');
                }
            }
        },
        error:function(jqXHR,textStatus,errorThrown ){
            console.log(errorThrown);
        },
        complete:function(jqXHR,textStatus){
        }
    });
}