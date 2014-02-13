var hu = require('./httpUtil')
   ,util = require('util')
   ,select = require('xpath.js')
   ,dom = require('xmldom').DOMParser


var regex_1 = /[\S\s]*vid:"(\w+)"[\S\s]*/
   ,plistFormat = 'http://vv.video.qq.com/geturl?otype=xml&platform=1&format=2&&vid=%s'
   ,xpath_url = '/root/vd/vi/url/text()'
   ,xpath_length = '/root/vd/vi/fs/text()'
   ,xpath_md5 = '/root/vd/vi/fmd5/text()'


function getVid(_v){
  hu.getText(_v.orignalUrl,'utf-8',function(err,content){
      if(err){
        console.error(err);
        return;
      }
      var vid = content.replace(regex_1,'$1');
      console.log('获得tencent视频id : %s',vid);
      _v.setVid(vid);
  });
};

function resolv(_v){
  var plist = util.format(plistFormat,_v.vid);
  //console.log(plist);
  hu.getText(plist,'utf-8',function(err,content){
    if(err){
      console.error(err);
      return;
    }
    var doc = new dom().parseFromString(content)
    ,_url = select(doc, xpath_url)[0].data
    ,_length = select(doc, xpath_length)[0].data
    ,_md5 = select(doc, xpath_md5)[0].data
    //console.log(_url + _length + _md5);
    ,_suffix = '.'+_url.replace(/.*&fmt=(\w+)&.*/g,'$1');
    if(_suffix.length > 6) _suffix = '.flv';
    console.log(_suffix);
    _v.setSuffix(_suffix);
    _v.setCount(1);
    _v.addUrl(0,_url,_md5);
  });

}
exports.parseTitle = function(_v){

    var plist = util.format(plistFormat,_v.vid);
    //console.log(plist);
    hu.getText(plist,'utf-8',function(err,content){
        if(err){
            console.error(err);
            return;
        }
        var doc = new dom().parseFromString(content)
            ,_url = select(doc, xpath_url)[0].data
            ,_suffix = '.'+_url.replace(/.*&fmt=(\w+)&.*/g,'$1');
        if(_suffix.length > 6) _suffix = '.flv';
        var profile = {};
        profile.provier ='tencent';
        profile.types = [_suffix];
        _v.emit('title',profile);
    });
};
exports.titleEnable = true;
exports.resolv=resolv;
exports.getVid=getVid;
