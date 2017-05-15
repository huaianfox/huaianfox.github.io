define(function () {
    "use strict";
    var xhr=null;
    var Ajax=function (option) {
        this.config={
            url:"",
            type:"get",
            async:true,
            dataType:"json",
            data:{},
            contentType:"application/x-www-form-urlencoded; charset=UTF-8",
            cors:false
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
            if(option.cors){
                config.cors=option.cors;
            }
            if(config.dataType.toLowerCase()==="json"){//非跨域
                xhr =new this.createXHR();
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
                    xhr.onreadystatechange=function () {
                        compete(xhr,config)
                    };
                    // xhr.setRequestHeader("Content-Type",config.contentType);
                    xhr.send(new FormData(config.data));
                }
            }else if(config.dataType.toLowerCase()==="xml"){
                xhr =new this.createXHR();
                xhr.onreadystatechange=function () {
                    compete(xhr,config)
                };
                xhr.open("GET",config.url,true);
                xhr.send(null);
            }else if(config.dataType.toLowerCase()==="jsonp"){//jsonp跨域
                config.type="get";//强制get提交
                if(!option.url){
                    throw new Error("缺少数据，提交地址");
                }
                var cbName="myfunc"+Math.random(),
                    script=document.createElement("script");
                cbName =cbName.replace(".","");
                var val =encodeURIComponent(option.value);

                config.url =config.url.replace("{valueType}",option.valueType).replace("{key}",val)
                    .replace("{jsonpCallback}",option.callType)
                    .replace("{cb}",cbName);
                script.src=config.url;
                console.log(script.src);
                document.body.appendChild(script);
                window[cbName]=function (response) {
                    if(!response){
                        return
                    }
                    console.log(response);
                    script&&document.body.removeChild(script);
                    config.success&&config.success(response);
                    window[cbName]=null;
                };
                if(option.timeout){
                    script.timer=setTimeout(function () {
                        script&&oHead.removeChild(script);
                        window[cbName]=null;
                        option.fail&&option.fail("亲，超时了~~~~(>_<)~~~~");
                    },option.timeout)
                }

            }else if(config.cors){
                xhr =createCORSRequest("get",config.url);
                if(xhr){
                    xhr.onload=function () {
                        console.log(xhr.responseText);
                    };
                    xhr.send(null);
                }
            }
        }
    };

    function compete(xhr,option) {
        if(xhr.readyState==4){
            if(xhr.status >=200||xhr.status <=300|| xhr.status==304){
                if(option.dataType.toLowerCase()=="xml"){
                    option.success&&option.success(xhr.responseXML);
                }else{
                    option.success&&option.success(xhr.responseText);
                }
            }else{
                option.fali&&option.fail(xhr.responseText);
            }
        }
    }

    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // 针对Chrome/Safari/Firefox.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // 针对IE
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // 不支持CORS
            xhr = null;
        }
        return xhr;
    }
    function addURLParam(url,name,value) {
        url +=(url.indexOf("?")==-1?"?":"&");
        url +=encodeURIComponent(name)+"="+encodeURIComponent(value);
        return url;
    }
    var ajax=function (option) {
      return new Ajax(option);
    };
    return{
        getJson:ajax
    }
});