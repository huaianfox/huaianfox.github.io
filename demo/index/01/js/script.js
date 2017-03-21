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
        $(this).find(".sub-menu").slideDown(300);
    },function () {
        $(this).find(".sub-menu").slideUp(300);
    });

    $(".close").on("click",function () {
        $("#slideBar").fadeOut()
    });
});