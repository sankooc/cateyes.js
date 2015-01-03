/**
 * Created by sankooc on 1/1/15.
 */
var fs = require('fs')

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
function readList(path,dir){
  var list = fs.readdirSync(path);
  var result = [];
  list.forEach(function(item){
    var state = fs.statSync(path+item);
    if(state.isDirectory() ^ dir) return
    if(state.isFile() && !item.endsWith('.mp4')) return
    result.push(item);
  });
  return result;
}

function FileResolver(){
  this.root = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/Movies/Cateyes/';
}

FileResolver.prototype.parse = function(callback){
  var self = this;
  var result = {
    root : 'file:///'+self.root,
    albums : []
  };
  var index = 0;
  var albums = readList(self.root,true);
  albums.forEach(function(title){
    var album = {
      index : index++,
      title : title,
      chapters : []
    };
    result.albums.push(album);

    var chapters = readList(self.root+album.title+'/',true);
    var _index = 0;
    chapters.forEach(function(chapter){
      album.chapters.push({
        index:_index++,
        title:chapter,
        clips:readList(self.root+album.title+'/'+chapter+'/',false)
      });
    });
  });
  console.log(result);
  if(callback){
    callback(null,result);
  }
};

module.exports  = FileResolver;

//var k =new FileResolver();
//k.parse()