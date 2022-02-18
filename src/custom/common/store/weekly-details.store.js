/*
 * @Author: your name
 * @Date: 2022-01-28 16:21:26
 * @LastEditTime: 2022-02-17 20:39:34
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
export const SET_SD_CHECK_WEEK = 'SET_SD_CHECK_WEEK'
export const SET_SD_TABLE_DATA_LIST = 'SET_SD_TABLE_DATA_LIST'
export const INIT_SD_ALL_DATA = 'INIT_SD_ALL_DATA'

export const weeklyDetailsStore = {
  namespaced: true,
  state: {
    scrollTop: 0, // 页面滚动条的滚动距离
    configField: {
      editMode: false, // 页面是否可编辑
      showDetail: true, // 是否显示详情模块
      checkFlag: false, // 是否点击周报检查按钮
      headTitle: '', // 页面标题
      backPath: '' // 返回路径
    }, // 配置字段
    sdWeeklypo: {}, // 主体信息
    sdCostTypePoList: [], // 成本类型列表
    sdIncomeTypePoList: [], // 收入类型列表
    sdTypePoList: [], // 类型列表
    sdLwSituationPoList: [], // 上周情况列表
    sdCoordinate: [], // 协调事项
    sdProgressList: {}, // 进度列表
    isCheckWeek: false, // 是否进行周报检查
    sdTableDataList: [
      {
        label: '成本',
        children: [
          {
            label: 'MRD计划/已发生',
            list: [
              {
                field: '内部人天',
                code: 'insideCost',
                value1: null,
                value2: null
              },
              {
                field: '交付费用',
                code: 'travelCost',
                value1: null,
                value2: null
              },
              {
                field: '人天外包',
                code: 'outsourceCost',
                value1: null,
                value2: null
              },
              {
                field: '软件产品第三方',
                code: 'softwareDsf',
                value1: null,
                value2: null
              },
              {
                field: '第三方实施',
                code: 'implementDsf',
                value1: null,
                value2: null
              },
              {
                field: '云资源成本',
                code: 'cloudResourcesCost',
                value1: null,
                value2: null
              },
              {
                field: '流量费成本',
                code: 'dataTrafficCost',
                value1: null,
                value2: null
              },
              {
                field: '自营硬件成本',
                code: 'selfOperateHardwareCost',
                value1: null,
                value2: null
              },
              {
                field: '第三方硬件成本',
                code: 'dsfHardwareCost',
                value1: null,
                value2: null
              },
              {
                field: '自营软件',
                code: 'selfOperateSoftware',
                value1: null,
                value2: null
              },
              {
                field: '库存成本',
                code: 'stockCost',
                value1: null,
                value2: null
              },
              {
                field: '在途成本',
                code: 'otwCost',
                value1: null,
                value2: null
              },
              {
                field: '小计',
                code: 'subtotal',
                value1: null,
                value2: null,
                boldFont: true
              }
            ]
          },
          {
            label: '项目总预计/本年度预计',
            list: [
              {
                field: '内部人天',
                code: 'insideCost',
                value1: null,
                value2: null
              },
              {
                field: '交付费用',
                code: 'travelCost',
                value1: null,
                value2: null
              },
              {
                field: '人天外包',
                code: 'outsourceCost',
                value1: null,
                value2: null
              },
              {
                field: '软件产品第三方',
                code: 'softwareDsf',
                value1: null,
                value2: null
              },
              {
                field: '第三方实施',
                code: 'implementDsf',
                value1: null,
                value2: null
              },
              {
                field: '云资源成本',
                code: 'cloudResourcesCost',
                value1: null,
                value2: null
              },
              {
                field: '流量费成本',
                code: 'dataTrafficCost',
                value1: null,
                value2: null
              },
              {
                field: '自营硬件成本',
                code: 'selfOperateHardwareCost',
                value1: null,
                value2: null
              },
              {
                field: '第三方硬件成本',
                code: 'dsfHardwareCost',
                value1: null,
                value2: null
              },
              {
                field: '自营软件',
                code: 'selfOperateSoftware',
                value1: null,
                value2: null
              },
              {
                field: '库存成本',
                code: 'stockCost',
                value1: null,
                value2: null
              },
              {
                field: '在途成本',
                code: 'otwCost',
                value1: null,
                value2: null
              },
              {
                field: '小计',
                code: 'subtotal',
                value1: null,
                value2: null,
                boldFont: true
              }
            ]
          }
        ]
      },
      {
        label: '收入',
        children: [
          {
            label: 'MRD计划/已确认/本年度已确定',
            list: [
              {
                field: '硬件',
                code: 'hardware',
                value1: null,
                value2: null,
                value3: null,
                showMore: true
              },
              {
                field: '软件实施',
                code: 'software',
                value1: null,
                value2: null,
                value3: null,
                showMore: true
              },
              {
                field: '平台服务费',
                code: 'platformServiceCost',
                value1: null,
                value2: null,
                value3: null,
                showMore: true
              },
              {
                field: '流量服务费',
                code: 'dataServiceCost',
                value1: null,
                value2: null,
                value3: null,
                showMore: true
              },
              {
                field: '小计',
                code: 'subtotal',
                value1: null,
                value2: null,
                value3: null,
                showMore: true,
                boldFont: true
              }
            ]
          },
          {
            label: '待确认/本年度待确认',
            list: [
              {
                field: '硬件',
                code: 'hardware',
                value1: null,
                value2: null
              },
              {
                field: '软件实施',
                code: 'software',
                value1: null,
                value2: null
              },
              {
                field: '平台服务费',
                code: 'platformServiceCost',
                value1: null,
                value2: null
              },
              {
                field: '流量服务费',
                code: 'dataServiceCost',
                value1: null,
                value2: null
              },
              {
                field: '小计',
                code: 'subtotal',
                value1: null,
                value2: null,
                boldFont: true
              }
            ]
          }
        ]
      },
      {
        label: '毛利率',
        children: [
          {
            label: '含风险溢价',
            list: [
              {
                field: 'MRD计划',
                code: 'grossMarginContainRp',
                value1: null,
                riskPremium: null,
                showPremium: true,
                hiddenRow: true,
                percentType: true
              }
            ]
          },
          {
            label: '不含风险溢价',
            list: [
              {
                field: 'MRD计划',
                code: 'grossMarginExcludeRp',
                value1: null,
                hiddenRow: true,
                percentType: true
              },
              {
                field: '实际小计',
                code: 'grossMarginExcludeRp',
                value1: null,
                hiddenRow: true,
                percentType: true
              },
              {
                field: '总项目预计',
                code: 'grossMarginExcludeRp',
                value1: null,
                hiddenRow: true,
                percentType: true
              },
              {
                field: '年度预计',
                code: 'grossMarginExcludeRp',
                value1: null,
                hiddenRow: true,
                percentType: true
              },
              {
                field: '总项目偏差',
                code: 'grossMarginExcludeRp',
                value1: null,
                hiddenRow: true,
                percentType: true
              }
            ]
          }
        ]
      }
    ] // 成本、收入、类型表格数据
  },
  mutations: {
    [SET_SCROLL_TOP](state, scrollTop) {
      state.scrollTop = scrollTop
    },
    [SET_SD_CONFIG_FIELD](state, configField) {
      state.configField = configField
    },
    [SET_SD_WEEKLYPO](state, sdWeeklypo) {
      state.sdWeeklypo = sdWeeklypo
    },
    [SET_SD_COST_TYPE](state, sdCostTypePoList) {
      state.sdCostTypePoList = sdCostTypePoList
    },
    [SET_SD_INCOME_TYPE](state, sdIncomeTypePoList) {
      state.sdIncomeTypePoList = sdIncomeTypePoList
    },
    [SET_SD_TYPE_LIST](state, sdTypePoList) {
      state.sdTypePoList = sdTypePoList
    },
    [SET_SD_SITUATION](state, sdLwSituationPoList) {
      state.sdLwSituationPoList = sdLwSituationPoList
    },
    [SET_SD_COORDINATE](state, sdCoordinate) {
      state.sdCoordinate = sdCoordinate
    },
    [SET_SD_PROGRESS](state, sdProgressList) {
      state.sdProgressList = sdProgressList
    },
    [SET_SD_CHECK_WEEK](state, isCheckWeek) {
      state.isCheckWeek = isCheckWeek
    },
    [SET_SD_TABLE_DATA_LIST](state, sdTableDataList) {
      state.sdTableDataList = sdTableDataList
    },
    [INIT_SD_ALL_DATA](state) {
      state.scrollTop = 0
      state.configField = {
        editMode: false,
        showDetail: true,
        checkFlag: false,
        headTitle: '',
        backPath: ''
      }
      state.sdWeeklypo = {}
      state.sdCostTypePoList = []
      state.sdIncomeTypePoList = []
      state.sdTypePoList = []
      state.sdLwSituationPoList = []
      state.sdCoordinate = []
      state.sdProgressList = {}
      state.sdTableDataList = [
        {
          label: '成本',
          children: [
            {
              label: 'MRD计划/已发生',
              list: [
                {
                  field: '内部人天',
                  code: 'insideCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '交付费用',
                  code: 'travelCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '人天外包',
                  code: 'outsourceCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '软件产品第三方',
                  code: 'softwareDsf',
                  value1: null,
                  value2: null
                },
                {
                  field: '第三方实施',
                  code: 'implementDsf',
                  value1: null,
                  value2: null
                },
                {
                  field: '云资源成本',
                  code: 'cloudResourcesCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '流量费成本',
                  code: 'dataTrafficCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '自营硬件成本',
                  code: 'selfOperateHardwareCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '第三方硬件成本',
                  code: 'dsfHardwareCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '自营软件',
                  code: 'selfOperateSoftware',
                  value1: null,
                  value2: null
                },
                {
                  field: '库存成本',
                  code: 'stockCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '在途成本',
                  code: 'otwCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '小计',
                  code: 'subtotal',
                  value1: null,
                  value2: null,
                  boldFont: true
                }
              ]
            },
            {
              label: '项目总预计/本年度预计',
              list: [
                {
                  field: '内部人天',
                  code: 'insideCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '交付费用',
                  code: 'travelCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '人天外包',
                  code: 'outsourceCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '软件产品第三方',
                  code: 'softwareDsf',
                  value1: null,
                  value2: null
                },
                {
                  field: '第三方实施',
                  code: 'implementDsf',
                  value1: null,
                  value2: null
                },
                {
                  field: '云资源成本',
                  code: 'cloudResourcesCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '流量费成本',
                  code: 'dataTrafficCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '自营硬件成本',
                  code: 'selfOperateHardwareCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '第三方硬件成本',
                  code: 'dsfHardwareCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '自营软件',
                  code: 'selfOperateSoftware',
                  value1: null,
                  value2: null
                },
                {
                  field: '库存成本',
                  code: 'stockCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '在途成本',
                  code: 'otwCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '小计',
                  code: 'subtotal',
                  value1: null,
                  value2: null,
                  boldFont: true
                }
              ]
            }
          ]
        },
        {
          label: '收入',
          children: [
            {
              label: 'MRD计划/已确认/本年度已确定',
              list: [
                {
                  field: '硬件',
                  code: 'hardware',
                  value1: null,
                  value2: null,
                  value3: null,
                  showMore: true
                },
                {
                  field: '软件实施',
                  code: 'software',
                  value1: null,
                  value2: null,
                  value3: null,
                  showMore: true
                },
                {
                  field: '平台服务费',
                  code: 'platformServiceCost',
                  value1: null,
                  value2: null,
                  value3: null,
                  showMore: true
                },
                {
                  field: '流量服务费',
                  code: 'dataServiceCost',
                  value1: null,
                  value2: null,
                  value3: null,
                  showMore: true
                },
                {
                  field: '小计',
                  code: 'subtotal',
                  value1: null,
                  value2: null,
                  value3: null,
                  showMore: true,
                  boldFont: true
                }
              ]
            },
            {
              label: '待确认/本年度待确认',
              list: [
                {
                  field: '硬件',
                  code: 'hardware',
                  value1: null,
                  value2: null
                },
                {
                  field: '软件实施',
                  code: 'software',
                  value1: null,
                  value2: null
                },
                {
                  field: '平台服务费',
                  code: 'platformServiceCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '流量服务费',
                  code: 'dataServiceCost',
                  value1: null,
                  value2: null
                },
                {
                  field: '小计',
                  code: 'subtotal',
                  value1: null,
                  value2: null,
                  boldFont: true
                }
              ]
            }
          ]
        },
        {
          label: '毛利率',
          children: [
            {
              label: '含风险溢价',
              list: [
                {
                  field: 'MRD计划',
                  code: 'grossMarginContainRp',
                  value1: null,
                  riskPremium: null,
                  showPremium: true,
                  hiddenRow: true,
                  percentType: true
                }
              ]
            },
            {
              label: '不含风险溢价',
              list: [
                {
                  field: 'MRD计划',
                  code: 'grossMarginExcludeRp',
                  value1: null,
                  hiddenRow: true,
                  percentType: true
                },
                {
                  field: '实际小计',
                  code: 'grossMarginExcludeRp',
                  value1: null,
                  hiddenRow: true,
                  percentType: true
                },
                {
                  field: '总项目预计',
                  code: 'grossMarginExcludeRp',
                  value1: null,
                  hiddenRow: true,
                  percentType: true
                },
                {
                  field: '年度预计',
                  code: 'grossMarginExcludeRp',
                  value1: null,
                  hiddenRow: true,
                  percentType: true
                },
                {
                  field: '总项目偏差',
                  code: 'grossMarginExcludeRp',
                  value1: null,
                  hiddenRow: true,
                  percentType: true
                }
              ]
            }
          ]
        }
      ]
    }
  },
  actions: {},
  getters: {}
}
