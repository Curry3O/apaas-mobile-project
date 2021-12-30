<!--
 * @Author: your name
 * @Date: 2021-12-29 20:02:36
 * @LastEditTime: 2021-12-30 19:45:45
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\components\pro-weekly\week-list.vue
-->
<template>
  <div class="weekly-list">
    <cube-scroll
      ref="scroll"
      :data="weeklyData"
      :options="cubeScrollOptions"
      @pulling-up="onPullingUp"
      @pulling-down="onPullingDown"
    >
      <cube-checkbox-group v-model="checkList" class="check-group">
        <cube-checkbox
          v-for="item in weeklyData"
          :key="item.id"
          :option="item"
          class="check-item"
          :class="{ 'hidden-box': hideCheckbox }"
          @input="inputChange"
        >
          <div class="item-main">
            <div class="item-head">
              <div class="head-title" :class="{ 'pl-20': !hideCheckbox }">
                <div class="title-text">
                  KH003814003722JF
                </div>
                <div class="title-icon">
                  <x-svg-icon name="light-icon" :class="'bg-' + item.twHealthyState" />
                </div>
              </div>
              <div class="head-week">
                2021-52周
              </div>
            </div>
            <div class="item-content">
              <div class="content-box">
                <div class="box-title">
                  三一重机设备互联数据采集项目-中挖
                </div>
                <div class="box-tag">
                  <cube-button class="tag-btn" :outline="true" :inline="true">
                    云制造BU
                  </cube-button>
                  <cube-button class="tag-btn" :outline="true" :inline="true">
                    顾金龙
                  </cube-button>
                  <cube-button class="tag-btn" :outline="true" :inline="true">
                    实施中
                  </cube-button>
                </div>
              </div>
              <div class="content-img"></div>
            </div>
            <div class="item-detail">
              <div class="detail-light">
                <div class="light-box">
                  <x-svg-icon name="light-icon" class="bg-red" />
                  <div class="light-value">
                    52
                  </div>
                </div>
                <div class="light-box">
                  <x-svg-icon name="light-icon" class="bg-yellow" />
                  <div class="light-value">
                    28
                  </div>
                </div>
                <div class="light-box">
                  <x-svg-icon name="light-icon" class="bg-green" />
                  <div class="light-value">
                    30
                  </div>
                </div>
              </div>
              <div class="detail-date">
                预计验收时间：2021-10-11
              </div>
            </div>
            <div class="item-card">
              <div
                v-for="card in cardList"
                :key="card.code"
                class="box-item"
                :style="{ 'background-color': card.bgColor }"
              >
                <div class="box-bg">
                  <div class="box-content">
                    <div class="box-text">
                      {{ card.label }}
                    </div>
                    <div class="box-img">
                      <img :src="card.url" />
                    </div>
                  </div>
                  <div class="box-amount fs-18 fw-600">
                    {{ card.value || card.value === 0 ? transform(card.value) : '-' }}
                  </div>
                </div>
              </div>
            </div>
            <div class="item-opt">
              <cube-button class="opt-btn" :outline="true" :inline="true">
                检查通过
              </cube-button>
              <cube-button class="opt-btn" :outline="true" :inline="true">
                编辑
              </cube-button>
            </div>
          </div>
          <div class="item-wrap"></div>
        </cube-checkbox>
      </cube-checkbox-group>
    </cube-scroll>
  </div>
</template>

