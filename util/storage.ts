/**
 * local storage
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'

let storage = {
    data: {},
    getItem: (key: string) => this.data[key],
    setItem: (key: string, val) => this.data[key] = val,
    removeItem: (key: string) => delete this.data[key]
}

if (typeof localStorage != 'undefned') {
    storage = localStorage
}

/**
 * 取数据
 * @example
 * 
 * ```ts
 * import * as storage from 'mcore-ext/util/storage'
 * 
 * storage.set('test', {ok: 0})
 * storage.get('test') // {ok: 0}
 * storage.remove('test')
 * storage.get('test') // null
 * ```
 */
export function get(key: string, defaultVal: any = null) {
    let data = storage.getItem(key)
    if (data == null) {
        return defaultVal
    }

    try {
        data = JSON.parse(data)
    } catch (error) {
        data = defaultVal
    }

    return data
}

/**
 * 写数据
 */
export function set(key: string, val: any) {
    return storage.setItem(key, JSON.stringify(val))
}

/**
 * 删数据
 */
export function remove(key: string) {
    return storage.removeItem(key)
}