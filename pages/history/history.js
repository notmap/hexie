var app = getApp()
Page({
	data: {
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
        this.pretreatment();
    },

	onShow: function() {},

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

