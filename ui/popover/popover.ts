/// <reference path="../../declaration/require.d.ts" />

/**
 * 表单错误提醒
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'
import * as $ from 'jquery'
import { Component } from 'mcore3'

const $DOC = $(document)

interface ErrDataValue {
    $el: JQuery,
    err: string
}

export default class Popover extends Component {
    showTime = 3000
    hideTimeId = null
    /**
     * 当前绑定的 element
     */
    $curEl: JQuery
    /**
     * 数据传入格式
     */
    errData: ErrDataValue

    private getOffset() {
        let $el = this.$curEl
        let offset = $el.offset()
        let elHeight = $el.outerHeight() || 20
        let className = 'mc-popover-top'

        offset.top = offset.top - document.body.scrollTop

        if (offset.top > $DOC.height() * 0.8) {
            offset.top -= elHeight
        } else {
            offset.top += elHeight
            className = 'mc-popover-bottom'
        }

        return {
            className: className,
            offset: offset
        }
    }

    /**
     * 隐藏
     */
    hideError () {
        $DOC.off('scroll.mc-ui-popover')
        this.scope.className = ''
    }

    showError (errData: ErrDataValue) {
        this.errData = errData
        let $el = this.errData.$el.data('proxyEl') || this.errData.$el

        $el.off('focus.mc-ui-popover').focus().on('focus.mc-ui-popover', () => {
            $el.removeClass('error')
            this.hideError()
        })

        $el.addClass('error')

        this.$curEl = $el

        let offsetData = this.getOffset()

        if (this.hideTimeId) clearTimeout(this.hideTimeId)

        this.render(require('./popover.tpl'), {
            err: this.errData.err,
            className: offsetData.className + ' active '
        }).then(() => {
            this.$refs.css(offsetData.offset)            
            this.hideTimeId = setTimeout(() => {
                this.hideError()
            }, this.showTime)

            $DOC.off('scroll.mc-ui-popover').on('scroll.mc-ui-popover', () => {
                if (!this.scope.className) return
                let offsetData = this.getOffset()
                
                this.scope.className = offsetData.className + ' active '
                this.$refs.css(offsetData.offset)
            })
        })
    }

}
