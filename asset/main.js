/**
 * Created by sankooc on 14-2-10.
 */
define(function(require){
    var $ = require('jquery');
    var entity = require('./lib/video').entity;
    var Video = require('./lib/video').Video;
    var ws_url = 'ws://127.0.0.1:8081/update';
    var colors = ['green','red','blue'];
    if(!$ || !entity || !Video){
        throw Error('load library failed');
    }
    var _body = new entity('body');
    var video = new Video(ws_url);
    create();
    video.init();
//    var finder = require('./lib/vpp/finder');
//    finder.getInfo('http://1qdisk.com/vod/view.html?idx=8016');
    ////////////

    function create(){
        var title;
        var nav = _body.$add('nav','navigator').add('ul');
        nav.$add('li').add('a').text('下载记录');
        nav.$add('li').add('a').text('添加地址').click(_popupNewVideo);
        nav.$add('li').add('a').text('添加vid').click(_popupVidVideo);
        nav.$add('li').add('a').text('添加专辑');

        var main = _body.$add('div','main');
        //list
        var _list = main.$add('div','list','list');
        _list.$add('h4').text('video list')
            .add('img','list-img').attr('src','loading2.gif').css('display','none');
        var vlist = _list.$add('ul');

        //data
        var table = main.$add('div','data').add('table','detail');

        var _title=_column(table,'名称:')
            ,_suffix =_column(table,'后缀:')
            ,_folder =_column(table,'下载目录:')
            ,_state =_column(table,'状态 :')
            ,_count =_column(table,'fragment:')
            ,_process =_column(table,'下载进程:')
            ,lst
            ,processes = [];
        //event handler
        video.on('+video',function(data){
            var arch = vlist.$add('li');
            arch.$add('a').text(data.val).click(function(event){
                if(title == data.val)
                    return;
                if(lst)
                    lst.attr('style','');
                arch.css('background-color','#56803d');
                lst = arch;
                title = data.val;
                _title.text('');
                _suffix.text('');
                _folder.text('');
                _state.text('');
                _count.text('');
                _process.getNode().empty();
                processes = [];
                video.get(data.val);
            });
            }).on('-video',function(data){
                $(".list ul li a:contains('"+title+"')").remove();
            }).on('+title',function(data){
                _title.text(data.val);
            }).on('+suffix',function(data){
                _suffix.text(data.val);
            }).on('+folder',function(data){
                _folder.text(data.val);
            }).on('+state',function(data){
                _state.text(data.val);
            }).on('*state',function(data){
                _state.text(data.val);
        }).on('+count',function(data){
                _count.text(data.val);
                var wid =Math.min(data.val*50,220);
                _process.css('height',wid+'px');
        }).on('+source',function(data){
                var index = data.index;
                var current = data.current;
                var total = data.total;
                var time = new Date().getTime();
                if(!processes[index]){
                    var ff =_process.$add('div').css('height','42px').css('margin-bottom','5px');
                    ff.$add('div','fragment').text('part'+(index+1)+':');
                    var proc = ff.$add('div','black panel').add('div',colors[index%3]+' amount');
                    var bps = ff.$add('div','bps');
                    processes[index] = {
                        'current':0
                       ,'curtime': 0
                       ,'last_amount':current
                       ,'last_time': time
                       ,'total':total
                       ,'spd':bps
                       ,'process':proc
                    };
                }
                var _proc = processes[index];
                _proc.current = current;
                _proc.curtime = time;
//                _proc.total = total;
                var percent = Math.round(_proc.current/_proc.total*100);
                setProgress(_proc.process,percent);
                if(percent >=100){
                    _proc.spd.text('complete');
                }else{
                    var period = time - _proc.last_time;
                    var increase = current - _proc.last_amount;
                    _proc.last_amount = current;
                    _proc.last_time = time;
                    var spd = Math.round(increase/(period/1000))>>10
                    _proc.spd.text(spd+' kb/s');
                }
        });

        //footer
        _body.$add('div','footer');
        _body.$add('div','cloud');
        _body.$add('div','msg');
    }

    function setProgress(_process,percent){
        if(percent == NaN){
            percent = 0;
        }
        if(percent>100){
            percent = 100;
        }
        _process.css('width',percent+'%');
        _process.text(percent+'%');
    }

    function _form(msg, title){
        var form = msg.$add('div');
        form.css('width','100%').css('overflow','hidden');
        form.$add('label','msg_key').text(title);
        return form;
    }
    function _column(table,title){
        var column = table.$add('tr');
        column.$add("td",'key').text(title);
        return column.$add("td",'val');
    }
    function _input(form,type,req){
        var input = form.$add('input','msg_val').attr('type',type);
        if(req){
            input.attr('required','required');
        }
        return input;
    }

    function _popupVidVideo(){
        _setMsgEnable(true);
        var msg = new entity('.msg');
        msg.$add('h2').text('add video by VID');
        var ff = msg.add('form');

        var form =_form(msg,'Provider :');
        var _provider = form.$add('select','msg_val');
        _provider.$add('option').text('youku').attr('value','youku');
        _provider.$add('option').text('sohu').attr('value','sohu');
        _provider.$add('option').text('tencent').attr('value','tencent');


        form =_form(msg,'Vid :');
        var _vid = _input(form,'text',true);

        form = _form(msg,'Title :');
        var _title = _input(form,'text',true);
        var _img = form.$add('img','f1').attr('src','loading2.gif').css('display','none');

        form = _form(msg,'Quality :');
        var _quality = form.$add('select','msg_val','_quality');

        form = _form(msg,'Folder :');
        var _folder = _input(form,'text',true).attr('value','/Users/sankooc/test2/');

        form = msg.$add('div').css('width','100%').css('overflow','hidden')
        var submit = form.$add('input','msg_button').attr('type','submit').attr('value','submit');
        var cancel = form.$add('button','msg_button').text('cancel');


        _vid.getNode().focusout(function(){
            if(_vid.val()&&_provider.val()){

            }else{
                return;
            }
            video.getMetadata_VID(_provider.val(),_vid.val(),function(data){
                _title.getNode().val(data.title);
                if(data.types){
                    _quality.getNode().empty();
                    for(var i=0;i<data.types.length;i++){
                        _quality.$add('option',null,null,data.types[i]).attr('value',data.types[i]);
                    }
                }
            },function(){
                _img.css('display','none');
            });
            _img.css('display','block');
        });

        ff.getNode().submit(function(e){
            e.preventDefault();
            video.addVid(_provider.val(),_vid.val(),_title.val(),_quality.val(),_folder.val());
            _setMsgEnable(false);
        });
        cancel.getNode().attr('type','button').click(function(){
            _setMsgEnable(false);
        });
    }

    function _popupNewVideo(){
        _setMsgEnable(true);
        var msg = new entity('.msg');
        msg.$add('h2').text('add video');
        var ff = msg.add('form');

        var form =_form(msg,'URL :');
        var _url = _input(form,'url',true);

        form = _form(msg,'Title :');
        var _title = _input(form,'text',true);
        var _img = form.$add('img','f1').attr('src','loading2.gif').css('top','84px').css('display','none');

        form = _form(msg,'Quality :');
        form.add('div');
        var _provoder = form.$add('img','provider').css('display','none');
        var _quality = form.$add('select','msg_val','_quality').css('width','190px');

        form = _form(msg,'Folder :');
        var _folder = _input(form,'text',true).attr('value','/Users/sankooc/test2/');

        form = msg.$add('div').css('width','100%').css('overflow','hidden')
        var submit = form.$add('input','msg_button').attr('type','submit').attr('value','submit');
        var cancel = form.$add('button','msg_button').text('cancel');


        _url.getNode().focusout(function(){
            _provoder.css('display','none');
            _quality.getNode().empty();
            _title.text('');
            var url = _url.getNode().val();
            if(!url || url ==''){
                return;
            }
            if(!/^http:\/\/[A-Za-z0-9\.-]{3,}\.[A-Za-z]{3}/.test(url)){
                return
            }
            video.getMetadata(url,function(data){
                _title.getNode().val(data.title);
                if(data.types){
                    for(var i=0;i<data.types.length;i++){
                        _quality.$add('option',null,null,data.types[i]).attr('value',data.types[i]);
                    }
                }
                switch(data.provider){
                    case 'youku':
                        _provoder.css('display','inline').attr('src','http://www.youku.com/favicon.ico');
                        break
                    case 'sohu':
                        _provoder.css('display','inline').attr('src','http://www.sohu.com/favicon.ico');
                        break
                    case 'tencent':
                        _provoder.css('display','inline').attr('src','http://www.qq.com/favicon.ico');
                        break
                }


            },function(){
                _img.css('display','none');
            });
            _img.css('display','block');
        });

        ff.getNode().submit(function(e){
            e.preventDefault();
            var saa = _url.val();
            video.add(_url.val(),_title.val(),_quality.val(),_folder.val());
            _setMsgEnable(false);
        });
        cancel.getNode().attr('type','button').click(function(){
            _setMsgEnable(false);
        });
    }

    function _setMsgEnable(flag){
        var msg = $('.msg');
        if(flag){
            _setPanelEnable(false);
            msg.empty();
            msg.css('display','block');
        }else{
            msg.empty();
            msg.css('display','none');
            _setPanelEnable(true);
        }
    }
    function _setPanelEnable(flag){
        var st , w , h;
        if(flag){
            st = 'none' ,w =0,h = 0;
        }else{
            st = 'block',w = document.body.clientWidth,h = document.body.clientHeight;
        }
        $('.cloud')
            .css('display',st)
            .css('width',w)
            .css('height',h);
    }
});