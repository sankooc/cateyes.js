var events = require('events')
   ,util = require('util')
   ,hu = require('./httpUtil')
   ,fs = require('fs')
   ,ffmpeg =require('./ffmpeg')
   ,crypto = require('crypto')

function video(){
  events.EventEmitter.call(this);
  this.source=[];
  this.count;
  this.suffix;
  this.title;
  this.orignalUrl;
  this.provider;
  this.quality ='low';
  this.vid;
  this.state;
}
util.inherits(video,events.EventEmitter);


video.prototype.getLib = function(){
    return require('./'+this.provider);
}

video.prototype.addUrl = function(index,_url,md5){
    this.source[index] = {
        video:this,
        index:index,
        url:_url,
        md5: md5
    };
  this.validate();
}

video.prototype.setCount = function(count){
    this.count = count;
    this.update('+count',count);
}
video.prototype.setState = function(state){
    this.state = state;
    this.update('+state',state);
}
video.prototype.setQuality = function(quality){
    this.quality = quality;
    this.update('quality',quality);
}

video.prototype.setSuffix = function(suffix){
    if(suffix.charAt(0) != '.')
        suffix+='.';
    this.suffix = suffix;
    this.update('*suffix',suffix);
}

video.prototype.setTitle = function(title){
    if(this.title || !title)
        return;
    this.title = title;
    this.update('title',title);
}

video.prototype.setVid = function(vid){
    this.vid =vid;
    this.emit('vid');
    this.update('vid',vid);
}

video.prototype.update = function(param,val){
    var _data = {
        'key':param
       ,'val':val
    };
    this.emit('update',_data);
}


video.prototype.validate = function(){
  if(this.title && this.source.length == this.count){
      for(var i=0;i<this.source.length;i++){
          if(!this.source[i] || !this.source[i].url)
              return;
      }
    this.emit('validated',this.folder);
  }
}

video.prototype.error = function(msg){
  this.emit('error',msg);
}


video.prototype.getTitle = function(){
    this.on('vid',this.parseMetadata);
    this.parse();
}

video.prototype.download = function(folder){
  if(folder.charAt(folder.length-1) != '/'){
          folder += '/';
  }
  this.folder = folder;
  this.on('vid',this.parseResource);
  this.on('validated',this.downloadResource);
  this.parse();
}

video.prototype.parse = function(){
    try{
        if(this.vid){
            this.emit('vid');
        }else{
            this.getLib().getVid(this);
        }
    }catch(err){
        this.error(err);
    }
}

video.prototype.titleEnable = function(){
    return this.getLib().titleEnable;
}

video.prototype.parseMetadata = function(){
    this.getLib().parseMetadata(this);
}

video.prototype.parseResource = function(){
  this.getLib().resolv(this);
}

video.prototype.downloadResource = function(folder){
  if(!fs.existsSync(folder)){
      fs.mkdir(folder);
  }
  var target = folder + this.title + this.suffix;
  //TODO 文件校验
  if(fs.existsSync(target)){
      console.log('文件已存在');
      return;
  }
  var httpSet = new hu.HttpSet();
  httpSet.once('done',function(resource){
      resource.setState('downloaded');
      if(!fs.existsSync(folder + resource.title + resource.suffix)){
          console.log('start concating');
          resource.setState('merging');
          ffmpeg.concat(resource,folder);
      }else{
          console.log('已合并完成');
      }
      resource.setState('done');
  }).on('error',this.error);
  httpSet.doRequest(this,folder);
}

function getCheckSum(algorithm ,file){
  var shasum = crypto.createHash(algorithm)
  ,buffer = fs.readFileSync(file);
  shasum.update(buffer);
  return shasum.digest('hex');
}



module.exports = video;
