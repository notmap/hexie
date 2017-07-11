var app = getApp();
var server = require('../../utils/server');
Page({
	data: {

		specHidden: true,
		cartHidden: true,

		swiper: {
			current: '0'
		},

		cart: {
			count: 0,
			total: 0,
			list: {}
		},

		productSection: {  // 商品区的高度  单位是rpx
			classify: 74, 
			unit: 152,
			padding: 16,
			border: 2,
			sectionWidth: 570  // 商品区的宽度 单位是rpx
		},

		shop: {
			logo: 'http://www.legaoshuo.com/hexie/logo/2.jpg',
			name: '大拇指麻辣烫(南商店)',
			promotion: '满20减3, 满40减10'
		},

		classify: [
			{
				id: 'hot',
				name: '热销',
				product: [1, 2, 3, 4, 5]
			},
			{
				id: 'new',
				name: '新品',
				product: [1, 3]
			},
			{
				id: 'vegetable',
				name: '蔬菜',
				product: [1, 6, 5]
			},
			{
				id: 'mushroom',
				name: '蘑菇',
				product: [2, 7, 8, 9]
			},
			{
				id: 'food',
				name: '主食',
				product: [3, 4]
			},
			{
				id: 'classic',
				name: '经典套餐',
				product: [2, 4]
			}
		],

		product: {
			1: {
				id: 1,
				name: '超级麻辣烫',
				img: 'http://www.legaoshuo.com/hexie/good/1.jpg',
				price: 62
			},
			2: {
				id: 2,
				name: '好吃的炒饭',
				img: 'http://www.legaoshuo.com/hexie/good/2.jpg',
				price: 33
			},
			3: {
				id: 3,
				name: '养生拌饭',
				img: 'http://www.legaoshuo.com/hexie/good/3.jpg',
				price: 22
			},
			4: {
				id: 4,
				name: '彩色鱿鱼',
				img: 'http://www.legaoshuo.com/hexie/good/4.jpg',
				price: 31
			},
			5: {
				id: 5,
				name: '桂花糕',
				img: 'http://www.legaoshuo.com/hexie/good/5.jpg',
				price: 12
			},
			6: {
				id: 6,
				name: '水煮鱼片',
				img: 'http://www.legaoshuo.com/hexie/good/6.jpg',
				price: 42
			},
			7: {
				id: 7,
				name: '绿色的豆豆',
				img: 'http://www.legaoshuo.com/hexie/good/7.jpg',
				price: 13
			},
			8: {
				id: 8,
				name: '好吃的鱼肉卷',
				img: 'http://www.legaoshuo.com/hexie/good/8.jpg',
				price: 13
			},
			9: {
				id: 9,
				name: '老宁波猪排',
				img: 'http://www.legaoshuo.com/hexie/good/9.jpg',
				price: 25
			}
		},

		comment: [
			{
				id: 0,
				avatar: 'http://www.legaoshuo.com/hexie/avatar/1.jpg',
				name: '苹果和鱼',
				score: 4.6,
				time: '2017.06.09',
				content: '松坂肉还不错'
			},
			{
				id: 1,
				avatar: 'http://www.legaoshuo.com/hexie/avatar/2.jpg',
				name: '匿名',
				score: 2.4,
				time: '2017.06.09',
				content: '东西超级难吃，又很咸，我表示真的很难理解竟然有这样的餐厅存在，呵呵'
			},
			{
				id: 2,
				avatar: 'http://www.legaoshuo.com/hexie/avatar/3.jpg',
				name: '匿名',
				score: 2.4,
				time: '2017.06.09',
				content: '东西超级难吃，又很咸，我表示真的很难理解竟然有这样的餐厅存在，呵呵'
			},
			{
				id: 3,
				avatar: 'http://www.legaoshuo.com/hexie/avatar/1.jpg',
				name: '匿名',
				score: 2.4,
				time: '2017.06.09',
				content: '东西超级难吃，又很咸，我表示真的很难理解竟然有这样的餐厅存在，呵呵'
			},
			{
				id: 4,
				avatar: 'http://www.legaoshuo.com/hexie/avatar/2.jpg',
				name: '匿名',
				score: 2.4,
				time: '2017.06.09',
				content: '东西超级难吃，又很咸，我表示真的很难理解竟然有这样的餐厅存在，呵呵'
			},
			{
				id: 5,
				avatar: 'http://www.legaoshuo.com/hexie/avatar/3.jpg',
				name: '天使的猫',
				score: 5.0,
				time: '2017.06.09',
				content: '好吃好吃好吃好吃！'
			}
		],

		orderStatus: [
            {status: '订单已取消', button: false},
            {status: '配送中', button: '查看订单'},
            {status: '订单已完成', button: '评价一下'}
        ],

        history:[
            {
                id: 1,
                logo: 'http://www.legaoshuo.com/hexie/logo/1.jpg',
                name: '欧巴韩国料理店铺(创新128广场)',
                status: 1, // 配送中
                order: {
                    goods: [
                        {id: 1, good: '马铃薯脆', amount: 1},
                        {id: 2, good: '黑椒牛肉饭', amount: 1},
                        {id: 3, good: '可乐', amount: 2},
                        {id: 4, good: '好吃的鸡块', amount: 1}
                    ],
                    total: 5,
                    money: 56.50
                }
            },
            {
                id: 2,
                logo: 'http://www.legaoshuo.com/hexie/logo/2.jpg',
                name: '肯德基',
                status: 2, // 订单已完成
                order: {
                    goods: [
                        {id: 1, good: '可乐', amount: 2},
                        {id: 2, good: '好吃的鸡块', amount: 1}
                    ],
                    total: 3,
                    money: 36.50
                }
            },
            {
                id: 3,
                logo: 'http://www.legaoshuo.com/hexie/logo/3.jpg',
                name: '麦当劳',
                status: 2, // 订单已完成
                order: {
                    goods: [
                        {id: 1, good: '可口可乐', amount: 2},
                        {id: 2, good: '好吃的汉堡', amount: 1}
                    ],
                    total: 3,
                    money: 36.50
                }
            },
            {
                id: 4,
                logo: 'http://www.legaoshuo.com/hexie/logo/4.jpg',
                name: '星巴克',
                status: 0, // 订单已取消
                order: {
                    goods: [
                        {id: 1, good: '马铃薯脆', amount: 1},
                        {id: 2, good: '黑椒牛肉饭', amount: 1}
                    ],
                    total: 2,
                    money: 26.50
                }
            }
        ]
	},

	onLoad: function (options) {
		var classify = this.data.productSection.classify,
			unit = this.data.productSection.unit,
			padding = this.data.productSection.padding,
			border = this.data.productSection.border;

		var heightArr = [];
		this.data.classify.reduce(function(returnVal, val, index, arr) {
			heightArr.push({
				id: val.id,
				sectionTop: returnVal
			});
			var sectionHeight = val.product.length * unit + classify + padding + border; 
			return returnVal + sectionHeight;
		}, 0);
		this.setData({
			heightArr: heightArr
		});

		this.pretreatment(); // 处理历史订单数据
	},

	onShow: function () {
		this.setData({
			classifySeleted: this.data.classify[0].id
		});
	},

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
					swiper: {
						current: active
					}
				});
			}
		}
	},

	menu: {
		onScroll: function (self, e) {

			if(e.type == 'scroll') {
				e.detail.scrollTop > 10 && !self.data.scrollDown && self.setData({scrollDown: true});
				e.detail.scrollTop < 10 && self.data.scrollDown && self.setData({scrollDown: false});
			}
			if(e.type == 'tap') {self.setData({scrollDown: true});}
			var scale = e.detail.scrollWidth / self.data.productSection.sectionWidth; // rpx和px的比例
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

	checkout: function (e) {
		wx.navigateTo({url: '../order/order'});
	},

	pretreatment: function() {
        var history = this.data.history.map((value, index, arr) => {
            value.order.total > 3 ? value.fold = true : value.fold = false;
            value.button = this.data.orderStatus[value.status].button;
            value.status = this.data.orderStatus[value.status].status;
            return value;
        });
        this.setData({history: history});
    }
});
