/// <reference path="../../declaration/require.d.ts" />
/**
 * 表单错误显示
 * @author vfasky<vfasky@gmail.com>
 *
 **/
'use strict';
var tslib_1 = require("tslib");
var $ = require("jquery");
var mcore = require("mcore3");
var $DOC = $(document);
/**
 * @example
 * 表单错误显示
 * > 通常用于显示 `mcore-ext/binder/validator` 错误信息
 *
 * ```ts
 * import Popover from 'mcore-ext/ui/popover'
 * let popover = new Popover(document.body)
 *
 * popover.showError({
 *     $el: $('input'),
 *     err: 'err msg'
 * })
 * ```
 **/
var Popover = (function (_super) {
    tslib_1.__extends(Popover, _super);
    function Popover() {
        var _this = _super.apply(this, arguments) || this;
        _this.showTime = 3000;
        _this.hideTimeId = null;
        return _this;
    }
    Popover.prototype.getOffset = function () {
        var $el = this.$curEl;
        var offset = $el.offset() || { top: 0, left: 0 };
        var elHeight = $el.outerHeight() || 20;
        var className = 'mc-popover-top';
        offset.top = offset.top - document.body.scrollTop;
        if (offset.top > $DOC.height() * 0.8) {
            offset.top -= elHeight;
        }
        else {
            offset.top += elHeight;
            className = 'mc-popover-bottom';
        }
        return {
            className: className,
            offset: offset
        };
    };
    /**
     * 隐藏
     */
    Popover.prototype.hideError = function () {
        $DOC.off('scroll.mc-ui-popover');
        this.scope.className = '';
    };
    Popover.prototype.showError = function (errData) {
        var _this = this;
        this.errData = errData;
        var $el = this.errData.$el.data('proxyEl') || this.errData.$el;
        $el.off('focus.mc-ui-popover').focus().on('focus.mc-ui-popover', function () {
            $el.removeClass('error');
            _this.hideError();
        });
        $el.addClass('error');
        this.$curEl = $el;
        var offsetData = this.getOffset();
        if (this.hideTimeId)
            clearTimeout(this.hideTimeId);
        this.render(require('./popover.tpl'), {
            err: this.errData.err,
            className: offsetData.className + ' active '
        }).then(function () {
            _this.$refs.css(offsetData.offset);
            _this.hideTimeId = setTimeout(function () {
                _this.hideError();
            }, _this.showTime);
            $DOC.off('scroll.mc-ui-popover').on('scroll.mc-ui-popover', function () {
                if (!_this.scope.className)
                    return;
                var offsetData = _this.getOffset();
                _this.scope.className = offsetData.className + ' active ';
                _this.$refs.css(offsetData.offset);
            });
        });
    };
    return Popover;
}(mcore.Component));
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @example
 * 表单错误显示
 * > 通常用于显示 `mcore-ext/binder/validator` 错误信息
 *
 * ```ts
 * import Popover from 'mcore-ext/ui/popover'
 * let popover = new Popover(document.body)
 *
 * popover.showError({
 *     $el: $('input'),
 *     err: 'err msg'
 * })
 * ```
 **/
exports.default = Popover;
