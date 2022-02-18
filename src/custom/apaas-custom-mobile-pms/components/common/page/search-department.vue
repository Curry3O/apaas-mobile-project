<!--
 * @Author: your name
 * @Date: 2022-01-27 13:47:14
 * @LastEditTime: 2022-02-18 15:25:52
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /pms-mobile/src/custom/apaas-custom-mobile-pms/components/common/search-department.vue
-->
<template>
  <div class="search-department">
    <div class="search-head">
      <div class="ph-input">
        <cube-input
          v-model="searchValue"
          :clearable="true"
          :autofocus="true"
          :class="{ 'br-radius': !hasSearchValue }"
          placeholder="搜索部门"
          @keyup.enter.native="searchData"
          @keyup.13="searchData"
        >
        </cube-input>
      </div>
      <div class="ph-text" @click="goBack">
        取消
      </div>
    </div>
    <div class="search-content">
      <cube-scroll
        v-if="searchList.length"
        ref="myScroll"
        :data="searchList"
        :options="cubeScrollOptions"
      >
        <cube-radio-group>
          <cube-radio
            v-for="item in searchList"
            :key="item.id"
            v-model="selected.value"
            :option="item"
            class="list-item"
            @input="inputChange"
          >
            <div class="item-text">
              {{ item.structureName }}
            </div>
            <div class="item-icon">
              <x-svg-icon name="arrow-right-icon"></x-svg-icon>
            </div>
          </cube-radio>
        </cube-radio-group>
      </cube-scroll>
      <x-empty v-else>
        <span class="empty-text">暂无数据</span>
      </x-empty>
    </div>
    <div class="search-bottom">
      <div class="remark-text">
        <span>
          {{ '单选，已选择【' + (selected.selectItem.structureName || '') + '】' }}
        </span>
      </div>
      <div class="bottom-btn">
        <cube-button @click="confirmBtn">
          确定
        </cube-button>
      </div>
    </div>
  </div>
</template>

<script>
import apis from '../../../../common/api'
import { mapState, mapMutations } from 'vuex'
import { SET_COORDINATE_MODEL } from '../../../../common/store/add-coordinate.store'
export default {
  name: 'SearchDepartment',
  data() {
    return {
      searchValue: '',
      selected: {
        value: null,
        selectItem: {}
      },
      searchList: [],
      returnRoute: null
    }
  },
  computed: {
    ...mapState({
      coordinateModel: (state) => state.addCoordinateModule.coordinateModel
    }),
    hasSearchValue() {
      return this.searchValue.length
    },
    cubeScrollOptions() {
      return {
        pullUpLoad: false,
        scrollbar: true
      }
    }
  },
  watch: {
    searchValue(v) {
      if (!v) {
        this.initData()
      }
    }
  },
  created() {
    this.returnRoute = this.$route.query.returnRoute
  },
  methods: {
    ...mapMutations('addCoordinateModule', {
      setCoordinateModel: SET_COORDINATE_MODEL
    }),
    initData() {
      this.searchList = []
      this.loadData()
    },
    searchData() {
      this.initData()
    },
    loadData() {
      if (!this.searchValue) {
        return
      }
      const request = {
        ...apis.QUERY_ALL_DEPARTMENT,
        params: {
          keyword: this.searchValue
        }
      }
      this.$request(request).asyncThen((resp) => {
        if (resp.code === 'ok' && resp.data) {
          resp.data.forEach((item) => {
            item.value = item.id
          })
          this.searchList = resp.data
        } else {
          this.$createToast({
            txt: resp.message,
            type: 'error'
          }).show()
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    inputChange(e) {
      const data = this.searchList.filter((item) => item.id === e)[0]
      this.$set(this.selected, 'selectItem', data)
    },
    confirmBtn() {
      if (Object.keys(this.selected.selectItem).length) {
        let path = null
        const { name, id } = this.selected.selectItem
        if (this.returnRoute === 'addCoordinate') {
          path = './apaas-custom-add-coordinate'
          this.setCoordinateModel({
            coordinateMatter: this.coordinateModel.coordinateMatter,
            coordinateDepartment: name,
            coordinateDepartmentId: id,
            expectCompleteTime: this.coordinateModel.expectCompleteTime,
            coordinatePeople: this.coordinateModel.coordinatePeople,
            coordinatePeopleId: this.coordinateModel.coordinatePeopleId,
            pkId: this.coordinateModel.pkId
          })
        }
        this.$router.push({
          path: path,
          query: {
            ...this.$route.query,
            returnRoute: 'searchDepart'
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-department {
  height: 100vh;
  background: #fff;
  position: relative;
  .search-head {
    display: flex;
    align-items: center;
    padding: 15px 0 15px 15px;
    .ph-input {
      flex: 5;
    }
    .ph-text {
      flex: 1;
      text-align: center;
      color: #010101;
      font-weight: 600;
      font-size: 14px;
    }
    .cube-input {
      background: transparent;
    }
    ::v-deep .cube-input-field {
      font-size: 12px;
      color: #343838;
      height: 28px;
      padding: 0 10px;
      background: #f6f7fb;
      border-radius: 5px;
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
    ::v-deep .cube-input-append {
      height: 28px;
      background: #f6f7fb;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    ::v-deep .br-radius {
      .cube-input-field {
        border-top-right-radius: 5px !important;
        border-bottom-right-radius: 5px !important;
      }
    }
    ::v-deep input::-webkit-input-placeholder,
    textarea::-webkit-input-placeholder,
    .cube-input-field--placeholder {
      font-size: 12px !important;
    }
  }
  .search-content {
    height: calc(100vh - 158px);
    background: #f8f8f8;
    .list-item {
      background: #fff;
      display: flex;
      align-items: center;
      padding: 0px 10px;
      ::v-deep .cube-radio-ui {
        margin-right: 10px;
      }
      .item-text {
        width: 90%;
        font-size: 12px;
        color: #111111;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .item-icon {
        width: 10%;
        text-align: center;
        color: #ababab;
        ::v-deep .svg-icon {
          height: 20px !important;
          width: 20px !important;
        }
      }
    }
  }
  ::v-deep .x-empty {
    padding-top: 20px;
  }
  .search-bottom {
    height: 100px;
    width: 100%;
    position: absolute;
    bottom: 0px;
    .remark-text {
      background: #f8f8f8;
      color: #999999;
      padding: 20px 10px 0;
      text-align: right;
    }
    .bottom-btn {
      height: calc(100vh - 553px);
      background: #f8f8f8;
      padding: 10px 20px 20px;
      .cube-btn {
        background: #027aff;
      }
    }
  }
  ::v-deep .cube-radio-ui {
    -webkit-text-stroke-width: 0px;
  }
  ::v-deep .cube-radio_selected .cube-radio-ui {
    background-color: #0274ff;
  }
}
</style>
