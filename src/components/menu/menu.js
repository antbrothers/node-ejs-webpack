require('./menu.less')
$(function () {
    var time = false
    $('.nav-li').hover(function() {
        clearTimeout(time)   
        var _this = this 
        $(_this).find('img').attr('src',  $(_this).find('img').attr('src').split('.png')[0]+'-w.png')
        $('.category-nav-detail-wrapper').css('display','block');
        time = setTimeout(function() {           
            $('.detail-title').text($(_this).find('.nav-text').text())
        }, 100)   
       
    }, function() { 
        $(this).find('img').attr('src',  $(this).find('img').attr('src').split('-w')[0]+'.png')
        $('.category-nav-detail-wrapper').css('display','none');       
    })
})