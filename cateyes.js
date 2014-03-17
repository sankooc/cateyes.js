var hu = require('./libs/httpUtil');
var util = require('util');
var fs = require('fs');
var logger = console;
var sohu = require('./libs/sohu');
var video = require('./libs/video');
var util = require('util');
var events = require('events');
var taskManager =require('./libs/taskManager');

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


exports.getProvider=getProvider;