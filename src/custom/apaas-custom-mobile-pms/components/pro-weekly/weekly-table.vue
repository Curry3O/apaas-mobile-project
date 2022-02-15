<!--
 * @Author: your name
 * @Date: 2022-01-21 16:53:50
 * @LastEditTime: 2022-02-15 10:58:58
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/pro-weekly/weekly-table.vue
-->
<template>
  <div class="weekly-table">
    <TabSlot
      :tabsData="tableDataList"
      :showIcon="true"
      :editMode="editMode"
      :firstTabName="firstTabName"
      :secondTabName="secondTabName"
      :secondIndexList="secondIndexList"
      :heightList="heightList"
      @dateChange="computeAllRp()"
    ></TabSlot>
    <div class="pg-wrap"></div>
  </div>
</template>
<script>
import TabSlot from '../common/tab-slot.vue'
import { formatMoney } from '../../../common/utils/tool'
export default {
  name: 'WeeklyTable',
  components: {
    TabSlot
  },
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    costVoList: {
      type: Array,
      default: () => []
    },
    incomeVoList: {
      type: Array,
      default: () => []
    },
    returnVoList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      firstTabName: '成本',
      secondTabName: 'MRD计划/已发生',
      tableDataList: [
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
                  value2: null
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
                  value2: null
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
                  showMore: true
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
                  value2: null
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
      ],
      secondIndexList: [
        { 'MRD计划/已发生': 0, '项目总预计/本年度预计': 1 },
        { 'MRD计划/已确认/本年度已确定': 0, '待确认/本年度待确认': 1 },
        { 含风险溢价: 0, 不含风险溢价: 1 }
      ],
      heightList: [
        [840, 840],
        [400, 350],
        [100, 350]
      ]
    }
  },
  computed: {
    transform() {
      return (value) => {
        if (value) {
          return formatMoney(value)
        }
        if (value === 0) {
          return '0.00'
        }
        return '-'
      }
    }
  },
  watch: {
    costVoList: {
      handler(v) {
        if (v.length) {
          this.tableDataList[0].children[0].list.forEach((item) => {
            item.value1 = v[0][item.code]
            item.value2 = v[1][item.code]
          })
          this.tableDataList[0].children[1].list.forEach((item) => {
            item.value1 = v[2][item.code]
            item.value2 = v[4][item.code]
            item.lastValue = v[3][item.code]
            item.canEdit = this.editMode && item.code !== 'stockCost' && item.code !== 'otwCost'
            item.lastFlag = true
          })
        }
      }
    },
    incomeVoList: {
      handler(v) {
        if (v.length) {
          this.tableDataList[1].children[0].list.forEach((item) => {
            item.value1 = v[0][item.code]
            item.value2 = v[1][item.code]
            item.value3 = v[2][item.code]
          })
          this.tableDataList[1].children[1].list.forEach((item) => {
            item.canEdit = this.editMode
            item.value1 = v[3][item.code]
            const typeStr = v[4].type ? JSON.parse(v[4].type) : []
            if (typeStr.length === 1 && typeStr[0] === 'ALL') {
              item.value2 = '计划收入预测未填'
            } else {
              item.value2 = v[4][item.code]
            }
          })
        }
      }
    },
    returnVoList: {
      handler(v) {
        if (v.length) {
          this.tableDataList[2].children[0].list.forEach((item) => {
            item.value1 = v[0][item.code]
            item.myRiskPremium = v[0].myRiskPremium
          })
          this.tableDataList[2].children[1].list.forEach((item, index) => {
            item.value1 = v[index][item.code]
          })
        }
      }
    }
  },
  created() {},
  methods: {
    /**
     * 计算每行毛利率（不含风险溢价）
     */
    computeAllRp() {
      this.$nextTick(() => {
        this.computeEstimateTotal()
        this.computeEstimateYear()
        this.computeEstimateDeviation()
      })
    },
    /**
     * 计算每行毛利率公式
     */
    computeExcludeRp(cost, income) {
      if (Number(income) === 0) {
        return '-'
      }
      return (((Number(income) - Number(cost)) / Number(income)) * 100).toFixed(2)
    },
    /**
     * 计算总项目预计毛利率（不含风险溢价）
     */
    computeEstimateTotal() {
      const allCost = (
        Number(this.tableDataList[0].children[0].list[12].value2) +
        Number(this.tableDataList[0].children[1].list[12].value1)
      ).toFixed(2)
      const allIncome = (
        Number(this.tableDataList[1].children[0].list[4].value2) +
        Number(this.tableDataList[1].children[1].list[4].value1)
      ).toFixed(2)
      this.$set(
        this.tableDataList[2].children[1].list[2],
        'value1',
        this.computeExcludeRp(allCost, allIncome)
      )
    },
    /**
     * 计算年度预计毛利率（不含风险溢价）
     */
    computeEstimateYear() {
      const allCost = (
        Number(this.tableDataList[0].children[0].list[12].value2) +
        Number(this.tableDataList[0].children[1].list[12].value2)
      ).toFixed(2)
      const allIncome = (
        Number(this.tableDataList[1].children[0].list[4].value3) +
        Number(this.tableDataList[1].children[1].list[4].value2)
      ).toFixed(2)
      this.$set(
        this.tableDataList[2].children[1].list[3],
        'value1',
        this.computeExcludeRp(allCost, allIncome)
      )
    },
    /**
     * 计算总项目偏差毛利率（不含风险溢价）
     */
    computeEstimateDeviation() {
      let value = null
      if (
        this.tableDataList[2].children[1].list[0].value1 === '-' ||
        this.tableDataList[2].children[1].list[2].value1 === '-'
      ) {
        value = '-'
      }
      value = (
        Number(this.tableDataList[2].children[1].list[2].value1) -
        Number(this.tableDataList[2].children[1].list[0].value1)
      ).toFixed(2)
      this.$set(this.tableDataList[2].children[1].list[4], 'value1', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.weekly-table {
  .pg-wrap {
    width: 100%;
    height: 10px;
    background: #efeff4;
  }
}
</style>
