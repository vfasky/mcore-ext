/**
 * i18n
 * @author vfasky<vfasky@gmail.com>
 *
 **/
'use strict';
var sprintf_js_1 = require("sprintf-js");
var mcore = require("mcore3");
var Template = mcore.Template;
var util = mcore.util;
/**
 * 存放语言包翻译字典
 */
var _dict = {
    'zh-CN': {},
    'en': {}
};
/**
 * 默认语言包
 */
var _local = 'zh-CN';
/**
 * 没有查到字典时，执行
 */
var _noMatchCallback = function (str, local) { };
function getDict() {
    return _dict[_local] || {};
}
function i18n() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    var dict = getDict();
    args[0] = String(args[0]).trim();
    if (args.length > 1 && args[0].indexOf('%s') == -1
        && args[1].indexOf('%s') != -1) {
        var v = args[0];
        var k = args[1];
        args[0] = k;
        args[1] = v;
    }
    // 字典存在，翻译
    if (dict[args[0]]) {
        args[0] = dict[args[0]];
    }
    else {
        _noMatchCallback(args[0], _local);
    }
    // 不需要替换字符，直接返回
    if (args.length < 2)
        return args[0] || '';
    for (var i = 0, len = args.length; i < len; i++) {
        var v = args[i];
        if (util.isArray(v)) {
            args[i] = v.length;
        }
        else if (v === undefined) {
            args[i] = '';
        }
    }
    return sprintf_js_1.sprintf.apply(this, args);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = i18n;
/**
 * 没有查到字典时，执行
 */
function setNotMatchCalllback(callback) {
    _noMatchCallback = callback;
}
exports.setNotMatchCalllback = setNotMatchCalllback;
function setLocal(name) {
    _local = name;
}
exports.setLocal = setLocal;
function getLocal() {
    return _local;
}
exports.getLocal = getLocal;
function loadDict(name, dict) {
    _dict[name] = dict;
}
exports.loadDict = loadDict;
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
exports.register = Template.formatters['i18n'] = Template.formatters['_'] = i18n;
Template.formatters['%'] = Template.formatters['sprintf'] = sprintf_js_1.sprintf;
