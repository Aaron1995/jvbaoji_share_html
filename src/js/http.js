var oData;
var startData;
var state;
var urlParam={};//需要传给服务器的对象


//打开页面时选择加载main内容
function startUrl(){
   //正则取出地址中所需要的参数
    if(getUrlParam("id")){
        console.log(getUrlParam("id"));
        urlParam["id"] = getUrlParam("id");
        $.ajax({
            type:"get",
            data:urlParam,
            url:'http://www.jvbaoji.com:18006/api/auction/general/getAuctionItemById?id='+getUrlParam("id"),
            dataType:"jsonp",
            jsonp:"jsonpCallBack",
            jsonpCallback:"response",
            success:function(data){

                oData = data;
                basisInform(data);
                console.log(data);
                $("#sharingCheck").hide();

                if(getUrlParam("id") == 19){                //未开拍
                    //TODO
                }else if(getUrlParam("id") == 20){              //开拍前1小时
                    //TODO
                    $("#main").load("before_start.html",beforeStartPai);
                }else if(getUrlParam("id") == 21){              //已经开拍
                    //TODO
                    $("#main").load("start.html",startPai);
                }else if(getUrlParam("id") == 22){              //拍品结束等待支付
                    //TODO
                }else if(getUrlParam("id") == 23){              //活动结束用户未付款而流拍
                    //TODO
                }else if(getUrlParam("id") == 24){              //活动结束 最高价未到保留价 流拍
                    //TODO
                }else if(getUrlParam("id") == 25){              //拍卖结束 用户已经支付
                    //TODO
                }
            }
        });
    }else{
        var userId = getUrlParam("userId");
        var treasureId = getUrlParam("treasureId");
        urlParam["treasureId"] = treasureId;
        urlParam["userId"] = userId;
        $.ajax({
            type:"get",
            url:'http://www.jvbaoji.com:18006/api/general/treasure/getTreasure?treasureId='+treasureId+'&userId='+userId,
            dataType:"jsonp",
            data:urlParam,
            jsonp:"jsonpCallBack",
            jsonpCallback:"response",
            success:function(data){
                oData = data;
                basisInform(data);
                console.log(data);
                $("#sharingCheck").show();
                state = data["data"]["userTreasureStatus"];
                $("#main").load("sharing.html",sharing);
                basisInform(data);
            }
        });
    }

   /* console.log(urlParam);
    $.ajax({
        type:"get",
        url:'http://www.jvbaoji.com:18006/api/general/treasure/getTreasure?treasureId=3&userId=0',
        dataType:"jsonp",
        data:urlParam,
        jsonp:"jsonpCallBack",
        jsonpCallback:"response",
        success:function(data){
        }
    });*/
}



function responseaa(data){
    oData = data;

    console.log(data["data"]["userBidList"]);

    if(getUrlParam("id") == 21){           //21已开拍
        startData = data;
        var  jsonUser = data["data"]["userBidList"];
        var oCommission = data["data"]["userBidList"][0][0]["commission"];
        afterList(jsonUser,oCommission);
        console.log(data);
        var starTime =  data["data"]["auctionItem"]["startTime"];
        var time_now = new Date();
        time_now  =time_now.getTime();
        var time_distance = starTime-Math.floor(time_now/1000);
        if(time_distance > 0){
            $("#main").load("before_start.html",beforeStartPai);
        }else{
            $("#main").load("start.html",startPai);
        }
        $("#sharingCheck").hide();
        basisInform(data);
    }else if(getUrlParam("id") == 20){       //20开拍前半小时
        $("#main").load("before_start.html",beforeStartPai);
        $("#sharingCheck").hide();
        basisInform(data);
    }else if(getUrlParam("id") == 22){  //22 拍品结束等待支付
        $("#main").load("start.html",startPai);
        $("#sharingCheck").hide();
        basisInform(data);
    }
    else{
        console.log(oData);
        $("#sharingCheck").show();
        state = data["data"]["userTreasureStatus"];
        $("#main").load("sharing.html",sharing);
        basisInform(data);
    }

}


//打开页面时选择加载main内容
/*function startList(){
    $.ajax({
        type:"get",
        data:urlParam,
        url:'http://www.jvbaoji.com:18006/api/auction/general/getAuctionItemById?id=21',
        dataType:"jsonp",
        jsonp:"jsonpCallBack",
        jsonpCallback:"yy",
        success:function(data){
        }
    });
}*/

