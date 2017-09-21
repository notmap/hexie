var clone = require('../../utils/deepClone.js');
var server = require('../../utils/server');

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
                self.addressArr = self.addressArr.map((val, index, arr) => {
                    if(val.id == self.data.address.id) {
                        self.data.address.area = val.area = res.name;
                        self.data.address.address = val.address = res.address;
                        self.data.address.lat = res.latitude;
                        self.data.address.lng = res.longitude;
                        self.setData({address: self.data.address});
                    }
                    return val;
                });
            }
        });
    },

    blurHandler: function(e) {
        this[this.data.handler](e);
    },

    updateData: function(e) {
        this.addressArr = this.addressArr.map((val, index, arr) => {
            if(val.id == this.data.address.id) {
                val[e.currentTarget.id] = e.detail.value;
                this.data.address[e.currentTarget.id] = e.detail.value;
                this.setData({address: this.data.address});
            }
            return val;
        });
    },

    addData: function(e) {
        this.addressArr = clone.deepClone(app.globalData.addressArr);
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

    postUserAddress: function(res) {  // 提交用户信息（店铺id 昵称 头像）

        console.log(this.data.address)

        var openId = wx.getStorageSync('openid'),
            shopId = app.globalData.shopId,
            id = this.data.address.id,
            contact = this.data.address.user,
            mobile = this.data.address.phone,
            area = this.data.address.area,
            address = this.data.address.address,
            lat = this.data.address.lat,
            lng = this.data.address.lng;
            
        server.postUserAddress(openId, shopId, id, contact, mobile, area, address, lat, lng, function(res){
            console.log(res);
            console.log('postUserAddress: user address has posted');
        });  
    },
 
    saveAddress: function(e) {
        if(this.valiData(this.addressArr)) {
            this.postUserAddress()
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

