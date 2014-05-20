var util = require('util');
var fs = require('fs');
var events = require('events');
var logger = console;
var sohu = require('./provider/sohu');
var video = require('./video');
var util = require('util');
var HTTPX = require('./httpx')
var ffmpeg = require('./ffmpeg')
var taskManager =require('./taskManager');
var providerResolver = require('./util/providerResolver');

exports.addToDownloadList=function(metadata,param){
    return taskManager.addToList(metadata,param);
}

exports.getURLMetadata = providerResolver.getURLMetadata;

exports.getDetail=function(id){
    return taskManager.getDetail(id)
}

exports.getTask=function(con){
    return taskManager.getTask(con);
}


function task(id,callback){
    var key = 'cit_'+id
        ,context
        ,metadata,param,v
    async.auto({
        metadata: function(callback){
            client.hget(key,'metadata',callback)
        }
        ,param :function(callback){
            client.hget(key,'param',callback)
        }
        ,parse :['metadata','param',function(result,callback){
            if(!result.metadata || !result.param){
                callback('empty arguments')
                return;
            }
            var provider = require('./provider/'+result.metadata.provider);
            metadata = JSON.parse(result.metadata)
            param = JSON.parse(result.metadata)
            context = {
                vid : metadata.vid
                ,type : param.type
            }
            provider.getResource(context,callback)
        }]
        ,download :['parse',function(result,callback){
            v = new video(metadata,param,context.sources)
            HTTPX.download(v,callback)
        }]
        ,merge :['download',function(result,callback){
            v.setState('done');
            switch(result.download){
                case 'complete':
                    callback()
                    break;
                default:
                    console.log('start concating');
                    ffmpeg.concat(v,callback);
                    break
            }
        }]
    },callback);
}
