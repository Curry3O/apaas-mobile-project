/*
 * @Author: your name
 * @Date: 2021-12-24 15:52:05
 * @LastEditTime: 2021-12-25 15:09:06
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\common\store\pro-member.store.js
 */
import TypeUtil from '@/util/type.util'

export const SET_MEMBER_MODEL = 'SET_MEMBER_MODEL'
export const CLEAR_MEMBER_MODEL = 'CLEAR_MEMBER_MODEL'

export const addMemberStore = {
  namespaced: true,
  state: {
    memberModel: {
      userName: null,
      userId: null,
      roleName: null,
      roleId: null
    }
  },
  mutations: {
    [SET_MEMBER_MODEL](state, memberModel) {
      if (TypeUtil.isObject(memberModel)) {
        state.memberModel = memberModel
      }
    },
    [CLEAR_MEMBER_MODEL](state) {
      state.memberModel = {
        userName: null,
        userId: null,
        roleName: null,
        roleId: null
      }
    }
  },
  actions: {},
  getters: {}
}
