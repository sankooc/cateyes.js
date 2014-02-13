var util = require('util');
var hu = require('./httpUtil');

var plist = 'http://v.youku.com/player/getPlayList/VideoIDS/';
var TOKEN = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890";
var url_format = 'http://f.youku.com/player/getFlvPath/sid/%s_%s/st/%s/fileid/%s%s%s?K=%s&ts=%s';
var youku_reg = /^http:\/\/v.youku.com\/v_show\/id_([\w=]+).html$|^http:\/\/player.youku.com\/player.php\/sid\/([\w=]+)\/v.swf$/;
exports.regex=youku_reg;

function getRandom(seed,weight){
	return Math.round(seed + Math.random()*weight);
}

function getSerialId() {
	return  new Date().getTime()+''+getRandom(1000,999)+''+getRandom(1000,9000);
}

function getMixString(seed) {
	var _seed = seed;
	var queue = [];
	for (var i = 0 ;i<TOKEN.length;i++) {
		queue.push(TOKEN.charAt(i));
	}
	var len = queue.length;
    var ret = [];
	for (var i = 0; i < len; ++i) {
		_seed = (_seed * 211 + 30031) & 0xffff;
		var index = _seed * queue.length >> 16;
		ret[i] = queue[index];
		queue.splice(index,1);
	}
	return ret;
}


function getSourceUrl(content,_v){
  try{
    var data = content.data[0];
    var title = data.title,seed = data.seed,types = data.streamtypes,type = types[0];

    if(!_v.title){
        _v.title = title;
    }
    if(('high' == _v.quality || 'mp4' == _v.quality) && types.length > 1){
      type = 'mp4';
    }else{
      type = 'flv';
    }

    var streamFileids = data.streamfileids[type];
    if(!streamFileids){
      return;
    }
    var ids = streamFileids.split('*'),mstr = getMixString(seed),tmp = [],i;
    for(i=0;i<ids.length;i++){
      tmp[i] = mstr[parseInt(ids[i])];
    }
    var id = tmp.join('') , id_pre = id.slice(0, 8) , id_end = id.slice(10);
    _v.setSuffix('.'+type);
    _v.setCount(data.segs[type].length);
    for(i =0;i<_v.count;i++){
      var seg = data.segs[type][i],no = '0'+parseInt(seg.no).toString(16);
      _v.addUrl(i,util.format(url_format,getSerialId(),no,type,id_pre,no.toUpperCase(),id_end,seg.k,seg.seconds));
    }
  }catch(e){
    console.error(e);
  }
}


exports.titleEnable = true;

exports.getVid = function(_v){
  var _url = _v.orignalUrl;
  var vid = _url.replace(youku_reg,'$1$2');
  _v.setVid(vid);
};

exports.resolv = function(_v){
  var playlistUrl = plist + _v.vid;
  hu.getJson(playlistUrl,function(err,content){
    if(err){
      _v.error(err.tostring());
      return;
    }
    getSourceUrl(content,_v);
  });
};


exports.parseTitle = function(_v){
    var playlistUrl = plist + _v.vid;
    hu.getJson(playlistUrl,function(err,content){
        if(err){
            _v.error(err.tostring());
            return;
        }
        var data = content.data[0];
        var profile = {};
        profile.title = data.title;
        profile.provier ='youku';
        profile.types = data.streamtypes;
        _v.emit('title',profile);
    });
}