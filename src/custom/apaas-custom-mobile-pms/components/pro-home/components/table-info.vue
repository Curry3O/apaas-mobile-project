<!--
 * @Author: your name
 * @Date: 2021-12-17 20:19:29
 * @LastEditTime: 2022-02-18 16:28:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\components\pro-home\table-info.vue
-->
<template>
  <div class="table-info">
    <TabSlot
      :tabsData="costIncomeList"
      :firstTabName="firstTabName"
      :secondTabName="secondTabName"
      :heightList="heightList"
    ></TabSlot>
    <div class="pg-wrap"></div>
    <div class="pg-title">
      <div class="pg-line"></div>
      <div class="ml-10 fs-16 fw-600">
        回款
      </div>
    </div>
    <div class="page-list">
      <div class="slide-box box-card">
        <cube-slide
          ref="slide"
          :loop="true"
          :auto-play="false"
          :data="payBackList"
          @change="pageChange"
        >
          <cube-slide-item v-for="(item, index) in payBackList" :key="index">
            <div class="slide-item">
              <div>回款类型：{{ item.payBackTypeName }}</div>
              <div>里程碑：{{ item.milestone }}</div>
              <div>里程碑计划完成时间：{{ item.milestonePlanTime }}</div>
              <div>里程碑变更时间：{{ item.milestoneChangeTime }}</div>
              <div>里程碑实际完成时间：{{ item.milestoneActualTime }}</div>
            </div>
          </cube-slide-item>
        </cube-slide>
      </div>
    </div>
    <cube-tab-bar v-model="currentTab" show-slider class="page-tab">
      <cube-tab v-for="item in receiveData" :key="item.code" :label="item.label">
        <span class="fc-blue">{{ item.label.split('/')[0] }}</span>
        <span class="fc-black">{{ ' / ' + item.label.split('/')[1] }}</span>
      </cube-tab>
    </cube-tab-bar>
    <cube-tab-panels v-model="currentTab" class="page-panel">
      <cube-tab-panel v-for="item in receiveData" :key="item.label" :label="item.label">
        <ul>
          <li v-for="pItem in item.list" :key="pItem.field" class="tab-panel-li">
            <div class="panel-label">
              {{ pItem.field }}
            </div>
            <div class="panel-value">
              <div class="fc-blue">
                {{ transform(pItem.value1) }}
              </div>
              <div>
                {{ transform(pItem.value2) }}
              </div>
            </div>
            <div v-if="pItem.canEdit" class="panel-icon">
              <x-svg-icon name="edit-panel" @click.native="editData"></x-svg-icon>
            </div>
          </li>
        </ul>
      </cube-tab-panel>
    </cube-tab-panels>
    <div class="pg-wrap ph-20"></div>
  </div>
</template>

<script>
import TabSlot from '../../common/components/tab-slot.vue'
import { formatMoney } from '../../../../common/utils/tool'
export default {
  name: 'TableInfo',
  components: {
    TabSlot
  },
  props: {
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
      costIncomeList: [
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
        }
      ],
      payBackList: [{}],
      currentTab: '预计回款/实际回款',
      receiveData: [
        {
          label: '预计回款/实际回款',
          list: [
            {
              field: '硬件',
              code: 'hardware',
              value1: null,
              value2: null
            },
            {
              field: '软件',
              code: 'software',
              value1: null,
              value2: null
            },
            {
              field: '产品',
              code: 'product',
              value1: null,
              value2: null
            },
            {
              field: '实施',
              code: 'implement',
              value1: null,
              value2: null
            },
            {
              field: '平台服务费',
              code: 'platformService',
              value1: null,
              value2: null
            },
            {
              field: '流量服务费',
              code: 'flowService',
              value1: null,
              value2: null
            }
          ]
        }
      ],
      heightList: [840, 340]
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
          this.costIncomeList[0].children[0].list.forEach((item) => {
            item.value1 = v[0][item.code]
          })
          this.costIncomeList[0].children[0].list.forEach((item) => {
            item.value2 = v[1][item.code]
          })
        }
      }
    },
    incomeVoList: {
      handler(v) {
        if (v.length) {
          this.costIncomeList[1].children[0].list.forEach((item) => {
            item.value1 = v[0][item.code]
          })
          this.costIncomeList[1].children[0].list.forEach((item) => {
            item.value2 = v[1][item.code]
          })
        }
      }
    },
    returnVoList: {
      handler(v) {
        if (v.length) {
          this.payBackList = [...v]
          this.receiveData[0].list.forEach((item) => {
            item.value1 = v[0][item.code + 'Expected']
            item.value2 = v[0][item.code + 'Actual']
          })
        }
      }
    }
  },
  created() {},
  methods: {
    pageChange(current) {
      this.receiveData[0].list.forEach((item) => {
        item.value1 = this.returnVoList[current][item.code + 'Expected']
        item.value2 = this.returnVoList[current][item.code + 'Actual']
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-info {
  .pg-title {
    padding: 10px 20px;
    display: flex;
    align-items: center;
    .pg-line {
      width: 4px;
      height: 18px;
      background: #00a84d;
      border-radius: 5px;
    }
  }
  .page-list {
    display: flex;
    justify-content: center;
    padding: 0 15px;
    .box-card {
      width: 95%;
      border-radius: 20px;
      background-color: #f5f8fa;
      box-shadow: 0 2px 9px #ddd;
    }
    .slide-box {
      height: 160px;
      .slide-item {
        padding: 15px 15px 0;
        div {
          color: #333333;
          font-size: 14px;
          line-height: 24px;
        }
      }
      ::v-deep .cube-slide-dots {
        bottom: 5px;
      }
      ::v-deep .cube-slide-dots > span {
        width: 15px;
        height: 2px;
        margin-right: 3px;
      }
      ::v-deep .cube-slide-dots > span.active {
        background: #027aff;
      }
    }
    .line-box {
      height: 300px;
      display: flex;
      justify-content: center;
    }
  }
  .page-tab {
    margin-top: 10px;
    border-bottom: 2px solid #e8e8e8;
    ::v-deep .cube-tab {
      line-height: 20px;
    }
    ::v-deep .cube-tab_active {
      color: #00a84d;
    }
    ::v-deep .cube-tab-bar-slider {
      background-color: #00a84d;
      bottom: -2px;
    }
  }
  .page-panel {
    ::v-deep .cube-tab-panel {
      width: 100%;
      flex: 1 0 auto;
    }
    ::v-deep .tab-panel-li {
      color: #333333;
      font-size: 14px;
      padding: 0 10px 0 20px;
      height: 60px;
      line-height: 60px;
      border-top: 2px solid #e8e8e8;
      display: flex;
      // align-items: center;
      .panel-label {
        flex: 3;
      }
      .panel-value {
        flex: 3;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        line-height: 22px;
        padding-right: 10px;
      }
      .panel-icon {
        flex: 1;
        color: #999999;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 24px;
        .x-svg-icon {
          width: 24px !important;
          height: 24px !important;
        }
      }
    }
    .tab-panel-li:nth-child(1) {
      border-top: none;
    }
  }
  .fc-blue {
    color: #027aff;
  }
  .fc-black {
    color: #333;
  }
  .pg-wrap {
    width: 100%;
    height: 10px;
    background: #efeff4;
  }
  .ph-20 {
    height: 20px;
  }
  .ml-10 {
    margin-left: 10px;
  }
  .fs-16 {
    font-size: 16px;
  }
  .fs-18 {
    font-size: 18px;
  }
  .fw-600 {
    font-weight: 600;
  }
}
</style>
