module.exports = {

	shop: {
		logo: 'http://www.legaoshuo.com/hexie/logo/2.jpg',
        loaded: false,
		name: '大拇指麻辣烫(南商店)',
        address: '宁波市鄞州区天高巷222号',
        phone: '17051090103',
        express: '蜂鸟配送',
        time: '10:30-13:00 16:30-19:00',
        welcome: '单点饮料是不外送的哦，谢谢支持',
        score: 4.6,
        photo: [
            'http://www.legaoshuo.com/hexie/shop_photo/1.jpg',
            'http://www.legaoshuo.com/hexie/shop_photo/2.jpg',
            'http://www.legaoshuo.com/hexie/shop_photo/3.jpg',
            'http://www.legaoshuo.com/hexie/shop_photo/2.jpg',
            'http://www.legaoshuo.com/hexie/shop_photo/1.jpg'
        ],
        promotion: [
            {full: 20, discount: 5},
            {full: 40, discount: 12}
        ],
        minimum: 15,
        boxFee: 2,
        expressFee: 3
	},

	classify: [
		{
			id: 'hot',
			name: '热销',
			product: [0, 1, 2, 3, 4, 5]
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
			product: [2, 7, 8]
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

	product: [
		{
			id: 1,
			name: '超级麻辣烫',
			img: 'http://www.legaoshuo.com/hexie/good/1.jpg',
			price: 12
		},
		{
			id: 2,
			name: '好吃的炒饭',
			img: 'http://www.legaoshuo.com/hexie/good/2.jpg',
			price: 6
		},
		{
			id: 3,
			name: '养生拌饭',
			img: 'http://www.legaoshuo.com/hexie/good/3.jpg',
			price: 8
		},
		{
			id: 4,
			name: '彩色鱿鱼',
			img: 'http://www.legaoshuo.com/hexie/good/4.jpg',
			price: 25
		},
		{
			id: 5,
			name: '桂花糕',
			img: 'http://www.legaoshuo.com/hexie/good/5.jpg',
			price: 12
		},
		{
			id: 6,
			name: '水煮鱼片',
			img: 'http://www.legaoshuo.com/hexie/good/6.jpg',
			price: 42
		},
		{
			id: 7,
			name: '绿色的豆豆',
			img: 'http://www.legaoshuo.com/hexie/good/7.jpg',
			price: 13
		},
		{
			id: 8,
			name: '好吃的鱼肉卷',
			img: 'http://www.legaoshuo.com/hexie/good/8.jpg',
			price: 13
		},
		{
			id: 9,
			name: '老宁波猪排',
			img: 'http://www.legaoshuo.com/hexie/good/9.jpg',
			price: 25
		}
	],

	comment: [
        {
            id: 7,
            avatar: 'http://www.legaoshuo.com/hexie/avatar/2.jpg',
            name: '匿名',
            score: 2,
            time: '2017.06.09',
            content: '东西超级难吃，又很咸，我表示真的很难理解竟然有这样的餐厅存在，呵呵'
        },
		{
			id: 6,
			avatar: 'http://www.legaoshuo.com/hexie/avatar/2.jpg',
			name: '匿名',
			score: 2,
			time: '2017.06.09',
			content: '东西超级难吃，又很咸，我表示真的很难理解竟然有这样的餐厅存在，呵呵'
		},
		{
			id: 5,
			avatar: 'http://www.legaoshuo.com/hexie/avatar/3.jpg',
			name: '田野猫',
			score: 5,
			time: '2017.06.08',
			content: '性价比很高'
		},
		{
			id: 4,
			avatar: 'http://www.legaoshuo.com/hexie/avatar/1.jpg',
			name: '老虎猫',
			score: 4,
			time: '2017.06.08',
			content: '分量十足啊 不错 外卖小哥很帅'
		},
		{
			id: 3,
			avatar: 'http://www.legaoshuo.com/hexie/avatar/2.jpg',
			name: '有趣',
			score: 3,
			time: '2017.06.07',
			content: '有点太咸了 下次盐少放点啊...'
		},
		{
			id: 2,
			avatar: 'http://www.legaoshuo.com/hexie/avatar/3.jpg',
			name: '天使的猫',
			score: 5,
			time: '2017.06.07',
			content: '好吃好吃好吃好吃！'
		},
        {
            id: 1,
            avatar: 'http://www.legaoshuo.com/hexie/avatar/1.jpg',
            name: '苹果和鱼',
            score: 4,
            time: '2017.06.03',
            content: '松坂肉还不错'
        }
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
}