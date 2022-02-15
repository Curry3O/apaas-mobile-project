<!--
 * @Author: your name
 * @Date: 2021-12-16 16:48:37
 * @LastEditTime: 2022-02-15 10:59:38
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\components\pro-home\tab-info.vue
-->
<template>
  <div class="tab-bar">
    <div class="head-box">
      <div class="head-tab">
        <cube-tab-bar
          ref="tabFirstNav"
          v-model="currentFirstTab"
          show-slider
          class="firstTabBar"
          :style="{ width: firstTabWidth + 'px' }"
          :use-transition="false"
          :data="tabBarData"
        >
        </cube-tab-bar>
      </div>
      <div v-if="showIcon" class="head-icon">
        <x-svg-icon name="question-mark" @click.native="$refs.tipComponent.showTip()" />
        <TipComponent
          ref="tipComponent"
          direction="right"
          :offsetTop="7"
          class="tips"
          :class="{ 'mr-top': !editMode }"
        >
          <template v-slot:content>
            <div class="tip-main">
              <div v-if="currentFirstTab === '毛利率'">
                <div class="mb-3">
                  计划数据来源说明：1、成本数据取自MRD报价单；2、收入，计划收入来源于ERP物料数据；3、不含税毛利率来自CRM合同数据
                </div>
                <div class="mb-3">
                  实际数据来源说明：1、成本数据取自ERP利润报表数据；2、收入，已确认收入来源于ERP利润报表数据；3、实际不含税毛利率计算公式：(已确认收入-实际发生成本)*100/已确认收入
                </div>
                <div>
                  合计来源说明：1、成本合计=预计新增成本+已发生累计成本；2、收入合计=预计收入+实际收入；3、实预计不含税毛利率计算公式：(收入合计-成本合计)*100/(收入合计)
                </div>
              </div>
              <div v-else>
                <div>
                  1、内部人天：主要是根据项目实际情况，预估投入的内部工作人天，再通过人天均价转化成内部人天成本
                </div>
                <div>2、交付费用：根据项目实际情况，预估项目所发生的差旅、招待及其他等费用</div>
                <div>3、人天外包：指项目需要第三方人天服务所产生的成本</div>
                <div>
                  4、第三方软件/实施：指项目实施过程中，涉及到第三方软件以及实施所产生的成本
                </div>
                <div>
                  5、云资源成本：指项目实施过程中，涉及到所需要的云资源（如阿里云、腾讯云）投入成本
                </div>
                <div>6、流量费成本：指项目实施过程中，涉及到所需要的SIM卡所产生的费用</div>
                <div>7、硬件成本：指项目实施过程中，涉及到第三方硬件采购的所发生的成本</div>
              </div>
            </div>
          </template>
        </TipComponent>
      </div>
    </div>
    <div class="tab-slide-container">
      <cube-slide
        ref="slide"
        :loop="false"
        :initial-index="initialIndex"
        :auto-play="false"
        :show-dots="false"
        :speed="1000"
        :options="slideOptions"
        @scroll="scroll"
        @change="changePage"
      >
        <cube-slide-item
          v-for="(tab, firstIndex) in tabBarData"
          :key="firstIndex"
          :style="{ height: slideHeight + 'px' }"
        >
          <cube-scroll :data="tab.children" :options="scrollOptions">
            <cube-tab-bar
              v-model="currentSecondTab"
              show-slider
              class="secondTabBar"
              @change="tabChange"
            >
              <cube-tab v-for="item in tab.children" :key="item.code" :label="item.label">
                <span class="fc-blue">{{ item.label.split('/')[0] }}</span>
                <span v-if="item.label.split('/')[1]" class="fc-black">
                  {{ ' / ' + item.label.split('/')[1] }}
                </span>
                <span v-if="item.label.split('/')[2]" class="fc-emerald">
                  {{ ' / ' + item.label.split('/')[2] }}
                </span>
              </cube-tab>
            </cube-tab-bar>
            <cube-tab-panels v-model="currentSecondTab" class="tab-panel">
              <cube-tab-panel
                v-for="(item, secondIndex) in tab.children"
                :key="item.label"
                :label="item.label"
              >
                <ul>
                  <li
                    v-for="(pItem, thirdIndex) in item.list"
                    :key="pItem.field"
                    class="tab-panel-li"
                    :class="{ 'tab-padding': pItem.showMore }"
                  >
                    <div class="panel-label">
                      {{ pItem.field }}
                    </div>
                    <div class="panel-value">
                      <div class="fc-blue">
                        {{ transform(pItem.value1, pItem.percentType) }}
                      </div>
                      <div v-if="!pItem.hiddenRow">
                        {{ transform(pItem.value2) }}
                      </div>
                      <div v-if="pItem.showMore">
                        {{ transform(pItem.value3) }}
                      </div>
                      <div v-if="pItem.showPremium">
                        <span class="fs-12"> 风险溢价： </span>
                        {{ transform(pItem.riskPremium) }}
                      </div>
                    </div>
                    <div v-if="pItem.canEdit && pItem.field !== '小计'" class="panel-icon">
                      <x-svg-icon
                        name="edit-panel"
                        @click.native="editData(pItem, firstIndex, secondIndex, thirdIndex)"
                      ></x-svg-icon>
                    </div>
                  </li>
                </ul>
              </cube-tab-panel>
            </cube-tab-panels>
          </cube-scroll>
        </cube-slide-item>
      </cube-slide>
    </div>
  </div>
