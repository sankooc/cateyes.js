/**
 * Created by sankooc on 14-5-13.
 */
var async = require('async');
var http = require('http');


var q = async.queue(function(task, callback) {
    console.log('worker is processing task: ', task.name);
    task.run(callback);
}, 2);
q.saturated = function() {
    console.log('all workers to be used');
}

/**
 * 监听：当最后一个任务交给worker时，将调用该函数
 */
q.empty = function() {
    console.log('no more tasks wating');
}

/**
 * 监听：当所有任务都执行完以后，将调用该函数
 */
q.drain = function() {
    console.log('all tasks have been processed');
}
var server = http.createServer(function (req, res) {

    q.push({name:'t1', run: function(cb){
        console.log('t1 is running, waiting tasks: ')
        process.nextTick(function(){
            cb(null,'t1 complete')
        })
    }}, function(err) {
        console.log('t1 executed');
    });

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end();
});

server.listen(8080)
