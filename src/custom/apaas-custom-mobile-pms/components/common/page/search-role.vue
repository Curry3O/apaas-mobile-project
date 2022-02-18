<!--
 * @Author: your name
 * @Date: 2021-12-23 15:00:11
 * @LastEditTime: 2022-02-18 16:21:48
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\components\common\search-role.vue
-->
<template>
  <div class="search-role">
    <div class="search-head">
      <div class="ph-input">
        <cube-input
          v-model="searchValue"
          :clearable="true"
          :autofocus="true"
          :class="{ 'br-radius': !hasSearchValue }"
          placeholder="搜索角色"
          @keyup.enter.native="searchData"
          @keyup.13="searchData"
        >
        </cube-input>
      </div>
      <div class="ph-text" @click="goBack">
        取消
      </div>
    </div>
    <div class="search-content">
      <cube-scroll
        v-if="searchList.length"
        ref="myScroll"
        :data="searchList"
        :options="cubeScrollOptions"
        @pulling-up="onPullingUp"
      >
        <cube-radio-group>
          <cube-radio
            v-for="item in searchList"
            :key="item.id"
            v-model="selected.value"
            :option="item"
            class="list-item"
            @input="inputChange"
          >
            <div class="item-text">
              {{ item.lookupValueMeaning }}
            </div>
            <div class="item-icon">
              <x-svg-icon name="arrow-right-icon"></x-svg-icon>
            </div>
          </cube-radio>
        </cube-radio-group>
      </cube-scroll>
      <x-empty v-else>
        <span class="empty-text">暂无数据</span>
      </x-empty>
    </div>
    <div class="search-bottom">
      <div class="remark-text">
        <span>
          {{ '单选，已选择【' + (selected.selectItem.lookupValueMeaning || '') + '】' }}
        </span>
      </div>
      <div class="bottom-btn">
        <cube-button @click="confirmBtn">
          确定
        </cube-button>
      </div>
    </div>
  </div>
</template>

<script>
import apis from '../../../../common/api'
import { mapState, mapMutations } from 'vuex'
import { SET_MEMBER_MODEL } from '../../../../common/store/add-member.store.js'
export default {
  name: 'SearchRole',
  data() {
    return {
      searchValue: '',
      selected: {
        value: null,
        selectItem: {}
      },
      pullUpLoad: true,
      searchList: [],
      returnRoute: null,
      pagination: { currentPage: 1, pageSize: 20, total: 0 }
    }
  },
  computed: {
    ...mapState({
      memberModel: (state) => state.addMemberModule.memberModel
    }),
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
  watch: {
    searchValue(v) {
      if (!v) {
        this.initData()
      }
    }
  },
  created() {
    this.returnRoute = this.$route.query.returnRoute
    this.initData()
  },
  methods: {
    ...mapMutations('addMemberModule', {
      setMemberModel: SET_MEMBER_MODEL
    }),
    initData() {
      this.searchList = []
      this.pagination.currentPage = 1
      this.pullUpLoad = true
      this.loadData()
    },
    searchData() {
      this.initData()
    },
    loadData() {
      const request = {
        ...apis.GET_WEEKLY_LOOKUP_VALUE,
        params: {
          lookupValueMeaning: this.searchValue,
          lookupTypeCode: 'BUDGET_ROLE',
          pageIndex: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        }
      }
      this.$request(request).asyncThen((resp) => {
        if (resp.code === 'ok' && resp.table) {
          resp.table.forEach((item) => {
            item.value = item.id
          })
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
      this.$router.go(-1)
    },
    onPullingUp() {
      this.loadData()
    },
    inputChange(e) {
      const data = this.searchList.filter((item) => item.id === e)[0]
      this.$set(this.selected, 'selectItem', data)
    },
    confirmBtn() {
      if (Object.keys(this.selected.selectItem).length) {
        let path = null
        const { lookupValueMeaning, id } = this.selected.selectItem
        if (this.returnRoute === 'addMember') {
          path = './apaas-custom-add-member'
          this.setMemberModel({
            userName: this.memberModel.userName,
            userId: this.memberModel.userId,
            roleName: lookupValueMeaning,
            roleId: id
          })
        }
        this.$router.push({
          path: path,
          query: {
            ...this.$route.query,
            returnRoute: 'searchRole'
          }
        })
      }
    }
  }
  /* beforeRouteEnter(to, from, next) {
    if (from.name === 'apaas-custom-add-member') {
      next((vm) => {
        vm.returnRoute = 'addMember'
      })
    } else {
      next()
    }
  } */
}
</script>

<style lang="scss" scoped>
.search-role {
  height: 100vh;
  background: #fff;
  position: relative;
  .search-head {
    display: flex;
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
  .search-content {
    height: calc(100vh - 158px);
    background: #f8f8f8;
    .list-item {
      background: #fff;
      display: flex;
      align-items: center;
      padding: 0px 10px;
      ::v-deep .cube-radio-ui {
        margin-right: 10px;
      }
      .item-text {
        width: 90%;
        font-size: 12px;
        color: #111111;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .item-icon {
        width: 10%;
        text-align: center;
        color: #ababab;
        ::v-deep .svg-icon {
          height: 20px !important;
          width: 20px !important;
        }
      }
    }
  }
  ::v-deep .x-empty {
    padding-top: 20px;
  }
  .search-bottom {
    height: 100px;
    width: 100%;
    position: absolute;
    bottom: 0px;
    .remark-text {
      background: #f8f8f8;
      color: #999999;
      padding: 20px 10px 0;
      text-align: right;
    }
    .bottom-btn {
      height: calc(100vh - 553px);
      background: #f8f8f8;
      padding: 10px 20px 20px;
      .cube-btn {
        background: #027aff;
      }
    }
  }
  ::v-deep .cube-radio-ui {
    -webkit-text-stroke-width: 0px;
  }
  ::v-deep .cube-radio_selected .cube-radio-ui {
    background-color: #0274ff;
  }
}
</style>
