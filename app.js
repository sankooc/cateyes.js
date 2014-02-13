var cateyes = require('./cateyes');
var hu = require('./libs/httpUtil');
var crypto = require('crypto');
var fs = require('fs');
var tencent = require('./libs/tencent');

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

function testVid(_url){
  //console.log(_url);
  var _v = cateyes.createVideoFromURL(_url,'low');
  _v.once('vid',function(){
    console.log('get vid : %s',_v.vid);
    testResource(_v);
  });
  _v.parse();
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
