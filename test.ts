/**
 * test
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'

import testUtil from './testUtil'
import * as path from 'path'

testUtil.setup({
    testFiles: [
        './ui/**/test.js',
        './tag/**/test.js',
        './binder/**/test.js',
    ],
    output: path.join(__dirname, 'test')
})