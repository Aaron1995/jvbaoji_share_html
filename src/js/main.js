function addLoadEvent(func) {

    var oldonload = window.oldonload;
    if(!typeof window.oldonload == 'function'){
        window.oldonload = func;
        // body...
    }

    else{
        window.onload = function(){
            //oldonload();
            func();
        }
    }

}



/**
 *
 * @param url 改变替换Div的url
 */
//改变替换Div的url
function changeUrl(url,flag){
    if(flag){
        $("#main").load(url);
        flag=!flag;
    }

}

//倒计时可以调用的函数，拍卖开始前的倒计时
//传入开始拍卖的时间 格式为Unix时间戳
function ShowCountDown(odate) {

    var time_now_server,time_now_client,time_end,timerID;
    show_time=function(){
        var timer = document.getElementById("timer");
        console.log(timer);
        if(!timer){
            return ;
        }
        var time_now,time_distance,str_time;
        var int_day,int_hour,int_minute,int_second;
        var time_now=new Date();
        time_now=time_now.getTime();
        time_distance=odate-Math.floor(time_now/1000);
        if(time_distance>0)
        {
            int_day=Math.floor(time_distance/86400)
            time_distance-=int_day*86400;
            int_hour=Math.floor(time_distance/3600)
            time_distance-=int_hour*3600;
            int_minute=Math.floor(time_distance/60)
            time_distance-=int_minute*60;
            int_second=Math.floor(time_distance/1)
            if(int_hour<10)
                int_hour="0"+int_hour;
            if(int_minute<10)
                int_minute="0"+int_minute;
            if(int_second<10)
                int_second="0"+int_second;
            str_time=int_day+"天"+int_hour+"小时"+int_minute+"分钟"+int_second+"秒";
            timer.innerHTML=str_time;
            setTimeout("show_time()",1000);
        }else
        {
            timer.innerHTML =timer.innerHTML;
            clearTimeout(timerID);

        }
    }
    show_time();
    setTimeout("show_time()",1000);
}

//拍卖结束倒计时
//传入unix时间戳
function ShowEndTimeCountDown(odate) {

    var time_now_server,time_now_client,time_end,timerID;
    show_time = function(){
        var timer = document.getElementById("timer");
        if(!timer){
            return ;
        }
        var time_now,time_distance,str_time;
        var int_day,int_hour,int_minute,int_second;
        var time_now = new Date();
        time_now = time_now.getTime();
        time_distance = odate-Math.floor(time_now/1000);
        if(time_distance > 0) {
            int_day = Math.floor(time_distance/86400)
            time_distance -= int_day*86400;
            int_hour = Math.floor(time_distance/3600)
            time_distance -= int_hour*3600;
            int_minute = Math.floor(time_distance/60)
            time_distance -= int_minute*60;
            int_second = Math.floor(time_distance/1)
            if(int_hour < 10)
                int_hour = "0"+int_hour;
            if(int_minute < 10)
                int_minute = "0"+int_minute;
            if(int_second < 10)
                int_second = "0"+int_second;
            str_time = int_hour+":"+int_minute+":"+int_second;
            timer.innerHTML = str_time;
            setTimeout("show_time()",1000);

        }else {
            timer.innerHTML = timer.innerHTML;
            clearTimeout(timerID)
        }
    }
    show_time();
   setTimeout("show_time()",1000);

}

/**
 * 基础部分数据填写
 * @param data
 */
function basisInform(data){

    //动态获取拍品参数
    var json_auctionItemList = data["data"]["auctionItem"]["parameterArray"];
    var $DescriptionList = $("#productsDescriptionList");
    var items = [];
    $DescriptionList.empty();//清空Ul的内容
    for(x in json_auctionItemList){
        items.push('<li id= " "><span class="akey">'+json_auctionItemList[x][0]+'</span>' + '<span class="avalue">'+json_auctionItemList[x][1]+'</span>'+ '</li>');
    }
    $DescriptionList.html(items);

    /* 拍品展示图 轮播图*/
    var jsonShowImg = data["data"]["auctionItem"]["imageUrlArray"];
    var $flicker = $("#flicker");
    $flicker.empty();
    var items = [];
    for(var i = 0;i < 3;i++){
        items.push('<li><img src="' + jsonShowImg[i] + '"></li>');
    }
    $flicker.html(items);

    /*拍品参数参考图*/
    var $parameterImg = $("#parameterImg");
    var oitems=[];
    for(var j = jsonShowImg.length-1;j > 2;j--){
        oitems.push('<li><img src="' + jsonShowImg[j] + '"></li>');
    }
    $parameterImg.html(oitems);

    var json_dataAuctionItemList=data["data"]["auctionItem"];
    addHtml("name",json_dataAuctionItemList["name"]);/*拍品名称*/

    addHtml("introduction",json_dataAuctionItemList["introduction"]);/*拍品简介*/

    addHtml("describing",json_dataAuctionItemList["describing"]);/*藏品描述*/
}


