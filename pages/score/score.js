
const scoreShow = require('../component/score_show/score_show.js');
var app = getApp();

Page({
	onLoad: function (option) {
        app.getShopInfo().then((shopInfo) => {
            this.setData({
                order: option.id,
                shop: shopInfo
            });
        });
        this.calcScore(this.data.score);
    },

	onShow: function() {},

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

        var score = scoreShow.calcScore(this.data.score),
            content = this.data.content,
            orderId = this.data.order;
            
        if(score && content) {
            app.postComments(orderId, score.score, content, function(res) {
                console.log(res)
                console.log('comments has post');
            });
            delete app.globalData.pComments;
            wx.navigateBack();
        }
        else {
            wx.showToast({
                title: '信息不完整',
                image: '../../imgs/warn5.png',
                duration: 2000
            })
        }
    }
});
