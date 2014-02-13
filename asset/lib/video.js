/**
 * Created by sankooc on 14-2-7.
 */
define(function(require,exports){
    var $ = require('jquery');
    function entity(selector,node){
        if(selector)
            this.node = $(selector);
        if(node)
            this.node = node;
    }
    entity.prototype.getNode = function(){
        return this.node;
    }
    entity.prototype.val = function(){
        return this.node.val();

    }
    entity.prototype.text = function(val){
        this.node.text(val);
        return this;
    }
    entity.prototype.css = function(key,val){
        this.node.css(key,val);
        return this;
    }

    entity.prototype.click = function(handler){
        this.node.click(handler);
    }

    entity.prototype.attr = function(key,val){
        this.node.attr(key,val);
        return this;
    }

    entity.prototype.$add = function(tag,clz,id,text){
        var tmp = $(create(tag,clz,id,text)).appendTo(this.node);
        return new entity(null,tmp);
    }
    entity.prototype.add = function(tag,clz,id,text){
        this.node = $(create(tag,clz,id,text)).appendTo(this.node);
        return this;
    }
    function create(tag,clz,id,text){
        var tmp = '<'+tag;
        if(clz)
            tmp += ' class="'+clz+'"';
        if(id)
            tmp += ' id="'+id+'"';
        tmp+='>';
        if(text)
            tmp+=text;
        tmp+='</'+tag+'>';
        return tmp;
    }


    function Video(url){
        this.url = url;
        this.socket = new WebSocket(url);
        this.eventTable = {};
    }


    Video.prototype.init = function(){
        var _this = this;
        this.socket.onopen = function(data){
            _this.emit('connect',data);
//            socket.send('');
        }
        this.socket.onmessage = function(event){
            var datas = JSON.parse(event.data);
            var key = datas.key;
            _this.emit(key,datas);
        }
        this.socket.onerror = function (error) {
            _this.emit('connect_failed',error);
        };

    }

    //添加视频
    Video.prototype.add = function(url,title,quality,folder){
        var _this = this;
        var data ={
            'url':url
            ,'title':title
            ,'quality':quality
            ,'folder':folder
        };
        $.ajax({
            type: "POST",
            dataType: "application/json",
            url: "/video",
            data: JSON.stringify(data)
        }).fail(function(err){
            _this.emit('error',err);
        });
    }


    Video.prototype.addVid = function(provider,vid,title,quality,folder){
        var _this =this;
        var data ={
            'provider':provider
            ,'title':title
            ,'vid':vid
            ,'quality':quality
            ,'folder':folder
        }
        $.ajax({
            type: "POST",
            dataType: "application/json",
            url: "/video",
            data: JSON.stringify(data)
        }).fail(function(err){
                _this.emit('error',err);
            });
    }


    //取title和后缀
    Video.prototype.getMetadata_VID = function(provider,vid,success,always){
        var _this = this;
        $.ajax({
            type: "GET",
            url: "/metadata?provider="+provider+"&vid="+vid,
            timeout:2000
        }).done(function(data) {
                success(data);
            })
            .fail(function(data) {
                _this.emit('error',data);
            })
            .always(function() {
                always();
            });
    }

    //取title和后缀
    Video.prototype.getMetadata = function(url,success,always){
        var _this = this;
        $.get("/metadata?url="+url)
            .done(function(data) {
                success(data);
            })
            .fail(function(data) {
                _this.emit('error',data);
            })
            .always(function() {
                always();
            });
    }

    //取Video信息
    Video.prototype.get = function(title){
        this.socket.send(title)
    }

    Video.prototype.emit = function(type,data){
        if(type && this.eventTable[type] && this.eventTable[type].length > 0){
            var handlers = this.eventTable[type];
            for(var i=0;i<handlers.length;i++){
                handlers[i](data);
            }
        }
        return this;
    }

    Video.prototype.on = function(type,handler){
        if(type){
            if(!this.eventTable[type])
                this.eventTable[type] = [];
            this.eventTable[type].push(handler);
        }
        return this;
    }

    exports.Video = Video;
    exports.entity = entity;

});

