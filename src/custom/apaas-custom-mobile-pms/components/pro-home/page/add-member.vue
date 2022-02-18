<!--
 * @Author: your name
 * @Date: 2021-12-24 16:48:00
 * @LastEditTime: 2022-02-18 16:29:59
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\apaas-custom-mobile-pms\components\pro-home\add-member.vue
-->
<template>
  <div class="add-member">
    <PageHeadSlot :backPath="backPath" returnRoute="addMember">
      <template v-slot:main>
        <div class="head-text">
          新增项目成员
        </div>
      </template>
    </PageHeadSlot>
    <cube-form
      :model="model"
      :options="options"
      @validate="validateHandler"
      @submit="submitHandler"
    >
      <cube-form-group>
        <cube-form-item :field="fields[0]">
          <div @click="selectMember">
            <div v-if="model.userName" class="list-item">
              <PersonTag
                tagKey="userName"
                class="list-value"
                :personName="model.userName"
              ></PersonTag>
              <x-svg-icon
                name="clear-icon"
                class="list-icon"
                @click.native.stop="clearMember"
              ></x-svg-icon>
            </div>
            <div v-else class="list-placeholder">
              请选择项目成员
            </div>
          </div>
        </cube-form-item>
        <cube-form-item :field="fields[1]">
          <div @click="selectRole">
            <div v-if="model.roleName" class="list-item">
              <div class="list-value">
                {{ model.roleName }}
              </div>
              <x-svg-icon
                name="clear-icon"
                class="list-icon"
                @click.native.stop="clearRole"
              ></x-svg-icon>
            </div>
            <div v-else class="list-placeholder">
              请选择项目角色
            </div>
          </div>
        </cube-form-item>
      </cube-form-group>
      <cube-form-group class="submit-btn">
        <cube-button type="submit" @click="confirmBtn">
          确认
        </cube-button>
      </cube-form-group>
    </cube-form>
  </div>
</template>

<script>
import apis from '../../../../common/api'
import PageHeadSlot from '../../common/components/page-head-slot.vue'
import PersonTag from '../../common/components/person-tag.vue'
import { mapState, mapMutations } from 'vuex'
import { SET_MEMBER_MODEL, CLEAR_MEMBER_MODEL } from '../../../../common/store/add-member.store.js'
export default {
  name: 'AddMember',
  components: {
    PageHeadSlot,
    PersonTag
  },
  data() {
    return {
      backPath: './apaas-custom-project-member',
      validity: {},
      valid: undefined,
      model: {
        userName: null,
        userId: null,
        roleName: null,
        roleId: null
      },
      fields: [
        {
          modelKey: 'userName',
          label: '项目成员',
          rules: {
            required: true
          },
          trigger: 'blur'
        },
        {
          modelKey: 'roleName',
          label: '项目角色',
          rules: {
            required: true
          },
          trigger: 'blur'
        }
      ],
      options: {
        scrollToInvalidField: true,
        layout: 'standard'
      },
      clickFlag: false,
      returnRoute: null
    }
  },
  computed: {
    ...mapState({
      memberModel: (state) => state.addMemberModule.memberModel,
      financeModel: (state) => state.projectHomeModule.financeModel
    })
  },
  watch: {},
  created() {
    this.returnRoute = this.$route.query.returnRoute
    if (this.returnRoute === 'searchPeople' || this.returnRoute === 'searchRole') {
      this.model = this.memberModel
    } else if (this.returnRoute === 'proMember') {
      this.clearMemberModel()
    }
  },
  methods: {
    ...mapMutations('addMemberModule', {
      setMemberModel: SET_MEMBER_MODEL,
      clearMemberModel: CLEAR_MEMBER_MODEL
    }),
    selectMember() {
      this.$router.push({
        path: './apaas-custom-search-people',
        query: {
          ...this.$route.query,
          returnRoute: 'addMember'
        }
      })
    },
    selectRole() {
      this.$router.push({
        path: './apaas-custom-search-role',
        query: {
          ...this.$route.query,
          returnRoute: 'addMember'
        }
      })
    },
    clearMember() {
      this.$set(this.model, 'userId', null)
      this.$set(this.model, 'userName', null)
      this.setMemberModel(this.model)
    },
    clearRole() {
      this.$set(this.model, 'roleId', null)
      this.$set(this.model, 'roleName', null)
      this.setMemberModel(this.model)
    },
    submitHandler(e) {
      e.preventDefault()
      this.saveMember()
    },
    validateHandler(result) {
      this.validity = result.validity
      this.valid = result.valid
      if (!this.valid && this.clickFlag) {
        this.$createToast({
          txt: '请输入完整信息！',
          type: 'error'
        }).show()
        this.clickFlag = false
      }
    },
    confirmBtn() {
      this.clickFlag = true
    },
    saveMember() {
      const toast = this.$createToast({
        txt: 'Loading...',
        mask: true
      })
      toast.show()
      const request = {
        ...apis.SAVE_PROJECT_MEMBER_APP,
        params: {
          name: this.model.userId,
          roles: this.model.roleId,
          projectName: this.financeModel.indexVo.projectId,
          projectCode: this.financeModel.indexVo.projectCode,
          pmsProjectCode: this.financeModel.indexVo.pmsProjectCode,
          projectManager: this.financeModel.indexVo.projectMngId
        }
      }
      this.$request(request).asyncThen((resp) => {
        toast.hide()
        if (resp.code === 'ok') {
          this.$createToast({
            txt: '保存成功！',
            type: 'txt'
          }).show()
          this.$router.push({
            path: './apaas-custom-project-member',
            query: {
              ...this.$route.query,
              returnRoute: 'addMember'
            }
          })
        } else {
          this.$createToast({
            txt: resp.message,
            type: 'error'
          }).show()
        }
      })
    }
  }
  /* beforeRouteEnter(to, from, next) {
    if (from.name === 'apaas-custom-search-people' || from.name === 'apaas-custom-search-role') {
      next((vm) => {
        vm.model = vm.memberModel
      })
    } else if (from.name === 'apaas-custom-project-member') {
      next((vm) => {
        vm.clearMemberModel()
      })
    } else {
      next()
    }
  } */
}
</script>

<style lang="scss" scoped>
.add-member {
  height: 100vh;
  background: #f8f8f8;
  .head-text {
    color: #333333;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }
  ::v-deep .cube-form-item {
    border-bottom: 1px solid #f7f7f7;
  }
  ::v-deep .cube-form-label span {
    font-weight: 600;
    font-size: 14px;
  }
  .list-item {
    display: flex;
    align-items: center;
    font-size: 12px;
    height: 24px;
    .list-value {
      width: 90%;
      color: #000;
    }
    .list-icon {
      width: 10%;
      text-align: right;
      ::v-deep .svg-icon {
        color: #b8b8b8 !important;
        width: 18px !important;
        height: 18px !important;
      }
    }
  }
  .list-placeholder {
    width: 100%;
    color: #b8b8b8;
    font-size: 14px;
  }
  .submit-btn {
    background: #f8f8f8;
    padding: 20px;
    .cube-btn {
      background: #027aff;
    }
  }
  .page-header {
    border-bottom: 1px solid #e8e8e8;
  }
  ::v-deep .svg-icon {
    color: #333333 !important;
  }
}
</style>
