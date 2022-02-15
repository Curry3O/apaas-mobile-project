<!--
 * @Author: your name
 * @Date: 2022-02-08 17:38:56
 * @LastEditTime: 2022-02-11 19:08:41
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/pro-weekly/weekly-check.vue
-->
<template>
  <div class="weekly-check">
    <div class="head-select">
      <div class="select-title">检查角色</div>
      <div class="select-value">
        <cube-select
          v-model="checkRole"
          :disabled="disabled"
          title="检查角色"
          :options="optionSelect"
          placeholder="请选择检查角色"
          @change="selectChange"
        >
        </cube-select>
      </div>
    </div>
    <div class="main-select">
      <div v-for="(item, index) in checkList" :key="index">
        <CollapseSlot
          ref="collapse"
          :collapseKey="index"
          :collapseLabel="item.checkItem"
          :requiredField="item.passOrNot === '不通过'"
          :extraLabel="getCount(item.checkItem) > 0 ? '(' + getCount(item.checkItem) + ')' : ''"
        >
          <template v-slot:header>
            <div class="head-area">
              <x-svg-icon
                :id="'addBtn' + index"
                name="add-icon"
                @click.native="addCheckItem(item.checkItem, '#addBtn' + index)"
              ></x-svg-icon>
            </div>
          </template>
          <template v-slot:content>
            <cube-radio-group v-model="item.passOrNot" :options="optionRadio" :horizontal="true" />
          </template>
          <template v-slot:main>
            <div class="content-area">
              <div
                v-for="(child, childIndex) in item.children"
                :key="childIndex"
                class="child-item"
              >
                <div class="item-box mb-5">
                  <div class="box-left">
                    <div class="text-title">问题描述：</div>
                  </div>
                  <div v-if="child.state" class="box-right">
                    <div class="text-state">{{ child.state }}</div>
                  </div>
                </div>
                <div class="item-problem">{{ child.problem }}</div>
                <div class="item-text">
                  计划开始时间：
                  {{ child.scheduledStartTime }}
                </div>
                <div class="item-text">
                  计划完成时间：
                  {{ child.estimatedMpletionTime }}
                </div>
                <div class="item-box">
                  <div class="box-left">
                    <div class="item-text">
                      负责人：
                      {{ child.personInChargeName }}
                    </div>
                  </div>
                  <div class="box-right">
                    <x-svg-icon
                      v-if="item.state === '草稿'"
                      name="delete-icon"
                      @click.native="deleteCheckItem(item.checkItem, childIndex)"
                    ></x-svg-icon>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </CollapseSlot>
      </div>
    </div>
  </div>
</template>

