var urlGetHeader = "http://www.jvbaoji.com:18006/api/general";
//var urlGetHeader = "http://localhost:18016/api/general"
var refresh=false;

/**
 * 正则取出地址中所需要的参数
 * @param name 参数名
 * @returns {*}
 */

function getUrlParam(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * 异步获取Json数据
 * @param {Object} u
 * @param {Object} parameter
 * @param {Object} iData
 */
function getJson(u, parameter, iData) {
    console.log(iData);
    if(refresh==true){
        iData=undefined;
    }
        $.ajax({
            type: "get",
            url: u + parameter,
            dataType: "jsonp",
            data: iData,
            jsonp: "callback",
            jsonpCallback: "response",
            async: true
        });


}