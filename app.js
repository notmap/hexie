const server = require('./utils/server');
// const pages = require('./utils/pages.js');
const scoreShow = require('./utils/score_show/score_show.js');

App({
	onLaunch: function () {
        this.getExtConfig();
        this.login();
		// this.checkSession();   // 是否需要验证
        this.dataInit();




        // var newfish = this.modifyObject(fish, arrtObj);

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
                // console.log(res.code)
                this.getUserInfo();
                this.getOpenid(res);
            }
        });
    },

    dataInit: function() { // 商铺数据初始化 

    	this.getShopInfo();
        this.getClassify();
        this.getProduct();
        

        this.setGlobalData(require('./shop_data.js'));
    },

    setGlobalData: function(shopData) {

    	// 元数据
    	this.globalData.shopId = '100011';

    	// 内容数据 [店铺信息, 分类信息, 产品信息, 评论信息, 历史订单 ]
        // this.globalData.shop = shopData.shop;
        this.globalData.classify = shopData.classify;
        this.globalData.product = shopData.product;
        this.globalData.comment = this.dataHandle.commentDataHandle(shopData.comment);
        this.globalData.history = this.dataHandle.historyDataHandle(shopData.history);

        // 样式数据
        this.globalData.classifySeleted = shopData.classify[0].id;
        this.globalData.heightArr = this.dataHandle.classifyDataHandle(shopData.classify);
    },

    getExtConfig: function() { // 第三方平台相关调试
        var self = this;
        if (wx.getExtConfig) {
            wx.getExtConfig({
                success: function(res) {
                    // console.log(res.extConfig)
                    // console.log(res.extConfig.name)
                    // console.log(res.extConfig.attr.host)
                    // console.log(res.extConfig.attr.shopId)
                    self.globalData.shopId = res.extConfig.attr.shopId;
                }
            });
        }
    },

    getOpenid: function(res) {
        server.getOpenid(res.code, this.globalData.shopId, function(res){
            console.log('Openid', res);
            wx.setStorage({
                key: 'openid',
                data: res.data.openid
            });
        }); 
    },

	getUserInfo: function() {
		wx.getUserInfo({
			success: (res) => {
                this.postUserInfo(res);
                this.getUserAddress();  
                this.globalData.userInfo = res.userInfo;
            }
		});
	},

	getUserAddress: function() {
		var self = this;
        function dataHandle(data) {
        	self.modifyObject(data, {contact: 'user', mobile: 'phone'});
            var active;
            data.map((item, index, arr) => {
                if(item.defaults) active = item.id;
            });
            return {
                addressArr: data, 
                active: active
            };
        }
        var openId = wx.getStorageSync('openid');
        server.getUserAddress(openId, function(res) {
            console.log('UserAddress', res);
            var addressInfo = dataHandle(res.data.items);
            self.globalData.addressArr = addressInfo.addressArr;
            self.globalData.active = addressInfo.active;
        });
    },

	getShopInfo: function() {   // ok 
        var self = this;
    	server.getShopInfo('100011', function(res) {
    		console.log('ShopInfo', res)

            var shopInfo = res.data.data;
            self.modifyObject(shopInfo, {
                fullCover: 'logo',
                serviceTel: 'phone',
                deliverType: 'express',
                notice: 'welcome',
                deliverFee: 'expressFee'
            });
            shopInfo.loaded = false;
            shopInfo.express = shopInfo.express ? '蜂鸟配送' : '商家配送';
            shopInfo.score = 4.6;
            shopInfo.photo = [  
                'http://www.legaoshuo.com/hexie/shop_photo/1.jpg',
                'http://www.legaoshuo.com/hexie/shop_photo/2.jpg',
                'http://www.legaoshuo.com/hexie/shop_photo/3.jpg',
                'http://www.legaoshuo.com/hexie/shop_photo/2.jpg',
                'http://www.legaoshuo.com/hexie/shop_photo/1.jpg'
            ];
            shopInfo.promotion = [{full: 20, discount: 5}, {full: 40, discount: 15}];
            shopInfo.minimum = 15;
            // console.log(shopInfo);
            self.globalData.shop = shopInfo;
    	});
    },

    getClassify: function() {   // ok 
        server.getClassify('100011', function(res) {
            console.log('Classify', res)
        });
    },

    getProduct: function() {   // ok 
        server.getProduct('100011', function(res) {
            console.log('Product', res)
        });
    },

    postUserInfo: function(res) {  // 提交用户信息（店铺id 昵称 头像）
        var openId = wx.getStorageSync('openid'),
            shopId = this.globalData.shopId,
            nickname = res.userInfo.nickName,
            headimage = res.userInfo.avatarUrl;

        server.postUserInfo(openId, shopId, nickname, headimage, function(res){
            // console.log('5839: userinfo has posted');
        });  
    },

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

    modifyObject: function(obj, arrtObj) {
    	// obj => 需要修改是属性的对象  arrObj => 修改的属性
    	if(Array.isArray(obj)) {
    		obj.map((item, index, arr) => {
    			for(let i in arrtObj) {
		    		item[arrtObj[i]] = item[i];
		    		delete item[i];
		    	}
		    	return item;
    		});
    	} 
    	else {
    		for(let i in arrtObj) {
	    		obj[arrtObj[i]] = obj[i];
	    		delete obj[i];
	    	}
    	}
    	return obj;
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
    },

    globalData: {
        // 店铺信息@
        // 产品分类信息@ 
        // 产品信息@
        // 历史订单
        // 评论信息
        // 用户地址信息
    }
})