<script>
import apis from '../../../common/api'
import { mapState, mapMutations } from 'vuex'
import CollapseSlot from '../common/collapse-slot.vue'
import { SET_SCROLL_TOP } from '../../../common/store/weekly-details.store'
import {
  CLEAR_CHECK_ITEM_MODEL,
  SET_CHECK_ALL_DATA,
  SET_CHECK_LIST_DATA
} from '../../../common/store/add-check-item.store'
export default {
  name: 'WeeklyCheck',
  props: {},
  components: {
    CollapseSlot
  },
  data() {
    return {
      checkRole: null,
      disabled: false,
      optionSelect: [],
      optionRadio: [
        {
          label: '通过',
          value: '通过'
        },
        {
          label: '不通过',
          value: '不通过'
        },
        {
          label: '不涉及',
          value: '不涉及'
        }
      ],
      checkList: [],
      checkAllList: [],
      weeklyInspectDTO: {},
      returnRoute: null
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.authModule.userInfo,
      sd_weeklypo: (state) => state.weeklyDetailsModule.sd_weeklypo,
      checkItemModel: (state) => state.addCheckItemModule.checkItemModel,
      checkAllData: (state) => state.addCheckItemModule.checkAllData,
      checkListData: (state) => state.addCheckItemModule.checkListData
    }),
    getCount() {
      return (checkItem) => {
        return this.checkList.filter((item) => item.checkItem === checkItem)[0].children.length
      }
    },
    actionKeys() {
      const kvArray = [
        ['进度控制', 0],
        ['资源情况', 1],
        ['范围控制', 2],
        ['成本管理', 3],
        ['开发质量', 4],
        ['收入预计', 5],
        ['业务价值实现', 6],
        ['客户关系人关系', 7],
        ['客户期望', 8]
      ]
      return new Map(kvArray)
    }
  },
  watch: {},
  mounted() {
    const { returnRoute } = this.$route.query
    this.returnRoute = returnRoute
    if (this.returnRoute === 'addCheckItem') {
      const { checkRole, disabled } = this.checkAllData
      this.checkRole = checkRole
      this.disabled = disabled
      this.checkList = this.checkListData
    } else {
      this.loadActionData()
    }
    this.getRoleOptions()
  },
  methods: {
    ...mapMutations('weeklyDetailsModule', {
      setScrollTop: SET_SCROLL_TOP
    }),
    ...mapMutations('addCheckItemModule', {
      clearCheckItemModel: CLEAR_CHECK_ITEM_MODEL,
      setCheckAllData: SET_CHECK_ALL_DATA,
      setCheckListData: SET_CHECK_LIST_DATA
    }),
    // 下拉框选项改变时
    selectChange(value) {
      if (value === 'CSM') {
        this.checkList = this.checkAllList.filter(
          (item) =>
            item.checkItem === '客户期望' ||
            item.checkItem === '客户关系人关系' ||
            item.checkItem === '业务价值实现'
        )
      } else {
        this.checkList = this.checkAllList
      }
    },
    // 角色选项
    getRoleOptions() {
      const request = {
        ...apis.GET_WEEKLY_LOOKUP_VALUE,
        params: {
          lookupTypeCode: 'CHECKER_ROLE'
        }
      }
      this.$request(request).asyncThen((resp) => {
        if (resp.code === 'ok') {
          resp.data.forEach((item) => {
            item.value = item.lookupValueCode
            item.text = item.lookupValueMeaning
          })
          this.optionSelect = resp.data
        } else {
          this.$createToast({
            txt: resp.message,
            type: 'error'
          }).show()
        }
      })
    },
    // 加载周报检查项数据
    loadActionData() {
      const request = {
        ...apis.QUERY_WEEKLY_INSPECT_DETAILS,
        params: {
          week: this.sd_weeklypo.week,
          userId: this.userInfo.id,
          pmsProjectCode: this.sd_weeklypo.pmsProjectCode
        }
      }
      this.$request(request)
        .asyncThen((resp) => {
          if (resp.code === 'ok') {
            const { weeklyInspectDTO, reportInspections } = resp.data
            this.weeklyInspectDTO = weeklyInspectDTO
            reportInspections.forEach((item) => {
              item.dataIndex = this.actionKeys.get(item.checkItem)
              item.passOrNot = item.passOrNot ? item.passOrNot : '通过'
            })
            const data = reportInspections.sort((a, b) => a.dataIndex - b.dataIndex)
            this.checkAllList = this.handleMergeData(data)
            if (weeklyInspectDTO?.checkRole) {
              this.disabled = true
              this.checkRole = weeklyInspectDTO.checkRole
              if (this.checkRole === 'CSM') {
                this.checkList = this.checkAllList.filter(
                  (item) =>
                    item.checkItem === '客户期望' ||
                    item.checkItem === '客户关系人关系' ||
                    item.checkItem === '业务价值实现'
                )
              } else {
                this.checkList = this.checkAllList
              }
            }
          } else {
            this.$createToast({
              txt: resp.message,
              type: 'error'
            }).show()
          }
        })
        .asyncErrorCatch(() => {})
    },
    // 合并数据
    handleMergeData(data) {
      const list = []
      data.forEach((item) => {
        const i = list.findIndex((v) => v.checkItem === item.checkItem)
        if (i > -1) {
          item.personInChargeName && list[i].children.push(item)
        } else {
          const children = item.personInChargeName ? [{ ...item }] : []
          list.push({ ...item, children })
        }
      })
      return list
    },
    // 新增检查项
    addCheckItem(field, anchorId) {
      this.setScrollTop(document.querySelector(anchorId).offsetTop)
      this.setCheckAllData({ checkRole: this.checkRole, disabled: this.disabled })
      this.setCheckListData(this.checkList)
      this.clearCheckItemModel()
      this.$router.push({
        path: './apaas-custom-add-check-item',
        query: {
          ...this.$route.query,
          checkItem: field,
          returnRoute: 'weeklyCheck'
        }
      })
    },
    // 删除检查项
    deleteCheckItem(type, index) {
      this.$createDialog({
        type: 'confirm',
        content: '是否确认删除？',
        onConfirm: () => {
          const i = this.checkList.findIndex((item) => item.checkItem === type)
          this.checkList[i].children.splice(index, 1)
          this.$refs.collapse[i].refreshItem()
        }
      }).show()
    },
    // 提交周报检查项
    submitActionData() {
      this.$createDialog({
        type: 'confirm',
        content: '是否确认提交？',
        onConfirm: () => {
          if (!this.checkRole) {
            this.$createToast({
              txt: '请选择检查角色',
              type: 'error'
            }).show()
            return
          }
          if (this.checkListValid()) {
            const toast = this.$createToast({
              txt: 'Loading...',
              mask: true
            })
            toast.show()
            const data = []
            this.checkList.forEach((p) => {
              if (p.children.length > 0) {
                p.children.forEach((v) => {
                  data.push({ checkItem: p.checkItem, passOrNot: p.passOrNot, ...v })
                })
              } else {
                const temp = { ...p }
                delete temp.children
                data.push(temp)
              }
            })
            const request = {
              ...apis.CREATE_PROCESS,
              params: {
                weeklyInspectDTO: {
                  checkRole: this.checkRole,
                  week: this.sd_weeklypo.week,
                  weekId: this.sd_weeklypo.id,
                  pmsProjectCode: this.sd_weeklypo.pmsProjectCode,
                  inspectionDate: this.$dayjs(new Date()).format('YYYY-MM-DD'),
                  ...this.weeklyInspectDTO
                },
                reportInspections: data
              }
            }
            this.$request(request)
              .asyncThen((resp) => {
                if (resp.code === 'ok') {
                  this.$createToast({
                    txt: '保存成功',
                    type: 'txt'
                  }).show()
                  this.$emit('show-details', true)
                } else {
                  this.$createToast({
                    txt: resp.message,
                    type: 'error'
                  }).show()
                }
                toast.hide()
              })
              .asyncErrorCatch(() => {
                toast.hide()
              })
          }
        }
      }).show()
    },
    checkListValid() {
      let flag = true
      for (let i = 0; i < this.checkList.length; i++) {
        if (this.checkList[i].passOrNot === '不通过' && this.checkList[i].children.length < 1) {
          flag = false
          this.$createToast({
            txt: '检查项不通过时必须填写问题描述',
            type: 'error'
          }).show()
          break
        }
      }
      return flag
    }
  }
}
</script>