<script>
import { formatMoney } from '../../../common/utils/tool'
import totalCostUrl from '../../../common/img/total-cost.png'
import actualCostUrl from '../../../common/img/actual-cost.png'
import actualProfitUrl from '../../../common/img/actual-profit.png'
import marginDeviationUrl from '../../../common/img/margin-deviation.png'
export default {
  name: 'WeeklyList',
  components: {},
  props: {
    hideCheckbox: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pullUpLoad: true,
      pullDownRefresh: true,
      weeklyData: [
        {
          id: 1,
          label: 'test',
          value: '110',
          disabled: true,
          twHealthyState: 'red'
        },
        {
          id: 2,
          label: 'tad',
          value: '220',
          disabled: true,
          twHealthyState: 'yellow'
        }
      ],
      checkList: [],
      cardList: [
        {
          label: '项目预计总成本',
          code: 'projectEstimateCost',
          value: 11752.34,
          url: totalCostUrl,
          bgColor: 'rgb(201, 223, 255)'
        },
        {
          label: '项目预计总收入',
          code: 'projectEstimateIncome',
          value: null,
          url: actualCostUrl,
          bgColor: 'rgb(255, 247, 229)'
        },
        {
          label: '本年预估本年总成本',
          code: 'tyEstimateCost',
          value: null,
          url: actualProfitUrl,
          bgColor: 'rgb(229, 246, 237)'
        },
        {
          label: '本年预估收入',
          code: 'tyEstimateIncome',
          value: null,
          url: marginDeviationUrl,
          bgColor: 'rgb(239, 231, 243)'
        }
      ],
      pagination: { currentPage: 1, pageSize: 10, total: 0 }
    }
  },
  computed: {
    transform() {
      return (value) => {
        if (value) {
          return '¥' + formatMoney(value)
        } else if (value === 0) {
          return '¥' + '0.00'
        }
        return '-'
      }
    },
    cubeScrollOptions() {
      return {
        pullUpLoad: this.pullUpLoad
          ? {
            threshold: 0,
            txt: {
              more: '上滑加载更多',
              noMore: '没有更多数据了'
            }
          }
          : false,
        pullDownRefresh: this.pullDownRefresh
          ? false
          : {
            txt: '刷新成功'
          },
        scrollbar: false
      }
    }
  },
  watch: {
    hideCheckbox: {
      handler(v) {
        this.checkList = []
        this.weeklyData.forEach((item) => {
          item.disabled = v
        })
      }
    }
  },
  created() {},
  methods: {
    // 初始化
    initData() {
      this.weeklyData = []
      this.pagination.currentPage = 1
      this.pullUpLoad = true
      this.pullDownRefresh = true
      this.loadData()
    },
    // 加载数据
    loadData() {},
    // 上拉加载
    onPullingUp() {
      this.loadData()
    },
    // 下拉刷新
    onPullingDown() {
      this.initData()
    },
    // 当前选中的复选框值的改变时
    inputChange(e) {
      this.$nextTick(() => {
        this.$emit('check-data', this.checkList)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.weekly-list {
  height: 510px;
  .check-group {
    .check-item {
      padding: 0 !important;
      .item-main {
        padding: 0 15px !important;
        .item-head {
          display: flex;
          align-items: center;
          .head-title {
            width: 70%;
            display: flex;
            align-items: center;
            .title-text {
              font-size: 18px;
              font-weight: 600;
              color: #333333;
            }
            .title-icon {
              height: 22px;
              color: #bdc3c7;
              margin-left: 5px;
            }
            ::v-deep .svg-icon {
              width: 18px !important;
              height: 18px !important;
            }
          }
          .head-week {
            width: 30%;
            font-size: 12px;
            padding-left: 25px;
            text-align: center;
            color: #027aff;
          }
        }
        .item-content {
          display: flex;
          .content-box {
            flex: 3;
            .box-title {
              font-size: 12px;
              color: #333333;
            }
            .box-tag {
              padding-bottom: 15px;
              .tag-btn {
                color: #00a84d;
                font-size: 12px;
                background: #e5f6ed;
                border: none;
                height: 22px;
                min-width: 75px;
                border-radius: 6px;
                margin-right: 8px;
              }
            }
          }
          .content-img {
            flex: 1;
            background: url('~@/assets/check-img.png');
            background-repeat: no-repeat;
            background-size: 100% 65px;
          }
        }
        .item-detail {
          margin-top: -5px;
          .detail-light {
            margin-left: -3px;
            display: flex;
            .light-box {
              display: flex;
              align-items: center;
              .x-svg-icon {
                height: 22px;
              }
              .light-value {
                margin: 0 20px 0 5px;
                font-size: 12px;
                color: #333333;
              }
              ::v-deep .svg-icon {
                width: 18px !important;
                height: 18px !important;
              }
            }
          }
          .detail-date {
            font-size: 12px;
            color: #999999;
          }
        }
        .item-card {
          display: flex;
          flex-flow: wrap;
          justify-content: space-between;
          background: #fff;
          border-radius: 20px 20px 0 0;
          margin-top: 5px;
          .box-item {
            width: calc(50% - 5px);
            margin-bottom: 10px;
            border-radius: 10px;
            .box-bg {
              padding: 10px;
              background: url('~@/assets/wave-bg.png');
              background-size: 100% 100%;
              background-repeat: no-repeat;
              .box-content {
                display: flex;
                align-items: center;
                .box-text {
                  flex: 6;
                  height: 24px;
                  line-height: 24px;
                  font-size: 13px;
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
        .item-opt {
          margin: 5px 0 12px;
          text-align: right;
          .opt-btn {
            color: #fff;
            background: linear-gradient(#33e585, #00a84d);
            font-size: 12px;
            border: none;
            height: 28px;
            line-height: 28px;
            min-width: 65px;
            border-radius: 8px;
            margin-left: 10px;
          }
        }
      }
      .item-wrap {
        margin-top: 10px;
        width: 100%;
        height: 10px;
        background: #efeff4;
      }
      ::v-deep .cube-checkbox-ui {
        position: absolute;
        top: 16px;
        left: 15px;
      }
      ::v-deep .cube-checkbox-label {
        width: 100%;
        line-height: 26px;
      }
      .bg-red {
        color: #e74c3c;
      }
      .bg-yellow {
        color: #f1c40f;
      }
      .bg-green {
        color: #2ecc71;
      }
      .pl-20 {
        padding-left: 20px;
      }
      .fs-18 {
        font-size: 18px;
      }
      .fw-600 {
        font-weight: 600;
      }
      ::v-deep .cube-btn-outline:after {
        content: none;
      }
      ::v-deep .cube-radio-ui {
        -webkit-text-stroke-width: 0px;
      }
    }
    .hidden-box {
      ::v-deep .cube-checkbox-ui {
        display: none;
      }
    }
  }
}
</style>
