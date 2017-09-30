
const dateFormat = require('../../utils/dateFormat');
var app = getApp();
Page({
	onLoad: function (option) {
        this.setOrderData(JSON.parse(option.order));
        // option.new && delete app.globalData.pHistoryOrder;
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
    }
});
