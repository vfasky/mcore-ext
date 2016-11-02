/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * test popover
	 * @author vfasky<vfasky@gmail.com>
	 *
	 **/
	'use strict';
	var index_1 = __webpack_require__(2);
	var popover_1 = __webpack_require__(13);
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
	            $popover = index_1.default.$(popover.el).find('.mc-popover');
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {/// <reference path="../declaration/compiler-webpack-plugin.d.ts" />
	/// <reference path="../declaration/webpack-node-externals.d.ts" />
	/**
	 * test util tool
	 * @author vfasky<vfasky@gmail.com>
	 *
	 **/
	'use strict';
	__webpack_require__(3);
	__webpack_require__(4);
	var chai_1 = __webpack_require__(5);
	var $ = __webpack_require__(6);
	var glob = __webpack_require__(7);
	var path = __webpack_require__(8);
	var webpack = __webpack_require__(9);
	var CompilerPlugin = __webpack_require__(10);
	var nodeExternals = __webpack_require__(11);
	var Mocha = __webpack_require__(12);
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

	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("jsdom-global/register");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("source-map-support/register");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("chai");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("jquery");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("glob");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("webpack");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("compiler-webpack-plugin");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("webpack-node-externals");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("mocha");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../declaration/require.d.ts" />
	/**
	 * 表单错误提醒
	 * @author vfasky<vfasky@gmail.com>
	 *
	 **/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var $ = __webpack_require__(6);
	var mcore3_1 = __webpack_require__(14);
	var $DOC = $(document);
	var Popover = (function (_super) {
	    __extends(Popover, _super);
	    function Popover() {
	        _super.apply(this, arguments);
	        this.showTime = 3000;
	        this.hideTimeId = null;
	    }
	    Popover.prototype.getOffset = function () {
	        var $el = this.$curEl;
	        var offset = $el.offset() || { top: 0, left: 0 };
	        var elHeight = $el.outerHeight() || 20;
	        var className = 'mc-popover-top';
	        offset.top = offset.top - document.body.scrollTop;
	        if (offset.top > $DOC.height() * 0.8) {
	            offset.top -= elHeight;
	        }
	        else {
	            offset.top += elHeight;
	            className = 'mc-popover-bottom';
	        }
	        return {
	            className: className,
	            offset: offset
	        };
	    };
	    /**
	     * 隐藏
	     */
	    Popover.prototype.hideError = function () {
	        $DOC.off('scroll.mc-ui-popover');
	        this.scope.className = '';
	    };
	    Popover.prototype.showError = function (errData) {
	        var _this = this;
	        this.errData = errData;
	        var $el = this.errData.$el.data('proxyEl') || this.errData.$el;
	        $el.off('focus.mc-ui-popover').focus().on('focus.mc-ui-popover', function () {
	            $el.removeClass('error');
	            _this.hideError();
	        });
	        $el.addClass('error');
	        this.$curEl = $el;
	        var offsetData = this.getOffset();
	        if (this.hideTimeId)
	            clearTimeout(this.hideTimeId);
	        this.render(__webpack_require__(15), {
	            err: this.errData.err,
	            className: offsetData.className + ' active '
	        }).then(function () {
	            _this.$refs.css(offsetData.offset);
	            _this.hideTimeId = setTimeout(function () {
	                _this.hideError();
	            }, _this.showTime);
	            $DOC.off('scroll.mc-ui-popover').on('scroll.mc-ui-popover', function () {
	                if (!_this.scope.className)
	                    return;
	                var offsetData = _this.getOffset();
	                _this.scope.className = offsetData.className + ' active ';
	                _this.$refs.css(offsetData.offset);
	            });
	        });
	    };
	    return Popover;
	}(mcore3_1.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Popover;


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("mcore3");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function(scope, __mc__view, __mc__mcore) { // index
	    var __mc__util = {
	        clone: __mc__mcore.util.clone,
	        build: function(tagName, key, attr, dynamicAttr, events, children) {
	            return new __mc__mcore.Element(tagName, key, attr, dynamicAttr, children, events, __mc__view)
	        },
	        parseDynamicVal: function(dynamicCode, dynamicCodeStr) {
	            return __mc__mcore.util.parseDynamicVal(dynamicCode, dynamicCodeStr, __mc__view)
	        },
	        callFormatter: function(formatterName) {
	            return __mc__mcore.util.callFormatter(formatterName, __mc__mcore)
	        }
	    }
	    var __mc__tree = [];


	    (function(scope, __mc__tree, __mc_path) {
	        // parseDomDef

	        // ![mc-for]
	        var __mc__forArr = [0]

	        // buildArray
	        __mc__forArr.forEach(function(__mc__$vn_, __mc__i) {

	            var __mc__children

	            // parseAttr
	            var __mc__attr = {},
	                __mc__dynamicAttr = {},
	                __mc__event = {}

	            __mc__dynamicAttr['class'] = __mc__util.parseDynamicVal(('mc-popover ' + scope.className), '\'mc-popover \' + scope.className')


	            // build
	            __mc__children = []

	            var __mc__pathSubI = String(__mc_path + '.' + (__mc__tree.length));

	            (function(scope, __mc__tree, __mc_path) {
	                // parseDomDef

	                // ![mc-for]
	                var __mc__forArr = [0]

	                // buildArray
	                __mc__forArr.forEach(function(__mc__$vn_, __mc__i) {

	                    var __mc__children

	                    // parseAttr
	                    var __mc__attr = {},
	                        __mc__dynamicAttr = {},
	                        __mc__event = {}

	                    __mc__attr['class'] = 'mc-popover-inner'


	                    // build
	                    __mc__children = []

	                    var __mc__pathSubI = String(__mc_path + '.' + (__mc__tree.length));

	                    (function(scope, __mc__tree, __mc_path) {
	                        // parseDomDef

	                        // parseText
	                        var __mc__pathStaticI = __mc_path + '.' + __mc__tree.length
	                        var __mc__strVal = {} // parseFormatters
	                        var __mc__tmpAttr;
	                        try {
	                            __mc__tmpAttr = scope.err
	                        } catch (err) {
	                            console.error(err.stack)
	                        }

	                        __mc__strVal['rp_0'] = (function(x) {

	                            return x == undefined ? '' : x
	                        })(__mc__tmpAttr);

	                        /* [formatter] {scope.err} */
	                        var __mc__str = "" + __mc__strVal['rp_0'] + "";
	                        var __mc__dynamicAttr = {
	                            text: __mc__str
	                        };
	                        __mc__tree.push(__mc__util.build(
	                            '_textNode', __mc__pathStaticI, {},
	                            __mc__dynamicAttr, {}, []
	                        ));

	                    })(scope, __mc__children, __mc__pathSubI);

	                    __mc__tree.push(
	                        __mc__util.build(
	                            'div', __mc__pathSubI, __mc__attr,
	                            __mc__dynamicAttr, __mc__event, __mc__children
	                        )
	                    )


	                })



	            })(scope, __mc__children, __mc__pathSubI);

	            (function(scope, __mc__tree, __mc_path) {
	                // parseDomDef

	                // ![mc-for]
	                var __mc__forArr = [0]

	                // buildArray
	                __mc__forArr.forEach(function(__mc__$vn_, __mc__i) {

	                    var __mc__children

	                    // parseAttr
	                    var __mc__attr = {},
	                        __mc__dynamicAttr = {},
	                        __mc__event = {}

	                    __mc__attr['class'] = 'mc-popover-caret'


	                    // build
	                    __mc__children = []

	                    var __mc__pathSubI = String(__mc_path + '.' + (__mc__tree.length));

	                    __mc__tree.push(
	                        __mc__util.build(
	                            'div', __mc__pathSubI, __mc__attr,
	                            __mc__dynamicAttr, __mc__event, __mc__children
	                        )
	                    )


	                })



	            })(scope, __mc__children, __mc__pathSubI);

	            __mc__tree.push(
	                __mc__util.build(
	                    'div', __mc__pathSubI, __mc__attr,
	                    __mc__dynamicAttr, __mc__event, __mc__children
	                )
	            )


	        })



	    })(scope, __mc__tree, '0');


	    return __mc__tree
	}

/***/ }
/******/ ]);