<style lang="scss" scoped>
.weekly-check {
  .head-select {
    padding: 0 10px;
    display: flex;
    align-items: center;
    .select-title {
      width: 90px;
      font-size: 14px;
      color: #333333;
      text-align: center;
    }
    .select-title::before {
      content: '*';
      margin-right: 3px;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      color: #f5222d;
    }
    .select-value {
      flex: 1;
      padding-right: 5px;
      ::v-deep .cube-select {
        line-height: 12px;
        padding-left: 15px;
        .cube-select-icon {
          border-width: 5px 5px 0;
        }
      }
      ::v-deep .cube-select:after {
        border-radius: 15px;
      }
      ::v-deep .cube-select_active:after {
        border-color: #ccc;
      }
    }
  }
  .main-select {
    margin-top: 10px;
    color: #333333;
    .head-area {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: #bdc3c7;
      ::v-deep .svg-icon {
        width: 18px !important;
        height: 18px !important;
        color: #999999;
      }
    }
    .content-area {
      .child-item {
        padding: 15px 15px 10px;
        margin-bottom: 15px;
        background: #f5f8fa;
        border-radius: 15px;
        .item-box {
          display: flex;
          align-items: center;
          .box-left {
            width: 200px;
            font-size: 12px;
            color: #333333;
            .text-title {
              font-size: 15px;
              font-weight: 600;
            }
          }
          .box-right {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            .text-state {
              padding: 4px 10px;
              background: #00a84d;
              border-radius: 6px;
              color: #fff;
              font-size: 12px;
            }
            ::v-deep .svg-icon {
              width: 26px !important;
              height: 26px !important;
              color: #999999;
            }
          }
        }
        .item-problem {
          white-space: pre-wrap;
          line-height: 20px;
          font-size: 12px;
          color: #666666;
        }
        .item-text {
          line-height: 22px;
          font-size: 12px;
          color: #333333;
        }
      }
    }
  }
  .mb-5 {
    margin-bottom: 5px;
  }
  ::v-deep .cube-radio-ui {
    -webkit-text-stroke-width: 0px;
  }
  ::v-deep .cube-radio_selected .cube-radio-ui {
    background-color: #0274ff;
  }
  ::v-deep .cube-radio-group[data-col='true']:after,
  .cube-radio-group[data-horz='true']:after {
    display: none;
  }
  ::v-deep .border-right-1px:after {
    border-right: none;
  }
}
</style>
