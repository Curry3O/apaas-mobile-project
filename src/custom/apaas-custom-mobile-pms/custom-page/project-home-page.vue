<!--
 * @Author: your name
 * @Date: 2021-12-10 10:27:20
 * @LastEditTime: 2022-01-13 19:34:51
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\custom-page\page.vue
-->
<template>
  <div class="home-page">
    <div class="page" :class="{ 'page-bs': isEmpty }">
      <PageHeadSlot returnRoute="proHome">
        <template v-slot:main>
          <cube-input
            v-model="searchValue"
            :class="{ 'br-radius': !searchValue.length }"
            :readonly="true"
            placeholder="搜索"
            @focus="goSearchPage"
          >
            <x-svg-icon slot="prepend" name="search-icon"></x-svg-icon>
          </cube-input>
        </template>
      </PageHeadSlot>
      <div class="page-head">
        <div v-if="!isEmpty" class="head-title">
          <div class="opt-btn">
            <cube-button
              class="btn mr-8 fs-12"
              :primary="true"
              :inline="true"
              @click="goProjectMembers"
            >
              项目成员
            </cube-button>
            <!-- <cube-button
                class="btn fs-12"
                :primary="true"
                :inline="true"
                @click="goWeeklyDetails"
              >
                填写周报
              </cube-button> -->
          </div>
          <div v-if="indexVo.projectCode" class="pt-10">
            <div class="bz-text fs-18 mb-5">
              {{ indexVo.projectCode }}
            </div>
            <div class="bz-text fs-12">
              {{ indexVo.projectName }}
            </div>
          </div>
        </div>
        <div class="head-tag">
          <cube-button
            v-if="indexVo.mianBuName"
            class="tag-btn fs-12"
            :outline="true"
            :inline="true"
          >
            {{ indexVo.mianBuName }}
          </cube-button>
          <cube-button
            v-if="indexVo.projectManager"
            class="tag-btn fs-12"
            :outline="true"
            :inline="true"
          >
            {{ indexVo.projectManager }}
          </cube-button>
          <cube-button
            v-if="indexVo.milestoneName"
            class="tag-btn fs-12"
            :outline="true"
            :inline="true"
          >
            {{ indexVo.milestoneName }}
          </cube-button>
          <cube-button
            v-if="indexVo.contractType"
            class="tag-btn last-btn fs-12"
            :outline="true"
            :inline="true"
          >
            {{ indexVo.contractType }}
          </cube-button>
          <div v-if="!isEmpty" class="bottom-text mt-10 fs-12">
            <div class="bz-text">
              预计验收时间：{{ indexVo.acceptanceDate || '-' }}
            </div>
            <div class="bz-text">
              币种：{{ indexVo.originalCurrency || '-' }}
            </div>
          </div>
        </div>
        <div class="bg-radius"></div>
      </div>
      <cube-scroll
        ref="scroll"
        :data="costVoList"
        :options="cubeScrollOptions"
        class="page-main"
        :class="{ 'page-height': isEmpty }"
        @pulling-down="onPullingDown"
      >
        <BaseInfo
          :indexVo="indexVo"
          :grossMarginVo="grossMarginVo"
          :fourPiecesVo="fourPiecesVo"
        ></BaseInfo>
        <TabInfo
          :costVoList="costVoList"
          :incomeVoList="incomeVoList"
          :returnVoList="returnVoList"
        ></TabInfo>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
