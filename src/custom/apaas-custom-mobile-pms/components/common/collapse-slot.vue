<!--
 * @Author: your name
 * @Date: 2022-01-24 14:34:54
 * @LastEditTime: 2022-02-11 16:12:44
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/common/collapse-slot.vue
-->
<template>
  <div class="collapse-slot">
    <div class="collapse-head">
      <div class="head-label">
        <x-svg-icon
          v-if="shrink"
          name="arrow-rights"
          class="label-icon"
          @click.native="foldItem"
        ></x-svg-icon>
        <x-svg-icon
          v-else
          name="arrow-bottoms"
          class="label-icon"
          @click.native="foldItem"
        ></x-svg-icon>
        <div class="label-text" @click="foldItem" :class="{ 'long-label': extraLabel }">
          <span :class="{ required: requiredField }">
            {{ collapseLabel }}
          </span>
          <span v-if="extraLabel" class="extra-label">
            {{ extraLabel }}
          </span>
        </div>
        <div class="label-area">
          <slot name="header"></slot>
        </div>
      </div>
      <div class="head-content">
        <slot name="content"></slot>
      </div>
    </div>
    <div class="collapse-content" ref="collapse">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollapseSlot',
  props: {
    collapseLabel: {
      type: String,
      default: ''
    },
    requiredField: {
      type: Boolean,
      default: false
    },
    extraLabel: {
      type: String,
      default: ''
    },
    collapseKey: {
      type: Number,
      default: 0
    }
  },
  components: {},
  data() {
    return {
      shrink: true
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    // 折叠面板
    foldItem() {
      let el = document.getElementsByClassName('collapse-content')[this.collapseKey]
      if (window.getComputedStyle(this.$refs.collapse).height === '0px') {
        el.style.transition = 'none'
        el.style.height = 'auto'
        var targetHeight = window.getComputedStyle(this.$refs.collapse).height
        el.style.transition = 'height 600ms'
        el.style.height = '0px'
        el.offsetWidth
        el.style.height = targetHeight
      } else {
        el.style.height = '0px'
      }
      this.shrink = !this.shrink
      this.$emit('draw-back', this.shrink)
    },
    // 重新计算高度
    refreshItem() {
      let el = document.getElementsByClassName('collapse-content')[this.collapseKey]
      el.style.transition = 'none'
      el.style.height = 'auto'
    }
  }
}
</script>

<style lang="scss" scoped>
.collapse-slot {
  background-color: #fff;
  padding: 10px 15px;
  .collapse-head {
    .head-label {
      display: flex;
      align-items: center;
      .label-icon {
        flex-basis: 28px;
        ::v-deep .svg-icon {
          width: 18px !important;
          height: 18px !important;
          color: #999999;
        }
      }
      .label-text {
        flex-basis: 120px;
        color: #333333;
        .extra-label {
          color: #999999;
        }
      }
      .long-label {
        flex-basis: 150px;
      }
      .label-area {
        flex: 1;
      }
      .required::before {
        content: '*';
        font-size: 14px;
        font-family: SimSun, sans-serif;
        color: #f5222d;
      }
    }
  }
  .collapse-content {
    height: 0px;
    transition: max-height 600ms;
    overflow: hidden;
  }
}
</style>
