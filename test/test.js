var assert = require("assert");
var cateyes = require('../cateyes');
var sohu = require('../libs/sohu');

//youku
var page1 = 'http://v.youku.com/v_show/id_XNjY1MTA2NjA0.html';
var page2 = 'http://player.youku.com/player.php/sid/XNTgyMjcwODg0/v.swf';
//http://v.youku.com/player/getPlayList/VideoIDS/XNjY1MTA2NjA0

//sohu
var page3 = 'http://tv.sohu.com/20130822/n384852417.shtml';

//tencent
var page4 = 'http://v.qq.com/cover/q/qk8vyb5drwnn174.html';

describe('cateyes', function(){
  /*
  describe('#youku',function(done){
    it('识别youku的url', function(){
      assert.equal(cateyes.getProvider(page1), 'youku');
      assert.equal(cateyes.getProvider(page2), 'youku');
    });
    it('get_vid',function(){
      var _v = cateyes.createVideoFromURL(page1,'high');
      _v.once('vid',function(){
        assert.equal(_v.vid,'XNjY1MTA2NjA0');
      });
      _v.parseVid();
      _v = cateyes.createVideoFromVid('youku','XNjY1MTA2NjA0','mp4');
      _v.once('validated',function(){
        done();
      });
      _v.parseResource();
    });
  });



  describe('#Sohu', function(){
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
      _v.parseVid();

      _v = cateyes.createVideoFromVid('sohu','1288355','low');
      _v.once('validated',function(){
        done();
      });
      _v.parseResource();

      //});
    });
  });
  */
  describe('#tencent',function(done){
    it('识别url', function(){
      assert.equal(cateyes.getProvider(page4), 'tencent');
    });
    it('get_vid',function(){
      var _v = cateyes.createVideoFromURL(page4,'low');
      _v.once('vid',function(){
        assert.equal(_v.vid,'XNjY1MTA2NjA0');
      });
      _v.parseVid();
      /*
      _v = cateyes.createVideoFromVid('youku','XNjY1MTA2NjA0','mp4');
      _v.once('validated',function(){
        done();
      });
      _v.parseResource();
      */
    });
  });

})
