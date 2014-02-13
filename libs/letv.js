var hu = require('./httpUtil')
   ,util = require('util')
   ,select = require('xpath.js')
   ,dom = require('xmldom').DOMParser

var pattern_ = /[\s\S]*vid:(\d+),[\s\S]*/
   ,xpath_title = '/root/tal/text()'
   ,xpath_json = '/root/mmsJson/text()'
   ,format = 'http://app.letv.com/v.php?id='
function getVid(_v){
  hu.getText(_v.orignalUrl,'utf-8',function(err,content){
    if(err){
      _v.error(err);
      return;
    }
    var vid = content.replace(pattern_,'$1');
    _v.vid = vid;
    _v.emit('vid');
  });
}
function resolv(_v){
  var plist = format+_v.vid;
  hu.getText(plist,'utf-8',function(err,content){
    if(err){
      _v.error(err);
      return;
    }
    content += '</root>';
    var doc = new dom().parseFromString(content)
    ,title = select(doc, xpath_title)[0].data
    ,_json = select(doc, xpath_json)[0].data
    ,data = JSON.parse(_json)
    ,_url = data.bean.video[0].url
    _v.title = title;
    //suffix
    _resolv(_url,_v);
  });
}

function _resolv(_url,_v){
  hu.getJson(_url,function(err,content){
    if(err){
      _v.error(err);
      return;
    }
    _url = content.location;
    _v.suffix = '.flv';
    _v.setCount(1);
    _v.setUrl(_url);
  });
}

exports.resolv=resolv;
exports.getVid=getVid;
