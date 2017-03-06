/*
* 三个版本
*
*
*
* */
window.onload =function(){
    var $ ={
        byId:function (id) {
            return document.getElementById(id);
        },
        byClass:function (cls,obj) {
            if(document.getElementsByClassName){
                return (obj ||document).getElementsByClassName(cls);
            }else{
                var ele =(obj||document).getElementsByTagName("*");
                var len =ele.length,
                    reg=new RegExp("(\\s|^)"+cls+"(\\s|$)"),
                    arr=[];
                for(var i=0;i<len;i++){
                    if(reg.test(ele[i].className)){
                        arr.push(ele[i]);
                    }
                }
                return arr;
            }
        },
        addHandler:function (ele,type,fn) {
            if(ele.addEventListener){
                ele.addEventListener(type,fn,false);
            }else if(ele.attachEvent){
                ele.attachEvent("on"+type,fn);
            }else{
                ele["on"+type]=fn;
            }
        }
        ,
        getTarget:function (e) {
            if(e.target){
                return e.target;
            }else{
                return e.srcElement;
            }
        }
        ,
        cancel:function (e) {
            if(e.preventDefault){
                e.preventDefault();
            }else {
                e.returnValue =false;
            }
        },
        getCss:function (obj,attr) {
            if(obj.currentStyle){
                return obj.currentStyle[attr];
            }else{
                return getComputedStyle(obj,null)[attr];
            }
        },
        create:function (tag,pa) {
            var ele =document.createElement(tag);
            return (pa||document.body).appendChild(ele);
        }
    };
    //获取相关dom元素
    var box=$.byClass("box"),
        menu =$.byId("menu"),
        info=$.byId("text"),
        tips =$.create("div");
    var list =menu.getElementsByTagName("a");
    //动态生成小提示
    tips.innerHTML="<p>不要点我哦</p><p>点美女</p>";
    tips.className ="tips";
    var image =$.create("img",tips),
        len =box.length;
    image.src="huaji.jpg";
    image.title="good boy";//瞎写

    //设置box引用及常量
    var currentBox=null,
        maxScale=3, //最大比例
        minScale =0.45, //最小比例
        itop =0.5, //增大比例
        ibottom=0.15, //缩小比例
        wid=[533,900,600],
        posX=(document.documentElement.scrollLeft||document.body.scrollLeft),
        posY=(document.documentElement.scrollTop||document.body.scrollTop);
    for(var i=0;i<len;i++){
        box[i].context =["默认","放大","缩小","原图"];
        box[i].scale =1;
        box[i].defaultSize =parseFloat($.getCss(box[i],"width"),2);
        box[i].index =i;
        $.addHandler(box[i],"contextmenu",function (e) {
            e =e ||window.event;
            currentBox=this;
            var pageX =e.clientX+document.body.scrollLeft,
                pageY =e.clientY+document.body.scrollTop;
            console.log(pageX,pageY);
            show(menu,pageX,pageY);
            console.log(this.context);
            for(var i=0,len=list.length;i<len;i++){//动态重新初始化菜单项的内容，及时更新
                list[i].innerHTML =this.context[i];
            }
            return false;
        })
    }
    $.addHandler(menu,"click",function (e) {
        e =e||window.event;
        var target =$.getTarget(e);
        switch(target.className){
            case "default":
                setDefault(currentBox);
                break;
            case "bigger":
                setBigger(currentBox);
                break;
            case "smaller":
                setSamller(currentBox);
                break;
            case "onself":
                setOne(currentBox);
                break;
        }
    });
    //右键默认设置
    $.addHandler(document,"contextmenu",function (e) {
        e =e ||window.event;
        $.cancel(e);
        var target =$.getTarget(e);
        if(target===(document.documentElement||document.body)){
            var x =tips.offsetWidth,
                bx =document.documentElement.clientWidth ||document.body.clientWidth;
            var pageX =e.clientX +posX,
                pageY =e.clientY +posY;
            pageX = x+pageX > bx?bx-x:pageX; //限制tips超出
            show(tips,pageX,pageY);
            show(menu);
        }else{
            show(tips);
        }
        return false;
    });
    $.addHandler(info,"contextmenu",function (e) {
        show(menu);
    });
    $.addHandler(document,"click",function (e) {
        show(menu);
    });

    //   具体菜单操作函数
    function setDefault(obj) {
        obj.style.width = obj.defaultSize +"px";
    }
    function setBigger(obj){
        obj.scale +=itop;
        if(obj.scale>=maxScale){
            obj.scale =maxScale;
            obj.context[1] ="已达最大";
        }
        obj.context[2] ="缩小";
        changScale(obj,obj.scale);
    }
    function setSamller(obj){
        obj.scale -=ibottom;
        if(obj.scale<=minScale){
            obj.scale =minScale;
            obj.context[2] ="已达最小";
        }
        obj.context[1] ="放大";
        changScale(obj,obj.scale);
    }
    function setOne(obj){
        console.log(obj);
        obj.style.width =wid[obj.index]+"px";
    }
    function changScale(obj,n) {
        obj.style.width =parseInt(obj.defaultSize)*n+"px";
    }
    //显示菜单,三个参数显示，一个参数隐藏
    function show(obj,x,y) {
        if(typeof x=="number" && typeof y=="number"){
            obj.style.display="block";
            obj.style.left=x +"px";
            obj.style.top= y +"px";
        }else{
            obj.removeAttribute("style");
        }
    }
   $.addHandler(document,"beforeunload",function (e) {
       e =e ||window.event;
       var message ="hello ,朋友确定关闭么？";
       e.returnValue =message;
       return message;
   });

};

