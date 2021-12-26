/*
 * @Author: your name
 * @Date: 2021-12-25 17:49:38
 * @LastEditTime: 2021-12-25 23:11:12
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\common\store\project-home.store.js
 */
import TypeUtil from '@/util/type.util'

export const SET_FINANCE_MODEL = 'SET_FINANCE_MODEL'
export const CLEAR_FINANCE_MODEL = 'CLEAR_FINANCE_MODEL'
export const SET_SELECTED_DATA = 'SET_SELECTED_DATA'
export const CLEAR_SELECTED_DATA = 'CLEAR_SELECTED_DATA'
export const SET_REFRESH = 'SET_REFRESH'

export const projectHomeStore = {
  namespaced: true,
  state: {
    financeModel: {
      indexVo: {}, // 项目财务指标主体信息
      grossMarginVo: {}, // 实际毛利率偏差折线图
      fourPiecesVo: {}, // 卡片里面的内容
      costVoList: [], // 成本列表
      incomeVoList: [], // 收入列表
      returnVoList: [] // 回款列表
    },
    selectedData: {
      projectName: null,
      pmsProjectCode: null
    }, // 选中的项目
    refresh: true // 是否需要刷新
  },
  mutations: {
    [SET_FINANCE_MODEL](state, financeModel) {
      if (TypeUtil.isObject(financeModel)) {
        state.financeModel = financeModel
      }
    },
    [CLEAR_FINANCE_MODEL](state) {
      state.financeModel = {
        indexVo: {},
        grossMarginVo: {},
        fourPiecesVo: {},
        costVoList: [],
        incomeVoList: [],
        returnVoList: []
      }
    },
    [SET_SELECTED_DATA](state, selectedData) {
      if (TypeUtil.isObject(selectedData)) {
        state.selectedData = selectedData
      }
    },
    [CLEAR_SELECTED_DATA](state) {
      state.selectedData = {
        projectName: null,
        pmsProjectCode: null
      }
    },
    [SET_REFRESH](state, refresh) {
      state.refresh = refresh
    }
  },
  actions: {},
  getters: {}
}
