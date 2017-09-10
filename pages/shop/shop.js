const md5 = require('../../utils/md5.js');
const ImgLoader = require('../../utils/img_loader/img_loader.js');
const calc = require('../../utils/calculation.js');
// const server = require('../../utils/server');

var app = getApp();
Page({

	data: {
		specHidden: true,
		cartHidden: true,
        orderEnable: false,
		swiper: {
            current: '0',
            show: false
        },
		cart: {
			count: 0,
			total: 0,
			list: {}
		}
	},

	onLoad: function (option) {
        this.checkSwiper(option);
        this.setMainData();
        this.imgLoader = new ImgLoader(this, this.imageOnLoad.bind(this));
        this.loadImages(this.data.product);
	},

    onShow: function(option) {

        var history = wx.getStorageSync('history');
        if(history) {
            var arr = [];
            arr.push(history);
            var newHistory = app.dataHandle.historyDataHandle(arr)[0];
            // console.log(newHistory);
            this.data.history.unshift(newHistory)
            this.setData({
                history: this.data.history
            });
            wx.removeStorage({key: 'history'});
            this.setData({
                swiper: {
                    current: 2,
                    show: true
                }
            });
        }
        
        var comment = wx.getStorageSync('comment');
        if(comment) {
            this.order.historyModify(this, comment.order);
            this.data.comment.unshift(comment);
            this.setData({
                comment: this.data.comment
            });
            wx.removeStorage({key: 'comment'});
            this.setData({
                swiper: {
                    current: 1,
                    show: true
                }
            });
        }
    },

    checkSwiper: function(option) {
        option.swiper && this.setData({
            swiper: {
                current: option.swiper,
                show: true
            },
        });
    },

    setMainData: function() {
        var localData = app.globalData;
        this.setData({
            shop: localData.shop,
            classify: localData.classify,
            product: this.addImgStatus(localData.product),
            comment: localData.comment,
            history: localData.history,
            classifySeleted: localData.classifySeleted,
            heightArr: localData.heightArr,
            difference: `差￥${localData.shop.minimum}起送`
        });
    },

	loadImages(imgArr) {
        this.imgLoader.load(this.data.shop.logo);
        imgArr.forEach(item => {
            this.imgLoader.load(item.img)
        })
    },

    imageOnLoad(err, data) {

        // console.log('图片加载完成', err, data.src);
        // console.log('图片加载完成');

        var productData = this.data.product.map(item => {
            if (item.img == data.src)
                item.loaded = true
            return item
        })
        
        var  shopData = this.data.shop;
        shopData.logo == data.src && (shopData.loaded = true);

        this.setData({
            product: productData,
            shop: shopData
        })
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

    start: function(e) {
        this.data.startY = e.changedTouches[0].clientY;
        this.data.startTime = e.timeStamp;
    },

    end: function(e) {

    	// var startY = this.data.startY,
	    // 	startTime = this.data.startTime,
	    // 	endY = e.changedTouches[0].clientY,
	    // 	endTime = e.timeStamp,
	    // 	interval,
	    // 	move,
	    // 	transitionTime;

    	// interval = endTime - startTime;
    	// console.log(interval);
    	// move = Math.abs(endY - startY);
    	// console.log(move);

    	// transitionTime = 130*interval / (1000*move);
    	// console.log(parseFloat(transitionTime.toFixed(2)));
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
        // console.log(data);
        wx.navigateTo({url: `../order/order?data=${data}`});
	}
});
