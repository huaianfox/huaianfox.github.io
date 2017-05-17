define(function () {
   "use strict";

   var CreateHtml=function (option) {
       this.option=Object.assign(option||{},this.config);
       this.start();
   };
    CreateHtml.prototype.config={
        data:[],
        type:"",
        parentNode:null,
        src:"http://ws.stream.qqmusic.qq.com/{id}.m4a?fromtag=46",
        aduio:null
    };
    CreateHtml.prototype={
       constructor:CreateHtml,
        start:function () {
            var opt =this.option;
            this.renderUI();
            // this.bindUI();
            this.syncsUI();

        },
        renderUI:function () {
            var html="",
                opt =this.option,
                song_data=opt.data;
            if(opt.type=="search"){//侧栏搜索管理面板
                var len=song_data.length;
                song_data.forEach(function (item,index) {
                    html +="<li>"
                        +"<div class='songlist_name songlist_item'><a href='"+item.song_href+".html'>"+item.song+"</a></div>"
                        +"<div class='songlist_singer songlist_item'><a href='"+item.singer_href+".html'>"+item.singer+"</a></div>"
                        +"<div class='songlist_album songlist_item'><a href='"+item.album_href+".html'>"+item.album+"</a></div>"
                        +"<div class='songlist_time songlist_item'>"+item.time+"</div>"
                        +"<div class='icon_list_menu'>"
                        +"<a href='javascript:;' class='icon_list_menu_play icon_commom_menu'>播放</a>"
                        +"<a href='javascript:;' class='icon_list_menu_add icon_commom_menu'>添加</a>"
                        +"</div>"
                        +"</li>";
                });
                // opt.pNode.innerHTML =html;
            }
            if(opt.type=="player"){//播放器管理面板
                if(!song_data.length){
                    opt.pNode.innerHTML ="";
                    return
                }
                song_data.forEach(function (item,index) {
                    html +="<li>"
                        +"<div class='player_songlist_check player_list_item'><div class='song_edit_check'><input type='checkbox' class='song_list_checkbox'></div><div class='song_list_number'>"+(index+1)+"</div></div> "
                        +"<div class='player_songlist_name player_list_item'>"+item.song+"</div>"
                        +"<div class='player_songlist_singer player_list_item'><a href='"+item.singer_href+".html'>"+item.singer+"</a></div>"
                        +"<div class='player_songlist_time player_list_item'>"+item.time+"<a href='javascript:;' class='icon_list_menu_delete icon_commom_menu'>删除</a></div>"
                        +"<div class='icon_list_menu'>"
                        +"<a href='javascript:;' class='icon_list_menu_play icon_commom_menu'>播放</a>"
                        +"<a href='javascript:;' class='icon_list_menu_add icon_commom_menu'>添加</a>"
                        +"<a href='javascript:;' class='icon_list_menu_download icon_commom_menu'>下载</a>"
                        +"</div>"
                        +"</li>";
                });
            }
            opt.pNode.innerHTML =html
        },
        syncsUI:function () {
            var opt =this.option,
                pn =opt.pNode,
                songlist_item;//歌曲列表
            if(pn.innerHTML!==""&& opt.type=="search"){
                songlist_item =pn.querySelectorAll("li");
                Array.prototype.forEach.call(songlist_item,function (item,index) {
                    if(index%2){
                        item.classList.add("odd");
                    }
                });
            }
        }
    };
    CreateHtml.init=function (option) {
      new   CreateHtml(option);
    };

    return {
        CreateHtml:CreateHtml.init
    }
});