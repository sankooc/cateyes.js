/**
 * Created by sankooc on 14-3-5.
 */
function Strap(){
  this.body = $('body');
}

function $bootstrap(){

}
function createNav(){

}


function BootstrapDialog(id){
    this._out = $('<div/>').attr('id',id).addClass('modal hide fade')
        .attr('tabindex','-1').attr('role','dialog').attr('aria-hidden','true');

}

BootstrapDialog.prototype.setHeader = function(title){
    this._title = $('<div/>').addClass('modal-header');
    $('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>').appendTo(this._title);
    $('<h3 id="label">'+title+'</h3>').appendTo(this._title);
    return this._title;
}

BootstrapDialog.prototype.addInput=function(type){

}

BootstrapDialog.prototype.appendTo = function(parent){
    return this._out.appendTo(parent);
}