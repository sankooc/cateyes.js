var hu = require('./httpUtil');
var util = require('util');



var vid_reg = /[\s\S]*var vid="(\d+)"[\S\s]*/gm;
var _plist = 'http://hot.vrs.sohu.com/vrs_flash.action?vid=';
var urlFormat = 'http://%s/?prot=%s&file=%s&new=%s';
var urlFormat2 = '%s%s?key=%s';


function getVid(_v){
  hu.getText(_v.orignalUrl,'utf-8',function(err,content){
    if(err){
        _v.error(err);
      return;
    }
    var vid = content.replace(vid_reg,'$1');
    _v.setVid(vid);
    console.log('获得sohu视频id : %s',vid);
  });

};

function resolv(_v){
  var _url = _plist + _v.vid;
  hu.getJson(_url,function(err,content){
    if(err){
      _v.error('http request failed : %s',err);
      return;
    }
    console.log(_url);
    //console.log(content);
    var i=0
      ,host = content.allot
      ,prot = content.prot
      ,data = content.data
      ,title = data.tvName
      ,clips = data.clipsURL
      ,suffixs = data.su;
      _v.setTitle(title);
      console.log('video title:%s fragment count %d',_v.title,clips.length);
      _v.setCount(clips.length);
      for(;i<clips.length;i++){
        getUrls(_v,clips,host,prot,suffixs,i);
      }

  });
}


//function setUrl(_v,clip,host,prot,_suffix){
//  var suffix = clip.substring(clip.lastIndexOf('.')+1)
//     ,_url_1 = util.format(urlFormat,host,prot,clip,_suffix);
//  if(!_v.suffix){
//    _v.suffix = suffix;
//  }
//  hu.getText(_url_1,'utf-8',function(err,content){
//    if(err){
//       return;
//    }
//    var tokens = content.split('|');
//    var _url_2 = util.format(urlFormat2,
//                             tokens[0].substring(0, tokens[0].length - 1)
//                             ,_suffix
//                             ,tokens[3]);
//    _v.setUrl(_url_2);
//  });
//}

function getUrls(_v,clips,host,prot,suffixs,i){
  var clip = clips[i]
            ,suffix = clip.substring(clip.lastIndexOf('.')+1)
            ,_url_1 = util.format(urlFormat,host,prot,clip,suffixs[i]);
  _v.setSuffix('.'+suffix);
  hu.getText(_url_1,'utf-8',function(err,content){
    if(err){
       return;
    }
    var tokens = content.split('|');
    //console.log(suffixs[i]);
    var _url_2 = util.format(urlFormat2,
                             tokens[0].substring(0, tokens[0].length - 1)
                             ,suffixs[i]
                             ,tokens[3]);
    _v.addUrl(i,_url_2);
  });
};



exports.parseMetadata = function(_v){
    var _url = _plist + _v.vid;
    hu.getJson(_url,function(err,content){
        if(err){
            _v.error('http request failed : %s',err);
            return;
        }
        var data = content.data
           ,title = data.tvName;
        var profile = {};
        profile.title = title;
        profile.provider ='sohu';
        profile.types = ['mp4'];
        _v.emit('title',profile);
    });
};
exports.titleEnable = true;
exports.resolv=resolv;
exports.getVid=getVid;
