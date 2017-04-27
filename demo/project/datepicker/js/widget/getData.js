define(function () {
function getMonthData (year,month) {
        var result=[];
        if( !year && !month){
            var today=new Date();
            year =today.getFullYear();
            month = today.getMonth()+1;
        }

        var firstDay =new Date(year,month-1,1),
            firstWeekDay = firstDay.getDay(); // 当月第一天 是 星期几
        if(firstWeekDay ===0){
            firstWeekDay =7;
        }
        year =firstDay.getFullYear();
        month =firstDay.getMonth() +1;

        var lastDayOfMonth =new Date(year,month-1,0),
            lastDateOfMonth = lastDayOfMonth.getDate();//上个月最后一天的 日期 是多少号;

        var prevMonthDayCount = firstWeekDay -1;//日历第一行 显示上月多少天

        var lastDay =new Date(year,month,0),
            lastDayOfDate =lastDay.getDate();// 当月 最后一天的 日期；

        for(var i =0;i<7*6;i++){
            var date =i +1 -prevMonthDayCount,
                showDate =date,
                thisMonth =month;
            if(date<=0){
                thisMonth=thisMonth-1;
                showDate =lastDateOfMonth + date;
            }else if(date>lastDayOfDate){
                thisMonth=month + 1;
                showDate =showDate - lastDayOfDate;
            }
            if(thisMonth===0)thisMonth=12;
            if(thisMonth===13)thisMonth=1;

            result.push({
                month:thisMonth,
                date:date,
                showDate:showDate
            });
        }

        return {
            year: year,
            month: month,
            lastDate: lastDayOfDate,
            ret: result
        }
    }

    return{
        DateData:getMonthData
    }
});
