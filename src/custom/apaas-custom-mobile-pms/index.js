/*
 * @Author: your name
 * @Date: 2021-12-10 10:27:20
 * @LastEditTime: 2022-02-18 16:38:04
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-custom-apaas-mobile-pms\src\custom\apaas-custom-apaas-mobile-pms\index.js
 */
import '@/icons/index'
import 'cube-ui/lib/fonts/cubeic.dcc2b6f.ttf'
import ProjectHomePage from './custom-page/project-home-page.vue'
import ProjectMember from './components/pro-home/page/project-member.vue'
import AddMember from './components/pro-home/page/add-member.vue'
import ProjectWeeklyPage from './custom-page/project-weekly-page.vue'
import WeeklyDetails from './components/pro-weekly/page/weekly-details.vue'
import AddCoordinate from './components/pro-weekly/page/add-coordinate.vue'
import AddActionItem from './components/pro-weekly/page/add-actionItem.vue'
import AddCheckItem from './components/pro-weekly/page/add-checkItem.vue'
import SearchWeekly from './components/pro-weekly/page/search-weekly.vue'
import SearchProject from './components/common/page/search-project.vue'
import SearchPeople from './components/common/page/search-people.vue'
import SearchRole from './components/common/page/search-role.vue'
import SearchDepartment from './components/common/page/search-department.vue'
import { addMemberStore } from '../common/store/add-member.store'
import { projectHomeStore } from '../common/store/project-home.store'
import { projectWeeklyStore } from '../common/store/project-weekly.store'
import { weeklyDetailsStore } from '../common/store/weekly-details.store'
import { addCoordinateStore } from '../common/store/add-coordinate.store'
import { addActionItemStore } from '../common/store/add-action-item.store'
import { addCheckItemStore } from '../common/store/add-check-item.store'
import { customFormComponentList } from './custom-component/form-component'
import { widgetConfigList } from './custom-component/form-config'

const install = function(Vue) {
  if (!Vue.prototype.$bus) {
    Vue.prototype.$bus = new Vue()
  }
  Vue.component('apaas-custom-financial-norm', ProjectHomePage)
  Vue.component('apaas-custom-project-member', ProjectMember)
  Vue.component('apaas-custom-add-member', AddMember)
  Vue.component('apaas-custom-weekly-page', ProjectWeeklyPage)
  Vue.component('apaas-custom-weekly-details', WeeklyDetails)
  Vue.component('apaas-custom-add-coordinate', AddCoordinate)
  Vue.component('apaas-custom-add-action-item', AddActionItem)
  Vue.component('apaas-custom-add-check-item', AddCheckItem)
  Vue.component('apaas-custom-search-weekly', SearchWeekly)
  Vue.component('apaas-custom-search-project', SearchProject)
  Vue.component('apaas-custom-search-people', SearchPeople)
  Vue.component('apaas-custom-search-role', SearchRole)
  Vue.component('apaas-custom-search-department', SearchDepartment)
  Vue.prototype.$store.registerModule('addMemberModule', addMemberStore)
  Vue.prototype.$store.registerModule('projectHomeModule', projectHomeStore)
  Vue.prototype.$store.registerModule('projectWeeklyModule', projectWeeklyStore)
  Vue.prototype.$store.registerModule('weeklyDetailsModule', weeklyDetailsStore)
  Vue.prototype.$store.registerModule('addCoordinateModule', addCoordinateStore)
  Vue.prototype.$store.registerModule('addActionItemModule', addActionItemStore)
  Vue.prototype.$store.registerModule('addCheckItemModule', addCheckItemStore)
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
