var hu    = require('./httpUtil');
var util  = require('util');
var defer = require("node-promise").defer;
var async = require('async');
var video = require('./video');

var vid_reg = /[\s\S]*var vid="(\d+)"[\S\s]*/gm;
var _plist = 'http://hot.vrs.sohu.com/vrs_flash.action?vid=';
var urlFormat = 'http://%s/?prot=%s&file=%s&new=%s';
var urlFormat2 = '%s%s?key=%s';

exports.getResource = function(report){
    var deferred = defer();
    hu.getJson(_plist + report.metadata.vid,function(err,content){
        if(err){
            deferred.reject('http request failed : '+err);
            return;
        }
        var resource = new video(report,deferred);
        var i=0;
        var count = content.data.clipsURL.length;
        resource.setCount(count);
        for(;i<count;i++){
            (function(content,i,resource){
                var host = content.allot
                    ,prot = content.prot
                    ,data = content.data
                    ,clips = data.clipsURL
                    ,suffixs = data.su
                    ,clip = clips[i]
                    ,suffix = clip.substring(clip.lastIndexOf('.')+1)
                    ,_url_1 = util.format(urlFormat,host,prot,clip,suffixs[i]);
                resource.setSuffix(suffix);
                hu.getText(_url_1,'utf-8',function(err,content){
                    if(err){
                        return;
                    }
                    var tokens = content.split('|');
                    var _url_2 = util.format(urlFormat2,
                        tokens[0].substring(0, tokens[0].length - 1)
                        ,suffixs[i]
                        ,tokens[3]);
                    resource.addUrl(i,_url_2);
                });
            })(content,i,resource);
        }

    });
    return deferred.promise;
}




exports.parseMetadata = function(_url){
    var deferred = defer();
    try{
        async.waterfall([
            function(cb) {
                hu.getText(_url,'utf-8',function(err,content){
                    cb(err,content.replace(vid_reg,'$1'));
                });
            },
            function(vid,cb) {
                hu.getJson(_plist + vid,function(err,content){
                    if(err){
                        cb('http request failed : '+err);
                        return;
                    }
                    var data = content.data
                        ,title = data.tvName;
                    cb(null,{
                        'title':title
                        ,'provider':'sohu'
                        ,'type':['mp4']
                        ,'vid':vid
                    });
                });
            }
        ], function (err, result) {
            if(err){
                deferred.reject(err);
                return;
            }
            deferred.resolve(result);
        });
    }catch(e){
        deferred.reject(e);
    }finally{
        return deferred.promise;
    }
}