/**
 * Created by sankooc on 14-5-16.
 */


var redis = require("redis"),
    async = require('async')
    resovler = require('./lib/util/providerResolver')

//var client = redis.createClient();
//client.subscribe('ms');
//
//client.on("message", function (channel, msg) {
//    console.log(msg)
//    client.quit()
//});

function subscript(id){
    var key = 'cit_'+id
        ,context
        ,metadata,param
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
        }
        ]
    },function(err,result){});
    client.hget(key,'metadata');

}
var video = require('./lib/video')
function download(metadata,param,callback){
    var context = {
        vid : metadata.vid
        ,type : param.type
    }
    async.waterfall([
        async.apply(resovler.getResource,context)
        ,function(result,callback){
            var v = new video(metadata,param,context.sources)

        }
    ],function(error,result){

    });
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
