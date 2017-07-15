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

        addressArr && (address = this.getAddress(addressArr, addressActive));
        shop = app.globalData.shop,
        order = this.getOrder(cart.list, product);
        checkout = this.getDiscount(shop.promotion, cart.total, shop);

        this.setData({
            address: address,
            shop: shop,
            order: order,
            checkout: checkout
        });
    },

    onShow: function (option) {
        var addressArr = wx.getStorageSync('addressArr');
        console.log(addressArr)
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
                user: val.user + ' ' + val.phone,
                address: val.area + val.address
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

    getDiscount: function(promotion, total, shop) {
        var discount;
        promotion.forEach((val) => {
            total >= val.full && (discount = val.discount);
        });
        discount = discount ? discount : 0;
        return {
            discount: discount,
            money: total - discount + shop.boxFee + shop.expressFee
        };
    },

    checkout: function() {
        var order = JSON.stringify(this.data.order),
            checkout = JSON.stringify(this.data.checkout);
        wx.navigateTo({url: `../express/express?order=${order}&checkout=${checkout}`});
    }
});

