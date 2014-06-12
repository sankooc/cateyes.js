/**
 * Created by sankooc on 14-5-28.
 */
var env = require('jsdom').env
    ,http = require('http')
    ,request = require('request')
    ,publish
    ,Map = require('data-structures').Map
function convert(text){
    return text.match(reg2)[0].match(/(\d+)/g)
}

exports.get_list=function(url,callback){
    var map = {}
    request.get(url,function(err,res,html){
        env(html, function (errors, window) {
            var $ = require('jquery')(window);
            var content = $('div[id|="di1"]>ul>li');
            for(var i=0;i<content.length;i++){
                var _this = content.get(i)
                var title = $(_this).text()
                $(_this).find('span>a').each(function(){
                    var url_pt = $(this).attr('href')
                    var vid = url_pt.match(/new_youku\('(\w+)'/)
                    if(vid){
                        map[title] = {
                            provider:'youku'
                            ,vid:vid[1]
                        }
                        return;
                    }
                    var uu=url_pt.match(/new_sohu\('(\S+)'/)
                    if(uu){
                        map[title] = {
                            provider:'sohu'
                            ,url:uu[1]
                        }
                        return;
                    }
                })
            }
            callback(null,map)
        });
    })
}
