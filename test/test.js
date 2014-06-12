var assert = require("assert");
var resovler = require('./../lib/util/providerResolver');

//var sohuSurl = 'http://tv.sohu.com/20140119/n393765790.shtml';
var sohuSurl = 'http://my.tv.sohu.com/us/209274639/69428621.shtml';
var youkuUrl = 'http://player.youku.com/player.php/sid/XNjYzNDI5MzAw/v.swf';
var tencentUrl = 'http://v.qq.com/cover/0/0wzzdnks41m52ve.html';
var v56Url = 'http://www.56.com/u69/v_ODg5MTIzNTQ.html';
var yytUrl = 'http://www.yinyuetai.com/video/731011';
var letvUrl = 'http://www.letv.com/ptv/vplay/2074193.html';
var ku6 = 'http://v.ku6.com/show/Gahx_fVJ5bFGzG3eD1cLDw...html';

var volumnpage = 'http://1qdisk.com/vod/view.html?idx=8533';

var blockPage = 'http://player.youku.com/player.php/sid/XODAyNTkzMTI=/v.swf';
//youku
var page1 = 'http://v.youku.com/v_show/id_XNjY1MTA2NjA0.html';
var page2 = 'http://player.youku.com/player.php/sid/XNTgyMjcwODg0/v.swf';
var page_1 = 'http://tv.sohu.com/20130822/n384852417.shtml';

//sohu
var page3 = 'http://tv.sohu.com/20130822/n384852417.shtml';

//tencent
var page4 = 'http://v.qq.com/cover/q/qk8vyb5drwnn174.html';


var qdisk = 'http://1qdisk.com/vod/view.html?idx=24';


describe('cateyes', function(){
    describe('#youku',function(){
        it('url resolver', function(){
          assert.equal(resovler.getProvider(page1), 'youku');
          assert.equal(resovler.getProvider(page2), 'youku');
        });
        it('get metadata',function(done){
            var context ={
                url:page1
            }
            resovler.getURLMetadata(context,function(err,result){
                console.info(result)
                done(err)
            })
        });
        it('get resource',function(done){
            var context ={
                url:page1
            }
            resovler.getResource(context,function(err,result){
                console.info(context.sources)
                done(err)
            })
        });
  });


    describe('#Sohu',function(){
        it('url resolver', function(){
            assert.equal(resovler.getProvider(sohuSurl), 'sohu');
        });
        it('sohu metadata',function(done){
            var context = {
                url:sohuSurl
            }
            resovler.getURLMetadata(context,function(err,result){
                console.info(result)
                done(err)
            })
        });
    });
//
//    describe('#Tencent',function(){
//        it('url resolver', function(){
//            assert.equal(resovler.getProvider(tencentUrl), 'tencent');
//        });
//        it('sohu metadata',function(done){
//            resovler.getURLMetadata(tencentUrl).then(function(data){
//                console.log(data);
//                done();
//                describe('#tecent resource',function(){
//                    it('parse resource',function(done){
//                        var rep ={
//                            'metadata':data,
//                            'parameter':{'type':'mp4','title':'fortest'}};
//                        resovler.getResource(rep).then(function(_v){
//                            console.log(rep);
//                            done();
//                        });
//                    });
//                })
//            });
//
//        });
//    });
})
