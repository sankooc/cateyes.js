var events = require('events')
    ,util = require('util')
    ,crypto = require('crypto')
    ,fs = require('fs');
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
    this.report.state = state;
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
