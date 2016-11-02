/// <reference path="../declaration/compiler-webpack-plugin.d.ts" />
/// <reference path="../declaration/webpack-node-externals.d.ts" />
/**
 * test util tool
 * @author vfasky<vfasky@gmail.com>
 *
 **/
'use strict';
require('jsdom-global/register');
require('source-map-support/register');
var chai_1 = require('chai');
var $ = require('jquery');
var glob = require('glob');
var path = require('path');
var webpack = require('webpack');
var CompilerPlugin = require('compiler-webpack-plugin');
var nodeExternals = require('webpack-node-externals');
var Mocha = require('mocha');
var testApp;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    $: $,
    initApp: initApp,
    expect: chai_1.expect,
    getEmpty$Div: getEmpty$Div,
    setup: setup,
    onRender: onRender
};
function onRender(component, done, time) {
    var _this = this;
    if (time === void 0) { time = 0; }
    component.off('rendered');
    setTimeout(function () {
        component.on('rendered', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            done.apply(_this, args);
            component.off('rendered');
        });
    }, time);
}
function setup(config) {
    var testFiles = [];
    config.testFiles.forEach(function (file) {
        testFiles = testFiles.concat(glob.sync(file));
    });
    var webpackConfig = {
        entry: {
            test: testFiles
        },
        output: {
            path: config.output,
            filename: 'test.js'
        },
        target: 'node',
        externals: [nodeExternals()],
        module: {
            loaders: [{
                    test: /\.tpl$/,
                    loader: path.resolve(__dirname, '../node_modules/mcore3/dist/h2svd-loader.js')
                }, {
                    test: /jquery[!mcore]/,
                    loader: 'expose?$!expose?jQuery'
                }]
        },
        devtool: '',
        plugins: [
            new CompilerPlugin('done', function () {
                var mocha = new Mocha({
                    ui: 'bdd'
                });
                mocha.addFile(path.join(config.output, 'test.js'));
                mocha.run();
            })
        ]
    };
    var compiler = webpack(webpackConfig);
    compiler.run(function (err, stats) {
        if (err)
            console.log(err);
    });
}
function getApp() {
    return testApp;
}
function initApp(TestApp, done) {
    testApp = new TestApp(getEmpty$Div());
    return testApp;
}
function getEmpty$Div() {
    return $('<div></div>');
}
