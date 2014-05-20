var util = require('util');
var HTTPX = require('./../httpx');
var defer = require("node-promise").defer;
var video = require('./../video');
var async = require('async');
var plist = 'http://v.youku.com/player/getPlayList/VideoIDS/';
var TOKEN = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890";
var url_format = 'http://f.youku.com/player/getFlvPath/sid/%s_%s/st/%s/fileid/%s%s%s?K=%s&ts=%s';
var youku_reg = /^http:\/\/v.youku.com\/v_show\/id_([\w=]+).html|^http:\/\/player.youku.com\/player.php\/sid\/([\w=]+)\/v.swf$/;
exports.regex=youku_reg;
var _wf = async.waterfall
    ,apply = async.apply
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

_parseVid = function(context,callback){
    if(context.vid){
        callback()
    }else if(context.url){
        var vid = context.url.replace(youku_reg,'$1$2');
        if(!vid)
           callback('parse vid failed')
        context.vid = vid;
        callback()
    }else{
        callback('empty arguments')
    }
}

_parse = function(context,callback){
    HTTPX.getText(plist + context.vid,function(error,body){
        if(error){
            callback(error)
            return
        }
        var data = JSON.parse(body).data[0];
        if(!data){
            callback('no data');
        } else {
            context.data = data
            callback(data.error);
        }
    })
}

_metadata = function(context,callback){
    var metadata = {
        'title':context.data.title
        ,'type':context.data.streamtypes
        ,'vid':context.vid
        ,'provider':'youku'
    }
    callback(null,metadata)
}

_resource = function(context,callback){
    var data = context.data
    var seed = data.seed,type = 'mp4' ==context.type?'mp4':'flv';
    var streamFileids = data.streamfileids[type];
    if(!streamFileids){
        callback('no types');
        return;
    }
    var ids = streamFileids.split('*'),mstr = getMixString(seed),tmp = [],i;
    for(i=0;i<ids.length;i++){
        tmp[i] = mstr[parseInt(ids[i])];
    }
    var id = tmp.join('') , id_pre = id.slice(0, 8) , id_end = id.slice(10)
    context.count = data.segs[type].length


    context.sources = []
    var _url_f = 'http://f.youku.com/player/getFlvPath/sid/'+getSerialId()+'_%s/st/'+type
        +'/fileid/'+id_pre+'%s'+id_end+'?K=%s&ts=%s';
    data.segs[type].forEach(function(seg,index){
        var no = '0'+parseInt(seg.no).toString(16)
        context.sources.push({
            index : index
            ,url : util.format(_url_f,no,no.toUpperCase(),seg.k,seg.seconds)
        })
    });
    callback()
}

exports.getResource = function(context,callback){
    _wf([
        apply(_parseVid,context)
        ,apply(_parse,context)
        ,apply(_resource,context)
    ],callback)
}

exports.parseMetadata = function(context,callback){
    _wf([
        apply(_parseVid,context)
        ,apply(_parse,context)
        ,apply(_metadata,context)
    ],callback)
}
