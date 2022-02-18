<!--
 * @Author: your name
 * @Date: 2022-01-26 18:16:27
 * @LastEditTime: 2022-02-16 17:37:37
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/pro-weekly/weekly-plan.vue
-->
<template>
  <div class="weekly-plan">
    <div class="plan-title fs-16 fw-600">
      周计划
    </div>
    <div class="plan-content">
      <div class="label">
        本周计划
      </div>
      <div class="textarea disable-text">
        <cube-textarea v-model="thisWeekPlan" :disabled="true"></cube-textarea>
      </div>
      <div id="twActual" class="label v-require">
        本周实际
      </div>
      <div class="textarea">
        <cube-textarea
          v-model="thisWeekActual"
          :disabled="!editMode"
          :class="{ 'disable-text': !editMode }"
          placeholder="请输入本周实际"
          :maxlength="200"
          @blur="updateData"
        ></cube-textarea>
      </div>
      <div id="nwPlan" class="label v-require">
        下周计划
      </div>
      <div class="textarea">
        <cube-textarea
          v-model="nextWeekPlan"
          :disabled="!editMode"
          :class="{ 'disable-text': !editMode }"
          placeholder="请输入下周计划"
          :maxlength="200"
          @blur="updateData"
        ></cube-textarea>
      </div>
    </div>
    <div class="item-wrap"></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { SET_SD_PROGRESS } from '../../../common/store/weekly-details.store'
export default {
  name: 'WeeklyPlan',
  components: {},
  props: {},
  data() {
    return {
      editMode: false,
      thisWeekPlan: '',
      thisWeekActual: '',
      nextWeekPlan: ''
    }
  },
  computed: {
    ...mapState({
      configField: (state) => state.weeklyDetailsModule.configField,
      sdProgressList: (state) => state.weeklyDetailsModule.sdProgressList
    })
  },
  watch: {
    sdProgressList: {
      handler(v) {
        this.thisWeekPlan = v.thisWeekPlan
        this.thisWeekActual = v.thisWeekActual
        this.nextWeekPlan = v.nextWeekPlan
      }
    },
    configField: {
      handler(v) {
        this.editMode = v.editMode
      },
      immediate: true
    }
  },
  mounted() {
    this.thisWeekPlan = this.sdProgressList.thisWeekPlan
    this.thisWeekActual = this.sdProgressList.thisWeekActual
    this.nextWeekPlan = this.sdProgressList.nextWeekPlan
  },
  methods: {
    ...mapMutations('weeklyDetailsModule', {
      set_sd_progress: SET_SD_PROGRESS
    }),
    // 输入框失焦后触发此事件
    updateData() {
      this.set_sd_progress({
        thisWeekPlan: this.thisWeekPlan,
        thisWeekActual: this.thisWeekActual,
        nextWeekPlan: this.nextWeekPlan
      })
    },
    /**
     * 校验必填
     */
    checkValid() {
      let validFlag = true
      let element = null
      if (!this.thisWeekActual) {
        validFlag = false
        this.$createToast({
          txt: '本周实际为必填项',
          type: 'error'
        }).show()
        element = document.querySelector('#twActual')
        return { validFlag, element }
      }
      if (!this.nextWeekPlan) {
        validFlag = false
        this.$createToast({
          txt: '下周计划为必填项',
          type: 'error'
        }).show()
        element = document.querySelector('#nwPlan')
        return { validFlag, element }
      }
      return { validFlag, element }
    },
    /**
     * 校验并收集所有数据
     */
    returnAllData() {
      return {
        data: {
          thisWeekPlan: this.thisWeekPlan,
          thisWeekActual: this.thisWeekActual,
          nextWeekPlan: this.nextWeekPlan
        },
        valid: this.checkValid().validFlag,
        element: this.checkValid().element
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.weekly-plan {
  .plan-title {
    padding: 15px;
    color: #333333;
    border-bottom: 1px solid #e8e8e8;
  }
  .plan-content {
    padding: 15px;
    .label {
      font-size: 12px;
      color: #333333;
    }
    .v-require::before {
      content: '*';
      margin-right: 3px;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      color: #f5222d;
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
  .fs-16 {
    font-size: 16px;
  }
  .fw-600 {
    font-weight: 600;
  }
}
</style>
