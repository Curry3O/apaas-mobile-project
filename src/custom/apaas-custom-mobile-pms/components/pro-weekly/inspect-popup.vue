<!--
 * @Author: your name
 * @Date: 2022-01-18 19:55:22
 * @LastEditTime: 2022-02-13 16:32:54
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/pro-weekly/inspect-popup.vue
-->
<template>
  <cube-popup ref="myPopup" type="my-popup" position="bottom" :mask-closable="true">
    <div class="popup-box">
      <div class="box-head">
        <span class="text-cancel" @click="cancelBtn">取消</span>
        <span class="text-confirm" :class="{ 'is-selected': checkRole }" @click="submitBtn">
          提交
        </span>
        <div class="title-group">
          <span class="text-title">检查角色</span>
        </div>
      </div>
      <div class="box-body">
        <cube-radio-group v-model="checkRole" :options="options" />
        <div class="box-text">
          此操作允许一键通过该周报检查！
        </div>
      </div>
    </div>
  </cube-popup>
</template>

<script>
import apis from '../../../common/api'
import { mapState } from 'vuex'
export default {
  name: 'InspectPopup',
  components: {},
  props: {
    weeklyReports: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkRole: '',
      options: [],
      componentPopup: null
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.authModule.userInfo
    })
  },
  watch: {},
  created() {
    this.getRoleOptions()
  },
  methods: {
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
            item.label = item.value = item.lookupValueMeaning
          })
          this.options = resp.data
        } else {
          this.$createToast({
            txt: resp.message,
            type: 'error'
          }).show()
        }
      })
    },
    // 显示
    showPopup() {
      this.checkRole = ''
      this.componentPopup = this.$refs.myPopup
      this.componentPopup.show()
    },
    // 取消
    cancelBtn() {
      if (this.componentPopup) {
        this.componentPopup.hide()
      }
    },
    // 提交
    submitBtn() {
      if (!this.checkRole) {
        return
      }
      const request = {
        ...apis.BATCH_WEEK_INSPECT,
        params: {
          inspector: this.userInfo.id,
          checkRole: this.checkRole,
          inspectionDate: this.$dayjs(new Date()).format('YYYY-MM-DD'),
          weeklyReports: this.weeklyReports
        }
      }
      this.$request(request).asyncThen((resp) => {
        if (resp.code === 'ok') {
          this.$emit('refresh-data')
          if (this.componentPopup) {
            this.componentPopup.hide()
          }
          this.$createToast({
            txt: '提交成功',
            time: 1000,
            type: 'success'
          }).show()
        } else {
          this.$createToast({
            txt: resp.message,
            type: 'error'
          }).show()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.popup-box {
  background-color: #fff;
  .box-head {
    position: relative;
    height: 50px;
    border-bottom: 1px solid #ebebeb;
    .text-cancel {
      position: absolute;
      left: 0;
      color: #999;
      line-height: 50px;
      padding: 0 16px;
      box-sizing: content-box;
      font-size: 14px;
    }
    .text-confirm {
      position: absolute;
      right: 0;
      color: #666;
      line-height: 50px;
      padding: 0 16px;
      box-sizing: content-box;
      font-size: 14px;
    }
    .is-selected {
      color: #0274ff;
    }
    .title-group {
      padding: 0 50px;
      display: flex;
      height: 100%;
      flex-flow: column;
      justify-content: center;
      text-align: center;
      .text-title {
        font-size: 16px;
        line-height: 25px;
        font-weight: 400;
        color: #333;
      }
    }
  }
  .box-body {
    ::v-deep .cube-radio {
      border-bottom: 1px solid #f5f7fa;
    }
    .box-text {
      font-size: 12px;
      color: #b2b2b2;
      line-height: 18px;
      text-align: right;
      padding: 15px 0;
    }
  }
  ::v-deep .cube-radio_selected .cube-radio-ui {
    background-color: #0274ff;
  }
}
</style>
