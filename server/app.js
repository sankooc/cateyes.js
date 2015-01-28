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

// var homeRoot = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/Movies/Cateyes/';

var resolver = new Resolve();
var homeRoot= resolver.root;
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
  if(userAgent.indexOf('iPhone')>=0 || userAgent.indexOf('android')>=0){
    //console.log('iphone');
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
app.get('/api/albums',function(req,res){
  res.json(resolver.albums());
});
app.get('/api/albums/:album',function(req,res){
  res.json(resolver.chapters(req.params.album));
});

app.get('/api/albums/:album/:chapter',function(req,res){
  res.json(resolver.clips(req.params.album,req.params.chapter));
});

app.listen(8080);