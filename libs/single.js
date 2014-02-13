
function create(){
    var p_val = 'pv';

    return {
        val : '',
        getCal : function(){
            console.log(p_val);
        },
        setCal : function(v){
            p_val = v;
        }
    };
}

var _instance;

exports.getInstance = function (){
    if(!_instance){
        _instance = create();
    }
    return _instance;
};
