/**
 * test popover
 * @author vfasky<vfasky@gmail.com>
 *
 **/
'use strict';
var index_1 = require("../../testUtil/index");
var popover_1 = require("./popover");
var popover;
var $popover;
describe('test ui popover', function () {
    it('new popover', function () {
        popover = new popover_1.default(index_1.default.$('<div/>')[0]);
    });
    it('show error', function (done) {
        popover.showError({
            $el: index_1.default.$('<input />'),
            err: 'err msg'
        });
        index_1.default.onRender(popover, function () {
            $popover = index_1.default.$(popover.el).find('.mc-ui-popover');
            index_1.default.expect($popover.find('.mc-popover-inner').text().trim()).to.equal('err msg');
            index_1.default.expect($popover.is('.active')).to.equal(true);
            done();
        });
    });
    it('hide error', function (done) {
        popover.hideError();
        index_1.default.onRender(popover, function () {
            index_1.default.expect($popover.is('.active')).to.equal(false);
            done();
        });
    });
});
