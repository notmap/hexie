
module.exports = {
    calcScore: function(score) { //浮点BUG
        var newScore = score*10;  
        var arr = [], i = 0;
        while (i < 5) {
            if(newScore <= 3) arr.push(0);
            else if(newScore >= 3 && newScore <= 7) arr.push(5);
            else arr.push(1);
            newScore -= 10;
            i++;
        }
        return {
            iconArr: arr,
            score: `${score}.0`
        };
    }
}
