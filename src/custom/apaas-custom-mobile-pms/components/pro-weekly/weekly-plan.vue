<!--
 * @Author: your name
 * @Date: 2022-01-26 18:16:27
 * @LastEditTime: 2022-02-15 11:36:56
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
      <div class="label">本周计划</div>
      <div class="textarea disable-text">
        <cube-textarea v-model="thisWeekPlan" :disabled="true"></cube-textarea>
      </div>
      <div class="label v-require">本周实际</div>
      <div class="textarea">
        <cube-textarea
          v-model="thisWeekActual"
          :disabled="!editMode"
          :class="{ 'disable-text': !editMode }"
          placeholder="请输入本周实际"
          :maxlength="200"
        ></cube-textarea>
      </div>
      <div class="label v-require">下周计划</div>
      <div class="textarea">
        <cube-textarea
          v-model="nextWeekPlan"
          :disabled="!editMode"
          :class="{ 'disable-text': !editMode }"
          placeholder="请输入下周计划"
          :maxlength="200"
        ></cube-textarea>
      </div>
    </div>
    <div class="item-wrap"></div>
  </div>
</template>

<script>
export default {
  name: 'WeeklyPlan',
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    progressList: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  data() {
    return {
      thisWeekPlan: '',
      thisWeekActual: '',
      nextWeekPlan: ''
    }
  },
  computed: {},
  watch: {
    progressList: {
      handler(v) {
        this.thisWeekPlan = v.thisWeekPlan
        this.thisWeekActual = v.thisWeekActual
        this.nextWeekPlan = v.nextWeekPlan
      }
    }
  },
  created() {},
  methods: {}
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
