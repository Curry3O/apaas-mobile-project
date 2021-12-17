<!--
 * @Author: your name
 * @Date: 2021-12-10 10:27:20
 * @LastEditTime: 2021-12-17 21:02:53
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\custom-page\page.vue
-->
<template>
  <div class="page">
    <PageHeadSlot>
      <template v-slot:main>
        <cube-input
          v-model="searchValue"
          :class="{ 'br-radius': !searchValue.length }"
          :clearable="true"
          placeholder="输入项目进行搜索"
          @keyup.enter.native="searchData"
        >
          <x-svg-icon slot="prepend" name="search-icon"></x-svg-icon>
        </cube-input>
      </template>
      <template v-slot:icon>
        <x-svg-icon name="refresh-icon" @click.native="refresh"></x-svg-icon>
      </template>
    </PageHeadSlot>
    <div class="page-head">
      <div class="head-title">
        <div class="opt-btn">
          <cube-button
            class="btn mr-8 fs-12"
            :primary="true"
            :inline="true"
            @click="goProjectMembers"
          >
            项目成员
          </cube-button>
          <cube-button class="btn fs-12" :primary="true" :inline="true" @click="goWeeklyDetails">
            填写周报
          </cube-button>
        </div>
        <div class="pt-10">
          <div class="bz-text fs-18 mb-5">{{ baseInfo.projectCode }}</div>
          <div class="bz-text fs-12">{{ baseInfo.projectName }}</div>
        </div>
      </div>
      <div class="head-tag">
        <cube-button class="tag-btn fs-12" :outline="true" :inline="true">
          {{ baseInfo.mianBuName }}
        </cube-button>
        <cube-button class="tag-btn fs-12" :outline="true" :inline="true">
          {{ baseInfo.projectManager }}
        </cube-button>
        <cube-button class="tag-btn fs-12" :outline="true" :inline="true">
          {{ baseInfo.milestoneName }}
        </cube-button>
        <cube-button class="tag-btn last-btn fs-12" :outline="true" :inline="true">
          {{ baseInfo.contractType }}
        </cube-button>
        <div class="mt-10 bz-text fs-12">预计验收时间：{{ baseInfo.acceptanceDate }}</div>
      </div>
      <div class="bg-radius"></div>
    </div>
    <div class="page-main">
      <BaseInfo :financeIndexVo="respData.projectFinanceIndexVo"></BaseInfo>
      <TabInfo
        :financeCostVoList="respData.projectFinanceIndexCostVoList"
        :financeIncomeVoList="respData.projectFinanceIndexIncomeVoList"
      ></TabInfo>
    </div>
  </div>
</template>

<script>
import PageHeadSlot from '../components/common/page-head-slot.vue'
import BaseInfo from '../components/pro-home/base-info.vue'
import TabInfo from '../components/pro-home/table-info.vue'
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
      baseInfo: {
        projectName: 'AS杰钊测试新报价页面01DF合同订单2',
        projectCode: 'KH991111006439JF-B',
        mianBuName: '云智造BU',
        projectManager: '顾金龙',
        milestoneName: '实施中',
        contractType: '框架合同',
        acceptanceDate: '2021-12-13'
      },
      respData: {
        projectFinanceIndexVo: {},
        projectFinanceIndexCostVoList: {},
        projectFinanceIndexIncomeVoList: {}
      }
    }
  },
  computed: {},
  created() {},
  methods: {
    // 搜索
    searchData() {
      console.log(this.searchValue)
    },
    // 刷新
    refresh() {},
    // 项目成员
    goProjectMembers() {},
    // 填写周报
    goWeeklyDetails() {}
  }
}
</script>

<style lang="scss">
.page {
  background: url('~@/assets/project-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 220px;
  .page-head {
    .head-title {
      padding: 15px 10px 10px;
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
  .page-main {
    height: calc(100vh - 220px);
    overflow: scroll;
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
