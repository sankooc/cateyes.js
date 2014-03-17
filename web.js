/**
 * Created by sankooc on 14-2-8.
 */
var http = require('http')
    ,url = require('url')
    ,fs = require('fs')
    ,mime = require('mime')
    ,cateyes = require('./cateyes')


console.log(__dirname);
var express = require('express');
var app = express();
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use('/asset',express.static(__dirname + '/asset'));
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, 'Something broke!');
});

app.use(express.favicon(__dirname+'/favicon.ico'));
app.get('/', function(req, res){
    res.redirect('/asset/index.htm');
});

app.post('/video',function(req,res){
    console.log(req.body);
    cateyes.addToDownloadList(req.body.metadata,req.body.parameter);
    res.send(200);
});

app.get('/metadata',function(req,res){
    var url = req.query.url;
    cateyes.getURLMetadata(url).then(function(data){
        res.json(data);
    },function(err){
        res.send(500,err);
    });
});

app.get('/video',function(req,res){
    var query = req.query;
    switch(query.type){
        case 'active':
            var _id = query.id;
            res.json(cateyes.getActiveTask(_id));
            break;
    }
});

app.listen(8080);



//var ROOT = '/Users/sankooc/repo/git/cateyes.js/';
////load favicon
//var favicon;
//fs.readFile(ROOT+'/asset/favicon.ico',function(err,file){
//    if(!err)
//       favicon = file;
//});
//
//
//
//var eye = new eyes();
//
//
//function reLocation(req,res){
//    var location = 'http://'+req.headers.host+'/asset/main.html';
//    res.writeHead(301,{'Location':location});
//    res.end();
//}
//
//function page404(req,res){
//    var path = ROOT+'/asset/404.html';
//    fs.readFile(path,function(err,file){
//        if(err){
//            res.writeHead(501);
//            res.end();
//            return;
//        }
//        res.writeHead(404);
//        res.end(file);
//    });
//}
//http.createServer(function(req,res){
//    var path = url.parse(req.url).pathname;
//    var query = url.parse(req.url,true).query;
//    if(path == '/favicon.ico'){
//        res.writeHead(200,{'content-type':'image/x-icon'});
//        res.end(favicon);
//        return;
//    }
//    var inx = path.indexOf('asset');
//    if(inx > -1){
//        path = ROOT+path;
//        if(fs.existsSync(path)){
//            fs.readFile(path,function(err,file){
//                if(err){
//                    res.writeHead(404);
//                    res.end();
//                    return;
//                }
//                var type  = mime.lookup(path);
//                if(type){
//                    res.setHeader('Content-Type',type);
//
//                }
//                res.writeHead(200);
//                res.end(file);
//                return;
//            });
//        }else{
//            page404(req,res);
//        }
//    }else{
//    var index = path.indexOf('/',1);
////    if(-1 == index){
////        reLocation(req,res);
////        return;
////    }
//    var action = path.substring(1,index);
//
////    console.log('action : %s',action);
//    switch(path){
//        case '/metadata':
//            try{
//                handleMetadata(query,res);
//            }catch(e){
//             console.error(e);
//            }
//            break;
//        case '/video':
//            if('transfer-encoding' in req.headers || 'content-length' in req.headers){
//                var buf = '';
//                req.setEncoding('utf-8');
//                req.on('data',function(chunk){
//                    buf+=chunk;
//                }).on('end',function(){
//                    var raw = JSON.parse(buf)
//                       ,_url = raw.url
//                       ,_provider = raw.provider
//                       ,_vid = raw.vid
//                       ,_quality = raw.quality
//                       ,_folder = raw.folder
//                       ,_title = raw.title
//                    console.log('quality : %s title : %s folder : %s',_quality,_title,_folder);
//                    if(_url){
//                        eye.addVideo(_url,_quality,_folder,_title);
//                        res.writeHead(200);
//                        res.end();
//                    }else if(_provider && _vid){
//                        eye.addVideoByVid(_provider,_vid,_quality,_folder,_title);
//                        res.writeHead(200);
//                        res.end();
//                    }
//                })
//            }
//            break;
//        default:
//            page404(req,res);
//    }
//    }
//}).listen(8080);
//
//
//function handleMetadata(query,res){
//    if(query.url){
//        cateyes.getTitle(query.url,function(flag,profile){
//            var ret = JSON.stringify(profile);
//            res.writeHead(200, {
//                'Content-Length': Buffer.byteLength(ret,'utf-8'),
//                'Content-Type': 'application/json' });
//            res.write(ret);
//            res.end();
//        })
//    }else if(query.vid && query.provider){
//        console.log('provider:%s vid:%s',query.provider,query.vid);
//        cateyes.getTitleByVid(query.provider,query.vid,function(flag,profile){
//            var ret = JSON.stringify(profile);
//            res.writeHead(200, {
//                'Content-Length': Buffer.byteLength(ret,'utf-8'),
//                'Content-Type': 'application/json' });
//            res.write(ret);
//            res.end();
//        })
//    }
//}
//
//
//
//console.log('http-server is running');
//
//
//var WebSocketServer = require('ws').Server
//    , wss = new WebSocketServer({port: 8081});
//
//wss.on('connection', function(ws) {
//    console.log('connected');
//    var videos = eye.getVideos();
//    var handler = function(video){
//        ws.send('{"key":"+video","val":"'+video.title+'"}');
//    };
//    for(var i = 0 ;i<videos.length;i++){
//        handler(videos[i]);
//    }
//
//    eye.on('add',handler);
//
//    var m = new monitor(ws);
//    ws.on('message', function(title) {
//        console.log('ws message %s',title);
//        m.off();
//        var video;
//        for(var i = 0 ;i<videos.length;i++){
//            if(videos[i].title == title){
//                video = videos[i];
//                break;
//            }
//        }
//        if(!video){
//            return;
//        }
//        m.on(video);
//    });
//
//    ws.on('close',function(){
//        console.log('socket closed');
//        eye.removeListener('add',handler);
//        m.close();
//    });
//});

//console.log('websocket-server is running');