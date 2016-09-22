###*
 * 表单错误提醒
 * @module mcoreExtUiPopover
 * @author vfasky <vfasky@gmail.com>
###
'use strict'

$ = require 'jquery'
$doc = $ document

module.exports = (mcore)->
    {Component} = mcore

    class Popover extends Component

        init: ->
            @showTime = 3000
            @hideTimeId = null

        watch: ->

        getOffset: ->
            $el = @.$curEl
            # 定位
            offset = $el.offset()
            offset.top = offset.top - document.body.scrollTop
            elHeight = $el.outerHeight()

            className = 'mc-popover-top'
            if offset.top > $doc.height() * 0.8
                offset.top -= (elHeight or 20)
            else
                offset.top += (elHeight or 20)
                className = 'mc-popover-bottom'

            data =
                className: className
                offset: offset


        showError: (@errData)->
            $el = @errData.$el.data('proxyEl') or @errData.$el

            $el.off('focus.popover').focus().on 'focus.popover', =>
                $el.removeClass 'error'
                @hideError()

            # add .error class
            $el.addClass 'error'

            @.$curEl = $el

            offsetData = @getOffset()

            clearTimeout @hideTimeId if @hideTimeId

            @render require('./tpl/popover.tpl'),
                err: @errData.err
                className: offsetData.className + ' active '
            , =>
                @.$el = $ @refs if !@.$el
                @.$el.css offsetData.offset

                @hideTimeId = setTimeout =>
                    @hideError()
                , @showTime

                $doc.off('scroll.popover').on 'scroll.popover', =>
                    return if !@scope.className
                    offsetData = @getOffset()
                    @scope.className = offsetData.className + ' active '
                    @.$el.css offsetData.offset



        hideError: ->
            $doc.off 'scroll.popover'
            @scope.className = ''



    Popover
