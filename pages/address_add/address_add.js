var clone = require('../../utils/deepclone.js');
var app = getApp()
Page({
	onLoad: function (option) {
        this.addressArr = clone.deepClone(app.globalData.addressArr);
        if(option.data !== 'undefined') {
            this.setData({
                address: JSON.parse(option.data),
                handler: 'updateData'
            });
        }
        else {
            this.setData({
                address: {},
                handler: 'addData'
            });
        }
    },

    chooseLocation: function() {
        var self = this;
        wx.chooseLocation({
            success: function(res) {
                self.data.address.area = res.name;
                self.data.address.address = res.address;
                self.setData({address: self.data.address});
            }
        });
    },

    blurHandler: function(e) {
        this[this.data.handler](e);
    },

    updateData: function(e) {
        this.addressArr = this.addressArr.map((val, index, arr) => {
            val.id == this.data.address.id && (val[e.currentTarget.id] = e.detail.value);
            return val;
        });
    },

    addData: function(e) {
        this.addressArr = clone.deepClone(app.globalData.addressArr);
        this.data.address['id'] = this.addressArr[0]['id'] + 1;
        this.data.address[e.currentTarget.id] = e.detail.value;
        this.setData({address: this.data.address});
        this.addressArr.unshift(this.data.address);
    },

    valiData: function(data) {
        var flag = true;
        data.forEach((val, index, arr) => {
            !(val.area && val.address && val.user && val.phone) && (flag = false);
        });
        return flag;
    },
 
    saveAddress: function(e) {
        if(this.valiData(this.addressArr)) {
            this.addressArr && (app.globalData.addressArr = this.addressArr);
            this.data.handler == 'addData' && (app.globalData.active = this.addressArr[0]['id']);
            wx.navigateBack();
        }
        else {
            wx.showToast({
                title: '信息不完整',
                image: '../../imgs/warn5.png',
                duration: 2000
            })
        }
    }
});

