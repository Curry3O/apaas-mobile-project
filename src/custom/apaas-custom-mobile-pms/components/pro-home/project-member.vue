<!--
 * @Author: your name
 * @Date: 2021-12-22 16:03:08
 * @LastEditTime: 2021-12-26 13:53:44
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\components\pro-home\project-member.vue
-->
<template>
  <div class="project-member">
    <PageHeadSlot :backPath="backPath">
      <template v-slot:main>
        <div class="head-text">项目成员</div>
      </template>
      <template v-slot:icon>
        <x-svg-icon name="add-icon" @click.native="addMember"></x-svg-icon>
      </template>
    </PageHeadSlot>
    <div class="member-list">
      <cube-scroll
        v-if="memberList.length"
        ref="myScroll"
        :data="memberList"
        :options="cubeScrollOptions"
        @pulling-up="onPullingUp"
      >
        <div class="list-item">
          <div
            v-for="(item, index) in memberList"
            :key="item.id"
            class="panel-item"
            :class="{ 'bg-disable': item.state === '禁用' }"
            @click="panelClick(item.state, item.id)"
          >
            <div class="item-content">
              <div class="item-label">{{ item.roles }}</div>
              <x-svg-icon
                v-if="item.state === '禁用'"
                name="disable-icon"
                class="item-svg"
              ></x-svg-icon>
            </div>
            <div class="item-avatar">
              <x-person-avatar
                :personName="item.name"
                :style="{ background: getColor(index, item.state) }"
              ></x-person-avatar>
            </div>
            <div class="item-icon">
              <x-svg-icon name="arrow-right"></x-svg-icon>
            </div>
          </div>
        </div>
      </cube-scroll>
      <x-empty v-else>
        <span class="empty-text">暂无数据</span>
      </x-empty>
    </div>
  </div>
</template>

<script>
import apis from '../../../common/api'
import PageHeadSlot from '../common/page-head-slot.vue'
import { mapState } from 'vuex'
export default {
  name: 'ProjectMember',
  components: {
    PageHeadSlot
  },
  data() {
    return {
      backPath: './apaas-custom-project-home-page',
      memberList: [],
      colorList: [
        'linear-gradient(#71b4ff, #027aff)',
        'linear-gradient(#5CEBFF, #1BB8CE)',
        'linear-gradient(#FFD772, #F7B000)',
        'linear-gradient(#61F8A7, #00A84D)',
        'linear-gradient(#ff7675, #e74c3c)'
      ],
      pickData: {
        userName: null,
        userId: null,
        roleName: null,
        roleId: null
      },
      pullUpLoad: true,
      pagination: { currentPage: 1, pageSize: 10, total: 0 }
    }
  },
  computed: {
    ...mapState({
      selectedData: (state) => state.projectHomeModule.selectedData
    }),
    getColor() {
      return function(index, state) {
        if (state === '禁用') return 'linear-gradient(#D3D3D3, #8A8A8A)'
        const i = index % 5
        return this.colorList[i]
      }
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
  created() {},
  methods: {
    initData() {
      this.memberList = []
      this.pagination.currentPage = 1
      this.pullUpLoad = true
      this.loadData()
    },
    loadData() {
      const request = {
        ...apis.QUERY_PMS_PROJECT_MEMBER,
        params: {
          pmsProjectCode: this.selectedData.pmsProjectCode,
          pageIndex: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        }
      }
      this.$request(request).asyncThen((resp) => {
        if (resp.code === 'ok' && resp.data) {
          this.memberList = this.memberList.concat(resp.data.result)
          this.pagination.total = resp.data.count
          if (this.pagination.total <= this.memberList.length) {
            this.pullUpLoad = false
            this.$nextTick(() => {
              this.memberList.length && this.$refs.myScroll.forceUpdate()
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
    onPullingUp() {
      this.loadData()
    },
    addMember() {
      this.$router.push({
        path: './apaas-custom-add-member',
        query: {
          ...this.$route.query
        }
      })
    },
    handleClose() {},
    panelClick(state, id) {
      this.$createDialog({
        type: 'confirm',
        content: '是否' + (state === '启用' ? '禁用' : '启用') + '该员工',
        onConfirm: () => {
          this.updateState(state, id)
        }
      }).show()
    },
    updateState(state, id) {
      const request = {
        ...apis.UPDATE_PMS_PROJECT_MEMBER_APP_STATE,
        params: {
          id: id,
          state: state
        }
      }
      this.$request(request).asyncThen((resp) => {
        if (resp.code === 'ok') {
          this.$createToast({
            txt: '修改成功',
            type: 'txt'
          }).show()
          this.initData()
        } else {
          this.$createToast({
            txt: resp.message,
            type: 'error'
          }).show()
        }
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'apaas-custom-project-home-page' || from.name === 'apaas-custom-add-member') {
      next((vm) => {
        if (vm.selectedData.pmsProjectCode) {
          vm.loadData()
        } else {
          vm.pullUpLoad = false
        }
      })
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
.project-member {
  height: 100vh;
  background: #f8f8f8;
  .head-text {
    color: #333333;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }
  .member-list {
    height: 600px;
    .list-item {
      margin-top: 15px;
      .panel-item {
        margin: 10px 0;
        display: flex;
        align-items: center;
        height: 50px;
        background: #fff;
        .item-content {
          flex: 7;
          display: flex;
          align-items: center;
          color: #333333;
          padding-left: 15px;
          font-size: 14px;
          .item-label {
            display: inline-block;
            padding-right: 5px;
          }
          .item-svg {
            display: inline-block;
            ::v-deep .svg-icon {
              width: 15px !important;
              height: 16px !important;
              color: #999999 !important;
            }
          }
        }
        .item-avatar {
          flex: 2;
          display: flex;
          justify-content: flex-end;
          .x-person-avatar {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }
        }
        .item-icon {
          flex: 1;
          padding-left: 5px;
          ::v-deep .svg-icon {
            color: #999999 !important;
          }
        }
      }
      .bg-disable {
        background: #ededed;
        .item-content {
          color: #999999;
        }
      }
    }
  }
  ::v-deep .svg-icon {
    color: #333333 !important;
  }
  ::v-deep .x-person-avatar .default-avatar {
    background: transparent;
  }
  ::v-deep .x-empty {
    padding-top: 20px;
  }
}
</style>
