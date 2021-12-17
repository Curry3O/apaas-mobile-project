<!--
 * @Author: your name
 * @Date: 2021-12-13 20:46:20
 * @LastEditTime: 2021-12-17 20:52:41
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\components\pro-home\base-info.vue
-->
<template>
  <div class="base-data">
    <div class="page-card">
      <div
        v-for="item in amountList"
        :key="item.code"
        class="box-item"
        :style="{ 'background-color': item.bgColor }"
      >
        <div class="box-bg">
          <div class="box-content">
            <div class="box-text">{{ item.label }}</div>
            <div class="box-img">
              <img :src="item.url" />
            </div>
          </div>
          <div class="box-amount fs-18 fw-600">
            {{ item.value ? (item.isMoney ? '¥' + item.value : item.value + '%') : '-' }}
          </div>
        </div>
      </div>
    </div>
    <div class="pg-title">
      <div class="pg-line"></div>
      <div class="ml-10 fs-16 fw-600">综合评价</div>
    </div>
    <div class="page-evaluate">
      <div class="card-list">
        <div v-for="item in lightList" :key="item.code" class="box-item">
          <div class="box-icon ml-10 mr-10">
            <x-svg-icon name="light-icon" :class="'bg-' + item.twHealthyState" />
          </div>
          <div class="box-text fs-12">{{ item.label }}</div>
        </div>
      </div>
    </div>
    <div class="pg-title">
      <div class="pg-line"></div>
      <div class="ml-10 fs-16 fw-600">{{ pieTitle }}</div>
    </div>
    <div class="page-chart">
      <div class="slide-box box-card">
        <cube-slide
          ref="slide"
          :loop="true"
          :auto-play="false"
          :data="slideList"
          @change="changePage"
        >
          <cube-slide-item v-for="(item, index) in slideList" :key="index">
            <div class="slide-item">
              <PieChart class="pie-chart" :pieData="item.data"></PieChart>
              <div class="pie-legend">
                <div class="text-box">
                  <div class="text-label">{{ item.data[0].name }}</div>
                  <div class="text-value">{{ transform(item.data[0].value) }}</div>
                </div>
                <div class="text-box">
                  <div class="text-label">{{ item.data[1].name }}</div>
                  <div class="text-value">{{ transform(item.data[1].value) }}</div>
                </div>
              </div>
            </div>
          </cube-slide-item>
        </cube-slide>
      </div>
    </div>
    <div class="pg-title mt-5">
      <div class="pg-line"></div>
      <div class="ml-10 fs-16 fw-600">实际毛利率</div>
    </div>
    <div class="page-chart">
      <div ref="lineBox" class="line-box box-card">
        <LineChart class="line-chart" :lineData="lineData"></LineChart>
      </div>
    </div>
  </div>
</template>

<script>
import PieChart from '../pro-home/pie-chart.vue'
import LineChart from '../pro-home/line-chart.vue'
import totalCostUrl from '../../../common/img/total-cost.png'
import actualCostUrl from '../../../common/img/actual-cost.png'
import planProfitUrl from '../../../common/img/plan-profit.png'
import totalAmountUrl from '../../../common/img/total-amount.png'
import actualProfitUrl from '../../../common/img/actual-profit.png'
import marginDeviationUrl from '../../../common/img/margin-deviation.png'
import { formatMoney } from '../../../common/utils/tool'

