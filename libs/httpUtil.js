var http = require('http')
   ,fs = require('fs')
   ,_url = require('url')
   ,util = require('util')
   ,events = require('events')
   ,defer = require("node-promise").defer


function getText(url,charset,callback){
    var req = http.get(url, function(res) {
    switch(res.statusCode){
      case 200:
        break;
        case 301:
//        case 302:
        var location = res.headers['location'];
	    console.log('redirect to %s',location);
        req.abort();
        getText(location,charset,callback);
        return;
      default:
          console.error('response status %s ',res.statusCode);
          req.abort();
          callback(res.statusCode);
      return;
    }
    if(charset){
      res.setEncoding(charset);
    }else{
      res.setEncoding('utf-8');
    }
    var content= '';
    res.on('data',function(chuck){
    	content+=chuck;
    }).on('end', function (){
      if(callback){
    	  callback(null,content);
      }
    });
  });
};
exports.getText = getText;
exports.getJson = function(url,callback){
    getText(url,'utf-8',function(err,content){
        if(err){
            callback(err,content);
            return;
        }
        callback(null,JSON.parse(content));
    });
}




function getSuffix(contentType,defaultSuffix){
  if(!defaultSuffix){
    defaultSuffix = '.flv';
  }
	switch(contentType){
	  case 'text/html':
	    return;//TODO
	  case 'video/mp4':
	    return '.mp4';
	  case 'video/x-flv':
	  case 'video/f4v':
      return '.flv';
	  case 'application/octet-stream':
	  default:
	    return defaultSuffix;
	}
}

function createFolder(path){
  if(!fs.existsSync(path)){
    fs.mkdir(path);
  }
  return true;
}


function HttpSet (video){
    events.EventEmitter.call(this);
    this.video = video;
    this.deferred = defer();
}

util.inherits(HttpSet,events.EventEmitter);


HttpSet.prototype.doRequest= function(){

    if(this.video.getData().source.length == 1){
        this.singleRequest();
    } else {
        this.batchRequest();
    }
    return this.deferred.promise;
}

HttpSet.prototype.singleRequest = function(){
  this._request(this.video.getData().source[0]
      ,this.video.getTitle()
      ,this.video.getParameter().folder
      ,this.video.getData().suffix);
}

HttpSet.prototype.batchRequest = function(){
//  if(!this.ready){
//    console.error('is running');
//    return false;
//  }
  var folder = this.video.getParameter().folder + this.video.getTitle() + '/';

  console.log('request count %d',this.video.getData().source.length);
  for(var i=0 ;i < this.video.getData().source.length; i++){
      var _title = this.video.getTitle() + '_';
      (function(_this,_title,t){
          if(t<9){
              _title += '0'+(t+1);
          }else{
              _title += (t+1);
          }
          _this._request(
              _this.video.getData().source[t]
              ,_title
              ,folder
              ,_this.video.getData().suffix);
      })(this,_title,i);
  }
  return true;
}

HttpSet.prototype._complete = function(source,title,path,suffix){
    if(source.current<source.total){
      this.deferred.reject('fail to download source %'+source.filepath);
      fs.unlinkSync(source.filepath);
      return;
    }
    source.state = true;
    console.log('finish download %s',source.filepath);
    for(var i = 0 ;i<this.video.getData().source.length;i++){
        if(!this.video.getData().source[i].state){
            return;
        }
    }
    this.deferred.resolve(this.video);
}

HttpSet.prototype._request = function(source,title,path,suffix){
  var _this = this;
  var url = source.url;
  var request = http.get(source.url,function(res){
      switch(res.statusCode){
      case 301:
	  case 302:
      case 307:
	  		var location = res.headers['location'];
	  		console.log('get new localtion : '+location);
	  		request.abort();
            source.url = location;
		  	_this._request(source,title,path,suffix);
		  	return;
	  case 200:
		  	break;
	  default:
		    console.error('download : %s failed status code : %s',source.url,res.statusCode);
		  	request.abort();
		  	return;
	  };

      if(!createFolder(path)){
          this.deferred.reject('cannot create folder :'+path);
          return;
      }
	  var contentType = res.headers['content-type'],contentLength = res.headers['content-length'];
      console.log('content-type: '+contentType + ' content-length : '+contentLength);
	  var _suffix = getSuffix(contentType,suffix)
         ,filepath = path+title+_suffix;

      source.filepath = filepath;
      source.current = 0;
      source.total = contentLength;
      source.state =false;
      if(fs.existsSync(filepath)){
          source.current = fs.statSync(filepath).size;
          console.log('remaining length: '+source.current);
          if(source.current > 0){
              request.abort();
              if(source.current == contentLength){
                  console.log('file '+title+' is already downloaded');
                  _this._complete(source);
              }else if(source.current > contentLength){
                  console.log('file '+title+' occur error');
              }else{
                  _this._remainRequest(source,title,path,suffix);
              }
              return;
          }
      }
      _this._writeData(source,res,title,path,suffix);
  });
  return request;
};

HttpSet.prototype._remainRequest = function (source){
  console.log('do remaining downloading remain :'+source.current);
  var option = _url.parse(source.url)
      ,_this = this;
  if(source.current > 0){
    option.Range = 'bytes='+source.current+'-';
  }
  var request = http.request(option,function(res){
    switch(res.statusCode){
		  case 200:
			  break;
			  default:
				  console.error('download : %s failed status code :%s',source,res.statusCode);
			  request.abort();
			return;
		};
    _this._writeData(source,res);
  });
  request.end();
}



HttpSet.prototype._writeData = function (source,res,title,path,suffix){
    var _this = this;
    console.log('start to downloading : '+ source.filepath);
	var wStream = fs.createWriteStream(source.filepath);
	res.on('data',function(chuck){
        wStream.write(chuck);
        source.current += chuck.length;
	}).on('end',function(){
	    wStream.end();
        _this._complete(source,title,path,suffix);
    });
}

exports.HttpSet = HttpSet;
