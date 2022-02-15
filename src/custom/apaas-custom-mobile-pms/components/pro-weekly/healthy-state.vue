<!--
 * @Author: your name
 * @Date: 2022-01-24 12:21:28
 * @LastEditTime: 2022-02-15 11:36:40
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/pro-weekly/healthy-state.vue
-->
<template>
  <div class="healthy-state">
    <div class="healthy-title fs-16 fw-600">
      健康度
    </div>
    <div v-for="(item, index) in situationList" :key="item.id">
      <CollapseSlot
        :collapseKey="index"
        :collapseLabel="item.situationContent"
        @draw-back="situationList[index].shrink = $event"
      >
        <template v-slot:header>
          <div class="head-area">
            <div class="light" :class="{ 'hidden-light': !item.shrink }">
              <div>上周：</div>
              <x-svg-icon name="light-icon" :class="'bg-' + item.lwHealthyState" />
              <div class="pl-10">本周：</div>
              <x-svg-icon name="light-icon" :class="'bg-' + item.twHealthyState" />
            </div>
            <cube-button
              :id="'btn' + index"
              class="btn"
              :outline="true"
              :inline="true"
              @click="goTaskPage(item, '#btn' + index)"
            >
              任务数：{{ item.taskNums }}
            </cube-button>
          </div>
        </template>
        <template v-slot:main>
          <div class="content-area">
            <div class="tw-label">
              <div class="label-text">本周异常说明及解决措施</div>
              <div class="label-light">
                <div class="light-item" @click="changeStatus(item, index, 'green')">
                  <div>绿</div>
                  <x-svg-icon
                    name="light-icon"
                    class="mr-15"
                    :class="{ 'bg-green': item.twHealthyState == 'green' }"
                  />
                </div>
                <div class="light-item" @click="changeStatus(item, index, 'yellow')">
                  <div>黄</div>
                  <x-svg-icon
                    name="light-icon"
                    class="mr-15"
                    :class="{ 'bg-yellow': item.twHealthyState == 'yellow' }"
                  />
                </div>
                <div class="light-item" @click="changeStatus(item, index, 'red')">
                  <div>红</div>
                  <x-svg-icon
                    name="light-icon"
                    class="mr-15"
                    :class="{ 'bg-red': item.twHealthyState == 'red' }"
                  />
                </div>
              </div>
              <div class="label-icon">
                <x-svg-icon
                  name="question-mark"
                  @click.native="$refs.tipComponent[index].showTip()"
                />
                <TipComponent class="tips" ref="tipComponent" direction="right" :offsetTop="8">
                  <template v-slot:content>
                    <div class="tip-main">
                      <!-- <div v-html="item.weeklyReportStandard"></div> -->
                      <div class="flex-box">
                        <x-svg-icon name="light-icon" class="bg-green mr-5" />
                        {{ item.weeklyReportStandard[0] }}
                      </div>
                      <div class="flex-box">
                        <x-svg-icon name="light-icon" class="bg-yellow mr-5" />
                        {{ item.weeklyReportStandard[1] }}
                      </div>
                      <div class="flex-box">
                        <x-svg-icon name="light-icon" class="bg-red mr-5" />
                        {{ item.weeklyReportStandard[2] }}
                      </div>
                      <div v-if="item.weeklyReportStandard[3]" class="flex-box">
                        <div :class="'dw-' + (index === 4 ? '156' : '42')">备注：</div>
                        {{ item.weeklyReportStandard[3] }}
                      </div>
                    </div>
                  </template>
                </TipComponent>
              </div>
            </div>
            <div class="textarea">
              <cube-textarea
                v-model="item.twExplain"
                :disabled="!editMode"
                :class="{ 'disable-text': !editMode }"
                placeholder="请输入本周异常说明及解决措施"
                :maxlength="200"
              ></cube-textarea>
            </div>
            <div class="lw-label">
              <div class="label-text">上周异常说明及解决措施</div>
              <div class="label-icon">
                <div>{{ transLight(item.lwHealthyState) }}</div>
                <x-svg-icon name="light-icon" :class="'bg-' + item.lwHealthyState" />
              </div>
            </div>
            <div class="textarea disable-text">
              <cube-textarea v-model="item.twExplain" :disabled="true"></cube-textarea>
            </div>
          </div>
        </template>
      </CollapseSlot>
    </div>
    <div class="item-wrap"></div>
  </div>
</template>

