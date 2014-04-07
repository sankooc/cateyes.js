var HTTPX = require('./../httpx')
    ,util   = require('util')
    ,select = require('xpath.js')
    ,dom    = require('xmldom').DOMParser
    ,defer  = require("node-promise").defer
    ,async  = require('async')
    ,video  = require('./../video');

var regex_1 = /[\S\s]*vid:"(\w+)"[\S\s]*/
   ,plistFormat = 'http://vv.video.qq.com/geturl?otype=xml&platform=1&format=2&&vid=%s'
   ,xpath_url = '/root/vd/vi/url/text()'
   ,xpath_length = '/root/vd/vi/fs/text()'
   ,xpath_md5 = '/root/vd/vi/fmd5/text()'


exports.getResource = function(report){
    var deferred = defer();
    var errFuc = function(err){
        deferred.reject(err);
    }
    HTTPX.getText(util.format(plistFormat,report.metadata.vid)).then(function(content){
        var doc = new dom().parseFromString(content)
            ,_url = select(doc, xpath_url)[0].data
            ,_length = select(doc, xpath_length)[0].data
            ,_md5 = select(doc, xpath_md5)[0].data
            ,_suffix = '.'+_url.replace(/.*&fmt=(\w+)&.*/g,'$1');
        if(_suffix.length > 6) _suffix = 'flv';
        var resource = new video(report,deferred);
        resource.setSuffix(_suffix);
        resource.setCount(1);
        resource.addUrl(0,_url,_md5);
        deferred.resolve(resource);
    },errFuc);
    return deferred.promise;
}

exports.parseMetadata = function(_url){
    var deferred = defer();
    var errFuc = function(err){
        deferred.reject(err);
    }
    HTTPX.getText(_url).then(function(content){
        var vid = content.replace(regex_1,'$1')
        HTTPX.getText(util.format(plistFormat,vid)).then(function(content){
            var doc = new dom().parseFromString(content)
                ,_url = select(doc, xpath_url)[0].data
                ,_suffix = '.'+_url.replace(/.*&fmt=(\w+)&.*/g,'$1');
            if(_suffix.length > 6) _suffix = 'flv';
            deferred.resolve({
                'title':''
                ,'provider':'tencent'
                ,'type':[_suffix]
                ,'vid':vid
            });
        },errFuc);
    },errFuc);
    return deferred.promise;
}