var assert = require("assert");
var cateyes = require('../cateyes');
var sohu = require('../libs/sohu');
var constans = require('../libs/constans');

var sohuSurl = 'http://tv.sohu.com/20140119/n393765790.shtml';
var youkuUrl = 'http://player.youku.com/player.php/sid/XNjYzNDI5MzAw/v.swf';
var tencentUrl = 'http://v.qq.com/cover/0/0wzzdnks41m52ve.html';
var v56Url = 'http://www.56.com/u69/v_ODg5MTIzNTQ.html';
var yytUrl = 'http://www.yinyuetai.com/video/731011';
var letvUrl = 'http://www.letv.com/ptv/vplay/2074193.html';
var ku6 = 'http://v.ku6.com/show/Gahx_fVJ5bFGzG3eD1cLDw...html';

//youku
var page1 = 'http://v.youku.com/v_show/id_XNjY1MTA2NjA0.html';
var page2 = 'http://player.youku.com/player.php/sid/XNTgyMjcwODg0/v.swf';


//sohu
var page3 = 'http://tv.sohu.com/20130822/n384852417.shtml';

//tencent
var page4 = 'http://v.qq.com/cover/q/qk8vyb5drwnn174.html';

describe('cateyes', function(){

//  describe('#provider')
  describe('#youku',function(done){

    it('get metadata',function(done){
        cateyes.getTitle(page1,function(flag,metadata){
            assert.equal(flag,flag);
            console.log(metadata);
            done();
        });
    });

      it('url resolver', function(){
          assert.equal(cateyes.getProvider(page1), 'youku');
          assert.equal(cateyes.getProvider(page2), 'youku');
      });

      it('get_vid',function(){
          var _v = cateyes.createVideoFromURL(page1,'high');
          _v.once('vid',function(){
              assert.equal(_v.vid,'XNjY1MTA2NjA0');
          });
          _v.parse();
      });

      it('parse resource',function(done){
          var _v = cateyes.createVideoFromVid('youku','XNjY1MTA2NjA0','mp4');
          _v.once('validated',function(){
              console.log(_v);
              done();
          });
          _v.parseResource();
      });
  });



  describe('#Sohu', function(){
      it('get metadata',function(done){
          cateyes.getTitle(page3,function(flag,metadata){
              console.log(metadata);
              done();
          });
      });

      it('识别url', function(){
          assert.equal(cateyes.getProvider(page3), 'sohu');
      });


      it('取vid',function(done){
          var _v = cateyes.createVideoFromURL(page3,'low');
          _v.once('vid',function(){
              if('1288355' != _v.vid){
                  done('vid incorrect '+content);
              }else{
                  done();
              }
          });
          _v.parse();
      });

      it('资源解析',function(done){
          _v = cateyes.createVideoFromVid('sohu','1288355','low');
          _v.once('validated',function(){
              done();
          });
          _v.parseResource();
      });
  });

  describe('#tencent',function(done){

      it('get metadata',function(done){
          cateyes.getTitle(page4,function(flag,metadata){
              console.log(metadata);
              done();
          });
      });

      it('识别url', function(){
          assert.equal(cateyes.getProvider(page4), 'tencent');
      });

      it('get_vid',function(){
      var _v = cateyes.createVideoFromURL(page4,'low');
          _v.once('vid',function(){
              assert.equal(_v.vid,'f0012c6nexb');
          });
        _v.parse();
      });

      it('parse resource',function(done){
          var _v = cateyes.createVideoFromURL(page4,'low');
          _v.once('validated',function(){
              console.log(_v);
              done();
          });
          _v.parseResource();
      });
  });

})
