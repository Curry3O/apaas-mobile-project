/*
 * @Author: your name
 * @Date: 2021-12-27 15:24:02
 * @LastEditTime: 2022-01-14 12:07:52
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\common\store\project-weekly.store.js
 */
// import TypeUtil from '@/util/type.util'

export const SET_SEARCH_PARAMS = 'SET_SEARCH_PARAMS'
export const SET_WEEKLY_MODEL = 'SET_WEEKLY_MODEL'
export const SET_WEEKLY_REFRESH = 'SET_WEEKLY_REFRESH'
export const INIT_WEEKLY = 'INIT_WEEKLY'

export const projectWeeklyStore = {
  namespaced: true,
  state: {
    searchParams: {}, // 周报首页搜索参数
    weeklyModel: {}, // 周报主体数据
    weeklyRefresh: true // 是否需要刷新
  },
  mutations: {
    [SET_SEARCH_PARAMS](state, searchParams) {
      state.searchParams = searchParams
    },
    [SET_WEEKLY_MODEL](state, weeklyModel) {
      state.weeklyModel = weeklyModel
    },
    [SET_WEEKLY_REFRESH](state, weeklyRefresh) {
      state.weeklyRefresh = weeklyRefresh
    },
    [INIT_WEEKLY](state) {
      state.searchParams = {}
      state.weeklyModel = {}
      state.weeklyRefresh = true
    }
  },
  actions: {},
  getters: {}
}
