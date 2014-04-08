/**
 * Created by sankooc on 14-4-8.
 */
var request = require('request');
var mkdirp = require('mkdirp');
var fs = require('fs');
var async = require('async');
var jquery = require('jquery');
var env = require('jsdom').env;
var defer = require('node-promise').defer
var iconv = require('iconv-lite');
var util = require('util');
//var gbk = new Iconv('GBK', 'UTF-8//TRANSLIT//IGNORE');

var domain = 'http://www.imanhua.com'
var folder = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/Movies/monga/';

function infos(mid){
    var deferred = defer();
    var _url = domain+'/comic/'+mid+'/'
    request(_url,{encoding:null},function(err,response,body){
        var content =iconv.decode(body, 'gbk');
        env(content,function(err,window){
            if(err){
                deferred.reject(err);
                return;
            }

            var $ = jquery(window)
            var ret={};
            (function($,ret,domain){
                $('#subBookList>li>a').each(function(index){
                    ret[$(this).attr('title')] = domain+$(this).attr('href');
                });
            })($,ret,domain);
            deferred.resolve(ret);
        })

    });
    return deferred.promise;

}

//http://c4.mangafiles.com/Files/Images/140/98218/imanhua_001.png
var rootStore = 'http://c4.mangafiles.com/Files/Images/%s/%s/%s';

//infos(140).then(function(ret){
//    var _folder = folder+'进击的巨人/第56话/'
//    mkdirp(_folder);
//    var _url = ret['第56话'];
//    console.log(_url);
//    request(_url,{encoding:null},function(err,response,body){
//        var content =iconv.decode(body, 'gbk');
//        env(content,function(err,window){
//            var $ = jquery(window)
//            var exp = $('script:eq(0)').text();
//            eval(exp);
//            var cid = cInfo.cid;
//            var bid = cInfo.bid;
//            for(var i=0;i<cInfo.files.length;i++){
//                var resource = util.format(rootStore,bid,cid,cInfo.files[i]);
//                console.log(resource);
//            }
//        })
//    })
//});



var http = require('http');
var test_ = 'http://c4.mangafiles.com/Files/Images/140/98218/imanhua_025.png';
var option = require('url').parse(test_);
option['User-Agent']='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.172 Safari/537.22';

http.get(option,function(res){
    console.log('status : %s',res.statusCode);
    console.log(res.headers);
});
