var app = getApp()
Page({

    data: {

        address: {
            area: '浙江省宁波市鄞州区',
            address: '天高巷222号新城名苑5839号',
            user: '山久',
            phone: '17681765839'
        },

        expressInfo: {
            target: '浙江省宁波市鄞州区天高巷222号新城名苑5839号 山久 17681765839',
            code: '1205 2323 5565 7787 212',
            time: '2017-07-11 16:00',
            arrival: '16:40'
        }
    },


	onLoad: function (option) {
        var order = JSON.parse(option.order),
            checkout = JSON.parse(option.checkout);

        this.setData({
            shop: app.globalData.shop,
            order: order,
            checkout: checkout
        });
    }
});

