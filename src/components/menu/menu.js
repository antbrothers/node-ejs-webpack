require('./menu.less')
$(function () {
    var time = false
    $('.nav-li').hover(function() {
        clearTimeout(time)   
        var _this = this 
        $(_this).find('.orgin-u').css('display', 'none')
        $(_this).find('.orgin-w').css('display', 'block')
        $('.category-nav-detail-wrapper').css('display','block');
        time = setTimeout(function() {           
            $('.detail-title').text($(_this).find('.nav-text').text())
        }, 100)   
       
    }, function() { 
        $(this).find('.orgin-u').css('display', 'block')
        $(this).find('.orgin-w').css('display', 'none') 
        $('.category-nav-detail-wrapper').css('display','none');        
    })
    $('.category-nav-detail-wrapper').hover(function() {    
        $('.category-nav-detail-wrapper').css('display','block');            
    }, function() {
        $(this).css('display','none');       
    })
})