var hu = require('./httpUtil')
   ,util = require('util')
   ,url_regex = /^http:\/\/www.56.com\/u\d+\/v_(\w+).html$|^http:\/\/www.56.com\/[\w\/]+\/(\w+).swf$/
   ,format = 'http://vxml.56.com/json/%s/?src=site'
   ,types = ["normal", "clear", "super"]
function getVid(_v){
  var _url = _v.orignalUrl;
  var vid = _url.replace(url_regex,'$1$2');
  _v.vid = vid;
  _v.emit('vid');
}
function resolv(_v){
  var plist = util.format(format,_v.vid);
  //console.log(plist);
  hu.getJson(plist,function(err,content){
    if(err){
      _v.error(err);
    }
    //TODO filtered by quality
    var title = content.info.Subject
       ,hd = content.info.hd
       ,type = types[hd-1]
       ,rfiles = content.info.rfiles
       ,rfile = rfiles[0].url
    _v.title = title;
    _v.suffix = '.flv';
    _v.setCount(1);
    _v.setUrl(rfile);
  });
}
exports.resolv=resolv;
exports.getVid=getVid;
