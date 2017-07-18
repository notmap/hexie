const scoreShow = require('../../utils/score_show/score_show.js');
var app = getApp()
Page({
	onLoad: function (option) {
        // console.log(option.id);
        this.setData({
            order: option.id
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

    getDate: function(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
        var day = date.getDate() < 10 ? `0${date.getDate()}`: date.getDate();
        return `${year}.${month}.${day}`;
    },

    jump: function(e) {
        wx.setStorage({
            key: 'comment',
            data: {
                order: this.data.order,
                id: 0,
                avatar: 'http://www.legaoshuo.com/hexie/avatar/2.jpg',
                name: '山久',
                score: scoreShow.calcScore(this.data.score),
                time: this.getDate(new Date()),
                content: this.data.content
            }
        });
        wx.navigateBack();
        // var data = e.currentTarget.dataset.jump;
        // var url = `../${data}/${data}?swiper=1`;
        // wx.redirectTo({url: url});
    }
});

