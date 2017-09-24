var server = require('../../model/server');
var app = getApp()
Page({
	onLoad: function (options) {
        app.getUserAddress().then((res) => {   
            this.setData({
                rawAddressArr: res.addressArr,
                addressArr: this.getAddress(res.addressArr),
                active: res.active
            });
        });
    },

    onShow: function (options) {
        if(!app.globalData.pUserAddress) {
            app.getUserAddress().then((res) => {   
                this.setData({
                    rawAddressArr: res.addressArr,
                    addressArr: this.getAddress(res.addressArr),
                    active: res.active
                });
            });
        }
    },

    getAddress: function(addressArr) {
        return addressArr.map((val, index, arr) => {
            return {
                user: `${val.user} ${val.phone}`,
                address: `${val.area}${val.address}`,
                id: val.id,
                raw: val
            };
        });
    },

    postDefaultAddress: function(addressId, cb) {
        server.postDefaultAddress(addressId, function() {
            console.log('addressreset')
            cb && cb();
        });
    },

    setActive: function(e) {
        this.postDefaultAddress(e.currentTarget.id, function() {
            delete app.globalData.pUserAddress;
            wx.navigateBack();
        });
    },

    jump: function(e) {
        var data = JSON.stringify(e.currentTarget.dataset.jump);
        wx.navigateTo({url: `../address_add/address_add?data=${data}`});
        wx.setStorage({
            key: 'addressArr',
            data: this.data.rawAddressArr
        });
    }
});
