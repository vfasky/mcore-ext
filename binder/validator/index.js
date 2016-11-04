/// <reference path="../../node_modules/typescript/lib/lib.es6.d.ts" />
/**
 * binder validator
 * @author vfasky<vfasky@gmail.com>
 *
 **/
'use strict';
var $ = require('jquery');
var mcore3_1 = require('mcore3');
require('form-serializer');
if (typeof String.prototype.trim === 'undefined') {
    String.prototype.trim = function (x) {
        return $.trim(x);
    };
}
// 是否字母
var _isAlphabetReg = /^[A-Za-z]+$/;
// 是否中文
var _isChrStr = /[^x00-xff]/;
// 是否邮箱
var _isEmailReg = /^(?:[a-z0-9]+[_\-+.]+)*[a-z0-9]+@(?:([a-z0-9]+-?)*[a-z0-9]+.)+([a-z]{2,})+$/i;
// 是否日期 20120409 | 2012-04-09 | 2012/04/09 | 2012.04.09 | 以上各种无 0 的状况
var _isDateReg = /^([1-2]\d{3})([-/.])?(1[0-2]|0?[1-9])([-/.])?([1-2]\d|3[01]|0?[1-9])$/;
// 是否手机
var _isMobileReg = /^1[3-9]\d{9}$/;
// 是否是数字和字母
var _isDigitOrAlphaReg = /^(\d|\w)+$/;
/**
 * 检查座机
 * 座机：仅中国座机支持；区号可有 3、4位数并且以 0 开头；电话号不以 0 开头，最 8 位数，最少 7 位数
 * 但 400/800 除头开外，适应电话，电话本身是 7 位数
 * 0755-29819991 | 0755 29819991 | 400-6927972 | 4006927927 | 800...
 */
