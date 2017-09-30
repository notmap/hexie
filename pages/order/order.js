const calc = require('../../utils/calculation.js');
const deepClone = require('../../utils/deepClone.js');
const arrtModify = require('../../utils/arrtModify');
var app = getApp()
Page({
	onLoad: function (option) {
        var cart = JSON.parse(option.data);
        this.setData({
            boxfee: cart.boxfee
        });
        app.getUserAddress().then((res) => {   
            if(res.addressArr.length) {
                this.setData({
                    address: this.getActiveAddress(res.addressArr, res.active)
                });
            }
        });
        app.getShopInfo().then((shopInfo) => {
            this.setData({
                shop: shopInfo,
                checkout: this.getDiscount(shopInfo.promotion, cart.total, cart.boxfee, shopInfo, cart.count)
            });
        });
        app.getProduct().then((product) => {
            this.setData({
                order: this.getOrder(cart.list, product)
            });
        });
    },

    onShow: function (option) {
        if(!app.globalData.pUserAddress) {
            app.getUserAddress().then((res) => {   
                this.setData({
                    address: this.getActiveAddress(res.addressArr, res.active)
                });
            });
        }
    },

    jump: function(e) {
        var target = e.currentTarget.dataset.jump;
        wx.navigateTo({url: `../${target}/${target}`});
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

    getNewOrder: function(order) {
        order.orderAddress = this.data.address.raw;
        order.orderProductList = this.data.order;
        order.order = {
            goods: this.data.order,
            checkout: this.data.checkout
        };
        app.globalData.newOrder = order;
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
        this.postOrder(this.data.order, this.data.address.id, (res) => {

            // console.log(res)

            delete app.globalData.pHistoryOrder; 
            var order = this.getNewOrder(res.data.data);

            // wx.redirectTo({url: `../express/express?order=${JSON.stringify(order)}`});
            // wx.navigateTo({url: `../checkout/checkout?order=${JSON.stringify(order)}`});
            wx.redirectTo({url: `../checkout/checkout?order=${JSON.stringify(order)}`});
            
        });
    }
});

