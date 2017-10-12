
module.exports = {
    deepClone(obj) {
        var result;
        var oClass = this.isClass(obj);

        if (oClass === "Object") result = {};
        else if (oClass === "Array") result = [];
        else return obj;

        for (var key in obj) {
            var copy = obj[key];
            if (this.isClass(copy) == "Object") result[key] = this.deepClone(copy);  //递归调用
            else if (this.isClass(copy) == "Array") result[key] = this.deepClone(copy);
            else result[key] = obj[key];
        }

        return result;
    },

    isClass(o) {
        if (o === null) return "Null";
        if (o === undefined) return "Undefined";
        return Object.prototype.toString.call(o).slice(8, -1);
    }
}
