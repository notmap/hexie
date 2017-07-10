var app = getApp()
Page({
	data: {
        star:'★★★★★ 5.0',
        shop: {
            logo: 'http://www.legaoshuo.com/hexie/logo/2.jpg',
            name: '大拇指麻辣烫(南商店)',
            promotion: '满20减3, 满40减10'
        }
    },
	onLoad: function (options) {
        // options.id = 3;
        // var shopId = options.id;
        // for (var i = 0; i < app.globalData.shops.length; ++i) {
        //     if (app.globalData.shops[i].id == shopId) {
        //         this.setData({
        //             shop: app.globalData.shops[i]
        //         });
        //         break;
        //     }
        // }
    },
	onShow: function() {}
});

