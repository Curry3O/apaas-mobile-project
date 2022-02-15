<!--
 * @Author: your name
 * @Date: 2022-02-07 13:29:00
 * @LastEditTime: 2022-02-15 11:26:20
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/pro-weekly/add-actionItem.vue
-->
<template>
  <div class="add-actionItem">
    <PageHeadSlot :backPath="backPath" returnRoute="addActionItem">
      <template v-slot:main>
        <div class="head-text">
          {{ headTitle }}
        </div>
      </template>
    </PageHeadSlot>
    <cube-form
      :model="model"
      :options="options"
      @validate="validateHandler"
      @submit="submitHandler"
    >
      <cube-form-group>
        <cube-form-item :field="fields[0]">
          <div @click="selectPeople">
            <div v-if="model.personInChargeName" class="list-item">
              <PersonTag
                tagKey="personInChargeName"
                class="list-value"
                :personName="model.personInChargeName"
              ></PersonTag>
              <x-svg-icon
                name="clear-icon"
                class="list-icon"
                @click.native.stop="clearPerson"
              ></x-svg-icon>
            </div>
            <div v-else class="list-placeholder">
              请选择负责人
            </div>
          </div>
        </cube-form-item>
        <cube-form-item :field="fields[1]">
          <div @click="selectDate">
            <div v-if="model.plannedCompletionTime" class="list-item">
              <div class="list-value">
                {{ model.plannedCompletionTime }}
              </div>
              <x-svg-icon
                name="clear-icon"
                class="list-icon"
                @click.native.stop="clearDate"
              ></x-svg-icon>
            </div>
            <div v-else class="list-placeholder">
              请选择计划完成时间
            </div>
          </div>
        </cube-form-item>
        <cube-form-item :field="fields[2]">
          <div class="list-item">
            <div class="list-value">
              <cube-input v-model="model.title" placeholder="请输入标题"></cube-input>
            </div>
          </div>
        </cube-form-item>
        <cube-form-item :field="fields[3]">
          <div class="list-item th-120">
            <div class="list-value">
              <cube-textarea
                v-model="model.content"
                placeholder="请输入描述"
                :maxlength="200"
              ></cube-textarea>
            </div>
          </div>
        </cube-form-item>
      </cube-form-group>
      <cube-form-group class="submit-btn">
        <cube-button type="submit" @click="confirmBtn">
          确认
        </cube-button>
      </cube-form-group>
    </cube-form>
  </div>
</template>

