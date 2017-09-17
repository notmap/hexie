var server = require('./utils/server');
const scoreShow = require('./utils/score_show/score_show.js');
App({
	onLaunch: function () {
        // this.login();
		this.checkSession();
        this.dataInit();
	},

    checkSession: function() { 
        wx.checkSession({
            success: () => {this.getUserInfo();},
            fail: () => {this.login();}
        })
    },

    login: function() {
        wx.login({
            success: (res) => {
                this.getUserInfo();
                this.getOpenid(res);
            }
        });
    },

    dataInit: function() { // 商铺数据初始化 
        var shopData = require('./shop_data.js');
        this.globalData = {
            shopId: '100011',
            shop: shopData.shop,
            classify: shopData.classify,
            product: shopData.product,
            comment: this.dataHandle.commentDataHandle(shopData.comment),
            history: this.dataHandle.historyDataHandle(shopData.history),
            classifySeleted: shopData.classify[0].id,
            heightArr: this.dataHandle.classifyDataHandle(shopData.classify)
        }
    },

    getExtConfig: function() { // 第三方平台相关调试
        if (wx.getExtConfig) {
            wx.getExtConfig({
                success: function(res) {
                    console.log(5839)
                    console.log(res.extConfig)
                    console.log(res.extConfig.name)
                    console.log(res.extConfig.attr.host)
                }
            });
        }
    },

	getUserInfo: function() {
		wx.getUserInfo({
            // withCredentials: true,
			success: (res) => {
                this.postUserInfo(res);
                this.globalData.userInfo = res.userInfo;


                this.getUserAddress(); // 5839



                // var userData = require('./user_data.js');
                // this.globalData.addressArr = userData.addressArr;
                // this.globalData.active = userData.active;
            }
		});
	},

    getOpenid: function(res) {
        server.getOpenid(res.code, this.globalData.shopId, function(res){
            console.log(`getOpenid: ${res.data.openid}`)
            wx.setStorage({
                key: 'openid',
                data: res.data.openid
            });
        }); 
    },

    getUserAddress: function() {

        function dataHandle(data) {
            var addressInfo = {addressArr: [], active: null}
            data.map((item, index, arr) => {
                var obj = {};
                obj.id = item.id;
                obj.area = item.area;
                obj.address = item.address;
                obj.user = item.contact;
                obj.phone = item.mobile;
                obj.lat = item.lat;
                obj.lng = item.lng;
                addressInfo.addressArr.push(obj);
                if(item.defaults) addressInfo.active = item.id;
            });
            // console.log(addressInfo);
            return addressInfo;
        }

        var self = this;
        var openId = wx.getStorageSync('openid');
        server.getUserAddress(openId, function(res) {
            // console.log(res)
            var addressInfo = dataHandle(res.data.items);
            self.globalData.addressArr = addressInfo.addressArr;
            self.globalData.active = addressInfo.active;
        });
    },

    postUserInfo: function(res) {  // 提交用户信息（店铺id 昵称 头像）
        var openId = wx.getStorageSync('openid'),
            shopId = this.globalData.shopId,
            nickname = res.userInfo.nickName,
            headimage = res.userInfo.avatarUrl;

        server.postUserInfo(openId, shopId, nickname, headimage, function(res){
            console.log('5839: userinfo has posted');
        });  
    },

    // postUserAddress: function(res) {  // 提交用户信息（店铺id 昵称 头像）
    //     var openId = wx.getStorageSync('openid'),
    //         shopId = this.globalData.shopId,
    //         nickname = res.userInfo.nickName,
    //         headimage = res.userInfo.avatarUrl;

    //     server.postUserInfo(openId, shopId, nickname, headimage, function(res){
    //         console.log('postUserInfo: userinfo has posted');
    //     });  
    // },

    getDate: function(date, delimiter) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
        var day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        return `${year}${delimiter}${month}${delimiter}${day}`;
    },

    getTime: function(date, arrival) {
        var hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        var minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
        return arrival ? `${hours}:${minutes}` : `${hours}:${minutes}:${seconds}`;
    },

	dataHandle: {
        productSection: {  // 商品区的高度  单位是rpx
            classify: 74,
            unit: 152,
            padding: 16,
            border: 2
        },

        orderStatus: [
            {status: '订单已取消', button: false, data: false},
            {status: '配送中', button: '查看订单', data: 'order.goExpress'},
            {status: '订单已完成', button: '评价一下', data: 'order.goScore'},
            {status: '订单已完成', button: '已评价', data: false}
        ],

        commentDataHandle: function(commentData) {
            return commentData.map((value, index, arr) => {
                value.score = scoreShow.calcScore(value.score);
                return value;
            });
        },

        historyDataHandle: function(historyData) {
            return historyData.map((value, index, arr) => {
                value.order.goods.length > 3 ? value.fold = true : value.fold = false;
                value.button = this.orderStatus[value.status].button;
                value.data = this.orderStatus[value.status].data;
                value.status = this.orderStatus[value.status].status;
                return value;
            });
        },

        classifyDataHandle: function(classifyData) {

            var height = this.productSection,
                heightArr = [];
            classifyData.reduce(function(returnVal, val, index, arr) {
                heightArr.push({
                    id: val.id,
                    sectionTop: returnVal
                });
                var sectionHeight = val.product.length * height.unit + height.classify + height.padding + height.border; 
                return returnVal + sectionHeight;
            }, 0);
            return heightArr;
        }
    }
})
