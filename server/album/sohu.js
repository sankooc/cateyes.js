/**
 * Created by sankooc on 14-5-27.
 */

var $ = require('jquery')
    ,env = require('jsdom').env
    ,http = require('http')
    ,request = require('request')
    ,cateyes = require('../cateyes')
    ,uuid = require('node-uuid')
    ,async = require('async')

exports.download = download;
exports.batchDownload = batchDownload;

function download(context,callback){
    var url = context.url
        ,skip = context.skip || 0
    request.get(url,function(err,res,html){
        env(html, function (errors, window) {
            var $ = require('jquery')(window)
            var urls = []
            var frames = $('div.area div.tab1cont div#list_asc div.similarLists>ul>li>a')
            $.each(frames,function(inx,item){
                var url = $(item).attr('href')
                if(/^http:\/\/tv.sohu.com/.test(url)){
                    urls.push(url)
                }
            })
            var total = urls.length
            console.log(' total resource %s  skip %s',total,skip)
            urls = urls.slice(skip)
            batchDownload(urls,callback)
        });
    })
}

function batchDownload(urls,callback){
    async.eachLimit(urls,1, function(_url, callback) {
        var context = {
            url:_url
        };
        async.waterfall([
            async.apply(cateyes.getURLMetadata,context)
            ,function(metadata,callback){
                console.log('---download %s',JSON.stringify(metadata))
//                callback()
                var param = {
                    type:'mp4'
                }
                var id = uuid.v4()
                cateyes.subscript(metadata,param,id,callback)
            }
        ],callback)
    },callback);
}
