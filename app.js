/**
 * Created by sankooc on 14-5-16.
 */
var cateyes = require('./lib/cateyes')

process.on('message', function(kind) {
    switch(kind.cmd){
        case 'download':
            return cateyes.subscript(kind.metadata,kind.param,kind.id,function(){})
        case 'detail':

            return ;
    }
});
