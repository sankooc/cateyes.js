/**
 * Created by sankooc on 14-4-3.
 */

var http = require('http');

var url = 'http://www.youtube.com/get_video_info?video_id=62cde5yXdyU';

getText(url,'utf-8',function(code,content){
    var tokens = content.split('&');
    tokens.forEach(function(data){
        var to = data.split('=');
        if(to[0] == 'url_encoded_fmt_stream_map'){
//            console.log(data);
            var val = decodeURIComponent(decodeURIComponent(decodeURIComponent(to[1])));
            console.log(val);
        }
    })

//    console.log(tokens);
});



function getText(url,charset,callback){
    var req = http.get(url, function(res) {
        switch(res.statusCode){
            case 200:
                break;
            case 301:
//        case 302:
                var location = res.headers['location'];
                console.log('redirect to %s',location);
                req.abort();
                getText(location,charset,callback);
                return;
            default:
                console.error('response status %s ',res.statusCode);
                req.abort();
                callback(res.statusCode);
                return;
        }
        if(charset){
            res.setEncoding(charset);
        }else{
            res.setEncoding('utf-8');
        }
        var content= '';
        res.on('data',function(chuck){
            content+=chuck;
        }).on('end', function (){
                if(callback){
                    callback(null,content);
                }
            });
    });
};