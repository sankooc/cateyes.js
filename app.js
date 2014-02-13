var cateyes = require('./cateyes');
var hu = require('./libs/httpUtil');
var crypto = require('crypto');
var fs = require('fs');
var tencent = require('./libs/tencent');
var single = require('./libs/single');



//var ret = cateyes.downloadFromId('youku','/Users/sankooc/test','high','XNTc5NDY4NTEy');

//var ret2 = cateyes.download('http://v.youku.com/v_show/id_XNjY1MTA2NjA0.html','/Users/sankooc/test','flv');
//var sohuUrl = 'http://tv.sohu.com/20130822/n384852417.shtml';
var sohuSurl = 'http://tv.sohu.com/20140119/n393765790.shtml';
var youkuUrl = 'http://player.youku.com/player.php/sid/XNjYzNDI5MzAw/v.swf';
var tencentUrl = 'http://v.qq.com/cover/0/0wzzdnks41m52ve.html';
var v56Url = 'http://www.56.com/u69/v_ODg5MTIzNTQ.html';
var yytUrl = 'http://www.yinyuetai.com/video/731011';
var letvUrl = 'http://www.letv.com/ptv/vplay/2074193.html';
var ku6 = 'http://v.ku6.com/show/Gahx_fVJ5bFGzG3eD1cLDw...html';


var folder = '/Users/sankooc/test';
//
//var source = ['aa','bb'];
//console.log(source instanceof Object);



//var kr = '[tvN] 더 지니어스 시즌.E01.131207.HDTV.H264.540p-SSS';
//
//console.log(kr.replace(/([\s\[\]])/g,'\\$1'));




//cateyes.download(youkuUrl,'low',folder);
//cateyes.download(v56Url,'low',folder);

//var _v = cateyes.createVideoFromURL(tencentUrl,'low');
//tencent.getVid(_v);
//testVid(ku6);

//getCheckSum('md5',file);
//hu.startTimer();
//cateyes.download(youkuUrl,'mp4',folder);
//fs.unlinkSync('/Users/sankooc/test/aaa');

//var eyes = new cateyes.eyes();
//eyes.addVideo(tencentUrl,'low',folder,'蜡笔蜡笔');


//cateyes.getTitle(tencentUrl,function(flag,title){
//    if(!flag){
//        console.error('no title');
//        return;
//    }
//    console.log('title is %s',title);
//})

//var id = setInterval(function(){
//
//},1000);



function testVid(_url){
  //console.log(_url);
  var _v = cateyes.createVideoFromURL(_url,'low');
  _v.once('vid',function(){
    console.log('get vid : %s',_v.vid);
    testResource(_v);
  });
  _v.parseVid();
}

function testResource(_v){
  _v.once('validated',function(){
    console.log('validated');
  });
  _v.parseResource();
}


function getCheckSum(arg,file){
  var shasum = crypto.createHash(arg);
  var buffer = fs.readFileSync(file);
  shasum.update(buffer);
  var d = shasum.digest('hex');
  console.log(d);
}
