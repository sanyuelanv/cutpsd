var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var psd = require('../psd/psd.js');
var psdData = require('../models/psd.js');
var AVATAR_UPLOAD_FOLDER = '/avatar/';
var TITLE = 'PSD 5.0';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: TITLE });
});
router.get('/psd', function(req, res, next) {
  if(!req.query.name){res.render('psd', { title: TITLE });return;}
  var name = req.query.name;
  psdData.getImg(name,function(err,result){
    if(err){console.log(err);}
    else{
      var name = result.data[0].sid;
      res.render('psd',{
        title: TITLE,
        name:name,
        data:result.data
      });
    }
  });
});
router.post('/uppsd', function(req, res) {
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';		//设置编辑
  form.uploadDir = 'static' + AVATAR_UPLOAD_FOLDER;	 //设置上传目录
  form.keepExtensions = true;	 //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
  form.parse(req, function(err, fields, files) {
    if (err) {
      res.locals.error = err;
      res.render('index', { title: TITLE });
      return;
    }
    var extName = files.fulAvatar.name.split('.')[1];  //后缀名
    if(extName != 'psd'){
      res.locals.error = '上传文件类型错误';
      res.render('index', { title: TITLE });
      return;
    }
    var timeStamp = createTimeStamp();
    var avatarName = timeStamp + '.' + extName;
    var newPath = form.uploadDir + avatarName;
    fs.renameSync(files.fulAvatar.path, newPath);  //重命名
    res.locals.success = '上传成功<a style="margin-left:10px" href="/psd?name='+timeStamp+'">点击进入</a>';
    psd(timeStamp,function(err){
      if(err){
        console.log(err);
        res.render('index', { title: TITLE });
      }
      else{res.render('index', { title: TITLE });}
    });
  });
});
var createTimeStamp = function () {return parseInt(new Date().getTime() / 1000) + '';};
module.exports = router;
