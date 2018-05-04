require('./head.less')
$(function() {
    $('.web-addr').hover(function() {
        $('.header-nav-second').css('display', 'block')
    }, function() {
        $('.header-nav-second').css('display', 'none')
    })
})