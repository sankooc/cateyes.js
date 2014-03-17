var util = require('util');
var hu = require('./httpUtil');
var constans = require('./constans');
var defer = require("node-promise").defer;
var video = require('./video');
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
    var playlistUrl = plist + report.metadata.vid;
    hu.getJson(playlistUrl,function(err,content){
        if(err){
            deferred.reject(err.tostring());
            return;
        }
        var data = content.data[0];
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
        var resource = new video(report,deferred);
        if(!streamFileids){
            deferred.reject('no types');
            return;
        }
        var ids = streamFileids.split('*'),mstr = getMixString(seed),tmp = [],i;
        for(i=0;i<ids.length;i++){
            tmp[i] = mstr[parseInt(ids[i])];
        }
        var id = tmp.join('') , id_pre = id.slice(0, 8) , id_end = id.slice(10);
        resource.setSuffix(type);
        resource.setCount(data.segs[type].length);
        for(i =0;i<data.segs[type].length;i++){
            var seg = data.segs[type][i],no = '0'+parseInt(seg.no).toString(16);
            resource.addUrl(i,util.format(url_format,getSerialId(),no,type,id_pre,no.toUpperCase(),id_end,seg.k,seg.seconds));
        }
    });
    return deferred.promise;
}


exports.parseMetadata = function(_url){
    var deferred = defer();
    try{
        var vid = _url.replace(youku_reg,'$1$2');
        if(!vid)
            throw new Error('cannot get vid');
        var playlistUrl = plist + vid;
        hu.getJson(playlistUrl,function(err,content){
            if(err){
                deferred.reject(err.tostring());
                return;
            }
            var data = content.data[0];
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
        });
    }catch(e){
        deferred.reject(e);
    }finally{
        return deferred.promise;
    }
}