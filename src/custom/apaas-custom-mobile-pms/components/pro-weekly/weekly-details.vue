<!--
 * @Author: your name
 * @Date: 2022-01-20 17:33:04
 * @LastEditTime: 2022-02-14 22:15:40
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/pro-weekly/weekly-details.vue
-->
<template>
  <div class="weekly-details">
    <div class="page">
      <PageHeadSlot
        :backPath="backPath"
        :noBack="checkFlag"
        returnRoute="weeklyDetails"
        @go-back="handleGoBack"
      >
        <template v-slot:main>
          <div class="head-text">
            {{ headTitle }}
          </div>
        </template>
      </PageHeadSlot>
      <div class="page-head">
        <div v-if="weeklypo.projectCode" class="head-title">
          <div class="head-content">
            <div class="head-code bz-text fs-18 mb-5">
              <div>
                {{ weeklypo.projectCode }}
              </div>
              <div
                class="pro-tag fs-12 ml-10"
                :class="{
                  'bg-delay': weeklypo.speedProgress === '延期',
                  'bg-normal': weeklypo.speedProgress === '正常'
                }"
              >
                {{ weeklypo.speedProgress }}
              </div>
            </div>
            <div v-if="weeklypo.year" class="head-week fs-14">
              {{ weeklypo.year + '-' + weeklypo.week + '周' }}
            </div>
          </div>
          <div class="bz-text fs-12">
            {{ weeklypo.projectName }}
          </div>
        </div>
        <div class="head-tag">
          <cube-button
            v-if="weeklypo.mianBuName"
            class="tag-btn fs-12"
            :outline="true"
            :inline="true"
          >
            {{ weeklypo.mianBuName }}
          </cube-button>
          <cube-button
            v-if="weeklypo.projectManager"
            class="tag-btn fs-12"
            :outline="true"
            :inline="true"
          >
            {{ weeklypo.projectManager }}
          </cube-button>
          <cube-button
            v-if="weeklypo.originalCurrency"
            class="tag-btn fs-12"
            :outline="true"
            :inline="true"
          >
            {{ weeklypo.originalCurrency }}
          </cube-button>
          <cube-button
            v-if="weeklypo.milestoneName"
            class="tag-btn fs-12"
            :outline="true"
            :inline="true"
          >
            {{ weeklypo.milestoneName }}
          </cube-button>
          <div class="bottom-content mt-10 fs-12">
            <div class="content-left">
              <div v-if="weeklypo.costPrice" class="bz-text fs-14 fw-600">
                {{ weeklypo.costPrice }}
              </div>
              <div v-if="weeklypo.acceptanceDate" class="bz-text">
                预计验收时间：{{ weeklypo.acceptanceDate || '-' }}
              </div>
            </div>
            <div v-if="weeklypo.projectCode" class="content-right">
              <div class="content-img" @click="openActionItem"></div>
              <div
                v-if="actionTableData.length"
                class="item-total"
                :class="'hw-' + transNum(actionTableData.length)"
              >
                {{ actionTableData.length > 99 ? '99+' : actionTableData.length }}
              </div>
            </div>
          </div>
        </div>
        <div class="bg-radius"></div>
      </div>
      <cube-scroll
        class="page-main"
        ref="scroll"
        id="my-scroll"
        :data="costTypePoList"
        :options="cubeScrollOptions"
      >
        <div v-if="showDetail">
          <div v-if="!editMode">
            <div class="pg-title">
              <div class="pg-line"></div>
              <div class="ml-10 fs-16 fw-600">
                质量
              </div>
            </div>
            <div class="card-list">
              <div v-for="item in lightList" :key="item.code" class="box-item">
                <div class="box-icon ml-10 mr-10">
                  <x-svg-icon name="light-icon" :class="'bg-' + item.twHealthyState" />
                </div>
                <div class="box-text fs-12">
                  {{ item.label }}
                </div>
              </div>
            </div>
            <div class="pg-wrap mt-10"></div>
          </div>
          <WeeklyTable
            :editMode="editMode"
            :costVoList="costTypePoList"
            :incomeVoList="incomeTypePoList"
            :returnVoList="typePoList"
          ></WeeklyTable>
          <HealthyState :editMode="editMode" :lwSituationPoList="lwSituationPoList"></HealthyState>
          <WeeklyPlan :editMode="editMode" :progressList="progressList"></WeeklyPlan>
          <WeeklyCoordinate
            :editMode="editMode"
            :coordinateList="coordinateList"
          ></WeeklyCoordinate>
        </div>
        <div v-else>
          <WeeklyCheck ref="weeklyCheck" @show-details="handleShowDetails($event)"></WeeklyCheck>
        </div>
      </cube-scroll>
      <div v-if="editMode" class="bottom-btn">
        <cube-button @click="weeklySubmit">
          提交
        </cube-button>
      </div>
      <div v-else class="bottom-btn">
        <cube-button v-if="checkFlag" @click="checkSubmit">
          提交
        </cube-button>
        <cube-button v-else @click="checkAll">
          周报检查
        </cube-button>
      </div>
    </div>
    <ActionItemPopup ref="actionPopup"></ActionItemPopup>
    <EditRowPopup></EditRowPopup>
  </div>
