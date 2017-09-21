const dateFormat = require('../../utils/dateFormat');
var app = getApp();
Page({
	onLoad: function (option) {
        var order = JSON.parse(option.order);
        // console.log(order)
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
                code: order.id,
                time: `${dateFormat.getDate(new Date(order.createTime), '-')} ${dateFormat.getTime(new Date(order.createTime))}`,
                arrival: dateFormat.getTime(new Date(order.createTime + 30*60*1000), true),
                cancelTime: dateFormat.getTime(new Date(order.createTime + 5*60*1000), true)
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


