require('./menu.less')
$(function () {
    $('.nav-li').hover(function() {                     
        $(this).find('img').attr('src',  $(this).find('img').attr('src').split('.png')[0]+'-w.png')
        $('.category-nav-detail-wrapper').css('display','block');
        $('.detail-title').text($(this).find('.nav-text').text())
    }, function() { 
        $(this).find('img').attr('src',  $(this).find('img').attr('src').split('-w')[0]+'.png')
        $('.category-nav-detail-wrapper').css('display','none');
    })
})