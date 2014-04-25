/**
 * Created by sankooc on 14-4-6.
 */
var http = require('http')

var express = require('express');
var app = express();

app.set('port', process.env.PORT || 8080);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use('/asset',express.static(__dirname + '/../asset'));

app.use(express.favicon(__dirname+'/../favicon.ico'));
app.get('/', function(req, res){
    res.redirect('/asset/index.htm');
});

app.get('/detail',function(req,res){
    res.json({
        "_id": "abead76d-9fca-427b-a3f6-8c64a097ab3a",
        "metadata": {
            "title": "강용석의 고소한 19.E65.140122",
            "type": [
                "flv",
                "mp4"
            ],
            "vid": "XNjY1MTA2NjA0",
            "provider": "youku"
        },
        "parameter": {
            "title": "ppla",
            "type": "flv"
        },
        "state": "init",
        "data": {
            "count": 7,
            "suffix": "flv",
            "checksum": "",
            "source": [
                {
                    "index": 0,
                    "url": "http://101.226.245.209/youku/656D9E89EE498417F650A6A11/030002070052E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8.flv",
                    "folder": "/Users/sankooc/Movies/cateyes/ppla/",
                    "title": "ppla_01",
                    "suffix": "flv",
                    "total": "16139565",
                    "state": "init",
                    "current": 3249846
                },
                {
                    "index": 1,
                    "url": "http://116.10.191.72/youku/6971EA4A7FB47748EB8C65BF8/030002070152E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8.flv",
                    "folder": "/Users/sankooc/Movies/cateyes/ppla/",
                    "title": "ppla_02",
                    "suffix": "flv",
                    "total": "13684108",
                    "state": "init",
                    "current": 2610482
                },
                {
                    "index": 2,
                    "url": "http://14.17.89.81/youku/6771B3D084E33748B752A6F06/030002070252E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8.flv",
                    "folder": "/Users/sankooc/Movies/cateyes/ppla/",
                    "title": "ppla_03",
                    "suffix": "flv",
                    "total": "13201567",
                    "state": "init",
                    "current": 3324727
                },
                {
                    "index": 3,
                    "url": "http://59.175.148.215/youku/6972573E7544E83697A0DC32F1/030002070352E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8.flv",
                    "folder": "/Users/sankooc/Movies/cateyes/ppla/",
                    "title": "ppla_04",
                    "suffix": "flv",
                    "total": "12534237",
                    "state": "init",
                    "current": 1917847
                },
                {
                    "index": 4,
                    "url": "http://119.97.130.46/youku/677220C49274881CAF716E2EDC/030002070452E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8.flv",
                    "folder": "/Users/sankooc/Movies/cateyes/ppla/",
                    "title": "ppla_05",
                    "suffix": "flv",
                    "total": "11964604",
                    "state": "init",
                    "current": 1840088
                },
                {
                    "index": 5,
                    "url": "http://59.174.228.19/youku/6972C43252B4282DE8B9F947C0/030002070552E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8.flv",
                    "folder": "/Users/sankooc/Movies/cateyes/ppla/",
                    "title": "ppla_06",
                    "suffix": "flv",
                    "total": "7955730",
                    "state": "init",
                    "current": 2578807
                },
                {
                    "index": 6,
                    "url": "http://182.140.226.11/youku/6972FAAC9233A820AFC8E74C45/030002070652E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8.flv",
                    "folder": "/Users/sankooc/Movies/cateyes/ppla/",
                    "title": "ppla_07",
                    "suffix": "flv",
                    "total": "8406880",
                    "state": "init",
                    "current": 2966168
                }
            ]
        }
    });
})

app.get('/video',function(req,res){
    var query = req.query;
    switch(query.state){
        case 'done':
            res.json([
                {
                    "_id": "abead76d-9fca-427b-a3f6-8c64a097ab3a",
                    "state": "init",
                    "title": "的啊大洼我",
                    "folder":"/Users/sankooc/Movies/",
                    "size":103214123,
                    "update":"2014.5.12"
                },
                {
                    "_id": "abead76d-9fca-427b-a3f6-8ca097ab3a",
                    "state": "init",
                    "title": "我说的的撒大帝",
                    "folder":"/Users/sankooc/Movies/",
                    "size":103214123,
                    "update":"2014.5.12"
                }
            ]);
            break;
        default:
            res.send(404);
            break;
    }
});

var server = http.Server(app);
server.listen(app.get('port'));