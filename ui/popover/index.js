/**
 * error popover
 * @author vfasky<vfasky@gmail.com>
 * @example
 * ```js
 * import Popover from 'mcore-ext/ui/popover'
 * let popover = new Popover(document.body)
 * popover.showError({
 *     $el: $('input'),
 *     err: 'err msg'
 * })
 * ```
 **/
'use strict';
require('!style-loader!css-loader!sass-loader!./popover.scss');
var popover_1 = require('./popover');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = popover_1.default;
