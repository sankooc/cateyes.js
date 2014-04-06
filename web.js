/**
 * Created by sankooc on 14-2-8.
 */
var http = require('http')
    ,url = require('url')
    ,fs = require('fs')
    ,mime = require('mime')
    ,cateyes = require('./cateyes')

var express = require('express');
var app = express();

app.set('port', process.env.PORT || 8080);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

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

app.get('/detail',function(req,res){
    var query = req.query;
    cateyes.getDetail(query.id).then(function(ret){
        if(ret){
           res.json(ret);
        }
        res.send(200);
    },function(err){
        res.send(500,err);
    });
})

app.get('/video',function(req,res){
    var query = req.query;
    var con = {};
    for(var k in query){
        con[k] = query[k];
    }
    cateyes.getTask(con).then(function(ret){
        res.json(ret);
    },function(err){
        res.send(500,err);
    });
});

app.post('/settings',function(req,res){
    console.log(req.body);

    res.send(200);
});
var server = http.Server(app);
server.listen(app.get('port'));
//http.createServer(app).listen(app.get('port'), function(){
//    console.log('server started on' + app.get('port'));
//});
