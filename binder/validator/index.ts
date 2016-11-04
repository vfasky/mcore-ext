/// <reference path="../../node_modules/typescript/lib/lib.es6.d.ts" />

/**
 * binder validator
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'

import * as $ from 'jquery'
import { Template, util } from 'mcore3'
import 'form-serializer'

if (typeof String.prototype.trim === 'undefined') {
    (<any>String).prototype.trim = function (x) {
        return $.trim(x)
    }
}

// 是否字母
const _isAlphabetReg = /^[A-Za-z]+$/

// 是否中文
const _isChrStr = /[^x00-xff]/

// 是否邮箱
const _isEmailReg = /^(?:[a-z0-9]+[_\-+.]+)*[a-z0-9]+@(?:([a-z0-9]+-?)*[a-z0-9]+.)+([a-z]{2,})+$/i

// 是否日期 20120409 | 2012-04-09 | 2012/04/09 | 2012.04.09 | 以上各种无 0 的状况
const _isDateReg = /^([1-2]\d{3})([-/.])?(1[0-2]|0?[1-9])([-/.])?([1-2]\d|3[01]|0?[1-9])$/

// 是否手机
const _isMobileReg = /^1[3-9]\d{9}$/

// 是否是数字和字母
const _isDigitOrAlphaReg = /^(\d|\w)+$/

/**
 * 检查座机
 * 座机：仅中国座机支持；区号可有 3、4位数并且以 0 开头；电话号不以 0 开头，最 8 位数，最少 7 位数
 * 但 400/800 除头开外，适应电话，电话本身是 7 位数
 * 0755-29819991 | 0755 29819991 | 400-6927972 | 4006927927 | 800...
 */
const _isTelReg = /^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/

// 检查url
const _urlCheck = (function () {
    let protocols = '((https?|s?ftp|irc[6s]?|git|afp|telnet|smb):\\/\\/)?'
    let userInfo = '([a-z0-9]\\w*(\\:[\\S]+)?\\@)?'
    let domain = '(?:localhost|(?:[a-z0-9]+(?:[-\\w]*[a-z0-9])?(?:\\.[a-z0-9][-\\w]*[a-z0-9])*)*\\.[a-z]{2,})'
    let port = '(:\\d{1,5})?'
    let ip = '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}'
    let address = '(\\/\\S*)?'
    let domainType = [protocols, userInfo, domain, port, address]
    let ipType = [protocols, userInfo, ip, port, address]
    let rDomain = new RegExp('^' + domainType.join('') + '$', 'i')
    let rIP = new RegExp('^' + ipType.join('') + '$', 'i')

    return function (x) {
        return rDomain.test(x) || rIP.test(x)
    }
})()

let _rule = {
    // 不能为空
    required: function (x: any = '', rule = null) {
        if (rule == null) return String(x).trim().length > 0

        if (x.$form.find(rule).val()) {
            return String(x).trim().length > 0
        }
        return true
    },
    // trim
    trim: function (x = '') {
        return {
            type: 'formatter',
            val: String(x).trim()
        }
    },
    // 是否字母
    isAlphabet: (x = '') => _isAlphabetReg.test(String(x)),

    // 是否是数字和字母
    onlyDigitAndAlpha: (x = '') => _isDigitOrAlphaReg.test(String(x)),

    // 最小长度
    minlength: function (x: string, len: number) {
        len = Number(len)
        x = String(x).trim()
        return x.length >= len
    },
    // 最大长度
    maxlength: function (x: string, len: number) {
        len = Number(len)
        x = String(x).trim()
        return x.length <= len
    },
    // 最大中文长度
    maxChrLen: function (x: string, len: number) {
        len = Number(len)
        x = String(x).trim()
        let strLen = 0
        for (let i = 0; i < x.length; i++) {
            let v = x[i]
            if (v.match(_isChrStr)) {
                strLen += 1
            }
            else {
                strLen += 0.5
            }
        }
        return strLen <= len
    }, // 最小中文长度
    minChrLen: function (x: string, len: number) {
        len = Number(len)
        x = String(x).trim()
        let strLen = 0
        for (let i = 0; i < x.length; i++) {
            let v = x[i]
            if (v.match(_isChrStr)) {
                strLen += 1
            }
            else {
                strLen += 0.5
            }
        }
        return strLen >= len
    },
    // 只能是数字
    isNumber: (x) => $.isNumeric(String(x)),
    // 是否为整数
    isInteger: (x) => Number(x) % 1 === 0,
    // 最小值
    min: (x: number, min: number) => Number(x) >= Number(min),
    // 最小值
    max: (x: number, max: number) => Number(x) <= Number(max),
    // 是否相符
    equals: function (x: any, value: any) {
        if (value instanceof $) value = value.val()
        if (x instanceof $) x = x.val()
        return String(x) == String(value)
    },
    // 是否邮箱
    isEmail: (x) => _isEmailReg.test(String(x)),
    // 检查日期
    isDate: function (x) {
        if (_isDateReg.test(String(x))) return false

        let taste = _isDateReg.exec(String(x))

        let year = Number(taste[1])
        let month = Number(taste[3]) - 1
        let day = Number(taste[5])
        let d = new Date(year, month, day)

        return year === d.getFullYear() && month === d.getMonth() && day === d.getDate()
    },
    // 是否手机
    isMobile: (x) => _isMobileReg.test(String(x)),
    // 是否座机
    isTel: (x) => _isTelReg.test(String(x)),
    // url
    isUrl: (x) => _urlCheck(String(x))
}

