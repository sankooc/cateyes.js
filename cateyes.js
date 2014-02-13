var hu = require('./libs/httpUtil');
var util = require('util');
var fs = require('fs');
var logger = console;
var sohu = require('./libs/sohu');
var video = require('./libs/video');
var util = require('util');
var events = require('events');

var youku_reg = /^http:\/\/v.youku.com\/v_show\/id_([\w=]+).html$|^http:\/\/player.youku.com\/player.php\/sid\/([\w=]+)\/v.swf$/
   ,sohu_reg = /v.sohu.com\//
   ,tencent_reg = /v.qq.com/
   ,v56_reg = /56.com/
   ,yyt_reg = /www.yinyuetai.com/
   ,leshi_reg = /letv.com/
   ,ku6_reg = /v.ku6.com/


function getProvider(_url){
  if(youku_reg.test(_url)) return 'youku';
  if(sohu_reg.test(_url)) return 'sohu';
  if(tencent_reg.test(_url)) return 'tencent';
  if(v56_reg.test(_url)) return 'v56';
  if(leshi_reg.test(_url)) return 'letv';
  if(ku6_reg.test(_url)) return 'ku6';
  if(yyt_reg.test(_url)) return 'yyt';
}

function download(_url,quality,folder,title){
  var _v = createVideoFromURL(_url,quality,title);
  _doDownload(_v,folder);
  return _v;
}

function downloadByVid(provider,vid,quality,folder,title){
  var _v = createVideoFromVid(provider,vid,quality,title);
  _doDownload(_v,folder);
  return _v;
}

function _getTitle(_v,cb){
    _v.on('error',function(msg){
        console.error(msg);
    }).on('title',function(title){
            cb(title);
    });
    _v.getTitle();
}

function _doDownload(_v,folder){
  _v.on('error',function(msg){
    console.error(msg);
  }).on('done',function(){
    console.log('download %s complete',_v.title);
  });
  _v.download(folder);
}

function createVideoFromURL(_url,quality,title){
    var _v = new video();
    _v.orignalUrl = _url;
    _v.provider = getProvider(_url);
    _v.setQuality(quality);
    _v.setTitle(title);
    _v.setState('init');
    return _v;
}

function createVideoFromVid(provider,vid,quality,title){
    var _v = new video();
    _v.setState('init');
    _v.provider = provider;
    _v.setVid(vid);
    _v.setQuality(quality);
    _v.setTitle(title);
    return _v;
}

function eyes(){
    events.EventEmitter.call(this);
    this.videos = [];
}
util.inherits(eyes,events.EventEmitter);

eyes.prototype.getVideos = function(){
    return this.videos;
}
eyes.prototype.addVideo = function(url,quality,folder,title){
    var v = download(url,quality,folder,title);
    this.videos.push(v);
    this.emit('add',v);
}

eyes.prototype.addVideoByVid = function(provider,vid,quality,folder,title){
    var v = downloadByVid(provider,vid,quality,folder,title);
    this.videos.push(v);
    this.emit('add',v);
}


function _data(key,val){
    return {
        'key':key,
        'val':val
    }
}

function monitor(ws){
    this.ws = ws;
    this.video;
    var _this = this;
    this.state = true;
    this.eventHandler = function(data){
        if(!_this.state){
            return;
        }
        try{
            ws.send(JSON.stringify(data));
        }catch(e){
            console.error(e);
        }
    };
}

monitor.prototype.close = function(){
    this.state = false;
    this.off();
}

monitor.prototype.on = function(video){
    this.video =video;
    this.video.on('update',this.eventHandler);
    this.eventHandler(_data('+title',video.title));
    this.eventHandler(_data('+suffix',video.suffix));
    this.eventHandler(_data('+folder',video.folder));
    this.eventHandler(_data('+state',video.state));
    this.eventHandler(_data('+count',video.count));
    for(var i =0;i<video.source.length;i++){
        var s = video.source[i];
        this.eventHandler({
             'key':'+source'
            ,'index':s.index
            ,'current':s.current
            ,'total':s.total
        });
    }
}

monitor.prototype.off = function(){
    console.log('clear listener');
    if(this.video){
        this.video.removeListener('update',this.eventHandler);
    }
}


exports.getTitleByVid =function(provider,vid,cb){
    var _v = createVideoFromVid(provider,vid);
    _v.on('error',function(msg){
        console.error(msg);
    }).on('title',function(profile){
            cb(true,profile);
        });
    _v.getTitle();
};


exports.getTitle =function(_url,cb){
    var _v = createVideoFromURL(_url);
    if(!_v.provider){
        return;
    }
//    if(!_v.titleEnable()){
//        cb(false);
//        return;
//    }
    _v.on('error',function(msg){
        console.error(msg);
    }).on('title',function(profile){
       cb(true,profile);
    });
    _v.getTitle();
};

exports.createVideoFromVid=createVideoFromVid;
exports.createVideoFromURL=createVideoFromURL;
exports.getProvider=getProvider;
exports.downloadByVid=downloadByVid;
exports.download=download;
exports.monitor = monitor;
exports.eyes = eyes;