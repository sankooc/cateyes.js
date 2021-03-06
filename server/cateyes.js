var util = require('util');
var fs = require('fs');
var events = require('events');
var logger = console;
var sohu = require('./provider/sohu');
var video = require('./video');
var util = require('util');
var uuid = require('node-uuid')
var HTTPX = require('./httpx')
var ffmpeg = require('./ffmpeg')
var providerResolver = require('./util/providerResolver');
var redis = require('redis')
    ,async = require('async')
    ,redisPool = require('./redispool')


var prefix = 'cit_'
    ,event = 'videoRe'
    ,pool = redisPool.getRedisPoolInstance()
    ,store={}

exports.getURLMetadata = providerResolver.getURLMetadata;

exports.publishTask=function(metadata,param,callback){
    var id = uuid.v4()
    var client = redis.createClient()
    async.waterfall([
        function(callback){
            client.hmset(prefix+id,'metadata',JSON.stringify(metadata),'param',JSON.stringify(param),callback)
        }
        ,function(rcode,callback){
            client.publish(event,id,callback)
        }
        ,function(count,callback){
            console.log('publish %s users',count)
            client.quit(callback)
        }
    ],callback)
}


exports.subscript=function(metadata,param,id,callback){
    var context,v
    async.waterfall([
        function(callback){
            var provider = require('./provider/'+metadata.provider);
            context = {
                metadata:metadata
                ,param:param
                ,vid : metadata.vid
                ,type : param.type
            }
            provider.getResource(context,callback)
        }
        ,function(callback){
            v = new video(metadata,param,context.sources)
            store[id] = v
            HTTPX.download(v,callback)
        }
        ,function(status,callback){
            v.setState('done');
            switch(status){
                case 'complete':
                    callback()
                    break;
                default:
                    if(typeof status=='function') callback = status
                    console.log('start concating');
                    ffmpeg.concat(v,callback);
                    break
            }
        }

    ],function(err,result){
        delete store[id]
//        var folder = v.getFolder() + v.getTitle()
//        if(fs.existsSync(folder))
//             fs.rmdirSync(folder)
        callback(err,result)
    })
}
deleteFolderRecursive = function(path,callback) {
    if(!fs.existsSync(path)) return callback()
    async.waterfall([
        function(callback){
            fs.readdir(path,callback);
        }
        ,function(files,callback){
            async.forEach(files,function(file,callback){
                var curPath = path + "/" + file;
                if(fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath,callback);
                } else { // delete file
                    fs.unlink(curPath,callback);
                }
            },callback)
        },function(ret,callback){
            fs.rmdir(path,callback);
        }
    ],callback)
};
exports.subscriptTask=function(callback){
    var client = redis.createClient()
    client.subscribe(event)
    client.on('message',function(channel,cid){
        _download(prefix+cid)
    })
    var client2 = redis.createClient()
    async.waterfall([
        async.apply(client2.keys.bind(client2),'*')
        ,function(ids,callback){
            client2.quit()
            async.each(ids,function(cid,callback){
                _download(cid,callback)
            },callback)
        }
    ],callback)
    return client;
}

function _download(id,callback){
    var key = id
        ,context
        ,callback = callback||function(){}
        ,metadata,param,v
    async.auto({
        redis : function(callback){
            pool.acquire(callback)
        }
        ,metadata: ['redis',function(callback,result){
            result.redis.hget(key,'metadata',callback)
        }]
        ,param :['redis',function(callback,result){
            result.redis.hget(key,'param',callback)
        }]
        ,parse :['metadata','param',function(callback,result){
            if(!result.metadata || !result.param){
                callback('empty arguments')
                return;
            }
            metadata = JSON.parse(result.metadata)
            param = JSON.parse(result.param)
            var provider = require('./provider/'+metadata.provider);
            context = {
                vid : metadata.vid
                ,type : param.type
            }
            provider.getResource(context,callback)
        }]
        ,download :['parse',function(callback,result){
            v = new video(metadata,param,context.sources)
            HTTPX.download(v,callback)
        }]
        ,merge :['download',function(callback,result){
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
        ,remove:['merge',function(callback,result){
            result.redis.del(key,callback)
        }]

    },function(err,result){
        pool.release(result.redis)
        callback(err,result)
    });
}
