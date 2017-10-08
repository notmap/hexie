const scoreShow = require('../component/score_show/score_show.js');
var app = getApp()
Page({
	onLoad: function (options) {
        app.getShopInfo().then((shopInfo) => {
            console.log(shopInfo)
            this.setData({
                shop: shopInfo,
                photo: this.photoDataHandle(shopInfo.photo),
                score: scoreShow.calcScore(shopInfo.score)
            });
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

