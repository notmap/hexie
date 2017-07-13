// var server = require('./utils/server');

App({
	onLaunch: function () {
		this.checkSession();
		var shopData = require('./shop_data.js');
        this.globalData = {
            shop: shopData.shop,
            classify: shopData.classify,
            product: shopData.product,
            comment: shopData.comment,
            history: this.dataHandle.historyDataHandle(shopData.history),
            classifySeleted: shopData.classify[0].id,
            heightArr: this.dataHandle.classifyDataHandle(shopData.classify)
        }
	},

	checkSession: function() {
		wx.checkSession({
			success: () => {this.getUserInfo();},
			fail: () => {this.login();}
		})
	},

	login: function() {
		wx.login({
			success: (res) => {this.getUserInfo();}
		});
	},

	getUserInfo: function() {
        // console.log(55555)
		wx.getUserInfo({
			success: (res) => {
                this.globalData.userInfo = res.userInfo;
                var userData = require('./user_data.js');
                this.globalData.addressArr = userData.addressArr;
                this.globalData.addressActive = userData.addressActive;
                // console.log(res.userInfo)
                // console.log(userData.addressArr)
            }
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
            {status: '订单已取消', button: false, data: false},
            {status: '配送中', button: '查看订单', data:'order.goExpress'},
            {status: '订单已完成', button: '评价一下', data:'order.goScore'}
        ],

        historyDataHandle: function(historyData) {
            return historyData.map((value, index, arr) => {
                value.order.total > 3 ? value.fold = true : value.fold = false;
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
