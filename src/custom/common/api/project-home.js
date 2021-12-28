/*
 * @Author: your name
 * @Date: 2021-12-21 16:56:23
 * @LastEditTime: 2021-12-27 14:38:58
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\common\api\project-home.js
 */
export default {
  GET_FINANCE_INDEX_DETAIL: {
    // 项目财务指标
    url: '/custom/financeIndex/getFinanceIndexDetail',
    method: 'get',
    disableSuccessMsg: true
  },
  GET_PROJECT_FINANCE_LIST_APP: {
    // 查询项目周报报表
    url: '/custom/project/getProjectFinanceListApp',
    method: 'get',
    disableSuccessMsg: true
  },
  GET_WEEKLY_SEARCH_HISTORY: {
    // 搜索历史列表
    url: '/custom/weeklyPro/getWeeklySearchHistory',
    method: 'post',
    disableSuccessMsg: true
  },
  EMPTY_WEEKLY_SEARCH_HISTORY: {
    // 搜索历史清空
    url: '/custom/weeklyPro/emptyWeeklySearchHistory',
    method: 'post',
    disableSuccessMsg: true
  },
  QUERY_PMS_PROJECT_MEMBER: {
    // 查询项目成员接口
    url: '/custom/financeIndex/queryPmsProjectMember',
    method: 'post',
    disableSuccessMsg: true
  },
  SAVE_PROJECT_MEMBER_APP: {
    // 新增项目成员接口
    url: '/custom/financeIndex/saveProjectMemberApp',
    method: 'post',
    disableSuccessMsg: true
  },
  UPDATE_PMS_PROJECT_MEMBER_APP_STATE: {
    // 修改项目成员接口
    url: '/custom/financeIndex/updatePmsProjectMemberAppState',
    method: 'post',
    disableSuccessMsg: true
  },
  GET_USER_LIST: {
    // 选择全部人员接口
    url: '/xdap-app/user/select/queryAllUsers',
    method: 'post',
    disableSuccessMsg: true
  },
  GET_WEEKLY_LOOKUP_VALUE: {
    // 角色列表选择列表接口
    url: '/custom/weeklyPro/getWeeklyLookupValue',
    method: 'post',
    disableSuccessMsg: true
  }
}
