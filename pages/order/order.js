const calc = require('../../utils/calculation.js');
var app = getApp()
Page({
	onLoad: function (option) {
        var cart = JSON.parse(option.data),
            product = app.globalData.product,
            shop = app.globalData.shop,
            order = this.getOrder(cart.list, product),
            checkout = this.getDiscount(shop.promotion, cart.total, cart.boxfee, shop, cart.count);

        this.setData({
            shop: shop,
            order: order,
            boxfee: cart.boxfee,
            checkout: checkout
        });

        app.getUserAddress((res) => {   
            this.setData({
                address: this.getActiveAddress(res.addressArr, res.active)
            });
        });
    },

    onShow: function (option) {
        app.globalData.addressArr && this.setData({
            address: this.getActiveAddress(app.globalData.addressArr, app.globalData.active)
        });
    },

    goAddress: function() {
        wx.navigateTo({url: '../address/address'});
    },

    getAddress: function(address) {
        return {
            id: address.id,
            user: `${address.user} ${address.phone}`,
            address: `${address.area}${address.address}`
        };
    },

    getActiveAddress: function(addressArr, active) {
        var addressActive;
        addressArr.forEach((value, index, arr) => {
            value.id == active && (addressActive = value);
        });
        return this.getAddress(addressActive);
    },

    getOrder: function(list, product) {
        var order = [];
        for (let id in list) {
            order.push({
                id: product[id].id,
                img: product[id].img,
                name: product[id].name,
                price: product[id].price,
                remark: '常规',
                amount: list[id]
            });
        }
        return order;
    },

    getDiscount: function(promotion, total, boxfee, shop, count) {
        var discount;
        promotion.forEach((val) => {
            total >= val.amount && (discount = val.discount);
        });
        discount = discount ? discount : 0;
        return {
            boxfee: boxfee,
            total: count,
            discount: discount,
            money: calc.sub(calc.add(calc.add(total, boxfee), shop.expressFee), discount)      
        };
    },

    getOrderCode: function() {
        var stamp = new Date().getTime();
        var random = parseInt(Math.random()*1000000);
        return `${stamp}${random}`;
    },

    postOrder: function(order, addressId, cb) {
        var productIds = '', quantitys = '';
        order.map((item, index, arr) => {
            productIds += `,${item.id}`;
            quantitys += `,${item.amount}`;
        });
        productIds = productIds.substring(1);
        quantitys = quantitys.substring(1);
        app.postOrder(productIds, quantitys, addressId, cb);
    },

    checkout: function() {

        this.postOrder(this.data.order, this.data.address.id, function(res) {
            console.log(res);
        });

        var orderCode = this.getOrderCode();
        var order = {
            id: 0,
            status: 10, // 配送中
            orderCode: orderCode,
            order: {
                goods: this.data.order,
                checkout: this.data.checkout,
                address: this.data.address
            }
        };

        wx.redirectTo({url: `../express/express?order=${JSON.stringify(order)}&new=1`});
    }
});

