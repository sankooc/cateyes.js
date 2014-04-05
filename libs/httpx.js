/**
 * Created by sankooc on 14-4-3.
 */
var async = require('async')
    ,http = require('http')
    ,URL = require('url')
    ,MIME = require('mime')
    ,request = require('request')
    ,defer = require('node-promise').defer
    ,mkdirp = require('mkdirp')
    ,fs = require('fs')

MIME.define({'video/f4v':['flv']});
MIME.define({'video/flv':['flv']});

function getText(url){
    var deferred = defer();
    request(url,function(error, response, body){
        if(!error && response.statusCode == 200){
            deferred.resolve(body);
            return;
        }
        deferred.reject('status code :'+response.statusCode+' error:'+error);
    });
    return deferred.promise;
}
function getPath(source){
    return source.folder+source.title+'.'+source.suffix;
}
function _download(source){
    var deferred = defer()
    var errFunc = function(err){
        deferred.reject(err);
    }
    async.waterfall([
        function(cb){
            mkdirp(source.folder,function(err){
                cb(err);
            });
        },
        function(cb){
            head(source.url).then(function(ret){
                cb(null,ret);
            },function(err){
                cb(err,null);
            });
        },
        function(ret,cb){
            source.url = ret.url;
            source.total = ret.length;
            source.suffix = ret.extension;
            source.state =false;
            var filepath = getPath(source);
            if(fs.existsSync(filepath)){
                var len = fs.statSync(filepath).size;
                if(len > ret.length){
                    fs.unlink(filepath);
                    source.current=0;
                }else{
                    source.current=len;
                }
            }else{
                source.current = 0;
            }
            cb(null);
        }
    ],function(err){
        if(err){
            deferred.reject(err);
            return;
        }
        var option = URL.parse(source.url)
        if(source.current >= source.total){
            deferred.resolve();
            return;
        }
        if(source.current > 0){
            option.Range = 'bytes='+source.current+'-';
        }
        var request = http.request(option,function(res){
            var option = { flags: 'a+',
                mode: 0666,
                autoClose: true
            }
            var wStream = fs.createWriteStream(getPath(source),option);
            wStream.on('error',errFunc);
            res.on('data',function(chuck){
                wStream.write(chuck);
                source.current += chuck.length;
            })
            res.on('end',function(){
                wStream.end();
                source.state = 'complete';
                deferred.resolve();
            });
        });
        request.on('error',errFunc);
        request.end();
    });
    return deferred.promise;
}

function download(video){
    var deferred = defer()
    if(video.isExist()){
        console.log('文件已存在');
        deferred.resolve('complete');
        return deferred.promise;
    }
    var sources = video.getSource()
    var tasks=[]
    if(sources.length == 1){
        tasks.push(function(cb){
            sources[0].folder = video.getFolder();
            sources[0].title = video.getTitle();
            sources[0].suffix = video.getSuffix();
            _download(sources[0]).then(function(ret){
                cb(null,ret);
            },function(err){
                cb(err);
            })
        })
    } else {
        var folder = video.getFolder()+video.getTitle() + '/'
        var title = video.getTitle() + '_'
        for(var i= 0;i<sources.length;i++){
            var source = sources[i]
            source.folder = folder
            source.title = title;
            source.suffix = video.getSuffix();
            var func = (function(source,title){
                return function(cb){
                    if(source.index<9){
                        title += '0'+(source.index+1);
                    }else{
                        title += (source.index+1);
                    }
                    source.title = title
                    _download(source).then(function(){
                        cb(null);
                    },function(err){
                        cb(err);
                    })
                }
            })(source,title)
            tasks.push(func);
        }
    }
    async.parallel(tasks,function(err){
        if(err){
            deferred.reject(err);
            return;
        }
        if(video.isExist()){
            deferred.resolve('complete');
        }else{
            deferred.resolve('downloaded');
        }
    })
    return deferred.promise;
}



function head(url,deferred){
    if(!deferred)
        deferred = defer()
    var option = URL.parse(url);
    option.method = 'HEAD';
    http.request(option,function(res){
        switch(res.statusCode){
            case 200:
                var ret = {
                    'url':url
                    ,'length':res.headers['content-length']
                    ,'extension':MIME.extension(res.headers['content-type'])
                }
                deferred.resolve(ret);
                break;
            case 301:
            case 302:
            case 307:
                head(res.headers['location'],deferred);
                return;
            default:
                deferred.reject('status code :'+res.statusCode);
                return;
        }
    }).end();
    return deferred.promise;
}
exports.getText = getText;
exports.download = download;

