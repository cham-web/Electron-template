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
  // 设置串口通信实例
  setPort ({ commit }, port) { // path 串口路径
    commit('SET_PORT', port)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
