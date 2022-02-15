/*
 * @Author: your name
 * @Date: 2022-02-07 13:46:00
 * @LastEditTime: 2022-02-07 14:54:20
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/common/store/add-action-item.store.js
 */

export const SET_ACTION_ITEM_MODEL = 'SET_ACTION_ITEM_MODEL'
export const CLEAR_ACTION_ITEM_MODEL = 'CLEAR_ACTION_ITEM_MODEL'
export const SET_ACTION_DATA = 'SET_ACTION_DATA'

export const addActionItemStore = {
  namespaced: true,
  state: {
    actionItemModel: {
      personInChargeName: null,
      personInCharge: null,
      plannedCompletionTime: null,
      title: '',
      content: '',
      pkId: null
    },
    actionTableData: []
  },
  mutations: {
    [SET_ACTION_ITEM_MODEL](state, actionItemModel) {
      state.actionItemModel = actionItemModel
    },
    [CLEAR_ACTION_ITEM_MODEL](state) {
      state.actionItemModel = {
        personInChargeName: null,
        personInCharge: null,
        plannedCompletionTime: null,
        title: '',
        content: '',
        pkId: null
      }
    },
    [SET_ACTION_DATA](state, actionTableData) {
      state.actionTableData = actionTableData
    }
  },
  actions: {},
  getters: {}
}
