/**
 * Created by Skiier on 2017/3/5.
 */
(function ($) {

    $.fn.scroPic=function (options) {

        function Pic(element,options) {
            var defaults ={
                "imgbox":".scroll",//图片盒子
                "navCount":".con",//导航盒子
                "nextBtn":".next",//下一个
                "prevBtn":".prev", //上一个
                "on":"active", //导航标切换的类
                "auto":true, //是否自动播放
                "interval":3000, //图片轮换间隔
                "speed":500 //图片运动时间
            };
            this.boxContainer =element;
            this.settings =$.extend(true,{},defaults,options||{});
            this.init();
        }

        Pic.prototype ={
            init:function () {
                var me =this;
                me.scrollBox =this.boxContainer.find(this.settings.imgbox);
                me.navCount =this.boxContainer.find(this.settings.navCount);
                me.nextBtn =this.boxContainer.find(this.settings.nextBtn);
                me.prevBtn =this.boxContainer.find(this.settings.prevBtn);
                me.list =me.scrollBox.find("li");
                me.len =me.list.size();
                me.con =me.navCount.find("a");
                me.timer =null;
                me.index=0;

                me.nextBtn.click(function () {
                    me.autoPlay();
                });

                me.con.mouseover(function () {
                   var index =$(this).index();
                   me.Play(index);
                });

                me.prevBtn.click(function () {
                    if(me.index>0){
                        me.index--;
                    }else{
                        me.index=me.len-1;
                    }
                    me.Play(me.index);
                });
                if(me.settings.auto){
                    this.timer =setInterval(function () {
                        me.autoPlay();
                    },me.settings.interval);
                    me.boxContainer.hover(function () {
                        clearInterval(me.timer);
                    },function () {
                        me.timer =setInterval(function () {
                            me.autoPlay();
                        },me.settings.interval);
                    })
                }
            },
            autoPlay:function () {
                var me =this;
                this.index++;
                (this.index>=this.len)&&(this.index=0);
                this.Play(this.index);
            },
            Play:function (cur){
                this.con.eq(cur).addClass(this.settings.on).siblings().removeClass(this.settings.on);
                this.list.eq(cur).fadeIn(this.settings.speed).siblings().fadeOut(this.settings.speed);
                this.index =cur;
            }
        };
        return new Pic(this,options);
    };
})(jQuery);
