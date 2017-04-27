define(["jquery", "widget/widget", "widget/getData"], function ($, widget, getData) {
    function Datepicker() {
        this.data = {
            year: null,
            month: null,
            input:null
        };
        this.monthData=null;
    }

    Datepicker.prototype = $.extend({}, new widget.Widget(), {
        renderUI: function () {
            var opt =this.data;

            this.monthData = getData.DateData(opt.year,opt.month);

            var monthData=this.monthData;

            var html =
                '<div class="ui-datepicker-header">'
                + '<a href="#" class="ui-datapicker-btn ui-datapicker-year-prev">&lt;&lt;</a>'
                + '<a href="#" class="ui-datapicker-btn ui-datapicker-month-prev">&lt;</a>'
                + '<a href="#" class="ui-datapicker-btn ui-datapicker-year-next">&gt;&gt;</a>'
                + '<a href="#" class="ui-datapicker-btn ui-datapicker-month-next">&gt;</a>'
                + '<span class="ui-datapicker-current-month">' +
                monthData.year + '-' + monthData.month +
                '</span></div>'
                + '<div class="ui-datapicker-body">'
                + '<table><thead><tr>'
                + '<th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr></thead><tbody>';

            for (var i = 0; i < monthData.ret.length; i++) {
                var date = monthData.ret[i];
                if (i % 7 === 0) {
                    html += "<tr>";
                }
                html += '<td data-date="' + date.date + '">' + date.showDate + '</td>';
                if (i % 7 === 6) {
                    html += "</tr>";
                }
            }

            html += '</tbody></table></div>';

            if(!this.boundingBox){
                this.boundingBox =$("<div class='ui-datapicker-wrapper'></div>");
            }
            this.boundingBox.html(html);
        },
        bindUI:function () {
            var self =this,
                $wrapper =this.boundingBox,
                opt =this.data,
                monthData=this.monthData,
                today=new Date();
                tds=$wrapper.find(".ui-datapicker-body td");

            $wrapper.delegate(".ui-datapicker-body td","click",function () {
                tds.each(function () {
                    var $this = $(this);
                    $this.removeClass("date-checked");
                });
                var $this = $(this);
                $this.toggleClass("date-checked");
                var getdate =$this.attr("data-date");
                console.log(getdate);
                var date = new Date(monthData.year,monthData.month-1,getdate);
                opt.input.val(showData(date));
                $wrapper.removeClass("ui-datapicker-wrapper-show");
            }).delegate(".ui-datepicker-header .ui-datapicker-btn","click",function () {
                var $this =$(this),
                    year,
                    month;
                if(monthData){
                    year =monthData.year;
                    month =monthData.month;
                }

                if($this.hasClass("ui-datapicker-month-prev")){
                    month--;
                }
                if($this.hasClass("ui-datapicker-year-prev")){
                    year--;
                }
                if($this.hasClass("ui-datapicker-month-next")){
                    month++;
                }
                if($this.hasClass("ui-datapicker-year-next")){
                    year++;
                }
                $wrapper.remove();
                opt.year=year;
                opt.month=month;
                self.render();
                $wrapper.appendTo(document.body);
            });

            opt.input.val(showData(today));
            opt.input.off("click").click(function () {
                var $this =$(this),
                    top=$this.offset().top,
                    left=$this.offset().left,
                    height=$this.outerHeight();
                $wrapper.toggleClass("ui-datapicker-wrapper-show");
                $wrapper.css({top:top+height+5,left:left});
                $wrapper.appendTo(document.body);
            });

            function showData(date) {
                var ret="",
                    padding=function (num) {
                        if(num<=9){
                            num = "0" + num;
                        }
                        return num;
                    };
                ret +=padding(date.getFullYear())+"-";
                ret +=padding(date.getMonth()+1)+"-";
                ret +=padding(date.getDate());
                return ret;
            }
        },
        syncsUI:function () {
            var self =this,
                $wrapper=this.boundingBox,
                monthData=this.monthData,
                today=new Date(),
                tds=$wrapper.find(".ui-datapicker-body td");

            if(today.getFullYear() ===monthData.year&&today.getMonth() ===monthData.month-1){
                tds.each(function (index,dom) {
                    var d =$(dom);
                    if(d.html()==today.getDate()){
                        d.addClass("today");
                    }
                });
            }

            tds.each(function (index,dom) {
                var date =$(dom);
                if(date.attr("data-date")<=0 || date.attr("data-date")>self.monthData.lastDate){
                    date.addClass("pre-month");
                }
            });


        },
        datepicker:function (opt) {
            $.extend(this.data,opt);
            new widget.Widget();
            this.render();
            return this;
        }
    });

    return {
        Datepicker:Datepicker
    }
});