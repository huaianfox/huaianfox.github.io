require.config({
   paths:{
       store:"libs/store"
   }
});
requirejs(["store","libs/jsonp","module/createHtml","module/player","module/dialog","module/pageIndex","module/scrollBar"],function (Store,GJ,CH,PE,DG,PG,SB) {

    var myAjax =GJ.getJson, //jsonp数据
        chtml =CH.CreateHtml, //Dom生成
        player=PE.player,  //播放器
        dialog =DG.Dialog,
        Page =PG.Page,//分页
        scrollBar =SB.scrollBar;//分页

    var forEach =Array.prototype.forEach,
        searchDataArray=[], //临时存储，搜索刷新数据清零
        music_temporary=Store.get("musicList")||[], //缓存歌单
        video =$("#video"),
        search_close =$("#search_close"),// 搜索显示按钮
        mask =$("#mask"),               //   遮罩
        search_pannel =$("#search_pannel"),//搜索面板
        text =$("#search_text_input"),  //搜搜框
        search_btn =$("#search_text_btn"),//搜索提交按钮
        page_nav =$("#page_nav"),//分页父元素
        search_songs =$("#search_songs_list"),//搜索的零时歌曲
        audio_src = "http://ws.stream.qqmusic.qq.com/{id}.m4a?fromtag=46",//音频地址模板 {id}歌id曲
        data_url = "https://c.y.qq.com/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.center&searchid=46238140479099576&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&n=10&{valueType}={key}&{jsonpCallback}={cb}&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0",//歌曲相关信息
        img_src="http://imgcache.qq.com/music/photo/mid_album_300/{2}/{1}/{0}.jpg",//图片地址模板 {0}:album.mid  {1}:album.mid最后第一位 {2}:album.mid最后第二位
        lrc_src="http://music.qq.com/miniportal/static/lyric/{1}/{0}.xml",//歌词地址模板  {0}:歌曲id {1}:歌曲id%100 取余 680279
        search_href='https://y.qq.com/n/yqq/song/{key}.html',//歌曲,歌手，专辑 href地址模板  key 分别为 1:.mid  2:.singer[0].mid 3:.album.mid
        // yql = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent("select * from xml where url='{site}'") + "&format=xml&callback=?",//第三方 请求xml

        player_songlist_toolbar =$("#player_songlist_toolbar"), //歌曲管理按钮
        player_normal =$("#player_normal"), //正常模式
        player_only =$("#player_only"), //纯净模式
        only_style_lyric =$("#only_style_lyric"), //纯净模式 歌词盒子

        player_songs =$("#player_edit_list"), //歌曲管理模板
        song_list_checkbox_all =$(".song_list_checkbox"), //总checkbox
        song_album_pic =$("#song_album_pic"), //专辑图片
        song_info_name =$("#song_info_name"), //专辑图片
        song_info_singer =$("#song_info_singer"), //专辑图片
        song_info_album =$("#song_info_album"), //专辑图片
        lyric_scroll =$("#lyric_scroll"), //正常模式歌词盒子

        play_btn=$("#playBtn"), //播放暂停
        play_loop=$("#playLoop"), //循环
        prev_btn=$("#prevBtn"), //上一首
        next_btn=$("#nextBtn"), //下一首
        play_voice=$("#play_voice"), //下一首
        onlyBtn=$("#onlyBtn"), //纯净模式
        my_audio=$("#my_audio"),//音频
        j_bgImg=$("#j_bgImg"),//背景
        player_progress_all=$("#player_progress_all"),//整个进度条长度
        player_progress_play=$("#player_progress_play"),//进度条
        player_progress_current=$("#player_progress_current"),//进度条 当前时间控制点
        show_time=$("#show_time"),//显示当前时间
        sim_song_info=$("#sim_song_info"),//歌曲 进度条上方 简要 信息
        music_voice_all=$("#music_voice_all"),// 整个音量 box
        voice_progress_bar=$("#voice_progress_bar"),//音量 进度
        voice_progress_current=$("#voice_progress_current"),//当前音量控制点

        song_list_number =$(".song_list_number"),//当前音乐跳动

        player_default={
            ready:false,//是否准备就绪,立即播放
            songList:null,//歌曲数组
            audio:my_audio,
            playBtn:play_btn,
            prevBtn:prev_btn,
            nextBtn:next_btn,
            loopBtn:play_loop,
            onlyBtn:onlyBtn,
            onlyLyric:only_style_lyric,
            voiceBtn:play_voice,
            playType:0,//播放模式 0：默认循环 1：顺序 2：随机 3：单曲
            currentIndex:0,// 当前歌曲 默认为0
            progress_all:player_progress_all, //整个控制条
            progress_play:player_progress_play, //进度条
            progress_current:player_progress_current, //当前进度条 控制点
            showTime:show_time,
            simSongInfo:sim_song_info,//歌曲附属信息
            songInfo:{ //歌曲相关信息
                name:song_info_name,
                singer:song_info_singer,
                album:song_info_album,
                albumPic:song_album_pic,
                lyricScroll:lyric_scroll
            },
            voiceControls:{
                voice_all:music_voice_all,// 整个音量box
                voice_paly:voice_progress_bar,// 音量进度
                voice_current:voice_progress_current// 当前控制点音量
            },
            playStyle:{
                normal:player_normal,
                only:player_only
            },
            editPannel:player_songs,//编辑面板
            bg:j_bgImg
        },

        oldVal="",//零时存储验证搜索关键词,分页关键词
        pageTotal=0;//零时存储查询结果，返回的数目


    search_close.onclick=function () {
        mask.style.display="block";
        if(search_pannel.classList.contains("search_show")){
            search_pannel.classList.remove("search_show");
        }else{
            search_pannel.classList.add("search_show");
        }
    };
    mask.onclick =function () {
        mask.style.display="none";
        search_pannel.classList.remove("search_show");
    };

    // var lrc="https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?callback={cb}&pcachetime={time}&{valueType}={key}&g_tk=5381&{jsonpCallback}={cb}&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0";  此歌词地址无效


    search_btn.addEventListener("click",function () {  // 提交 搜索 数据
        var val =text.value;
        if(!val){
            return
        }
        if(oldVal===val){
            return
        }
        oldVal=val;
        myAjax({
            url:data_url,
            valueType:"w",
            value:val,
            callType:"jsonpCallback",
            dataType:"jsonp",
            type:"get",
            success:function (res) {
                keyword=
                createHtml(res);
                createPage(res);
            }
        });

    },false);

    search_songs.addEventListener("click",function (e) { //搜索面板
        var target =e.target;
        console.log(music_temporary);
        if(target.classList.contains("icon_list_menu_play")){ //立即播放添加到临时歌单
            bind_btn_event(target,"icon_list_menu_play",this,function (item,index) { // 两种情况， 1.已经存在在歌单中 2.没有
                var isPlay=refresh_data(music_temporary,searchDataArray[index]);
                if(typeof isPlay=="number"){//已经存在歌单中
                    rePlayer({
                        ready:true,
                        waving:song_list_number,
                        songList: music_temporary,
                        currentIndex:isPlay
                    });
                }else { //当前歌单没有
                    rePlayer({
                        ready:true,
                        waving:song_list_number,
                        songList: music_temporary
                    });
                }
                dialog({
                    width:"300px",
                    height:"auto",
                    type:"dialog_icon_tips_warn", //图标类型
                    module:"2",//简单提示框 2
                    message:"已经加入播放器",//提示信息
                    delay:2000
                })
            });
        }else if(target.classList.contains("icon_list_menu_add")){ //添加到 播放列表 我的歌单
            console.log("add 1");
            bind_btn_event(target,"icon_list_menu_add",this,function (item,index) {
                console.log("add 2");
                if(my_audio.paused){
                    refresh_data(music_temporary,searchDataArray[index]);
                    rePlayer({
                        songList: music_temporary
                    });
                }else{//正在播放
                     var playIndex =getPlayIndex(music_temporary,my_audio),//当前播放索引
                         addIndex=refresh_data(music_temporary,searchDataArray[index]);
                    if(typeof addIndex =="number"){ //已经存在于歌单
                        rePlayer({
                            songList: music_temporary,
                            currentIndex:playIndex
                        });
                    }else{//歌单里没有
                        rePlayer({
                            songList: music_temporary,
                            currentIndex:playIndex+1
                        });
                    }
                }
                dialog({
                    width:"300px",
                    height:"auto",
                    type:"dialog_icon_tips_warn", //图标类型
                    module:"2",//简单提示框 2
                    message:"已经加入播放器",//提示信息
                    delay:2000
                });

            });
        }
    },false);


    player_songs.addEventListener("click",function (e) { // 歌曲管理面板
        var target =e.target;

        if(target.classList.contains("song_list_checkbox")){
            if(target.checked){
                console.log(target.checked+"我是1");
                target.parentNode.classList.add("song_has_checked");
            }else{
                console.log(target.checked+"我是2");
                target.parentNode.classList.remove("song_has_checked");
            }
        }
        if(target.classList.contains("icon_list_menu_play")){  //播放
            bind_btn_event(target,"icon_list_menu_play",this,function (item,index) {
                if(!my_audio.paused&&my_audio.currentSrc ==music_temporary[index].src){
                    my_audio.pause();
                    play_btn.style.backgroundPosition="0 -170px";
                    music_current();
                    music_wave();
                    console.log("正在播放，我是当前播放的歌曲，点我暂停");
                }else{
                    rePlayer({
                        ready:true,
                        songList: music_temporary,
                        currentIndex:index
                    });
                    item.style.backgroundPosition="-80 -200px";
                    console.log("点我开始新歌");
                }
            });
        }


        if(target.classList.contains("icon_list_menu_add")){ // 添加
            bind_btn_event(target,"icon_list_menu_add",this,function (item,index) {
                dialog({
                    width:"300px",
                    height:"auto",
                    type:"dialog_icon_tips_warn", //图标类型
                    module:"2",//简单提示框 2
                    message:"功能未开发",//提示信息
                    delay:1000
                });
            });
        }


        if(target.classList.contains("icon_list_menu_download")){ // 下载
            bind_btn_event(target,"icon_list_menu_download",this,function (item,index) {
                dialog({
                    width:"300px",
                    height:"auto",
                    type:"dialog_icon_tips_warn", //图标类型
                    module:"2",//简单提示框 2
                    message:"暂不提供下载",//提示信息
                    delay:1000
                });
            });
        }

        if(target.classList.contains("icon_list_menu_delete")){ // 删除
            bind_btn_event(target,"icon_list_menu_delete",this,function (item,index) {
                var playIndex;//播放索引
                if(!my_audio.paused){//当前正在播放歌曲
                    playIndex =getPlayIndex(music_temporary,my_audio);
                    if(playIndex ==index){//删除当前播放歌曲
                        console.log("hi 我正在播放 你删除我么");
                        music_temporary.splice(index,1);

                        if(music_temporary.length){
                            rePlayer({
                                ready:true,
                                songList: music_temporary,
                                currentIndex:playIndex-1>=0?playIndex-1:0
                            });
                        }
                    }else{//删除非当前歌曲
                        music_temporary.splice(index,1);
                        rePlayer({
                            songList: music_temporary,
                            currentIndex:playIndex>index?playIndex-1:playIndex
                        });
                    }
                }else{ //当前没有播放歌曲 ,是否播放地址
                    music_temporary.splice(index,1);
                    playIndex =getPlayIndex(music_temporary,my_audio);//当前音频地址是否在播放队列中
                    if(typeof playIndex=="number"){
                        rePlayer({
                            songList: music_temporary,
                            currentIndex:playIndex
                        });
                    }else{
                        rePlayer({
                            ready:true,
                            songList: music_temporary,
                            currentIndex:index<=music_temporary.length-1?index:0
                        });
                    }
                }
            })
        }
    },false);


    player_songlist_toolbar.addEventListener("click",function (e) {
        var target =e.target||wind.event.srcEvent,
            isCheckArray =isChecked();
        if(!isCheckArray.length){
            if(target.classList.contains("song_toolbar_add")||target.classList.contains("song_toolbar_delete")||target.classList.contains("song_toolbar_download")||target.classList.contains("song_toolbar_collect")){ //添加
                dialog({
                    width:"300px",
                    height:"auto",
                    type:"dialog_icon_tips_warn", //图标类型
                    module:"2",//简单提示框 2
                    message:"请选择操作的单曲",//提示信息
                    delay:1000
                })
            }
        }else{
            if(target.classList.contains("song_toolbar_delete")){
                dialog({
                    width:"520",
                    height:"auto",
                    title:"QQ音乐",
                    type:"dialog_icon_tips_note", //图标类型
                    module:"1",// confirm 确认提示框2
                    message:"确定要删除歌曲？",//提示信息
                    hasMask:true,
                    okBtn:function () {//处理 两张情况  删除歌曲中 --->1.有当前播放歌曲 2.当前播放歌曲
                        var oldPlayIndex =getPlayIndex(music_temporary,my_audio);
                        isCheckArray.forEach(function (item) { // isCheckArray-->[0,3]
                            music_temporary.splice(item,1);
                        });
                        if(!music_temporary.length){ //是否清空播放列表
                            my_audio.src="";
                            rePlayer({  //更新数据 当前歌曲序号 i
                                songList: music_temporary
                            });
                        }else{
                            var playIndex =getPlayIndex(music_temporary,my_audio); //用于确定 是否含有删除当前歌曲的索引 ，有是数字，没有undefined
                            if(my_audio.paused){//以后优化
                                rePlayer({  //更新数据 当前歌曲序号 i
                                    songList: music_temporary
                                });

                            }else{ //正在播放
                                if(typeof playIndex=="number"){//当前歌曲没有被删除
                                    console.log("当前歌曲没有被删除");
                                    rePlayer({  //更新数据 当前歌曲序号 i
                                        songList: music_temporary,
                                        currentIndex:playIndex
                                    });
                                }else{//当前歌曲被删除
                                    console.log("当前歌曲被删除");
                                    rePlayer({
                                        ready:true,
                                        songList: music_temporary,
                                        currentIndex:oldPlayIndex<music_temporary.length-1?oldPlayIndex:0//算法待优化
                                    });
                                }
                            }
                        }
                        song_list_checkbox_all.checked=false;
                        song_list_checkbox_all.parentNode.className ="song_edit_check";
                    }
                });
            }
            if(target.classList.contains("song_toolbar_collect")){ //收藏
                dialog({
                    width:"520",
                    height:"auto",
                    title:"QQ音乐",
                    type:"dialog_icon_tips_note", //图标类型
                    module:"1",// confirm 确认提示框2
                    message:"功能待开发",//提示信息
                    hasMask:true,
                    okBtn:function () {//处理 两张情况  删除歌曲中 --->1.有当前播放歌曲 2.当前播放歌曲
                    }
                });
            }
            if(target.classList.contains("song_toolbar_add")){ //添加
                dialog({
                    width:"520",
                    height:"auto",
                    title:"QQ音乐",
                    type:"dialog_icon_tips_note", //图标类型
                    module:"1",// confirm 确认提示框2
                    message:"功能待开发",//提示信息
                    hasMask:true,
                    okBtn:function () {//处理 两张情况  删除歌曲中 --->1.有当前播放歌曲 2.当前播放歌曲
                    }
                });
            }

            if(target.classList.contains("song_toolbar_download")){ //下载
                dialog({
                    width:"520",
                    height:"auto",
                    title:"QQ音乐",
                    type:"dialog_icon_tips_note", //图标类型
                    module:"1",// confirm 确认提示框2
                    message:"暂不提供下载！",//提示信息
                    hasMask:true,
                    okBtn:function () {
                    }
                });
            }
        }
        if(target.classList.contains("song_toolbar_clear")){ //清空列表
            if(music_temporary.length){
                dialog({
                    width:"520",
                    height:"auto",
                    title:"QQ音乐",
                    type:"dialog_icon_tips_note", //图标类型
                    module:"1",// confirm 确认提示框2
                    message:"确定要清空列表？",//提示信息
                    hasMask:true,
                    okBtn:function () {
                        music_temporary=[];
                        rePlayer({  //更新数据 当前歌曲序号 i
                            songList: music_temporary
                        });
                        song_list_checkbox_all.checked=false;
                        song_list_checkbox_all.parentNode.className ="song_edit_check";
                    }
                });
            }
        }
    });


    function refresh_data(array,data) {//刷新数据
        var hasData =array.some(function (item) {
            return item.src==data.src;
        });
        if(hasData){
            for(var i=0;i<array.length;i++){
                if(array[i].src==data.src){
                    return i;
                }
            }
        }else{
            array.unshift(data);
        }
    }

    function rePlayer(option) { //更新播放器 数据 通过数据变化监听歌单的高度变化
        var obj={};
        Object.assign(obj,obj,player_default,option);
        player(obj);
        scrollBar({
            content:".scroll_viewport",
            scrollBox:"#scroll_box",
            scrollBar:".srcoll_bar"
        });
    }

    function bind_btn_event(target,cls,self,fn) { // 绑定 按钮事件
        var btns =$$("."+cls,self);
            forEach.call(btns,function(item,index,array){
                if(item==target){
                    fn&&fn(item,index,array);
                }
            });
    }

    function getPlayIndex(array,audio) { //获取当前音频在播放队列中的索引
        for(var i=0;i<array.length;i++) {
            if (array[i].src == audio.currentSrc) {
                return i
            }
        }
    }

    song_list_checkbox_all.onclick=function () {
        var player_songlist_check ;//所有选项
        try{
            player_songlist_check =$$(".song_list_checkbox",player_songs);
        }catch(ex){
        }
        if(player_songlist_check.length){
            if(this.checked){
                this.parentNode.className +=" song_has_checked";
                forEach.call(player_songlist_check,function (item) {
                    item.checked=true;
                    item.parentNode.className +=" song_has_checked";
                });
            }else{
                forEach.call(player_songlist_check,function (item) {
                    item.checked=false;
                    item.parentNode.className ="song_edit_check"
                });
                this.parentNode.className +="song_edit_check";
            }
        }
    };




    function isChecked() {  //获取cheeckbox选中的元素
        var player_songlist_check ,
            i,
            array=[];
        try{
            player_songlist_check =$$(".song_list_checkbox",player_songs);
        }catch(ex){
        }
        if(player_songlist_check.length){
            for(i=0;i<player_songlist_check.length;i++){
                if(player_songlist_check[i].checked){
                    array.push(i);
                }
            }
            if(array.length){
                return array
            }else{
                return false;
            }
        }
        return false;
    }


    function $(str,dom) { // 唯一节点
        var d=dom||document;
        return typeof str=="string"? d.querySelector(str):str;
    }
    function $$(str,dom) { //节点列表
        var d=dom||document;
        return typeof str=="string"? d.querySelectorAll(str):str;
    }

    function createHtml(res) { //处理搜索数据 并生成临时歌曲DOM
        var songArray=res.data.song.list;
        searchDataArray=[];
        songArray.forEach(function (item,index) {
            var data ={};
            var album_mid=item.album.mid;
            data.song=item.name;
            data.id=item.id;
            // getLrc(data.id,data);
            data.singer=item.singer[0].name;
            data.album=item.album.name;
            data.src=audio_src.replace("{id}",item.id);
            data.img=img_src.replace("{2}",album_mid.charAt(album_mid.length-2)).replace("{1}",album_mid.charAt(album_mid.length-1)).replace("{0}",album_mid);
            data.song_href=search_href.replace("{key}",item.mid);
            data.singer_href=search_href.replace("{key}",item.singer[0].mid);
            data.album_href=search_href.replace("{key}",album_mid);
            data.mid=item.mid;
            data.time =parseInt(item.interval/60)+":"+item.interval%60;
            searchDataArray.push(data);
        });
        chtml({
            type:"search",
            data:searchDataArray,
            pNode:search_songs
        });
    }

    function createPage(res) {
        var pageTotal =res.data.song.totalnum;
        Page({
            total:pageTotal,
            parent:page_nav,
            on:function (index) {
                var url =data_url.replace("p=1","p="+index);
                console.log(index);
                myAjax({
                    url:url,
                    valueType:"w",
                    value:oldVal,
                    callType:"jsonpCallback",
                    dataType:"jsonp",
                    type:"get",
                    success:function (data) {
                        createHtml(data);
                    }
                });
            }
        });
    }

    rePlayer({
        songList:music_temporary
    });

    //以下 冗余代码 待优化
    function music_wave(cur) {  //处理 音乐 跳动
        var nodelist =document.querySelectorAll(".song_list_number");
        console.log(nodelist);
        forEach.call(nodelist,function (item) {
                item.classList.remove("wave");
        });
        typeof cur=="number"&&nodelist[cur].classList.add("wave");
    }
    function music_current(cur) {  //处理 音乐管理菜单项 开始？暂停
        var nodelist =document.querySelectorAll(".icon_list_menu_play");
        console.log(nodelist);
        forEach.call(nodelist,function (item) {
            item.classList.remove("icon_list_menu_play_current");
        });
        typeof cur=="number"&&nodelist[cur].classList.add("icon_list_menu_play_current");
    }


});