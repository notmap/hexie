

var app = getApp();
Page({

	data: {
        marginTop: 300
	},

	onLoad: function (option) {},

    onShow: function(option) {},

    start: function(e) {
        // console.log(e.changedTouches[0].clientY)
        this.data.start = e.changedTouches[0].clientY;
    },

    move: function(e) {
        // console.log(e.changedTouches[0].clientY)
        this.data.stop = e.changedTouches[0].clientY;
        this.data.move = this.data.start - this.data.stop;
        console.log(this.data.move);
        this.setData({
            marginTop: 300 - this.data.move
        });
    }



});
