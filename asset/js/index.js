/**
 * Created by sankooc on 14-3-5.
 */
$(document).ready(function(){
    addListen();
//    selectActiveItem();
});
var tmp
var period = 1000
var imId=null
var activeList = []
var errFun = function(err){
    console.error(err);
};

function clearContent(){
    clearInt();
    return $('#content').empty();
}

function selectActiveItem(){
    activeList=[];
    clearContent();
    $('<div class="tabbable tabs-top">' +
        '<ul class="nav nav-pills"></ul>' +
        '<div class="tab-content"></div></div>')
        .appendTo('#content');
    updateActiveItem();
}

function selectItemFun(state){
    var url = "/video?state="+state;
    return function(){
        clearContent();
        $.get(url).done(function(data) {
            $('<table class="table table-hover table-bordered"><thead><tr><th style="width: 10%">#</th><th>Title</th></tr></thead></table>')
                .appendTo('#content')
            for(var i=0;i<data.length;i++){
                $('<tr><td style="width: 10%">'+i+'</td><td>'+data[i].title+'</td></tr>').appendTo('table');
            }

        }).fail(errFun)
    };
}


function addListen(){
    $('#_form').submit(function(e){
        e.preventDefault();
        var data = {
            'metadata':tmp,
            'parameter':{
                'title':$('#inputTitle').val()
                ,'type':$('#inputType option:selected').text()
            }
        }
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/video",
            data: data
        }).done(function(ret){

        }).always(function(){
            $('#byurl').modal('hide')
            setTimeout(function(){
                //TODO update
            },500);
        });
    });

    $('#inputURL').focusout(function(){
        $('#inputType').empty();
        var url = this.value;
        if(!/^http:\/\/[A-Za-z0-9\.-]{3,}\.[A-Za-z]{3}/.test(url)){
            tmp = null;
            return
        }
        $('.icon-pencil').css('background-position','0 0')
            .css('background-image','url("img/loading14.gif")');
        $.get("/metadata?url="+url)
            .done(function(data) {
                tmp = data;
                $('#inputTitle').val(data.title);
                for(var i=0;i<data.type.length;i++){
                    $('<option/>').text(data.type[i]).appendTo('#inputType');
                }
            })
            .fail(errFun)
            .always(function() {
                $('.icon-pencil').attr('style','');
            });
    });

    $('#download>li:eq(1)').click(selectItemFun('init'));
    $('#download>li:eq(2)').click(selectActiveItem);
    $('#download>li:eq(3)').click(selectItemFun('done'));
}

function _create(key,val){
    return $('<tr class="success"><td style="width: 10%">'+key+'</td><td colspan="2">'+val+'</td></tr>').appendTo('table');
}

function _create_2(index){
    return $('<tr class="info"><td style="width: 10%">process'+(index+1)+'</td>'
        +'<td style="width: 80%"><div class="progress progress-striped active" style="margin-bottom: 0">'
        +'<div class="bar"></div></div></td><td></td></tr>').appendTo('table');
}

function _setProgressPecent(node,source){
    var percent =Math.round(source.current*100/source.total)
    if(percent == NaN)
        percent = 0
    percent = percent + '%';
    node.find('td div div').css('width',percent).text(percent);
}

function _setProgressSpeed(node,spd){
    node.find('td:eq(2)').text(spd);
}

function clearInt(){
    if(imId)
        clearInterval(imId);
    imId = null;
}

function getDetail(item){
    $.get('/detail?id='+item._id).done(function(data){
        clearInt()
        if($('table').length == 0){
            $('<table class="table table-hover table-bordered"></table>').appendTo('#content>div>div')
        }
        $('table').empty();
        var currentData = data;
        _create('title',data.parameter.title||data.metadata.title);
        _create('type',data.parameter.type);
        _create('provider',data.metadata.provider);
        var num = data.data.count;
        var ret = [];
        for(var i =0;i<num;i++){
            var node = _create_2(i);
            ret.push(node);
            _setProgressPecent(node,data.data.source[i])
        }
        var speedNode = _create('speed','0');
        imId=setInterval(function(){
            $.get('/detail?id='+item._id).done(function(data){
                var acc =0;
                if(!data || !data.data){
                    clearInt()
                }
                for(var j=0;j<data.data.source.length;j++){
                    _setProgressPecent(ret[j],data.data.source[j])
                    var inc = data.data.source[j].current-currentData.data.source[j].current;
                    acc +=inc;
                    if(data.data.source[j].state == 'done'){
                        _setProgressSpeed(ret[j],'done');
                    }else{
                        _setProgressSpeed(ret[j],Math.round(inc/1024)+'kbs');
                    }
                }
                speedNode.find('td:eq(1)').text(acc/1024+'kb');
                currentData = data;
                if(data.state == 'done'){
                    clearInt()
                }
            }).fail(function(err,ret){
//                    alert(err);
                })
        },period);
    }).fail(errFun);
}

function addItem(data){
    for(var i=0;i<data.length;i++){
        var item = data[i]
            ,parentNode
        switch(item.state){
            case 'init':
                parentNode = '#content>div>ul';
                break;
            default:
                return;
        }
        var column = $('<li class="broke"><a data-toggle="tab">'+item.title+'</a></li>');
        column.data('item',item);
        column.click(function(e){
            if($(this).hasClass('active')){
               return;
            }
            getDetail($(this).data('item'));
        }).appendTo(parentNode)
    }
}

function updateActiveItem(){
    $.get("/video?state=active").done(function(data) {
        addItem(data);
    }).fail(errFun)
}