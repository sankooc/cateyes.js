/**
 * Created by sankooc on 14-5-16.
 */


var redis = require("redis")
    ,async = require('async')
    ,HTTPX = require('./lib/httpx')
    ,ffmpeg = require('./lib/ffmpeg')
    ,resovler = require('./lib/util/providerResolver')

var client = redis.createClient();

function subscript(id,callback){
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




//client.on('pmessage',function(patten,channel,msg){
//    console.log(msg)
//})


//var client2 = redis.createClient();
//
//client2.publish('ms','m2',function(err,ret){
////    console.error(err)
////    console.info(ret)
//})
//
//client2.quit()
