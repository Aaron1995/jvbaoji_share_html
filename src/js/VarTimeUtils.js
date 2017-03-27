function showTimeGeneral(unixTime) {
	var hour = Math.round(unixTime / 3600) < 10 ? "0" + Math.round(unixTime / 3600) : Math.round(unixTime / 3600);
	var minute = Math.round(unixTime % 3600 / 60) < 10 ? "0" + Math.round(unixTime % 3600 / 60) : Math.round(unixTime % 3600 / 60);
	var second = unixTime % 60 < 10 ? "0" + unixTime % 60 : unixTime % 60;
	return hour + ":" + minute + ":" + second;
}