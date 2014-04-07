var util = require('util');
var fs = require('fs');
var events = require('events');
var logger = console;
var sohu = require('./provider/sohu');
var video = require('./video');
var util = require('util');
var taskManager =require('./taskManager');

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
    return 'shuoshu';
}

exports.addToDownloadList=function(metadata,param){
    return taskManager.addToList(metadata,param);
}

exports.getURLMetadata = function(_url){
    var provider = require('./provider/'+getProvider(_url));
    return provider.parseMetadata(_url);
}

exports.getResource = function(report){
    var provider = require('./provider/'+report.metadata.provider);
    return provider.getResource(report);
}

exports.getDetail=function(id){
    return taskManager.getDetail(id)
}

exports.getTask=function(con){
    return taskManager.getTask(con);
}

exports.getProvider=getProvider;