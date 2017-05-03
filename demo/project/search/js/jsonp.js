;(function () {
    "use strict";
    /*
    * @param url
    * @param data
    * @param dataType
    * @param callback
    * @param callType
    * @param success;
    * @param fail;
    * @param timeout;
    *
    * */


    var xhr=null;
    var Ajax=function (option) {
        this.config={
            url:"",
            type:"get",
            async:true,
            dataType:"json",
            data:{},
            contentType:"application/x-www-form-urlencoded; charset=UTF-8"
        };
        this.start(option);
    };
    Ajax.prototype={
        constructor:Ajax,
        createXHR:function () {
            if(window.XMLHttpRequest){
                return new XMLHttpRequest();
            }else if(window.ActiveXObject){
                return new ActiveXObject("MSXML2.XMLHTTP");
            }else{
                alert("你的浏览器太古老了，赶紧升级吧~~~~(>_<)~~~~");
            }
        },
        start:function (option) {
            var config=this.config;
            if(option.url){
                config.url=option.url;
            }else{
                throw new Error("url cannot be null");
            }
            if(option.type){
                config.type=option.type;
            }
            if(option.async){
                config.async=option.async;
            }
            if(option.dataType){
                config.dataType=option.dataType;
            }
            if(option.data){
                config.data=option.data
            }
            if(option.contentType){
                config.contentType=option.contentType
            }
            if(option.success){
                config.success=option.success;
            }
            if(option.fail){
                config.success=option.success;
            }
            if(config.dataType !="jsonp"){
                xhr=new this.createXHR();
            }

            if(config.dataType.toLowerCase()==="json"){//非跨域
                for(var item in config.data){
                    config.url = addURLParam(config.url,item,config.data[item]);
                }
                if(config.type.toLowerCase()==="get"){
                    console.log(config.url);
                    xhr.onreadystatechange=function () {
                        compete(xhr,config);
                    };
                    xhr.open(config.type,config.url,config.async);
                    xhr.send(null);
                }
                if(config.type.toLowerCase()==="post"){
                    xhr.onreadystatechange=compete(xhr,config);
                    // xhr.setRequestHeader("Content-Type",config.contentType);
                    xhr.send(new FormData(config.data));
                }

                /*
                * jsonp:
                * option
                * data----"q"?"wd"?"world"
                * ---> callType?+call
                *提交的数据格式多样化 细分
                * data 数据: 1. q=#content# 2.wd=#content# 3. word=#content#
                * callback 回调 1. cb=callback 2.callback =callback
                *
                * */

            }else if(config.dataType.toLowerCase()==="jsonp"){//跨域
                config.type="get";//强制get提交
                if(!option.url){
                    throw new Error("缺少数据，提交地址");
                }
                var cbName="myfunc"+Math.random(),
                    script=script=document.createElement("script");
                cbName =cbName.replace(".","");
                config.url =addURLParam(config.url,option.valueType,option.value);
                config.url =addURLParam(config.url,option.callType,cbName);
                console.log(cbName)
                script.src=config.url;
                console.log(script.src);
                document.body.appendChild(script);
                window[cbName]=function (response) {
                    if(!response){
                        return
                    }
                    script&&document.body.removeChild(script);
                    config.success&&config.success(response);
                    window[cbName]=null;
                    // setTimeout(function () {
                    //     window[cbName]=null;
                    // },3000)
                };
                if(option.timeout){
                    script.timer=setTimeout(function () {
                        script&&oHead.removeChild(script);
                        window[cbName]=null;
                        option.fail&&option.fail("亲，超时了~~~~(>_<)~~~~");
                    },option.timeout)
                }

            }
        }
    };

    function compete(xhr,option) {
        console.log(xhr.status);
        if(xhr.readyState==4){
            console.log(xhr.readyState);
            if(xhr.status >=200||xhr.status <=300|| xhr.status==304){
                option.success&&option.success(xhr.responseText);
            }else{
                option.fali&&option.fail(xhr.responseText);
            }
        }
    }
    // function serialize(data) {
    //     var val="",
    //         str="";
    //     for(var item in data){
    //         str =item+"="+data[item];
    //         val +=str+"&";
    //     }
    //     return val.slice(0);
    // }
    function addURLParam(url,name,value) {
        url +=(url.indexOf("?")==-1?"?":"&");
        url +=encodeURIComponent(name)+"="+encodeURIComponent(value);
        return url;
    }

window["myAjax"] =function (option) {
    new Ajax(option);
};


    // window.Jsonp =Jsonp;
})();