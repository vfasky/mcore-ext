/**
 * test popover
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'

import testUtil from '../../testUtil/index'
import Popover from './popover'

let popover
let $popover

describe('test ui popover', () => {

    it('new popover', () => {
        popover = new Popover(testUtil.$('<div/>')[0])
    })

    it('show error', (done) => {
        popover.showError({
            $el: testUtil.$('<input />'),
            err: 'err msg'
        })

        testUtil.onRender(popover, () => {
            $popover = testUtil.$(popover.el).find('.mc-popover')

            testUtil.expect(
                $popover.find('.mc-popover-inner').text().trim()
            ).to.equal('err msg')

            testUtil.expect(
                $popover.is('.active')
            ).to.equal(true)

            done()
        })
        
    })

    it('hide error', (done) => {
        popover.hideError()

        testUtil.onRender(popover, () => {
            testUtil.expect(
                $popover.is('.active')
            ).to.equal(false)
            done() 
        })
    })
})