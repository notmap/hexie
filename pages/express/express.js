const md5 = require('../../utils/md5.js');
var app = getApp()
Page({
	onLoad: function (option) {

        // var sign = 'app_id=e6862d80-53c8-47f2-9691-a1221e59db33&salt=2345&secret_key=f3eed1c8-8bc2-4456-9f43-57371aab2f90'; 
        // sign = md5(encodeURIComponent(sign));
        // console.log(sign)







        var order = JSON.parse(option.order);
        this.setOrderData(order);
        option.new && this.updateHistory(order);
    },

    setOrderData: function(order) {
        var timestamp = Date.parse(new Date());
        this.setData({
            order: order,
            shop: app.globalData.shop,
            expressInfo: {
                target: `${order.order.address.address} ${order.order.address.user}`,
                code: '1205 2323 5565 7787 212',
                time: `${app.getDate(new Date(timestamp), '-')} ${app.getTime(new Date(timestamp))}`,
                arrival: app.getTime(new Date(timestamp + 10*60*1000), true)
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


