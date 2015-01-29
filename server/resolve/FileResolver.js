/**
 * Created by sankooc on 1/1/15.
 */
var fs = require('fs');
if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, 'endsWith', {
    value: function(searchString, position) {
      var subjectString = this.toString();
      if (position === undefined || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }
  });
}
if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(searchString, position) {
      position = position || 0;
      return this.lastIndexOf(searchString, position) === position;
    }
  });
}

var ROOT = "/Users/sankooc/Movies/Cateyes/";
//var ROOT = "/Volumes/mok/";

function readSuffix(path,dir,suffix){
  var list = fs.readdirSync(path);
  var result = [];
  list.forEach(function(item){
    if(item.indexOf('.') === 0) return;
    if(suffix){
      if(!item.endsWith(suffix)) return;
    }
    var state = fs.statSync(path+item);
    if(state.isDirectory() ^ dir) return;
    result.push(item);
  });
  return result;
}
function readList(path,dir){
  var list = fs.readdirSync(path);
  var result = [];
  list.forEach(function(item){
    if(item.indexOf('.') === 0) return;
    var state = fs.statSync(path+item);
    if(state.isDirectory() ^ dir) return
    if(state.isFile() && !item.endsWith('.mp4')) return
    result.push(item);
  });
  return result;
}

function FileResolver(){
  // this.root = "/Volumes/mok/";
  this.root = ROOT;
}

FileResolver.prototype.albums = function(){
  return readList(this.root,true);
};

FileResolver.prototype.chapters = function(album){
  return readList(this.root+album+'/',true);
};

FileResolver.prototype.clips = function(album,chapter){
  return readList(this.root+album+'/'+chapter+'/',false);
};

FileResolver.prototype.metadata = function(album,chapter){
  var list = readList(this.root+album+'/'+chapter+'/',false);
  var titles = []
  if(list && list.length){
    for(var i = 0;i<list.length;i++){
      var meta = parse_title(list[i],chapter);
      if(meta.title){
        if(titles.indexOf(meta.title) < 0){
          titles.push(meta.title)
        }
      }
    }
  }
  return titles;
};

FileResolver.prototype.parse = function(callback){
  var self = this;
  var result = {

  };
  var albums = readList(self.root,true);
  albums.forEach(function(album_title){
    var chapters = readList(self.root+album_title+'/',true);
    chapters.forEach(function(chapter_title){
      var clips = readList(self.root+album_title+'/'+chapter_title+'/',false);
      clips.forEach(function(clip){
        var obj = parse_title(clip,chapter_title);
        if(obj.time && obj.title && obj.fragment){
        }else{
          //
        }
      });
    });
  });
  //console.log(result);
  if(callback){
    callback(null,result);
  }
};

module.exports  = FileResolver;



var reg_mt = /^([\s\S]+).part$/;
var reg_parser = /([\s\S]+)\s+#,?(\d{2}),?\s+([\S\s]+)\s+(\d{8}|\d{6})-[\S]{11}\.mp4$/;
var reg_parser2 = /[\s\S]+,\s?([\s\S]*),\s?#,?(\d{2}),?-[\S]{11}\.mp4$/;
var reg_cha = /(\d{6}|\d{8})_[\s\S]+/;

function parse_title(title,chapter){
  var result = {
    complete : true
  };
  var m = title.match(reg_mt);
  if(m){
    result.complete =false;
    title = m[1];
  }
  m = title.match(/^([\s\S]+)-[\S]{11}\.mp4$/);
  if(m){
    title = m[1]
  }
  m = title.match(/^([\s\S]+)\s(\d{6}|\d{8})$/);
  if(m){
    title = m[1];
    result.time = m[2];
  }
  m = title.match(/([\s\S]+)#,?(\d{2})[,\s]*([\s\S]*)$/);
  if(m){
    title = m[1];
    result.fragment = m[2];
    if(m[3].trim()){
      result.title = m[3].trim();
    }else{
      m = title.match(/([\s\S]+),\s*([\s\S]{2,}),\s$/);
      if(m){
        result.title = m[2].trim();
      }
    }
  }
  if(!result.time && chapter){
    m = chapter.match(/(\d{6}|\d{8})/);
    if(m){
      result.time = m[1];
    }
  }
  return result;
}