var util = require('util');
var HTTPX = require('./httpx');
var defer = require("node-promise").defer;
var video = require('./video');
var async = require('async');
var plist = 'http://v.youku.com/player/getPlayList/VideoIDS/';
var TOKEN = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890";
var url_format = 'http://f.youku.com/player/getFlvPath/sid/%s_%s/st/%s/fileid/%s%s%s?K=%s&ts=%s';
var youku_reg = /^http:\/\/v.youku.com\/v_show\/id_([\w=]+).html|^http:\/\/player.youku.com\/player.php\/sid\/([\w=]+)\/v.swf$/;
exports.regex=youku_reg;

function getRandom(seed,weight){
	return Math.round(seed + Math.random()*weight);
}

function getSerialId() {
	return  new Date().getTime()+''+getRandom(1000,999)+''+getRandom(1000,9000);
}

function getMixString(seed) {
	var _seed = seed;
	var queue = [];
	for (var i = 0 ;i<TOKEN.length;i++) {
		queue.push(TOKEN.charAt(i));
	}
	var len = queue.length;
    var ret = [];
	for (var i = 0; i < len; ++i) {
		_seed = (_seed * 211 + 30031) & 0xffff;
		var index = _seed * queue.length >> 16;
		ret[i] = queue[index];
		queue.splice(index,1);
	}
	return ret;
}
function _isURL(_url){
    return true;
}

exports.getResource = function(report){
    var deferred = defer();
    HTTPX.getText(plist + report.metadata.vid).then(function(text){
        var data = JSON.parse(text).data[0];
        if(!data){
            deferred.reject('cannot get Metadata');
            return;
        }
        if(data.error){
            deferred.reject(data.error);
            return;
        }
        var seed = data.seed,type = 'mp4' ==report.parameter.type?'mp4':'flv';
        var streamFileids = data.streamfileids[type];
        if(!streamFileids){
            deferred.reject('no types');
            return;
        }
        var resource = new video(report,deferred);
        var ids = streamFileids.split('*'),mstr = getMixString(seed),tmp = [],i;
        for(i=0;i<ids.length;i++){
            tmp[i] = mstr[parseInt(ids[i])];
        }
        var id = tmp.join('') , id_pre = id.slice(0, 8) , id_end = id.slice(10)
        resource.setSuffix(type)
        resource.setCount(data.segs[type].length)
        var func = [];

        var _url_f = 'http://f.youku.com/player/getFlvPath/sid/'+getSerialId()+'_%s/st/'+type
            +'/fileid/'+id_pre+'%s'+id_end+'?K=%s&ts=%s';
        for(i =0;i<data.segs[type].length;i++){
            var fun =(function(format,resource,data,i){
                return function(cb){
                    var seg = data.segs[type][i]
                    var no = '0'+parseInt(seg.no).toString(16);
                    //util.format(url_format,getSerialId(),no,type,id_pre,no.toUpperCase(),id_end,seg.k,seg.seconds);
                    resource.addUrl(i,util.format(format,no,no.toUpperCase(),seg.k,seg.seconds));
                    cb(null);
                };
            })(_url_f,resource,data,i);
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
        deferred.reject(err);
    });
    return deferred.promise;
}


exports.parseMetadata = function(_url){
    var deferred = defer();
    try{
        var vid = _url.replace(youku_reg,'$1$2');
        if(!vid)
            throw new Error('cannot get vid');

        HTTPX.getText(plist + vid).then(function(text){
            var data = JSON.parse(text).data[0];
            if(!data){
                deferred.reject('cannot get Metadata');
                return;
            }
            if(data.error){
                deferred.reject(data.error);
                return;
            }
            deferred.resolve({
                'title':data.title
                ,'type':data.streamtypes
                ,'vid':vid
                ,'provider':'youku'
            });
        },function(err){
            deferred.reject(err);
        });
    }catch(e){
        deferred.reject(e);
    }finally{
        return deferred.promise;
    }
}