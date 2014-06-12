var util  = require('util')
    ,async = require('async')
    ,waterfall = async.waterfall
    ,apply = async.apply
    ,each = async.each || async.forEach
    ,video = require('./../video')
    ,HTTPX = require('./../httpx')
    ,$ = require('jquery')
    ,env = require('jsdom').env
    ,http = require('http')
    ,request = require('request')
    , _plist = 'http://hot.vrs.sohu.com/vrs_flash.action?vid='
    ,_plist2 = 'http://my.tv.sohu.com/videinfo.jhtml?m=viewnew&vid='
    ,urlFormat = 'http://%s/?prot=%s&file=%s&new=%s'
    ,urlFormat2 = '%s%s?key=%s'
    ,type_reg = /(my\.tv|my\/v\.swf|\|my)/
    ,swf_reg = /v.swf/
    ,swf_vid = /&id=(\d+)/
function _metadata(context,callback){
    var data = context.data
    var title = data.tvName
    var meta = {
        'title':title
        ,'provider':'sohu'
        ,'type':['mp4']
        ,'vid':context.vid
    }
    callback(null,meta)
}

function _resource(context,callback){
    context.sources = []
    var content = context.content
        ,data =context.data
    context.count= data.clipsURL.length;
    var host = content.allot
        ,prot = content.prot
        ,clips = data.clipsURL
        ,suffixs = data.su
    each(clips,function(clip,callback){
        var index = clips.indexOf(clip)
        var suffix = clip.substring(clip.lastIndexOf('.')+1)
        var _url_1 = util.format(urlFormat,host,prot,clip,suffixs[index]);
        HTTPX.getText(_url_1,function(err,text){
            if(err) return callback(err)
            var tokens = text.split('|');
            var _url_2 = util.format(urlFormat2,
                tokens[0].substring(0, tokens[0].length - 1)
                ,suffixs[index]
                ,tokens[3]);
            context.sources.push({
                index : index
                ,suffix:suffix
                ,url:_url_2
            })
            callback()
        })
    },callback)
}

function _parse(context,url,callback){
    waterfall([
        function(callback){
            HTTPX.getText(url,callback)
        }
        ,function(text,callback){
            context.content = JSON.parse(text);
            context.data = context.content.data
            if(!context.data)
                return callback('parse vid failed')
            callback()
        }
    ],callback)
}

function parseVid(context,callback){
    if(context.vid){
        callback()
    }else if(context.url){
        if(type_reg.test(context.url)){
            context.type = 1
        }else{
            context.type = 2
        }

        if(swf_reg.test(context.url)){
            context.vid = context.url.match(swf_vid)[1]
            callback()
        }else{
            waterfall([
                function(callback){
                    HTTPX.getText(context.url,callback)
                }
                ,function(context,callback){
                    env(context,callback)
                }
                ,function(window,callback){
                    var $ = require('jquery')(window)
                        ,jsContent
                    if(type_reg.test(context.url)){
                        jsContent =$('script').eq(1).text()
                    }else{
                        jsContent =$('script').eq(3).text()
                    }
                    var vid = (function(jsContent){
                        eval(jsContent)
                        return vid
                    })(jsContent)
                    context.vid = vid
                    callback()
                }
            ],callback)
        }
    }else{
        callback('empty arguments')
    }
}

function parse(context,callback){
    if(!context.type){
        callback('no type')
    }
    var infoUrl
    switch(context.type){
        case 1:
            infoUrl=_plist2 + context.vid
            break;
        case 2:
            infoUrl=_plist + context.vid
            break;
    }
    _parse(context,infoUrl,callback)
}

exports.parseMetadata = function(context,callback){
    waterfall([
        apply(parseVid,context)
        ,apply(parse,context)
        ,apply(_metadata,context)
    ],callback)
}

exports.getResource=function(context,callback){
    waterfall([
        apply(parseVid,context)
        ,apply(parse,context)
        ,apply(_resource,context)
    ],callback)
}

