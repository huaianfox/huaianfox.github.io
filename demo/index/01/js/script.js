$(function () {
    $(".on").hover(function () {
        console.log($(this));
        $(this).find(".sub-menu").slideDown(500);
    },function () {
        $(this).find(".sub-menu").slideUp(500);
    });

    $(".close").on("click",function () {
        $("#slideBar").fadeOut()
    });

});