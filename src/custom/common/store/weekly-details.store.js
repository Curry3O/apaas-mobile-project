/*
 * @Author: your name
 * @Date: 2022-01-28 16:21:26
 * @LastEditTime: 2022-02-15 11:27:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/common/store/weekly-details.store.js
 */

export const SET_SCROLL_TOP = 'SET_SCROLL_TOP'
export const SET_SD_CONFIG_FIELD = 'SET_SD_CONFIG_FIELD'
export const SET_SD_WEEKLYPO = 'SET_SD_WEEKLYPO'
export const SET_SD_COST_TYPE = 'SET_SD_COST_TYPE'
export const SET_SD_INCOME_TYPE = 'SET_SD_INCOME_TYPE'
export const SET_SD_TYPE_LIST = 'SET_SD_TYPE_LIST'
export const SET_SD_SITUATION = 'SET_SD_SITUATION'
export const SET_SD_COORDINATE = 'SET_SD_COORDINATE'
export const SET_SD_PROGRESS = 'SET_SD_PROGRESS'

export const weeklyDetailsStore = {
  namespaced: true,
  state: {
    $_scrollTop: 0, // 页面滚动条的滚动距离
    configField: {
      editMode: false, // 页面是否可编辑
      showDetail: true, // 是否显示详情模块
      checkFlag: false // 是否点击周报检查按钮
    }, // 配置字段
    sd_weeklypo: {}, // 主体信息
    sd_costTypePoList: [], // 成本类型列表
    sd_incomeTypePoList: [], // 收入类型列表
    sd_typePoList: [], // 类型列表
    sd_lwSituationPoList: [], // 上周情况列表
    sd_coordinate: [], // 协调事项
    sd_progressList: {} // 进度列表
  },
  mutations: {
    [SET_SCROLL_TOP](state, $_scrollTop) {
      state.$_scrollTop = $_scrollTop
    },
    [SET_SD_CONFIG_FIELD](state, configField) {
      state.configField = configField
    },
    [SET_SD_WEEKLYPO](state, sd_weeklypo) {
      state.sd_weeklypo = sd_weeklypo
    },
    [SET_SD_COST_TYPE](state, sd_costTypePoList) {
      state.sd_costTypePoList = sd_costTypePoList
    },
    [SET_SD_INCOME_TYPE](state, sd_incomeTypePoList) {
      state.sd_incomeTypePoList = sd_incomeTypePoList
    },
    [SET_SD_TYPE_LIST](state, sd_typePoList) {
      state.sd_typePoList = sd_typePoList
    },
    [SET_SD_SITUATION](state, sd_lwSituationPoList) {
      state.sd_lwSituationPoList = sd_lwSituationPoList
    },
    [SET_SD_COORDINATE](state, sd_coordinate) {
      state.sd_coordinate = sd_coordinate
    },
    [SET_SD_PROGRESS](state, sd_progressList) {
      state.sd_progressList = sd_progressList
    }
  },
  actions: {},
  getters: {}
}
