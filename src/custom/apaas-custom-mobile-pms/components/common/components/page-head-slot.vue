<!--
 * @Author: your name
 * @Date: 2021-12-10 15:44:06
 * @LastEditTime: 2022-02-18 10:38:23
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\components\page-head-slot.vue
-->
<template>
  <div class="page-header">
    <div class="head-content">
      <x-svg-icon
        v-if="showBackIcon"
        name="arrow-left"
        class="both-sides left-icon"
        @click.native="goBack"
      ></x-svg-icon>
      <div class="center-area">
        <slot name="main"></slot>
      </div>
      <div class="both-sides right-icon">
        <slot name="icon"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeadSlot',
  props: {
    noBack: {
      type: Boolean,
      default: false
    },
    showBackIcon: {
      type: Boolean,
      default: true
    },
    backPath: {
      type: String,
      default: ''
    },
    returnRoute: {
      type: String,
      default: ''
    }
  },
  methods: {
    goBack() {
      if (this.noBack) {
        this.$emit('go-back')
        return
      }
      if (this.backPath) {
        // 指定返回页面
        this.$router.push({
          path: this.backPath,
          query: {
            ...this.$route.query,
            returnRoute: this.returnRoute
          }
        })
      } else {
        // 默认跳回菜单首页
        this.$router.push({
          name: 'app-appMenu',
          params: this.$route.params,
          query: {
            ...this.$route.query,
            returnRoute: undefined
          }
        })
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
