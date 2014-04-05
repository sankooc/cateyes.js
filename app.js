

//var a ={
//    "ak":12
//    ,"ap":function(){}
//};
//
//var c ={
//    ak:12,
//    ap:function(){
//
//    }
//};
//var b = JSON.parse('{"ak":12}');
//
////for(var p in a){
////    console.log(p);
////}
//console.log(JSON.stringify(
//    a
//    ,function(k,v){
//
//    }
//));
//var url = 'http://f.youku.com/player/getFlvPath/sid/139653723170719332583_03/st/flv/fileid/0300020703530234669A4B04CB019F077B4D1B-50C0-E198-A0E4-EB04C38E805D?K=42d32c63f3f9cae128296f61&ts=367';
//var request = require('request');
//var http = require('http');
//var mime = require('mime');
//
//var httpx = require('./demo/httpx');
//httpx.head(url).then(function(headers){
//    console.log(headers);
//},function(){});


//var options = {
//    hostname: 'www.baidu.com',
//    path:'/',
//    port:80,
//    method: 'GET'
//};
//var option = require('url').parse(url);
//http.request(require('url').parse(url), function(res) {
//    console.log('STATUS: ' + res.statusCode);
//    console.log('HEADERS: ' + JSON.stringify(res.headers));
//}).on('connection',function(){
//        console.log('ark');
//    });
//option.protocol = 'http';
//option.method = 'HEAD'
//console.log(option);
//http.request(option,function(res){
//    console.log('STATUS: ' + res.statusCode);
//    console.log('HEADERS: ' + JSON.stringify(res.headers));
//}).end();
//var url2 = 'http://172.168.0.55/flvfiles/2022000101ACF85E/58.211.22.204/youku/6976EA246404683A7C72DA38FB/0300020703530234669A4B04CB019F077B4D1B-50C0-E198-A0E4-EB04C38E805D.flv';
//var option = require('url').parse(url);
//option.method = 'HEAD';
//
//http.request(option,function(res){
//    console.log('STATUS: ' + res.statusCode);
//    console.log(res.headers['content-length']);
//    console.log(res.headers['content-type']);
////    console.log(mime.extension(res.headers['content-type']));
//    console.log('HEADERS: ' + JSON.stringify(res.headers));
//    res.on('data',function(){
//        console.log('aa');
//    });
//}).end();

//var type = 'text/html';
//mime.define({'video/f4v':['flv']});
//console.log(mime.extension(type));

//var wt =require('fs').createWriteStream('doodle.flv');
//request(url2).pipe(wt);
//wt.on('pipe',function(src){
//    console.log('s');
//}).on('finish',function(){
//        console.log('aa');
//});
//wt.write('ab');




//http.request(options,function(res){
//    var code = res.statusCode;
//    console.log(code);
//})
//request(url, function (error, response, body) {
//    console.log(body.length);
//    if (!error && response.statusCode == 200) {
////        console.log(body) // Print the google web page.
//    }
//})



//var data = ['abc','cdb','aka'];
//var ret = [];
//for(var i =0;i<10000;i++){
//    (function(i){
//
//        require('http').get('http://www.baidu.com',function(){
//            console.error('get index:'+i);
////            ret.push(i)
//        });
//    })(i);
//}
//console.log(ret.length)

//
//function get(data){
////    return(function(data){
//        return function(){
//            console.log(data);
//        }
////    })(data);
//}

//var a =[];
//for(var i=0;i<100;i++){
//    setTimeout(function(){
//        a.push(get(i))
//    },100);
//}
//
//for(var i=0;i< a.length;i++){
//    a[i]();
//}

//function a(inx){
//    return function(){
//        console.log(inx);
//    }
////    setTimeout(function(){
////        console.log(inx);
////    },100)
//}
//
//var a = [];
//for(var i=0;i<20;i++){
//    a.push(function(){
//        console.log(i);
//    });
//}
//for(var i=0;i< a.length;i++){
//    a[i]();
//}