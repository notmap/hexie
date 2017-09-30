// const calc = require('../../utils/calculation.js');
// const deepClone = require('../../utils/deepClone.js');
const dateFormat = require('../../utils/dateFormat');
var app = getApp()
Page({
	onLoad: function (option) {
        this.setOrderData(JSON.parse(option.order));
    },

    onShow: function (option) {

    },

    setOrderData: function(order) {
        app.getShopInfo().then((shopInfo) => {
            this.setData({
                order: order,
                shop: shopInfo,
                expressInfo: {
                    target: `${order.orderAddress.address} ${order.orderAddress.contact} ${order.orderAddress.mobile}`,
                    code: order.id,
                    time: `${dateFormat.getDate(new Date(order.createTime), '-')} ${dateFormat.getTime(new Date(order.createTime))}`,
                    arrival: dateFormat.getTime(new Date(order.createTime + 30*60*1000), true),
                    cancelTime: dateFormat.getTime(new Date(order.createTime + 5*60*1000), true)
                }
            });
        });
    },

    checkout: function() {
        var orderId = this.data.order.id;
        app.postPayment(orderId, function(res) {
            var payment = res.data.data;
            payment.payInfo = JSON.parse(payment.payInfo);

            // console.log(payment)
            // console.log(payment.payInfo.timeStamp)
            // console.log(payment.nonceStr)
            // console.log(payment.payInfo.package)
            // console.log(payment.signType)
            // console.log(payment.payInfo.paySign)


           


            wx.requestPayment({
                timeStamp: payment.payInfo.timeStamp.substring(0,10),
                nonceStr: payment.nonceStr,
                package: payment.payInfo.package,
                signType: payment.signType,
                paySign: payment.payInfo.paySign,
                success: function(res) {
                	console.log(res);
                },
                fail: function(err) {
                	console.log(err);
                }
            });
        });
    }
});

