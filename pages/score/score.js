const scoreShow = require('../component/score_show/score_show.js');
const dateFormat = require('../../utils/dateFormat');

var app = getApp()
Page({
	onLoad: function (option) {
        // console.log(option.id);

        // console.log(app.globalData.shop)


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

        var score = scoreShow.calcScore(this.data.score),
            content = this.data.content;
            
        if(score && content) {
            console.log('what the fuck')
            app.postComments(score.score, content);
            wx.setStorage({
                key: 'comment',
                data: {
                    order: this.data.order,
                    id: 0,
                    avatar: app.globalData.userInfo.avatarUrl,
                    name: app.globalData.userInfo.nickName,
                    score: score,
                    time: dateFormat.getDate(new Date(), '.'),
                    content: content
                }
            });
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