import apis from '../../common/api'
import PageHeadSlot from '../components/common/page-head-slot.vue'
import BaseInfo from '../components/pro-home/base-info.vue'
import TabInfo from '../components/pro-home/table-info.vue'
import { mapState, mapMutations } from 'vuex'
import { SET_FINANCE_MODEL, INIT_FINANCE } from '../../common/store/project-home.store'
export default {
  name: 'ProjectHomePage',
  components: {
    PageHeadSlot,
    BaseInfo,
    TabInfo
  },
  data: function() {
    return {
      searchValue: '',
      isEmpty: true,
      indexVo: {}, // 项目财务指标主体信息
      grossMarginVo: {}, // 实际毛利率偏差折线图
      fourPiecesVo: {}, // 卡片里面的内容
      costVoList: [], // 成本列表
      incomeVoList: [], // 收入列表
      returnVoList: [], // 回款列表
      returnRoute: null
    }
  },
  computed: {
    ...mapState({
      financeModel: (state) => state.projectHomeModule.financeModel,
      selectedData: (state) => state.projectHomeModule.selectedData,
      homeRefresh: (state) => state.projectHomeModule.homeRefresh
    }),
    cubeScrollOptions() {
      return {
        pullDownRefresh: this.isEmpty
          ? false
          : {
            txt: '刷新成功'
          },
        pullUpLoad: false,
        scrollbar: false
      }
    }
  },
  watch: {},
  created() {
    this.returnRoute = this.$route.query.returnRoute
    if (this.returnRoute === 'searchPro') {
      if (this.selectedData.pmsProjectCode) {
        this.searchValue = this.selectedData.projectName
        if (this.homeRefresh) {
          this.loadDetailData(this.selectedData.pmsProjectCode)
        } else {
          this.handleAllData(this.financeModel)
        }
      }
    } else if (this.returnRoute === 'proMember') {
      if (this.selectedData.pmsProjectCode) {
        this.searchValue = this.selectedData.projectName
        this.handleAllData(this.financeModel)
      }
    } else {
      this.initFinance()
    }
  },
  methods: {
    ...mapMutations('projectHomeModule', {
      setFinanceModel: SET_FINANCE_MODEL,
      initFinance: INIT_FINANCE
    }),
    // 下拉刷新
    onPullingDown() {
      if (this.selectedData.pmsProjectCode) {
        this.loadDetailData(this.selectedData.pmsProjectCode)
      }
    },
    // 搜索
    goSearchPage() {
      this.isEmpty = true
      this.$router.push({
        path: './apaas-custom-search-project',
        query: {
          ...this.$route.query,
          returnRoute: 'proHome'
        }
      })
    },
    loadDetailData(pmsProjectCode) {
      const toast = this.$createToast({
        txt: 'Loading...',
        mask: true
      })
      toast.show()
      const request = {
        ...apis.GET_FINANCE_INDEX_DETAIL,
        params: { pmsProjectCode }
      }
      this.$request(request)
        .asyncThen(
          (resp) => {
            if (resp.code === 'ok' && resp.data) {
              this.handleAllData(resp.data, 'Interface')
              this.setFinanceModel({
                indexVo: this.indexVo,
                grossMarginVo: this.grossMarginVo,
                fourPiecesVo: this.fourPiecesVo,
                costVoList: this.costVoList,
                incomeVoList: this.incomeVoList,
                returnVoList: this.returnVoList
              })
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
    handleAllData(data, type) {
      if (type === 'Interface') {
        const {
          projectFinanceIndexVo,
          grossMarginDeviationVo,
          fourPiecesVo,
          projectFinanceIndexCostVoList,
          projectFinanceIndexIncomeVoList,
          projectFinanceIndexPayBackVoList
        } = data
        this.indexVo = projectFinanceIndexVo
        this.grossMarginVo = grossMarginDeviationVo
        this.fourPiecesVo = fourPiecesVo
        this.costVoList = projectFinanceIndexCostVoList
        this.incomeVoList = projectFinanceIndexIncomeVoList
        this.returnVoList = projectFinanceIndexPayBackVoList
      } else {
        const {
          indexVo,
          grossMarginVo,
          fourPiecesVo,
          costVoList,
          incomeVoList,
          returnVoList
        } = data
        this.indexVo = indexVo
        this.grossMarginVo = grossMarginVo
        this.fourPiecesVo = fourPiecesVo
        this.costVoList = costVoList
        this.incomeVoList = incomeVoList
        this.returnVoList = returnVoList
      }
      this.isEmpty = false
    },
    // 项目成员
    goProjectMembers() {
      this.$router.push({
        path: './apaas-custom-project-member',
        query: {
          ...this.$route.query,
          returnRoute: 'proHome'
        }
      })
    },
    // 填写周报
    goWeeklyDetails() {}
  }
  /* beforeRouteEnter(to, from, next) {
    if (from.name === 'apaas-custom-search-project') {
      next((vm) => {
        if (vm.selectedData.pmsProjectCode) {
          vm.searchValue = vm.selectedData.projectName
          if (vm.homeRefresh) {
            vm.loadDetailData(vm.selectedData.pmsProjectCode)
          } else {
            vm.handleAllData(vm.financeModel)
          }
        }
      })
    } else if (from.name === 'apaas-custom-project-member') {
      next((vm) => {
        if (vm.selectedData.pmsProjectCode) {
          vm.searchValue = vm.selectedData.projectName
          vm.handleAllData(vm.financeModel)
        }
      })
    } else {
      next((vm) => {
        vm.initFinance()
      })
    }
  } */
}
</script>

<style lang="scss" scoped>
.home-page {
  height: 100vh;
  background: #f8f8f8;
  .page {
    background: url('~@/assets/project-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 220px;
    .page-head {
      .head-title {
        padding: 0px 10px 10px;
        .opt-btn {
          display: flex;
          justify-content: flex-end;
          .btn {
            height: 24px;
            min-width: 70px;
            border-radius: 5px;
            color: rgb(72, 159, 255) !important;
            background: #fff;
          }
        }
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
        .last-btn {
          background: rgb(222, 235, 255);
          color: rgb(72, 159, 255);
        }
        .bottom-text {
          display: flex;
          div {
            flex: 1;
          }
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
      height: calc(100vh - 220px);
      // overflow: scroll;
    }
    .page-height {
      height: calc(100vh - 85px);
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
  .page-bs {
    background-size: 100% 85px;
  }
}
</style>
