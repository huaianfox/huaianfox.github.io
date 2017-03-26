$(function () {
    var index=0,
        timer=null,
        interval=3000,
        time=800;
        len=$(".scrollbox li").size();
    timer=setInterval(function () {
        auto();
    },interval);
    $(".scroll-tab a").mouseover(function () {
        var $index =$(this).index();
        play($index);
    });
    $(".banner").hover(function () {
        clearInterval(timer);
    },function () {
        timer=setInterval(function () {
            auto();
        },interval);
    });
    function auto() {
        index++;
        (index>=len)&&(index=0);
        play(index);
    }
    $(".next").click(function () {
        auto();
    });
    $(".prev").click(function () {
        index--;
        (index<0)&&(index=len-1);
        play(index);
    });
    function play(now) {
        $(".scroll-tab a").removeClass("active").eq(now).addClass("active");
        $(".scrollbox li").eq(now).fadeIn(time).siblings(".scrollbox li").fadeOut(time);
        index=now;
    }
});

