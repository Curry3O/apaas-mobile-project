<!--
 * @Author: your name
 * @Date: 2021-12-10 10:27:20
 * @LastEditTime: 2021-12-15 11:46:02
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\components\x-avatar\x-avatar.vue
-->
<template>
  <div class="x-avatar">
    <template v-if="avatarUrl">
      <img class="img-avatar" :src="avatarRealUrl" alt="avatar" />
    </template>
    <template v-else>
      <div
        class="default-avatar"
        :style="{'background-color':  === 'primaryColor' ? '' : defaultAvatarColor}"
      >
        <span>{{ displayName }}</span>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    avatarUrl: {
      type: String,
      default: ''
    },
    personName: {
      type: String,
      default: ''
    },
    defaultAvatarColor: {
      type: String,
      default: 'primaryColor'
    }
  },
  computed: {
    ...mapState({
      token: (state) => state.authModule.token
    }),
    displayName: function() {
      if (this.personName) {
        return this.personName.slice(this.personName.length - 2, this.personName.length)
      } else {
        return ''
      }
    },
    avatarRealUrl: function() {
      return `${this.avatarUrl}&token=${this.token}`
    }
  }
}
</script>

<style lang="scss" scoped>
.x-avatar {
  @include circleShape(1.714rem);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $--app-white-font-color;
  overflow: hidden;
  cursor: pointer;
  .img-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .default-avatar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $--app-primary-color;
    span {
      @include fontSize(1rem);
    }
  }
}
</style>
