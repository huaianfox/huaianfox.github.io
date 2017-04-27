define(function () {
    function Widget() {
        this.boundingBox=null;
    }
    Widget.prototype={
        on:function (type,handlers) {
            var obj =this.handlers;
            if(typeof obj[type] ==="undefined"){
                obj[type]=[];
            }
            obj[type].push(handlers);

            return this;
        },
        fire:function (type,data) {
            var obj =this.handlers;
            if(obj[type] instanceof Array){
                obj[type].forEach(function (item) {
                    item(data);
                });
                return this;
            }
        },
        renderUI:function (){},//渲染dom节点
        boundUI:function () {},//监听事件
        syncsUI:function () {},//初始化组件
        destructor:function (){},//组件销毁前的处理函数
        render:function (container) {
            var $wrap =$(container || document);
            this.renderUI();
            this.handlers={};
            this.bindUI();
            this.syncsUI();
            $wrap.append(this.boundingBox);
        },
        destroy:function () {
            this.destructor();
        }
    };
    return {
        Widget:Widget
    }
});
