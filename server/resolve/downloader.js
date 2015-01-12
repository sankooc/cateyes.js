var fs = require('fs')
var async = require('async');
var apply = async.apply;
var httpx = require('./httpx')
var mkdirp = require('mkdirp')
var moment = require('moment')
var _ = require('underscore')
var exec = require('child_process').exec;
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

//var root = "/Volumes/mok/";

function readSuffix(path,dir,suffix){
  var list = fs.readdirSync(path);
  var result = [];
  list.forEach(function(item){
    if(!item.endsWith(suffix)) return;
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
     var state = fs.statSync(path+item);
     if(state.isDirectory() ^ dir) return;
     if(state.isFile() && !item.endsWith('.mp4')) return;
     result.push(item);
   });
   return result;
}

function ding(path){
   var list = fs.readdirSync(path);
   for(var i=0;i<list.length;i++){
     var item = list[i];
     var state = fs.statSync(path+item);
     if(state.isDirectory()) continue;
     if(state.isFile() && item.endsWith('.part')) return true;
   }
   return false;
}

function Task(target){
  this.target = target;
  var self = this;
  this.queue = async.queue(function(item,callback) {
    self.createTask(item,callback);
  }, 1);
}

Task.prototype.createTask = function(item,callback){
  var self = this;
  var url = 'https://www.youtube.com/playlist?list=' + item.url;
  var albumFolder = target + item.title+'/';
  async.waterfall([
    function(callback){
      mkdirp(albumFolder,callback);
    }
    ,function(code,callback){
      var command = 'youtube-dl '+url;
      var files = readList(albumFolder,0);
      if(!files.length || ding(albumFolder)){
        console.log(moment().format('hh:mm:ss')+' : '+item.title+': start downloading');
        var process = exec(command,{
          maxBuffer: 1024 * 500,
          cwd : albumFolder
        },function(err){
          if(err){
            console.error(err);
          }else{
            console.log(moment().format('hh:mm:ss')+' : '+item.title+' : complete : '+item.url);
          }
          callback();
        });
        // process.stdout.on('data',function(chunk){
        //   console.log(chunk.toString());
        // });
      }else{
        console.log(moment().format('hh:mm:ss') +' : '+item.title+':downloaded   '+item.url);
        callback();
      }
    }
  ],callback);

};

Task.prototype.save = function(item,content){
};

Task.prototype.load = function(){
  var configFile = this.target+'config.json';
  if(fs.existsSync(configFile)){
    var buffer = fs.readFileSync(configFile);
    var source = JSON.parse(buffer.toString());
    for(var title in source){
      this.queue.push({
        title : title,
        url : source[title]
      },function(){});
    }
  }else{
    console.error('no config file');
  }
};

var target = "/Volumes/mok/radioStar/";
var task = new Task(target);
task.load();