var $stage={}; /*创建 “场景” 对象。*/
var $component={};/*创建 “组件” 对象*/
var $event={}; /*创建 “事件” 对象*/
var $config={};/*配置 “参数” 对象*/
$config = {
    //状态
    isLoad:false,isPre:false,
    //设备
    Android:false,ios:false,pc:false,tbs:false,
    //参数
    imgWebRoot:0,
    //屏幕参数
    screen:{w:0,h:0},reSize:{bl:0,left:0},
};
/*预执行函数*/
if(!$config.isPre){Pre();}
function Pre(){
    /*识别设备*/
    var UA = navigator.userAgent,
        isAndroid = /android|adr/gi.test(UA),
        isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid,
        isPC = !isAndroid && !isIos,
        tbs = isAndroid && /TBS/gi.test(UA);
    /*把设备识别结果写入config中去*/
    $config.Android = isAndroid;$config.ios = isIos;$config.pc = isPC;$config.tbs = tbs;
    var main = document.getElementById('main');
    /*X5内核采用viewprot缩放*/
    if(tbs){
        var ih = window.innerHeight;
        $config.reSize.bl = ih / 1280;
        var metaELe = document.getElementById('viewport');
        metaELe.content = 'width=device-width,initial-scale='+$config.reSize.bl+',minimum-scale='+$config.reSize.bl+',maximum-scale='+$config.reSize.bl+',user-scalable=no';
        $config.screen.w =document.body.scrollWidth;
        $config.screen.h =document.body.scrollHeight;
        $config.reSize.left = ($config.screen.w - 987)/2;
        main.style.left = $config.reSize.left + 'px';
        main.style.Transform = 'scale(' + $config.reSize.bl + ')';
    }
    /*非X5内核采用采用CSS3缩放*/
    else{
        $config.screen.w =document.body.scrollWidth;
        $config.screen.h =document.body.scrollHeight;
        $config.reSize.bl = $config.screen.h / 1280;
        $config.reSize.left = ($config.screen.w-$config.reSize.bl*987)/2;
        main.style.left = $config.reSize.left + 'px';
        main.style.Transform = 'scale(' + $config.reSize.bl + ')';
        main.style.WebkitTransform = 'scale(' + $config.reSize.bl + ')';
    }
    /*spa的设定单页高度*/
    document.getElementsByTagName('body')[0].style.height = $config.screen.h + 'px';
    document.getElementsByTagName('html')[0].style.height = $config.screen.h + 'px';
    /*读取登录信息，这些根据项目的不同调节*/
    if($config.isLogin){}
    /*是否已经执行完了整个预函数*/
    $config.isPre = true;
}
/*---------------启动函数--------------------*/
window.onload = function(){
    //程序入口
}
