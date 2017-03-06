/**
 * Created by Skiier on 2017/3/1.
 */
window.onload=function () {
    var d1 =+new Date();
    var $={
        byId :function (id,parent) {
          return (parent||document).getElementById(id);
        },
        byTag:function (tag,obj) {
            return (obj||document).getElementsByTagName(tag);
        },
        getByClass:function (cls,parent) {
            if(document.getElementsByClassName){
                return (parent||document).getElementsByClassName(cls);
            }else{
                var elem =(parent||document).this.byTag("*"),
                    reg =new RegExp("(^|\s)"+cls+"($|\s)"),
                    arr=[];
                for(var i=0,len=elem.length;i<len;i++){
                    if(reg.test(elem[i].className)){
                        arr.push(elem[i]);
                    }
                }
                return arr;
            }
        }
    };
    function Fall(id) {
        this.fall =$.byId(id);
        this.init();
    }
    Fall.prototype = {
        init:function () {
            var _this =this;
            this.boxContainer =$.getByClass("box",this.fall);
            this.boxWidth=this.boxContainer[0].offsetWidth;
            this.num=Math.floor(document.documentElement.clientWidth / this.boxWidth);
            this.result=[];
            this.len=this.boxContainer.length;
            this.fall.style.width =this.boxWidth * this.num+"px";

            for(var i=0;i<this.len;i++){
                if(i<this.num){
                    this.result[i]=this.boxContainer[i].offsetHeight;
                }else{
                    var minHeight =Math.min.apply(null,this.result);
                    var index =this.getIndex(this.result,minHeight);
                    this.boxContainer[i].style.position='absolute';
                    this.boxContainer[i].style.top=minHeight+this.boxContainer[index].offsetTop+"px";
                    this.boxContainer[i].style.left=this.boxContainer[index].offsetLeft+"px";
                    this.result[index] +=this.boxContainer[i].offsetHeight;
                }
            }
            window.onscroll =function () {
                _this.scrollFall(5)
            };
        },
        onloadFall:function () {
          var last =this.boxContainer[this.len-1];
          var lastH =last.offsetTop+Math.floor(last.offsetHeight/2),
              st =document.documentElement.scrollTop||document.body.scrollTop ,
              ch =document.documentElement.clientHeight ||document.body.clientHeight;
          return (lastH < st + ch) ? true : false;
        },
        scrollFall:function (count) { //一次加载的数量
            var html="";
            if(this.onloadFall()){
                var len =21,arr=[];
                for(var i=0;i<count;i++){
                    var index =Math.floor(Math.random()*21+1); //随机数重复，待优化
                    len++;
                    (len>len+count)&&(len=21);
                    html +="<div class=\"box\"><img src=\"images\/"+index+".jpg\" alt=\"图片\"><\/div>";
                }
            }
            this.fall.innerHTML +=html;
            this.init();
        },
        getIndex:function (array,min) {
            for( var h in array){
                if(array[h] ==min){
                    return h;
                }
            }
        }
    };
    new Fall("wrap");
    var d2 =+new Date();
    console.log(d2-d1);
};

