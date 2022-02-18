<!--
 * @Author: your name
 * @Date: 2022-02-07 15:10:12
 * @LastEditTime: 2022-02-18 14:15:17
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/pro-weekly/actionItem-popup.vue
-->
<template>
  <cube-popup ref="myPopup" type="my-popup" position="center" :mask-closable="true">
    <div class="popup-box" :class="{ 'is-Empty': !tabLabels[initialIndex].list.length }">
      <div class="box-head">
        <div class="head-title">
          行动项
        </div>
        <x-svg-icon name="close-icon" class="head-icon" @click.native="closeBtn"></x-svg-icon>
      </div>
      <div class="box-tab-bar">
        <cube-tab-bar
          ref="tabNav"
          v-model="selectedLabel"
          class="tabBar"
          show-slider
          :use-transition="false"
          :data="tabLabels"
        >
          <cube-tab v-for="item in tabLabels" :key="item.label" :label="item.label">
            <div class="tab-label">
              {{ item.label }}
              <div
                v-if="item.list.length"
                class="item-total"
                :class="'hw-' + transNum(item.list.length)"
              >
                {{ item.list.length > 99 ? '99+' : item.list.length }}
              </div>
            </div>
          </cube-tab>
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
            <cube-slide-item :class="{ 'scroll-content': tabLabels[initialIndex].list.length }">
              <cube-scroll
                ref="myScroll"
                :data="tabLabels"
                :options="cubeScrollOptions"
                @pulling-up="onPullingUp"
              >
                <cube-tab-panels v-model="selectedLabel">
                  <cube-tab-panel v-for="tab in tabLabels" :key="tab.label" :label="tab.label">
                    <div v-if="tab.list.length" class="panel-content">
                      <div v-for="(item, index) in tab.list" :key="index" class="list-item">
                        <div class="item-box">
                          <div class="box-left">
                            {{ item.keyPointContent }}
                          </div>
                          <div class="box-right">
                            <x-svg-icon
                              v-if="selectedLabel === '未完成'"
                              name="delete-icon"
                              @click.native="deleteItem(item.pkId)"
                            ></x-svg-icon>
                          </div>
                        </div>
                        <div class="item-title">
                          {{ item.title }}
                        </div>
                        <div class="item-content">
                          {{ item.content }}
                        </div>
                        <div class="item-end">
                          <div class="end-text">
                            负责人：
                            {{ item.personInChargeName }}
                          </div>
                          <div class="end-text">
                            计划完成时间：
                            {{ item.plannedCompletionTime }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="panel-empty">
                      <x-empty>
                        <span class="empty-text">暂无数据</span>
                      </x-empty>
                    </div>
                  </cube-tab-panel>
                </cube-tab-panels>
              </cube-scroll>
            </cube-slide-item>
          </cube-slide>
        </div>
      </div>
    </div>
  </cube-popup>
</template>

<script>
import apis from '../../../common/api'
import { mapState, mapMutations } from 'vuex'
import { SET_ACTION_DATA } from '../../../common/store/add-action-item.store'
import { findIndex } from '../../../common/utils/tool'
export default {
  name: 'ActionItemPopup',
  components: {},
  props: {},
  data() {
    return {
      componentPopup: null,
      selectedLabel: '未完成',
      tabLabels: [
        {
          label: '未完成',
          list: []
        },
        {
          label: '已完成',
          list: []
        }
      ],
      pagination: { currentPage: 1, pageSize: 10, total: 0 },
      pullUpLoad: true,
      slideOptions: {
        listenScroll: true,
        probeType: 3,
        directionLockThreshold: 0
      }
    }
  },
  computed: {
    ...mapState({
      configField: (state) => state.weeklyDetailsModule.configField,
      sdWeeklypo: (state) => state.weeklyDetailsModule.sdWeeklypo,
      actionTableData: (state) => state.addActionItemModule.actionTableData
    }),
    initialIndex() {
      let index = 0
      index = findIndex(this.tabLabels, (item) => item.label === this.selectedLabel)
      return index
    },
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
        pullUpLoad:
          this.selectedLabel === '已完成' && this.pullUpLoad
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
    this.$set(this.tabLabels[0], 'list', this.actionTableData)
  },
  methods: {
    ...mapMutations('addActionItemModule', {
      setActionData: SET_ACTION_DATA
    }),
    // 显示
    showPopup() {
      if (this.configField.editMode) {
        this.selectedLabel = '待提交'
        this.$set(this.tabLabels[0], 'label', '待提交')
        this.$set(this.tabLabels[1], 'label', '已提交')
      } else {
        this.selectedLabel = '未完成'
        this.$set(this.tabLabels[0], 'label', '未完成')
        this.$set(this.tabLabels[1], 'label', '已完成')
      }
      this.componentPopup = this.$refs.myPopup
      this.componentPopup.show()
      this.initFinishData()
    },
    // 关闭
    closeBtn() {
      if (this.componentPopup) {
        this.componentPopup.hide()
      }
    },
    // 删除
    deleteItem(pkId) {
      const newList = this.actionTableData.filter((item) => item.pkId !== pkId)
      this.setActionData(JSON.parse(JSON.stringify(newList)))
      this.$set(this.tabLabels[0], 'list', this.actionTableData)
    },
    // 切换tab
    changePage(current) {
      this.selectedLabel = this.tabLabels[current].label
      this.$refs.myScroll.forceUpdate()
    },
    // 初始化参数
    initFinishData() {
      this.$set(this.tabLabels[1], 'list', [])
      this.pagination.currentPage = 1
      this.pullUpLoad = true
      this.loadFinishData()
    },
    // 加载已完成数据
    loadFinishData() {
      const request = {
        ...apis.GET_WEEKLY_ACTION_ITEMS_LIST,
        params: {
          pageIndex: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          pmsProjectCode: this.sdWeeklypo.pmsProjectCode
        }
      }
      this.$request(request).asyncThen((resp) => {
        if (resp.code === 'ok' && resp.data) {
          const { result, count } = resp.data
          this.$set(this.tabLabels[1], 'list', this.tabLabels[1].list.concat(result))
          this.pagination.total = count
          if (this.pagination.total <= this.tabLabels[1].list.length) {
            this.pullUpLoad = false
            this.$nextTick(() => {
              this.tabLabels[1].list.length && this.$refs.myScroll.forceUpdate()
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
    // 上拉加载
    onPullingUp() {
      if (this.selectedLabel === '已完成') {
        this.loadFinishData()
      }
    },
    scroll(pos) {
      const x = Math.abs(pos.x)
      const tabItemWidth = this.$refs.tabNav.$el.clientWidth
      const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
      const deltaX = (x / slideScrollerWidth) * tabItemWidth
      this.$refs.tabNav.setSliderTransform(deltaX)
    }
  }
}
</script>

<style lang="scss" scoped>
.popup-box {
  height: 600px;
  background-color: #fff;
  border-radius: 10px;
  .box-head {
    font-size: 16px;
    font-weight: 600;
    padding: 10px 15px;
    color: #333333;
    text-align: center;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;
    .head-title {
      flex: 1;
    }
    .head-icon {
      width: 24px;
      color: #c7c7c7;
    }
  }
  .box-tab-bar {
    margin-top: 10px;
    .tab-slide-container {
      margin-top: -1px;
      border-top: 1px solid #e8e8e8;
    }
    .tabBar {
      border-bottom: 1px solid #e8e8e8;
      .tab-label {
        position: relative;
        font-weight: 600;
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
          top: -12px;
          right: 55px;
        }
        .hw-18 {
          width: 18px;
          height: 18px;
          line-height: 18px;
          top: -13px;
          right: 55px;
        }
        .hw-20 {
          width: 20px;
          height: 20px;
          line-height: 20px;
          top: -15px;
          right: 55px;
        }
      }
    }
    .scroll-content {
      height: calc(600px - 85px);
    }
    .panel-content {
      padding: 15px 15px 5px;
      .list-item {
        padding: 15px;
        margin-bottom: 15px;
        background: #f5f8fa;
        border-radius: 15px;
        .item-box {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          .box-left {
            flex: 1;
            font-size: 16px;
            font-weight: 600;
            color: #333333;
          }
          .box-right {
            width: 26px;
            ::v-deep .svg-icon {
              width: 26px !important;
              height: 26px !important;
              color: #999999;
            }
          }
        }
        .item-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #333333;
        }
        .item-content {
          white-space: pre-wrap;
          line-height: 20px;
          font-size: 14px;
          color: #666666;
        }
        .item-end {
          display: flex;
          align-items: center;
          margin-top: 10px;
          margin-bottom: 5px;
          .end-text {
            flex: 1;
            font-size: 12px;
            color: #999999;
          }
        }
      }
    }
    .panel-empty {
      height: 300px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      ::v-deep .svg-icon {
        width: 80px !important;
        height: 80px !important;
      }
    }
  }
}
.is-Empty {
  height: 450px;
}
::v-deep .cube-popup-container.cube-popup-center .cube-popup-content {
  top: -50% !important;
}
::v-deep .cube-popup-content {
  width: 90%;
}
::v-deep .cube-tab_active {
  color: #00a84d;
}
::v-deep .cube-tab-bar-slider {
  background-color: #00a84d;
  bottom: -2px;
}
::v-deep .cube-slide-group {
  width: 100% !important;
}
::v-deep .cube-slide-item {
  width: 100% !important;
}
</style>
