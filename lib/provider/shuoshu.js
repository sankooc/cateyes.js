/**
 * Created by sankooc on 14-3-18.
 */

var defer = require("node-promise").defer;
exports.getResource = function(report){
    var deferred = defer();
    deferred.reject('cannot support');
    return deferred.promise;
}




exports.parseMetadata = function(_url){
    var deferred = defer();
    deferred.reject('cannot support');
    return deferred.promise;
}