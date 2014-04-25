/**
 * Created by sankooc on 14-4-10.
 */
$(document).ready(function () {
    $('label.tree-toggler').click(function () {
        $(this).parent().children('ul.tree').toggle(300);
    });
    addNavListener();
    Messenger.options = {
        extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
        theme: 'future'
    }
    addDetail(detail);
//    Messenger().post({
//        message: 'There was an explosion while processing your request.',
//        type: 'info',
//        singleton: true,
//        showCloseButton: true
//    });

    var socket = io.connect(webSocketHost);

    socket.on('connect',function(){
        console.log('connected');
    });
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });

});

var webSocketHost = 'http://localhost:8080';


function addDetail(data){
    var _label = boot.label('nav-header',{'tid':'item'}).text(data.parameter.title||data.metadata.title);
    _label.data('data',data);
    boot.addItem('#left_nav>li:eq(1)>ul',_label);
}



function next(){
    var clear = function(sel){
        $(sel).empty();
    }
    clear('#process');
    clear('#accordion2');
}

function appendVideo(data){
    next();
    $('#accordion2').css('display','block');
    data.forEach(function(item){

        var _label = boot.label('nav-header').text(item.title);

        var table = $('<table class="table"/>')
        var img_size = 64;
        var img = $('<img/>')
            .attr('class','media-object')
            .attr('alt',img_size+'x'+img_size)
            .css('width',img_size+'px')
            .css('height',img_size+'px')
            .attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACsUlEQVR4Xu2Y20tqURDGPzNStBCEAhXzxQzJkgQR1CD6z70mlgYFopDoQxC+KIiXsoudb0DxcE5B22w/OPMie+uateabyw+XpdvtTrHGZlEBtAK0BXQGrPEMhA5BpYBSQCmgFFAKrLECikHFoGJQMagYXGMI6J8hxaBiUDGoGFQMKgbXWIGlMdhoNPD4+IjpdAqPx4PDw0NYLJa5pH8og1qtBofDgdPT07+++0z3Vfj8bK+lBKjX63h4eMDm5qb4f319RSAQwMHBgTxTlEwmI++3traQTqexsbHxZb2twudXGxoW4O3tDdlsVjJ6dnaGl5cXtNtt7OzswOfzyZ739/fyjma325FKpTAcDnF7ewur1YpYLIbBYAAGbbPZEI1GDflcrLjvdrNhASaTCfL5PN7f3yXop6cnaYFQKCRnGI/HKBQK2N/fR7/fx2g0EqF42Eqlgl6vB7fbLev4HauG6436/G7gs98bFoC9Xa1WxQ9bgGVOYxBHR0e4urqS7J6fn6NcLuP5+XkuwKJ4XONyuRCPx7GMz18XgBkuFotSuslkUrJYKpWk109OTnB9fQ2n0wm/349msymVEgwG5ZnWarXkPS2RSEgVLevTiAiGK4AZ5wxgb1OA2TMFCIfDuLm5+ec8HIAXFxfg/MjlcvOq2d3dlf5fxqeR4LnGsACc8KwAZs3r9con+3pvbw+RSAQscxqDZjswOGaagt3d3aHT6WB7e1sqh9VxfHwsa436/HUBuCEH2OXlpWSUxnZgLzPIRWNrUABSgAORgszoQSHIfc4RzgsjPk2hwGKAHHY0ZvSnbBU+/3c2wy3wU4Ga7UcF0BshvRHSGyG9ETJ7Epu5v1JAKaAUUAooBcycwmbvrRRQCigFlAJKAbMnsZn7KwWUAkoBpYBSwMwpbPbeSoF1p8AHDTSNn7enqb4AAAAASUVORK5CYII=')
        tmp = $('<td style="width:65px"/>').append(img);
        $('<tr/>')
            .append(tmp)
            .append('<td><blockquote>' +
                '<p class="text-info text-left" style="margin: 0 0 3px">'+item.title+'</p>' +
                '<small>'+item.folder+'</<small>' +
                '<small>Last Update :'+item.update+'</small>' +
                '</blockquote></td>')
            .appendTo(table)

        boot.accordion('#content>div:eq(0)',item._id,_label,table);

    });


}

