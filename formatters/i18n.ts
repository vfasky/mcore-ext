/**
 * i18n
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'

import { sprintf } from 'sprintf-js'
import * as mcore from 'mcore3'
const Template = mcore.Template
const util = mcore.util

/**
 * 存放语言包翻译字典
 */
let _dict = {
    'zh-CN': {},
    'en': {}
}

/**
 * 默认语言包
 */
let _local = 'zh-CN'

/**
 * 没有查到字典时，执行
 */
let _noMatchCallback = function(str: string, local){}

function getDict () {
    return _dict[_local] || {}
}

export default function i18n (...args) {
    let dict = getDict()
    args[0] = String(args[0]).trim()

    if (args.length > 1 && args[0].indexOf('%s') == -1
        && args[1].indexOf('%s') != -1 ) {
            let v = args[0]
            let k = args[1]
            args[0] = k
            args[1] = v
    }

    // 字典存在，翻译
    if (dict[args[0]]) {
        args[0] = dict[args[0]]
    } else {
        _noMatchCallback(args[0], _local)
    }

    // 不需要替换字符，直接返回
    if (args.length < 2) return args[0] || ''

    for (let i = 0, len = args.length; i < len; i++) {
        let v = args[i]
        if (util.isArray(v)) {
            args[i] = v.length
        } else if (v === undefined) {
            args[i] = ''
        }
    }

    return sprintf.apply(this, args)
}

/**
 * 没有查到字典时，执行
 */
export function setNotMatchCalllback (callback) {
    _noMatchCallback = callback
}

export function setLocal (name: string) {
    _local = name
}

export function getLocal () {
    return _local
}

export function loadDict (name: string, dict) {
    _dict[name] = dict
}

/**
 * @example
 * ```ts
 * import { loadDict, setLocal } from 'mcore-ext/formatters/i18n'
 * import i18n from 'mcore-ext/formatters/i18n'
 * 
 * // 加载语言包
 * loadDict('zh-CN', {
 *      'hello %s': '您好 %s'
 * })
 * 
 * // 使用语言包
 * setLocal('zh-CN')
 * 
 * console.log(i18n('hello %s' | _ 'mcore')) // 您好 mcore
 * 
 * ```
 * ##### use
 * ```html
 * {'hello %s' | _ 'mcore'}
 * <input mc-placeholder="'hello %s' | _ 'mcore'"> 
 * 
 * out:
 * 
 * 您好 mcore
 * <input placeholder="您好 mcore">
 * ```
 */
export let register = Template.formatters['i18n'] = Template.formatters['_'] = i18n
Template.formatters['%'] = Template.formatters['sprintf'] = sprintf