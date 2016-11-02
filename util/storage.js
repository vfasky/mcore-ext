/**
 * local storage
 * @author vfasky<vfasky@gmail.com>
 *
 **/
'use strict';
var _this = this;
var storage = {
    data: {},
    getItem: function (key) { return _this.data[key]; },
    setItem: function (key, val) { return _this.data[key] = val; },
    removeItem: function (key) { return delete _this.data[key]; }
};
if (typeof localStorage != 'undefned') {
    storage = localStorage;
}
/**
 * 取数据
 */
function get(key, defaultVal) {
    if (defaultVal === void 0) { defaultVal = null; }
    var data = storage.getItem(key);
    if (data == null) {
        return defaultVal;
    }
    try {
        data = JSON.parse(data);
    }
    catch (error) {
        data = defaultVal;
    }
    return data;
}
exports.get = get;
/**
 * 写数据
 */
function set(key, val) {
    return storage.setItem(key, JSON.stringify(val));
}
exports.set = set;
/**
 * 删数据
 */
function remove(key) {
    return storage.removeItem(key);
}
exports.remove = remove;