</template>

<script>
import apis from '../../../common/api'
import { mapState, mapMutations } from 'vuex'
import {
  SET_SCROLL_TOP,
  SET_SD_CONFIG_FIELD,
  SET_SD_WEEKLYPO,
  SET_SD_COST_TYPE,
  SET_SD_INCOME_TYPE,
  SET_SD_TYPE_LIST,
  SET_SD_SITUATION,
  SET_SD_COORDINATE,
  SET_SD_PROGRESS
} from '../../../common/store/weekly-details.store'
import PageHeadSlot from '../common/page-head-slot.vue'
import WeeklyTable from '../pro-weekly/weekly-table.vue'
import HealthyState from '../pro-weekly/healthy-state.vue'
import WeeklyPlan from '../pro-weekly/weekly-plan.vue'
import WeeklyCoordinate from '../pro-weekly/weekly-coordinate.vue'
import ActionItemPopup from '../pro-weekly/actionItem-popup.vue'
import WeeklyCheck from '../pro-weekly/weekly-check.vue'
import EditRowPopup from '../common/editRow-popup.vue'
export default {
  name: 'WeeklyDetails',
  components: {
    PageHeadSlot,
    WeeklyTable,
    HealthyState,
    WeeklyPlan,
    WeeklyCoordinate,
    ActionItemPopup,
    WeeklyCheck,
    EditRowPopup
  },
  data() {
    return {
      headTitle: '', // 页面标题
      backPath: '', // 返回路径
      editMode: false, // 页面是否可编辑
      showDetail: true, // 是否显示详情模块
      checkFlag: false, // 是否点击周报检查按钮
      weeklypo: {}, // 周报主体数据
      costTypePoList: [], // 成本类型列表
      incomeTypePoList: [], // 收入类型列表
      typePoList: [], // 类型列表
      lwSituationPoList: [], // 上周情况列表
      coordinateList: [], // 协调列表
      progressList: {}, // 进度列表
      weeklyActionItemsList: [], // 行动项列表
      lightList: [
        {
          label: '进度控制',
          code: 'speedProgress',
          twHealthyState: null
        },
        {
          label: '资源情况',
          code: 'resourceSituation',
          twHealthyState: null
        },
        {
          label: '范围控制',
          code: 'rangeControl',
          twHealthyState: null
        },
        {
          label: '成本管理',
          code: 'costPrice',
          twHealthyState: null
        },
        {
          label: '开发质量',
          code: 'quality',
          twHealthyState: null
        },
        {
          label: '收入预计',
          code: 'incomeEstimate',
          twHealthyState: null
        },
        {
          label: '业务价值实现',
          code: 'businessValueRealize',
          twHealthyState: null
        },
        {
          label: '客户关系人关系',
          code: 'relationship',
          twHealthyState: null
        },
        {
          label: '客户期望',
          code: 'customerExpect',
          twHealthyState: null
        },
        {
          label: 'test',
          code: 'test'
        }
      ],
      returnRoute: null // 访问路径
    }
  },
  computed: {
    ...mapState({
      $_scrollTop: (state) => state.weeklyDetailsModule.$_scrollTop,
      configField: (state) => state.weeklyDetailsModule.configField,
      sd_weeklypo: (state) => state.weeklyDetailsModule.sd_weeklypo,
      sd_costTypePoList: (state) => state.weeklyDetailsModule.sd_costTypePoList,
      sd_incomeTypePoList: (state) => state.weeklyDetailsModule.sd_incomeTypePoList,
      sd_typePoList: (state) => state.weeklyDetailsModule.sd_typePoList,
      sd_lwSituationPoList: (state) => state.weeklyDetailsModule.sd_lwSituationPoList,
      sd_coordinate: (state) => state.weeklyDetailsModule.sd_coordinate,
      sd_progressList: (state) => state.weeklyDetailsModule.sd_progressList,
      actionTableData: (state) => state.addActionItemModule.actionTableData
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
        pullDownRefresh: false,
        pullUpLoad: false,
        scrollbar: false
      }
    }
  },
  watch: {},
  created() {
    const { returnRoute, type } = this.$route.query
    this.returnRoute = returnRoute
    this.editMode = type !== '0'
    if (this.returnRoute === 'proHome') {
      this.headTitle = '填写周报'
      this.backPath = './apaas-custom-financial-norm'
    } else {
      if (type === '0') {
        this.headTitle = '周报详情'
      } else if (type === '1') {
        this.headTitle = '周报编辑'
      }
      this.backPath = './apaas-custom-weekly-page'
    }
    if (this.returnRoute === 'proHome' || this.returnRoute === 'proWeekly') {
      this.loadData()
    } else {
      this.weeklypo = this.sd_weeklypo
      this.costTypePoList = this.sd_costTypePoList
      this.incomeTypePoList = this.sd_incomeTypePoList
      this.typePoList = this.sd_typePoList
      this.lwSituationPoList = this.sd_lwSituationPoList
      this.coordinateList = this.sd_coordinate
      this.progressList = this.sd_progressList
      const { editMode, showDetail, checkFlag } = this.configField
      this.editMode = editMode
      this.showDetail = showDetail
      this.checkFlag = checkFlag
    }
  },
  mounted() {
    if (this.$_scrollTop > 0) {
      this.handleScroll(this.$_scrollTop)
      this.setScrollTop(0)
    }
  },
  methods: {
    ...mapMutations('weeklyDetailsModule', {
      setScrollTop: SET_SCROLL_TOP
    }),
    ...mapMutations('weeklyDetailsModule', {
      set_sd_configField: SET_SD_CONFIG_FIELD,
      set_sd_weeklypo: SET_SD_WEEKLYPO,
      set_sd_costType: SET_SD_COST_TYPE,
      set_sd_incomeType: SET_SD_INCOME_TYPE,
      set_sd_typeList: SET_SD_TYPE_LIST,
      set_sd_situation: SET_SD_SITUATION,
      set_sd_coordinate: SET_SD_COORDINATE,
      set_sd_progress: SET_SD_PROGRESS
    }),
    handleScroll(y) {
      // this.$refs.scroll.scrollTo(0, y, 100, 'bounce')
      document.querySelector('#my-scroll').scrollTop = y
    },
    // 加载数据
    loadData() {
      const { pmsProjectCode, id, type } = this.$route.query
      const toast = this.$createToast({
        txt: 'Loading...',
        mask: true
      })
      toast.show()
      let request = {}
      if (this.returnRoute === 'proHome') {
        // 从项目首页新增周报按钮进入时
        request = {
          ...apis.GET_PROJECT_WEEKLY_DETAIL,
          params: {
            pmsProjectCode: pmsProjectCode
          }
        }
      } else if (type === '0') {
        // 从周报列表详情按钮进入时
        request = {
          ...apis.GET_PROJECT_WEEKLY_DETAIL_BY_ID,
          params: { id }
        }
      } else {
        // 从周报列表编辑按钮进入时
        request = {
          ...apis.GET_PROJECT_WEEKLY_DETAIL_EDIT,
          params: { id }
        }
      }
      this.$request(request)
        .asyncThen(
          (resp) => {
            if (resp.code === 'ok' && resp.data) {
              const { data } = resp
              this.weeklypo = data.weeklypo
              this.costTypePoList = data.costTypePoList
              this.incomeTypePoList = data.incomeTypePoList
              this.typePoList = data.typePoList
              this.lwSituationPoList = data.lwSituationPoList
              this.coordinateList = data.coordinateList || []
              this.progressList = {
                thisWeekPlan: data.weeklypo.thisWeekPlan,
                thisWeekActual: data.weeklypo.thisWeekActual,
                nextWeekPlan: data.weeklypo.nextWeekPlan
              }
              if (this.returnRoute === 'proWeekly' && data.lwSituationPoList?.length) {
                data.lwSituationPoList
                  .sort((a, b) => a.dataIndex - b.dataIndex)
                  .forEach((item, index) => {
                    this.lightList[index].twHealthyState = item.twHealthyState
                  })
              }
              this.saveAllData()
            } else {
              this.$createToast({
                txt: resp.message,
                type: 'error'
              }).show()
            }
            toast.hide()
          },
          () => {
            toast.hide()
          }
        )
        .asyncErrorCatch(() => {
          toast.hide()
        })
    },
    // 将数据保存到store
    saveAllData() {
      this.set_sd_weeklypo(this.weeklypo)
      this.set_sd_costType(this.costTypePoList)
      this.set_sd_incomeType(this.incomeTypePoList)
      this.set_sd_typeList(this.typePoList)
      this.set_sd_situation(this.lwSituationPoList)
      this.set_sd_coordinate(this.coordinateList)
      this.set_sd_progress(this.progressList)
    },
    // 打开行动项
    openActionItem() {
      this.$refs.actionPopup.showPopup()
    },
    // 周报新增或编辑提交
    weeklySubmit() {},
    // 周报检查
    checkAll() {
      this.showDetail = false
      this.checkFlag = true
      this.set_sd_configField({
        editMode: this.editMode,
        showDetail: this.showDetail,
        checkFlag: this.checkFlag
      })
    },
    // 周报检查提交
    checkSubmit() {
      this.$refs.weeklyCheck.submitActionData()
    },
    // 处理返回后页面显示逻辑
    handleGoBack() {
      this.showDetail = true
      this.checkFlag = false
    },
    // 处理按钮显示逻辑
    handleShowDetails(e) {
      this.showDetail = e
      this.checkFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
.weekly-details {
  height: 100vh;
  background: #f8f8f8;
  .page {
    background: url('~@/assets/project-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 230px;
    .head-text {
      color: #fff;
      font-size: 18px;
      font-weight: 600;
      text-align: center;
    }
    .page-head {
      .head-title {
        padding: 0px 10px 10px;
      }
      .head-tag {
        padding: 0 10px 10px;
        .tag-btn {
          color: #fff;
          background: rgb(101, 171, 255);
          border: none;
          position: static;
          height: 22px;
          min-width: 75px;
          border-radius: 5px;
          margin-right: 8px;
        }
        .bottom-content {
          display: flex;
          align-items: center;
          .content-left {
            width: 70%;
          }
          .content-right {
            width: 30%;
            display: flex;
            justify-content: flex-end;
            position: relative;
            .content-img {
              height: 50px;
              width: 50px;
              background: url('~@/custom/common/img/action-item.png');
              background-repeat: no-repeat;
              background-position: 10px 8px;
              background-size: 30px 30px;
              background-color: #f5f8fa;
              border-radius: 50%;
            }
            .item-total {
              position: absolute;
              border-radius: 50%;
              text-align: center;
              font-size: 12px;
              font-weight: 400;
              color: #fff;
              background: #ea5514;
            }
            .hw-16 {
              width: 16px;
              height: 16px;
              line-height: 16px;
              top: -7px;
              right: 3px;
            }
            .hw-18 {
              width: 18px;
              height: 18px;
              line-height: 18px;
              top: -8px;
              right: 0px;
            }
            .hw-20 {
              width: 20px;
              height: 20px;
              line-height: 20px;
              top: -10px;
              right: 0px;
            }
          }
        }
      }
      .head-content {
        display: flex;
        align-items: center;
        .head-code {
          width: 70%;
          display: flex;
          align-items: center;
          .pro-tag {
            width: 40px;
            height: 18px;
            padding-top: 2px;
            line-height: 18px;
            text-align: center;
            border-radius: 5px;
          }
          .bg-delay {
            background: #ea5514;
          }
          .bg-normal {
            background: #00a84d;
          }
        }
        .head-week {
          width: 30%;
          color: #fff;
          padding-left: 25px;
          text-align: center;
        }
      }
      .bz-text {
        color: #fff;
        height: 25px;
        line-height: 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .bg-radius {
        width: 100%;
        height: 20px;
        background: #fff;
        border-radius: 20px 20px 0 0;
      }
    }
    .page-header {
      background: transparent;
    }
    .page-main {
      background: #fff;
      height: calc(100vh - 230px);
      overflow: scroll;
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
      .card-list {
        padding: 0 15px;
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
      .pg-wrap {
        margin-top: 15px;
        width: 100%;
        height: 10px;
        background: #efeff4;
      }
    }
    .bottom-btn {
      width: 100%;
      z-index: 10;
      position: absolute;
      bottom: 15px;
      display: flex;
      justify-content: center;
      .cube-btn {
        color: #fff;
        width: 45%;
        background: linear-gradient(#33e585, #00a84d);
        font-size: 12px;
        border-radius: 6px;
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
}
</style>
