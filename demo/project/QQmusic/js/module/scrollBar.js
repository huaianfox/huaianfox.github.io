define(function () {
    function ScrollBar(option) {
        this.config={
            content:"",
            scrollBox:"",
            scrollBar:""
        };
        Object.assign(this.config,option||{});
        this.init();
    }
    ScrollBar.prototype = {
        constructor:ScrollBar,
        init:function () {
            var  store = require("store"),
                config =this.config,
                util=this.util,
                songlist =store.get("musicList");
            this.step=0;
            this.content =util.$(config.content);
            this.scrollBox =util.$(config.scrollBox);
            this.scrollBar =util.$(config.scrollBar);
            if(songlist.length){
                this.renderUI();
            }else{
                this.scrollBar.style.height="0px";
            }
        },
        renderUI:function () {
            var _this = this,
                contentHeight =this.content.offsetHeight,
                scrollBoxHeight =this.scrollBox.offsetHeight;
            if(contentHeight>scrollBoxHeight){
                this.scrollBar.style.height =parseInt((scrollBoxHeight/contentHeight)*scrollBoxHeight)+"px";
                this.bindUI();
                this.dragBar(this.scrollBar);
            }else{
                this.scrollBar.style.height ="0px";
            }
        },
        bindUI:function () {
            var _this = this;
            this.util.wheel(this.content,function (num) {
                if(num>0){
                    _this.step -= 50;
                }else{
                    _this.step += 50;
                }
                _this.scroll();
            })
        },
        scroll:function () {
          var _this = this,
              step =this.step,
              contentHeight =this.content.offsetHeight,
              scrollBoxHeight =this.scrollBox.offsetHeight,
              scrollBarHeight =this.scrollBar.offsetHeight,
              maxStep =scrollBoxHeight - scrollBarHeight,
              contentTop=0;
            step<0&&(step=0);
            step>maxStep&&(step=maxStep);
            this.scrollBar.style.top =step+"px";
            contentTop=Math.ceil(step*(contentHeight-scrollBoxHeight)/maxStep);
            this.content.style.top =-(contentTop+1)+"px"; //+1 border
        },
        dragBar:function (el) {
            var _this = this,
                startY = 0,
                endY= 0,
                isDrag=false,
                doc =document,
                on=this.util.on,
                off=this.util.off,
                drag={
                    down:function (e) {
                        startY =e.clientY -el.offsetTop;
                        isDrag=true;
                        on(doc,"mousemove",drag.move);
                        on(doc,"mouseup",drag.up);
                        return false;
                    },
                    move:function (e) {
                        if(isDrag){
                            _this.step =e.clientY - startY;
                            _this.scroll();
                        }
                    },
                    up:function () {
                        isDrag=false;
                        off(doc,"mousemove",drag.move);
                        off(doc,"mouseup",drag.up);
                    }
                };
            on(el,"mousedown",drag.down);

        },
        util:{
            $:function (id) {
                return document.querySelector(id)
            },
            on:function (el,type,handler) {
                el.addEventListener?el.addEventListener(type,handler,false):attachEvent(type,handler);
            },
            off:function (el,type,handler) {
                el.removeEventListener?el.addEventListener(type,handler,false):detachEvent(type,handler);
            },
            wheel:function (el,fn) {
                var _this =this;
                this.on(el,"mousewheel",function (e) {
                    var delta =_this.getWheelDelta(e);
                    fn(delta);
                });
                this.on(el,"DOMMouseScroll",function (e) {
                    var delta =_this.getWheelDelta(e);
                    fn(delta);
                });
            },
            getWheelDelta: function (event) {
                if (event.wheelDelta) {
                    return  event.wheelDelta;
                } else {
                    return -event.detail * 40;
                }
            }
        }
    };
    ScrollBar.start = function (opt) {
      return new ScrollBar(opt);
    };
    return {
        scrollBar:ScrollBar.start
    }
});