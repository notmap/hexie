var server = require('./utils/server');

App({

	onLaunch: function () {
		console.log('1.1 App Launch'); // debug
		var self = this;
		var rd_session = wx.getStorageSync('rd_session');
		console.log('1.2 rd_session', rd_session) // debug
		if (!rd_session) {
			self.login();
		} 
		else {
			wx.checkSession({
				success: function () {
					console.log('1.3 登录态未过期')
					self.rd_session = rd_session;
					self.getUserInfo();
				},
				fail: function () {
					self.login();
				}
			})
		}
	},

	onShow: function () {
		console.log('App Show') // debug
	},

	onHide: function () {
		console.log('App Hide') // debug
	},

	globalData: {
		hasLogin: false,
		shops: [
			{
				id: 1,
				img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/shop_1.jpg',
				distance: 1.8,
				sales: 1475,
				logo: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_1.jpg',
				name: '杨国福麻辣烫(东四店)',
				promotion: '满20减3, 满40减10'
			},
			{
				id: 2,
				img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/shop_2.jpg',
				distance: 2.4,
				sales: 1284,
				logo: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_2.jpg',
				name: '忠友麻辣烫(东四店)',
				promotion: '满20减3, 满40减10'
			},
			{
				id: 3,
				img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/shop_3.jpg',
				distance: 2.3,
				sales: 2039,
				logo: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_3.jpg',
				name: '粥面故事(东大桥店)',
				promotion: '满20减3, 满40减10'
			},
			{
				id: 4,
				img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/shop_4.jpg',
				distance: 3.4,
				sales: 400,
				logo: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_4.jpg',
				name: '兄鸡',
				promotion: '满20减3, 满40减10'
			}
		]
	},

	rd_session: null,

	login: function() {
		var self = this;
		wx.login({
			success: function (res) {
				console.log('wx.login', res) // debug

				self.rd_session = res;
				self.globalData.hasLogin = true;
				wx.setStorageSync('rd_session', self.rd_session);
				self.getUserInfo();


				// server.getJSON('/WxAppApi/setUserSessionKey', {code: res.code}, function (res) {
				// 	console.log('setUserSessionKey', res)
				// 	self.rd_session = res.data.data.rd_session;
				// 	self.globalData.hasLogin = true;
				// 	wx.setStorageSync('rd_session', self.rd_session);
				// 	self.getUserInfo();
				// });
			}
		});
	},

	getUserInfo: function() {
		var self = this;
		wx.getUserInfo({
			success: function(res) {

				console.log('2.1 getUserInfo', res)
				self.globalData.userInfo = res.userInfo;
				// server.getJSON('/WxAppApi/checkSignature', {rd_session: self.rd_session,result: res}, function (res) {
				// 	console.log('checkSignature', res)
				// 	if (res.data.errorcode) {
				// 		// TODO:验证有误处理
				// 	}
				// });
			}
		});
	}
})
