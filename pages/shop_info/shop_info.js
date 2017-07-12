var app = getApp()
Page({
	onLoad: function (options) {
        this.setData({
            shop: app.globalData.shop
        });
    },
	onShow: function() {}
});

