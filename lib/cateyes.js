var util = require('util');
var fs = require('fs');
var events = require('events');
var logger = console;
var sohu = require('./provider/sohu');
var video = require('./video');
var util = require('util');
var taskManager =require('./taskManager');
var providerResolver = require('./util/providerResolver');

exports.addToDownloadList=function(metadata,param){
    return taskManager.addToList(metadata,param);
}

exports.getURLMetadata = providerResolver.getURLMetadata;

//exports.getResource = function(report){
//    var provider = require('./provider/'+report.metadata.provider);
//    return provider.getResource(report);
//}

exports.getDetail=function(id){
    return taskManager.getDetail(id)
}

exports.getTask=function(con){
    return taskManager.getTask(con);
}

//exports.getProvider=getProvider;