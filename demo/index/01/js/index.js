$(function () {
    var timer=null,index=0;
    $(".slideTab span").on("click",function () {
        var index=$(this).index();
        play(index);
    });
    $(".slidebox").hover(function () {
        clearInterval(timer);
    },function () {
        timer=setInterval(function () {
            auto();
        },4000)
    });
    timer=setInterval(function () {
        auto();
    },4000);
    function auto() {
        index++;
        (index>3)&&(index=0);
        play(index);
    }
    function play(cur) {
        $(".slideTab span").removeClass("active").eq(cur).addClass("active");
        $(".slide li").eq(cur).fadeIn(700).siblings(".slide li").fadeOut(700);
        index=cur;
    }

    $(".on").hover(function () {
        $(this).find(".sub-menu").slideDown(500);
    },function () {
        $(this).find(".sub-menu").slideUp(500);
    });

    $(".close").on("click",function () {
        $("#slideBar").fadeOut()
    });

    var p =$(".product-show"),s=$("#scroll");
    p.append(p.html());
    var len=p.children().size(),
        width =p.children().width()*len,
        scrollTimer=null,
        scrollBox=s.get(0);
    s.hover(function () {
        clearInterval(scrollTimer);
    },function () {
        scroll();
    });
    scroll();
    function scroll() {
        scrollTimer=setInterval(function () {
            var pos= scrollBox.scrollLeft +1;
            if(pos>=width/2){
                pos -=width/2;
            }
            scrollBox.scrollLeft=pos;
        },20);
    }
});
