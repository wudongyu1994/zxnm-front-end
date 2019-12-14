const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  //
  authorities: state => state.auth.authorities,
  name: state => state.auth.name,
  principal: state => state.auth.principal,
  //
  permission_routes: state => state.permission.routes
}
export default getters
