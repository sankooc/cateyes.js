/**
 * Created by sankooc on 14-3-5.
 */
$(document).ready(function(){
    addListen();
    getContent();
});
var tmp;
function addListen(){

    $('#_form').submit(function(e){
        e.preventDefault();

        var data = {
            'metadata':tmp,
            'parameter':{
                'title':$('#inputTitle').val()
//                ,'folder':'/Users/sankooc/test/'
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
            .fail(function(data) {
            })
            .always(function() {
                $('.icon-pencil').attr('style','');
            });
    });

}

function getDetail(id){
    $.get('/detail?id='+id).done(function(data){

    })
        .fail(function(data) {
    })
        .always(function() {
        });
}

function getContent(){
    $.get("/video?state=active")
        .done(function(data) {
            for(var rec in data){
                var title = data[rec].parameter.title || data[rec].metadata.title;
                (function(data,rec,title){
                    $('<li><a href="#">'+title+'</a></li>').click(function(){
                        getDetail(rec);
                    }).appendTo('#downloading');
                })(data,rec,title);

            }
//            for(var i=0;i<data.length;i++){
//                var title = data.parameter.title || data.metadata.title;
//                $('<li><a href="#">'+title+'</a></li>').appendTo('#downloading');
//
//            }
//            $('#downloading').append();
        })
        .fail(function(data) {
        })
        .always(function() {
        });
}

function $navbar(pos){
    var root = $div('body','navbar');
    switch(pos){
        case 'top':
            root.addClass('navbar-fixed-top');
            break;
        case 'bottom':
            root.addClass('navbar-fixed-bottom');
            break;
    }

    return $div($div(root,'navbar-inner'),'container');
}

function addButton(parent,text,color){
    var btn = $('<button/>').appendTo(parent).addClass('btn').text(text);
    if(btn){
        btn.addClass(color);
    }
    return btn;
}

function $div(parent,clz){
    return $('<div/>').appendTo(parent).addClass(clz);
}


function $ul(parent,clz){
    return $('<ul/>').appendTo(parent).addClass(clz);
}

function $li(parent,clz){
    return $('<li/>').appendTo(parent).addClass(clz);
}

function createBody(){
    $div($navbar('top'),'brand').text('Cateyes');

//    $('<div/>').addClass('brand').text('Cateyes').appendTo($navbar('top'));
    var footer = $navbar('bottom');
    $('<a/>').appendTo(footer).attr('href','#byurl').addClass('btn btn-inverse')
        .attr('role','button').attr('data-toggle','modal').text('BYURL');
//    addButton(footer,'BY URL','btn-inverse').attr('onclick','#myModal');

//    var body = $('body');
//    var container = $div(body,'container');
//    var raw = $div(container,'raw');
//    var left = $div(raw,'span4');
//    var right = $div(raw,'span8');
//    var ul = $ul(left,'nav nav-list');
//    $li(ul,'nav-header').text('下载中');


}

function createAlert(message){
    var _alert = $('<div/>').addClass('alert alert-error fade in');
    _alert.append('<button type="button" class="close" data-dismiss="alert">&times;</button>');
    _alert.append('<h4>Warning!</h4>');
    _alert.append(message);
//    _alert.text(message);
    return _alert;
}


function itemClick(e){
    var $this = $(this);
    var sel = $this.attr('href');
    $('.nav li').each(function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
        }
    });

    if($this.parent().hasClass('active')){
        return;
    }else{
        $this.parent().addClass('active');
    }
    $('.tab-content div').each(function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
        }
    });
    $(sel).addClass('active');
    e.preventDefault();
}