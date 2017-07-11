var app = getApp();
var server = require('../../utils/server');
Page({

	data: {
		specHidden: true,
		cartHidden: true,
		swiper: {current: '0'},
		cart: {
			count: 0,
			total: 0,
			list: {}
		}
	},

	onLoad: function (options) {

        var localData = require('../../data.js');
        this.setData({
            shop: localData.shop,
            classify: localData.classify,
            product: localData.product,
            comment: localData.comment,
            history: this.dataHandle.historyDataHandle(localData.history),
            classifySeleted: localData.classify[0].id,
            heightArr: this.dataHandle.classifyDataHandle(localData.classify)
        });
	},

	onShow: function () {},

	onEvent: function(e) {
		var self = this;
		var obj = e.currentTarget.dataset.fun.split('.')[0];
		var fun = e.currentTarget.dataset.fun.split('.')[1];
		this[obj][fun](self, e);
		// console.log(this.data.spec);
	},

	header: {
		goShopInfo: function (self, e) {
			wx.navigateTo({url: '../shop_info/shop_info'});
		}
	},

	tab: {
		switchTab: function(self, e) {
			var active = e.target.dataset.tab || e.detail.current.toString(); // 注意数据类型
			if(active !== self.data.swiper.current) {
				self.setData({
                    swiper: {current: active}
                });
			}
		}
	},

	menu: {
		onScroll: function (self, e) {

            var sectionWidth = 570;
			if(e.type == 'scroll') {
				e.detail.scrollTop > 10 && !self.data.scrollDown && self.setData({scrollDown: true});
				e.detail.scrollTop < 10 && self.data.scrollDown && self.setData({scrollDown: false});
			}
			if(e.type == 'tap') {self.setData({scrollDown: true});}
			var scale = e.detail.scrollWidth / sectionWidth; // rpx和px的比例
			var scrollTop = e.detail.scrollTop / scale + 200; // 转rpx 200rpx 是提前量
			var classifySeleted;
			self.data.heightArr.forEach((item) => {
				scrollTop > item.sectionTop && (classifySeleted = item.id);
			});
			self.setData({classifySeleted: classifySeleted});
		},

		switchClassify: function (self, e) {
			this.onScroll(self, e);
			self.setData({
				classifyViewed: e.target.dataset.id,
				classifySeleted: e.target.dataset.id
			});
		}
	},

    order: {
        goExpress: function (self, e) {
            wx.navigateTo({url: '../express/express'});
        },

        goScore: function (self, e) {
            wx.navigateTo({url: '../score/score'});
        }
    },

	spec: {
		hideSpec: function(self, e) {
			self.setData({spec: true});
		}
	},

	cart: {
		addCart: function (self, e) {
			var id = e.target.dataset.id;
			self.data.cart.list[id] = (self.data.cart.list[id] || 0) + 1;
			this.countCart(self);
		},

		reduceCart: function (self, e) {
			var id = e.target.dataset.id;
			self.data.cart.list[id] == 1 ? delete self.data.cart.list[id] 
			: (self.data.cart.list[id] = self.data.cart.list[id] - 1);
			this.countCart(self);
		},

		countCart: function (self) {
			var count = 0,
				total = 0;
			for (let id in self.data.cart.list) {
				var product = self.data.product[id];
				count += self.data.cart.list[id];
				total += product.price * self.data.cart.list[id];
			}
			self.data.cart.count = count;
			self.data.cart.total = total;
			self.setData({cart: self.data.cart});
		},

		toggleCartHidden: function (self, e) {
			self.data.cart.count && self.setData({
				cartHidden: !self.data.cartHidden
			});
		}
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

	checkout: function (e) {
		wx.navigateTo({url: '../order/order'});
	}
});
