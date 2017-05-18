define(["store","module/createHtml","libs/jsonp"],function (Store,CH,AJ) {
    function Player(option) {
        this.config={
            ready:false,//是否准备就绪
            songList:[],
            audio:null,
            playBtn:null,
            prevBtn:null,
            nextBtn:null,
            currentIndex:0, //播放的歌曲索引 及歌曲所在数组的索引 默认0
            loopBtn:null,
            onlyBtn:null,
            onlyLyric:null,//纯净模式 歌词盒子
            voiceBtn:null,
            progress_all:null,//整个进度条
            progress_play:null,//进度条
            progress_current:null,//进度条 当前时间控制点
            showTime:null,//当前时间
            simSongInfo:null,//歌曲附属信息
            songInfo:{ //歌曲相关信息的元素
                name:null,
                singer:null,
                album:null,
                albumPic:null,
                lyricScroll:null
            },
            voiceControls:{ //音量控制
                voice_all:null,//整个音量box
                voice_paly:null,// 音量进度
                voice_current:null// 当前控制点音量
            },
            playStyle:{
                normal:null,
                only:null
            },
            bg:null
        };
        this.option=option;
        this.loopType=0;//播放模式 0：列表循环 1：顺序 2：随机 3：单曲
        this.runTimer=null;
        this._start();
    }
    Player.prototype ={
        constructor:Player,
        _start:function () {
            var opt=this.config = Object.assign(this.config,this.option),
                chtml=CH.CreateHtml;
            Store.set("musicList",opt.songList);
            chtml({
                type:"player",
                data:Store.get("musicList"),
                pNode:opt.editPannel
            });
            this._playBtnEvent();
            if(opt.songList.length){//歌曲有数据
                opt.ready&&this._ready(opt.currentIndex);
                !opt.audio.paused&&this.syncsUI(opt.currentIndex);//处理 删除非当前歌曲时 的当前播放歌曲的样式
            }else{//歌曲没有数据
                !opt.audio.paused&&opt.audio.pause();
                this._resetPlayer();
                return false;
            }
        },
        _ready:function (index) {//准备就绪,立即播放
            var _this=this,
                opt= this.config,
                playBtn=opt.playBtn,
                songList=opt.songList,
                audio=opt.audio,
                simSongInfo=opt.simSongInfo,
                songInfo=opt.songInfo;
            // this.isScroll=true;
            audio.src=songList[index].src;
            playBtn.style.backgroundPosition="0 -100px";
            opt.bg.style.backgroundImage="url("+songList[index].img+")";
            document.title ="正在播放..."+songList[index].song +" - " +songList[index].singer;
            simSongInfo.innerHTML =songList[index].song +" - " +songList[index].singer;
            songInfo.albumPic.src=songList[index].img;
            songInfo.name.innerHTML ="歌曲名 ： "+songList[index].song;
            songInfo.singer.innerHTML ="歌手名 ： "+songList[index].singer;
            songInfo.album.innerHTML ="专辑名 ： "+songList[index].album;
            console.log(index);
            this.syncsUI(index);
            this.getLyric(index);
            this._goRuning(index);
        },
        _resetPlayer:function () {//重置播放器
            var _this=this,
                opt= this.config,
                playBtn=opt.playBtn,
                progress_play=opt.progress_play,
                songList=opt.songList,
                audio=opt.audio,
                simSongInfo=opt.simSongInfo,
                songInfo=opt.songInfo;
            console.log("zero");
            playBtn.style.backgroundPosition="0 -170px";
            opt.bg.style.backgroundImage="";
            document.title ="我的音乐";
            simSongInfo.innerHTML ="";
            songInfo.albumPic.src="images/player_cover.png";
            songInfo.name.innerHTML ="";
            songInfo.singer.innerHTML ="";
            songInfo.album.innerHTML ="";
            opt.onlyLyric.innerHTML="";
            songInfo.lyricScroll.innerHTML ="";
        },
        _goRuning:function (index) {
          var _this =this,
              opt =this.config,
              songList =opt.songList,
              progressPlay =opt.progress_play,
              audio =opt.audio,
              currentTime,
              duration,
              percent,
              minutes,
              seconds,
              m,
              s,
              showTime=opt.showTime,
              currindex=index;
            this.runTimer&&clearInterval(this.runTimer);
            this.runTimer =setInterval(function () {
                currentTime =audio.currentTime;
                duration =audio.duration;
                console.log(duration);
                if(!duration){
                    showTime.innerHTML="";
                    progressPlay.style.width =0;
                    clearInterval(_this.runTimer);
                }else{
                    m=parseInt(currentTime/60);
                    s =parseInt(currentTime%60);
                    minutes=parseInt(duration/60);
                    seconds =parseInt(duration%60);
                    minutes =minutes>9?minutes:"0"+minutes;
                    seconds =seconds>9?seconds:"0"+seconds;
                    percent=(currentTime*100/duration).toFixed(2)+"%";
                    showTime.innerHTML =(m>9?m:"0"+m)+":"+(s>9?s:"0"+s)+" / "+minutes+":"+seconds;
                    progressPlay.style.width =percent;
                }


                if(songList[currindex]&&songList[currindex].lyricArray){
                    _this.showLyric(currindex);
                }

            },500);
        },
        _playBtnEvent:function () {//播放器 按钮绑定事件
            var _this=this,
                opt=this.config,
                playBtn=this.config.playBtn,
                loopBtn=this.config.loopBtn,
                prevBtn=opt.prevBtn,
                nextBtn=opt.nextBtn,
                voiceBtn=opt.voiceBtn,
                onlyBtn=opt.onlyBtn,
                playStyle=opt.playStyle,
                progress_all=opt.progress_all,
                progressPlay=opt.progress_play,
                progress_current=opt.progress_current,
                voice_all=opt.voiceControls.voice_all,
                voice_play=opt.voiceControls.voice_paly,
                voice_current=opt.voiceControls.voice_current,
                len =opt.songList.length,
                currentIndex =opt.currentIndex,
                playTyoe=opt.playType,
                audio=this.config.audio,
                drag=false;

            playBtn.onclick =function () { // 播放？暂停
                if(opt.songList.length==0){
                    return false;
                }else if(!audio.src){
                    _this._ready(0);
                }else{
                    if(audio.paused){
                        audio.play();
                        _this._goRuning(_this.config.currentIndex);
                        this.style.backgroundPosition="0 -100px";
                        _this.syncsUI(_this.config.currentIndex);
                    }else{
                        audio.pause();
                        _this.runTimer&&clearInterval(_this.runTimer);
                        this.style.backgroundPosition="0 -170px";
                        _this.syncsUI();
                    }
                }
            };

            progress_all.onclick =function (e) {
                if(!audio.duration) return;
                var clientX =e.clientX,
                    $width =this.offsetWidth,
                    $left =getPos(this,"Left"),
                    percent =(clientX-$left)/$width;
                progressPlay.style.width =percent.toFixed(2)*100+"%";
                audio.currentTime =audio.duration*percent;
            };

            progress_current.onmousedown=function (e) {
                if(!audio.duration) return;
                e.stopPropagation();
                var $dot =this.offsetWidth,
                    $width =progress_all.offsetWidth,
                    startX=e.clientX,
                    $left=getPos(progress_all,"Left"),
                    percent,
                    nowX,
                    $totlX,
                    moveX;
                drag=true;
                console.log(startX - $left);  //  ---->开始的距离
                document.onmousemove=function (e) {
                    if(drag) {
                        nowX = e.clientX;
                        moveX = nowX - $left;
                        percent = moveX / $width;
                        console.log(nowX - $left);
                        progressPlay.style.width = percent.toFixed(2) * 100 + "%";
                    }
                };
                document.onmouseup=function () {
                    drag=false;
                    audio.currentTime =audio.duration*percent;
                    console.log(drag);
                    return false;
                }
            };

            voice_all.onclick=function (e) {
                var clientX =e.clientX,
                    $left=getPos(this,"Left"),
                    $width=this.offsetWidth,
                    percent;
                percent=(clientX-$left)/$width;
                voice_play.style.width=percent*$width+"px";
                audio.volume=percent.toFixed(1);
            };

            onlyBtn.onclick=function () {
                if(this.title=="打开纯净模式"){
                    this.style.backgroundPosition="0 -311px";
                    playStyle.normal.style.display="none";
                    playStyle.only.style.display="block";
                    this.title="关闭纯净模式";
                }else{
                    this.style.backgroundPosition="0 -282px";
                    playStyle.normal.style.display="block";
                    playStyle.only.style.display="none";
                    this.title="打开纯净模式"
                }
            };

            loopBtn.onclick=function () {//选择播放模式按钮
                _this.loopType++;
                if(_this.loopType%4==0){// 0--.循环模式
                    this.className ="music_loop_normal music_loop";
                    this.title="循环播放";
                    console.log("循环播放");
                }
                if(_this.loopType%4==1){ //顺序播放
                    this.className ="music_loop_next music_loop";
                    this.title="顺序播放";
                    console.log("顺序播放");
                }
                if(_this.loopType%4==2){ //随机
                    this.className ="music_loop_random music_loop";
                    this.title="随机播放";
                    console.log("随机播放");
                }
                if(_this.loopType%4==3){ //单曲
                    this.className ="music_loop_only music_loop";
                    this.title="单曲播放";
                    console.log("单曲播放");
                }
            };
            prevBtn.onclick=function () {
                // currentIndex--;
                // currentIndex<0 &&(currentIndex=len-1);
                if(!len) return;
                --currentIndex<0&&(currentIndex=len-1);
                _this._ready(currentIndex);
            };
            nextBtn.onclick=function () {
                if(!len) return;
                ++currentIndex>len-1&&(currentIndex=0);
                _this._ready(currentIndex);
            };

            voiceBtn.onclick=function () {
              if(audio.muted){
                  audio.muted=false;
                  voiceBtn.style.backgroundPosition="0 -144px";
              }else{
                  audio.muted=true;
                  voiceBtn.style.backgroundPosition="0 -182px";
              }
            };

            audio.onended=function () {
                var loopType =_this.loopType,
                    opt=_this.config,
                    len =opt.songList.length;
                switch (loopType){
                    case 0:
                        ++currentIndex>len-1 &&(currentIndex=0);
                        _this._ready(currentIndex);
                        break;
                    case 1:
                        while (currentIndex<opt.songList.length-1){
                            currentIndex++;
                            _this._ready(currentIndex);
                        }
                        if(currentIndex=opt.songList.length-1){
                            _this.syncsUI();
                            playBtn.style.backgroundPosition="0 -170px";
                        }
                        break;
                    case 2:
                        var index =parseInt(Math.random()*len);
                        _this._ready(index);
                        break;
                    case 3:
                        _this._ready(currentIndex);
                        break;
                }
            };
            
            
            
            //工具函数
            //获取距左侧距离
            
            function getPos(element,drection) {
                var current =element["offset"+drection],
                    parent =element.offsetParent;
                while (parent){
                    current +=parent["offset"+drection];
                    parent =parent.offsetParent;
                }
                return current;
            }
        },
        getLyric:function (index) {
            var _this = this,
                opt= this.config,
                songList=opt.songList,
                id =songList[index].id,
                lyricDataArray=[],
                timeReg= /\[\d{2}:\d{2}.\d{2}\]/g,//获取时间戳
                lrc_src="http://music.qq.com/miniportal/static/lyric/{1}/{0}.xml",//歌词地址模板  {0}:歌曲id {1}:歌曲id%100 取余 680279
                lrc=lrc_src.replace("{0}",id).replace("{1}",id%100),
                yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + lrc + '"') + '&format=xml&callback=',
                myAjax=AJ.getJson;
            if(songList[index].noLyric || songList[index].lyricArray){
                _this.renderLyric(index);
            }else{
                myAjax({
                    url:yql,
                    dataType:"xml",
                    type:"get",
                    success:function (res) {
                        console.log(res);
                        var results=res.documentElement.getElementsByTagName("results")[0].innerHTML,
                            data,
                            result=[];
                        if(results.length){
                            data=res.documentElement.getElementsByTagName("lyric")[0].innerHTML;
                            // console.log(data);
                            var arr=data.split("[offset:0]")[1].split("\n");
                            arr.shift();
                            arr.forEach(function (item) {
                                var time,//每一组时间
                                    value,
                                    t,
                                    timeArray;
                                time=item.match(timeReg)[0].replace("[","").replace("]","");
                                value=item.split("]")[1].replace("]]>","");
                                t=time.split(":");
                                timeArray =parseInt(t[0])*60 + (+parseFloat(t[1]).toFixed(2));  //当前时间
                                result.push([timeArray,value]);
                            });
                            result.forEach(function (item,index) {
                                if(!item[1]){
                                    result.splice(index,1);
                                }
                            });
                            songList[index].lyricArray=result;
                        }else{
                            songList[index].noLyric="暂无歌词数据";
                        }
                        _this.renderLyric(index);
                    }
                });
            }
        },
        renderLyric:function (index) {
            var opt =this.config,
                simSongInfo=opt.songInfo,
                songList=opt.songList,
                lyricScroll =simSongInfo.lyricScroll,
                onlyLyric =opt.onlyLyric,
                html="";
            if(songList[index].noLyric){
                lyricScroll.innerHTML ="<p>"+songList[index].noLyric+"</p>";
                lyricScroll.style.lineHeight="60px";
                lyricScroll.style.top="0";

                onlyLyric.innerHTML ="<p>"+songList[index].noLyric+"</p>";
                onlyLyric.style.lineHeight="100px";
                onlyLyric.style.top="0";
            }else if(songList[index].lyricArray){
                songList[index].lyricArray.forEach(function (item,index) {
                   html+="<p data-time='"+item[0]+"'>"+item[1]+"</p>";
                });
                lyricScroll.innerHTML =html;
                onlyLyric.innerHTML =html;
            }
        },
        showLyric:function (index) {
            var opt =this.config,
                simSongInfo=opt.songInfo,
                songList=opt.songList,
                lyricArray=songList[index].lyricArray,
                lyricScroll =simSongInfo.lyricScroll,//正常模式 歌词盒子
                len = lyricArray.length,
                audio = opt.audio,
                onlyLyric =opt.onlyLyric,  //纯净模式 歌词盒子
                onlyBtn =opt.onlyBtn,
                oP =null,
                lineHeight=34;
            if(onlyBtn.title=="打开纯净模式"){
                oP=lyricScroll.querySelectorAll("p");
            }else{
                oP=onlyLyric.querySelectorAll("p");
            }
            for(var i=0;i<len;i++){
                var audioCurrentTime=audio.currentTime;
                if(oP[i]){
                    var curT =oP[i].dataset.time;
                }
                if(audioCurrentTime>curT){
                    Array.prototype.forEach.call(oP,function (item) {
                        item.classList.remove("on");
                    });
                    oP[i]&&oP[i].classList.add("on");
                    lyricScroll.style.top= -i*lineHeight+"px";
                    onlyLyric.style.top= -i*lineHeight+"px";
                }
            }

        },
        syncsUI:function (index) { //处理 播放器外部样式 代码冗余 以后优化
            var audio =this.config.audio;
            music_current(index);
            music_wave(index);

            function music_wave(cur) {//处理 音乐符
                try{
                    var nodelist =document.querySelectorAll(".song_list_number");
                    Array.prototype.forEach.call(nodelist,function (item) {
                        item.classList.remove("wave");
                    });
                    typeof cur=="number"&&nodelist[cur].classList.add("wave");
                }catch(ex){
                    console.log(ex);
                }
            }

            function music_current(cur) {  //处理 音乐管理菜单项 开始？暂停
                try{
                    var nodelist =document.querySelectorAll(".icon_list_menu_play");
                    Array.prototype.forEach.call(nodelist,function (item) {
                        item.classList.remove("icon_list_menu_play_current");
                    });
                    typeof cur=="number"&&nodelist[cur].classList.add("icon_list_menu_play_current");

                }catch(ex){
                    console.log(ex);
                }
            }
        }
    };

    Player.init=function (option) {
        new Player(option);
    };
    return{
        player:Player.init
    }
});