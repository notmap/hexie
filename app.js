
const server = require('./model/server');
const dateFormat = require('./utils/dateFormat');
const arrtModify = require('./utils/arrtModify');
const scoreShow = require('./pages/component/score_show/score_show.js');

App({
    onLaunch: function() {
        this.getShopId();
        this.getOpenId();  
        this.getUserInfo();
    },

    getShopId: function(promise) { // 当前Appid为第三方平台3rdMiniProgramAppid  && extEnable为true
        this.globalData.pShopId || (this.globalData.pShopId = new Promise((resolve, reject) => {
            var self = this;
            if (wx.getExtConfig) {
                wx.getExtConfig({
                    success: function(res) {
                        console.log('extConfig', res.extConfig);
                        self.globalData.shopId = res.extConfig.attr.shopId;
                        return resolve(res.extConfig.attr.shopId);
                    }
                });
            }
        }));
        return this.globalData.pShopId;
    },

    getOpenId: function(promise) {
        this.globalData.pOpenId || (this.globalData.pOpenId = new Promise((resolve, reject) => {
            wx.login({ // 获取登陆凭证code
                success: (res) => {  
                    server.getOpenId(res.code, this.globalData.shopId, (res) => {
                        console.log(`Openid: ${res.data.openid}`);
                        this.globalData.openId = res.data.openid;
                        return resolve(res.data.openid);
                    });
                }
            });
        }));
        return this.globalData.pOpenId;
    },

    getUserInfo: function(promise) {
        this.globalData.pUserInfo || (this.globalData.pUserInfo = new Promise((resolve, reject) => {
            wx.getUserInfo({
                success: (res) => {
                    this.postUserInfo(res);
                    this.globalData.userInfo = res.userInfo;
                    return resolve(res.userInfo);
                }
            });
        }));
        return this.globalData.pUserInfo;
    },

    getUserAddress: function(cb) {
        function dataHandle(data) {
            arrtModify(data, {contact: 'user', mobile: 'phone'});
            var active;
            data.map((item, index, arr) => {
                if(item.defaults) active = item.id;
            });
            return {
                addressArr: data, 
                active: active
            };
        }
        var openId = this.globalData.openId;
        server.getUserAddress(openId, (res) => {
            var addressInfo = dataHandle(res.data.items);
            cb && cb(addressInfo);
            this.globalData.addressArr = addressInfo.addressArr;
            this.globalData.active = addressInfo.active;
            // console.log('UserAddress', addressInfo);
        });
    },

    getShopInfo: function(cb) {   
        server.getShopInfo(this.globalData.shopId, (res) => {
            var shopInfo = res.data.data;
            arrtModify(shopInfo, {
                fullCover: 'logo',
                serviceTel: 'phone',
                deliverType: 'express',
                notice: 'welcome',
                deliverFee: 'expressFee',
                minAmount: 'minimum'
            });
            shopInfo.loaded = false;
            shopInfo.express = shopInfo.express ? '蜂鸟配送' : '商家配送';
            shopInfo.photo = [  
                'http://www.legaoshuo.com/hexie/shop_photo/1.jpg',
                'http://www.legaoshuo.com/hexie/shop_photo/2.jpg',
                'http://www.legaoshuo.com/hexie/shop_photo/3.jpg',
                'http://www.legaoshuo.com/hexie/shop_photo/2.jpg',
                'http://www.legaoshuo.com/hexie/shop_photo/1.jpg'
            ];

            server.getPromotion(this.globalData.shopId, (res) => {
                var promotion = res.data.data;
                shopInfo.promotion = res.data.data;
                if(cb) cb(shopInfo);
                this.globalData.shop = shopInfo;
                // console.log('shopInfo', shopInfo);
            });
        });
    },

    getProduct: function(cb) {
        server.getProduct(this.globalData.shopId, (res) => {
            var product = res.data.data;
            arrtModify(product, {
                fullImage: 'img',
                boxcost: 'boxFee'
            });
            this.getClassify(product, cb);
        });
    },

    getClassify: function(allProduct, cb) {   // 转换产品ID到产品所在的组下标
        function converProductId(classify) {  
            classify.map((item, index, arr) => {
                item.product = item.product.map((item2, index, arr) => {
                    allProduct.map((item3, index, arr) => {
                        if(item3.id == item2) item2 = index;
                    });
                    return item2;
                });
            });
        }

        server.getClassify(this.globalData.shopId, (res) => {
            var classify = res.data.data;
            arrtModify(classify, {
                products: 'product'
            });
            classify.map((item, index, arr) => {
                item.product = item.product.map((item, index, arr) => {
                    return item.id
                });
                item.id = 'c' + item.id;
            });
            converProductId(classify);


            classify.map((item, index, arr) => {   // 临时的数据处理
                item.product = item.product.slice(0,5);
            });


            if(cb) cb(allProduct, classify);
            this.globalData.product = allProduct;
            this.globalData.classify = classify;
            this.globalData.classifySeleted = classify[0].id;
            this.globalData.heightArr = this.dataHandle.classifyDataHandle(classify);
            // console.log('allProduct', allProduct)
            // console.log('Classify', classify)
        });
    },

    getComments: function(cb) {
        var page = 1, size = 10;
        server.getComments(this.globalData.shopId, page, size, (res) => {
            var comments = res.data.data;
            arrtModify(comments, {
                headimage: 'avatar',
                nicknameStr: 'name',
                createTime: 'time'
            });
            comments.map((item, index, arr) => {
                item.time = dateFormat.getDate(item.time, '.')
            });
            cb && cb(comments);
            this.globalData.comments = comments;
            // console.log('Comments', comments)
        });
    },

    getHistoryOrder: function(cb) {
        Promise.all([this.getOpenId(), this.getShopId()]).then((arr) => {
            var openId = arr[0],
                shopId = arr[1],
                page = 1, 
                size = 10;
            server.getHistoryOrder(shopId, openId, page, size, (res) => {
                var historyOrder = res.data.data;
                historyOrder.map((item, index, arr) => {
                    item.order = {
                        goods: item.orderProductList,
                        checkout: {
                            totalBoxcost: item.totalBoxcost,
                            totalDiscount: item.totalDiscount,
                            totalQuantity: item.totalQuantity,
                            totalAmount: item.realityAmount,
                            orderNumber: item.id
                        }
                    };
                });
                cb && cb(historyOrder)
                this.globalData.historyOrder = historyOrder;
                // console.log('HistoryOrder', historyOrder)
            });
        });
    },

    postUserInfo: function(res) {
        var openId = this.globalData.openId,
            shopId = this.globalData.shopId,
            nickname = res.userInfo.nickName,
            headimage = res.userInfo.avatarUrl;
        server.postUserInfo(openId, shopId, nickname, headimage, function(res){
            // console.log('postUserInfo', res);
        });  
    },

    postComments: function(score, content) { 
        var shopId = this.globalData.shopId,
            openId = this.globalData.openId,
            orderId = '2017091800057',
            nickname = this.globalData.userInfo.nickName,
            headimage = this.globalData.userInfo.avatarUrl,
            score = score,
            content = content;
        server.postComments(shopId, openId, orderId, nickname, headimage, score, content, function(res){
            console.log('postComments', res);
        });  
    },

    postOrder: function(productIds, quantitys, addressId, cb) { 
        var shopId = this.globalData.shopId,
            openId = this.globalData.openId,
            productIds = productIds,                // '29,30'
            quantitys = quantitys,                  // '2,5'
            addressId = addressId;                  // 1001
        server.postOrder(shopId, openId, productIds, quantitys, addressId, function(res){
            cb && cb(res);
            // console.log('postOrder', res);
        });  
    },

    dataHandle: {
        productSection: {  // 商品区的高度  单位是rpx
            classify: 74,
            unit: 152,
            padding: 16,
            border: 2
        },

        orderStatus: [
            {status: '等待接单', code: 10, button: '查看订单', data: 'order.goScore'},
            {status: '已接单', code: 20, button: '查看订单', data: 'order.goExpress'},
            {status: '配送中', code: 30, button: '查看订单', data: 'order.goExpress'},
            {status: '订单已完成', code: 40, button: '评价一下', data: 'order.goScore'},
            {status: '用户已取消', code: 41, button: false, data: false},
            {status: '已退款', code: 42, button: '查看退款', data: 'order.goRefund'},
            {status: '商家拒单', code: 43, button: false, data: false}
        ],

        commentDataHandle: function(commentData) {
            return commentData.map((value, index, arr) => {
                value.score = scoreShow.calcScore(value.score);
                return value;
            });
        },

        historyDataHandle: function(historyData) {

            var self = this;
            function converOrderStatus(order) {
                order.map((item, index, arr) => {
                    self.orderStatus.map((item2, index, arr) => {
                        item.status == item2.code && (item.status = index); 
                    });
                });
            }
            converOrderStatus(historyData);
            // console.log(historyData);

            return historyData.map((item, index, arr) => {
                item.order.goods.length > 3 ? item.fold = true : item.fold = false;
                item.button = this.orderStatus[item.status].button;
                item.data = this.orderStatus[item.status].data;
                item.status = this.orderStatus[item.status].status;
                return item;
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
        // shopId: '100011'
    }

    // ,checkSession: function() {  
    //     wx.checkSession({
    //         success: () => {this.getUserInfo();},
    //         fail: () => {this.login();}
    //     })
    // }
})
