
module.exports = function(obj, arrtObj) { // obj => 需要修改是属性的对象  arrObj => 修改的属性
    if(Array.isArray(obj)) {
        obj.map((item, index, arr) => {
            for(let i in arrtObj) {
                item[arrtObj[i]] = item[i];
                delete item[i];
            }
            return item;
        });
    } 
    else {
        for(let i in arrtObj) {
            obj[arrtObj[i]] = obj[i];
            delete obj[i];
        }
    }
    return obj;
}