let _errMsg = {
    required: '不能为空',
    isNumber: '只能是数字',
    isAlphabet: '只能是字母',
    onlyDigitAndAlpha: '只能是字母和数字',
    minlength: (len) => `最小 ${len} 位字符`,
    minChrLen: (len) => `最小 ${len} 个中文 或  ${Number(len) * 2} 个英文`,
    maxChrLen: (len) => `最多 ${len} 个中文 或  ${Number(len) * 2} 个英文`,
    maxlength: (len) => `最多 ${len} 位字符`,
    min: (min) => `数值要大于 ${min}`,
    max: (max) => `数值要小于 ${max}`,
    equals: '两次输入的值不相符',
    isEmail: '邮箱格式不正确',
    isInteger: '数值必须是整数',
    isDate: '日期格式不正确',
    isMobile: '手机格式不正确',
    isTel: '座机格式不正确'
}

// 解释验证规则
function parseValidator ($el: JQuery, rules = [], $form: JQuery) {
    let name = $el.attr('name')
    if (!name) return  
    
    let validatorAttr = $el.attr('validator').trim()

    if (!validatorAttr) return  

    util.each(validatorAttr.split('|'), (v) => {
        let diyErr
        let err
        let ix = String(v).indexOf(' err:')
        if(ix != -1) {
            let eT = v.split(' err:')
            v = eT[0]
            diyErr = eT[1]
        }

        let args: any[] = $.grep(v.split(' '), (s: string) => {
            return $.trim(s).length > 0
        })


        let ruleType = args[0]
        let checkRule = _rule[ruleType]

        if (!checkRule) {
            console.log("validator rule: #{ruleType} undefined")
            return
        }

        if (diyErr) {
            err = diyErr
        } else {
            if ($.isFunction(_errMsg[ruleType])){
                let msgArgs = args.slice(0)
                msgArgs.splice(0, 1)
                err = _errMsg[ruleType].apply($el[0], msgArgs)
            } else {
                err = _errMsg[ruleType] || 'error'
            }
        }

        args[0] = $el
        if (ruleType == 'equals') args[1] = $form.find(args[1]).eq(0) 

        rules.push({
            name: name,
            type: ruleType,
            rule: checkRule,
            args: args,
            err: err
        })
    })
}

// 取规则
function getRules ($form: JQuery) {
    let rules = []

    $form.find('[validator]').each(function(){
        parseValidator($(this), rules, $form)
    })

    return rules
}

// 取对应name的值
function getNameValue (data, name: string, $el: JQuery) {
    name = String(name)
    if (-1 == name.indexOf('[')){
        return data[name] || ''
    }
    return $el.val().trim()
}

Template.binders['validator'] = Template.binders['validated'] = {
    update: function (el: HTMLElement, value){
        if (el.tagName.toLowerCase() == 'form') {
            el.setAttribute('novalidate', 'novalidate')
            return
        }

        el.setAttribute('validator', value)
    },

    init: function (el, value) {
        if (el.tagName.toLowerCase() != 'form' || !el._element) {
            return el.setAttribute('validator', value)
        }

        let callback = Template.strToFun(el, value) || function(){}
        let proxyEnv = Template.getEnv(el)
        let $form = $(el)
        // 禁用 html5 验证
        el.setAttribute('novalidate', 'novalidate')

        function validatorForm (callback = function(err, data){}) {
            let rules = getRules($form)
            let data = (<any>$form).serializeObject()
            let err = null

            $.each(rules, (k, v)=>{
                let $el = v.args[0]
                let _value = getNameValue(data, v.name, $el)

                if (v.type != 'required' && (_value == '' || _value == undefined)) return

                let value = {
                    toString: () => String(_value) ,
                    toNumber: () => Number(_value) ,
                    $el: $el,
                    $form: $form
                }

                v.args[0] = value

                let checkRes = v.rule.apply(null, v.args)

                if (false === checkRes){
                    err = {
                        $el: $el,
                        err: v.err,
                        $form: $form
                    }
                    return false
                }

                if (checkRes.type && checkRes.type === 'formatter') {
                    $el.val(checkRes.val)
                    data[v.name] = checkRes.val
                }
            })

            return callback(err, data)
        }

        // 注入上下文
        if (proxyEnv && !proxyEnv[value + 'Check']) {
            proxyEnv[value + 'Check'] = function(){
                return new Promise((resolve, reject) => {
                    validatorForm((err, data)=>{
                        if(err) return reject(err)
                        resolve(data)
                    })
                })
            }
        }

        $form.off('submit.mc-binder-validator').on('submit.mc-binder-validator', () => {
            try {
                validatorForm(callback)
            } catch (err) {
                console.error(err.stack)
            }

            return false
        })
    }
}

export function add (x: string, fun, errMsg: string = '') {
    _rule[x] = fun
    if (errMsg) _errMsg[x] = errMsg 
}

export function addErrMsg (type: string, msg: string) {
    _errMsg[type] = msg
}

export function check (...args) {
    if (args.length < 2) return false 
    let type = args[0]
    args.splice(0, 1)

    if (!_rule[type]) return false 

    return _rule[type].apply(null, args)
}