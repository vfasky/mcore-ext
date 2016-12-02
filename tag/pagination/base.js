/**
 * pagination base
 * @author vfasky<vfasky@gmail.com>
 *
 **/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mcore3_1 = require("mcore3");
var PaginationBase = (function (_super) {
    __extends(PaginationBase, _super);
    function PaginationBase() {
        return _super.apply(this, arguments) || this;
    }
    PaginationBase.prototype.buildPage = function (pageInfo) {
        if (pageInfo === void 0) { pageInfo = {}; }
        pageInfo = {
            currentPage: parseInt(pageInfo.currentPage || 1),
            totalPage: parseInt(pageInfo.totalPage || 1),
            maxPage: parseInt(pageInfo.maxPage || 10) // display max page item total
        };
        this.scope.prevPage = pageInfo.currentPage - 1;
        this.scope.nextPage = pageInfo.currentPage + 1;
        var pages = [];
        // 小于等于最大显示页数
        if (pageInfo.totalPage <= pageInfo.maxPage) {
            for (var v = 1; v <= pageInfo.totalPage; v++) {
                pages.push({
                    cur: v == pageInfo.currentPage,
                    page: v
                });
            }
        }
        else {
            pages.push({
                cur: 1 == pageInfo.currentPage,
                page: 1
            });
            // 插入过渡
            if (pageInfo.currentPage > (pageInfo.maxPage / 2 + 1)) {
                pages.push({
                    cur: false,
                    page: false
                });
            }
            var step = (pageInfo.maxPage / 2) - 1;
            var start = pageInfo.currentPage - step;
            var end = pageInfo.currentPage + step;
            if (start < 2) {
                start = 2;
            }
            if (end > pageInfo.totalPage - 1) {
                end = pageInfo.totalPage - 1;
            }
            if (end < pageInfo.maxPage - 1) {
                end = pageInfo.maxPage - 1;
            }
            if ((end - start) <= step) {
                start = start - (step - (pageInfo.totalPage - end));
            }
            for (var v = start; v <= end; v++) {
                pages.push({
                    cur: v == pageInfo.currentPage,
                    page: v
                });
            }
            // 插入过渡
            if (pageInfo.currentPage < pageInfo.totalPage - (pageInfo.maxPage / 2)) {
                pages.push({
                    cur: false,
                    page: false
                });
            }
            pages.push({
                cur: pageInfo.totalPage == pageInfo.currentPage,
                page: pageInfo.totalPage
            });
        }
        this.scope.pages = pages;
        this.scope.pageInfo = pageInfo;
    };
    PaginationBase.prototype.watch = function () {
        var _this = this;
        this.on('update:page-info', function (pageInfo) {
            _this.buildPage(pageInfo);
        });
    };
    return PaginationBase;
}(mcore3_1.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PaginationBase;
