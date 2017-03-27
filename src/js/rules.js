/**
 * Created by wsy123 on 2017/3/4.
 */
/*页面加载之后调入函数*/
function addLoadEvent(func) {
    var oldonload=window.oldonload;
    if(!typeof window.oldonload=='function'){
        window.oldonload=func;
        // body...
    }

    else{
        window.onload=function(){
            //oldonload();
            func();
        }
    }

}

function loadEvents(){

}
addLoadEvent(loadEvents);
