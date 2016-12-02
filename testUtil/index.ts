/// <reference path="../declaration/compiler-webpack-plugin.d.ts" />
/// <reference path="../declaration/webpack-node-externals.d.ts" />

/**
 * test util tool
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'

import 'jsdom-global/register'
import 'source-map-support/register'

import { expect } from 'chai'
import * as $ from 'jquery'
import * as glob from 'glob'
import * as path from 'path'
import * as webpack from 'webpack'
import * as CompilerPlugin from 'compiler-webpack-plugin'
import * as nodeExternals from 'webpack-node-externals'
import * as Mocha from 'mocha'

export var global: any;
let testApp

export default {
    $,
    initApp,
    expect,
    getEmpty$Div,
    setup,
    onRender
}

interface SetupConfig {
    output: string;
    testFiles: string[];
    webpackConfig?: any;
}

function onRender(component, done, time = 0){
    component.off('rendered')

    setTimeout(() => {
        component.on('rendered', (...args)=>{
            done.apply(this, args)
            component.off('rendered')
        })
    }, time)
}

function setup(config: SetupConfig) {
    let testFiles = []
    config.testFiles.forEach((file) => {
        testFiles = testFiles.concat(glob.sync(file))
    })
    let webpackConfig = Object.assign({
        entry: {
            test: testFiles
        },
        output: {
            path: config.output,
            filename: 'test.js'
        },
        target: 'node',
        externals: [nodeExternals()],
        resolve: {
            extensions: ['', '.es6', '.js', '.ts', '.coffee', '.scss'],
        },
        module: {
            loaders: [{
                test: /\.tpl$/,
                loader: path.resolve(__dirname, '../node_modules/mcore3/dist/h2svd-loader.js')
            },{
                test: /\.ts$/,
                loader: 'ts-loader'
            }, {
                test: /jquery[!mcore]/,
                loader: 'expose?$!expose?jQuery'
            }]
        },
        ts: {
            logLevel: 'error',
            silent: true,
            transpileOnly: true
        },
        devtool: '',
        plugins: [
            new CompilerPlugin('done', function(){
                let mocha = new Mocha({
                    ui: 'bdd'
                })
                mocha.addFile(path.join(config.output, 'test.js'))
                mocha.run()
            })
        ]
    }, config.webpackConfig || {} )
    
    let compiler = webpack(webpackConfig)
    compiler.run(function(err, stats) {
        if (err) console.log(err)
    })
}

function getApp() {
    return testApp
}

function initApp(TestApp, done) {
    testApp = new TestApp(getEmpty$Div())
    return testApp
}

function getEmpty$Div() {
    return $('<div></div>')
}