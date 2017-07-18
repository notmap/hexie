const calc = require('../../utils/calculation.js');
var app = getApp()
Page({
	onLoad: function (option) {

        var cart = JSON.parse(option.data),
            product = app.globalData.product,
            addressArr = app.globalData.addressArr,
            addressActive = app.globalData.addressActive,
            address,
            shop,
            order,
            checkout;

        // console.log(cart.boxfee)

        addressArr && (address = this.getAddress(addressArr, addressActive));
        shop = app.globalData.shop,
        order = this.getOrder(cart.list, product);
        checkout = this.getDiscount(shop.promotion, cart.total, cart.boxfee, shop);

        this.setData({
            address: address,
            shop: shop,
            order: order,
            boxfee: cart.boxfee,
            checkout: checkout
        });
    },

    onShow: function (option) {
        var addressArr = wx.getStorageSync('addressArr');
        // console.log(addressArr)
        addressArr && this.setData({
            address: this.getAddress(addressArr, app.globalData.addressActive)
        });
    },

    goAddress: function() {
        wx.navigateTo({url: '../address/address'});
    },

    getAddress: function(addressArr, addressActive) {
        var address;
        addressArr.forEach((val) => {
            val.id == addressActive && (address = {
                user: `${val.user} ${val.phone}`,
                address: `${val.area}${val.address}`
            });
        });
        return address;
    },

    getOrder: function(list, product) {
        var index = 1,
            order = [];
        for (let id in list) {
            order.push({
                id: index,
                img: product[id].img,
                name: product[id].name,
                price: product[id].price,
                remark: '常规',
                amount: list[id]
            });
            index ++;
        }
        return order;
    },

    getDiscount: function(promotion, total, boxfee, shop) {
        var discount;
        promotion.forEach((val) => {
            total >= val.full && (discount = val.discount);
        });
        discount = discount ? discount : 0;
        return {
            discount: discount,
            money: calc.sub(calc.add(calc.add(total, boxfee), shop.expressFee), discount)      
        };
    },

    checkout: function() {

        // console.log(this.data.order)
        // console.log(this.data.checkout)


        var order = JSON.stringify(this.data.order),
            checkout = JSON.stringify(this.data.checkout);
        wx.navigateTo({url: `../express/express?order=${order}&checkout=${checkout}`});
    }
});

