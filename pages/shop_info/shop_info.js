const scoreShow = require('../../utils/score_show/score_show.js');
var app = getApp()
Page({
	onLoad: function (options) {
        this.setData({
            shop: app.globalData.shop,
            photo: this.photoDataHandle(app.globalData.shop.photo),
            score: scoreShow.calcScore(app.globalData.shop.score)
        });
    },

    photoDataHandle: function(photoData) {
        var photo = [];
        var count = photoData.length;
        for(var i=0; count-3*i > 0; i++) {
            var start = 3*i,
                end = 3*(i+1);
            photo.push(photoData.slice(start, end));
        }   
        return photo;
    },

    getCall: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.shop.phone
        })
    },

    showImg: function(e) {
        var src = e.currentTarget.dataset.src;
        wx.previewImage({
            current: src,  
            urls: this.data.shop.photo
        })
    }
});