/*
* 面向对象
* function Scale() {
 this.container = '.box';
 this.contextMenu = '.menu';
 this.maxScale = 1.5;
 this.minScale = 0.8;
 this.currentPic = null;

 this.init();
 }

 Scale.prototype = {
 init: function () {

 //获取必要的DOM元素
 this.DOMContainer = document.getElementsByClassName(this.container.substring(1));//box
 this.DOMContextMenu = document.getElementById(this.contextMenu.substring(1));//右键菜单
 this.DOMMenuText = this.DOMContextMenu.getElementsByTagName('a');//菜单中的a标签

 this.initEvent();
 },

 initEvent: function () {
 var _this = this;

 [].forEach.call(this.DOMContainer, function (item) {
 var obj = item;
 obj.contextMenuArray = ['默认', '放大', '缩小', '原图'];
 obj.currentScale = 1;
 obj.defaultSize = getComputedStyle(obj, false)['width'];

 obj.addEventListener('contextmenu', function (e) {
 e.preventDefault();
 _this.currentPic = obj;
 var pageX = e.clientX + document.body.scrollLeft,
 pageY = e.clientY + document.body.scrollTop;
 _this.showMenu(obj.contextMenuArray, pageX, pageY);
 console.log(_this.currentPic.currentScale);

 });


 });
 this.DOMMenuText[0].addEventListener('click', function () {
 _this.currentPic.currentScale = 1;
 _this.currentPic.contextMenuArray = ['默认', '放大', '缩小', '原图'];
 _this.changeImg(_this.currentPic, 1);
 });

 this.DOMMenuText[1].addEventListener('click', function () {
 _this.bigger(_this.currentPic);
 });

 this.DOMMenuText[2].addEventListener('click', function () {
 _this.smaller(_this.currentPic);
 });

 },

 showMenu: function (arr, x, y) {
 var _this = this;

 this.DOMContextMenu.style.left = x + 'px';
 this.DOMContextMenu.style.top = y + 'px';

 for (var i = 0; i < this.DOMMenuText.length; i++) {
 this.DOMMenuText[i].innerHTML = arr[i];
 }

 document.body.addEventListener('click', function () {
 _this.DOMContextMenu.removeAttribute('style');
 });
 },

 bigger: function (obj) {
 obj.currentScale += 0.1;
 console.log(obj.currentScale);
 if (obj.currentScale >= this.maxScale) {
 obj.currentScale = this.maxScale;
 obj.contextMenuArray[1] = '已到最大';
 }
 this.changeImg(obj, obj.currentScale);
 },

 smaller: function (obj) {
 obj.currentScale -= 0.1;
 if (obj.currentScale <= this.minScale) {
 obj.currentScale = this.minScale;
 obj.contextMenuArray[2] = '已到最小';
 }
 this.changeImg(obj, obj.currentScale)
 },

 changeImg: function (obj, i) {
 obj.style.width = parseFloat(obj.defaultSize) * i + 'px';
 }
 };

 new Scale();
*
*
*
* */
//第二版代码，删删改改，大量无益的代码
// (function () {
//     var $ ={
//         byId:function (id) {
//             return document.getElementById(id);
//         },
//         byClass:function (cls,obj) {
//             if(document.getElementsByClassName){
//                 return (obj ||document).getElementsByClassName(cls);
//             }else{
//                 var ele =(obj||document).getElementsByTagName("*");
//                 var len =ele.length,
//                     reg=new RegExp("(\\s|^)"+cls+"(\\s|$)"),
//                     arr=[];
//                 for(var i=0;i<len;i++){
//                     if(reg.test(ele[i].className)){
//                         arr.push(ele[i]);
//                     }
//                 }
//                 return arr;
//             }
//         },
//         getEvent:function (e) {
//             if(e.target){
//                 return e.target;
//             }else{
//                 return e.srcElement;
//             }
//         }
//         ,
//         cancel:function (e) {
//             if(e.preventDefault){
//                 e.preventDefault();
//             }else {
//                 e.returnValue =false;
//             }
//         },
//         create:function (tag,pa) {
//             var ele =document.createElement(tag);
//             return (pa||document.body).appendChild(ele);
//         }
//     };
//     var box=$.byClass("box");
//     var menu =$.byId("menu");
//     var info=$.byId("text");
//     var oA=menu.getElementsByTagName("a");
//     var len=oA.length;
//     var tips =$.create("div");
//     var padd=8,
//         wid=[533,900,600];
//     tips.innerHTML="<p>不要点我哦</p><p>点美女</p>";
//     tips.className ="tips";
//     var image =$.create("img",tips);
//     image.src="huaji.jpg";
//     for(var j=0,r=box.length;j<r;j++){
//         box[j].count =j;
//         console.log(box[j]);
//         box[j].style.padding=padd+"px";
//         onmenu(box[j]);
//     }
//     function onmenu(obj) {
//         var arr=["默认","放大","缩小","原图"],
//             index=0,
//             max=5,
//             min=-5,
//             scaleMax=1.2,
//             scaleMin=0.83;
//         obj.style.padding=padd+"px";
//         obj.oncontextmenu=function (e) {
//             e= e ||window.event;
//             init(menu,e);//菜单初始化
//             tips.style.display ="none";//清除提示
//             var target =$.getEvent(e);
//             var parent =target.parentNode,
//                 w = target.offsetWidth;
//             console.log(index);
//             console.log(target);
//             for(var i=0;i<len;i++) {
//                 oA[i].go = i;
//                 oA[i].onclick = function (e) {
//                     console.log(e.currentTarget);
//                     e = e || window.event;
//                     $.cancel(e);
//                     console.log(e.target);
//                     switch (this.go) { //根据点击的菜单项索引，执行对应的代码
//                         case 0:
//                             console.log(index);
//                             target.style.width = parent.style.width = "300px";
//                             parent.style.padding = "10px";
//                             oA[this.go+ 1].innerHTML = arr[this.go + 1];
//                             oA[this.go + 2].innerHTML = arr[this.go + 2];
//                             index = 0;
//                             break;
//                         case 1:
//                             (index <= min) && (index = min);
//                             console.log(index);
//                             console.log(target);
//                             index++;
//                             if (index >=max) {
//                                 oA[this.go].innerHTML = "已达最大";
//                                 index=max;
//                             } else {
//                                 change(target, "width", scaleMax);
//                                 parent.style.padding = padd * scaleMax + "px";
//                                 oA[this.go + 1].innerHTML = arr[this.go + 1];
//                             }
//                             break;
//                         case 2:
//                             (index >= max) && (index = max);
//                             console.log(index);
//                             index--;
//                             if (index <min) {
//                                 oA[this.go].innerHTML = "已达最小";
//                                 index=min;
//                             } else {
//                                 change(target, "width", scaleMin);
//                                 parent.style.padding = padd * scaleMin + "px";
//                                 oA[this.go - 1].innerHTML = arr[this.go - 1];
//                             }
//                             break;
//                         case 3:
//                             console.log(index);
//                             var x = target.getAttribute("data-width") || wid[target.parentNode.count];
//                             target.style.width = parent.style.width = x + "px";
//                             parent.style.padding = "10px";
//                             oA[this.go - 2].innerHTML = arr[this.go - 2];
//                             oA[this.go - 1].innerHTML = arr[this.go - 1];
//                             index = max;
//                             break;
//                     }
//                 };
//             }
//             return false;
//         };
//     }
//     function init(obj,e,pos) { //初始化菜单位置
//         var pageX =e.pageX,
//             pageY=e.pageY;
//         if(pageX ===undefined){ //修复ie8及以下不能识别pageX,pageY.
//             pageX =e.clientX+(document.documentElement.scrollLeft || document.body.scrollLeft);
//         }
//         if(pageY ===undefined){
//             pageY =e.clientY+(document.documentElement.scrollTop || document.body.scrollTop);
//         }
//         pos =pos||0;
//         obj.style.display ="block";
//         obj.style.left =pageX-pos+"px";
//         obj.style.top =pageY+"px";
//     }
//     function change(obj,attr,scale) { //切换大小
//         var num =obj.offsetWidth;
//         var parent =obj.parentNode;
//         obj.style[attr]=num*scale+"px";
//         parent.style[attr]=num*scale+"px";
//     }
//     document.oncontextmenu=function (e) {
//         e =window.event||e;
//         var target =$.getEvent(e);
//         if(target==document.documentElement){
//             var w =tips.offsetWidth;
//             init(tips,e,w/2);//待优化,超出BUG
//             tips.style.display ="block";
//             menu.style.display ="none";
//         }else{
//             tips.style.display ="none";
//         }
//         return false;
//     };
//     info.oncontextmenu =function () {
//         menu.style.display ="none";
//     };
//     console.log(info);
//     document.onclick=function () {
//         menu.style.display="none";
//         tips.style.display="none";
//     };
// })();



