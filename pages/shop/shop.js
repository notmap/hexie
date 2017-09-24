const md5 = require('../../utils/md5.js');
const ImgLoader = require('../component/img_loader/img_loader.js');
const calc = require('../../utils/calculation.js');

var app = getApp();
Page({

	data: {
        specHidden: true,       // 规格
        cartHidden: true,       // 购物车 
        orderEnable: false,     // 是否可结算
        swiper: {               // 选项卡选中和显示
            current: '0',
            show: false
        },
        cart: {                 // 购物车数据
            count: 0,
            total: 0,
            list: {}
        },
        difference: '',         // 差￥15起送
        classifySeleted: '',    // 分类选中

        shop: {},               // 店铺信息数据
        history: [],            // 历史订单数据
        classify: [],           // 分类数据
        heightArr: [],          // 分类高度数据
        product: [],            // 产品数据
        comment: []             // 评分数据
	},

	onLoad: function(option) {

        console.log('shop onLoad');

        this.initImgLoader();

        app.getShopInfo().then((shopInfo) => {
            this.setData({
                shop: shopInfo,
                difference: `差￥${shopInfo.minimum}起送`
            });
            this.loadImages(shopInfo.logo);
        });

        app.getProduct().then((product) => {
            this.setData({
                product: this.addImgStatus(product)
            });
            this.loadImages(product);
        });

        app.getClassify().then((classify) => {
            this.setData({
                classify: classify,
                classifySeleted: classify[0].id,
                heightArr: app.dataHandle.classifyDataHandle(classify)
            });
        });

        app.getComments().then((comments) => {
            this.setData({
                comment: app.dataHandle.commentDataHandle(comments)
            });
        });

        app.getHistoryOrder().then((historyOrder) => {
            this.setData({
                history: app.dataHandle.historyDataHandle(historyOrder)
            });
        });

        // this.checkSwiper(option);
	},

    onShow: function(option) {

        if(!app.globalData.pComments) {
            this.setData({
                swiper: {
                    current: 1,
                    show: true
                }
            });
            app.getComments().then((comments) => {
                this.setData({
                    comment: app.dataHandle.commentDataHandle(comments)
                });
            });
        }

        if(!app.globalData.pHistoryOrder) {
            this.setData({
                swiper: {
                    current: 2,
                    show: true
                }
            });
            app.getHistoryOrder().then((historyOrder) => {
                this.setData({
                    history: app.dataHandle.historyDataHandle(historyOrder)
                });
            });
        }




        // var history = wx.getStorageSync('history');

        // if(history) {
        //     var arr = [];
        //     arr.push(history);
        //     var newHistory = app.dataHandle.historyDataHandle(arr)[0];
        //     this.data.history.unshift(newHistory)
        //     this.setData({
        //         history: this.data.history
        //     });
        //     wx.removeStorage({key: 'history'});
        //     this.setData({
        //         swiper: {
        //             current: 2,
        //             show: true
        //         }
        //     });
        // }
        
        // var comment = wx.getStorageSync('comment');
        // if(comment) {
        //     this.order.historyModify(this, comment.order);
        //     this.data.comment.unshift(comment);
        //     this.setData({
        //         comment: this.data.comment
        //     });
        //     wx.removeStorage({key: 'comment'});
        //     this.setData({
        //         swiper: {
        //             current: 1,
        //             show: true
        //         }
        //     });
        // }

        // wx.navigateTo({url: `../test_page/test_page`});  // 测试用页面
    },

    onHide: function() {
        this.setData({cartHidden: true});
    },

    initImgLoader: function() {
        this.imgLoader = new ImgLoader(this, (err, data) => {
            if(this.data.product) {
                var productData = this.data.product.map(item => {
                    if (item.img == data.src)
                        item.loaded = true
                    return item
                })
                this.setData({product: productData});
            }
            if(this.data.shop) {
                var  shopData = this.data.shop;
                shopData.logo == data.src && (shopData.loaded = true);
                this.setData({shop: shopData});
            }
        });
    },

	loadImages(imgObj) {
        
        if(Array.isArray(imgObj)) {
            imgObj.forEach(item => {
                this.imgLoader.load(item.img)
            })           
        }
        else {
            this.imgLoader.load(imgObj);  //this.data.shop.logo
        }
    },

    addImgStatus: function(imgArr) {
        return imgArr.map(item => {
            item.loaded = false;
            return item;
        })
    },

	onEvent: function(e) {
        if(!e.currentTarget.dataset.fun) return;
		var self = this;
		var obj = e.currentTarget.dataset.fun.split('.')[0];
		var fun = e.currentTarget.dataset.fun.split('.')[1];
		this[obj][fun](self, e);
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
                        current: active,
                        show: true
                    }
                });
			}
		}
	},

	menu: {
		onScroll: function (self, e) {
            var sectionWidth = 570;
			if(e.type == 'scroll') {
				e.detail.scrollTop > 10 && !self.data.scrollDown && self.setData({scrollDown: true});
                if(e.detail.scrollTop < 10 && self.data.scrollDown) {
                    self.setData({classifyViewed: self.data.classify[0].id});
                    setTimeout(function() {
                        self.setData({
                            scrollDown: false
                        });
                    }, 700);
                }
			}

			if(e.type == 'tap') {self.setData({scrollDown: true});}
			var scale = e.detail.scrollWidth / sectionWidth; // rpx和px的比例
			var scrollTop = e.detail.scrollTop / scale + 200; // 转rpx 200rpx 是提前量

			var classifySeleted;
            // console.log(self.data.heightArr)
			self.data.heightArr.forEach((item) => {
				scrollTop > item.sectionTop && (classifySeleted = item.id);
			});
			self.setData({classifySeleted: classifySeleted});
		},

		switchClassify: function (self, e) {
            // console.log(e.target.dataset.id)
			this.onScroll(self, e);
            self.setData({
                classifyViewed: e.target.dataset.id,
                classifySeleted: e.target.dataset.id
            });
		}
	},

    order: {
        historyModify: function(self, id) {
            var newHistory = self.data.history.map((val, index, arr) => {
                val.id == id && (val.button = '已评价', val.data = false);
                return val;
            });
            self.setData({history: newHistory});
        },

        goExpress: function (self, e) {
            var id = e.currentTarget.dataset.id;
            var order;
            self.data.history.forEach(function(val, index, arr) {
                val.id == id && (order = val);
            });
            wx.navigateTo({url: `../express/express?order=${JSON.stringify(order)}`});   
        },

        goScore: function (self, e) {
            var id = e.currentTarget.dataset.id;
            wx.navigateTo({url: `../score/score?id=${id}`});
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
				total = 0,
                boxfee = 0,
                difference,
                minimum = self.data.shop.minimum;

			for (let id in self.data.cart.list) {
				var product = self.data.product[id];
				count += self.data.cart.list[id];
				total = calc.add(total, calc.mul(product.price, self.data.cart.list[id]));
                boxfee = calc.add(boxfee, calc.mul(product.boxFee, self.data.cart.list[id]));
			}
			self.data.cart.count = count;
			self.data.cart.total = total;
            self.data.cart.boxfee = boxfee;

            difference = calc.sub(minimum, total);
            difference <= 0 
            ? self.setData({
                orderEnable: true,
                difference: '去结算'
            }) 
            : self.setData({
                orderEnable: false,
                difference: `差￥${difference}起送`
            }) 

            count == 0 && self.setData({cartHidden: true});
			self.setData({cart: self.data.cart});
		},

		toggleCartHidden: function (self, e) {
			self.data.cart.count && self.setData({
				cartHidden: !self.data.cartHidden
			});
		}
	},

	checkout: function (e) {
        var data = JSON.stringify(this.data.cart);
        wx.navigateTo({url: `../order/order?data=${data}`});
	}

    // ,checkSwiper: function(option) {
    //     console.log('@function checkSwiper')
    //     option.swiper && this.setData({
    //         swiper: {
    //             current: option.swiper,
    //             show: true
    //         },
    //     });
    // }
});
