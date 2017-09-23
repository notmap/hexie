const calc = require('../../utils/calculation.js');
const deepClone = require('../../utils/deepClone.js');
const arrtModify = require('../../utils/arrtModify');
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

        app.getUserAddress().then((res) => {   
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
            address: `${address.area}${address.address}`,
            raw: arrtModify(deepClone.deepClone(address), {
                area: 'district',
                phone: 'mobile',
                user: 'contact'
            })
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
                productId: product[id].id,
                fullImage: product[id].img,
                name: product[id].name,
                price: product[id].price,
                remark: '常规',
                quantity: list[id]
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
            totalBoxcost: boxfee,
            totalQuantity: count,
            totalDiscount: discount,
            totalAmount: calc.sub(calc.add(calc.add(total, boxfee), shop.expressFee), discount)      
        };
    },
    
    postOrder: function(order, addressId, cb) {
        var productIds = '', quantitys = '';
        order.map((item, index, arr) => {
            productIds += `,${item.productId}`;
            quantitys += `,${item.quantity}`;
        });
        productIds = productIds.substring(1);
        quantitys = quantitys.substring(1);
        app.postOrder(productIds, quantitys, addressId, cb);
    },

    checkout: function() {

        var self = this; 
        this.postOrder(this.data.order, this.data.address.id, function(res) {
            var order = res.data.data;
            order.orderAddress = self.data.address.raw;
            order.orderProductList = self.data.order;
            order.order = {
                goods: self.data.order,
                checkout: self.data.checkout
            };
            wx.redirectTo({url: `../express/express?order=${JSON.stringify(order)}&new=1`});
        });

    

        // var orderCode = this.getOrderCode();
        // var order = {
        //     id: 0,
        //     status: 10, 
        //     // orderCode: orderCode,
        //     order: {
        //         goods: this.data.order,
        //         checkout: this.data.checkout,
        //         address: this.data.address
        //     },

        //     createTime:,
        //     deliverAmount: 5,
        //     realityAmount:  this.data.checkout.money,
        //     totalBoxcost: this.data.checkout.boxfee,
        //     totalDiscount: this.data.checkout.discount,
        //     totalQuantity:  this.data.checkout.total
        // };

        // wx.redirectTo({url: `../express/express?order=${JSON.stringify(order)}&new=1`});
    }
});

