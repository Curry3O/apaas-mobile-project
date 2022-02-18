<!--
 * @Author: your name
 * @Date: 2021-12-27 15:35:18
 * @LastEditTime: 2022-02-18 16:34:07
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
            <div :class="{ 'active-item': !activeTab }" class="item-tab" @click="selectTab()">
              全部
              <div
                v-if="lightNum.twWeeklyAlreadyTotal"
                class="item-total"
                :class="'hw-' + transNum(lightNum.twWeeklyAlreadyTotal)"
              >
                {{ lightNum.twWeeklyAlreadyTotal > 99 ? '99+' : lightNum.twWeeklyAlreadyTotal }}
              </div>
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
      <div v-if="weeklyList.length">
        <cube-scroll
          id="my-scroll"
          ref="myScroll"
          class="page-main"
          :data="weeklyList"
          :options="cubeScrollOptions"
          @pulling-down="onPullingDown"
          @pulling-up="onPullingUp"
        >
          <cube-checkbox-group v-model="checkData">
            <cube-checkbox
              v-for="item in weeklyList"
              :key="item.id"
              :option="item"
              class="check-group"
              :class="{ 'hidden-box': hideCheckbox }"
            >
              <WeeklyList
                ref="weeklyList"
                :weeklyData="item"
                :hideCheckbox="hideCheckbox"
                @show-popup="openPopup($event)"
              ></WeeklyList>
            </cube-checkbox>
          </cube-checkbox-group>
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
      </div>
      <div v-if="!weeklyList.length && hiddenEmpty" class="table-empty">
        <x-empty>
          <span class="empty-text">暂无数据</span>
        </x-empty>
      </div>
    </div>
    <InspectPopup
      ref="inspectPopup"
      :weeklyReports="weeklyReports"
      @refresh-data="initData()"
    ></InspectPopup>
  </div>
</template>

