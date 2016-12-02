/**
 * test
 * @author vfasky<vfasky@gmail.com>
 *
 **/
'use strict';
var testUtil_1 = require("./testUtil");
var path = require("path");
testUtil_1.default.setup({
    testFiles: [
        './ui/**/test.js',
        './tag/**/test.js',
        './binder/**/test.js',
    ],
    output: path.join(__dirname, 'test')
});
