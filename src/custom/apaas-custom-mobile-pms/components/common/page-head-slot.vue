<!--
 * @Author: your name
 * @Date: 2021-12-10 15:44:06
 * @LastEditTime: 2021-12-25 17:01:46
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\components\page-head-slot.vue
-->
<template>
  <div class="page-header">
    <div class="head-content">
      <x-svg-icon
        v-if="showLeft"
        name="arrow-left"
        class="both-sides"
        @click.native="goBack"
      ></x-svg-icon>
      <div class="center-area">
        <slot v-if="showCenter" name="main"></slot>
      </div>
      <div class="both-sides">
        <slot v-if="showRight" name="icon"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeadSlot',
  props: {
    showLeft: {
      type: Boolean,
      default: true
    },
    showCenter: {
      type: Boolean,
      default: true
    },
    showRight: {
      type: Boolean,
      default: true
    },
    backPath: {
      type: String
    }
  },
  methods: {
    goBack() {
      if (this.backPath) {
        this.$router.push({
          path: this.backPath,
          query: {
            ...this.$route.query
          }
        })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-header {
  background: #fff;
  .head-content {
    padding: 15px 0;
    display: flex;
    align-items: center;
    .both-sides {
      flex: 3;
      display: flex;
      justify-content: center;
      align-items: center;
      ::v-deep .svg-icon {
        width: 22px !important;
        height: 22px !important;
        color: #fff;
      }
    }
    .center-area {
      flex: 14;
      .cube-input {
        background: transparent;
      }
      ::v-deep .cube-input-field {
        font-size: 12px;
        height: 28px;
        padding: 0 15px 0 5px;
        background: #fff;
        border-top-right-radius: 1.428571rem;
        border-bottom-right-radius: 1.428571rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      ::v-deep .cube-input:after {
        border: none;
      }
      ::v-deep .cube-input_active {
        .cube-input-field {
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
        }
      }
      ::v-deep .br-radius {
        .cube-input-field {
          border-top-right-radius: 1.428571rem !important;
          border-bottom-right-radius: 1.428571rem !important;
        }
      }
      ::v-deep .cube-input-prepend {
        height: 28px;
        padding-left: 5px;
        background: #fff;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
      }
      ::v-deep .cube-input-append {
        height: 28px;
        background: #fff;
        border-top-right-radius: 1.428571rem;
        border-bottom-right-radius: 1.428571rem;
      }
      ::v-deep input::-webkit-input-placeholder,
      textarea::-webkit-input-placeholder,
      .cube-input-field--placeholder {
        font-size: 12px !important;
      }
    }
  }
}
</style>
