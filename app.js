var server = require('./utils/server');

App({
	onLaunch: function () {
		this.checkSession();
		var localData = require('./data.js');
        this.globalData.shop = localData.shop;
        this.globalData.classify = localData.classify;
        this.globalData.product = localData.product;
        this.globalData.comment = localData.comment;
        this.globalData.history = this.dataHandle.historyDataHandle(localData.history);
        this.globalData.classifySeleted = localData.classify[0].id;
        this.globalData.heightArr = this.dataHandle.classifyDataHandle(localData.classify);
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
		wx.getUserInfo({
			success: (res) => {this.globalData.userInfo = res.userInfo;}
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
    },

    globalData: {}
})