function postError(msg){

}


function setCount(info){
    var func = function(count,sel){
        if(isNaN(count))
            count = 0;
        $(sel).find('span').text(count)
    }
    for(var k in info){
        func(info[k],'label[tid|="'+k+'"]');
    }
}
// setCount({'wtab':10,'dtab':20,'ctab':50});


function show(data){
    var _id = data._id;


}

function addNavListener(){
    $('#left_nav').click(function(e){
        e = e || window.event;
        var target = $(e.target || e.srcElement);
        switch(target.attr('tid')){
            case 'ctab':
                $.get('/video?state=done')
                    .done(function(data){
                        appendVideo(data);
                    });
                break;
            case 'item':

                break;
            case 'dtab':
                break;
        }
        console.log(target.data('data'));
    });
}



var detail = {
    "_id": "abead76d-9fca-427b-a3f6-8c64a097ab3a",
    "metadata": {
        "title": "강용석의 고소한 19.E65.140122",
        "type": [
            "flv",
            "mp4"
        ],
        "vid": "XNjY1MTA2NjA0",
        "provider": "youku"
    },
    "parameter": {
        "title": "ppla",
        "type": "flv"
    },
    "state": "init",
    "data": {
        "count": 7,
        "suffix": "flv",
        "checksum": "",
        "source": [
            {
                "index": 0,
                "url": "http://101.226.245.209/youku/656D9E89EE498417F650A6A11/030002070052E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8.flv",
                "folder": "/Users/sankooc/Movies/cateyes/ppla/",
                "title": "ppla_01",
                "suffix": "flv",
                "total": "16139565",
                "state": "init",
                "current": 3249846
            },
            {
                "index": 1,
                "url": "http://116.10.191.72/youku/6971EA4A7FB47748EB8C65BF8/030002070152E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8.flv",
                "folder": "/Users/sankooc/Movies/cateyes/ppla/",
                "title": "ppla_02",
                "suffix": "flv",
                "total": "13684108",
                "state": "init",
                "current": 2610482
            },
            {
                "index": 2,
                "url": "http://14.17.89.81/youku/6771B3D084E33748B752A6F06/030002070252E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8.flv",
                "folder": "/Users/sankooc/Movies/cateyes/ppla/",
                "title": "ppla_03",
                "suffix": "flv",
                "total": "13201567",
                "state": "init",
                "current": 3324727
            },
            {
                "index": 3,
                "url": "http://59.175.148.215/youku/6972573E7544E83697A0DC32F1/030002070352E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8.flv",
                "folder": "/Users/sankooc/Movies/cateyes/ppla/",
                "title": "ppla_04",
                "suffix": "flv",
                "total": "12534237",
                "state": "init",
                "current": 1917847
            },
            {
                "index": 4,
                "url": "http://119.97.130.46/youku/677220C49274881CAF716E2EDC/030002070452E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8.flv",
                "folder": "/Users/sankooc/Movies/cateyes/ppla/",
                "title": "ppla_05",
                "suffix": "flv",
                "total": "11964604",
                "state": "init",
                "current": 1840088
            },
            {
                "index": 5,
                "url": "http://59.174.228.19/youku/6972C43252B4282DE8B9F947C0/030002070552E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8.flv",
                "folder": "/Users/sankooc/Movies/cateyes/ppla/",
                "title": "ppla_06",
                "suffix": "flv",
                "total": "7955730",
                "state": "init",
                "current": 2578807
            },
            {
                "index": 6,
                "url": "http://182.140.226.11/youku/6972FAAC9233A820AFC8E74C45/030002070652E00189F1CE0223A404ED89285D-5BBB-5EA0-2F96-233A35751BC8.flv",
                "folder": "/Users/sankooc/Movies/cateyes/ppla/",
                "title": "ppla_07",
                "suffix": "flv",
                "total": "8406880",
                "state": "init",
                "current": 2966168
            }
        ]
    }
};