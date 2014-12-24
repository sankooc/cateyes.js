/**
 * Created by sankooc on 14-5-28.
 */
var util  = require('util')
    ,async = require('async')
    ,waterfall = async.waterfall
    ,apply = async.apply
    ,each = async.each || async.forEach
    ,HTTPX = require('./../httpx')
    ,$ = require('jquery')
    ,env = require('jsdom').env
    ,http = require('http')
    ,request = require('request')
    ,jquery = require('jquery')
    ,select = require('xpath.js')
    ,dom    = require('xmldom').DOMParser

var tudou_prifix = 'http://v2.tudou.com/f?id='
    ,meta_prifix = 'http://www.tudou.com/outplay/goto/getInnerItem.html?code=%s&sourceId=11000'



var headers = {
    'User-Agent':'Cateyes'
    //    'Host':'v2.tudou.com'
    //    ,'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.172 Safari/537.22'
}
function closed(content){
    var window = {}
    var document =window
    var parent = window
    eval(content)
    return pageConfig.iid
}

function _metadata(context,callback){
    waterfall([
        function(callback){
            HTTPX.getText(util.format(meta_prifix,context.vid),callback)
        }
        ,function(content,callback){
            var datas = JSON.parse(content)
            callback(null,{
                title:decodeURIComponent(datas.message[0].title)
                ,provider:'tudou'
                ,vid:context.vid
            })
        }
    ],callback)
}

function _resource(context,callback){
    console.log(tudou_prifix+context.vid)
    waterfall([
        function(callback){
            var option={
                url: tudou_prifix+context.vid,
                headers: headers
            }
            HTTPX.getText(option,callback)
        }
        ,function(content,callback){
            var doc = new dom().parseFromString(content)
            var source = select(doc,'/f/text()')[0].data
            context.count = 1
            context.headers=headers
            context.source=[{
                index:0
                ,url:source
            }]
            var option=require('url').parse(source);
            option.headers = headers
            HTTPX.head(option,function(err,result){
                console.error(err)
                console.log(result)
            })
            callback()
        }
    ],callback)
}

function _parseVid(context,callback){
    if(context.vid){
        callback()
    }else if(context.url){
        waterfall([
            function(callback){
                HTTPX.getText(context.url,callback)
            }
            ,function(context,callback){
                env(context,callback)
            }
            ,function(window,callback){
                var $ = jquery(window)
                var content=$('script').eq(1).text()
                context.vid = closed(content)
                console.log('tudou lid is %s',context.vid)
                callback()
            }
        ],callback)
    }else{
        callback('empty arguments')
    }
}
exports.parseMetadata =function(context,callback){

    waterfall([
        apply(_parseVid,context)
        ,apply(_resource,context)
    ],callback)
}
