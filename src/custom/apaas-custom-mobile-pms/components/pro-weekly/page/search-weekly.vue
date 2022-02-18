<!--
 * @Author: your name
 * @Date: 2022-02-17 15:44:33
 * @LastEditTime: 2022-02-18 16:37:57
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/pro-weekly/search-weekly.vue
-->
<template>
  <div class="search-weekly">
    <PageHeadSlot :backPath="backPath" returnRoute="searchWeekly">
      <template v-slot:main>
        <div class="head-text">
          搜索
        </div>
      </template>
    </PageHeadSlot>
    <cube-form :model="model" :options="options" @submit="submitHandler">
      <cube-form-group>
        <cube-form-item :field="fields[0]">
          <div @click="selectMilestone">
            <div v-if="model.milestoneName" class="list-item">
              <div class="list-value">
                {{ model.milestoneName }}
              </div>
              <x-svg-icon
                name="clear-icon"
                class="list-icon"
                @click.native.stop="clearMilestone"
              ></x-svg-icon>
            </div>
            <div v-else class="list-placeholder">
              请选择项目状态
            </div>
          </div>
        </cube-form-item>
        <cube-form-item :field="fields[1]">
          <div @click="selectInspect">
            <div v-if="model.isInspectName" class="list-item">
              <div class="list-value">
                {{ model.isInspectName }}
              </div>
              <x-svg-icon
                name="clear-icon"
                class="list-icon"
                @click.native.stop="clearInspect"
              ></x-svg-icon>
            </div>
            <div v-else class="list-placeholder">
              是否检查
            </div>
          </div>
        </cube-form-item>
      </cube-form-group>
      <cube-form-group class="submit-btn">
        <div class="btn-plain mr-20">
          <cube-button @click="resetBtn">
            重置
          </cube-button>
        </div>
        <div class="btn-primary">
          <cube-button type="submit" @click="confirmBtn">
            确定
          </cube-button>
        </div>
      </cube-form-group>
    </cube-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import {
  SET_SEARCH_PARAMS,
  SET_WEEKLY_REFRESH
} from '../../../../common/store/project-weekly.store'
import PageHeadSlot from '../../common/components/page-head-slot.vue'
export default {
  name: 'SearchWeekly',
  components: {
    PageHeadSlot
  },
  data() {
    return {
      backPath: './apaas-custom-weekly-page',
      model: {
        milestoneCode: null,
        milestoneName: null,
        isInspect: null,
        isInspectName: null
      },
      fields: [
        {
          modelKey: 'milestoneName',
          label: '项目状态'
        },
        {
          modelKey: 'isInspectName',
          label: '周报检查'
        }
      ],
      selectOptions: {
        statusList: [
          { text: '待立项', value: 'ZB' },
          { text: '实施中', value: 'SS' },
          { text: '已上线', value: 'SX' },
          { text: '已验收', value: 'YS' },
          { text: '预交付立项', value: 'YLX' }
        ],
        isCheck: [
          { text: '是', value: '是' },
          { text: '否', value: '否' }
        ]
      },
      indexList: [[0], [0]],
      options: {
        scrollToInvalidField: true,
        layout: 'standard'
      },
      submitFlag: false
    }
  },
  computed: {
    ...mapState({
      searchParams: (state) => state.projectWeeklyModule.searchParams
    })
  },
  watch: {},
  created() {
    const { milestoneCode, isInspect } = this.searchParams
    this.model.milestoneCode = milestoneCode
    this.model.isInspect = isInspect
    if (milestoneCode) {
      const index = this.selectOptions.statusList.findIndex((item) => item.value === milestoneCode)
      this.model.milestoneName = this.selectOptions.statusList[index].text
      this.indexList[0] = [index]
    }
    if (isInspect) {
      const index = this.selectOptions.isCheck.findIndex((item) => item.value === isInspect)
      this.model.isInspectName = this.selectOptions.isCheck[index].text
      this.indexList[1] = [index]
    }
    this.setWeeklyRefresh(false)
  },
  methods: {
    ...mapMutations('projectWeeklyModule', {
      setSearchParams: SET_SEARCH_PARAMS,
      setWeeklyRefresh: SET_WEEKLY_REFRESH
    }),
    // 选择项目状态
    selectMilestone() {
      this.$createPicker({
        title: '项目状态',
        data: [this.selectOptions.statusList],
        selectedIndex: this.indexList[0],
        onSelect: this.handleMilestone
      }).show()
    },
    // 处理选中的项目状态
    handleMilestone(selectedVal, selectedIndex) {
      const index = this.selectOptions.statusList.findIndex((item) => item.value === selectedVal[0])
      this.$set(this.model, 'milestoneName', this.selectOptions.statusList[index].text)
      this.$set(this.model, 'milestoneCode', selectedVal[0])
      this.indexList[0] = [selectedIndex]
    },
    // 选择周报检查
    selectInspect() {
      this.$createPicker({
        title: '周报检查',
        data: [this.selectOptions.isCheck],
        selectedIndex: this.indexList[1],
        onSelect: this.handleInspect
      }).show()
    },
    // 处理选中的周报检查
    handleInspect(selectedVal, selectedIndex) {
      const index = this.selectOptions.isCheck.findIndex((item) => item.value === selectedVal[0])
      this.$set(this.model, 'isInspectName', this.selectOptions.isCheck[index].text)
      this.$set(this.model, 'isInspect', selectedVal[0])
      this.indexList[1] = [selectedIndex]
    },
    // 清空项目状态
    clearMilestone() {
      this.$set(this.model, 'milestoneName', null)
      this.$set(this.model, 'milestoneCode', null)
    },
    // 清空周报检查
    clearInspect() {
      this.$set(this.model, 'isInspectName', null)
      this.$set(this.model, 'isInspect', null)
    },
    // 处理确认
    submitHandler(e) {
      e.preventDefault()
      if (this.submitFlag) {
        this.setSearchParams({
          ...this.searchParams,
          milestoneCode: this.model.milestoneCode,
          isInspect: this.model.isInspect
        })
        this.setWeeklyRefresh(true)
        this.$router.push({
          path: './apaas-custom-weekly-page',
          query: {
            ...this.$route.query,
            returnRoute: 'searchWeekly'
          }
        })
      }
    },
    // 确定
    confirmBtn() {
      this.submitFlag = true
    },
    // 重置
    resetBtn() {
      this.$set(this.model, 'milestoneName', null)
      this.$set(this.model, 'milestoneCode', null)
      this.$set(this.model, 'isInspectName', null)
      this.$set(this.model, 'isInspect', null)
      this.setSearchParams({
        ...this.searchParams,
        milestoneCode: null,
        isInspect: null
      })
      this.setWeeklyRefresh(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-weekly {
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
    ::v-deep .cube-form-group-content {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .btn-plain {
      width: 150px;
      .cube-btn {
        width: 100%;
        background: #fff;
        color: #027aff;
        border: 1px solid #027aff;
      }
    }
    .btn-primary {
      width: 150px;
      .cube-btn {
        width: 100%;
        background: #027aff;
      }
    }
  }
  .page-header {
    border-bottom: 1px solid #e8e8e8;
  }
  ::v-deep .svg-icon {
    color: #333333 !important;
  }
}
::v-deep .cube-picker-cancel {
  color: #999 !important;
}
</style>
