var app = getApp()
Page({
	onLoad: function (option) {
        option.data !== 'undefined' && this.setData({
            address: JSON.parse(option.data)
        });
    },

    updateData: function(e) {
        var addressArr = wx.getStorageSync('addressArr').map((val, index, arr) => {
            val.id == this.data.address.id && (val[e.currentTarget.id] = e.detail.value);
            return val;
        });
        wx.setStorage({
            key: 'addressArr',
            data: addressArr
        });
    },
 
    saveAddress: function(e) {
        wx.navigateBack();
    }
});

