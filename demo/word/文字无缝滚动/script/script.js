(function (id) {
    function Scroll(id) {
        this.box =document.getElementById(id);
        this.speed=100;
        this.offset=2;
        this.init();
    }
    Scroll.prototype ={
        coconstructor:Scroll,
        init:function () {
            var _this=this;
            this.maxH =this.box.offsetHeight;
            this.container =this.box.getElementsByTagName("ul")[0];
            this.clone =this.container.cloneNode(true);
            this.box.appendChild(this.clone);
            this.timer =null;
            this.setInit();
            this.box.onmouseover=function () {
                clearInterval(_this.timer);
            };
            this.box.onmouseout =function () {
                _this.setInit();
            };
        },
        setInit:function () {
            var _this= this;
            this.timer =setInterval(function () {
                if(_this.box.scrollTop ==_this.clone.offsetHeight){
                    _this.box.scrollTop=0;
                }
                _this.box.scrollTop +=_this.offset;
            },this.speed)
        }
    };
    new Scroll("scroll");
})();