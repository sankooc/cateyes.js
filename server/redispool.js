var Pool = require('generic-pool').Pool;
var redis = require('redis');

var createClient = function(){
    return redis.createClient();
}

var RedisPool = function() {
    return Pool({
        name: 'redis-pool',
        create: function(callback){
            var client =createClient();
            callback(null, client);
        },
        destroy: function(client) {
            client.quit();
        },
        max: 100,
        idleTimeoutMillis: 30000
    });
};



var pool = RedisPool()

exports.getRedisPoolInstance = function(){
    return pool;
}
////todo 管理基于sub/pub的redis管理
//exports.createResdisClient=function(return_buffers){
//    var client=createClient(return_buffers)
//    return client;
//}
