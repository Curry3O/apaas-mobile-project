/*
 * @Author: your name
 * @Date: 2022-01-27 18:28:22
 * @LastEditTime: 2022-01-28 21:33:19
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/common/store/add-coordinate.store.js
 */

export const SET_COORDINATE_MODEL = 'SET_COORDINATE_MODEL'
export const CLEAR_COORDINATE_MODEL = 'CLEAR_COORDINATE_MODEL'

export const addCoordinateStore = {
  namespaced: true,
  state: {
    coordinateModel: {
      coordinateMatter: '',
      coordinateDepartment: null,
      coordinateDepartmentId: null,
      expectCompleteTime: null,
      coordinatePeople: null,
      coordinatePeopleId: null,
      pkId: null
    }
  },
  mutations: {
    [SET_COORDINATE_MODEL](state, coordinateModel) {
      state.coordinateModel = coordinateModel
    },
    [CLEAR_COORDINATE_MODEL](state) {
      state.coordinateModel = {
        coordinateMatter: '',
        coordinateDepartment: null,
        coordinateDepartmentId: null,
        expectCompleteTime: null,
        coordinatePeople: null,
        coordinatePeopleId: null,
        pkId: null
      }
    }
  },
  actions: {},
  getters: {}
}
