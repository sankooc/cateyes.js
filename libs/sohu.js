var util  = require('util');
var defer = require("node-promise").defer;
var async = require('async');
var video = require('./video');
var HTTPX = require('./httpx');

var vid_reg = /[\s\S]*var vid="(\d+)"[\S\s]*/gm;
var _plist = 'http://hot.vrs.sohu.com/vrs_flash.action?vid=';
var urlFormat = 'http://%s/?prot=%s&file=%s&new=%s';
var urlFormat2 = '%s%s?key=%s';

exports.getResource = function(report){
    var deferred = defer();

    HTTPX.getText(_plist + report.metadata.vid).then(function(text){
        var content = JSON.parse(text);
        var resource = new video(report);
        var i=0;
        var count = content.data.clipsURL.length;
        resource.setCount(count);
        var func =[];
        for(;i<count;i++){
            var fun = (function(content,i,resource){
                var host = content.allot
                    ,prot = content.prot
                    ,data = content.data
                    ,clips = data.clipsURL
                    ,suffixs = data.su
                    ,clip = clips[i]
                    ,suffix = clip.substring(clip.lastIndexOf('.')+1)
                    ,_url_1 = util.format(urlFormat,host,prot,clip,suffixs[i]);
                resource.setSuffix(suffix);
                return function(cb){
                    HTTPX.getText(_url_1).then(function(content){
                        var tokens = content.split('|');
                        var _url_2 = util.format(urlFormat2,
                            tokens[0].substring(0, tokens[0].length - 1)
                            ,suffixs[i]
                            ,tokens[3]);
                        resource.addUrl(i,_url_2);
                        cb(null);
                    },function(err){
                        cb('resolve url failed '+_url_1);
                    });
                }
            })(content,i,resource);
            func.push(fun);
        }
        async.parallel(func,function(err){
            if(err){
                deferred.reject(err);
                return;
            }
            deferred.resolve(resource);
        })

    },function(err){
        deferred.reject('http request failed : '+err);
    });
    return deferred.promise;
}

createFun = function(vid,done,error){
    return function(){
        HTTPX.getText(_plist + vid).then(function(content){
            var data = content.data
            done(data);
        },error);
    }
}

exports.parseMetadata = function(_url){
    var deferred = defer();
    var err = function(err){
        deferred.reject(err);
    }
    try{
        async.waterfall([
            function(cb) {
                HTTPX.getText(_url).then(function(content){
                    cb(null,content.replace(vid_reg,'$1'));
                },function(err){
                    cb(err);
                })
            }
        ], function (err, vid) {
            if(err){
                deferred.reject(err);
                return;
            }
            HTTPX.getText(_plist + vid).then(function(text){
                var content = JSON.parse(text);
                var data = content.data
                    ,title = data.tvName;
                deferred.resolve({
                    'title':title
                    ,'provider':'sohu'
                    ,'type':['mp4']
                    ,'vid':vid
                });
            },err);
        });
    }catch(e){
        deferred.reject(e);
    }finally{
        return deferred.promise;
    }
}