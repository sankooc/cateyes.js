var HTTPX = require('./httpx')
    ,util = require('util')
    ,video = require('./video')
    ,defer = require("node-promise").defer

var pattern_url = /[\s\S]*\/video\/(\d+)[\s\S]*/
   ,pattren_title = /[\s\S]*title : "([^\"]+)",[\s\S]*"/
   ,pattren_ll = /[\s\S]*videoUrl : '([^\"]+)'[\s\S]*/


exports.parseMetadata = function(_url){
    var deferred = defer()
        ,vid = _url.replace(/.*\/([^\/]+).html/g,'$1')
        ,plist = 'http://v.ku6.com/fetchVideo4Player/'+vid+'.html'
        ,funErr = function(err){
            deferred.reject(err);
        }
    HTTPX.getText(plist).then(function(text){
        var content = JSON.parse(text)
            ,title = content.data.t
        deferred.resolve({
            'title':title
            ,'provider':'ku6'
            ,'type':['flv']
            ,'vid':vid
        });
    },funErr);
    return deferred.promise;
}

exports.getResource = function(report){
    var deferred = defer()
        ,vid = report.metadata.vid
        ,plist = 'http://v.ku6.com/fetchVideo4Player/'+vid+'.html'
        ,funErr = function(err){
            deferred.reject(err);
        }
    HTTPX.getText(plist).then(function(text){
        var content = JSON.parse(text)
            ,_url = content.data.f
        var resource = new video(report);
        resource.setCount(1);
        resource.addUrl(0,_url);
        deferred.resolve(resource);
    },funErr);
    return deferred.promise;
}