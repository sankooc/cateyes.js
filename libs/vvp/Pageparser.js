/**
 * Created by sankooc on 14-2-17.
 */

var jsdom = require('jsdom')
    ,hu = require('../httpUtil')

qdisk = /1qdisk.com/;

exports.getProgram = function(url){
    if(qdisk.test(url)){
        console.log('1qdisk');
        qdisk_rev(url);
    }
}

function qdisk_rev(qdisk){
    hu.getText(qdisk,'utf-8',function(err,content){
        jsdom.env(content, function (errors, window) {
            if(errors){
                console.error('parse html failed');
                return;
            }

            var $ = require('jquery')(window);
            var lists = $('td.vod_list');
            if(!lists){

            }
            for(var i =0;i<lists.length;i++){
                var column = lists[i];
                var span = column.getElementsByTagName('span')[0];
                console.log(span.textContent);
                var iter = column;
                while(true){
                    iter = iter.nextSibling;
                    if(!iter){
                        break;
                    }
//                    console.log(iter.toString());
                    if(iter.toString() == '[ TD ]'){
                        var _img = iter.getElementsByTagName('img');
//                        var attr = iter.getAttribute('onclick');
                        if(_img){
                            var oncl = _img[0].getAttribute('onclick')
                            console.log(oncl);
                        }
                    }
//                    console.log(iter.toString());
//                    var attr = iter.hasAttribute('onclick');
//                    console.log();
//                    break;
                }

            }
//            console.log($('td.vod_list').text());
        });
//        var doc = jsdom.jsdom("<html><body></body></html>", jsdom.level(1, "core"));
//        doc.getElementsByTagName()
    });
}