import { routes } from '../../router'
console.log(routes[0].children.filter(item => !item.hidden))
console.log(routes[0].children.filter(item => !item.hidden).length && routes[0].children.filter(item => !item.hidden)[0].children ? routes[0].children.filter(item => !item.hidden)[0].children : [])
const state = {
  routes: routes[0].children.filter(item => !item.hidden).length && routes[0].children.filter(item => !item.hidden)[0].children ? routes[0].children.filter(item => !item.hidden)[0].children : [],
  parentRoutes: routes[0].children.filter(item => !item.hidden)
}

const mutations = {
  SET_ROUTES (state, routes) { // 保存用户信息
    state.routes = routes
  }
}
const actions = {
  // 设置路由
  setRoutes ({ commit }, routes) {
    commit('SET_ROUTES', routes)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
