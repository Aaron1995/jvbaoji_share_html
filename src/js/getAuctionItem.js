var urlGetAuctionStr = urlGetHeader + "/auction/getAuctionItemById";
var urlGetCommissionListStr = urlGetHeader + "/auction/getAuctionItemCommissionList";

var oData;
var oCommissionList;
var status;
var auctionItem;
var org;

startGetData();
var showTime;

var id;
var treasureId;
var userId;

function startGetData() {

	var i = getUrlParam('id');

	if (getUrlParam("id")) {
		console.log(i);
		getJson(urlGetAuctionStr, "?id=" + getUrlParam('id'), oData);
		id = getUrlParam('id');
	} else {
		alert("非法路径！");
	}
}

function response(data) {
	if (data == null) {
		alert("网络出了点小问题!请重试!");
	}
	console.log(data);
	if (data['data']['auctionItem'] == null) {
		oCommissionList = data;
		console.log("oCommissionList");
	} else {
		console.log("oData");
		oData = data;
		status = oData['data']['auctionItem']['status'];
		auctionItem = oData['data']['auctionItem'];
		basisInform();
		console.log(oData);
	}
	if (auctionItem != null) {
		switch (auctionItem['status']) {
			case 0:
				console.log("notBegin");
				$("#main").load("before_start.html", beforeStartPai);
				break;
			case 1:

				console.log("notBeginHour");
				$("#main").load("before_start.html", beforeStartPai);
				break;
			case 2:

				console.log("began");
				$("#main").load("start.html", startPai);
				break;
			case 3:
				if (oCommissionList != null) {
					console.log("closedWaittingPay");
					$("#main").load("waitingPayment.html", closedPai);
				} else {
					getJson(urlGetCommissionListStr, "?auctionId=" + id, oCommissionList);
				}
				break;
			case 4:
				if (oCommissionList != null) {
					if (refresh == true) {
						afterList(oData);
						refresh = false;
					} else {
						console.log("closedWinnerNotPay");
						$("#main").load("unpaid.html", closedPai);
					}

				} else {
					getJson(urlGetCommissionListStr, "?auctionId=" + id, oCommissionList);
				}
				break;
			case 5:
				if (oCommissionList != null) {

					console.log("closedNoToReservePrice");
					$("#main").load("lowPrice.html", closedPai)
				} else {
					getJson(urlGetCommissionListStr, "?auctionId=" + id, oCommissionList);
				}
				break;
			case 6:
				if (oCommissionList != null) {

					console.log("closedSuccess");
					$('#main').load("completeSettlement.html", closedPai);
				} else {
					getJson(urlGetCommissionListStr, "?auctionId=" + id, oCommissionList);
				}
				break;
		}
	}
}

// 轮播图运行
$(function() {
	$('.flicker-example').flickerplate({
		auto_flick: true,
		auto_flick_delay: 8,
		flick_animation: 'transform-slide'
	});
});

//跳转到拍卖规则
function openRule() {
	window.location.href = "rules.html";
}

// 跳转回上一页
function backTreasure() {
	window.history.back();
}

function addLoadEvent(func) {

	var oldonload = window.oldonload;
	if (!typeof window.oldonload == 'function') {
		window.oldonload = func;
		// body...
	} else {
		window.onload = function() {
			//oldonload();
			func();
		}
	}

}

/**
 * 基础部分数据填写
 * @param data
 */
function basisInform() {

	var code = oData['code'];
	var msg = oData['msg'];
	var data = oData['data'];
	// 基本数据

	org = data['org'];
	var orgIcon = org['icon'];
	var orgName = org['name'];
	var startTime = auctionItem['startTime'];
	var endTime = auctionItem['endTime'];

	var items = [];
	//动态获取拍品参数
	var $DescriptionList = $("#productsDescriptionList");
	var parameterArray = auctionItem['parameterArray'];
	$DescriptionList.empty(); //清空Ul的内容
	for (x in parameterArray) {
		items.push('<li id= " "><span class="akey">' + parameterArray[x][0] + '</span>' + '<span class="avalue">' + parameterArray[x][1] + '</span>' + '</li>');
	}
	$DescriptionList.html(items);

	/* 拍品展示图 轮播图*/
	var $flicker = $("#flicker");
	var imageUrlArray = auctionItem["imageUrlArray"];
	$flicker.empty();
	items = [];
	for (var i = 0; i < 3; i++) {
		items.push('<li><img src="' + imageUrlArray[i] + '"></li>');
	}
	$flicker.html(items);

	/*拍品参数参考图*/
	var $parameterImg = $("#parameterImg");
	items = [];
	for (var j = imageUrlArray.length - 1; j > 2; j--) {
		items.push('<li><img src="' + imageUrlArray[j] + '"></li>');
	}
	$parameterImg.html(items);

	$("#name").html(auctionItem['name']); /*拍品名称*/

	$("#describing").html(auctionItem['describing']); /*藏品描述*/

	$("#introduction").html(auctionItem['introduction']); /*拍品简介*/

	$("#orgIcon").attr("src", orgIcon); /* 机构图片*/

	$("#orgPrincipal").html(orgName); /*机构名称*/

}

