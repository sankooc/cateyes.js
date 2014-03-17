var assert = require("assert");
var cateyes = require('../cateyes');
var sohu = require('../libs/sohu');
var video = require('../libs/video');
var constans = require('../libs/constans');

var sohuSurl = 'http://tv.sohu.com/20140119/n393765790.shtml';
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
var page_1 = 'hp://tv.sohu.com/20130822/n384852417.shtml';

//sohu
var page3 = 'http://tv.sohu.com/20130822/n384852417.shtml';

//tencent
var page4 = 'http://v.qq.com/cover/q/qk8vyb5drwnn174.html';


var qdisk = 'http://1qdisk.com/vod/view.html?idx=24';


describe('cateyes', function(){


    describe('#youku',function(){
        it('url resolver', function(){
          assert.equal(cateyes.getProvider(page1), 'youku');
          assert.equal(cateyes.getProvider(page2), 'youku');
        });
        it('get metadata',function(done){
            cateyes.getURLMetadata(page1).then(function(data){
                console.log(data);
                done();
                describe('#resource',function(){
                    it('parse resource',function(done){
                        var rep ={
                            'metadata':data,
                            'parameter':{'type':'flv'}};
                        cateyes.getResource(rep).then(function(_v){
                            console.log(rep);
                            done();
                        });
                    });
                })
            });

        });
  });


    describe('#Sohu',function(){
        it('url resolver', function(){
            assert.equal(cateyes.getProvider(page3), 'sohu');
        });
        it('sohu metadata',function(done){
            cateyes.getURLMetadata(page3).then(function(data){
                console.log(data);
                done();
                describe('#sohu resource',function(){
                    it('parse resource',function(done){
                        var rep ={
                            'metadata':data,
                            'parameter':{'type':'mp4'}};
                        cateyes.getResource(rep).then(function(_v){
                            console.log(rep);
                            done();
                        },function(err){
                            console.error(err);
                            done(err);
                        });
                    });
                })
            });

        });
    });

    describe('#Tencent',function(){
        it('url resolver', function(){
            assert.equal(cateyes.getProvider(tencentUrl), 'tencent');
        });
        it('sohu metadata',function(done){
            cateyes.getURLMetadata(tencentUrl).then(function(data){
                console.log(data);
                done();
                describe('#tecent resource',function(){
                    it('parse resource',function(done){
                        var rep ={
                            'metadata':data,
                            'parameter':{'type':'mp4','title':'fortest'}};
                        cateyes.getResource(rep).then(function(_v){
                            console.log(rep);
                            done();
                        });
                    });
                })
            });

        });
    });



//
//
//    describe('#56',function(done){
//
//
//        it('识别url', function(){
//            assert.equal(cateyes.getProvider(v56Url), 'v56');
//        });
//        it('get metadata',function(done){
//            cateyes.getTitle(v56Url,function(flag,metadata){
//                console.log(metadata);
//                done();
//            });
//        });
////
//        it('get_vid',function(){
//            var _v = cateyes.createVideoFromURL(v56Url,'low');
//            _v.once('vid',function(){
//                assert.equal(_v.vid,'ODg5MTIzNTQ');
//            });
//            _v.parse();
//        });
////
//        it('parse resource',function(done){
//            var _v = cateyes.createVideoFromVid('v56','ODg5MTIzNTQ','flv');
//            _v.once('validated',function(){
//                console.log(_v);
//                done();
//            });
//            _v.parseResource();
//        });
//    });
//
//
//
//
//  describe('#tencent',function(done){
//
//      it('get metadata',function(done){
//          cateyes.getTitle(page4,function(flag,metadata){
//              console.log(metadata);
//              done();
//          });
//      });
//
//      it('识别url', function(){
//          assert.equal(cateyes.getProvider(page4), 'tencent');
//      });
//
//      it('get_vid',function(){
//      var _v = cateyes.createVideoFromURL(page4,'low');
//          _v.once('vid',function(){
//              assert.equal(_v.vid,'f0012c6nexb');
//          });
//        _v.parse();
//      });
//
//      it('parse resource',function(done){
//          var _v = cateyes.createVideoFromVid('tencent','f0012c6nexb','low');
//          _v.setTitle('ahahah');
//          _v.once('validated',function(){
//              console.log(_v);
//              done();
//          });
//          _v.parseResource();
//      });
//  });
//
//
//
//    describe('#ku6',function(done){
//
//        it('get metadata',function(done){
//            cateyes.getTitle(ku6,function(flag,metadata){
//                console.log(metadata);
//                done();
//            });
//        });
//
//        it('识别url', function(){
//            assert.equal(cateyes.getProvider(ku6), 'ku6');
//        });
//
//        it('get_vid',function(){
//            var _v = cateyes.createVideoFromURL(ku6,'low');
//            _v.once('vid',function(){
//                assert.equal(_v.vid,'Gahx_fVJ5bFGzG3eD1cLDw..');
//            });
//            _v.parse();
//        });
//
//        it('parse resource',function(done){
//            var _v = cateyes.createVideoFromVid('ku6','Gahx_fVJ5bFGzG3eD1cLDw..','low');
////            _v.setTitle('ahahah');
//            _v.once('validated',function(){
//                console.log(_v);
//                done();
//            });
//            _v.parseResource();
//        });
//    });
})
