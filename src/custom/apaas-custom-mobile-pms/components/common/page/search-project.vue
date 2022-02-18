<!--
 * @Author: your name
 * @Date: 2021-12-21 10:57:59
 * @LastEditTime: 2022-02-18 16:21:07
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\components\common\search-project.vue
-->
<template>
  <div class="search-project">
    <div class="search-head">
      <div class="ph-input">
        <cube-input
          v-model="searchValue"
          v-focus
          :clearable="true"
          :class="{ 'br-radius': !hasSearchValue }"
          :placeholder="placeholder"
          @input="valueChange"
          @keyup.enter.native="searchData"
          @keyup.13="searchData"
        >
        </cube-input>
      </div>
      <div class="ph-text" @click="goBack">
        取消
      </div>
    </div>
    <div
      v-if="(!hasSearchValue && historyList.length) || returnRoute === 'proWeekly'"
      class="history-content"
    >
      <div class="hc-head">
        <div class="hc-title">
          历史搜索
        </div>
        <div class="hc-icon">
          <x-svg-icon name="delete-btn" @click.native="deleteConfirm"></x-svg-icon>
        </div>
      </div>
      <div class="hc-list">
        <div v-for="(item, index) in historyList" :key="index" class="hc-item">
          <span @click="selectedItem(item)">
            {{ item }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="hasSearchValue && returnRoute !== 'proWeekly'" class="search-content">
      <cube-scroll
        v-if="searchList.length"
        ref="myScroll"
        :data="searchList"
        :options="cubeScrollOptions"
        @pulling-up="onPullingUp"
      >
        <div v-for="item in searchList" :key="item.id" class="panel-item" @click="searchItem(item)">
          <div class="item-icon">
            <x-svg-icon name="search-icon"></x-svg-icon>
          </div>
          <div class="item-text">
            <div v-if="item.projectName.includes(searchValue)">
              <span>{{ item.projectName.split(searchValue)[0] }}</span>
              <span class="high-text">{{ searchValue }}</span>
              <span>{{ item.projectName.split(searchValue)[1] }}</span>
            </div>
            <div v-else>
              {{ item.projectName }}
            </div>
          </div>
          <div class="item-icon">
            <x-svg-icon name="arrow-right-icon"></x-svg-icon>
          </div>
        </div>
      </cube-scroll>
      <x-empty v-else>
        <span class="empty-text">暂无数据</span>
      </x-empty>
    </div>
    <x-empty v-if="!hasSearchValue && !historyList.length" class="bg-empty">
      <span class="empty-text">暂无数据</span>
    </x-empty>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { SET_SELECTED_DATA, SET_HOME_REFRESH } from '../../../../common/store/project-home.store'
import {
  SET_SEARCH_PARAMS,
  SET_WEEKLY_REFRESH
} from '../../../../common/store/project-weekly.store'
import apis from '../../../../common/api'
export default {
  name: 'SearchProject',
  components: {},
  data() {
    return {
      returnRoute: null,
      searchValue: '',
      historyList: [],
      pullUpLoad: true,
      searchList: [],
      pagination: { currentPage: 1, pageSize: 30, total: 0 }
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.authModule.userInfo,
      searchParams: (state) => state.projectWeeklyModule.searchParams
    }),
    placeholder() {
      return this.returnRoute === 'proHome' ? '输入项目进行搜索' : '项目名称/编码/BU/项目经理'
    },
    searchType() {
      return this.returnRoute === 'proHome' ? 'PMS_project' : 'PMS_weekly'
    },
    hasSearchValue() {
      return this.searchValue.length
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
        scrollbar: true
      }
    }
  },
  watch: {},
  created() {
    this.returnRoute = this.$route.query.returnRoute
    if (this.$route.query.searchContent) {
      this.searchValue = this.$route.query.searchContent
    }
    this.getHistoryRecord()
  },
  methods: {
    ...mapMutations('projectHomeModule', {
      setSelectedData: SET_SELECTED_DATA,
      setHomeRefresh: SET_HOME_REFRESH
    }),
    ...mapMutations('projectWeeklyModule', {
      setSearchParams: SET_SEARCH_PARAMS,
      setWeeklyRefresh: SET_WEEKLY_REFRESH
    }),
    initData() {
      this.searchList = []
      this.pagination.currentPage = 1
      this.pullUpLoad = true
      this.loadData()
    },
    valueChange(e) {
      this.searchList = []
      this.pagination.currentPage = 1
      this.pullUpLoad = true
      if (!e) {
        this.getHistoryRecord()
      }
    },
    // 回车搜索
    searchData() {
      if (this.returnRoute === 'proHome') {
        this.initData()
      } else {
        this.setSearchParams({ ...this.searchParams, searchContent: this.searchValue })
        this.setWeeklyRefresh(true)
        this.$router.push({
          path: './apaas-custom-weekly-page',
          query: {
            ...this.$route.query,
            returnRoute: 'searchPro'
          }
        })
      }
    },
    getHistoryRecord() {
      const request = {
        ...apis.GET_WEEKLY_SEARCH_HISTORY,
        params: {
          searchType: this.searchType,
          userId: this.userInfo.id
        }
      }
      this.$request(request).asyncThen((resp) => {
        if (resp.code === 'ok' && resp.table) {
          this.historyList = resp.table
        } else {
          this.$createToast({
            txt: resp.message,
            type: 'error'
          }).show()
        }
      })
    },
    loadData() {
      if (!this.searchValue) {
        return
      }
      const request = {
        ...apis.GET_PROJECT_FINANCE_LIST_APP,
        params: {
          projectName: this.searchValue,
          userId: this.userInfo.id,
          pageIndex: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        }
      }
      this.$request(request).asyncThen((resp) => {
        if (resp.code === 'ok' && resp.table) {
          this.searchList = this.searchList.concat(resp.table)
          this.pagination.total = resp.total
          if (this.pagination.total <= this.searchList.length) {
            this.pullUpLoad = false
            this.$nextTick(() => {
              this.searchList.length && this.$refs.myScroll.forceUpdate()
            })
          } else {
            this.pagination.currentPage += 1
          }
        } else {
          this.$createToast({
            txt: resp.message,
            type: 'error'
          }).show()
        }
      })
    },
    goBack() {
      let path = null
      if (this.returnRoute === 'proHome') {
        path = './apaas-custom-financial-norm'
        this.setHomeRefresh(false)
      } else {
        path = './apaas-custom-weekly-page'
        this.setWeeklyRefresh(false)
      }
      this.$router.push({
        path: path,
        query: {
          ...this.$route.query,
          returnRoute: 'searchPro'
        }
      })
    },
    deleteConfirm() {
      this.$createDialog({
        type: 'confirm',
        content: '确认删除全部历史记录？',
        onConfirm: () => {
          this.deleteHistory()
        }
      }).show()
    },
    deleteHistory() {
      const request = {
        ...apis.EMPTY_WEEKLY_SEARCH_HISTORY,
        params: {
          searchType: this.searchType,
          userId: this.userInfo.id
        }
      }
      this.$request(request).asyncThen((resp) => {
        if (resp.code === 'ok') {
          this.getHistoryRecord()
        } else {
          this.$createToast({
            txt: resp.message,
            type: 'error'
          }).show()
        }
      })
    },
    selectedItem(value) {
      if (this.returnRoute === 'proHome') {
        this.searchValue = value
        this.loadData()
      } else {
        this.setSearchParams({ ...this.searchParams, searchContent: value })
        this.setWeeklyRefresh(true)
        this.$router.push({
          path: './apaas-custom-weekly-page',
          query: {
            ...this.$route.query,
            returnRoute: 'searchPro'
          }
        })
      }
    },
    onPullingUp() {
      this.loadData()
    },
    searchItem(item) {
      if (this.returnRoute === 'proHome') {
        this.setSelectedData({
          projectName: item.projectName,
          pmsProjectCode: item.pmsProjectCode
        })
        this.setHomeRefresh(true)
        this.$router.push({
          path: './apaas-custom-financial-norm',
          query: {
            ...this.$route.query,
            returnRoute: 'searchPro'
          }
        })
      }
    }
  }
  /* beforeRouteEnter(to, from, next) {
    if (from.name === 'apaas-custom-financial-norm') {
      next((vm) => {
        vm.returnRoute = 'proHome'
      })
    } else if (from.name === 'apaas-custom-weekly-page') {
      next((vm) => {
        vm.returnRoute = 'proWeekly'
      })
    } else {
      next()
    }
  } */
}
</script>

