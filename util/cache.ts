/**
 * cache
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'

import * as storage from './storage'

const CACHE_PRE = '__mc_cache_'
const MAX_TIME = 3600 * 24 * 1000 * 1000

/**
 * 设置缓存
 * @param key 索引
 * @param value 值
 * @param time 缓存多少毫秒
 */
export function set (key: string, value, time = MAX_TIME) {
    time = (new Date()).getTime() + time

    let data = {
        time: time,
        value: value
    }

    return storage.set(CACHE_PRE + key, value)
}

/**
 * 取缓存
 * @param key 索引
 * @param defaultVal 没有数据时，返回的默认值
 */
export function get (key: string, defaultVal = null) {
    let data = storage.get(CACHE_PRE + key, null)

    if (data === null || !data.time) {
        return defaultVal
    }

    let curTime = (new Date()).getTime()

    if (curTime <= data.time) {
        return data.value
    }

    remove(key)

    return defaultVal
}

/**
 * 删除缓存
 * @param key 索引
 */
export function remove (key: string) {
    return storage.remove(CACHE_PRE + key)
}