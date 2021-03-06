import storage from 'store'

const state = {
  token: storage.get('token'),
  userInfo: null,
  port: null // 串口通信实例
}
const mutations = {
  SET_USERINFO (state, userInfo) { // 保存用户信息
    state.userInfo = userInfo
  },
  SET_TOKEN (state, token) { // 设置token
    state.token = token
    storage.set('token', token)
  },
  SET_PORT (state, port) {
    state.port = port
  }
}
const actions = {
  // 设置串口通信实例
  setPort ({ commit }, port) { // path 串口路径
    commit('SET_PORT', port)
  },
  setUserInfo ({ commit }, userInfo) {
    commit('SET_USERINFO', userInfo)
  },
  setToken ({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  logout ({ commit }, state) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', null)
      commit('SET_USERINFO', null)
      storage.clearAll()
      resolve(true)
    })
  }
}

export default {
  state,
  mutations,
  actions
}
