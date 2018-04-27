require('./head.less')
console.log('head')
$(function() {
    $('.web-addr').hover(function() {
        $('.header-nav-second').css('display', 'block')
    }, function() {
        $('.header-nav-second').css('display', 'none')
    })
})