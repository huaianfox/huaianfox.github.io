define(function () {
    function Page(option) {
        this.config={
            total:0,//数据条数
            parent:null,
            on:null,//点击分页的事件
            step:4,//步长
            pageMin:10,//最少多少页使用默认样式
            pageNum:10//每页的条数

        };
        this.option=option;
        this.html="";
        this.init();
    }
    Page.prototype={
        constructor:Page,
        init:function () {
            var opt =Object.assign(this.config,this.option);
            this.renderUI();
            this.bindUI();
        },
        renderUI:function () {
            var opt =this.config,
                num =Math.ceil(opt.total/opt.pageNum),
                setp=opt.step;
            if(num<=1){
                return false;
            }else if(num<=opt.pageMin){
                opt.parent.innerHTML = this.html =this.createTempletTen(num);
            }else{
                opt.parent.innerHTML = this.html =this.createTemplet(1,num,setp);
            }
        },
        bindUI:function () {
            var _this =this,
                opt =this.config,
                on =opt.on,
                num =Math.ceil(opt.total/opt.pageNum);
            opt.parent.addEventListener("click",function (e) {
                var target =e.target||window.evenrt.srcElement,
                    page,
                    clickIndex,
                    currentIndex;
                currentIndex = +this.querySelector(".current").innerHTML;
                console.log(currentIndex);
                if(target.classList.contains("pageindex")){
                    clickIndex =+target.innerHTML;

                    page =this.querySelectorAll(".pageindex");
                    if(currentIndex==clickIndex){
                        return false;
                    }
                    if(num<=opt.pageMin){
                        _this.createTempletTen_bind(clickIndex,num);
                        on &&on(clickIndex);
                    }
                    if(num>opt.pageMin){
                        _this.showTemplet(clickIndex,num);
                        // switch (clickIndex) {
                        //     case 1:
                        //         this.innerHTML =_this.createTemplet(1,num,4);
                        //         on &&on(clickIndex);
                        //         break;
                        //     case 2:
                        //     case 3:
                        //     case 4:
                        //         this.innerHTML =_this.createTemplet_fl(clickIndex,num);
                        //         on && on(clickIndex);
                        //         break;
                        //     case num-1:
                        //     case num-2:
                        //     case num-3:
                        //         this.innerHTML =_this.createTemplet_fl(clickIndex-num,num);
                        //         on && on(clickIndex-num);
                        //         break;
                        //     case num:
                        //         this.innerHTML =_this.createTemplet(num,1,4);
                        //         on && on(num);
                        //         break;
                        //     default:
                        //         this.innerHTML =_this.createTempletDefault(clickIndex,num);
                        //         on && on(clickIndex);
                        // }
                    }
                }
                if(target.classList.contains("prev")){
                    _this.showTemplet(--currentIndex,num);

                }
                if(target.classList.contains("next")){
                    console.log(++currentIndex);
                    _this.showTemplet(++currentIndex,num);
                }
            });
        },
        showTemplet:function (index,total) {
            var _this =this,
                on =this.config.on,
                wrap =this.config.parent;
            switch (index) {
                case 1:
                    wrap.innerHTML =_this.createTemplet(1,total,4);
                    on &&on(index);
                    break;
                case 2:
                case 3:
                case 4:
                    wrap.innerHTML =_this.createTemplet_fl(index,total);
                    on && on(index);
                    break;
                case total-1:
                case total-2:
                case total-3:
                    wrap.innerHTML =_this.createTemplet_fl(index-total,total);
                    on && on(index-total);
                    break;
                case total:
                    wrap.innerHTML =_this.createTemplet(total,1,4);
                    on && on(index);
                    break;
                default:
                    wrap.innerHTML =_this.createTempletDefault(index,total);
                    on && on(index);
            }
        },
        createTempletDefault:function (num,last) {// 两头+中间   1.。。6789.。20
            var html="<a class='prev' href='javascript:;'>&lt;</a><a href='javascript:;' class='pageindex'>1</a>"
                +"<span>....</span>",
                i;
            for(i=num-2;i<num+3;i++){
                html +="<a href='javascript:;' class='pageindex "+(i==num?"current":"")+"'>"+i+"</a>";
            }
            html +="<span>....</span><a href='javascript:;' class='pageindex'>"+last+"</a><a class='next' href='javascript:;'>&gt;</a>";
            return html;
        },
        createTemplet_fl:function (num,last) { // 一头    1 2 3 4 5 6.。。20            1.。。19 20 21
            var html="<a class='prev' href='javascript:;'>&lt;</a>",
                i,
                j;
            if(num>0){
                for(i=1;i<num+3;i++){
                    html +="<a href='javascript:;' class='pageindex "+(i==num?"current":"")+"'>"+i+"</a>";
                }
                if(last){
                    html +="<span>....</span><a href='javascript:;' class='pageindex'>"+last+"</a><a class='next' href='javascript:;'>&gt;</a>"
                }
            }else{
                html +="<a href='javascript:;' class='pageindex'>1</a><span>....</span>";
                for(j=last+num-2;j<=last;j++){
                    html +="<a href='javascript:;' class='pageindex "+(j==last+num?"current":"")+"'>"+j+"</a>";
                }
            }
            return html;
        },
        createTemplet:function (first,last,step) {//默认 页数 大于10 的初始化数据
            var html="",
                i,
                j;
            if(first<last){
                for(i=first;i<last;i++){
                    html +="<a href='javascript:;' class='pageindex "+(i==first?"current":"")+"'>"+i+"</a>";
                    if(i>=step){
                        break;
                    }
                }
                if(last>step+1){
                    html +="<span>....</span><a href='javascript:;' class='pageindex'>"+last+"</a><a class='next' href='javascript:;'>&gt;</a>";
                }
            }else{
                for( j=first-step;j<=first;j++){
                    html +="<a href='javascript:;' class='pageindex "+(j==first?"current":"")+"'>"+j+"</a>";
                }
                if(last<step+1){
                    html ="<a class='prev' href='javascript:;'>&lt;</a><a href='javascript:;' class='pageindex'>1</a><span>....</span>" +html;
                }
            }
            return html;
        },
        createTempletTen:function (num) { //页数《=10   》=1
            var html="",
                i;
            for(i=1;i<=num;i++){
                html +="<a href='javascript:;' class='pageindex "+(i==1?"current":"")+"'>"+i+"</a>";
            }
            return html;
        },
        createTempletTen_bind:function (num,total) { //给页数少于10 绑定事件
            var html="",
                i;
            for(i=1;i<=total;i++){
                html +="<a href='javascript:;' class='pageindex "+(i==num?"current":"")+"'>"+i+"</a>";
            }
            return html;
        }
    };
    Page.start=function (option) {
        return new Page(option)
    };
    return {
        Page:Page.start
    }
});