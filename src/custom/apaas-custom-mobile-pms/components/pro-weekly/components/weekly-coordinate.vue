<!--
 * @Author: your name
 * @Date: 2022-01-27 14:37:59
 * @LastEditTime: 2022-02-18 16:33:31
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/pro-weekly/weekly-coordinate.vue
-->
<template>
  <div class="weekly-coordinate">
    <div class="coordinate-title">
      <div class="head-text fs-16 fw-600">
        协调事项
      </div>
      <div v-if="editMode" class="head-icon">
        <x-svg-icon id="addIcon" name="add-icon" @click.native="goCoordinatePage('1')"></x-svg-icon>
      </div>
    </div>
    <div ref="coordinate" class="coordinate-list">
      <div v-if="coordinateList.length">
        <div v-for="(item, index) in coordinateList" :key="index" class="list-item">
          <div class="title fs-14 mb-10">
            协调事项：
          </div>
          <div class="text mb-5">
            {{ item.coordinateMatter }}
          </div>
          <div class="label mb-5">
            协调部门：
            <span class="text">{{ item.coordinateDepartment }}</span>
          </div>
          <div class="label mb-2">
            期望完成时间：
            <span class="text">{{ item.expectCompleteTime }}</span>
          </div>
          <div class="label box">
            <div class="box-left">
              负责人：
              <span class="text">{{ item.coordinatePeople }}</span>
            </div>
            <div v-if="editMode" class="box-right">
              <x-svg-icon
                :id="'edit' + index"
                class="mr-15"
                name="edit-panel"
                @click.native="goCoordinatePage('2', item, index)"
              ></x-svg-icon>
              <x-svg-icon
                class="svg-26"
                name="delete-icon"
                @click.native="deleteCoordinate(item.pkId)"
              ></x-svg-icon>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="list-empty">
        <x-empty>
          <span class="empty-text">暂无数据</span>
        </x-empty>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { SET_SCROLL_TOP, SET_SD_COORDINATE } from '../../../../common/store/weekly-details.store'
import {
  SET_COORDINATE_MODEL,
  CLEAR_COORDINATE_MODEL
} from '../../../../common/store/add-coordinate.store.js'
export default {
  name: 'WeeklyCoordinate',
  components: {},
  props: {},
  data() {
    return {
      editMode: false,
      coordinateList: [],
      returnRoute: null
    }
  },
  computed: {
    ...mapState({
      configField: (state) => state.weeklyDetailsModule.configField,
      sdCoordinate: (state) => state.weeklyDetailsModule.sdCoordinate,
      coordinateModel: (state) => state.addCoordinateModule.coordinateModel
    })
  },
  watch: {
    sdCoordinate: {
      handler(v) {
        this.coordinateList = [...v]
      }
    },
    configField: {
      handler(v) {
        this.editMode = v.editMode
      },
      immediate: true
    }
  },
  mounted() {
    const { returnRoute, coordType } = this.$route.query
    this.returnRoute = returnRoute
    this.coordinateList = this.sdCoordinate
    if (this.returnRoute === 'addCoordinate' && this.coordinateModel.submitFlag) {
      if (coordType === '1') {
        this.coordinateList.push(this.coordinateModel)
      } else if (coordType === '2') {
        const newList = []
        this.coordinateList.forEach((item) => {
          if (item.pkId) {
            if (item.pkId === this.coordinateModel.pkId) {
              newList.push(this.coordinateModel)
            } else {
              newList.push(item)
            }
          } else {
            if (item.id === this.coordinateModel.id) {
              newList.push(this.coordinateModel)
            }
          }
        })
        this.coordinateList = [...newList]
        this.set_sd_coordinate(this.coordinateList)
      }
    }
  },
  methods: {
    ...mapMutations('weeklyDetailsModule', {
      set_sd_coordinate: SET_SD_COORDINATE
    }),
    ...mapMutations('weeklyDetailsModule', {
      setScrollTop: SET_SCROLL_TOP
    }),
    ...mapMutations('addCoordinateModule', {
      setCoordinateModel: SET_COORDINATE_MODEL,
      clearCoordinateModel: CLEAR_COORDINATE_MODEL
    }),
    // 跳转到协调事项详情页面
    goCoordinatePage(type, item, index) {
      if (type === '1') {
        this.clearCoordinateModel() // 新增
        this.setScrollTop(document.querySelector('#addIcon').offsetTop)
      } else {
        this.setCoordinateModel(item) // 编辑
        this.setScrollTop(document.querySelector('#edit' + index).offsetTop)
      }
      this.$router.push({
        path: './apaas-custom-add-coordinate',
        query: {
          ...this.$route.query,
          coordType: type,
          headTitle: type === '1' ? '新增协调事项' : '编辑协调事项',
          returnRoute: 'weeklyDetails'
        }
      })
    },
    // 删除协调事项
    deleteCoordinate(pkId) {
      this.$createDialog({
        type: 'confirm',
        content: '是否确认删除？',
        onConfirm: () => {
          this.coordinateList = this.coordinateList.filter((item) => item.pkId !== pkId)
          this.set_sd_coordinate(this.coordinateList)
        }
      }).show()
    },
    /**
     * 收集所有数据
     */
    returnAllData() {
      return {
        data: this.coordinateList
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.weekly-coordinate {
  .coordinate-title {
    display: flex;
    align-items: center;
    padding: 15px;
    color: #333333;
    border-bottom: 1px solid #e8e8e8;
    .head-text {
      width: 100px;
    }
    .head-icon {
      flex: 1;
      text-align: right;
      ::v-deep .svg-icon {
        color: #999999;
      }
    }
  }
  .coordinate-list {
    padding: 15px;
    .list-item {
      padding: 15px 15px 10px;
      margin-bottom: 15px;
      background: #f5f8fa;
      border-radius: 15px;
      .title {
        color: #333333;
      }
      .label {
        font-size: 12px;
        color: #333333;
      }
      .text {
        font-size: 12px;
        line-height: 18px;
        color: #666666;
      }
      .box {
        display: flex;
        align-items: center;
        .box-right {
          width: 100px;
        }
        .box-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .svg-26 {
            ::v-deep .svg-icon {
              width: 26px !important;
              height: 26px !important;
            }
          }
        }
      }
    }
    .list-empty {
      height: 180px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      .x-empty {
        margin-top: -40px;
      }
      ::v-deep .svg-icon {
        width: 80px !important;
        height: 80px !important;
      }
    }
  }
  ::v-deep .svg-icon {
    width: 22px !important;
    height: 22px !important;
    color: #999999;
  }
  .fs-12 {
    font-size: 12px;
  }
  .fs-14 {
    font-size: 14px;
  }
  .fs-16 {
    font-size: 16px;
  }
  .fw-600 {
    font-weight: 600;
  }
  .mb-2 {
    margin-bottom: 2px;
  }
  .mb-5 {
    margin-bottom: 5px;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .mr-15 {
    margin-right: 15px;
  }
}
</style>
