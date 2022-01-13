<!--
 * @Author: your name
 * @Date: 2021-12-27 15:35:18
 * @LastEditTime: 2022-01-13 20:17:16
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\custom-page\project-weekly-page.vue
-->
<template>
  <div>
    <div class="weekly-page">
      <div class="page-head">
        <div class="header">
          <PageHeadSlot returnRoute="proWeekly">
            <template v-slot:main>
              <cube-input
                v-model="params.searchContent"
                :class="{ 'br-radius': !params.searchContent.length }"
                :readonly="true"
                placeholder="项目名称/编码/BU/项目经理"
                @focus="goSearchPage"
              >
                <x-svg-icon slot="prepend" name="search-icon"></x-svg-icon>
              </cube-input>
            </template>
            <template v-slot:icon>
              <div class="icon-slot">
                <div>
                  <div v-if="params.week" class="search-week mr-10" @click="selectWeek">
                    {{ params.week + '周' }}
                  </div>
                  <div v-else>
                    <x-svg-icon
                      name="calendar-icon"
                      class="search-filter mr-10"
                      @click.native="selectWeek"
                    ></x-svg-icon>
                  </div>
                </div>
                <div>
                  <x-svg-icon
                    name="filter-icon"
                    class="search-filter"
                    @click.native="filterData"
                  ></x-svg-icon>
                </div>
              </div>
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
              <div
                v-if="lightNum.redLightTotal"
                class="item-total"
                :class="'hw-' + transNum(lightNum.redLightTotal)"
              >
                {{ lightNum.redLightTotal > 99 ? '99+' : lightNum.redLightTotal }}
              </div>
            </div>
            <div
              :class="{ 'active-item': activeTab === '黄灯' }"
              class="item-tab"
              @click="selectTab('黄灯')"
            >
              黄灯
              <div
                v-if="lightNum.yellowLightTotal"
                class="item-total"
                :class="'hw-' + transNum(lightNum.yellowLightTotal)"
              >
                {{ lightNum.yellowLightTotal > 99 ? '99+' : lightNum.yellowLightTotal }}
              </div>
            </div>
            <div
              :class="{ 'active-item': activeTab === '绿灯' }"
              class="item-tab"
              @click="selectTab('绿灯')"
            >
              绿灯
              <div
                v-if="lightNum.greenLightTotal"
                class="item-total"
                :class="'hw-' + transNum(lightNum.greenLightTotal)"
              >
                {{ lightNum.greenLightTotal > 99 ? '99+' : lightNum.greenLightTotal }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <cube-scroll
        ref="scroll"
        class="page-main"
        :data="weeklyList"
        :options="cubeScrollOptions"
        @pulling-down="onPullingDown"
      >
        <WeeklyList :hideCheckbox="hideCheckbox" @check-data="checkData = $event"></WeeklyList>
      </cube-scroll>
      <div class="page-foot">
        <div v-if="hideCheckbox" class="one-btn">
          <cube-button @click="handleCheck">
            批量检查
          </cube-button>
        </div>
        <div v-else class="two-btn">
          <cube-button class="cancel-btn" @click="handleCheck">
            取消
          </cube-button>
          <cube-button :disabled="!checkData.length" @click="submitCheck">
            提交
          </cube-button>
        </div>
      </div>
      <cube-popup ref="myPopup" type="my-popup" position="top" :mask-closable="true">
        <div class="popup-box">
          <div>
            <div class="box-title">
              项目状态：
            </div>
            <div class="box-content">
              <div v-for="item in selectOptions.statusList" :key="item.value">
                <div
                  class="box-btn"
                  :class="{ 'ac-btn': params.milestoneCode === item.value }"
                  @click="selectChange('status', item.value)"
                >
                  {{ item.label }}
                </div>
              </div>
            </div>
          </div>
          <div class="mt-15">
            <div class="box-title">
              周报检查：
            </div>
            <div class="box-content">
              <div v-for="item in selectOptions.checkList" :key="item.value">
                <div
                  class="box-btn"
                  :class="{ 'ac-btn': params.isInspect === item.value }"
                  @click="selectChange('check', item.value)"
                >
                  {{ item.label }}
                </div>
              </div>
            </div>
          </div>
          <div class="bottom-btn">
            <cube-button @click="resetBtn">
              重置
            </cube-button>
            <cube-button class="confirm-btn" @click="confirmBtn">
              确定
            </cube-button>
          </div>
        </div>
      </cube-popup>
    </div>
    <!-- 暂时 1 -->
    <cube-popup ref="development" type="my-popup">
      <div
        style="background-color: rgba(0, 0, 0, 0.8); color: #fff; padding: 20px 40px;"
        @click="closePopup"
      >
        正在开发中...
      </div>
    </cube-popup>
  </div>
</template>

<script>
import PageHeadSlot from '../components/common/page-head-slot.vue'
import WeeklyList from '../components/pro-weekly/weekly-list.vue'
import { mapState, mapMutations } from 'vuex'
import { INIT_WEEKLY } from '../../common/store/project-weekly.store'
import { getYearWeek } from '../../common/utils/tool'
export default {
  name: 'ProjectWeeklyPage',
  components: {
    PageHeadSlot,
    WeeklyList
  },
  data() {
    return {
      isEmpty: true,
      activeTab: null,
      lightNum: {
        redLightTotal: 0,
        yellowLightTotal: 0,
        greenLightTotal: 0
      },
      selectOptions: {
        statusList: [
          { label: '待立项', value: 'ZB' },
          { label: '实施中', value: 'SS' },
          { label: '已上线', value: 'SX' },
          { label: '已验收', value: 'YS' },
          { label: '预交付立项', value: 'YLX' }
        ],
        checkList: [
          { label: '是', value: '是' },
          { label: '否', value: '否' }
        ]
      },
      params: {
        searchContent: '',
        week: null,
        milestoneCode: null,
        isInspect: null
      },
      componentPopup: null,
      pagination: { currentPage: 1, pageSize: 10, total: 0 },
      weeklyList: [],
      checkData: [],
      hideCheckbox: true,
      returnRoute: null,
      // 暂时 2
      temp: null,
      count: 0
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
  created() {
    this.returnRoute = this.$route.query.returnRoute
    this.params.week = getYearWeek(this.$dayjs(new Date()).format('YYYY-MM-DD'))
    if (this.returnRoute === 'searchPro') {
      if (this.searchContent) {
        this.params.searchContent = this.searchContent
        if (this.weeklyRefresh) {
          this.loadData()
        } else {
          this.handleAllData()
        }
      }
    } else {
      this.initWeekly()
    }
  },
  mounted() {
    // 暂时 3
    this.count = 0
    this.temp = this.$refs.development
    this.temp.show()
  },
  methods: {
    ...mapMutations('projectWeeklyModule', {
      initWeekly: INIT_WEEKLY
    }),
    // 暂时 4
    closePopup() {
      if (this.count === 3) {
        this.temp.hide()
      } else {
        this.count++
      }
    },
    // 加载数据
    loadData() {},
    // 处理数据
    handleAllData() {},
    // 下拉刷新
    onPullingDown() {
      if (this.params.searchContent) {
        this.loadData()
      }
    },
    // 搜索
    goSearchPage() {
      this.isEmpty = true
      this.$router.push({
        path: './apaas-custom-search-project',
        query: {
          ...this.$route.query,
          returnRoute: 'proWeekly'
        }
      })
    },
    // 弹出层
    filterData() {
      this.componentPopup = this.$refs.myPopup
      this.componentPopup.show()
    },
    // 筛选数据
    selectChange(code, value) {
      const field = code === 'status' ? 'milestoneCode' : 'isInspect'
      if (this.params[field] === value) {
        this.params[field] = null
      } else {
        this.params[field] = value
      }
    },
    // 重置
    resetBtn() {
      this.$set(this.params, 'milestoneCode', null)
      this.$set(this.params, 'isInspect', null)
    },
    // 确定
    confirmBtn() {
      if (this.componentPopup) {
        this.componentPopup.hide()
      }
    },
    // 筛选周数
    selectWeek() {
      this.datePicker = this.$createDatePicker({
        title: '',
        value: new Date(),
        onSelect: this.selectHandle,
        onCancel: this.cancelHandle
      })
      this.datePicker.show()
    },
    selectHandle(date) {
      this.params.week = getYearWeek(this.$dayjs(new Date(date)).format('YYYY-MM-DD'))
    },
    cancelHandle() {
      this.$set(this.params, 'week', null)
    },
    // 筛选健康度
    selectTab(tab) {
      this.activeTab = tab
    },
    // 批量检查
    handleCheck() {
      this.checkData = []
      this.hideCheckbox = !this.hideCheckbox
    },
    // 提交批量检查
    submitCheck() {
      console.log(this.checkData)
    }
  }
  /* beforeRouteEnter(to, from, next) {
    if (from.name === 'apaas-custom-search-project') {
      next((vm) => {
        if (vm.searchContent) {
          vm.params.searchContent = vm.searchContent
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
  } */
}
</script>

<style lang="scss" scoped>
.weekly-page {
  height: 100vh;
  background: #f8f8f8;
  position: relative;
  .page-head {
    background: url('~@/assets/project-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 150px;
    .header {
      .page-header {
        background: transparent;
        ::v-deep .left-icon {
          flex: 2 !important;
        }
        ::v-deep .right-icon {
          flex: 4 !important;
        }
        .icon-slot {
          display: flex;
          align-items: center;
          .search-week {
            flex: 1;
            line-height: 22px;
            font-size: 12px;
            color: #fff;
            border-bottom: 1px solid #fff;
          }
          .search-filter {
            flex: 1;
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
  }
  .page-main {
    background: #fff;
    height: calc(100vh - 153px);
    overflow: scroll;
  }
  .weekly-list {
    height: calc(100vh - 153px);
  }
  .page-foot {
    height: 32px;
    width: 100%;
    position: absolute;
    bottom: 0px;
    background: #fff;
    padding: 15px 0;
    .cube-btn {
      color: #fff;
      width: 60%;
      background: linear-gradient(#33e585, #00a84d);
      font-size: 12px;
      border-radius: 6px;
    }
    .one-btn {
      display: flex;
      justify-content: center;
    }
    .two-btn {
      display: flex;
      justify-content: space-around;
      .cube-btn {
        width: 40%;
      }
      .cancel-btn {
        color: #00a84d;
        background: #fff;
        border: 1px solid #00a84d;
      }
      .cube-btn_disabled {
        color: #fff;
        background: #ccc;
        border: none;
      }
      ::v-deep .cube-btn-outline:after {
        content: none;
      }
      ::v-deep .cube-btn_disabled:after {
        content: none;
      }
    }
  }
  ::v-deep .cube-popup {
    top: 90px;
  }
  .popup-box {
    background-color: #fff;
    padding: 20px 15px;
    .box-title {
      font-size: 14px;
      font-weight: 600;
      margin-left: 5px;
    }
    .box-content {
      display: flex;
      align-items: center;
      margin-top: 5px;
      flex-flow: wrap;
      .box-btn {
        width: 70px;
        height: 20px;
        font-size: 12px;
        text-align: center;
        margin: 5px;
        line-height: 20px;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
      }
      .ac-btn {
        color: #a9e676;
        border: 1px solid #a9e676;
      }
    }
    .bottom-btn {
      margin-top: 20px;
      display: flex;
      justify-content: space-around;
      .cube-btn {
        width: 20%;
        height: 24px;
        line-height: 24px;
        border-radius: 15px;
        font-size: 12px;
      }
      .confirm-btn {
        background: #027aff;
      }
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
  .mt-15 {
    margin-top: 15px;
  }
  .mb-5 {
    margin-bottom: 5px;
  }
}
</style>

<style lang="scss">
.public-form {
  .public-form--support {
    display: none !important;
  }
  .public-form-body {
    top: 0;
  }
}
</style>
