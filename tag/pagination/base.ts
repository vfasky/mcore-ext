/**
 * pagination base
 * @author vfasky<vfasky@gmail.com>
 *
 **/
'use strict'
import * as mcore from 'mcore3'

export default class PaginationBase extends mcore.Component{

    buildPage(pageInfo: any = {}) {
        pageInfo = {
            currentPage: parseInt(pageInfo.currentPage || 1),
            totalPage: parseInt(pageInfo.totalPage || 1),
            maxPage: parseInt(pageInfo.maxPage || 10) // display max page item total
        }

        this.scope.prevPage = pageInfo.currentPage - 1
        this.scope.nextPage = pageInfo.currentPage + 1

        let pages = []

        // 小于等于最大显示页数
        if (pageInfo.totalPage <= pageInfo.maxPage) {
            for (let v = 1; v <= pageInfo.totalPage; v++) {
                pages.push({
                    cur: v == pageInfo.currentPage,
                    page: v
                })
            }
        } else {
            pages.push({
                cur: 1 == pageInfo.currentPage,
                page: 1
            })

            // 插入过渡
            if (pageInfo.currentPage > (pageInfo.maxPage / 2 + 1)) {
                pages.push({
                    cur: false,
                    page: false
                })
            }

            let step = (pageInfo.maxPage / 2) - 1
            let start = pageInfo.currentPage - step
            let end = pageInfo.currentPage + step

            if (start < 2) {
                start = 2
            }
            if (end > pageInfo.totalPage - 1) {
                end = pageInfo.totalPage - 1
            }
            if (end < pageInfo.maxPage - 1) {
                end = pageInfo.maxPage - 1
            }

            if (pageInfo.totalPage - pageInfo.currentPage < step) {
                start = pageInfo.totalPage - (pageInfo.maxPage - 2)
            }

            for (let v = start, j = end; v <= j; v++) {
                pages.push({
                    cur: v == pageInfo.currentPage,
                    page: v
                })
            }

            // 插入过渡
            if (pageInfo.currentPage < pageInfo.totalPage - (pageInfo.maxPage / 2)) {
                pages.push({
                    cur: false,
                    page: false
                })
            }

            pages.push({
                cur: pageInfo.totalPage == pageInfo.currentPage,
                page: pageInfo.totalPage
            })
        }

        this.scope.pages = pages
        this.scope.pageInfo = pageInfo
    }

    watch() {
        this.on('update:page-info', (pageInfo) => {
            this.buildPage(pageInfo)
        })
    }
}
