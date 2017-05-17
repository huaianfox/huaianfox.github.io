define(function () {
   function Dialog(option) {
       this.config={
           width:"auto",
           height:"auto",
           type:"", //图标类型
           module:"1",//默认提示框1  简单提示框2
           title:"",
           message:"",//提示信息
           okBtn:null,//确定键执行的事件
           cancelBtn:null,//确定键执行的事件
           delay:null,
           hasMask:false,
           maskOpacity:null,
           effect:false,
           until:null
       };
       this.option=option;
       this.body=document.body;
       this.winBox=null;
       this.start();
   }
    Dialog.prototype={
       constructor:Dialog,
        start:function () {
            var _this=this,
                opt=Object.assign(this.config,this.option);
            this.createHtml();
            if(opt.delay){
                var delay=Math.abs(parseInt(opt.delay));
                setTimeout( function () {
                    _this.close();
                },delay)

            }
        },
        createHtml:function () {
           var _this =this,
               opt =this.config,
               html="";
            if(opt.hasMask){
                this.mask =this.createDom("dialog_mask");
                this.body.appendChild(this.mask);
            }
            if(opt.module==2){
                this.winBox=this.createDom("g_dialog_window");
                html="<div class='dialog_module_content_2'>" +
                    "<div class='dialog_icon_tips  "+opt.type+"'></div>" +
                    "<h3 class='dialog_sub_title'>"+opt.message+"</h3>" +
                    "</div>";
            }else{
                this.winBox=this.createDom("g_dialog_window_confirm");
                html="<div class='dialog_header'><h2 class='dialog_title'>"+opt.title+"</h2><a class='dialog_close dialog_icon_tips' title='关闭'></a></div>"+
                    "<div class='dialog_module_content_1'><div class='dialog_icon_tips'"+opt.type+"></div><h3 class='dialog_sub_title'>"+opt.message+"</h3></div>" +
                    "<div class='dialog_footer'><button class='dialog_btn dialog_btn_ok'>确定</button><button class='dialog_btn dialog_btn_cancel'>取消</button></div>";
            }
            opt.width&&(this.winBox.style.width=opt.width);
            opt.height&&(this.winBox.style.height=opt.height);
            this.winBox.innerHTML=html;
            this.body.appendChild(this.winBox);
            this.winBox.addEventListener("click",function (e) {
                var target = e.target||window.event.srcElement;
                if(target.classList.contains("dialog_close")){
                    _this.close();
                }
                if(target.classList.contains("dialog_btn_ok")){
                    opt.okBtn&&opt.okBtn();
                    _this.close();
                }else if(target.classList.contains("dialog_btn_cancel")){
                    _this.close();
                }
            });
        },
        createDom:function (cls,id) {
            var div =document.createElement("div");
            div.className =cls;
            id && (div.className +=id);
            return div;
        },
        close:function () {
            this.winBox&&this.body.removeChild(this.winBox);
            this.mask&&this.body.removeChild(this.mask);
        }
    };
    Dialog.init=function (option) {
        new Dialog(option)
    };
    return{
        Dialog:Dialog.init
    }
});