function showCountdownTime(t) {

	var countdownTime;
	console.log("距离时间：" + Math.round(t - (new Date()) / 1000));
	var timer = $("#timer");
	showTime = function() {
		countdownTime = Math.round(t - (new Date()) / 1000);
		// 方便测试采用绝对值Math.abs 实际情况不会出现负数情况
		$("#timer").html(showTimeGeneral(Math.abs(countdownTime)));
		setTimeout("showTime()", 1000);
	}
	showTime();
	setTimeout("showTime()", 1000);
}

/**
 * 修改填充内容
 * @param key
 * @param value
 */
function addHtml(key, value) {

	var keyContainer = document.getElementById(key);
	if (keyContainer) {
		keyContainer.innerHTML = value;
	}
}

/**
 * 开始拍卖内容填写
 */
function beforeStartPai() {

	var nowPrice = oData["data"]["auctionItem"]["bidPrice"];
	var json_dataAuctionItemList = oData["data"]["auctionItem"];
	var starTime = json_dataAuctionItemList["startTime"];
	var endTime = json_dataAuctionItemList["endTime"];

	addHtml("startPrice", json_dataAuctionItemList["startPrice"]); /*起拍价*/

	addHtml("addMiniPrice", json_dataAuctionItemList["addMiniPrice"]); /*每次价加*/

	addHtml("insurance", json_dataAuctionItemList["insurance"]); /*保证金*/

	addHtml("nowPrice", nowPrice); /*当前价格*/
	console.log(starTime);
	console.log(endTime);
	showCountdownTime(starTime);
}

/**
 * 拍卖开始内容填写
 */
function startPai() {

	var json_dataAuctionItemList = oData["data"]["auctionItem"];
	var endTime = json_dataAuctionItemList["endTime"];
	showCountdownTime(endTime);
	var jsonUser = oData["data"]["userBidList"];
	var oCommission = oData["data"]["auctionItem"]["commission"];

	addHtml("startPrice", json_dataAuctionItemList["startPrice"]); //起拍价

	addHtml("addMiniPrice", json_dataAuctionItemList["addMiniPrice"]); //每次价加

	addHtml("insurance", json_dataAuctionItemList["insurance"]); //保证金
	console.log(oData);
	addHtml("nowPrice", jsonUser[0][0]['bidPrice']);
	afterList(oData, null);
}

/**
 * 列表填充数据
 * @param data 拍品数据 oData
 * @param data1 佣金排行榜数据 oCommissionList
 */
function afterList(data, data1) {
	var jsonUser = data['data']['userBidList'];
	var commission = data['data']['auctionItem']['commission'];
	var $theList = $("#theList");
	var $theList1 = $("#theList1");
	//$theList1[0].addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

	//$theList1[0].addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

	var userItems = [];
	$theList.empty();
	for (x in jsonUser) {
		var jsonUserInform = jsonUser[x];
		userItems.push(' <li> <span><img src="' + jsonUserInform[1]["avatar_mini"] + '"></span> <span>' + jsonUserInform[1]["nickname"] + '</span> <span>佣金' + commission + '</span> <span>出价' + jsonUserInform[0]["bidPrice"] + '</span> </li>');
	}
	$theList.html(userItems);
	$("#theList li:first").css("background", " url('./img/拍卖页面/payment_icon_ranking@2x.png') no-repeat 0px -5px");
	var theListScroll = new TouchScroll({
		id: 'wrapper',
		'width': 5,
		'opacity': 0.7,
		color: '#555',
		minLength: 100
	});
	if (data1 != null && $theList1 != null) {
		var jsonCommission = data1['data'];
		var commissionList = [];
		for (y in jsonCommission) {
			var jsonCommissionInfo = jsonCommission[y];
			console.log(jsonCommissionInfo);
			commissionList.push(' <li> <span><img src="' + jsonCommissionInfo[1]["avatar_mini"] + '"></span> <span>' + jsonCommissionInfo[1]["nickname"] + '</span> <span>获得佣金' + jsonCommissionInfo[0]['commission'] + '</span> </li>');
		}
		$theList1.html(commissionList);
		$("#theList1 li:first").css("background", " url('./img/拍卖页面/payment_icon_ranking@2x.png') no-repeat 0px -5px");
		console.log($("#theList1 li").length)
		var theListScroll1 = new TouchScroll({
			id: 'wrapper1',
			'width': 5,
			'opacity': 0.7,
			color: '#555',
			minLength: 100
		});
	}
	//不停刷新数据
}

/**
 * 获取拍品结束后的数据 载入html
 */
function closedPai() {
	if (null != oCommissionList) {
		afterList(oData, oCommissionList);
	}
	var userBidList = oData['data']['userBidList'];
	addHtml("highestAmount", userBidList[0][0]['bidPrice']);
	addHtml("successfulPrice", userBidList[0][0]['bidPrice'] > auctionItem['cappedPrice'] ? auctionItem['cappedPrice'] : userBidList[0][0]['bidPrice']);
	addHtml("winnerName", userBidList[0][1]['nickname']);
	if (auctionItem['status'] == 5) {
		addHtml("successfulPrice", auctionItem['reservePrice']);
	}
	//	addHtml("winnerImg", userBidList[0][1]['avatar_mini']);
	$("#winnerImg").attr("src", userBidList[0][1]['avatar_mini']);

	console.log(userBidList[0][1]['nickname']);
	console.log(userBidList[0][1]['avatar_mini']);
}