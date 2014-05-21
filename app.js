/**
 * Created by sankooc on 14-5-16.
 */


var cateyes = require('./lib/cateyes')


function subscript(){
    cateyes.subscriptTask(function(err){
        if(err)
            console.error(err)
    })
}
subscript()
