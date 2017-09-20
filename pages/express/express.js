// const md5 = require('../../utils/md5.js');
var app = getApp();
Page({
	onLoad: function (option) {
        var order = JSON.parse(option.order);
        console.log(order)
        this.setOrderData(order);
        option.new && this.updateHistory(order);
    },

    setOrderData: function(order) {
        var timestamp = Date.parse(new Date());
        this.setData({
            order: order,
            shop: app.globalData.shop,
            expressInfo: {
                target: `${order.orderAddress.address} ${order.orderAddress.contact} ${order.orderAddress.mobile}`,
                code: order.orderCode ? order.orderCode : 'miss order code',
                time: `${app.getDate(new Date(timestamp), '-')} ${app.getTime(new Date(timestamp))}`,
                arrival: app.getTime(new Date(timestamp + 30*60*1000), true),
                cancelTime: app.getTime(new Date(timestamp + 5*60*1000), true)
            }
        });
    },

    updateHistory: function(order) {
        wx.setStorage({
            key: "history",
            data: order
        });
    }
});


