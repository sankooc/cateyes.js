/**
 * Created by sankooc on 14-4-7.
 */
var youku_reg = /^http:\/\/v.youku.com\/v_show\/id_([\w=]+).html|^http:\/\/player.youku.com\/player.php\/sid\/([\w=]+)\/v.swf/
    ,sohu_reg = /v.sohu.com\//
    ,tencent_reg = /v.qq.com/
    ,v56_reg = /56.com/
    ,ku6_reg = /v.ku6.com/

function getProvider(_url){
    if(youku_reg.test(_url)) return 'youku';
    if(sohu_reg.test(_url)) return 'sohu';
    if(tencent_reg.test(_url)) return 'tencent';
    if(v56_reg.test(_url)) return 'v56';
    if(ku6_reg.test(_url)) return 'ku6';
    return 'shuoshu';
}
exports.getProvider = getProvider;

exports.getURLMetadata=function(context,callback){
    var pName = context.provider;
    if(!pName && context.url){
        pName = getProvider(context.url)
    }else if(pName && context.vid){

    }else{
        callback('empty context')
        return;
    }
    var provider = require('./../provider/'+pName);
    provider.parseMetadata(context,callback);
}

exports.getResource=function(context,callback){
    var pName = context.provider;
    if(!pName && context.url){
        pName = getProvider(context.url)
    } else{
        callback('empty context')
        return;
    }
    var provider = require('./../provider/'+pName);
    provider.getResource(context,callback);
}

