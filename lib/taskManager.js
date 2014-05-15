/**
 * Created by sankooc on 14-3-9.
 */
var redis = require("redis"),
    monitor = redis.createClient(),
    client = redis.createClient(),
    async = require('async'),
    mongo = require('mongous').Mongous,
    db = mongo('cateyes.video'),
    uuid = require('node-uuid'),
    HTTPX = require('./httpx'),
    defer = require("node-promise").defer,
    util = require("util"),
    ffmpeg = require('./ffmpeg'),
    waitQueue = 'waitQ',
    onQueue='onQ',
    tasks = {};

client.on('connect',function(){
    console.log('connect');

});

monitor.on('error',function(error){
    if('send_command: second argument must be an array' == error.message){
        monitor.monitor(function (err, res) {
        });
    }
});

monitor.on("monitor", function (time, args) {
    console.log(time + ": " + args.join(' '));
    switch(args[0]){
        case 'lpush':
        case 'lrem':
            updateList();
            break
        case 'rpoplpush':
            break;
    }
});
monitor.monitor(function (err, res) {
    console.log("Entering monitoring mode.");
});


var _init = function(){
    async.waterfall([
        function(cb) {
            client.llen(onQueue,cb);
        },
        function(ret,cb) {
            client.lrange(onQueue,0,ret,cb);
        },
        function(ret,cb) {
            async.each(ret, function (item, callback) {
                doDownload(item);
                callback(null);
            }, function (err) {
                cb(err);
            });
        }
    ], function (err, result) {
        if(err){
            return;
        }
    });
}

if(_init){
    _init();
    _init = null;
}
function updateList(){
    async.waterfall([
        function(cb) {
            client.llen(waitQueue,function(err,obj){
                cb(err,{
                    'wait':obj
                });
            });
        },
        function(ret,cb) {
            client.llen(onQueue,function(err,obj){
                ret.on = obj;
                cb(err,ret);
            });
        }
    ], function (err, result) {
        if(err){
            console.error(err);
            return;
        }
        if(result.wait >0 && result.on < 10){
            client.rpoplpush(waitQueue,onQueue,function(err,obj){
                if(err){
                    return;
                }
                doDownload(obj);
            });
        }
    });
}
var fs = require('fs');

function _remove(_id){
    delete tasks[_id];
    console.log('remove %s in %s list',onQueue,_id);
    client.lrem(onQueue,0,_id);
    db.update({
        '_id':_id
    },{
        '$set':{'state':'done'}
    });
}

function _download(resource){
    HTTPX.download(resource,function(err,status){
        if(err){
            resource.setState('error');
        }else{
            switch(status){
                case 'complete':
                    break;
                default:
                    console.log('start concating');
                    ffmpeg.concat(resource);
                    break
            }
            resource.setState('done');
        }
        _remove(resource.report._id);
    })
}

function doDownload(_id){
    db.find({'_id':_id},function(doc){
        if(doc.numberReturned < 1)
            return;
        var report = doc.documents[0];
        var provider = require('./provider/'+report.metadata.provider);
        provider.getResource(report).then(
            function(resource){
                tasks[report._id] = report;
                db.update({
                    '_id':report._id
                },{
                    '$set':{'state':'active'}
                });
                _download(resource);
            },function(err){
                console.error(err);
                updateList();
            }
        );
    });
}

function _getTask(queue){
    var deferred = defer();
    async.waterfall([
        function(cb) {
            client.llen(queue,function(err,obj){
                cb(err,obj);
            });
        },
        function(ret,cb) {
            client.lrange(queue,0,ret,function(err,obj){
                cb(err,obj);
            });
        },
        function(ret,cb) {
            var list =[];
            async.each(ret, function (item, callback) {
                db.find({'_id':item},function(doc){
                    if(doc.numberReturned > 0){
                        list.push(doc.documents[0]);
                    }
                    callback(null);
                });
            }, function (err) {
                cb(err,list);
            });
        }
    ], function (err, result) {
        if(err){
            deferred.reject(err);
            return;
        }
        deferred.resolve(result);
    });
    return deferred.promise;
}


exports.getWaitTasks = function(){
    return _getTask(waitQueue);
}

exports.getDetail=function(id){
    var deferred = defer();
    var rep = tasks[id];
    if(rep){
        deferred.resolve({
           '_id':rep._id
            ,'state':rep.state
            ,'data':rep.data
            ,'metadata':rep.metadata
            ,'parameter':rep.parameter
        });
    }else{
        deferred.resolve({});
    }
    return deferred.promise;
}

function convert(report){
    return {
        '_id':report._id
        ,'state':report.state
        ,'title':report.parameter.title || report.metadata.title
    };
}

exports.getTask = function(con){
    var deferred = defer();
    if(con.state == 'active'){
        var ret = [];
        for(var k in tasks){
            ret.push(convert(tasks[k]));
        }
        deferred.resolve(ret);
    }else{
        db.find(con,function(doc){
            var ret=[];
            for(var i=0;i<doc.documents.length;i++){
                ret.push(convert(doc.documents[i]));
            }
            deferred.resolve(ret);
        });
    }
    return deferred.promise;
}

exports.addToList = function(metadata,param){
    var data = {
        '_id':uuid.v4(),
        'metadata':metadata,
        'parameter':param,
        'state':'init'
    };
    db.save(data);
    client.lpush(waitQueue,data._id);
}
