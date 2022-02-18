<!--
 * @Author: your name
 * @Date: 2021-12-29 20:02:36
 * @LastEditTime: 2022-02-18 16:34:06
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\components\pro-weekly\week-list.vue
-->
<template>
  <div class="weekly-list">
    <div class="item-main">
      <div class="item-head">
        <div class="head-title" :class="{ 'pl-20': !hideCheckbox }">
          <div class="title-text">
            {{ weeklyData.projectCode }}
          </div>
          <div class="title-icon">
            <x-svg-icon name="light-icon" :class="'bg-' + transLight(weeklyData.healthDegree)" />
          </div>
        </div>
        <div class="head-week">
          {{ weeklyData.year + '-' + weeklyData.week + '周' }}
        </div>
      </div>
      <div class="item-content">
        <div class="content-box">
          <div class="box-title">
            {{ weeklyData.projectName }}
          </div>
          <div class="box-tag">
            <cube-button class="tag-btn" :outline="true" :inline="true">
              {{ weeklyData.mianBuName }}
            </cube-button>
            <cube-button class="tag-btn" :outline="true" :inline="true">
              {{ weeklyData.projectManager }}
            </cube-button>
            <cube-button class="tag-btn" :outline="true" :inline="true">
              {{ weeklyData.milestoneName }}
            </cube-button>
          </div>
        </div>
        <div v-if="weeklyData.whetherInspection === '是'" class="content-img"></div>
      </div>
      <div class="item-detail">
        <div class="detail-light">
          <div class="light-box">
            <x-svg-icon name="light-icon" class="bg-red" />
            <div class="light-value">
              {{ weeklyData.redLight }}
            </div>
          </div>
          <div class="light-box">
            <x-svg-icon name="light-icon" class="bg-yellow" />
            <div class="light-value">
              {{ weeklyData.yellowLight }}
            </div>
          </div>
          <div class="light-box">
            <x-svg-icon name="light-icon" class="bg-green" />
            <div class="light-value">
              {{ weeklyData.greenLight }}
            </div>
          </div>
        </div>
        <div class="detail-date"> 里程碑计划验收日期：{{ weeklyData.acceptanceDate }} </div>
        <div class="detail-date"> 收入计划完成日期：{{ weeklyData.estimateAcceptanceDate }} </div>
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
              {{ transform(weeklyData[card.code]) }}
            </div>
          </div>
        </div>
      </div>
      <div class="item-opt">
        <cube-button
          v-if="weeklyData.whetherInspection === '否'"
          class="opt-btn"
          :outline="true"
          :inline="true"
          @click="inspectBtn"
        >
          检查通过
        </cube-button>
        <cube-button
          v-if="weeklyData.canEdit"
          class="opt-btn"
          :outline="true"
          :inline="true"
          @click="editBtn"
        >
          编辑
        </cube-button>
        <cube-button class="opt-btn" :outline="true" :inline="true" @click="detailBtn">
          详情
        </cube-button>
      </div>
    </div>
    <div class="item-wrap"></div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { SET_WEEK_SCROLL_TOP } from '../../../../common/store/project-weekly.store'
import { formatMoney } from '../../../../common/utils/tool'
import totalCostUrl from '../../../../common/img/total-cost.png'
import actualCostUrl from '../../../../common/img/actual-cost.png'
import actualProfitUrl from '../../../../common/img/actual-profit.png'
import marginDeviationUrl from '../../../../common/img/margin-deviation.png'
export default {
  name: 'WeeklyList',
  components: {},
  props: {
    weeklyData: {
      type: Object,
      default: () => {}
    },
    hideCheckbox: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      cardList: [
        {
          label: '项目预计总成本',
          code: 'projectEstimateCost',
          url: totalCostUrl,
          bgColor: 'rgb(201, 223, 255)'
        },
        {
          label: '项目预计总收入',
          code: 'projectEstimateIncome',
          url: actualCostUrl,
          bgColor: 'rgb(255, 247, 229)'
        },
        {
          label: '本年预估本年总成本',
          code: 'tyEstimateCost',
          url: actualProfitUrl,
          bgColor: 'rgb(229, 246, 237)'
        },
        {
          label: '本年预估收入',
          code: 'tyEstimateIncome',
          url: marginDeviationUrl,
          bgColor: 'rgb(239, 231, 243)'
        }
      ]
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
    transLight() {
      return (value) => {
        if (value === '绿灯') {
          return 'green'
        } else if (value === '黄灯') {
          return 'yellow'
        } else if (value === '红灯') {
          return 'red'
        }
      }
    }
  },
  watch: {},
  created() {},
  methods: {
    ...mapMutations('projectWeeklyModule', {
      setWeekScrollTop: SET_WEEK_SCROLL_TOP
    }),
    // 检查通过
    inspectBtn() {
      this.$emit('show-popup', [this.weeklyData])
    },
    // 编辑
    editBtn() {
      // const id = '#week' + this.weeklyData.id
      // this.setWeekScrollTop(document.querySelector(id).offsetTop)
      this.$router.push({
        path: './apaas-custom-weekly-details',
        query: {
          ...this.$route.query,
          id: this.weeklyData.id,
          type: '1',
          returnRoute: 'proWeekly'
        }
      })
    },
    // 详情
    detailBtn() {
      // const id = '#week' + this.weeklyData.id
      // this.setWeekScrollTop(document.querySelector(id).offsetTop)
      this.$router.push({
        path: './apaas-custom-weekly-details',
        query: {
          ...this.$route.query,
          id: this.weeklyData.id,
          type: '0',
          returnRoute: 'proWeekly'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.weekly-list {
  padding: 0 !important;
  .item-main {
    padding: 0 15px !important;
    position: relative;
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
          line-height: 27px;
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
        line-height: 26px;
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
      // margin-top: 5px;
      position: absolute;
      width: 90%;
      text-align: right;
      bottom: -30px;
      right: 15px;
      z-index: 99;
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
    margin-top: 40px;
    width: 100%;
    height: 10px;
    background: #efeff4;
  }
  .no-wrap {
    height: 0;
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
}
</style>
