var app = getApp()
Page({
	onLoad: function (options) {
        app.globalData.addressArr && this.setData({
            rawAddressArr: app.globalData.addressArr,
            addressArr: this.getAddress(app.globalData.addressArr),
            active: app.globalData.active
        });
    },

    onShow: function (options) {
        app.globalData.addressArr && this.setData({
            rawAddressArr: app.globalData.addressArr,
            addressArr: this.getAddress(app.globalData.addressArr),
            active: app.globalData.active
        })
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

    setActive: function(e) {
        app.globalData.active = e.currentTarget.id;
        wx.navigateBack();
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