/**
 * 拾贝分享页面内容填写
 * @param data
 */
function sharing (){

    if(state==0){
        $("#appreciate").text("该用户未参加此活动").css("color","#898989");
    }else{
        var i=0;
        appreciateCheck(i);
        $("#appreciate").text(oData["data"]["userTreasure"]["praiseNum"]+"赞");
    }


    var json_dataAuctionItemList = oData["data"]["auctionItem"];
    var starTime = json_dataAuctionItemList["startTime"];
    var time_now = new Date();
    time_now  =time_now.getTime();
    var time_distance = starTime-Math.floor(time_now/1000);
    var jsonUser = oData["data"]["userBidList"];

    if($("#sharingMain").length==1){
        $("#auctionDetailsPage").text(json_dataAuctionItemList["name"]);
    }

    //分享者的信息
    $("#sharingUserName").text(oData["data"]["user"]["nickname"]);
    $("#sharingUserImg").attr("src",oData["data"]["user"]["avatar_mini"]);
    $("#totalPeople").text("参与人数"+oData["data"]["totalPeople"]+"人");
    $("#totalPraiseNum").text(",共计"+oData["data"]["totalPraiseNum"]+"个赞");


    var start = oData["data"]["treasure"]["status"];

    if(start == 1){
        $("#sharingJoinImg li:eq(0) img").attr("src", "img/shibei_dengdai_icon_selected@3x.png");
        $("#sharingJoinImg li:eq(0) p").text("拾贝进行中");
    }else if(start == 2||start == 5){
        $("#sharingJoinImg li:eq(0) img").attr("src", "img/shibei_dengdai_icon_selected@3x.png");
        $("#sharingJoinImg li:eq(0) p").text("拾贝").css("color","#CC9966");
        $("#sharingJoinImg li:eq(1) img").attr("src", "img/shibei_dengdai_icon_selected@3x.png");
        $("#sharingJoinImg li:eq(1) p").text("等待结算").css("color","#CC9966");
        $("#sharingHr li:eq(0) hr").css("background-color","#CC9966");

    }else if(start == 3){
        $("#sharingJoinImg li:eq(0) img").attr("src", "img/shibei_dengdai_icon_selected@3x.png");
        $("#sharingJoinImg li:eq(0) p").text("拾贝").css("color","#CC9966");
        $("#sharingJoinImg li:eq(1) img").attr("src", "img/shibei_dengdai_icon_selected@3x.png");
        $("#sharingJoinImg li:eq(1) p").text("等待结算").css("color","#CC9966");
        $("#sharingHr li:eq(0) hr").css("background-color","#CC9966");
        $("#sharingJoinImg li:eq(2) img").attr("src", "img/shibei_dengdai_icon_selected@3x.png");
        $("#sharingJoinImg li:eq(2) p").text("结算结束").css("color","#CC9966");
        $("#sharingHr li:eq(1) hr").css("background-color","#CC9966");
    }else if(start == 4){
        $("#sharingJoinImg li:eq(0) img").attr("src", "img/shibei_dengdai_icon_selected@3x.png");
        $("#sharingJoinImg li:eq(0) p").text("拾贝").css("color","#CC9966");
        $("#sharingJoinImg li:eq(1) img").attr("src", "img/shibei_dengdai_icon_selected@3x.png");
        $("#sharingJoinImg li:eq(1) p").text("等待结算").css("color","#CC9966");
        $("#sharingHr li:eq(0) hr").css("background-color","#CC9966");
        $("#sharingJoinImg li:eq(2) img").attr("src", "img/shibei_dengdai_icon_selected@3x.png");
        $("#sharingJoinImg li:eq(2) p").text("拍品流拍").css("color","#CC9966");
        $("#sharingHr li:eq(1) hr").css("background-color","#CC9966");
    }

    sharingList(oData["data"]["userTreasureList"]);

    //点击查看拍卖跳转
    $("#sharingCheck").click(function(){

        //点击获取拍卖详情页的地址参数并传参
        var id = getUrlParam("id");
        urlParam = {};
        urlParam["id"] = id;
        console.log(urlParam);

        //拍卖详情页跳转
        $("#auctionDetailsPage").text("拍卖详情页");
        $("#sharing").hide();
        if(time_distance > 0){
            $("#main").load("before_start.html",beforeStartPai);
        }else{
            $("#main").load("start.html",startPai);
        }
        $("#sharingCheck").hide();
    });


}


