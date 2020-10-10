/*
 * @Author: linjianxi
 * @Date: 2020-07-03 10:01:38
 * @LastEditTime: 2020-10-10 09:18:14
 * @Description: file content
 */
import { getQueryString } from '../../../config/getQueryString'
var landing_page = ''
var click_tracking_urls = ''
var jsonData = ""
var _s3 = false

Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var initialTime = Date.parse(new Date())
var showTime = new Date().Format("hh:mm:ss")

function appear(data, show_time) {
    let browsingTime = Date.parse(new Date()) - initialTime
    window.sensors.track("WxdjBannerShow", {
        tracking_id: data && data.ads && data.ads.tracking_id,
        open_id: data && data.account && data.account.open_id,
        w_id: data && data.account && data.account.wid,
        banner_url: (data && data.ads && data.ads.landing_page) ? data.ads.landing_page : '',
        // banner_url: data && data.ads && data.ads.creative.url,
        browsing_time: browsingTime / 1000,
        show_time: show_time
    });
}

function clickTrig(data, clickName) {
    window.sensors.track("WxdjBannerClick", {
        click_time: new Date().Format("hh:mm:ss"),
        tracking_id: data && data.ads && data.ads.tracking_id,
        open_id: data && data.account && data.account.open_id,
        w_id: data && data.account && data.account.wid,
        banner_url: (data && data.ads && data.ads.landing_page) ? data.ads.landing_page : '',
        click_name: clickName
    });
}

function AutoScroll(obj) {
    $(obj).find("ul:first").animate({
        marginTop: "-20px"
    },
    500,
    function() {
        $(this).css({
            marginTop: "0px"
        }).find("li:first").appendTo(this);
    });
}

function timeDec(){
    var time=60
    console.log(time)
    setInterval(()=>{
        time=time-1
        if(time===0){
            time=60
        }if(time<10){
            time="0"+time
        }
        $('#goald_countdown_time').text(time);
    }, 1000)
}

function timeDecHao(){
    var time=9
    console.log(time)
    setInterval(()=>{
        time=time-1
        if(time===0){
            time=9
        }
            time="0"+time
        $('#goald_countdown_time_hao').text(time);
    }, 100)
}


