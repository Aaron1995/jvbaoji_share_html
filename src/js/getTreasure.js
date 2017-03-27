var urlGetTreasureStr = urlGetHeader + "/treasure/getTreasure";

var oData;
var treasure;
var auctionItem;
var org;
var userTreasure;
var userTreasureList;
var user;

var totalPraiseNum;
var totalPeople;
var userTreasureStatus;

var treasureStatus;
var auctionId;
startGetData();
var partResponse = 1;

// 轮播图运行
$(function() {
	$('.flicker-example').flickerplate({
		auto_flick: true,
		auto_flick_delay: 8,
		flick_animation: 'transform-slide'
	});
});

function startGetData() {
	console.log("treasureId:" + getUrlParam('treasureId'));
	console.log("userId:" + getUrlParam('userId'));
	if (getUrlParam('treasureId') && getUrlParam('userId')) {
		getJson(urlGetTreasureStr, "?treasureId=" + getUrlParam('treasureId') + "&userId=" + getUrlParam('userId'), oData);
	} else {
		alert("非法路径！");
	}
}

function response(data) {
	oData = data;
	console.log(oData);
	baseInform();
}

function baseInform() {
	treasure = oData['data']['treasure'];
	auctionItem = oData['data']['auctionItem'];
	org = oData['data']['org'];
	userTreasureStatus = oData['data']['userTreasureStatus'];
	if (1 == userTreasureStatus) userTreasure = oData['data']['userTreasure'];
	userTreasureList = oData['data']['userTreasureList'];
	user = oData['data']['user'];
	totalPraiseNum = oData['data']['totalPraiseNum'];
	totalPeople = oData['data']['totalPeople'];

	$("#auctionDetailsPage").html("拾贝活动");
	$("#name").html(auctionItem['name']);
	$("#introduction").html(auctionItem['introduction']);
	$("#orgIcon").attr("src", org['icon']);
	$("#orgPrincipal").html(org['name']);
	$("#describing").html(auctionItem['describing']);

	treasureStatus = treasure['status'];
	auctionId = auctionItem['id'];

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

	$("#main").load("sharing.html", sharingPai);

}

function sharingPai() {

	$("#sharingUserName").html(user['nickname']);
	$("#sharingUserImg").attr("src", user['avatar_mini']);
	$("#totalPeople").html("共" + totalPeople + "人参与，");
	$("#totalPraiseNum").html("总共" + totalPraiseNum + "赞。");
	showAppreciateUI(userTreasureStatus);
	showStatusImg(treasureStatus);
	afterList(userTreasureList);
}

/**
 * 列表填充数据
 * @param data 用户点赞数据 userTreasureList
 */
function afterList(data) {

	var $theList = $("#theList");
	var userItems = [];
	$theList.empty();
	for (x in data) {
		var addUI = ' <span><img src="' + data[x][1]["avatar_mini"] + '"></span> <span>' + data[x][1]["nickname"] + '</span>  <span>已获' + data[x][0]["praiseNum"] + '赞</span>';
		if (treasure['status'] == 3) {
			addUI += '<span>奖励' + data[x][0]['rewardAmount'] + '元</span>';
		}
		userItems.push('<li>' + addUI + '</li>');
	}
	$theList.html(userItems);
	$("#theList li:first").css("background", " url('./img/拍卖页面/payment_icon_ranking@2x.png') no-repeat 0px -5px");
	//不停刷新数据
}

// 拾贝状态图片显示
function showStatusImg(status) {
	$("#total_reward_amount").hide();
	switch (status) {
		case 1:
			$("#statusImg1").attr("src", "img/shibei_jingxing_icon_selected@3x.png");
			break;
		case 2:
			$("#statusImg1").attr("src", "img/shibei_jingxing_icon_selected@3x.png");
			$("#statusImg2").attr("src", "img/shibei_dengdai_icon_selected@3x.png");
			$("#statusP2").html("等待付款");
			break;
		case 3:
			$("#statusImg1").attr("src", "img/shibei_jingxing_icon_selected@3x.png");
			$("#statusImg2").attr("src", "img/shibei_dengdai_icon_selected@3x.png");
			$("#statusImg3").attr("src", "img/shibei_jiesuan_icon_selected@3x.png");
			$("#appreciateImg").hide();
			$("#total_reward_amount").show();
			$("#total_reward_amount").html("奖励共计" + treasure['rewardTotalAmount'] + "元");
			$("#appreciate").html("获得奖励" + userTreasure['rewardAmount'] + "元！");
			$("#statusP3").html("奖励已发放");
			break;
		case 4:
			$("#statusImg1").attr("src", "img/shibei_jingxing_icon_selected@3x.png");
			$("#statusImg2").attr("src", "img/shibei_dengdai_icon_selected@3x.png");
			$("#statusImg3").attr("src", "img/shibei_jiesuan_icon_selected@3x.png");
			$("#appreciateImg").hide();
			$("#total_reward_amount").show();
			$("#total_reward_amount").html("拾贝活动因拍品流拍失效");
			$("#appreciate").html("无奖励");
			$("#statusP3").html("拍品流拍用户无奖励");
			break;
		case 5:
			$("#statusImg1").attr("src", "img/shibei_jingxing_icon_selected@3x.png");
			$("#statusImg2").attr("src", "img/shibei_dengdai_icon_selected@3x.png");
			$("#statusP2").html("等待结算");
			break;
	}
}

// 拾贝用户点赞状态空间显示
function showAppreciateUI(status) {
	switch (status) {
		case 0:
			$("#appreciateImg").hide();
			$("#appreciate").html("该用户未参与该活动，无法集赞！");
			break;
		case 1:
			$("#appreciateImg").show();
			$("#appreciate").html("为他点赞");
			break;
	}
}

// 跳转到拍品页面
function openAuctionItem() {
	window.location.href = "auctionItem.html" + "?id=" + auctionId;
}

// 跳转到拍卖规则
function openRule() {
	window.location.href = "rules.html";
}

var isDianzan = false;

// 点赞
function dianzan() {
	if (!isDianzan && 1 == userTreasureStatus) {
		isDianzan = true;
		$("#appreciateImg").attr("src", "img/shibei_dianzan_selected@3x.png");
		$("#appreciate").html("赞+1");
		$.post("http://localhost:18016/api" + "/treasure/addUserPraiseNum", {
			userTreasureId: userTreasure['id']
		});
	}
}