//第一版代码，原先只写了操作一张图片的代码，小bug不断，勉强运行，后来又加了两张图片，有了下面的提到的大bug
//以下为原始代码，修复index引起的bug，即所有box对同一个index值操作，进行了一些代码优化调整，
//        (function () {
//            var menu =document.getElementById("menu");
//            var oA=menu.getElementsByTagName("a");
//            var box=document.getElementsByClassName("box");
//            var len=oA.length,
//                arr=["默认","放大","缩小","原图"],
//                index=0,
//                padd=8;
//            for(var j=0,r=box.length;j<r;j++){
//                box[j].style.padding=padd+"px";
//                document.oncontextmenu=function (e) {
//                    e= e ||window.event;
//                    menu.style.display ="block";
//                    menu.style.left =e.pageX+"px";
//                    menu.style.top =e.pageY+"px";
//                    var target =e.target||e.srcElement;
//                    var parent =target.parentNode;
//                    for(var i=0;i<len;i++){
//                        oA[i].index=i;
//                        oA[i].onclick=function (e) {
//                            e =e ||window.event;
//                            if(e.preventDefault){
//                                e.preventDefault();
//                            }else{
//                                e.returnValue=false;
//                            }
//                            var w =target.offsetWidth;
//                            if(target !==document.body){ //判断事件目标不是文档
//                                  switch (this.index){
//                                    case 0:
//                                        target.style.width=parent.style.width="300px";
//                                        parent.style.padding="10 px";
//                                        oA[this.index+1].innerHTML=arr[this.index+1];
//                                        oA[this.index+2].innerHTML=arr[this.index+2];
//                                        index=0;
//                                        break;
//                                    case 1:
//                                        (index<=-5)&&(index=-5);
//                                        index++;
//                                        console.log(index);
//                                        if(index<=5){
//                                            change(target,"width",1.2);
//                                            parent.style.padding=padd*1.2+"px";
//                                            oA[this.index+1].innerHTML=arr[this.index+1];
//                                        }else{
//                                            oA[this.index].innerHTML ="已达最大";
//                                        }
//                                        break;
//                                    case 2:
//                                        (index>=5)&&(index=5);
//                                        index--;
//                                        console.log(index);
//                                        if(index>-5){
//                                            change(target,"width",0.8);
//                                            parent.style.padding=padd*0.8+"px";
//                                            oA[this.index-1].innerHTML=arr[this.index-1];
//                                        }else{
//                                            oA[this.index].innerHTML ="已达最小";
//                                        }
//                                        break;
//                                    case 3:
//                                        var x=target.getAttribute("data-width")||533;
//                                        target.style.width=parent.style.width=x+"px";
//                                        parent.style.padding="10 px";
//                                        oA[this.index-2].innerHTML=arr[this.index-2];
//                                        oA[this.index-1].innerHTML=arr[this.index-1];
//                                        index=3;
//                                        break;
//                                }
//                            }
//                        }
//                    }
//
//                    return false;
//                };
//            }
//            function change(obj,attr,scale) {
//                var num =obj.offsetWidth;
//                var parent =obj.parentNode;
//                    obj.style[attr]=num*scale+"px";
//                    parent.style[attr]=num*scale+"px";
//            }
//            document.onclick=function () {
//                menu.style.display="none";
//            }
//        })()