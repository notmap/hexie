var app = getApp()
Page({
	onLoad: function (option) {

        var cart = JSON.parse(option.data),
            shop = app.globalData.shop,
            product = app.globalData.product,
            order = [],
            index = 1,
            discount,
            checkout;

        for (let id in cart.list) {
            order.push({
                id: index,
                img: product[id].img,
                name: product[id].name,
                price: product[id].price,
                remark: '常规',
                amount: cart.list[id]
            });
            index ++;
        }

        shop.promotion.forEach((val) => {
            cart.total >= val.full && (discount = val.discount);
        });
        checkout = {
            discount: discount,
            money: cart.total - discount + shop.boxFee + shop.expressFee
        };

        this.setData({
            shop: shop,
            order: order,
            checkout: checkout
        });
        
    },
	onShow: function() {},
    jumpToAddress: function() {
        wx.navigateTo({url: '../address/address'});
    }
});

