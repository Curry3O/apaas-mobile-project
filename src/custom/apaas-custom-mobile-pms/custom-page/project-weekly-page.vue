<!--
 * @Author: your name
 * @Date: 2021-12-27 15:35:18
 * @LastEditTime: 2021-12-28 11:51:24
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\custom-page\project-weekly-page.vue
-->
<template>
  <div class="weekly-page">
    <cube-scroll
      ref="scroll"
      :data="weeklyList"
      :options="cubeScrollOptions"
      @pulling-down="onPullingDown"
    >
      <div class="page">
        <div class="page-head">
          <PageHeadSlot :backPath="backPath">
            <template v-slot:main>
              <cube-input
                v-model="searchValue"
                :class="{ 'br-radius': !searchValue.length }"
                :readonly="true"
                placeholder="项目名称/编码/BU/项目经理"
                @focus="goSearchPage"
              >
                <x-svg-icon slot="prepend" name="search-icon"></x-svg-icon>
              </cube-input>
            </template>
            <template v-slot:icon>
              <x-svg-icon name="filter-icon" class="bigIcon" @click="filterData"></x-svg-icon>
            </template>
          </PageHeadSlot>
          <div class="header-tab">
            <div :class="{ 'active-item': !activeTab }" @click="selectTab()">
              全部
            </div>
            <div
              :class="{ 'active-item': activeTab === '红灯' }"
              class="item-tab"
              @click="selectTab('红灯')"
            >
              红灯
              <div v-if="redLightTotal" class="item-total" :class="'hw-' + transNum(redLightTotal)">
                {{ redLightTotal > 99 ? '99+' : redLightTotal }}
              </div>
            </div>
            <div
              :class="{ 'active-item': activeTab === '黄灯' }"
              class="item-tab"
              @click="selectTab('黄灯')"
            >
              黄灯
              <div
                v-if="yellowLightTotal"
                class="item-total"
                :class="'hw-' + transNum(yellowLightTotal)"
              >
                {{ yellowLightTotal > 99 ? '99+' : yellowLightTotal }}
              </div>
            </div>
            <div
              :class="{ 'active-item': activeTab === '绿灯' }"
              class="item-tab"
              @click="selectTab('绿灯')"
            >
              绿灯
              <div
                v-if="greenLightTotal"
                class="item-total"
                :class="'hw-' + transNum(greenLightTotal)"
              >
                {{ greenLightTotal > 99 ? '99+' : greenLightTotal }}
              </div>
            </div>
          </div>
        </div>
        <div class="page-main">
          1111
        </div>
      </div>
    </cube-scroll>
  </div>
</template>

<script>
import PageHeadSlot from '../components/common/page-head-slot.vue'
import { mapState, mapMutations } from 'vuex'
import { INIT_WEEKLY } from '../../common/store/project-weekly.store'
export default {
  name: 'ProjectWeeklyPage',
  components: {
    PageHeadSlot
  },
  data() {
    return {
      backPath: './menu',
      searchValue: '',
      isEmpty: true,
      activeTab: null,
      redLightTotal: 1,
      yellowLightTotal: 0,
      greenLightTotal: 13,
      weeklyList: []
    }
  },
  computed: {
    ...mapState({
      searchContent: (state) => state.projectWeeklyModule.searchContent,
      weeklyRefresh: (state) => state.projectWeeklyModule.weeklyRefresh
    }),
    transNum() {
      return function(num) {
        if (num > 99) {
          return 20
        } else if (num > 10) {
          return 18
        } else return 16
      }
    },
    cubeScrollOptions() {
      return {
        pullDownRefresh: this.isEmpty
          ? false
          : {
              txt: '刷新成功'
            },
        scrollbar: false
      }
    }
  },
  watch: {},
  created() {},
  methods: {
    ...mapMutations('projectWeeklyModule', {
      initWeekly: INIT_WEEKLY
    }),
    // 加载数据
    loadData() {},
    // 处理数据
    handleAllData() {},
    // 下拉刷新
    onPullingDown() {
      if (this.searchValue) {
        this.loadData()
      }
    },
    // 搜索
    goSearchPage() {
      this.isEmpty = true
      this.$router.push({
        path: './apaas-custom-search-project',
        query: {
          ...this.$route.query
        }
      })
    },
    // 过滤数据
    filterData() {},
    // 筛选健康度
    selectTab(tab) {
      this.activeTab = tab
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'apaas-custom-search-project') {
      next((vm) => {
        if (vm.searchContent) {
          vm.searchValue = vm.searchContent
          if (vm.weeklyRefresh) {
            vm.loadData()
          } else {
            vm.handleAllData()
          }
        }
      })
    } else {
      next((vm) => {
        vm.initWeekly()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.weekly-page {
  height: 100vh;
  background: #f8f8f8;
  .page {
    background: url('~@/assets/project-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 150px;
    .page-head {
      .page-header {
        background: transparent;
        .bigIcon {
          ::v-deep .svg-icon {
            height: 24px !important;
            width: 24px !important;
          }
        }
      }
      .header-tab {
        display: flex;
        color: #fff;
        padding: 10px 10px 8px;
        font-size: 14px;
        justify-content: space-around;
        align-items: center;
        .item-tab {
          position: relative;
          .item-total {
            position: absolute;
            border-radius: 50%;
            text-align: center;
            font-size: 12px;
            background: #eba98c;
          }
          .hw-16 {
            width: 16px;
            height: 16px;
            line-height: 16px;
            top: -12px;
            right: -12px;
          }
          .hw-18 {
            width: 18px;
            height: 18px;
            line-height: 18px;
            top: -13px;
            right: -13px;
          }
          .hw-20 {
            width: 20px;
            height: 20px;
            line-height: 20px;
            top: -15px;
            right: -15px;
          }
        }
        .active-item {
          font-size: 15px;
          font-weight: 600;
        }
      }
    }
    .page-main {
      background: #fff;
      height: calc(100vh - 220px);
      overflow: scroll;
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
  .mt-10 {
    margin-top: 10px;
  }
  .mb-5 {
    margin-bottom: 5px;
  }
}
</style>
