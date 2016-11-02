/**
 * cache
 * @author vfasky<vfasky@gmail.com>
 *
 **/
'use strict';
var storage = require('./storage');
var CACHE_PRE = '__mc_cache_';
var MAX_TIME = 3600 * 24 * 1000 * 1000;
/**
 * 设置缓存
 * @param key 索引
 * @param value 值
 * @param time 缓存多少毫秒
 */
function set(key, value, time) {
    if (time === void 0) { time = MAX_TIME; }
    time = (new Date()).getTime() + time;
    var data = {
        time: time,
        value: value
    };
    return storage.set(CACHE_PRE + key, value);
}
exports.set = set;
/**
 * 取缓存
 * @param key 索引
 * @param defaultVal 没有数据时，返回的默认值
 */
function get(key, defaultVal) {
    if (defaultVal === void 0) { defaultVal = null; }
    var data = storage.get(CACHE_PRE + key, null);
    if (data === null || !data.time) {
        return defaultVal;
    }
    var curTime = (new Date()).getTime();
    if (curTime <= data.time) {
        return data.value;
    }
    remove(key);
    return defaultVal;
}
exports.get = get;
/**
 * 删除缓存
 * @param key 索引
 */
function remove(key) {
    return storage.remove(CACHE_PRE + key);
}
exports.remove = remove;
