/**
 * i18n
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'

import { sprintf } from 'sprintf-js'

import { Template, util } from 'mcore3'

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

Template.formatters['i18n'] = Template.formatters['_'] = i18n
Template.formatters['%'] = Template.formatters['sprintf'] = sprintf