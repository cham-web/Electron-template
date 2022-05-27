import { routes } from '../../router'
const state = {
  routes: routes[0].children
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
