var events = require('events')
    ,util = require('util')
    ,crypto = require('crypto')
    ,fs = require('fs');
var userHome = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/Movies/Cateyes/';

function video(metadata,param,sources){
    this.metadata = metadata
    this.param = param
    this.data = {
        'count':sources.length,
        'suffix':param.type||'flv',//后缀
        'checksum':'',
        'source':sources
    }
    this.setState('init')
}


video.prototype.getMetadata = function(){
    return this.metadata;
}

video.prototype.getParameter = function(){
    return this.param;
}

video.prototype.getFolder=function(){
    return this.getParameter().folder||userHome;
}

video.prototype.getData = function(){
    return this.data;
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
    this.state = state;
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

video.prototype.isExist=function(){
    if(fs.existsSync(this.getTarget())){
        return true;
    }
    return false;
}

module.exports = video;
