<!--
 * @Author: your name
 * @Date: 2022-01-26 10:45:55
 * @LastEditTime: 2022-02-14 20:40:21
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/common/tip-component.vue
-->
<template>
  <div>
    <cube-tip ref="myTip" :direction="direction" :offsetTop="offsetTop">
      <slot name="content"></slot>
    </cube-tip>
  </div>
</template>

<script>
export default {
  name: 'TipComponent',
  components: {},
  props: {
    direction: {
      type: String,
      default: ''
    },
    offsetTop: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    showTip() {
      this.$refs.myTip.show()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .cube-tip {
  width: 250px;
  height: auto;
  max-height: 250px;
  padding: 15px 40px 5px 10px;
  text-align: left;
}
</style>
