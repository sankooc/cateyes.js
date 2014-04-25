/**
 * Created by sankooc on 14-4-11.
 */
(function(){

    function addListItem(sel,item){
        if(!sel)
            return;
        create('li').appendTo(sel).append(item)
    }

    function createAccordion(sel,id,header,body){
        if(!sel)
            return;
        if(typeof sel == 'string')
            sel = $(sel)
        var parentId = sel.attr('id');
        var group = div('accordion-group').appendTo(sel)

        var _head = div('accordion-heading').appendTo(group)
        _head.append(header)
        if(!header.hasClass('accordion-toggle')){
            header.addClass('accordion-toggle');
        }
        header.attr('data-toggle','collapse')
        header.attr('data-parent','#'+parentId)
        header.attr('href','#'+id);

        var _body = div('accordion-body collapse').appendTo(group);
        div('accordion-inner').append(body).appendTo(_body)
        _body.attr('id',id);
    }

    function label(clz,attr,text){
        return create('label',clz,attr,text);
    }
    function div(clz,attr,text){
        return create('div',clz,attr,text);
    }
    function create(tag,clz,attr,text){
        var rt = $('<'+tag+'/>');
        if(clz)
            rt.addClass(clz);
        if(attr)
            rt.attr(attr)
        if(text){
            rt.text(text)
        }
        return rt;
    }
    window['boot'] = {}
    window['boot']['label'] = label;
    window['boot']['accordion'] = createAccordion;
    window['boot']['addItem'] = addListItem;
})();