<script>
import PageHeadSlot from '../common/page-head-slot.vue'
import PersonTag from '../common/person-tag.vue'
import { generateUUID } from '../../../common/utils/tool'
import { mapState, mapMutations } from 'vuex'
import { SET_ACTION_ITEM_MODEL, SET_ACTION_DATA } from '../../../common/store/add-action-item.store'
export default {
  name: 'AddActionItem',
  components: {
    PageHeadSlot,
    PersonTag
  },
  data() {
    return {
      backPath: './apaas-custom-weekly-details',
      validity: {},
      valid: undefined,
      model: {
        personInChargeName: null,
        personInCharge: null,
        plannedCompletionTime: null,
        title: '',
        content: '',
        pkId: null
      },
      fields: [
        {
          modelKey: 'personInChargeName',
          label: '负责人',
          rules: {
            required: true
          },
          trigger: 'blur'
        },
        {
          modelKey: 'plannedCompletionTime',
          label: '计划完成时间',
          rules: {
            required: true
          },
          trigger: 'blur'
        },
        {
          modelKey: 'title',
          label: '标题',
          rules: {
            required: true
          },
          trigger: 'blur'
        },
        {
          modelKey: 'content',
          label: '描述',
          rules: {
            required: true
          },
          trigger: 'blur'
        }
      ],
      options: {
        scrollToInvalidField: true,
        layout: 'standard'
      },
      datePicker: null,
      submitFlag: false,
      returnRoute: null
    }
  },
  computed: {
    ...mapState({
      actionItemModel: (state) => state.addActionItemModule.actionItemModel,
      actionTableData: (state) => state.addActionItemModule.actionTableData
    })
  },
  watch: {},
  created() {
    this.headTitle = this.$route.query.situationContent
    this.returnRoute = this.$route.query.returnRoute
    this.model = this.actionItemModel
    if (this.returnRoute === 'weeklyDetails') {
      this.model.pkId = this.model.pkId ? this.model.pkId : generateUUID()
    }
  },
  methods: {
    ...mapMutations('addActionItemModule', {
      setActionItemModel: SET_ACTION_ITEM_MODEL,
      setActionData: SET_ACTION_DATA
    }),
    selectDate() {
      if (!this.datePicker) {
        this.datePicker = this.$createDatePicker({
          title: '计划完成时间',
          value: new Date(),
          onSelect: this.selectHandle
        })
      }
      this.datePicker.show()
    },
    selectHandle(date) {
      this.$set(
        this.model,
        'plannedCompletionTime',
        this.$dayjs(new Date(date)).format('YYYY-MM-DD')
      )
    },
    selectPeople() {
      this.setActionItemModel(this.model)
      this.$router.push({
        path: './apaas-custom-search-people',
        query: {
          ...this.$route.query,
          returnRoute: 'addActionItem'
        }
      })
    },
    clearDate() {
      this.$set(this.model, 'plannedCompletionTime', null)
    },
    clearPerson() {
      this.$set(this.model, 'personInCharge', null)
      this.$set(this.model, 'personInChargeName', null)
    },
    validateHandler(result) {
      this.validity = result.validity
      this.valid = result.valid
      if (!this.valid && this.submitFlag) {
        this.$createToast({
          txt: '请输入完整信息！',
          type: 'error'
        }).show()
        this.submitFlag = false
      }
    },
    submitHandler(e) {
      e.preventDefault()
      if (this.submitFlag) {
        const { situationType, situationContent } = this.$route.query
        const newActionData = this.actionTableData
        newActionData.unshift({
          situationType: situationType,
          keyPointContent: situationContent,
          state: '待提交',
          ...this.model
        })
        this.setActionData(JSON.parse(JSON.stringify(newActionData)))
        this.$router.push({
          path: './apaas-custom-weekly-details',
          query: {
            ...this.$route.query,
            returnRoute: 'addActionItem'
          }
        })
      }
    },
    confirmBtn() {
      this.submitFlag = true
    }
  }
}
</script>

<style lang="scss" scoped>
.add-actionItem {
  height: 100vh;
  background: #f8f8f8;
  .head-text {
    color: #333333;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }
  ::v-deep .cube-form-item {
    border-bottom: 1px solid #f7f7f7;
  }
  ::v-deep .cube-form-label span {
    font-weight: 600;
    font-size: 14px;
  }
  .list-item {
    display: flex;
    align-items: center;
    font-size: 12px;
    height: 24px;
    .list-value {
      width: 90%;
      color: #000;
    }
    .list-icon {
      width: 10%;
      text-align: right;
      ::v-deep .svg-icon {
        color: #b8b8b8 !important;
        width: 18px !important;
        height: 18px !important;
      }
    }
  }
  .list-placeholder {
    width: 100%;
    color: #b8b8b8;
    font-size: 14px;
  }
  .cube-textarea-wrapper {
    height: 80px;
  }
  ::v-deep .cube-textarea {
    font-size: 12px;
    color: #000;
  }
  .th-120 {
    height: 120px;
    align-items: flex-start;
    .list-value {
      width: 100%;
    }
  }
  .submit-btn {
    background: #f8f8f8;
    padding: 20px;
    .cube-btn {
      background: #027aff;
    }
  }
  .page-header {
    border-bottom: 1px solid #e8e8e8;
  }
  ::v-deep .svg-icon {
    color: #333333 !important;
  }
}
</style>
