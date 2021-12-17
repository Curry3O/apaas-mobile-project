<!--
 * @Author: your name
 * @Date: 2021-11-16 14:33:39
 * @LastEditTime: 2021-12-16 15:07:45
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-custom-pms\src\custom\apaas-custom-expert-database\components\pie-echart.vue
-->
<template>
  <e-charts
    id="echarts"
    ref="myEchart"
    :style="{ height: pieHeight + 'px' }"
    :options="options"
    :auto-resize="true"
  ></e-charts>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/chart/pie'
export default {
  name: 'PieChart',
  components: {
    ECharts
  },
  props: {
    pieData: {
      type: Array
    },
    pieStyle: {
      type: Object
    },
    pieHeight: {
      type: Number,
      default: 180
    }
  },
  data() {
    return {
      options: {
        tooltip: {
          trigger: 'item',
          position: function(point) {
            return [0, point[1]]
          }
        },
        color: ['#76B7FF', 'rgb(229, 233, 242)'],
        series: [
          {
            type: 'pie',
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                color: '#333333',
                fontSize: '16',
                fontWeight: 'bold',
                formatter: '{d}%'
              }
            },
            labelLine: {
              show: false
            },
            data: []
          }
        ]
      }
    }
  },
  watch: {
    pieData: {
      handler(v) {
        if (v) {
          this.$set(this.options.series[0], 'data', v)
        }
      },
      immediate: true
    },
    pieStyle: {
      handler(v) {
        if (v) {
          this.$set(this.options.series[0], 'radius', v.radius)
        }
      },
      immediate: true
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeChart)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart)
  },
  methods: {
    resizeChart() {
      if (this.$refs && this.$refs.myEchart) {
        this.$refs.myEchart.resize()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#echarts {
  width: 180px;
}
</style>
