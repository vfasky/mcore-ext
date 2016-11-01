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
'use strict'

import './popover.scss'
import Popover from './popover'
export default Popover