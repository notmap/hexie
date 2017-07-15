
const ImgLoader = require('../../utils/img_loader/img_loader.js')
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

	onLoad: function (options) {
        var localData = app.globalData;
        this.setData({
            shop: localData.shop,
            classify: localData.classify,
            product: this.addImgStatus(localData.product),
            comment: localData.comment,
            history: localData.history,
            classifySeleted: localData.classifySeleted,
            heightArr: localData.classify,
            difference: `差￥${localData.shop.minimum}起送`
        });

        this.imgLoader = new ImgLoader(this, this.imageOnLoad.bind(this))
        this.loadImages(this.data.product);
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
                        current: active,
                        show: true
                    }
                });
			}
            // console.log(self.data.swiper.current == 2)
		}
	},

	menu: {
		onScroll: function (self, e) {
            // console.log(5839);
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
				total = 0,
                difference,
                minimum = self.data.shop.minimum;

			for (let id in self.data.cart.list) {
				var product = self.data.product[id];
				count += self.data.cart.list[id];
				total += product.price * self.data.cart.list[id];
			}
			self.data.cart.count = count;
			self.data.cart.total = total;
            difference = minimum - total;

            (minimum - total) <= 0 
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
});