$(function () {
    let mchData = { action: 'onIframeReady', displayStyle: 'SHOW_CUSTOM_PAGE' }
    var data = JSON.stringify(mchData)
    window.parent.postMessage(data, 'https://payapp.weixin.qq.com')
    window.sensors.quick('autoTrack');

    if ($('.goald_main').hasClass('goald1') || $('.goald_main').hasClass('goald2') || $('.goald_main').hasClass('goald3') || $('.goald_main').hasClass('goald4') || $('.goald_main').hasClass('goald5')|| $('.goald_main').hasClass('goald6')||$('.goald_main').hasClass('goald7')) {
        $('.goald_main').removeClass('goald1');
        $('.goald_main').removeClass('goald2');
        $('.goald_main').removeClass('goald3');
        $('.goald_main').removeClass('goald4');
        $('.goald_main').removeClass('goald5');
        $('.goald_main').removeClass('goald6');
        $('.goald_main').removeClass('goald7');
    }

    $('.goald_main').css("display", "none")
    getCredits()

    // 获取积分
    function getCredits() {
        console.log('begin:' + new Date().getTime())
        console.log(window.location.origin.indexOf('shouqianba') === -1)
        $.ajax({
            url: `${window.location.origin.indexOf('shouqianba') === -1 ? 'https://heart-magic.iwosai.com' : 'https://heart-magic.shouqianba.com'}` + '/gold-plan/note?order_sn=' + (getQueryString('out_trade_no') ? getQueryString('out_trade_no') : '7895234041935530'),
            type: 'get',
            success: function (data) {    
                // data = {}           
                // 展示
                jsonData = JSON.stringify(data) !== '{}' ? data : {"ads":{"tracking_id":"39db8411-ed10-47d5-831e-f8f3c43413e0","creative_type":2,"creative":{"url":"https://images.wosaimg.com/a8/16e84df251ba04fbbd9075dd64a8783eab2488.png","width":0,"height":0},"landing_page":"https://m-cstore.shouqianba.com/pages/package-B/x-site/page-link/index?pageType=poster&pageCode=1594791178776&channel=dj","imp_tracking_urls":["https://tracking.wosai.cn/track_imp?uid=null&t=39db8411-ed10-47d5-831e-f8f3c43413e0&c=RM7HO5uVqCDSiJ12ENybpdBm6igx5D06WCC99RBId1ztstN9dCVovwsQJJIrT57NkMcO2NbXVlwoq9fS1_tLjPLGNRxePp6aAfD1FDZ_iTcHVwU2Cl-mW3R_OCm7iq0qGSYkXAVWdFZ-OkFYWSlBTcoYvuuc9dAaJf7OgE6VJsgWtdzWG6abkSxJwrZUuoJHUx8ldNVKCdVNrNZc5YVgmxOyj21OT7m0K0sozyvLGYWJTM07cCi6414jCLBtRGBtmOlW7NYf-eVsQWkuaP9vBwfLOR_TGtW5yTDKK4qKGI4ZtWcUT5xLmzFohJi5nNbZ5cyPMQ9RKRRRINxBAB5NSx7G5IBIlN2BPWLj1bYbCh3voVnOZptXbWisYXraSdMJgvApeMI9S7g48YeJsGDstedPYsqhierSzBUP2X3J8tATUw7ZqGSXrace5ikJVlTB9QernZutu9ipeFo32L0="],"click_tracking_urls":["https://tracking.wosai.cn/track_click?uid=null&t=39db8411-ed10-47d5-831e-f8f3c43413e0&c=RM7HO5uVqCDSiJ12ENybpdBm6igx5D06WCC99RBId1ztstN9dCVovwsQJJIrT57NkMcO2NbXVlwoq9fS1_tLjPLGNRxePp6aAfD1FDZ_iTcHVwU2Cl-mW3R_OCm7iq0qGSYkXAVWdFZ-OkFYWSlBTcoYvuuc9dAaJf7OgE6VJsgWtdzWG6abkSxJwrZUuoJHUx8ldNVKCdVNrNZc5YVgmxOyj21OT7m0K0sozyvLGYWJTM07cCi6414jCLBtRGBtmOlW7NYf-eVsQWkuaP9vBwfLOR_TGtW5yTDKK4qKGI4ZtWcUT5xLmzFohJi5nNbZ5cyPMQ9RKRRRINxBAB5NSx7G5IBIlN2BPWLj1bYbCh3voVnOZptXbWisYXraSdMJgvApeMI9S7g48YeJsGDstedPYsqhierSzBUP2X3J8tATUw7ZqGSXrace5ikJVlTB9QernZutu9ipeFo32L0="],"campaign_type":1,"style":5},"credits":{"balance":0,"gain":0},"account":{}}
                data = JSON.stringify(data) !== '{}' ? data :{"ads":{"tracking_id":"39db8411-ed10-47d5-831e-f8f3c43413e0","creative_type":2,"creative":{"url":"https://images.wosaimg.com/a8/16e84df251ba04fbbd9075dd64a8783eab2488.png","width":0,"height":0},"landing_page":"https://m-cstore.shouqianba.com/pages/package-B/x-site/page-link/index?pageType=poster&pageCode=1594791178776&channel=dj","imp_tracking_urls":["https://tracking.wosai.cn/track_imp?uid=null&t=39db8411-ed10-47d5-831e-f8f3c43413e0&c=RM7HO5uVqCDSiJ12ENybpdBm6igx5D06WCC99RBId1ztstN9dCVovwsQJJIrT57NkMcO2NbXVlwoq9fS1_tLjPLGNRxePp6aAfD1FDZ_iTcHVwU2Cl-mW3R_OCm7iq0qGSYkXAVWdFZ-OkFYWSlBTcoYvuuc9dAaJf7OgE6VJsgWtdzWG6abkSxJwrZUuoJHUx8ldNVKCdVNrNZc5YVgmxOyj21OT7m0K0sozyvLGYWJTM07cCi6414jCLBtRGBtmOlW7NYf-eVsQWkuaP9vBwfLOR_TGtW5yTDKK4qKGI4ZtWcUT5xLmzFohJi5nNbZ5cyPMQ9RKRRRINxBAB5NSx7G5IBIlN2BPWLj1bYbCh3voVnOZptXbWisYXraSdMJgvApeMI9S7g48YeJsGDstedPYsqhierSzBUP2X3J8tATUw7ZqGSXrace5ikJVlTB9QernZutu9ipeFo32L0="],"click_tracking_urls":["https://tracking.wosai.cn/track_click?uid=null&t=39db8411-ed10-47d5-831e-f8f3c43413e0&c=RM7HO5uVqCDSiJ12ENybpdBm6igx5D06WCC99RBId1ztstN9dCVovwsQJJIrT57NkMcO2NbXVlwoq9fS1_tLjPLGNRxePp6aAfD1FDZ_iTcHVwU2Cl-mW3R_OCm7iq0qGSYkXAVWdFZ-OkFYWSlBTcoYvuuc9dAaJf7OgE6VJsgWtdzWG6abkSxJwrZUuoJHUx8ldNVKCdVNrNZc5YVgmxOyj21OT7m0K0sozyvLGYWJTM07cCi6414jCLBtRGBtmOlW7NYf-eVsQWkuaP9vBwfLOR_TGtW5yTDKK4qKGI4ZtWcUT5xLmzFohJi5nNbZ5cyPMQ9RKRRRINxBAB5NSx7G5IBIlN2BPWLj1bYbCh3voVnOZptXbWisYXraSdMJgvApeMI9S7g48YeJsGDstedPYsqhierSzBUP2X3J8tATUw7ZqGSXrace5ikJVlTB9QernZutu9ipeFo32L0="],"campaign_type":1,"style":1},"credits":{"balance":0,"gain":0},"account":{}}
                // const dataParms = data && data.ads && data.ads.style 
                let dataParms = data && data.ads && data.ads.style 
                if (dataParms === 1) { // 红                                  
                    // require('./lessFun').addCssByLink('/assets/goald/goaldcss1.css')
                    $('.goald_main').addClass('goald1')
                    require('../../assets/goald/goald1.less')
                } else if (dataParms === 2) { // 绿      
                    $('.goald_main').addClass('goald2')
                    require('../../assets/goald/goald2.less')
                    // require('./lessFun').addCssByLink('/assets/goald/goaldcss2.css')
                } else if (dataParms === 3) {  // 全图  
                    $('.goald_main').addClass('goald3')
                    require('../../assets/goald/goald3.less')
                    // require('./lessFun').addCssByLink('/assets/goald/goaldcss3.css')
                    _s3 = true
                    document.getElementById('goald_main').style.backgroundImage = (data && data.ads && data.ads.creative && data.ads.creative.url) ? 'url(' + data.ads.creative.url + ')' : 'url(../../assets/images/bg.gif)';
                }
                else if (dataParms === 4) {  // 全图   
                    $('.goald_main').addClass('goald4')
                    require('../../assets/goald/goald4.less')
                    // require('./lessFun').addCssByLink('/assets/goald/goaldcss4.css')
                } else if (dataParms === 5) {  // 全图     
                    $('.goald_main').addClass('goald5')
                    require('../../assets/goald/goald5.less')
                    // require('./lessFun').addCssByLink('/assets/goald/goaldcss5.css')
                } else if (dataParms === 6) {  // 跑马灯     
                    $('.goald_main').addClass('goald6')
                    require('../../assets/goald/goald6.less')
                    setInterval(()=>{
                        AutoScroll("#goald_roll")
                    }, 1500)
                    timeDec()
                    timeDecHao()
                    _s3 = true
                    document.getElementById('goald_main').style.backgroundImage = (data && data.ads && data.ads.creative && data.ads.creative.url) ? 'url(' + data.ads.creative.url + ')': 'url(../../assets/images/tui_bg.jpg)';
                    $('.fuli_value').text((data.credits && data.credits.balance) ? data.credits.balance : 0)
                    $('.consume_value').text((data.credits && data.credits.gain) ?  data.credits.gain :  0)
                }else if (dataParms === 7) {  // 跑马灯     
                    $('.goald_main').addClass('goald7')
                    require('../../assets/goald/goald7.less')
                    setInterval(()=>{
                        AutoScroll("#goald_roll")
                    }, 1500)
                    _s3 = true
                    document.getElementById('goald_main').style.backgroundImage = (data && data.ads && data.ads.creative && data.ads.creative.url) ?'url(' + data.ads.creative.url + ')' : 'url(../../assets/images/tui_bg.jpg)';
                    $('.fuli_value').text((data.credits && data.credits.balance) ? data.credits.balance : 0)
                    $('.consume_value').text((data.credits && data.credits.gain) ?  data.credits.gain :  0)
                } else {
                    $('.goald_main').addClass('goald5')
                    require('../../assets/goald/goald5.less')
                }
                $('.goald_m').css('display', 'block')
                $('.price').text((data.credits && data.credits.balance) ? data.credits.balance : 0)
                $('.score').text((data.credits && data.credits.gain) ? data.credits.gain : 0)
                document.getElementById('bg_main').style.backgroundImage = (data.ads && data.ads.creative.url) ? 'url(' + data.ads.creative.url + ')' : 'url(../../assets/images/goald_bg.png)';
                // document.getElementById('bg_main').style.backgroundImage = 'url(../../assets/images/mrjg.png)';
                $('.goald_main').css("display", "block")
                landing_page = data.ads ? data.ads.landing_page : ''
                $('.imp_tracking_urls').attr('src', data.ads ? data.ads.imp_tracking_urls[0] : '')
                click_tracking_urls = data.ads ? data.ads.click_tracking_urls[0] : ''

                window.sensors.track("WxdjAllBalance", {
                    show_time: showTime,
                    tracking_id: data && data.ads && data.ads.tracking_id,
                    open_id: data && data.account && data.account.open_id,
                    w_id: data && data.account && data.account.wid,
                    banner_url: (data && data.ads && data.ads.landing_page) ? data.ads.landing_page : "",
                    balance: (data && data.credits && data.credits.balance) ? data.credits.balance : ""
                });
            },
            error: function (error) {
                console.log(error)
                alert("异常！");
            }
        })
    }


    $('.goadl_content').click(function () {
        appear(jsonData, showTime)
        if (!_s3) {
            clickTrig(jsonData, "图片点击")
        }
        $('.click_tracking_urls').attr('src', click_tracking_urls)
        let mchData2 = { action: 'jumpOut', jumpOutUrl: landing_page }
        let data2 = JSON.stringify(mchData2)
        console.log(data2)
        window.parent.postMessage(data2, 'https://payapp.weixin.qq.com')
    })
    $('.help').click(function () {
        appear(jsonData, showTime)
        clickTrig(jsonData, "积分规则")
        let mchData2 = { action: 'jumpOut', jumpOutUrl: 'https://m-cstore.shouqianba.com/pages/package-B/x-site/page-link/index?pageType=poster&pageCode=1594346617211&channel=dianjinjihua' }
        let data2 = JSON.stringify(mchData2)
        console.log(data2)
        window.parent.postMessage(data2, 'https://payapp.weixin.qq.com')
    })
    $('#goald_main').click(function () {
        if (_s3) {
            clickTrig(jsonData, "图片点击")
            let mchData2 = { action: 'jumpOut', jumpOutUrl: landing_page }
            $('.click_tracking_urls').attr('src', click_tracking_urls)
            let data2 = JSON.stringify(mchData2)
            console.log(data2)
            window.parent.postMessage(data2, 'https://payapp.weixin.qq.com')
        }
    })
})

window.onbeforeunload = function () {
    appear(jsonData, showTime)
}