var _isTelReg = /^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/;
// 检查url
var _urlCheck = (function () {
    var protocols = '((https?|s?ftp|irc[6s]?|git|afp|telnet|smb):\\/\\/)?';
    var userInfo = '([a-z0-9]\\w*(\\:[\\S]+)?\\@)?';
    var domain = '(?:localhost|(?:[a-z0-9]+(?:[-\\w]*[a-z0-9])?(?:\\.[a-z0-9][-\\w]*[a-z0-9])*)*\\.[a-z]{2,})';
    var port = '(:\\d{1,5})?';
    var ip = '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}';
    var address = '(\\/\\S*)?';
    var domainType = [protocols, userInfo, domain, port, address];
    var ipType = [protocols, userInfo, ip, port, address];
    var rDomain = new RegExp('^' + domainType.join('') + '$', 'i');
    var rIP = new RegExp('^' + ipType.join('') + '$', 'i');
    return function (x) {
        return rDomain.test(x) || rIP.test(x);
    };
})();
var _rule = {
    // 不能为空
    required: function (x, rule) {
        if (x === void 0) { x = ''; }
        if (rule === void 0) { rule = null; }
        if (rule == null)
            return String(x).trim().length > 0;
        if (x.$form.find(rule).val()) {
            return String(x).trim().length > 0;
        }
        return true;
    },
    // trim
    trim: function (x) {
        if (x === void 0) { x = ''; }
        return {
            type: 'formatter',
            val: String(x).trim()
        };
    },
    // 是否字母
    isAlphabet: function (x) {
        if (x === void 0) { x = ''; }
        return _isAlphabetReg.test(String(x));
    },
    // 是否是数字和字母
    onlyDigitAndAlpha: function (x) {
        if (x === void 0) { x = ''; }
        return _isDigitOrAlphaReg.test(String(x));
    },
    // 最小长度
    minlength: function (x, len) {
        len = Number(len);
        x = String(x).trim();
        return x.length >= len;
    },
    // 最大长度
    maxlength: function (x, len) {
        len = Number(len);
        x = String(x).trim();
        return x.length <= len;
    },
    // 最大中文长度
    maxChrLen: function (x, len) {
        len = Number(len);
        x = String(x).trim();
        var strLen = 0;
        for (var i = 0; i < x.length; i++) {
            var v = x[i];
            if (v.match(_isChrStr)) {
                strLen += 1;
            }
            else {
                strLen += 0.5;
            }
        }
        return strLen <= len;
    },
    minChrLen: function (x, len) {
        len = Number(len);
        x = String(x).trim();
        var strLen = 0;
        for (var i = 0; i < x.length; i++) {
            var v = x[i];
            if (v.match(_isChrStr)) {
                strLen += 1;
            }
            else {
                strLen += 0.5;
            }
        }
        return strLen >= len;
    },
    // 只能是数字
    isNumber: function (x) { return $.isNumeric(String(x)); },
    // 是否为整数
    isInteger: function (x) { return Number(x) % 1 === 0; },
    // 最小值
    min: function (x, min) { return Number(x) >= Number(min); },
    // 最小值
    max: function (x, max) { return Number(x) <= Number(max); },
    // 是否相符
    equals: function (x, value) {
        if (value instanceof $)
            value = value.val();
        if (x instanceof $)
            x = x.val();
        return String(x) == String(value);
    },
    // 是否邮箱
    isEmail: function (x) { return _isEmailReg.test(String(x)); },
    // 检查日期
    isDate: function (x) {
        if (_isDateReg.test(String(x)))
            return false;
        var taste = _isDateReg.exec(String(x));
        var year = Number(taste[1]);
        var month = Number(taste[3]) - 1;
        var day = Number(taste[5]);
        var d = new Date(year, month, day);
        return year === d.getFullYear() && month === d.getMonth() && day === d.getDate();
    },
    // 是否手机
    isMobile: function (x) { return _isMobileReg.test(String(x)); },
    // 是否座机
    isTel: function (x) { return _isTelReg.test(String(x)); },
    // url
    isUrl: function (x) { return _urlCheck(String(x)); }
};
var _errMsg = {
    required: '不能为空',
    isNumber: '只能是数字',
    isAlphabet: '只能是字母',
    onlyDigitAndAlpha: '只能是字母和数字',
    minlength: function (len) { return ("\u6700\u5C0F " + len + " \u4F4D\u5B57\u7B26"); },
    minChrLen: function (len) { return ("\u6700\u5C0F " + len + " \u4E2A\u4E2D\u6587 \u6216  " + Number(len) * 2 + " \u4E2A\u82F1\u6587"); },
    maxChrLen: function (len) { return ("\u6700\u591A " + len + " \u4E2A\u4E2D\u6587 \u6216  " + Number(len) * 2 + " \u4E2A\u82F1\u6587"); },
    maxlength: function (len) { return ("\u6700\u591A " + len + " \u4F4D\u5B57\u7B26"); },
    min: function (min) { return ("\u6570\u503C\u8981\u5927\u4E8E " + min); },
    max: function (max) { return ("\u6570\u503C\u8981\u5C0F\u4E8E " + max); },
    equals: '两次输入的值不相符',
    isEmail: '邮箱格式不正确',
    isInteger: '数值必须是整数',
    isDate: '日期格式不正确',
    isMobile: '手机格式不正确',
    isTel: '座机格式不正确'
};
// 解释验证规则
function parseValidator($el, rules, $form) {
    if (rules === void 0) { rules = []; }
    var name = $el.attr('name');
    if (!name)
        return;
    var validatorAttr = $el.attr('validator').trim();
    if (!validatorAttr)
        return;
    mcore3_1.util.each(validatorAttr.split('|'), function (v) {
        var diyErr;
        var err;
        var ix = String(v).indexOf(' err:');
        if (ix != -1) {
            var eT = v.split(' err:');
            v = eT[0];
            diyErr = eT[1];
        }
        var args = $.grep(v.split(' '), function (s) {
            return $.trim(s).length > 0;
        });
        var ruleType = args[0];
        var checkRule = _rule[ruleType];
        if (!checkRule) {
            console.log("validator rule: #{ruleType} undefined");
            return;
        }
        if (diyErr) {
            err = diyErr;
        }
        else {
            if ($.isFunction(_errMsg[ruleType])) {
                var msgArgs = args.slice(0);
                msgArgs.splice(0, 1);
                err = _errMsg[ruleType].apply($el[0], msgArgs);
            }
            else {
                err = _errMsg[ruleType] || 'error';
            }
        }
        args[0] = $el;
        if (ruleType == 'equals')
            args[1] = $form.find(args[1]).eq(0);
        rules.push({
            name: name,
            type: ruleType,
            rule: checkRule,
            args: args,
            err: err
        });
    });
}
// 取规则
function getRules($form) {
    var rules = [];
    $form.find('[validator]').each(function () {
        parseValidator($(this), rules, $form);
    });
    return rules;
}
// 取对应name的值
function getNameValue(data, name, $el) {
    name = String(name);
    if (-1 == name.indexOf('[')) {
        return data[name] || '';
    }
    return $el.val().trim();
}
mcore3_1.Template.binders['validator'] = mcore3_1.Template.binders['validated'] = {
    update: function (el, value) {
        if (el.tagName.toLowerCase() == 'form') {
            el.setAttribute('novalidate', 'novalidate');
            return;
        }
        el.setAttribute('validator', value);
    },
    init: function (el, value) {
        if (el.tagName.toLowerCase() != 'form' || !el._element) {
            return el.setAttribute('validator', value);
        }
        var callback = mcore3_1.Template.strToFun(el, value) || function () { };
        var proxyEnv = mcore3_1.Template.getEnv(el);
        var $form = $(el);
        // 禁用 html5 验证
        el.setAttribute('novalidate', 'novalidate');
        function validatorForm(callback) {
            if (callback === void 0) { callback = function (err, data) { }; }
            var rules = getRules($form);
            var data = $form.serializeObject();
            var err = null;
            $.each(rules, function (k, v) {
                var $el = v.args[0];
                var _value = getNameValue(data, v.name, $el);
                if (v.type != 'required' && (_value == '' || _value == undefined))
                    return;
                var value = {
                    toString: function () { return String(_value); },
                    toNumber: function () { return Number(_value); },
                    $el: $el,
                    $form: $form
                };
                v.args[0] = value;
                var checkRes = v.rule.apply(null, v.args);
                if (false === checkRes) {
                    err = {
                        $el: $el,
                        err: v.err,
                        $form: $form
                    };
                    return false;
                }
                if (checkRes.type && checkRes.type === 'formatter') {
                    $el.val(checkRes.val);
                    data[v.name] = checkRes.val;
                }
            });
            return callback(err, data);
        }
        // 注入上下文
        if (proxyEnv && !proxyEnv[value + 'Check']) {
            proxyEnv[value + 'Check'] = function () {
                return new Promise(function (resolve, reject) {
                    validatorForm(function (err, data) {
                        if (err)
                            return reject(err);
                        resolve(data);
                    });
                });
            };
        }
        $form.off('submit.mc-binder-validator').on('submit.mc-binder-validator', function () {
            try {
                validatorForm(callback);
            }
            catch (err) {
                console.error(err.stack);
            }
            return false;
        });
    }
};
function add(x, fun, errMsg) {
    if (errMsg === void 0) { errMsg = ''; }
    _rule[x] = fun;
    if (errMsg)
        _errMsg[x] = errMsg;
}
exports.add = add;
function addErrMsg(type, msg) {
    _errMsg[type] = msg;
}
exports.addErrMsg = addErrMsg;
function check() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    if (args.length < 2)
        return false;
    var type = args[0];
    args.splice(0, 1);
    if (!_rule[type])
        return false;
    return _rule[type].apply(null, args);
}
exports.check = check;
