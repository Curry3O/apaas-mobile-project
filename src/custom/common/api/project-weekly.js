/*
 * @Author: your name
 * @Date: 2021-12-27 15:07:53
 * @LastEditTime: 2022-01-19 18:52:56
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
  }
}
