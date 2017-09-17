
module.exports = {

	appid: 'wx1d5cce846744081a',
	secret: '84f4d868dae8a82e8b2457a86868f441',
	host: 'https://snack.bugdeer.com',

	request: function(url, method, data, success, fail) {
		wx.request({
	        url: this.host + url, 
	        method: method,
	        data: data,
	        header: {
	        	'content-type': 'application/json',
	        	'X-Requested-Page': 'json'
	        },
	        success: success,
	        fail: fail
	    })
	},

	getOpenid: function(code, shopId, success, fail) {
		var app = getApp();
		this.request('/wx/wechat/openid', 'post', {
			rd_session: app.rd_session,
			appid: this.appid,
			secret: this.secret,
			code: code,
			shopId: shopId
		}, success, fail);
	}

	// ,getCategory: function() {}
	// ,getProduct: function() {}
}




    


