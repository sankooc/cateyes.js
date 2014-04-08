var request = require('request');
var url = 'http://f.youku.com/player/getFlvPath/sid/139697345496617357242_00/st/flv/fileid/030002070052E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8?K=51bf65479c51c31f261d9b10&ts=371';
var fs = require('fs');


//var option = require('url').parse(url);
//console.log(option);

//var req = request(url);
//var stream = req.pipe(fs.createWriteStream('/Users/sankooc/data.flv'));
//    req.on('finish',function(){
//        console.log('finish');
//    }).on('data',function(){
//        console.log('data');
//    }).on('drain',function(data1){
//        console.log('drain');
//    }).on('pipe',function(){
//        console.log('pipe');
//    }).on('unpipe',function(){
//        console.log('unpipe');
//    })

var cateye = require('./lib/cateyes');
var resovler =require('./lib/util/providerResolver');
var HTTPX = require('./lib/httpx');
var page1 = 'http://v.youku.com/v_show/id_XNjY1MTA2NjA0.html';
resovler.getURLMetadata(page1).then(function(data){
            var rep ={
                'metadata':data,
                'parameter':{'type':'flv'}};
            resovler.getResource(rep).then(function(_v){
                HTTPX.download(_v).then(function(status){
                    console.log(status);
                },function(err){
                });
//                var pro = resovler.getProvider(rep);
//                pro.getResource(rep).then(
//                    function(resource){
//                        HTTPX.download(resource).then(function(status){
//                        },function(err){
//                        });
//                    },function(err){
//                    }
//                );
//                console.log(rep);
            });
});


//var tt2 = 'http://172.168.0.54/flvfiles/20780001020DC71B/61.54.25.213/youku/69728AD0B77437F7955A223CE/030002070452E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8.flv';
//
//
//request(tt2).pipe(fs.createWriteStream('/Users/sankooc/data.flv'));