var exec = require('child_process').exec;
var fs = require('fs');

exports.concat = function(resource){
  //_concat1(resources);

  _concat2(resource);
}
/*
UNIX 操作系统
*/
function _concat2(resource){
    var folder = resource.report.parameter.folder;
    var title = resource.getTitle();
  var cmd = '';
  var _folder =getCString(folder+title+'/'),mFile = _folder+'merge.txt';
  cmd += 'printf \"file \'%s\' \\n \" '+_folder+'*.'+resource.getSuffix()+' > '+ mFile;
  cmd += ' && ffmpeg -f concat -i '+ mFile +' -c copy '+getCString(resource.getTarget());
  cmd += ' && rm -f '+ mFile;
  console.log(cmd);
  var obj = exec(cmd);
  obj.on('exit',function(){
    console.log('concat %s complete',resource.getTitle());
  });
}

/*
function _concat1(resources){
  var files = resources.files;
  var title = resources.title;
  files.sort(function(a,b){
    return getNum(a,resources.title,resources.suffix) - getNum(b,resources.title,resources.suffix);
  });
  var mFile = resources.folder+'merge.txt';
  var wStream = fs.createWriteStream(mFile);
  for(var i = 0 ;i<files.length;i++){
    wStream.write("file '"+files[i]+"'\n");
  }
  wStream.end();

  var command = "ffmpeg -f concat -i "+getCString(mFile)+" -c copy "+getCString(resources.folder+'../'+resources.title+resources.suffix);
  console.log(command);
  var cProcess = exec(command);
  cProcess.on('exit',function(){
    //remove file
  });
};

//printf "file '%s'\n" *.mp4 > aa.txt && ffmpeg -f concat -i aa.txt -c copy ../kk.mp4 && rm -f aa.txt

function getNum(text,title,suffix){
  var str = '[\\S\\s]+'+title+'_(\\d+)'+suffix;
  var val = text.replace(new RegExp(str,'g'),"$1");
  return parseInt(val);
}
*/
function getCString(str){
  return str.replace(/([\s\[\]])/g,'\\$1');
}
