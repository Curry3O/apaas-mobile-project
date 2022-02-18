<!--
 * @Author: your name
 * @Date: 2022-01-21 16:53:50
 * @LastEditTime: 2022-02-16 15:27:42
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
import { mapState, mapMutations } from 'vuex'
import {
  SET_SD_COST_TYPE,
  SET_SD_INCOME_TYPE,
  SET_SD_TYPE_LIST,
  SET_SD_TABLE_DATA_LIST
} from '../../../common/store/weekly-details.store'
import TabSlot from '../common/tab-slot.vue'
import { formatMoney } from '../../../common/utils/tool'
export default {
  name: 'WeeklyTable',
  components: {
    TabSlot
  },
  props: {},
  data() {
    return {
      editMode: false,
      firstTabName: '成本',
      secondTabName: 'MRD计划/已发生',
      tableDataList: [],
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
    ...mapState({
      configField: (state) => state.weeklyDetailsModule.configField,
      sdCostTypePoList: (state) => state.weeklyDetailsModule.sdCostTypePoList,
      sdIncomeTypePoList: (state) => state.weeklyDetailsModule.sdIncomeTypePoList,
      sdTypePoList: (state) => state.weeklyDetailsModule.sdTypePoList,
      sdTableDataList: (state) => state.weeklyDetailsModule.sdTableDataList
    }),
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
    configField: {
      handler(v) {
        this.editMode = v.editMode
      },
      immediate: true
    },
    sdCostTypePoList: {
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
          this.computeAllRp()
        }
      }
    },
    sdIncomeTypePoList: {
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
          this.computeAllRp()
        }
      }
    },
    sdTypePoList: {
      handler(v) {
        if (v.length) {
          this.tableDataList[2].children[0].list.forEach((item) => {
            item.value1 = v[0][item.code]
            item.myRiskPremium = v[0].myRiskPremium
          })
          this.tableDataList[2].children[1].list.forEach((item, index) => {
            item.value1 = v[index][item.code]
          })
          this.computeAllRp()
        }
      }
    },
    sdTableDataList: {
      handler(v) {
        this.tableDataList = [...v]
      }
    }
  },
  created() {
    this.tableDataList = this.sdTableDataList
  },
  methods: {
    ...mapMutations('weeklyDetailsModule', {
      set_sd_costType: SET_SD_COST_TYPE,
      set_sd_incomeType: SET_SD_INCOME_TYPE,
      set_sd_typeList: SET_SD_TYPE_LIST,
      set_sd_tableDataList: SET_SD_TABLE_DATA_LIST
    }),
    /**
     * 计算每行毛利率（不含风险溢价）
     */
    computeAllRp() {
      this.$nextTick(() => {
        this.computeEstimateTotal()
        this.computeEstimateYear()
        this.computeEstimateDeviation()
        this.set_sd_tableDataList(this.tableDataList)
      })
    },
    /**
     * 计算每行毛利率公式
     */
    computeExcludeRp(cost, income) {
      if (!this.isNumber(cost) || !this.isNumber(income) || Number(income) === 0) {
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
        Number(
          this.tableDataList[1].children[1].list[4].value2 === '计划收入预测未填'
            ? 0
            : this.tableDataList[1].children[1].list[4].value2
        )
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
        this.transformNum(this.tableDataList[2].children[1].list[0].value1) === '-' ||
        this.transformNum(this.tableDataList[2].children[1].list[2].value1) === '-'
      ) {
        value = '-'
      } else {
        value = (
          Number(this.tableDataList[2].children[1].list[2].value1) -
          Number(this.tableDataList[2].children[1].list[0].value1)
        ).toFixed(2)
      }
      this.$set(this.tableDataList[2].children[1].list[4], 'value1', value)
    },
    /**
     * 收集所有数据
     */
    returnAllData() {
      return {
        costData: this.getCostData(),
        incomeData: this.getIncomeData(),
        typeData: this.getTypeData()
      }
    },
    /**
     * 收集成本表格数据
     */
    getCostData() {
      const costList = this.sdCostTypePoList
      this.tableDataList[0].children[1].list.forEach((item) => {
        costList[2][item.code] = item.value1 === '-' ? null : item.value1
        costList[4][item.code] = item.value2 === '-' ? null : item.value2
      })
      return costList
    },
    /**
     * 收集收入表格数据
     */
    getIncomeData() {
      const incomeList = this.sdIncomeTypePoList
      this.tableDataList[1].children[1].list.forEach((item) => {
        incomeList[3][item.code] = item.value1 === '-' ? null : item.value1
        incomeList[4][item.code] = item.value2 === '计划收入预测未填' ? null : item.value2
      })
      return incomeList
    },
    /**
     * 收集类型表格数据
     */
    getTypeData() {
      const typeList = this.sdTypePoList
      typeList[2].cost = (
        Number(this.tableDataList[0].children[0].list[12].value2) +
        Number(this.tableDataList[0].children[1].list[12].value1)
      ).toFixed(2)
      typeList[2].income = (
        Number(this.tableDataList[1].children[0].list[4].value2) +
        Number(this.tableDataList[1].children[1].list[4].value1)
      ).toFixed(2)
      typeList[2].grossMarginExcludeRp =
        this.tableDataList[2].children[1].list[2].value1 === '-'
          ? null
          : this.tableDataList[2].children[1].list[2].value1
      typeList[3].cost = (
        Number(this.tableDataList[0].children[0].list[12].value2) +
        Number(this.tableDataList[0].children[1].list[12].value2)
      ).toFixed(2)
      typeList[3].income = (
        Number(this.tableDataList[1].children[0].list[4].value3) +
        Number(
          this.tableDataList[1].children[1].list[4].value2 === '计划收入预测未填'
            ? 0
            : this.tableDataList[1].children[1].list[4].value2
        )
      ).toFixed(2)
      typeList[3].grossMarginExcludeRp =
        this.tableDataList[2].children[1].list[3].value1 === '-'
          ? null
          : this.tableDataList[2].children[1].list[3].value1
      typeList[4].cost = (
        Number(this.tableDataList[0].children[0].list[12].value2) +
        Number(this.tableDataList[0].children[1].list[12].value1) -
        Number(typeList[0].cost)
      ).toFixed(2)
      typeList[4].income = (
        Number(this.tableDataList[1].children[0].list[4].value2) +
        Number(this.tableDataList[1].children[1].list[4].value1) -
        Number(typeList[0].income)
      ).toFixed(2)
      typeList[4].grossMarginExcludeRp =
        this.tableDataList[2].children[1].list[4].value1 === '-'
          ? null
          : this.tableDataList[2].children[1].list[4].value1
      return typeList
    },
    // 判断是否为数字类型
    isNumber(num) {
      return typeof Number(num) === 'number' && isFinite(num)
    },
    // 判断值是否为空
    transformNum(value) {
      if (Number(value) === 0) {
        return Number(value)
      } else if (!value || value === '-') {
        return '-'
      }
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
