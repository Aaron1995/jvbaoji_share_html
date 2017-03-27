var myScroll,
    pullDownEl,
    pullDownOffset,
    pullUpEl,
    pullUpOffset,
    generatedCount = 0;

function pullDownAction () {
    console.log("pullDownAction")
    //setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
    //    var el, li, i;
    //    el = document.getElementById('thelist');
    //
    //    for (i=0; i<5; i++) {
    //        li = document.createElement('li');
    //        li.innerText = 'Generated row ' + (++generatedCount);
    //        el.insertBefore(li, el.childNodes[0]);
    //    }
    //    document.getElementById("pullUp").style.display="";
    //    myScroll.refresh();
    //}, 1000);
}

function pullUpAction () {
    console.log("pullUpAction")

    //setTimeout(function () {
    //    var el, li, i;
    //    el = document.getElementById('thelist');
    //
    //    for (i=0; i<1; i++) {
    //        li = document.createElement('li');
    //        li.innerText = 'Generated row ' + (++generatedCount);
    //        el.appendChild(li, el.childNodes[0]);
    //    }
    //    myScroll.refresh();
    //}, 1000);
}

function loaded() {
    console.log("xxxxxxxxs");
    pullDownEl = document.getElementById('pullDown');
    console.log(pullDownEl);
    pullDownOffset = pullDownEl.offsetHeight;
    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = 10;
    //pullUpOffset = pullUpEl.offsetHeight;
    myScroll = new iScroll('wrapper', {
        useTransition: true,
        topOffset: pullDownOffset,
        onRefresh: function () {
            //that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
            //that.minScrollY = -that.options.topOffset || 0;
            //alert(this.wrapperH);
            //alert(this.scrollerH);

            if (pullDownEl.className.match('loading')) {
                console.log("pullDownEl loading");
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';}
            if (pullUpEl.className.match('loading')) {
                console.log("pullUpEl loading");
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
            }

            document.getElementById("pullUp").style.display="none";
            //document.getElementById("show").innerHTML="onRefresh: up["+pullUpEl.className+"],down["+pullDownEl.className+"],Y["+this.y+"],maxScrollY["+this.maxScrollY+"],minScrollY["+this.minScrollY+"],scrollerH["+this.scrollerH+"],wrapperH["+this.wrapperH+"]";
        },
        onScrollMove: function () {
            console.log("onScrollMove");
            if (this.y > 0) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
                this.minScrollY = 0;
            }
            if (this.y < 0 && pullDownEl.className.match('flip')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                this.minScrollY = -pullDownOffset;
            }

            if ( this.scrollerH < this.wrapperH && this.y < (this.minScrollY-pullUpOffset) || this.scrollerH > this.wrapperH && this.y < (this.maxScrollY - pullUpOffset) ) {
                document.getElementById("pullUp").style.display="";
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
            }
            if (this.scrollerH < this.wrapperH && this.y > (this.minScrollY-pullUpOffset) && pullUpEl.className.match('flip') || this.scrollerH > this.wrapperH && this.y > (this.maxScrollY - pullUpOffset) && pullUpEl.className.match('flip')) {
                document.getElementById("pullUp").style.display="none";
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
            }
        },
        onScrollEnd: function () {
            console.log("onScrollEnd");
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
                pullDownAction();	// Execute custom function (ajax call?)
            }
            if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';
                pullUpAction();	// Execute custom function (ajax call?)
            }
        }
    });

    //setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}

$("#main")[0].addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
$("#main")[0].addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
