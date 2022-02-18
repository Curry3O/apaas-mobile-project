/*
 * @Author: your name
 * @Date: 2022-02-11 12:19:46
 * @LastEditTime: 2022-02-18 14:53:50
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/common/store/add-check-item.store.js
 */
export const SET_CHECK_ITEM_MODEL = 'SET_CHECK_ITEM_MODEL'
export const CLEAR_CHECK_ITEM_MODEL = 'CLEAR_CHECK_ITEM_MODEL'
export const SET_WEEKLY_INSPECT = 'SET_WEEKLY_INSPECT'
export const SET_CHECK_ALL_DATA = 'SET_CHECK_ALL_DATA'
export const SET_CHECK_LIST_DATA = 'SET_CHECK_LIST_DATA'
export const SET_CHECK_LIST_ALL_DATA = 'SET_CHECK_LIST_ALL_DATA'

export const addCheckItemStore = {
  namespaced: true,
  state: {
    checkItemModel: {
      personInChargeName: null,
      personInCharge: null,
      scheduledStartTime: null,
      estimatedMpletionTime: null,
      problem: ''
    },
    weeklyInspect: {},
    checkAllData: {},
    checkListData: [],
    checkListAllData: []
  },
  mutations: {
    [SET_CHECK_ITEM_MODEL](state, checkItemModel) {
      state.checkItemModel = checkItemModel
    },
    [CLEAR_CHECK_ITEM_MODEL](state) {
      state.checkItemModel = {
        personInChargeName: null,
        personInCharge: null,
        scheduledStartTime: null,
        estimatedMpletionTime: null,
        problem: ''
      }
    },
    [SET_WEEKLY_INSPECT](state, weeklyInspect) {
      state.weeklyInspect = weeklyInspect
    },
    [SET_CHECK_ALL_DATA](state, checkAllData) {
      state.checkAllData = checkAllData
    },
    [SET_CHECK_LIST_DATA](state, checkListData) {
      state.checkListData = checkListData
    },
    [SET_CHECK_LIST_ALL_DATA](state, checkListAllData) {
      state.checkListAllData = checkListAllData
    }
  },
  actions: {},
  getters: {}
}
