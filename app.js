var server = require('./utils/server');

App({

	globalData: {
		hasLogin: false
	},

	rd_session: null,

	onLaunch: function () {
		// console.log('1.1 App Launch'); // debug
		var self = this;
		var rd_session = wx.getStorageSync('rd_session');
		// console.log('1.2 rd_session', rd_session) // debug
		if (!rd_session) {
			self.login();
		} 
		else {
			wx.checkSession({
				success: function () {
					// console.log('1.3 登录态未过期') // debug
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
		// console.log('App Show') // debug
	},

	onHide: function () {
		// console.log('App Hide') // debug
	},

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

				// console.log('2.1 getUserInfo', res) // debug
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
