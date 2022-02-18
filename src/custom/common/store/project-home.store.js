/*
 * @Author: your name
 * @Date: 2021-12-25 17:49:38
 * @LastEditTime: 2022-02-17 21:10:54
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\common\store\project-home.store.js
 */
import TypeUtil from '@/util/type.util'

export const SET_CAN_ADD = 'SET_CAN_ADD'
export const SET_FINANCE_MODEL = 'SET_FINANCE_MODEL'
export const SET_SELECTED_DATA = 'SET_SELECTED_DATA'
export const SET_HOME_REFRESH = 'SET_HOME_REFRESH'
export const INIT_FINANCE = 'INIT_FINANCE'

export const projectHomeStore = {
  namespaced: true,
  state: {
    canAdd: false, // 是否显示填写周报按钮
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
    homeRefresh: true // 是否需要刷新
  },
  mutations: {
    [SET_CAN_ADD](state, canAdd) {
      state.canAdd = canAdd
    },
    [SET_FINANCE_MODEL](state, financeModel) {
      if (TypeUtil.isObject(financeModel)) {
        state.financeModel = financeModel
      }
    },
    [SET_SELECTED_DATA](state, selectedData) {
      if (TypeUtil.isObject(selectedData)) {
        state.selectedData = selectedData
      }
    },
    [SET_HOME_REFRESH](state, homeRefresh) {
      state.homeRefresh = homeRefresh
    },
    [INIT_FINANCE](state) {
      state.canAdd = false(
        (state.financeModel = {
          indexVo: {},
          grossMarginVo: {},
          fourPiecesVo: {},
          costVoList: [],
          incomeVoList: [],
          returnVoList: []
        })
      )
      state.selectedData = {
        projectName: null,
        pmsProjectCode: null
      }
      state.homeRefresh = true
    }
  },
  actions: {},
  getters: {}
}
