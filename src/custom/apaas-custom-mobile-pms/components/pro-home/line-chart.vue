<!--
 * @Author: your name
 * @Date: 2021-09-16 14:33:56
 * @LastEditTime: 2021-12-16 16:36:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \apaas-custom-pms\src\custom\apaas-custom-financial-norm\components\echart-data.vue
-->
<template>
  <e-charts
    id="echarts"
    :style="{ width: boxWidth + 'px' }"
    ref="myEchart"
    :options="options"
    :auto-resize="true"
  ></e-charts>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
export default {
  name: 'LineChart',
  components: {
    ECharts
  },
  props: {
    lineData: {
      type: Object
    }
  },
  data() {
    return {
      boxWidth: 320,
      options: {
        title: {
          text: '实际毛利偏差情况',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          position: function(point) {
            return [0, point[1]]
          },
          formatter: function(params) {
            let list = []
            let listItem = ''
            for (var i = 0; i < params.length; i++) {
              list.push(
                '<i>' +
                  params[i].axisValue +
                  '周</i><br><i style="display: inline-block;width: 10px;height: 10px;background: ' +
                  params[i].color +
                  ';margin-right: 5px;border-radius: 50%;}"></i><span style="display:inline-block;">' +
                  params[i].seriesName +
                  '：' +
                  params[i].value +
                  '%'
              )
            }
            listItem = list.join('<br>')
            return '<div class="showBox">' + listItem + '</div>'
          }
        },
        legend: { data: ['实际毛利率'] },
        grid: {
          left: '15%'
        },
        xAxis: {
          axisLabel: {
            formatter: '{value}周'
          },
          type: 'category',
          data: []
        },
        yAxis: {
          axisLabel: {
            formatter: '{value}%'
          },
          min: null,
          max: null
        },
        series: [
          {
            name: '实际毛利率',
            data: [],
            type: 'line',
            itemStyle: {
              color: '#0984e3'
            },
            lineStyle: {
              color: '#0984e3'
            }
          },
          {
            type: 'line',
            markLine: {
              symbol: 'none',
              silent: true,
              label: {
                show: true,
                formatter: '{b}: {c}%',
                position: 'insideEndBottom'
              },
              data: [],
              lineStyle: {
                show: true,
                color: '#2ecc71',
                type: 'solid',
                width: 2
              }
            }
          },
          {
            type: 'line',
            markLine: {
              symbol: 'none',
              silent: true,
              label: {
                show: true,
                formatter: '{b}: {c}%',
                position: 'insideMiddleTop'
              },
              data: [],
              lineStyle: {
                show: true,
                color: '#e74c3c',
                type: 'dashed'
              }
            }
          },
          {
            type: 'line',
            markLine: {
              symbol: 'none',
              silent: true,
              label: {
                show: true,
                formatter: '{b}: {c}%',
                position: 'insideMiddleBottom'
              },
              data: [],
              lineStyle: {
                show: true,
                color: '#e74c3c',
                type: 'dashed'
              }
            }
          }
        ]
      }
    }
  },
  watch: {
    lineData: {
      handler(v) {
        if (v) {
          this.$set(this.options.xAxis, 'data', v.weekNum)
          this.$set(this.options.series[0], 'data', v.deviation)
          v.mrdGrossMargin &&
            this.$set(this.options.series[1].markLine, 'data', [
              {
                name: 'MRD计划毛利率',
                yAxis: v.mrdGrossMargin
              }
            ])
          v.mrdGrossMarginAbove &&
            this.$set(this.options.series[2].markLine, 'data', [
              {
                name: '上限',
                yAxis: v.mrdGrossMarginAbove
              }
            ])
          v.mrdGrossMarginUnder &&
            this.$set(this.options.series[3].markLine, 'data', [
              {
                name: '下限',
                yAxis: v.mrdGrossMarginUnder
              }
            ])
          if (v.mrdGrossMargin && v.mrdGrossMarginAbove && v.mrdGrossMarginUnder) {
            this.$set(
              this.options.yAxis,
              'min',
              this.getRounding(
                Math.min(
                  v.mrdGrossMargin,
                  v.mrdGrossMarginAbove,
                  v.mrdGrossMarginUnder,
                  ...v.deviation
                ),
                false
              )
            )
            this.$set(
              this.options.yAxis,
              'max',
              this.getRounding(
                Math.max(
                  v.mrdGrossMargin,
                  v.mrdGrossMarginAbove,
                  v.mrdGrossMarginUnder,
                  ...v.deviation
                ),
                true
              )
            )
          }
        }
      },
      immediate: true
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeChart)
    this.setBoxWidth()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart)
  },
  methods: {
    setBoxWidth() {
      this.$nextTick(() => {
        this.boxWidth = this.$parent.$refs.lineBox.clientWidth
      })
    },
    resizeChart() {
      if (this.$refs && this.$refs.myEchart) {
        this.$refs.myEchart.resize()
        this.setBoxWidth()
      }
    },
    getRounding(num, bigger) {
      if (num >= 0) {
        return bigger ? (Math.floor(num / 10) + 1) * 10 : (Math.floor(num / 10) - 1) * 10
      } else {
        return bigger ? (Math.floor(num / 10) + 1) * 10 : Math.floor(num / 10) * 10
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#echarts {
  height: 300px;
  margin-top: 5px;
}
</style>
