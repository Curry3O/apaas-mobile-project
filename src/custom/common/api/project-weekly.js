/*
 * @Author: your name
 * @Date: 2021-12-27 15:07:53
 * @LastEditTime: 2022-02-16 20:16:46
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\common\api\project-weekly.js
 */
export default {
  GET_PROJECT_WEEKLY_REPORT_PRO_APP: {
    // 周报列表查询接口
    url: '/custom/weeklyPro/getProjectWeeklyReportProApp',
    method: 'post',
    disableSuccessMsg: true
  },
  GET_WEEKLY_ACTION_LTEMS_COMPLETE_LIST: {
    // 查询已完成行动项列表
    url: '/custom/weeklyPro/weeklyPro/getWeeklyActionltemsCompleteList',
    method: 'post',
    disableSuccessMsg: true
  },
  GET_WEEKLY_ACTION_LTEMS_UNACCOMPLISHED_LIST: {
    // 查询未完成行动项列表
    url: '/custom/weeklyPro/getWeeklyActionltemsUnaccomplishedList',
    method: 'post',
    disableSuccessMsg: true
  },
  GET_WEEKLY_LOOKUP_VALUE: {
    // 项目周报检查项 下拉框查询值列表
    url: '/custom/weeklyPro/getWeeklyLookupValue',
    method: 'post',
    disableSuccessMsg: true
  },
  BATCH_WEEK_INSPECT: {
    // 批量检查
    url: '/custom/weeklyInspect/batchWeekInspect',
    method: 'post',
    disableSuccessMsg: true
  },
  GET_PROJECT_WEEKLY_DETAIL: {
    // 查询项目周报详情（从项目首页填写周报按钮进入时）
    url: '/custom/weeklyPro/getProjectWeeklyDetailPro',
    method: 'get',
    disableSuccessMsg: true
  },
  GET_PROJECT_WEEKLY_DETAIL_BY_ID: {
    // 查询项目周报详情（从周报列表详情按钮进入时）
    url: '/custom/weeklyPro/getProjectWeeklyDetailByIdPro',
    method: 'get',
    disableSuccessMsg: true
  },
  GET_PROJECT_WEEKLY_DETAIL_EDIT: {
    // 查询项目周报详情（从周报列表编辑按钮进入时）
    url: '/custom/weeklyPro/getProjectWeeklyEditByIdPro',
    method: 'get',
    disableSuccessMsg: true
  },
  QUERY_ALL_DEPARTMENT: {
    // 部门选择查询远程数据（搜索时过滤数据）
    url: '/xdap-app/department/select/queryDeptList',
    method: 'get',
    disableSuccessMsg: true
  },
  QUERY_WEEKLY_INSPECT_DETAILS: {
    // 周报检查查询详情
    url: '/custom/weeklyInspect/queryWeeklyInspectDetails',
    method: 'post',
    disableSuccessMsg: true
  },
  CREATE_PROCESS: {
    // 项目周报检查创建流程
    url: '/custom/weeklyInspect/createProcess',
    method: 'post',
    disableSuccessMsg: true
  },
  WEEKLY_INSERT: {
    // 新增项目周报提交
    url: '/custom/weeklyPro/createWeeklyPro',
    method: 'post',
    disableSuccessMsg: true
  },
  EDIT_BY_WEEKLY_ID: {
    // 编辑项目周报提交
    url: '/custom/weeklyPro/editWeeklyPro',
    method: 'post',
    disableSuccessMsg: true
  },
  GET_WEEKLY_ACTION_ITEMS_LIST: {
    // 查询周报已提交行动项
    url: '/custom/weeklyPro/getWeeklyActionltemsList',
    method: 'post',
    disableSuccessMsg: true
  }
}