<script>
import CollapseSlot from '../common/collapse-slot.vue'
import TipComponent from '../common/tip-component.vue'
import { mapState, mapMutations } from 'vuex'
import { SET_SCROLL_TOP, SET_SD_SITUATION } from '../../../common/store/weekly-details.store'
import { CLEAR_ACTION_ITEM_MODEL } from '../../../common/store/add-action-item.store'
export default {
  name: 'HealthyState',
  components: {
    CollapseSlot,
    TipComponent
  },
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    lwSituationPoList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      situationList: [],
      returnRoute: null
    }
  },
  computed: {
    ...mapState({
      actionItemModel: (state) => state.addActionItemModule.actionItemModel,
      sd_lwSituationPoList: (state) => state.weeklyDetailsModule.sd_lwSituationPoList,
      actionTableData: (state) => state.addActionItemModule.actionTableData
    }),
    transLight() {
      return (value) => {
        if (value === 'green') {
          return '绿'
        } else if (value === 'yellow') {
          return '黄'
        } else if (value === 'red') {
          return '红'
        } else {
          return ''
        }
      }
    },
    rowTip() {
      const kvArray = [
        [
          '进度控制',
          [
            '按项目立项里程碑节点按期完成，无偏差',
            '按项目立项里程碑节点偏差 >= 二周',
            '按项目立项里程碑节点偏差 >= 四周'
          ]
        ],
        [
          '资源情况',
          [
            '项目人员正常，项目进度正常保障',
            '项目组资源出现短缺，且影响项目进度 >= 二周',
            '项目组资源出现短缺，且影响项目进度 >= 四周'
          ]
        ],
        [
          '范围控制',
          [
            '项目范围正常，无任何扩散需求情况',
            '项目范围有蔓延，造成成本增加 >= 5%',
            '项目范围有蔓延，造成成本增加 >= 10%'
          ]
        ],
        [
          '成本管理',
          ['项目成本正常，无超支甚至有成本节约', '项目成本增加 >= 5%', '项目成本增加 >= 10%']
        ],
        [
          '开发质量',
          [
            'PM按版本测试功能无BUG',
            'PM按版本测试功能BUG数 <= 3个，不能有阻断性BUG',
            'PM或项目组员未测试版本功能或者未完成全部功能测试或 PM按版本测试功能BUG数 >3 个',
            '1、第三方软件和内部软件PM都需要点击或现场测试，保障功能正常；2、更新研发规定，系统上线前测试用例通过率 > 98%，不能有阻断性BUG，严重BUG需要专题会议决策'
          ]
        ],
        [
          '收入预计',
          [
            '按项目节点完成收入，无风险，无时间节点和收入金额偏差',
            '按项目节点完成收入时间偏差 >= 二周或按项目节点完成收入金额偏差 > 5%',
            '按项目节点完成收入时间偏差 >= 四周或按项目节点完成收入金额偏差 > 10%或按节点造成按月收入偏差',
            '1、年底12月确认全黄；2、以变更后时间为准'
          ]
        ],
        [
          '业务价值实现',
          [
            '客户所有业务全部在系统上运行，客户满意度高',
            '客户仅仅试用系统或者偶尔用一下或者仅仅用于展示',
            '客户基本不使用系统'
          ]
        ],
        [
          '客户关系人关系',
          [
            '客户和项目验收相关的干系人识别到，关系维护良好，定期沟通，或主动给我们新的业务、订单机会，或在各种场合愿意为我们说话，站台',
            '客户对于我们的服务有抱怨',
            '客户反馈服务不到位，甚至要投诉或者发生投诉'
          ]
        ],
        [
          '客户期望',
          [
            '客户反馈业务价值得到满足或者超出客户期望',
            '客户反馈有部分业务价值得不到实现',
            '客户反馈提供的服务没有产生业务价值，甚至不是客户想要的'
          ]
        ]
      ]
      return new Map(kvArray)
    }
  },
  watch: {
    lwSituationPoList: {
      handler(v) {
        let data = [...v]
        data.sort((a, b) => a.dataIndex - b.dataIndex)
        data.forEach((row) => {
          row.shrink = true
          if (this.rowTip.has(row.situationContent)) {
            row.weeklyReportStandard = this.rowTip.get(row.situationContent)
          }
          row.doneTasks = row.doneTasks ? row.doneTasks : 0
          row.taskNums = row.doneTasks + row.undoneTasks
        })
        this.situationList = [...data]
      }
    }
  },
  mounted() {
    const { returnRoute } = this.$route.query
    this.returnRoute = returnRoute
    if (this.returnRoute === 'addActionItem') {
      const data = this.sd_lwSituationPoList
      data.forEach((row) => {
        row.doneTasks = this.actionTableData.filter(
          (item) => item.situationType === row.situationType
        ).length
        row.taskNums = row.doneTasks + row.undoneTasks
      })
      this.situationList = [...data]
    }
  },
  methods: {
    ...mapMutations('weeklyDetailsModule', {
      setScrollTop: SET_SCROLL_TOP,
      set_sd_situation: SET_SD_SITUATION
    }),
    ...mapMutations('addActionItemModule', {
      clearActionItemModel: CLEAR_ACTION_ITEM_MODEL
    }),
    // 选择本周健康度
    changeStatus(item, index, color) {
      if (!this.editMode) {
        return
      }
      this.$set(
        this.situationList[index],
        'twHealthyState',
        item.twHealthyState === color ? null : color
      )
    },
    // 跳转新增行动项页面
    goTaskPage(item, id) {
      if (!this.editMode) {
        return
      }
      this.clearActionItemModel()
      this.setScrollTop(document.querySelector(id).offsetTop)
      this.set_sd_situation(this.situationList)
      this.$router.push({
        path: './apaas-custom-add-action-item',
        query: {
          ...this.$route.query,
          situationType: item.situationType,
          situationContent: item.situationContent,
          returnRoute: 'weeklyDetails'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.healthy-state {
  .healthy-title {
    padding: 15px;
    color: #333333;
    border-bottom: 1px solid #e8e8e8;
  }
  .head-area {
    display: flex;
    align-items: center;
    color: #bdc3c7;
    ::v-deep .svg-icon {
      width: 16px !important;
      height: 16px !important;
    }
    .light {
      display: flex;
      align-items: center;
      width: 130px;
    }
    .hidden-light {
      opacity: 0;
    }
    .btn {
      flex: 1;
      color: #fff;
      background: linear-gradient(#33e585, #00a84d);
      font-size: 12px;
      border: none;
      height: 24px;
      line-height: 24px;
      border-radius: 5px;
      margin-left: 10px;
    }
    ::v-deep .cube-btn-outline:after {
      content: none;
    }
  }
  .content-area {
    padding: 15px 0;
    .tw-label {
      display: flex;
      align-items: center;
      font-size: 12px;
      .label-text {
        width: 150px;
        color: #333333;
      }
      .label-light {
        flex: 3;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #bdc3c7;
        ::v-deep .svg-icon {
          width: 18px !important;
          height: 18px !important;
        }
        .light-item {
          display: flex;
          align-items: center;
        }
      }
      .label-icon {
        flex: 1;
        text-align: right;
        position: relative;
        ::v-deep .svg-icon {
          width: 20px !important;
          height: 20px !important;
          color: #999999;
        }
        .tips {
          position: absolute;
          right: 330px;
          bottom: 15px;
          .tip-main {
            .flex-box {
              display: flex;
              .dw-42 {
                width: 42px;
              }
              .dw-156 {
                width: 156px;
              }
            }
            .bg-red {
              ::v-deep .svg-icon {
                color: #e74c3c;
              }
            }
            .bg-yellow {
              ::v-deep .svg-icon {
                color: #f1c40f;
              }
            }
            .bg-green {
              ::v-deep .svg-icon {
                color: #2ecc71;
              }
            }
          }
        }
      }
    }
    .lw-label {
      display: flex;
      align-items: center;
      font-size: 12px;
      .label-text {
        width: 150px;
        color: #333333;
      }
      .label-icon {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        ::v-deep .svg-icon {
          width: 20px !important;
          height: 20px !important;
        }
      }
    }
    .textarea {
      padding: 10px 0 15px;
      .cube-textarea-wrapper {
        height: 120px;
      }
      .cube-textarea-wrapper:after {
        border: 2px solid #c7c7c7;
        border-radius: 15px;
      }
      .cube-textarea_active:after {
        border: 2px solid #c7c7c7;
        border-radius: 15px;
      }
    }
    .disable-text {
      .cube-textarea-wrapper:after {
        color: #666666;
        background: #f1f1f1;
      }
      ::v-deep .cube-textarea {
        color: #666666;
        background: #f1f1f1;
      }
    }
  }
  .item-wrap {
    margin-top: 10px;
    width: 100%;
    height: 10px;
    background: #efeff4;
  }
  .bg-red {
    color: #e74c3c;
  }
  .bg-yellow {
    color: #f1c40f;
  }
  .bg-green {
    color: #2ecc71;
  }
  .bg-undefined {
    color: #bdc3c7;
  }
  .pl-10 {
    padding-left: 10px;
  }
  .mr-5 {
    margin-right: 5px;
  }
  .mr-15 {
    margin-right: 15px;
  }
  .fs-16 {
    font-size: 16px;
  }
  .fw-600 {
    font-weight: 600;
  }
}
</style>
