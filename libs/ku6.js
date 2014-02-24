var hu = require('./httpUtil')
   ,util = require('util')

var pattern_url = /[\s\S]*\/video\/(\d+)[\s\S]*/
   ,pattren_title = /[\s\S]*title : "([^\"]+)",[\s\S]*"/
   ,pattren_ll = /[\s\S]*videoUrl : '([^\"]+)'[\s\S]*/

function getVid(_v){
  var vid = _v.orignalUrl.replace(/.*\/([^\/]+).html/g,'$1');
    _v.setVid(vid);
}
function resolv(_v){
  var plist = 'http://v.ku6.com/fetchVideo4Player/'+_v.vid+'.html';
  console.log(plist);
  hu.getJson(plist,function(err,content){
    if(err){
      _v.error(err);
    }
    var _url = content.data.f
       ,title = content.data.t
    _v.setTitle(title);
    _v.setCount(1);
    _v.addUrl(0,_url);
  });
}
exports.parseMetadata = function(_v){
    var plist = 'http://v.ku6.com/fetchVideo4Player/'+_v.vid+'.html';
    console.log(plist);
    hu.getJson(plist,function(err,content){
        if(err){
            _v.error(err);
        }
        var title = content.data.t
        var profile = {};
        profile.title = title;
        profile.provider ='ku6';
        profile.types = ['flv'];
        _v.emit('title',profile);
    });
};
exports.resolv=resolv;
exports.getVid=getVid;
