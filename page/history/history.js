var app = getApp()
Page({
	data: {
        history:[
            {
                logo: '../../assets/shop1.jpg',
                name: '欧巴韩国料理店铺(创新128广场)',
                status: 1, // 配送中
                order: {
                    goods: [
                        {good: '马铃薯脆', amount: 1},
                        {good: '黑椒牛肉饭', amount: 1},
                        {good: '可乐', amount: 2},
                        {good: '好吃的鸡块', amount: 1}
                    ],
                    total: 5,
                    money: 56.50
                }
            },
            {
                logo: '../../assets/shop2.jpg',
                name: '肯德基',
                status: 2, // 订单已完成
                order: {
                    goods: [
                        {good: '可乐', amount: 2},
                        {good: '好吃的鸡块', amount: 1}
                    ],
                    total: 3,
                    money: 36.50
                }
            },
            {
                logo: '../../assets/shop3.jpg',
                name: '麦当劳',
                status: 2, // 订单已完成
                order: {
                    goods: [
                        {good: '可口可乐', amount: 2},
                        {good: '好吃的汉堡', amount: 1}
                    ],
                    total: 3,
                    money: 36.50
                }
            },
            {
                logo: '../../assets/shop4.jpg',
                name: '星巴克',
                status: 0, // 订单已取消
                order: {
                    goods: [
                        {good: '马铃薯脆', amount: 1},
                        {good: '黑椒牛肉饭', amount: 1}
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
            switch(value.status){
                case 0:
                    value.status = '订单已取消';
                    value.button = false;
                    return value;
                    break;
                case 1:
                    value.status = '配送中';
                    value.button = '查看订单';
                    return value;
                    break;
                default:
                    value.status = '订单已完成';
                    value.button = '评价一下';
                    return value;
            }
        });
        console.log(history)
        this.setData({history: history});
    }
});

