var events = require('events')
   ,util = require('util')
   ,hu = require('./httpUtil')
//   ,fs = require('fs')
//   ,ffmpeg =require('./ffmpeg')
   ,crypto = require('crypto')
//   ,uuid = require('node-uuid')
//   ,taskManager =require('taskManager')

var youku_reg = /^http:\/\/v.youku.com\/v_show\/id_([\w=]+).html$|^http:\/\/player.youku.com\/player.php\/sid\/([\w=]+)\/v.swf$/
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

function video(report,deferred){
    this.report = report;
    this.report.data = {
        'count':0,//碎片数量
        'suffix':'flv',//后缀
        'checksum':'',
        'source':[]//视频碎片
    }
    this.deferred = deferred;
}


video.prototype.getMetadata = function(){
    return this.report.metadata;
}

video.prototype.getParameter = function(){
    return this.report.parameter;
}

video.prototype.getData = function(){
    return this.report.data;
}

video.prototype.addUrl = function(index,_url,md5){
    this.getData().source[index] = {
        "index":index,
        "url":_url,
        "checksum": md5
    };
    this.validate();
}

//video.prototype.setURL = function(_url){
//    this.url = _url;
//}

video.prototype.setCount = function(count){
    this.getData().count = count;
}
video.prototype.setState = function(state){
    this.status = state;
}
video.prototype.setQuality = function(quality){
    this.getData().type = quality;
}

video.prototype.getSuffix = function(){
    return this.getData().suffix;
}
video.prototype.setSuffix = function(suffix){
    this.getData().suffix = suffix;
}

//video.prototype.setTitle = function(title){
//    this.data.title = title;
//}

video.prototype.getTitle=function(){
    return this.getParameter().title||this.getMetadata().title;
}

video.prototype.getTarget = function(){
    return this.getParameter().folder + this.getTitle() + '.' +this.getData().suffix;
}

//video.prototype.setVid = function(vid){
//    this.metadata.vid =vid;
//    this.emit('vid');
//}


video.prototype.validate = function(){
  if(this.getTitle() && this.getData().source.length == this.getData().count){
      for(var i=0;i<this.getData().source.length;i++){
          if(!this.getData().source[i] || !this.getData().source[i].url)
              return;
      }
      this.deferred.resolve(this);
  }
}

//video.prototype.error = function(msg){
//  this.emit('error',msg);
//}

/*

fixit catch exception
* */
//video.prototype.download = function(param){
//    this.on('validated',this._downloadResource);
//    this.parseResource(param);
//}
//
//video.prototype.parseMetadata = function(){
//  this.provider.resolve(this);
//}
//
//video.prototype.parseResource = function(param){
//    this.parameter = param;
//    this.on('metadata',this.parse);
//    this.parseMetadata();
//}
//
//
//video.prototype.parse = function(){
//    if(this.next)
//        this.next();
//}
//
//
//video.prototype._downloadResource = function(){
//    if(!fs.existsSync(this.parameter.folder)){
//        fs.mkdir(this.parameter.folder);
//    }
//    taskManager.addlist(this);
//    var target = this.parameter.folder + this.getTitle() + '.' +this.data.suffix;
//    //TODO 文件校验
//    if(fs.existsSync(target)){
//        console.log('文件已存在');
//        this.error('文件已存在');
//        return;
//    }
//    var httpSet = new hu.HttpSet(this);
//    httpSet.once('done',function(resource){
//        resource.setState('downloaded');
//        try{
//            if(!fs.existsSync(folder + resource.title + resource.suffix)){
//                console.log('start concating');
//                resource.setState('merging');
//                ffmpeg.concat(resource,folder);
//            }else{
//                console.log('已合并完成');
//            }
//            resource.setState('done');
//        }catch(e){
//
//        }
//    }).on('error',this.error);
//    httpSet.doRequest();
//}
//
//function getCheckSum(algorithm ,file){
//  var shasum = crypto.createHash(algorithm)
//  ,buffer = fs.readFileSync(file);
//  shasum.update(buffer);
//  return shasum.digest('hex');
//}



module.exports = video;