/**
 * 开始拍卖内容填写
 */
function startPai(){

    var json_dataAuctionItemList = oData["data"]["auctionItem"];
    var endTime = json_dataAuctionItemList["endTime"];
    var jsonUser = oData["data"]["userBidList"];
    var oCommission = oData["data"]["auctionItem"]["commission"];
    ShowEndTimeCountDown(endTime);
    console.log(endTime);
    afterList(jsonUser,oCommission);
    addHtml("startPrice",json_dataAuctionItemList["startPrice"]);//起拍价

    addHtml("addMiniPrice",json_dataAuctionItemList["addMiniPrice"]);//每次价加

    addHtml("insurance",json_dataAuctionItemList["insurance"]);//保证金
}


/**
 * 开始拍卖用户列表实时刷新
 * @param jsonUser 用户列表
 * @param oCommission 佣金（不变）
 */
function afterList(jsonUser,oCommission){
    var $theList = $("#theList");
    var userItems = [];
    $theList.empty();
    for(x in jsonUser){
        var jsonUserInform = jsonUser[x];
        userItems.push(' <li> <span><img src="'+jsonUserInform[1]["avatar_mini"]+'"></span> <span>'+jsonUserInform[1]["nickname"]+'</span> <span>佣金'+oCommission+'</span> <span>出价'+jsonUserInform[0]["bidPrice"]+'</span> </li>')
    }
    $theList.html(userItems);
    $("#theList li:first").css("background"," url('./img/拍卖页面/payment_icon_ranking@2x.png') no-repeat 0px -5px");
    //不停刷新数据
}


/**
 *拾贝分享用户列表实时刷新
 * @param jsonUser 用户列表
 *
 */
function sharingList(jsonUser){

    var $theList = $("#theList");
    var userItems = [];
    $theList.empty();
    for(x in jsonUser){
        var jsonUserInform=jsonUser[x];
        userItems.push(' <li> <span><img src = "'+jsonUserInform[1]["avatar_mini"]+'"></span> <span class = "thelist_mid">'+jsonUserInform[1]["nickname"]+'</span> <span class="thelist_right">'+jsonUserInform[0]["praiseNum"]+"赞"+'</span> </li>')
    }
    $theList.html(userItems);
    $("#theList li:first").css("background"," url('./img/拍卖页面/payment_icon_ranking@2x.png') no-repeat 0px -5px");
    //不停刷新数据
}


/**
 * 开始拍卖内容填写
 */
function beforeStartPai(){

    var nowPrice = oData["data"]["auctionItem"]["bidPrice"];
    var json_dataAuctionItemList = oData["data"]["auctionItem"];
    var starTime=json_dataAuctionItemList["startTime"];
    var endTime=json_dataAuctionItemList["endTime"];

    addHtml("startPrice",json_dataAuctionItemList["startPrice"]);/*起拍价*/

    addHtml("addMiniPrice",json_dataAuctionItemList["addMiniPrice"]); /*每次价加*/

    addHtml("insurance",json_dataAuctionItemList["insurance"]);/*保证金*/

    addHtml("nowPrice",nowPrice);/*当前价格*/
    console.log(starTime);
    console.log(endTime);

    ShowCountDown(starTime);


}

/**
 * 点击喜欢按钮红心变色
 * @param i
 */
function appreciateCheck(i) {

    $("#appreciateImg").click(function () {
        if (i == 0) {
            $("#appreciateImg").attr("src", "img/shibei_dianzan_selected@3x.png");
            i = 1;
        } else {
            $("#appreciateImg").attr("src", "img/shibei_dianzan_unselected@3x.png");
            i = 0;
        }
    })
}

/*拍卖返回到主页*/
function Back(){
    var oback=document.getElementsByClassName("quit")[0].getElementsByTagName("img")[0];
    oback.onclick = function(){
        startUrl();
    }
}


/**
 * 正则取出地址中所需要的参数
 * @param name 参数名
 * @returns {*}
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    console.log(window.location.href);
    if (r != null) return unescape(r[2]); return null; //返回参数值
}



/**
 * 修改填充内容
 * @param key
 * @param value
 */
function addHtml(key,value){

    var keyContainer = document.getElementById(key);
    if(keyContainer){
        keyContainer.innerHTML=value;
    }
}


/**
 * 页面加载完成 运行函数
 */
function loadEvents(){
  /*  Back();
    startUrl();*/
}
addLoadEvent(loadEvents);


