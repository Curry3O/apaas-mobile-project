<!--
 * @Author: your name
 * @Date: 2021-12-24 17:55:07
 * @LastEditTime: 2021-12-25 14:22:48
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\components\common\person-tag.vue
-->
<template>
  <div class="person-tag">
    <div class="tag-avatar">
      <x-person-avatar :personName="personName"></x-person-avatar>
    </div>
    <div class="tag-label">
      <span class="tag-text">{{ personName }}</span>
      <!-- <x-svg-icon name="close" @click.native.stop="closeTag"></x-svg-icon> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonTag',
  props: {
    tagKey: {
      type: String
    },
    personName: {
      type: String
    }
  },
  data() {
    return {}
  },
  created() {
    console.log(this.personName)
  },
  methods: {
    closeTag() {
      this.$emit('close-tag', { key: this.tagKey })
    }
  }
}
</script>

<style lang="scss" scoped>
.person-tag {
  display: flex;
  align-items: center;
  .tag-avatar {
    width: 0%;
    z-index: 9999;
  }
  .tag-label {
    width: 30%;
    display: flex;
    align-items: center;
    background: #f5f7fa;
    border-radius: 12px;
    font-size: 12px;
    height: 24px;
    padding-left: 35px;
    vertical-align: bottom;
    .tag-text {
      color: #000;
      padding-right: 5px;
    }
    ::v-deep .svg-icon {
      color: #b2b2b2;
      height: 16px !important;
      width: 16px !important;
    }
  }
}
</style>
