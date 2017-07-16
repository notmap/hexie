var app = getApp()
Page({
	data: {
        // score: 0
    },

	onLoad: function (options) {

    },

	onShow: function() {
        this.calcScore(this.data.score);
    },

    setScore: function(e) {
        var score = e.currentTarget.dataset.score;
        this.calcScore(score);
    },

    calcScore: function(score) {
        var arr = [],
            i = 0;
        while (i < 5) {score > 0 ? arr.push(1) : arr.push(0), score--, i++;}
        this.setData({
            scoreIcon: arr
        });
    },

    jump: function(e) {
        var data = e.currentTarget.dataset.jump;
        var url = `../${data}/${data}?swiper=1`;
        wx.navigateTo({url: url});
    }
});

