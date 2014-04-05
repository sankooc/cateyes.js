var events = require('events')
   ,util = require('util')
   ,crypto = require('crypto')
    ,fs = require('fs');

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
var userHome = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/Movies/cateyes/';
function video(report){
    this.report = report;
    this.report.data = {
        'count':0,//碎片数量
        'suffix':'flv',//后缀
        'checksum':'',
        'source':[]//视频碎片
    }
    this.setState('init')
//    this.deferred = deferred;
}


video.prototype.getMetadata = function(){
    return this.report.metadata;
}

video.prototype.getParameter = function(){
    return this.report.parameter;
}

video.prototype.getFolder=function(){
    return this.getParameter().folder||userHome;
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
}
video.prototype.setCount = function(count){
    this.getData().count = count;
}
video.prototype.setState = function(state){
    this.report.status = state;
}
video.prototype.getSource=function(){
    return this.getData().source;
}
video.prototype.getSuffix = function(){
    return this.getData().suffix;
}
video.prototype.setSuffix = function(suffix){
    this.getData().suffix = suffix;
}

video.prototype.getTitle=function(){
    return this.getParameter().title||this.getMetadata().title;
}

video.prototype.getTarget = function(){
    return this.getFolder()+this.getTitle()+ '.' +this.getData().suffix;
}


//video.prototype.validate = function(){
//  if(this.getTitle() && this.getData().source.length == this.getData().count){
//      for(var i=0;i<this.getData().source.length;i++){
//          if(!this.getData().source[i] || !this.getData().source[i].url)
//              return;
//      }
//      this.deferred.resolve(this);
//  }
//}

video.prototype.isExist=function(){
    if(fs.existsSync(this.getTarget())){
        return true;
    }
    return false;
}

module.exports = video;
