/*
 * @Author: your name
 * @Date: 2021-12-21 16:57:24
 * @LastEditTime: 2022-01-14 15:55:33
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \apaas-mobile-pms\src\custom\common\api\index.js
 */
import ProjectHomeApi from './project-home'
import ProjectWeeklyApi from './project-weekly'

export default {
  ...ProjectHomeApi,
  ...ProjectWeeklyApi
}