<style lang="scss" scoped>
.search-project {
  background: #f8f8f8;
  .search-head {
    display: flex;
    background: #fff;
    align-items: center;
    padding: 15px 0 15px 15px;
    .ph-input {
      flex: 5;
    }
    .ph-text {
      flex: 1;
      text-align: center;
      color: #010101;
      font-weight: 600;
      font-size: 14px;
    }
    .cube-input {
      background: transparent;
    }
    ::v-deep .cube-input-field {
      font-size: 12px;
      color: #343838;
      height: 28px;
      padding: 0 10px;
      background: #f6f7fb;
      border-radius: 5px;
    }
    ::v-deep .cube-input:after {
      border: none;
    }
    ::v-deep .cube-input_active {
      .cube-input-field {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      }
    }
    ::v-deep .cube-input-append {
      height: 28px;
      background: #f6f7fb;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    ::v-deep .br-radius {
      .cube-input-field {
        border-top-right-radius: 5px !important;
        border-bottom-right-radius: 5px !important;
      }
    }
    ::v-deep input::-webkit-input-placeholder,
    textarea::-webkit-input-placeholder,
    .cube-input-field--placeholder {
      font-size: 12px !important;
    }
  }
  .history-content {
    background: #fff;
    padding: 10px 15px;
    .hc-head {
      display: flex;
      align-items: center;
      .hc-title {
        flex: 1;
        color: #242424;
        font-size: 16px;
        font-weight: 600;
      }
      .hc-icon {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        color: #9f9f9f;
        ::v-deep .svg-icon {
          height: 16px !important;
          width: 16px !important;
        }
      }
    }
    .hc-list {
      padding: 10px 0px;
      display: flex;
      flex-flow: wrap;
      align-items: center;
      .hc-item {
        margin: 5px;
        padding: 5px 15px;
        color: #070b0b;
        background: #f4f5f9;
        border-radius: 5px;
        font-size: 12px;
        line-height: 13px;
      }
    }
  }
  .search-content {
    height: calc(100vh - 58px);
    .panel-item {
      background: #fff;
      display: flex;
      align-items: center;
      padding: 5px 0;
      .item-icon {
        width: 10%;
        text-align: center;
        color: #ababab;
        ::v-deep .svg-icon {
          height: 20px !important;
          width: 20px !important;
        }
      }
      .item-text {
        width: 80%;
        font-size: 12px;
        color: #111111;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .high-text {
          color: #e67e22;
        }
      }
    }
  }
  .bg-empty {
    height: calc(100vh - 58px);
    background: #f8f8f8;
  }
  ::v-deep .x-empty {
    padding-top: 20px;
  }
}
</style>
