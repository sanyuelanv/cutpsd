var PSD = require('psd');
var psdData = require('../models/psd.js');
var AVATAR_UPLOAD_FOLDER = 'static/avatar/';
/*切图，制作html页面*/
var MapImg = function(fileName,callback){
    var AVATAR_OUTLOAD_FOLDER = 'static/out/';
    var imgArray = [];
    var index = 0;
    var psd = PSD.fromFile(AVATAR_UPLOAD_FOLDER+'/'+fileName+'.psd');
    psd.parse();
    /*查找图层个数*/
    var LayerNum = psd.tree().children().length;
    var visible_child = [];
    var visibleNum = 0;
    /*查找可见图层个数：为什么要做两次循环去先读取可见图层呢？因为一次的话，会造成找不到结束尾巴的bug*/
    for(var i=0;i<LayerNum;i++){
        var child = psd.tree().children()[i];
        var layer = child.layer;
        if(layer.visible){
            visible_child[visibleNum] = child;
            visibleNum++;
        }
    }
    /*开始切图*/
    for(var i=visibleNum-1;i>=0;i--){
        var child = visible_child[i];
        var layer = child.layer;
        var imgObj = {};
        var name = fileName+"_"+child.name;
        imgObj.name = name;
        if(layer.visible){
            /*记录宽高，左上边距*/
            var h = layer.height;
            imgObj.height = h;
            imgObj.width = layer.width;
            imgObj.left = layer.left;
            imgObj.top = layer.top;
            var png = layer.image.toPng();
            imgArray[index] = imgObj;
            index ++ ;
            if(i!=0){layer.image.saveAsPng(AVATAR_OUTLOAD_FOLDER+name+'.png')}
            else{
                layer.image.saveAsPng(AVATAR_OUTLOAD_FOLDER+name+'.png').then(function(){
                    //切图完毕，写入数据库
                    psdData.addAll(imgArray,fileName, function (e) {
                        return callback(e);
                    });
                });
            }
        }
    }
};
module.exports = MapImg;
