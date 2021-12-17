/*
 * @Author: your name
 * @Date: 2021-12-10 10:27:20
 * @LastEditTime: 2021-12-10 14:49:27
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-custom-apaas-mobile-pms\src\custom\apaas-custom-apaas-mobile-pms\index.js
 */
import '@/icons/index'
import ApaasProjectHomePage from './custom-page/project-home-page.vue'
import { customFormComponentList } from './custom-component/form-component'
import { widgetConfigList } from './custom-component/form-config'

const install = function(Vue) {
  // 安装Apaas-mobile-pms模块, 此处的和apaas.json定义的路由，必须一致
  Vue.component('apaas-custom-project-home-page', ApaasProjectHomePage)
  // 安装表单部件
  // 注册自开发表单组件
  if (customFormComponentList && Array.isArray(customFormComponentList)) {
    customFormComponentList.forEach((comp) => {
      Vue.component(comp.name, comp)
    })
  }
  // 表单引擎注册自开发组件配置
  if (widgetConfigList && Array.isArray(widgetConfigList)) {
    widgetConfigList.forEach((widgetConfig) => {
      const compConfig = {
        widgetConfig
      }
      Vue.FormEngine && Vue.FormEngine.registerCustomComponentConfig(compConfig)
    })
  }
}

const ApaasCustomMobilePmsPlugin = {
  install: install
}

export default ApaasCustomMobilePmsPlugin
