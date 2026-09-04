
$(document).ready(function () {

    // rwd按鈕
    $('.hamburger').click(function (e) {
        $(this).toggleClass('active');
        $('.logo img').toggleClass('phone-logo');
        // $('.nav-bg').toggleClass('phone-nav-bg');
    });

});