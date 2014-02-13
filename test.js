var test = require('assert');
var exec = require('child_process').exec;
var fs = require('fs');
var os = require('os');





//var process = require('process');
//var youku = reqire('./libs/youku');

//var resolvResult = youku.resolv('XNTc5NDY4NTEy');
//var unit = require('./libs/httpUtil').httpSet;
//var a =new unit();
//console.log(a.a);

//new RegExp('[\\S\\s]+akb(\\d+).mp4','g');
//var a1 = '더 지니어스 게임의 법칙.E11.130705.'
//var a2 = '/Users/sankooc/test/더 지니어스 게임의 법칙.E11.130705./더 지니어스 게임의 법칙.E11.130705._9.mp4';
//var a3 = '/Users/sankooc/test/더 지니어스 게임의 법칙.E11.130705./';
//console.log('os : %s',process.platform);
//console.log(offset(a1));
//create(a3);
//c2(a3);
function reg(text,title,suffix){
  //a.replace('(\\d+)','');

  //var num = "1234 5678";
  //var rr = '(\\d{4}) (\\d{4})';
  //eval('var re = /(\d{4}) (\d{4})/');
  //var re = new RegExp(rr);

  //var title = 'akb';
  var str = '[\\S\\s]+'+title+'_(\\d+)'+suffix;
  var val = text.replace(new RegExp(str,'g'),"$1");
  console.log(val);
  console.log(typeof val);
}
function create(arg){
  var mFile = arg +'merge.txt';
  console.log(mFile);
  var wStream = fs.createWriteStream(mFile);
  wStream.write("file ' ss '\n");
  wStream.end();


}

function offset(str){
  return str.replace(/ /g,'\\ ')


}
function c2(a3){
  var folder = offset(a3);
  var a = 'printf \"files \'%s\' \\n \" '+folder+'*.mp4'+' > '+folder+'abk.txt';
  console.log(a);
  exec(a);
}


function os(){
  console.log('os type : %s',os.type());
  console.log('os platform : %s',os.platform());
  console.log('os release :%s',os.release());
  console.log('os arch : %s',os.arch());
  console.log('os cup info : %s',os.cpus());
}

