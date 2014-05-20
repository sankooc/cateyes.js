/**
 * Created by sankooc on 14-4-3.
 */
var async = require('async')
    , http = require('http')
    , URL = require('url')
    , MIME = require('mime')
    , request = require('request')
    , defer = require('node-promise').defer
    , mkdirp = require('mkdirp')
    , fs = require('fs')

MIME.define({'video/f4v': ['flv']});
MIME.define({'video/flv': ['flv']});
var _wf = async.waterfall
    , apply = async.apply

var queue = async.queue(function(task, callback) {
    task.run(callback);
}, 4);

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

function _download(source, id, callback) {
    var task ={
        name:id
        ,download: function(cb){
            _wf([
                apply(mkdirp, source.folder)
                , function (ret, callback) {
                    head(source.url, callback)
                }
                , function (ret, cb) {
                    source.url = ret.url;
                    source.total = ret.length;
                    source.suffix = ret.extension;
                    source.state = 'init';
                    var filepath = getPath(source);
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
                    cb();
                }
            ], function (err) {
                if (err) {
                    callback(err)
                    return;
                }
                if (source.current >= source.total) {
                    callback('known error');
                    console.error('source size is bigger then total')
                    return;
                }
                var opt = {
                    url: source.url,
                    headers: {
                        'User-Agent': 'Cateye'
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
                        callback(null, source)
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
            });
        }
    }
    queue.push(task,callback)
}

function download(video, callback) {

    if (video.isExist()) {
        console.log('文件已存在');
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
            _download(source, video._id, callback)
        }, callback)
    }
}


function head(url, callback) {
    var option = URL.parse(url);
    option.method = 'HEAD';
    http.request(option,function (res) {
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
    }).end();
}
exports.getText = getText;
exports.download = download;
