var clone = require('../../utils/deepClone.js');
var server = require('../../model/server');

var app = getApp()
Page({
	onLoad: function (option) {
        if(option.data !== 'undefined') {
            this.setData({
                address: JSON.parse(option.data),
                handler: 'updateData',
                removeButton: true
            });
        }
        else {
            this.setData({
                address: {},
                handler: 'addData',
                removeButton: false
            });
        }
    },

    chooseLocation: function() {
        var self = this;
        wx.chooseLocation({
            success: function(res) {
                self.data.address.area = res.name;
                self.data.address.address = res.address;
                self.data.address.lat = res.latitude;
                self.data.address.lng = res.longitude;
                self.setData({address: self.data.address});
            }
        });
    },

    blurHandler: function(e) {
        this.data.address[e.currentTarget.id] = e.detail.value;
        this.setData({address: this.data.address});
    },

    valiData: function(address) {
        return address.area && address.address && address.user && address.phone;
    },

    postUserAddress: function(cb) {  // 提交用户信息（店铺id 昵称 头像）
        Promise.all([app.getOpenId(), app.getShopId()]).then((arr) => {
            // console.log(arr);
            var openId = arr[0],
                shopId = arr[1],
                id = this.data.address.id,
                contact = this.data.address.user,
                mobile = this.data.address.phone,
                area = this.data.address.area,
                address = this.data.address.address,
                lat = this.data.address.lat,
                lng = this.data.address.lng;
                
            server.postUserAddress(openId, shopId, id, contact, mobile, area, address, lat, lng, function(res){
                console.log('postUserAddress: user address has posted');
                cb && cb(res)
            });  
        });
    },

    postDefaultAddress: function(addressId, cb) {  // 新增设置默认
        server.postDefaultAddress(addressId, function() {
            cb && cb();
        });
    },

    removeAddress: function(e) {
        this.data.address.defaults && (app.globalData.removeDefaults = true);
        app.postAddressRemove(this.data.address.id, () => {
            delete app.globalData.pUserAddress;
            wx.navigateBack();
        })
    },
 
    saveAddress: function(e) {
        if(this.valiData(this.data.address)) {
            this.postUserAddress((res) => {
                // console.log(res)
                delete app.globalData.pUserAddress;
                wx.navigateBack();
            });
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

