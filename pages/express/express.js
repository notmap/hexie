var app = getApp()
Page({
	data: {
        star:'★★★★★ 5.0',

        icon: {
            address: '../../imgs/address.png',
            time: 'imgs/time.jpg',
            tip: 'imgs/tip.jpg',
            phone: 'imgs/phone.jpg'
        },

        shop: {
            logo: 'http://www.legaoshuo.com/hexie/logo/1.jpg',
            name: '杨国福麻辣烫(东四店)',
            promotion: '满20减3, 满40减10',
            express: '蜂鸟配送'
        },

        order: [
            {
                id: 1,
                img: 'http://www.legaoshuo.com/hexie/good/1.jpg',
                name: '鱿鱼石锅拌饭',
                remark: '紫菜汤',
                amount: 1,
                price: 25
            },
            {
                id: 2,
                img: 'http://www.legaoshuo.com/hexie/good/2.jpg',
                name: '铁板牛肉饭',
                remark: '常规',
                amount: 1,
                price: 12
            }
        ]
    },
	onLoad: function (options) {},
	onShow: function() {},
    jumpToAddress: function() {
        wx.navigateTo({url: '../address/address'});
    }
});