</template>

<script>
import { findIndex, formatMoney } from '../../../common/utils/tool'
import TipComponent from '../common/tip-component.vue'
export default {
  name: 'TabSlot',
  components: {
    TipComponent
  },
  props: {
    tabsData: {
      type: Array,
      default: () => []
    },
    editMode: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    firstTabName: {
      type: String,
      default: ''
    },
    secondTabName: {
      type: String,
      default: ''
    },
    firstTabWidth: {
      type: Number,
      default: 120
    },
    secondIndexList: {
      type: Array,
      default: () => []
    },
    heightList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentFirstTab: null,
      currentSecondTab: null,
      currentIndex: 0,
      slideHeight: 0,
      selectedTab: [],
      tabBarData: [],
      slideOptions: {
        listenScroll: true,
        probeType: 3,
        directionLockThreshold: 0
      },
      scrollOptions: {
        directionLockThreshold: 0
      }
    }
  },
  computed: {
    initialIndex() {
      let index = 0
      index = findIndex(this.tabBarData, (item) => item.label === this.currentFirstTab)
      return index
    },
    transform() {
      return (value, type) => {
        const str = type ? '%' : ''
        if (value === '-') {
          return '-'
        } else if (value && !this.isNumber(Number(value))) {
          return value
        } else if (value) {
          return formatMoney(value) + str
        } else if (Number(value) === 0) {
          return '0.00' + str
        } else {
          return '-'
        }
      }
    }
  },
  watch: {
    tabsData: {
      handler(v) {
        this.tabBarData = [...v]
      },
      immediate: true
    },
    firstTabName: {
      handler(v) {
        this.currentFirstTab = v
      },
      immediate: true
    },
    secondTabName: {
      handler(v) {
        this.currentSecondTab = v
      },
      immediate: true
    }
  },
  created() {
    if (this.secondIndexList.length) {
      this.slideHeight = this.heightList[0][0]
    } else {
      this.slideHeight = this.heightList[0]
    }
    this.$bus.$on('rowData', (data) => {
      Object.keys(data)
        .filter((item) => item.includes('value'))
        .forEach((key) => {
          this.$set(
            this.tabBarData[data.fIndex].children[data.sIndex].list[data.tIndex],
            key,
            data[key]
          )
        })
      this.getRowSubtotal(
        data.fIndex,
        data.sIndex,
        this.tabBarData[data.fIndex].children[data.sIndex].list.length - 1
      )
      this.$emit('dateChange')
    })
  },
  methods: {
    changePage(current) {
      this.currentIndex = current
      this.currentFirstTab = this.tabBarData[current].label
      this.currentSecondTab = this.selectedTab[current]
        ? this.selectedTab[current]
        : this.tabBarData[current].children[0].label
      if (this.secondIndexList.length) {
        const secondIndex = this.secondIndexList[current][this.currentSecondTab]
        this.slideHeight = this.heightList[current][secondIndex]
      } else {
        this.slideHeight = this.heightList[current]
      }
    },
    tabChange(tab) {
      this.selectedTab[this.currentIndex] = tab
      if (this.secondIndexList.length) {
        const secondIndex = this.secondIndexList[this.currentIndex][tab]
        this.slideHeight = this.heightList[this.currentIndex][secondIndex]
      }
    },
    scroll(pos) {
      const x = Math.abs(pos.x)
      const tabItemWidth = this.$refs.tabFirstNav.$el.clientWidth
      const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
      const deltaX = (x / slideScrollerWidth) * tabItemWidth
      this.$refs.tabFirstNav.setSliderTransform(deltaX)
    },
    // 编辑按钮
    editData(row, fIndex, sIndex, tIndex) {
      const type = fIndex === 2 ? 'textarea' : 'input'
      const labelData = this.tabBarData[fIndex].children[sIndex].label.split('/')
      const fieldConfig = []
      labelData.forEach((label, index) => {
        if (index === labelData.length - 1 && fIndex === 1) {
          return
        }
        fieldConfig.push({
          key: row.code,
          label: label,
          value: row['value' + (index + 1)],
          type: type,
          required: type === 'input'
        })
      })
      if (row.lastFlag) {
        fieldConfig.push({
          key: row.code,
          label: '上周本年度预计',
          value: row.lastValue,
          lastFlag: row.lastFlag
        })
      }
      this.$bus.$emit('openEditPopup', {
        headRowTitle: row.field + '（¥）',
        fieldConfig: fieldConfig,
        showLastData: row.lastFlag,
        indexData: { fIndex, sIndex, tIndex }
      })
    },
    // 计算小计
    getRowSubtotal(fIndex, sIndex, tIndex) {
      let subtotal1 = 0
      let subtotal2 = 0
      this.tabBarData[fIndex].children[sIndex].list.forEach((item) => {
        if (item.code !== 'subtotal') {
          subtotal1 += this.isNumber(Number(item.value1)) ? Number(item.value1) : 0
          subtotal2 += this.isNumber(Number(item.value2)) ? Number(item.value2) : 0
        }
      })
      this.$set(this.tabBarData[fIndex].children[sIndex].list[tIndex], 'value1', subtotal1)
      this.$set(this.tabBarData[fIndex].children[sIndex].list[tIndex], 'value2', subtotal2)
    },
    // 判断是否为数字类型
    isNumber(num) {
      return typeof num === 'number' && isFinite(num)
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-bar {
  .head-box {
    display: flex;
    align-items: center;
    .head-tab {
      width: calc(100% - 54px);
      .firstTabBar {
        width: 180px !important;
        border-bottom: 2px solid #e8e8e8;
        ::v-deep .cube-tab {
          line-height: 24px;
          div {
            font-size: 16px;
            font-weight: 600;
          }
        }
      }
    }
    .head-icon {
      width: 24px;
      padding: 0 15px;
      color: #999999;
    }
  }
  .tab-slide-container {
    margin-top: -2px;
    border-top: 3px solid #e8e8e8;
  }
  .secondTabBar {
    border-bottom: 2px solid #e8e8e8;
    ::v-deep .cube-tab {
      line-height: 20px;
      font-size: 12px;
    }
  }
  .tab-panel {
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
    .tab-padding {
      padding: 5px 10px 5px 20px;
    }
    .tab-panel-li:nth-child(1) {
      border-top: none;
    }
  }
  .fs-12 {
    font-size: 12px;
  }
  .mb-3 {
    margin-bottom: 3px;
  }
  .fc-blue {
    color: #027aff;
  }
  .fc-black {
    color: #333;
  }
  .fc-emerald {
    color: #5e7d7a;
  }
  ::v-deep .cube-tab_active {
    color: #00a84d;
  }
  ::v-deep .cube-tab-bar-slider {
    background-color: #00a84d;
    bottom: -2px;
  }
  .tips {
    ::v-deep .cube-tip {
      position: absolute;
      right: 45px;
      top: 15px;
      padding: 15px 40px 15px 10px !important;
    }
  }
  .mr-top {
    ::v-deep .cube-tip {
      top: 268px;
    }
  }
}
</style>
