<!--
 * @Author: your name
 * @Date: 2021-12-17 20:19:29
 * @LastEditTime: 2021-12-17 21:02:51
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\components\pro-home\table-info.vue
-->
<template>
  <div>
    <TabSlot :tabsData="tabsData" :firstTab="firstTab" :secondTab="secondTab"></TabSlot>
  </div>
</template>

<script>
import TabSlot from '../common/tab-slot.vue'
export default {
  name: 'TableInfo',
  components: {
    TabSlot
  },
  props: {
    financeCostVoList: {
      type: Object
    },
    financeIncomeVoList: {
      type: Object
    }
  },
  data() {
    return {
      firstTab: '成本',
      secondTab: 'MRD计划/已发生',
      tabsData: [
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
            }
          ]
        },
        {
          label: '收入',
          children: [
            {
              label: 'MRD计划/已确认',
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
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped></style>
