const getters = {
  permission_routes: state => state.permission.routes,
  parent_routes: state => state.permission.parentRoutes,
  user_info: state => state.user.userInfo,
  port: state => state.user.port // 串口实例
}
export default getters
