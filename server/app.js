/**
 * Created by sankooc on 14-2-8.
 */
var http = require('http')
  ,url = require('url')
  ,fs = require('fs')
  ,mime = require('mime')
var express = require('express');
var app = express();
var Resolve = require('./resolve/FileResolver');

var homeRoot = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/Movies/Cateyes/';

var resolver = new Resolve();
app.set('port', process.env.PORT || 8001);
//app.use(express.logger('dev'));
app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());
//console.log(__dirname + '/../asset/');
app.use('/',express.static(__dirname + '/../asset/'));
app.use('/file',express.static(homeRoot))
//app.use(function(err, req, res, next){
//  console.error(err.stack);
//  res.send(500, 'Something broke!');
//});

app.use(express.favicon(__dirname+'/favicon.ico'));
app.get('/', function(req, res){
  var userAgent = req.get('user-agent');
  if(userAgent.indexOf('iPhone')>=0){
    console.log('iphone');
    res.redirect('/mobile');
  }else{
    console.log('redirect');
    res.redirect('/main');
  }
  //console.log(req.headers);
  //res.redirect('/public');
});

app.get('/api/files',function(req,res){
  resolver.parse(function(err,data){
    res.json(data);
  });
});

//app.post('/file',function(req,res){
//  var body = req.body;
//  console.log(body)
//  res.json({});
//});

//app.post('/video',function(req,res){
//  console.log(req.body);
//  cateyes.addToDownloadList(req.body.metadata,req.body.parameter);
//  res.json({});
//});
//
//app.get('/metadata',function(req,res){
//  var url = req.query.url;
//  cateyes.getURLMetadata(url).then(function(data){
//    res.json(data);
//  },function(err){
//    res.send(500,err);
//  });
//});
//
//app.get('/detail',function(req,res){
//  var query = req.query;
//  cateyes.getDetail(query.id).then(function(ret){
//    if(!ret){
//      ret = {};
//    }
//    res.json(ret);
//  },function(err){
//    res.send(500,err);
//  });
//})
//
//app.get('/video',function(req,res){
//  var query = req.query;
//  var con = {};
//  for(var k in query){
//    con[k] = query[k];
//  }
//  cateyes.getTask(con).then(function(ret){
//    res.json(ret);
//  },function(err){
//    res.send(500,err);
//  });
//});
//
//app.post('/settings',function(req,res){
//  console.log(req.body);
//
//  res.send(200);
//});


app.listen(8080);

//var server = http.Server(app)
//var io = require('socket.io').listen(server);
//
//server.listen(app.get('port'));
//
//io.sockets.on('connection', function (socket) {
//  socket.emit('news', { hello: 'world' });
//  socket.on('my other event', function (data) {
//    console.log(data);
//  });
//  socket.on('disconnect',function(){
//    console.log('disconnect');
//  });
//});