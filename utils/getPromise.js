
module.exports = function(todo) { 
    return new Promise((resolve, reject) => {
            todo(resolve, reject);
    });
}
