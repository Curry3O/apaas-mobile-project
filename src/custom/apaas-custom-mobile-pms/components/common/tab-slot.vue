<!--
 * @Author: your name
 * @Date: 2021-12-16 16:48:37
 * @LastEditTime: 2021-12-26 16:44:11
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\components\pro-home\tab-info.vue
-->
<template>
  <div class="tab-bar">
    <cube-tab-bar
      v-model="currentFirstTab"
      show-slider
      ref="tabFirstNav"
      class="firstTabBar"
      :style="{ width: firstTabWidth + 'px' }"
      :use-transition="false"
      :data="tabBarData"
    >
    </cube-tab-bar>
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
          v-for="(tab, tabIndex) in tabBarData"
          :key="tabIndex"
          :style="{ height: slideHeight + 'px' }"
        >
          <cube-scroll :data="tab.children" :options="scrollOptions">
            <cube-tab-bar
              v-model="currentSecondTab"
              show-slider
              class="secondTabBar"
              @change="tabChange"
            >
              <cube-tab v-for="item in tab.children" :label="item.label" :key="item.code">
                <span class="fc-blue">{{ item.label.split('/')[0] }}</span>
                <span class="fc-black">{{ ' / ' + item.label.split('/')[1] }}</span>
              </cube-tab>
            </cube-tab-bar>
            <cube-tab-panels v-model="currentSecondTab" class="tab-panel">
              <cube-tab-panel v-for="item in tab.children" :label="item.label" :key="item.label">
                <ul>
                  <li class="tab-panel-li" v-for="pItem in item.list" :key="pItem.field">
                    <div class="panel-label">{{ pItem.field }}</div>
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
          </cube-scroll>
        </cube-slide-item>
      </cube-slide>
    </div>
  </div>
</template>

<script>
import { findIndex, formatMoney } from '../../../common/utils/tool'
export default {
  name: 'TabSlot',
  props: {
    tabsData: {
      type: Array
    },
    firstTabName: {
      type: String
    },
    secondTabName: {
      type: String
    },
    firstTabWidth: {
      type: Number,
      default: 120
    },
    heightList: {
      type: Array
    }
  },
  data() {
    return {
      currentFirstTab: null,
      currentSecondTab: null,
      currentIndex: 0,
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
    this.slideHeight = this.heightList[0]
  },
  methods: {
    changePage(current) {
      this.currentIndex = current
      this.currentFirstTab = this.tabBarData[current].label
      this.currentSecondTab = this.selectedTab[current]
        ? this.selectedTab[current]
        : this.tabBarData[current].children[0].label
      this.slideHeight = this.heightList[current]
    },
    tabChange(tab) {
      this.selectedTab[this.currentIndex] = tab
    },
    scroll(pos) {
      const x = Math.abs(pos.x)
      const tabItemWidth = this.$refs.tabFirstNav.$el.clientWidth
      const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
      const deltaX = (x / slideScrollerWidth) * tabItemWidth
      this.$refs.tabFirstNav.setSliderTransform(deltaX)
    },
    editData() {}
  },
  computed: {
    initialIndex() {
      let index = 0
      index = findIndex(this.tabBarData, (item) => item.label === this.currentFirstTab)
      return index
    },
    transform() {
      return (value) => {
        if (value) {
          return formatMoney(value)
        }
        if (value == 0) {
          return '0.00'
        }
        return '-'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-bar {
  .firstTabBar {
    border-bottom: 2px solid #e8e8e8;
    ::v-deep .cube-tab {
      line-height: 24px;
      div {
        font-size: 16px;
        font-weight: 600;
      }
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
  ::v-deep .cube-tab_active {
    color: #00a84d;
  }
  ::v-deep .cube-tab-bar-slider {
    background-color: #00a84d;
    bottom: -2px;
  }
}
</style>

<style lang="stylus" rel="stylesheet/stylus">
@require "./css/cube-tab.styl"
</style>
