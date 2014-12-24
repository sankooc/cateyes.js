/**
 * Created by sankooc on 14-4-3.
 */
var async = require('async')
    , http = require('http')
    , URL = require('url')
    , MIME = require('mime')
    , request = require('request')
    , mkdirp = require('mkdirp')
    , fs = require('fs')

MIME.define({'video/f4v': ['flv']});
MIME.define({'video/flv': ['flv']});
var _wf = async.waterfall
    , apply = async.apply

var queue = async.queue(function(task, callback) {
    task.download(callback);
}, 2);

var reqList = {};

function getText(url,callback) {
    request(url, function (error, response, body) {
        if(response.statusCode != 200){
            callback('status:'+response.statusCode)
        }else{
            callback(error,body)
        }
    });
}
function getPath(source) {
    return source.folder + source.title + '.' + source.suffix;
}
//todo
function change(id, source, state) {
    var req = reqList[id + source.index];
    if (req) {
        switch (state) {
            case 'pause':
                req.pause();
                break;
            case 'resume':
                req.resume();
                break;
            case 'abort':
                req.abort();
                break;

        }
    }
}


exports.downloadNormal = function(title,source,target,callback){
    var task = {
        name:title
        ,download:function(callback){
            var req = request(source).on('end',function(){
                console.info('%s is downloaded',title)
                callback()
            }).on('error', callback);
            req.pipe(fs.createWriteStream(target)).once('error', callback);
        }
    }
    queue.push(task,callback)
}

function _download(source, id, callback) {
    var filepath = getPath(source)
    var task ={
        name:filepath
        ,download: function(callback){
            console.log('start to download %s',this.name)
            _wf([
                apply(mkdirp, source.folder)
                , function (ret, callback) {
                    head(source.url, callback)
                }
                , function (ret, callback) {
                    source.url = ret.url;
                    source.total = ret.length;
                    source.suffix = ret.extension;
                    source.state = 'init';
                    if (fs.existsSync(filepath)) {
                        var len = fs.statSync(filepath).size;
                        if (len > ret.length) {
                            fs.unlink(filepath);
                            source.current = 0;
                        } else {
                            source.current = len;
                        }
                    } else {
                        source.current = 0;
                    }
                    var opt = {
                        url: source.url,
                        headers: {
                            'User-Agent': 'Cateyes'
                        }
                    };
                    if (source.current > 0) {
                        opt.headers['Range'] = 'bytes=' + source.current + '-';
                    }
                    var req = request(opt).on('data',function (chuck) {
                        source.current += chuck.length;
                    }).on('end',function () {
                            if (source.current == source.total) {
                                source.state = 'done';
                            } else {
                                source.state = 'error';
                            }
                            delete source['request']
                            callback()
                        }).on('error', function (err) {
                            delete source['request']
                            callback(err);
                        });
                    var option = {
                        flags: 'a+',
                        mode: 0666,
                        autoClose: true
                    }
                    req.pipe(fs.createWriteStream(getPath(source), option)).once('error', callback);
                    source.state = 'downloading';
                    source.request = req;
                }
            ], callback);
        }
    }
    queue.push(task,callback)
}

deleteFolderRecursive = function(path,callback) {
    callback = callback || function(){}
    if(!fs.existsSync(path)) return callback()
    async.waterfall([
        function(callback){
            fs.readdir(path,callback);
        }
        ,function(files,callback){
            async.parallel(files,function(file,callback){
                var curPath = path + "/" + file;
                if(fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath,callback);
                } else { // delete file
                    fs.unlink(curPath,callback);
                }
            },callback)
        },function(ret,callback){
            fs.rmdir(path,callback);
        }
    ],callback)
};


function download(video, callback) {
    if (video.isExist()) {
        console.log('文件[%s]已存在',video.getTitle());
        var temp = video.getTemp()
        deleteFolderRecursive(temp,function(){})
        callback(null, 'complete')
        return;
    }
    var sources = video.getSource()
    if (sources.length == 1) {
        sources[0].folder = video.getFolder()
        sources[0].title = video.getTitle()
        sources[0].suffix = video.getSuffix()
        _download(sources[0], video._id, callback)
    } else {
        var folder = video.getFolder() + video.getTitle() + '/'
        var title = video.getTitle() + '_'
        async.each(sources, function (source, callback) {
            source.folder = folder
            source.title = title
            source.suffix = video.getSuffix()
            if (source.index < 9) {
                source.title += '0' + (source.index + 1)
            } else {
                source.title += (source.index + 1)
            }
            _download(source, video.getID(), callback)
        }, callback)
    }
}


head = exports.head = function(url, callback) {
    var option;
    if(typeof(url) == 'string'){
        option = URL.parse(url);
    }else{
        option = url
    }
    option.method = 'HEAD';
    option.headers = {
        'User-Agent':'Cateyes'
    }
    var req = http.request(option,function (res) {
        switch (res.statusCode) {
            case 200:
                var ret = {
                    'url': url, 'length': res.headers['content-length'], 'extension': MIME.extension(res.headers['content-type'])
                }
                callback(null, ret)
                break;
            case 301:
            case 302:
            case 307:
                head(res.headers['location'], callback);
                return;
            default:
                callback('status code :' + res.statusCode)
                return;
        }
    })
    req.on('error',function(err){
        console.error(err)
    });
    req.end()
}
exports.getText = getText;
exports.download = download;
