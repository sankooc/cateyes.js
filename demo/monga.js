/**
 * Created by sankooc on 14-4-7.
 */

var request = require('request');
var mkdirp = require('mkdirp');
var fs = require('fs');
var async = require('async');

var env = require('jsdom').env;

var folder = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/Movies/monga/';

var url = 'http://manhua.dmzj.com/xfgj/';
var baseUrl = 'http://manhua.dmzj.com';
request(url,function(err,response,body){

//    body.replace(/var g_max_pic_count = /d/,'$1');
    env(body,function(err,window){
        var tasks = [];
        var $ = require('jquery')(window)
        for(var i =420;i<=446;i++){
            var name = "第"+i+"话";
            var subfix =$("a:contains('第"+i+"话')").attr('href');
            tasks.push(createD(baseUrl+subfix,folder+name+'/'));
        }

        async.waterfall(tasks,function(err,ret){
            console.error(err);
        })
    })
});
var pre2 = 'http://imgd.dmzj.com/';

function createD(_url,target){
    return function(cb){
        mkdirp(target);
        request(_url,function(err,rep,body){
            var ea = body.replace(/[\s\S]*var page = '';([\s\S]+)var g_comic_name[\s\S]*/g,'$1');
            eval(ea);
            var pps = eval(pages);
            for(var i =0;i<pps.length;i++){
                var resource = pre2+pps[i];
                var name = decodeURIComponent(resource.substring(resource.lastIndexOf('/')+1));
                var des = target+name;
                request(resource).pipe(fs.createWriteStream(des));
            }
            cb(null);
        });
    }
}

function download(_url,target){
    mkdirp(target);
    request(_url,function(err,rep,body){
        var ea = body.replace(/[\s\S]*var page = '';([\s\S]+)var g_comic_name[\s\S]*/g,'$1');
        eval(ea);
        var pps = eval(pages);
        for(var i =0;i<pps.length;i++){
            var resource = pre2+pps[i];
            var name = decodeURIComponent(resource.substring(resource.lastIndexOf('/')+1));
            var des = target+name;
            request(resource).pipe(fs.createWriteStream(des));
        }
    });
}
