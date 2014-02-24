var http = require('http')
   ,fs = require('fs')
   ,_url = require('url')
   ,util = require('util')
   ,events = require('events')

var fileFormat = '%s_%d';

function getText(url,charset,callback){
  var req = http.get(url, function(res) {
    console.log('response status %s ',res.statusCode);
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
}

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


function HttpSet (){
  events.EventEmitter.call(this);
  this.count = 0;
  this.ready = true;
  this.resources;
}

util.inherits(HttpSet,events.EventEmitter);


HttpSet.prototype.doRequest= function(resource,folder){
  this.resources = resource;
  this.count = resource.source.length;
  if(resource.source.length == 1){
    return this.singleRequest(resource,folder);
  } else {
    return this.batchRequest(resource,folder);
  }
}

HttpSet.prototype.singleRequest = function(resource,folder){
  this._request(resource.source[0],resource.title,folder,resource.suffix);
}

HttpSet.prototype.batchRequest = function(resource,folder){
  if(!this.ready){
    console.error('is running');
    return false;
  }
  folder = folder + resource.title + '/';

  console.log('request count %d',resource.source.length);
  for(var i=0 ;i < resource.source.length; i++){
    var _title = resource.title + '_';
    if(i<9){
      _title += '0'+(i+1);
    }else{
      _title += (i+1);
    }
    this._request(resource.source[i],_title,folder,resource.suffix);
  }
  return true;
}

HttpSet.prototype._decreate = function(source){
  if(source.current<source.total){
      console.error('fail to download source %',source.filepath);
      fs.unlinkSync(source.filepath);
//      this._request(source,source.vi)
      return;
  }
  source.state = true;
  console.log('finish download %s',source.filepath);
  if(--this.count == 0){
    this.ready = true;
    this.emit('done',this.resources);
    this.resources = null;
  }
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
		  		console.error('download : '+url+' failed status code :'+res.statusCode);
		  	request.abort();
		  	return;
	  };

      if(!createFolder(path)){
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
                  _this._decreate(source);
              }else if(source.current > contentLength){
                  console.log('file '+title+' occur error');
              }else{
                  _this._remainRequest(source);
              }
              return;
          }
      }
      _this._writeData(source,res);
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



HttpSet.prototype._writeData = function (source,res){
    var _this = this;
    console.log('start to downloading : '+ source.filepath);
	var wStream = fs.createWriteStream(source.filepath);
    var count = 0;
	res.on('data',function(chuck){
        wStream.write(chuck);
        source.current += chuck.length;
        if((count++%25)==24){
            count =0;
            updateSource(source);
        }
	}).on('end',function(){
	    wStream.end();
        updateSource(source);
        _this._decreate(source);
    });
}

function updateSource(source){
    source.video.emit('update',{
         'key':'+source'
        ,'index':source.index
        ,'current':source.current
        ,'total':source.total
    });
}

//
//var timer = {
//    content : 0,
//    files : {},
//    delay : 3,
//    id : null,
//    getSpeed : function(spd){
//        spd = spd/timer.delay
//        if((spd>>10) <= 0 ){
//            return Math.round(spd);
//        }else if((spd>>20)<=0){
//            return Math.round(spd/1024)+'k';
//        }else{
//            return Math.round(spd/1024/1024)+'m';
//        }
//    },
//    display : function(){
//        try{
//        var current = timer.content;
//        for(var m in timer.files){
//            if(!timer.files[m]){
//                continue;
//            }
//            var inc = timer.files[m];
//            timer.files[m] = 0;
//            var total = timer.files[m].total;
//            timer.files[m].current += inc;
//            var percent = timer.files[m].current /total;
//            if(percent >= 100){
//                timer.files[m] = null;
//                continue;
//            }
//            var filename = m.substring(m.lastIndexOf('/')+1);
//            console.log('--[%s %]-[%s] speed %s bps',Math.round(percent),filename,timer.getSpeed(inc));
//        }
//        console.log('======= total speed : %s bps',timer.getSpeed(current));
//        }catch(e){
//            console.error(e);
//        }
//        timer.content = 0;
//        clearTimeout(timer.id);
//        timer.id = null;
//    },
//    reg : function (source){
////        if(!timer.files[filepath]){
////            timer.files[filepath] = {};
////            timer.files[filepath].tmp = 0;
////            timer.files[filepath].total = total /100;
////            if(current){
////                timer.files[filepath].current = current;
////            }else{
////                timer.files[filepath].current = 0;
////            }
////        }
//    },
//    add : function(source,ln){
////        if(!timer.files[source.filepath]){
////            timer.files[source.filepath]= 0;
////        }
//        source.current += li;
////        timer.files[source.filepath] += ln;
////        timer.content += ln;
////        if(timer.id){
////            return;
////        }else{
////            timer.id = setTimeout(this.display,timer.delay*1000);
////        }
//    }
//};
//
//exports.startTimer = function(){
//    timer.start();
//}
//
//exports.stopTimer = function(){
//    timer.stop();
//}


exports.HttpSet = HttpSet;