export default {
  name: 'BaseInfo',
  components: {
    PieChart,
    LineChart
  },
  props: {
    financeIndexVo: {
      type: Object
    }
  },
  data() {
    return {
      baseInfo: {
        projectName: 'AS杰钊测试新报价页面01DF合同订单2',
        projectCode: 'KH991111006439JF-B',
        mianBuName: '云智造BU',
        projectManager: '顾金龙',
        milestoneName: '实施中',
        contractType: '框架合同',
        acceptanceDate: '2021-12-13'
      },
      amountList: [
        {
          label: '计划总成本',
          code: 'plannedGrossCost',
          value: '117,662,69',
          isMoney: true,
          url: totalCostUrl,
          bgColor: 'rgb(201, 223, 255)'
        },
        {
          label: '计划毛利率',
          code: 'mrdPlanGrossProfit',
          value: '20.00',
          isMoney: false,
          url: actualCostUrl,
          bgColor: 'rgb(255, 247, 229)'
        },
        {
          label: '合同总金额',
          code: 'totalContractAmount',
          value: '3,888.58',
          isMoney: true,
          url: planProfitUrl,
          bgColor: 'rgb(253, 237, 231)'
        },
        {
          label: '实际总成本',
          code: 'actualGrossCost',
          value: '543,463,44',
          isMoney: true,
          url: totalAmountUrl,
          bgColor: 'rgb(231, 248, 250)'
        },
        {
          label: '实际毛利率',
          code: 'currentActualGrossProfit',
          value: '13.87',
          isMoney: false,
          url: actualProfitUrl,
          bgColor: 'rgb(229, 246, 237)'
        },
        {
          label: '毛利率偏差',
          code: 'grossProfitDeviation',
          value: '5.20',
          isMoney: false,
          url: marginDeviationUrl,
          bgColor: 'rgb(239, 231, 243)'
        }
      ],
      lightList: [
        {
          label: '进度控制',
          code: 'process',
          twHealthyState: 'red'
        },
        {
          label: '资源情况',
          code: 'resourceSituation',
          twHealthyState: 'green'
        },
        {
          label: '范围控制',
          code: 'rangeControl',
          twHealthyState: 'yellow'
        },
        {
          label: '成本管理',
          code: 'cost',
          twHealthyState: 'red'
        },
        {
          label: '开发质量',
          code: 'developmentQuality',
          twHealthyState: 'red'
        },
        {
          label: '收入预计',
          code: 'revenueForecast',
          twHealthyState: 'red'
        },
        {
          label: '业务价值实现',
          code: 'businessValueRealization',
          twHealthyState: 'red'
        },
        {
          label: '客户关系人关系',
          code: 'customerRelationship',
          twHealthyState: 'red'
        },
        {
          label: '客户期望',
          code: 'customerExpectations',
          twHealthyState: 'red'
        },
        {
          label: 'test',
          code: 'test'
        }
      ],
      slideList: [
        {
          data: [
            { value: 6125.32, name: '已确认收入' },
            { value: 5203.1, name: '未确认收入' }
          ]
        },
        {
          data: [
            { value: 489.74, name: '已开票' },
            { value: 294.22, name: '未开票' }
          ]
        },
        {
          data: [
            { value: 2974.3, name: '已回款' },
            { value: 1002.53, name: '未回款' }
          ]
        }
      ],
      pieTitle: '收入情况（¥）',
      lineData: {
        deviation: ['120.5', '240.52', '178.54', '190.22', '236.30', '260.42'],
        mrdGrossMargin: '150',
        mrdGrossMarginAbove: '200',
        mrdGrossMarginUnder: '250',
        weekNum: ['32', '33', '41', '42', '43', '44']
      }
    }
  },
  computed: {
    transform() {
      return (value) => {
        return '¥' + formatMoney(value)
      }
    }
  },
  watch: {},
  mounted() {},
  methods: {
    changePage(current) {
      this.pieTitle = ['收入情况（¥）', '开票情况（¥）', '回款情况（¥）'][current]
    }
  }
}
</script>

<style lang="scss" scoped>
.base-data {
  margin-bottom: 10px;
  .page-card {
    display: flex;
    flex-flow: wrap;
    justify-content: center;
    background: #fff;
    border-radius: 20px 20px 0 0;
    padding: 0px 10px 0 10px;
    margin-top: -5px;
    .box-item {
      width: calc(50% - 16px);
      margin: 6px;
      border-radius: 10px;
      .box-bg {
        padding: 15px 10px;
        background: url('~@/assets/wave-bg.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        .box-content {
          display: flex;
          align-items: center;
          .box-text {
            flex: 2;
            height: 24px;
            line-height: 24px;
          }
          .box-img {
            flex: 1;
            display: flex;
            justify-content: flex-end;
          }
        }
        .box-amount {
          color: #333333;
          height: 30px;
          line-height: 30px;
        }
      }
    }
  }
  .page-evaluate {
    padding: 0 15px;
    .card-list {
      display: flex;
      flex-flow: wrap;
      justify-content: center;
      background: #fff;
      .box-item {
        display: flex;
        align-items: center;
        width: calc(50% - 12px);
        border-radius: 5px;
        background-color: rgb(245, 248, 250);
        .box-icon {
          ::v-deep .svg-icon {
            width: 18px !important;
            height: 18px !important;
          }
          color: #bdc3c7;
          .bg-red {
            color: #e74c3c;
          }
          .bg-yellow {
            color: #f1c40f;
          }
          .bg-green {
            color: #2ecc71;
          }
        }
        .box-text {
          color: #333333;
          height: 26px;
          line-height: 26px;
        }
      }
      .box-item:nth-child(odd) {
        margin: 6px 6px 6px 0;
      }
      .box-item:nth-child(even) {
        margin: 6px 0 6px 6px;
      }
      .box-item:nth-last-child(1) {
        opacity: 0;
      }
    }
  }
  .page-chart {
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
      height: 180px;
      .slide-item {
        display: flex;
        justify-content: center;
        .pie-chart {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .pie-legend {
          flex: 1;
          display: flex;
          justify-content: center;
          flex-direction: column;
          color: #333333;
          .text-box {
            margin: 5px;
            .text-label {
              height: 20px;
              line-height: 20px;
              font-size: 14px;
            }
            .text-value {
              height: 28px;
              line-height: 28px;
              font-size: 18px;
              font-weight: 600;
            }
          }
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
  .bz-text {
    color: #fff;
    height: 18px;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
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
  .fs-12 {
    font-size: 12px;
  }
  .fs-14 {
    font-size: 14px;
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
  .pt-10 {
    padding-top: 10px;
  }
  .ml-5 {
    margin-left: 5px;
  }
  .ml-10 {
    margin-left: 10px;
  }
  .mr-5 {
    margin-right: 5px;
  }
  .mr-8 {
    margin-right: 8px;
  }
  .mr-10 {
    margin-right: 10px;
  }
  .mt-5 {
    margin-top: 5px;
  }
  .mt-10 {
    margin-top: 10px;
  }
  .mb-5 {
    margin-bottom: 5px;
  }
  .mb-10 {
    margin-bottom: 5px;
  }
}
</style>
