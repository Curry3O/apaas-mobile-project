<!--
 * @Author: your name
 * @Date: 2022-02-11 19:31:16
 * @LastEditTime: 2022-02-18 14:20:34
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/pro-weekly/editRow-popup.vue
-->
<template>
  <cube-popup ref="myPopup" type="my-popup" position="bottom" :mask-closable="true">
    <div class="popup-box">
      <div class="box-head">
        <span class="text-cancel" @click="cancelBtn">取消</span>
        <span class="text-confirm" @click="confirmBtn">确定</span>
        <div class="title-group">
          <span class="text-title">{{ headRowTitle }}</span>
        </div>
      </div>
      <div class="box-content">
        <cube-form
          :model="model"
          :options="options"
          :immediateValidate="true"
          @validate="validateHandler"
        >
          <cube-form-group>
            <div v-for="(item, index) in fields" :key="index">
              <div v-if="item.type === 'input'">
                <cube-form-item :field="fields[index]">
                  <div class="list-item">
                    <div class="list-value">
                      <cube-input
                        v-model="model[item.modelKey]"
                        :placeholder="'请输入' + item.label"
                      ></cube-input>
                    </div>
                  </div>
                </cube-form-item>
              </div>
              <div v-if="item.type === 'textarea'">
                <cube-form-item :field="fields[index]">
                  <div class="list-item th-120">
                    <div class="list-value">
                      <cube-textarea
                        v-model="model[item.modelKey]"
                        :placeholder="'请输入' + item.label"
                        :maxlength="200"
                      ></cube-textarea>
                    </div>
                  </div>
                </cube-form-item>
              </div>
            </div>
            <cube-form-item v-if="showLastData" :field="fields[fields.length - 1]">
              <div class="list-item">
                <div class="list-value">
                  <cube-input
                    v-model="model[fields[fields.length - 1].modelKey]"
                    disabled
                  ></cube-input>
                </div>
              </div>
            </cube-form-item>
          </cube-form-group>
        </cube-form>
      </div>
    </div>
    <div v-if="fields.length === 1" class="height-10">
    </div>
  </cube-popup>
</template>

<script>
export default {
  name: 'EditRowPopup',
  components: {},
  props: {},
  data() {
    return {
      componentPopup: null,
      validity: {},
      valid: undefined,
      model: {},
      headRowTitle: '',
      fieldConfig: [],
      showLastData: false,
      indexData: {},
      fields: [],
      options: {
        scrollToInvalidField: true,
        layout: 'standard'
      },
      submitFlag: false
    }
  },
  computed: {},
  watch: {
    fieldConfig: {
      handler(v) {
        const data = []
        v.forEach((item, index) => {
          const modelKey = item.lastFlag ? 'lastValue' : 'value' + (index + 1)
          this.$set(this.model, 'key', item.key)
          this.$set(this.model, modelKey, item.value)
          const rules =
            item.type === 'input'
              ? {
                required: item.required,
                type: 'number',
                max: 999999999999999,
                min: -999999999999999,
                money: true
              }
              : { required: item.required }
          data.push({
            modelKey: modelKey,
            label: item.label,
            rules: rules,
            type: item.type,
            trigger: 'blur'
          })
        })
        this.fields = [...data]
      },
      immediate: true
    }
  },
  created() {
    this.$bus.$on('openEditPopup', (data) => {
      const { headRowTitle, fieldConfig, showLastData, indexData } = data
      this.headRowTitle = headRowTitle
      this.fieldConfig = fieldConfig
      this.showLastData = showLastData
      this.indexData = indexData
      this.showPopup()
    })
  },
  methods: {
    // 显示
    showPopup() {
      this.componentPopup = this.$refs.myPopup
      this.componentPopup.show()
    },
    // 确定
    confirmBtn() {
      this.submitFlag = true
      this.$nextTick(() => {
        if (this.valid && this.submitFlag) {
          this.$bus.$emit('rowData', { ...this.model, ...this.indexData })
          this.componentPopup.hide()
        }
      })
    },
    // 取消
    cancelBtn() {
      this.componentPopup.hide()
    },
    // 校验
    validateHandler(result) {
      this.validity = result.validity
      this.valid = result.valid
      if (!this.valid && this.submitFlag && !this.handleValid()) {
        this.$createToast({
          txt: '请输入完整信息！',
          type: 'error'
        }).show()
        this.submitFlag = false
      }
    },
    // 是否已填
    handleValid() {
      Object.keys(this.model)
        .filter((item) => item.includes('value'))
        .forEach((key) => {
          if (this.model[key] || this.model[key] === 0) {
            return true
          } else {
            return false
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
      color: #0274ff;
      line-height: 50px;
      padding: 0 16px;
      box-sizing: content-box;
      font-size: 14px;
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
  .box-content {
    .list-item {
      display: flex;
      align-items: center;
      font-size: 12px;
      height: 24px;
      .list-value {
        width: 90%;
        color: #000;
      }
    }
    .th-120 {
      height: 120px;
      align-items: flex-start;
      .list-value {
        width: 100%;
      }
    }
    .cube-textarea-wrapper {
      height: 80px;
    }
    ::v-deep .cube-form-item {
      border-bottom: 1px solid #f7f7f7;
    }
    ::v-deep .cube-form-label span {
      font-weight: 600;
      font-size: 14px;
    }
    ::v-deep .cube-textarea {
      font-size: 12px;
      color: #000;
    }
  }
}
.height-10 {
  height: 10px;
  width: 100%;
  background-color: #fff;
}
</style>
