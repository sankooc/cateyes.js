//var hu = require('./httpUtil')
//   ,util = require('util')
//
//var pattern_url = /[\s\S]*\/video\/(\d+)[\s\S]*/
//   ,pattren_title = /[\s\S]*title : "([^\"]+)",[\s\S]*"/
//   ,pattren_ll = /[\s\S]*videoUrl : '([^\"]+)'[\s\S]*/
//
//function getVid(_v){
//  hu.getText(_v.orignalUrl,'utf-8',function(err,content){
//    if(err){
//      _v.error(err);
//      return;
//    }
//    var vid = content.replace(pattern_url,'$1');
//    _v.vid = vid;
//    _v.emit('vid');
//  });
//}
//function resolv(_v){
//  //TODO
//
//}
//exports.resolv=resolv;
//exports.getVid=getVid;
