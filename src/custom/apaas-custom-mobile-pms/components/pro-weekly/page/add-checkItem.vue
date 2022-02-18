<!--
 * @Author: your name
 * @Date: 2022-02-11 11:08:05
 * @LastEditTime: 2022-02-18 16:37:25
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/pro-weekly/add-checkItem.vue
-->
<template>
  <div class="add-checkItem">
    <PageHeadSlot :backPath="backPath" returnRoute="addCheckItem">
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
          <div @click="selectStartDate">
            <div v-if="model.scheduledStartTime" class="list-item">
              <div class="list-value">
                {{ model.scheduledStartTime }}
              </div>
              <x-svg-icon
                name="clear-icon"
                class="list-icon"
                @click.native.stop="clearDate('scheduledStartTime')"
              ></x-svg-icon>
            </div>
            <div v-else class="list-placeholder">
              请选择计划开始时间
            </div>
          </div>
        </cube-form-item>
        <cube-form-item :field="fields[2]">
          <div @click="selectEndDate">
            <div v-if="model.estimatedMpletionTime" class="list-item">
              <div class="list-value">
                {{ model.estimatedMpletionTime }}
              </div>
              <x-svg-icon
                name="clear-icon"
                class="list-icon"
                @click.native.stop="clearDate('estimatedMpletionTime')"
              ></x-svg-icon>
            </div>
            <div v-else class="list-placeholder">
              请选择计划完成时间
            </div>
          </div>
        </cube-form-item>
        <cube-form-item :field="fields[3]">
          <div class="list-item th-120">
            <div class="list-value">
              <cube-textarea
                v-model="model.problem"
                placeholder="请输入问题描述"
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
import PageHeadSlot from '../../common/components/page-head-slot.vue'
import PersonTag from '../../common/components/person-tag.vue'
import { mapState, mapMutations } from 'vuex'
import {
  SET_CHECK_ITEM_MODEL,
  SET_CHECK_LIST_DATA
} from '../../../../common/store/add-check-item.store'
export default {
  name: 'AddCheckItem',
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
        scheduledStartTime: null,
        estimatedMpletionTime: null,
        problem: ''
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
          modelKey: 'scheduledStartTime',
          label: '计划开始时间',
          rules: {
            required: true
          },
          trigger: 'blur'
        },
        {
          modelKey: 'estimatedMpletionTime',
          label: '计划完成时间',
          rules: {
            required: true
          },
          trigger: 'blur'
        },
        {
          modelKey: 'problem',
          label: '问题描述',
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
      submitFlag: false,
      returnRoute: null
    }
  },
  computed: {
    ...mapState({
      checkItemModel: (state) => state.addCheckItemModule.checkItemModel,
      checkListData: (state) => state.addCheckItemModule.checkListData
    })
  },
  watch: {},
  created() {
    const { checkItem, returnRoute } = this.$route.query
    this.headTitle = checkItem
    this.returnRoute = returnRoute
    this.model = this.checkItemModel
  },
  methods: {
    ...mapMutations('addCheckItemModule', {
      setCheckItemModel: SET_CHECK_ITEM_MODEL,
      setCheckListData: SET_CHECK_LIST_DATA
    }),
    selectStartDate() {
      this.$createDatePicker({
        title: '计划开始时间',
        value: new Date(),
        onSelect: this.handleStartDate
      }).show()
    },
    handleStartDate(date) {
      this.$set(this.model, 'scheduledStartTime', this.$dayjs(new Date(date)).format('YYYY-MM-DD'))
    },
    selectEndDate() {
      this.$createDatePicker({
        title: '计划完成时间',
        value: new Date(),
        onSelect: this.handleEndDate
      }).show()
    },
    handleEndDate(date) {
      this.$set(
        this.model,
        'estimatedMpletionTime',
        this.$dayjs(new Date(date)).format('YYYY-MM-DD')
      )
    },
    selectPeople() {
      this.setCheckItemModel(this.model)
      this.$router.push({
        path: './apaas-custom-search-people',
        query: {
          ...this.$route.query,
          returnRoute: 'addCheckItem'
        }
      })
    },
    clearDate(field) {
      this.$set(this.model, field, null)
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
        const newList = this.checkListData
        const i = newList.findIndex((item) => item.checkItem === this.headTitle)
        newList[i].children.push({ state: '草稿', ...this.model })
        this.setCheckListData(newList)
        this.setCheckItemModel(this.model)
        this.$router.push({
          path: './apaas-custom-weekly-details',
          query: {
            ...this.$route.query,
            returnRoute: 'addCheckItem'
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
.add-checkItem {
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
