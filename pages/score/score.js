const scoreShow = require('../../utils/score_show/score_show.js');
var app = getApp()
Page({
	onLoad: function (option) {
        // console.log(option.id);
        this.setData({
            order: option.id,
            shop: app.globalData.shop
        });
    },

	onShow: function() {
        this.calcScore(this.data.score);
    },

    setScore: function(e) {
        var score = e.currentTarget.dataset.score;
        this.calcScore(score);
        this.setData({
            score: score
        });
    },

    calcScore: function(score) {
        var arr = [],
            i = 0;
        while (i < 5) {score > 0 ? arr.push(1) : arr.push(0), score--, i++;}
        this.setData({
            scoreIcon: arr
        });
    },

    getComment: function(e) {
        this.setData({
            content: e.detail.value
        });
    },

    jump: function(e) {
        wx.setStorage({
            key: 'comment',
            data: {
                order: this.data.order,
                id: 0,
                avatar: app.globalData.userInfo.avatarUrl,
                name: app.globalData.userInfo.nickName,
                score: scoreShow.calcScore(this.data.score),
                time: app.getDate(new Date(), '.'),
                content: this.data.content
            }
        });
        wx.navigateBack();
    }
});

