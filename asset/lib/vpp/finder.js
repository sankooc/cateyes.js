/**
 * Created by sankooc on 14-2-14.
 */
define(function(require,exports){
    var $ = require('jquery');
    function getInfos(url,cb){

        $.ajax({
            url:url,
            type:'GET',
            dataType:'text/html'
        }).done(function(data){
                var div =document.createElement('div');

        })
    }

    exports.getInfo = getInfos;
});