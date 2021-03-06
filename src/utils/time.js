export function dateToStr(datetime){ 

    var year = datetime.getFullYear();
    var month = datetime.getMonth()+1;//js从0开始取 
    var date = datetime.getDate(); 
    var hour = datetime.getHours(); 
    var minutes = datetime.getMinutes(); 
    var second = datetime.getSeconds();
    
    if(month<10){
     month = "0" + month;
    }
    if(date<10){
     date = "0" + date;
    }
    if(hour <10){
     hour = "0" + hour;
    }
    if(minutes <10){
     minutes = "0" + minutes;
    }
    if(second <10){
     second = "0" + second ;
    }
    
    var time = year+"-"+month+"-"+date+" "+hour+":"+minutes+":"+second; //2009-06-12 17:18:05
   // alert(time);
    return time;
}
export function dateToYYMMDD(datetime){ 

    var year = datetime.getFullYear();
    var month = datetime.getMonth()+1;//js从0开始取 
    var date = datetime.getDate(); 
    
    if(month<10){
     month = "0" + month;
    }
    if(date<10){
     date = "0" + date;
    }
    
    var time = year+month+date; //20090612
   // alert(time);
    return time;
}