<script>
import apis from '../../common/api'
import PageHeadSlot from '../components/common/components/page-head-slot.vue'
import WeeklyList from '../components/pro-weekly/components/weekly-list.vue'
import InspectPopup from '../components/pro-weekly/components/inspect-popup.vue'
import { mapState, mapMutations } from 'vuex'
import {
  SET_WEEK_SCROLL_TOP,
  SET_SEARCH_PARAMS,
  SET_WEEKLY_MODEL,
  SET_WEEKLY_REFRESH,
  INIT_WEEKLY
} from '../../common/store/project-weekly.store'
import { SET_SD_CHECK_WEEK } from '../../common/store/weekly-details.store'
import { getYearWeek } from '../../common/utils/tool'
export default {
  name: 'ProjectWeeklyPage',
  components: {
    PageHeadSlot,
    WeeklyList,
    InspectPopup
  },
  data() {
    return {
      isEmpty: true,
      hiddenEmpty: false,
      activeTab: null,
      lightNum: {
        twWeeklyAlreadyTotal: 0,
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
        isCheck: [
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
      weeklyReports: [],
      pullUpLoad: true,
      pagination: { currentPage: 1, pageSize: 10, total: 0 },
      weeklyList: [],
      checkData: [],
      hideCheckbox: true,
      returnRoute: null
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.authModule.userInfo,
      weekScrollTop: (state) => state.projectWeeklyModule.weekScrollTop,
      searchParams: (state) => state.projectWeeklyModule.searchParams,
      weeklyModel: (state) => state.projectWeeklyModule.weeklyModel,
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
        pullUpLoad: this.pullUpLoad
          ? {
              threshold: 0,
              txt: {
                more: '上滑加载更多',
                noMore: '没有更多数据了'
              }
            }
          : false,
        scrollbar: false
      }
    }
  },
  watch: {},
  created() {
    this.returnRoute = this.$route.query.returnRoute
    if (
      this.returnRoute === 'searchPro' ||
      this.returnRoute === 'searchWeekly' ||
      this.returnRoute === 'weeklyDetails'
    ) {
      this.params.searchContent = this.searchParams.searchContent
      if (this.weeklyRefresh) {
        this.params = {
          searchContent: this.searchParams.searchContent,
          week: this.searchParams.week,
          milestoneCode: this.searchParams.milestoneCode,
          isInspect: this.searchParams.isInspect
        }
        this.initData()
      } else {
        this.handleCacheData()
      }
      this.set_sd_checkWeek(false)
      this.setWeeklyRefresh(true)
    } else {
      this.initWeekly()
      this.params.week = getYearWeek(this.$dayjs(new Date()).format('YYYY-MM-DD'))
      this.initData()
    }
  },
  mounted() {
    // if (!this.weeklyRefresh && this.weekScrollTop > 0) {
    //   this.handleScroll(this.weekScrollTop)
    // }
    // this.setWeekScrollTop(0)
  },
  methods: {
    ...mapMutations('projectWeeklyModule', {
      setWeekScrollTop: SET_WEEK_SCROLL_TOP,
      setSearchParams: SET_SEARCH_PARAMS,
      setWeeklyModel: SET_WEEKLY_MODEL,
      setWeeklyRefresh: SET_WEEKLY_REFRESH,
      initWeekly: INIT_WEEKLY
    }),
    ...mapMutations('weeklyDetailsModule', {
      set_sd_checkWeek: SET_SD_CHECK_WEEK
    }),
    // 页面滚动到指定位置
    handleScroll(y) {
      document.querySelector('#my-scroll').scrollTop = 1111
    },
    initData() {
      this.isEmpty = true
      this.hiddenEmpty = false
      this.weeklyList = []
      this.hideCheckbox = true
      this.checkData = []
      this.pagination.currentPage = 1
      this.pullUpLoad = true
      this.loadData()
    },
    // 加载数据
    loadData() {
      const toast = this.$createToast({
        txt: 'Loading...',
        mask: true
      })
      toast.show()
      const request = {
        ...apis.GET_PROJECT_WEEKLY_REPORT_PRO_APP,
        params: {
          userId: this.userInfo.id,
          healthDegree: this.activeTab,
          pageIndex: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          ...this.params
        }
      }
      this.$request(request)
        .asyncThen(
          (resp) => {
            if (resp.code === 'ok' && resp.data) {
              const { weeklyReportDto, weeklyReportList } = resp.data
              this.lightNum = { ...weeklyReportDto }
              this.weeklyList = this.weeklyList.concat(weeklyReportList.result)
              this.weeklyList.forEach((item, index) => {
                item.value = item.id
                item.showWrap = index !== this.weeklyList.length - 1
              })
              this.pagination.total = weeklyReportList.count
              this.hiddenEmpty = true
              if (this.pagination.total <= this.weeklyList.length) {
                this.pullUpLoad = false
                this.$nextTick(() => {
                  this.weeklyList.length && this.$refs.myScroll.forceUpdate()
                })
              } else {
                this.pagination.currentPage += 1
              }
              this.setSearchParams({
                currentPage: this.pagination.currentPage,
                activeTab: this.activeTab,
                ...this.params
              })
              this.setWeeklyModel({
                weeklyReportDto,
                weeklyReportList
              })
              this.isEmpty = false
              toast.hide()
            } else {
              toast.hide()
              this.$createToast({
                txt: resp.message,
                type: 'error'
              }).show()
            }
          },
          () => {
            toast.hide()
          }
        )
        .asyncErrorCatch(() => {
          toast.hide()
        })
    },
    // 展示缓存数据
    handleCacheData() {
      // 查询参数
      const {
        currentPage,
        activeTab,
        searchContent,
        week,
        milestoneCode,
        isInspect
      } = this.searchParams
      this.pagination.currentPage = currentPage
      this.activeTab = activeTab
      this.params = {
        searchContent: searchContent,
        week: week,
        milestoneCode: milestoneCode,
        isInspect: isInspect
      }
      // 查询数据
      const { weeklyReportDto, weeklyReportList } = this.weeklyModel
      this.lightNum = { ...weeklyReportDto }
      this.weeklyList = weeklyReportList.result
      this.pagination.total = weeklyReportList.count
      this.isEmpty = false
    },
    // 下拉刷新
    onPullingDown() {
      this.initData()
    },
    // 上拉加载
    onPullingUp() {
      this.loadData()
    },
    // 批量检查
    openPopup(e) {
      this.weeklyReports = e
      this.$refs.inspectPopup.showPopup()
    },
    // 搜索
    goSearchPage() {
      this.isEmpty = true
      this.$router.push({
        path: './apaas-custom-search-project',
        query: {
          ...this.$route.query,
          searchContent: this.params.searchContent,
          returnRoute: 'proWeekly'
        }
      })
    },
    // 弹出层
    filterData() {
      this.$router.push({
        path: './apaas-custom-search-weekly',
        query: {
          ...this.$route.query,
          returnRoute: 'proWeekly'
        }
      })
    },
    // 筛选周数
    selectWeek() {
      this.datePicker = this.$createDatePicker({
        title: '',
        value: new Date(),
        maskClosable: false,
        cancelTxt: '重置',
        onSelect: this.selectHandle,
        onCancel: this.resetHandle
      })
      this.datePicker.show()
    },
    // 选中
    selectHandle(date) {
      this.params.week = getYearWeek(this.$dayjs(new Date(date)).format('YYYY-MM-DD'))
      this.initData()
    },
    // 重置
    resetHandle() {
      this.$set(this.params, 'week', null)
      this.initData()
    },
    // 筛选健康度
    selectTab(tab) {
      this.activeTab = tab
      this.initData()
    },
    // 批量检查
    handleCheck() {
      this.checkData = []
      this.hideCheckbox = !this.hideCheckbox
      this.weeklyList.forEach((item) => {
        item.disabled = item.whetherInspection === '是'
      })
    },
    // 提交批量检查
    submitCheck() {
      this.weeklyReports = this.weeklyList.filter((item) => this.checkData.includes(item.id))
      this.$refs.inspectPopup.showPopup()
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
            vm.handleCacheData()
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
    background: #efeff4;
    height: calc(100vh - 153px);
    overflow: scroll;
    .check-group {
      padding: 0 !important;
    }
    .hidden-box {
      ::v-deep .cube-checkbox-ui {
        display: none;
      }
    }
    ::v-deep .cube-checkbox-wrap {
      padding-bottom: 0px;
    }
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
  .table-empty {
    height: calc(100vh - 153px);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ::v-deep .cube-popup {
    top: 90px;
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
  .mt-15 {
    margin-top: 15px;
  }
  .mb-5 {
    margin-bottom: 5px;
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
  ::v-deep .cube-checkbox_checked .cube-checkbox-ui i {
    color: #0274ff;
  }
  ::v-deep .cube-btn-outline:after {
    content: none;
  }
  ::v-deep .cube-radio-ui {
    -webkit-text-stroke-width: 0px;
  }
  ::v-deep .border-bottom-1px:after,
  .border-bottom-1px:before,
  .border-left-1px:after,
  .border-left-1px:before,
  .border-right-1px:after,
  .border-right-1px:before,
  .border-top-1px:after,
  .border-top-1px:before {
    content: none;
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
