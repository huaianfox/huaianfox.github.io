$(function () {
    var timer=null,index=0;
    timer=setInterval(function () {
        auto();
    },3000);
    $(".slideTab span").mouseover(function () {
        var index=$(this).index();
        console.log(index);
        play(index);
    });
    $(".slidebox").hover(function () {
        clearInterval(timer);
    },function () {
        timer=setInterval(function () {
            auto();
        },3000)
    });
    function auto() {
        index++;
        (index>=4)&&(index=0);
        play(index);
    }
    function play(cur) {
        $(".slideTab span").eq(cur).addClass("active").siblings().removeClass("active");
        $(".slide li").eq(cur).fadeIn(500).siblings().fadeOut(500);
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
});