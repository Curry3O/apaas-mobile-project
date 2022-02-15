<!--
 * @Author: your name
 * @Date: 2022-01-27 16:25:27
 * @LastEditTime: 2022-02-07 14:45:12
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/pro-weekly/add-coordinate.vue
-->
<template>
  <div class="add-coordinate">
    <PageHeadSlot :backPath="backPath" returnRoute="addCoordinate">
      <template v-slot:main>
        <div class="head-text">
          {{ headTitle }}
        </div>
      </template>
    </PageHeadSlot>
    <cube-form :model="model" :options="options" @submit="submitHandler">
      <cube-form-group>
        <cube-form-item :field="fields[0]">
          <div class="list-item th-120">
            <div class="list-value">
              <cube-textarea
                v-model="model.coordinateMatter"
                placeholder="请输入协调事项"
                :maxlength="200"
              ></cube-textarea>
            </div>
          </div>
        </cube-form-item>
        <cube-form-item :field="fields[1]">
          <div @click="selectDepart">
            <div v-if="model.coordinateDepartment" class="list-item">
              <div class="list-value">
                {{ model.coordinateDepartment }}
              </div>
              <x-svg-icon
                name="clear-icon"
                class="list-icon"
                @click.native.stop="clearDepart"
              ></x-svg-icon>
            </div>
            <div v-else class="list-placeholder">
              请选择协调部门
            </div>
          </div>
        </cube-form-item>
        <cube-form-item :field="fields[2]">
          <div @click="selectDate">
            <div v-if="model.expectCompleteTime" class="list-item">
              <div class="list-value">
                {{ model.expectCompleteTime }}
              </div>
              <x-svg-icon
                name="clear-icon"
                class="list-icon"
                @click.native.stop="clearDate"
              ></x-svg-icon>
            </div>
            <div v-else class="list-placeholder">
              请选择期望完成时间
            </div>
          </div>
        </cube-form-item>
        <cube-form-item :field="fields[3]">
          <div @click="selectPeople">
            <div v-if="model.coordinatePeople" class="list-item">
              <PersonTag
                tagKey="coordinatePeople"
                class="list-value"
                :personName="model.coordinatePeople"
              ></PersonTag>
              <x-svg-icon
                name="clear-icon"
                class="list-icon"
                @click.native.stop="clearPeople"
              ></x-svg-icon>
            </div>
            <div v-else class="list-placeholder">
              请选择负责人
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
import PageHeadSlot from '../common/page-head-slot.vue'
import PersonTag from '../common/person-tag.vue'
import { generateUUID } from '../../../common/utils/tool'
import { mapState, mapMutations } from 'vuex'
import { SET_COORDINATE_MODEL } from '../../../common/store/add-coordinate.store.js'
export default {
  name: 'AddCoordinate',
  components: {
    PageHeadSlot,
    PersonTag
  },
  data() {
    return {
      headTitle: '',
      backPath: './apaas-custom-weekly-details',
      model: {
        coordinateMatter: '',
        coordinateDepartment: null,
        coordinateDepartmentId: null,
        expectCompleteTime: null,
        coordinatePeople: null,
        coordinatePeopleId: null,
        pkId: null
      },
      fields: [
        {
          modelKey: 'coordinateMatter',
          label: '协调事项'
        },
        {
          modelKey: 'coordinateDepartment',
          label: '协调部门'
        },
        {
          modelKey: 'expectCompleteTime',
          label: '期望完成时间'
        },
        {
          modelKey: 'coordinatePeople',
          label: '负责人'
        }
      ],
      options: {
        scrollToInvalidField: true,
        layout: 'standard'
      },
      datePicker: null,
      submitFlag: false,
      returnRoute: null
    }
  },
  computed: {
    ...mapState({
      coordinateModel: (state) => state.addCoordinateModule.coordinateModel
    })
  },
  watch: {},
  created() {
    const { headTitle, returnRoute } = this.$route.query
    this.headTitle = headTitle
    this.returnRoute = returnRoute
    this.model = this.coordinateModel
    if (this.returnRoute === 'weeklyDetails') {
      this.model.pkId = this.model.pkId ? this.model.pkId : generateUUID()
    }
  },
  methods: {
    ...mapMutations('addCoordinateModule', {
      setCoordinateModel: SET_COORDINATE_MODEL
    }),
    selectDepart() {
      this.setCoordinateModel(this.model)
      this.$router.push({
        path: './apaas-custom-search-department',
        query: {
          ...this.$route.query,
          returnRoute: 'addCoordinate'
        }
      })
    },
    selectDate() {
      if (!this.datePicker) {
        this.datePicker = this.$createDatePicker({
          title: '期望完成时间',
          value: new Date(),
          onSelect: this.selectHandle
        })
      }
      this.datePicker.show()
    },
    selectHandle(date) {
      this.$set(this.model, 'expectCompleteTime', this.$dayjs(new Date(date)).format('YYYY-MM-DD'))
    },
    selectPeople() {
      this.setCoordinateModel(this.model)
      this.$router.push({
        path: './apaas-custom-search-people',
        query: {
          ...this.$route.query,
          returnRoute: 'addCoordinate'
        }
      })
    },
    clearDepart() {
      this.$set(this.model, 'coordinateDepartmentId', null)
      this.$set(this.model, 'coordinateDepartment', null)
    },
    clearDate() {
      this.$set(this.model, 'expectCompleteTime', null)
    },
    clearPeople() {
      this.$set(this.model, 'coordinatePeopleId', null)
      this.$set(this.model, 'coordinatePeople', null)
    },
    submitHandler(e) {
      e.preventDefault()
      if (this.submitFlag) {
        this.setCoordinateModel({ submitFlag: this.submitFlag, ...this.model })
        this.$router.push({
          path: './apaas-custom-weekly-details',
          query: {
            ...this.$route.query,
            returnRoute: 'addCoordinate'
          }
        })
      }
    },
    confirmBtn() {
      this.submitFlag = true
    }
  }
}
</script>

<style lang="scss" scoped>
.add-coordinate {
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
  .cube-textarea-wrapper {
    height: 80px;
  }
  ::v-deep .cube-textarea {
    font-size: 12px;
    color: #000;
  }
  .th-120 {
    height: 120px;
    align-items: flex-start;
    .list-value {
      width: 100%;
    }
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
