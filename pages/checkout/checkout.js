// const calc = require('../../utils/calculation.js');
// const deepClone = require('../../utils/deepClone.js');
const dateFormat = require('../../utils/dateFormat');
var app = getApp()
Page({
	onLoad: function (option) {
        this.setOrderData(JSON.parse(option.order));
    },

    onShow: function (option) {},

    setOrderData: function(order) {
        app.getShopInfo().then((shopInfo) => {
            this.setData({
                order: order,
                shop: shopInfo
            });
        });
    },

    checkout: function() {
        var order = this.data.order;
        app.postPayment(order.id, function(res) {
            var payment = res.data.data;
            payment.payInfo = JSON.parse(payment.payInfo);
            wx.requestPayment({
                timeStamp: payment.payInfo.timeStamp,
                nonceStr: payment.payInfo.nonceStr,
                package: payment.payInfo.package,
                paySign: payment.payInfo.paySign,
                signType: payment.signType,
                success: function(res) {
                	console.log(res);
                    wx.redirectTo({url: `../express/express?order=${JSON.stringify(order)}`});
                },
                fail: function(err) {
                	console.log(err);
                }
            });
        });
    }
});

