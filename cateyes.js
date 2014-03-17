var hu = require('./libs/httpUtil');
var util = require('util');
var fs = require('fs');
var logger = console;
var sohu = require('./libs/sohu');
var video = require('./libs/video');
var util = require('util');
var events = require('events');
var taskManager =require('./libs/taskManager');

//function download(_url,quality,folder,title){
//  var _v = createVideoFromURL(_url,quality,title);
//  _doDownload(_v,folder);
//  return _v;
//}
//
//function downloadByVid(provider,vid,quality,folder,title){
//  var _v = createVideoFromVid(provider,vid,quality,title);
//  _doDownload(_v,folder);
//  return _v;
//}

//function _doDownload(_v,folder){
//  _v.on('error',function(msg){
//    console.error(msg);
//  }).on('done',function(){
//    console.log('download %s complete',_v.title);
//  });
//  _v.download(folder);
//}

//function createVideoFromURL(_url,quality,title){
//    var _v = new video();
//    _v.setURL(_url);
//    _v.setProvider(getProvider(_url));
//    _v.setQuality(quality);
//    _v.setTitle(title);
//    _v.setState('init');
//    return _v;
//}
//
//function createVideoFromVid(provider,vid,quality,title){
//    var _v = new video();
//    _v.setState('init');
//    _v.setProvider(provider);
//    _v.setVid(vid);
//    _v.setQuality(quality);
//    _v.setTitle(title);
//    return _v;
//}
//var videos =[];

var youku_reg = /^http:\/\/v.youku.com\/v_show\/id_([\w=]+).html|^http:\/\/player.youku.com\/player.php\/sid\/([\w=]+)\/v.swf/
    ,sohu_reg = /v.sohu.com\//
    ,tencent_reg = /v.qq.com/
    ,v56_reg = /56.com/
    ,ku6_reg = /v.ku6.com/

function getProvider(_url){
    if(youku_reg.test(_url)) return 'youku';
    if(sohu_reg.test(_url)) return 'sohu';
    if(tencent_reg.test(_url)) return 'tencent';
    if(v56_reg.test(_url)) return 'v56';
    if(ku6_reg.test(_url)) return 'ku6';
}

exports.addToDownloadList=function(metadata,param){
    return taskManager.addToList(metadata,param);
}

exports.getURLMetadata = function(_url){
    var provider = require('./libs/'+getProvider(_url));
    return provider.parseMetadata(_url);
}

exports.getResource = function(report){
    var provider = require('./libs/'+report.metadata.provider);
    return provider.getResource(report);
}

exports.getActiveTask = function(_id){
    return taskManager.getActiveTask(_id);
}

function queryAllVideos(){
    var ret = [];
    videos.forEach(function(video){
        ret.push({
            'title':video.getTitle()
           ,'id':video.id

        });
    });
    return ret;
}

function queryVideoInfo(id){
    videos.forEach(function(video){
        if(video.id == id){
            return {
                'metadata':video.metadata,
                'data':video.data
            };
        }
    });
    return {};
}
//dep
function changeProcess(id, index, _status){

}







//exports.getTitleByVid =function(provider,vid,cb){
//    var _v = createVideoFromVid(provider,vid);
//    _v.on('error',function(msg){
//        console.error(msg);
//    }).on('title',function(profile){
//            cb(true,profile);
//        });
//    _v.getTitle();
//};

//
//exports.getMetadata =function(_url,cb){
//    var _v = createVideoFromURL(_url);
//    _v.on('error',function(msg){
//        console.error(msg);
//    }).on('title',function(profile){
//       cb(true,profile);
//    });
//    _v.resolve();
//};


exports.getProvider=getProvider;