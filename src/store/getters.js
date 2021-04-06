const getters = {
  permission_routes: state => state.permission.routes,
  user_info: state => state.user.userInfo,
  port: state => state.user.port // 串口实例
}
export default getters
