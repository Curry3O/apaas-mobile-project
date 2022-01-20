/*
 * @Author: your name
 * @Date: 2021-12-10 10:27:20
 * @LastEditTime: 2022-01-18 19:42:54
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-custom-apaas-mobile-pms\src\custom\apaas-custom-apaas-mobile-pms\index.js
 */
import '@/icons/index'
import 'cube-ui/lib/fonts/cubeic.dcc2b6f.ttf'
import ProjectHomePage from './custom-page/project-home-page.vue'
import ProjectMember from './components/pro-home/project-member.vue'
import AddMember from './components/pro-home/add-member.vue'
import ProjectWeeklyPage from './custom-page/project-weekly-page.vue'
import SearchProject from './components/common/search-project.vue'
import SearchPeople from './components/common/search-people.vue'
import SearchRole from './components/common/search-role.vue'
import { addMemberStore } from '../common/store/add-member.store'
import { projectHomeStore } from '../common/store/project-home.store'
import { projectWeeklyStore } from '../common/store/project-weekly.store'
import { customFormComponentList } from './custom-component/form-component'
import { widgetConfigList } from './custom-component/form-config'

const install = function(Vue) {
  // 安装Apaas-mobile-pms模块, 此处的和apaas.json定义的路由，必须一致
  Vue.component('apaas-custom-financial-norm', ProjectHomePage)
  Vue.component('apaas-custom-project-member', ProjectMember)
  Vue.component('apaas-custom-add-member', AddMember)
  Vue.component('apaas-custom-weekly-page', ProjectWeeklyPage)
  Vue.component('apaas-custom-search-project', SearchProject)
  Vue.component('apaas-custom-search-people', SearchPeople)
  Vue.component('apaas-custom-search-role', SearchRole)
  Vue.prototype.$store.registerModule('addMemberModule', addMemberStore)
  Vue.prototype.$store.registerModule('projectHomeModule', projectHomeStore)
  Vue.prototype.$store.registerModule('projectWeeklyModule', projectWeeklyStore)
  // 自定义指令
  Vue.directive('focus', {
    // 输入框自动聚焦指令
    inserted: function(el) {
      // 聚焦元素
      el.querySelector('input').focus()
    }
  })
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
