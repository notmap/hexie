var app = getApp()
Page({
	onLoad: function (options) {
        app.globalData.addressArr && this.setData({
            addressArr: this.getAddress(app.globalData.addressArr)
        });
    },

    onShow: function (options) {
        var addressArr = wx.getStorageSync('addressArr');
        addressArr && this.setData({
            addressArr: this.getAddress(addressArr)
        });
    },

    getAddress: function(addressArr) {
        return addressArr.map((val, index, arr) => {
            return {
                newUser: val.user + ' ' + val.phone,
                newAddress: val.area + val.address,
                raw: val
            };
        });
    },

    jump: function(e) {
        var data = JSON.stringify(e.currentTarget.dataset.jump);
        wx.navigateTo({url: `../address_add/address_add?data=${data}`});
        wx.setStorage({
            key: 'addressArr',
            data: app.globalData.addressArr
        });
    }
});

