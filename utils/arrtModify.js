
module.exports = function(obj, arrtObj) { 
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
