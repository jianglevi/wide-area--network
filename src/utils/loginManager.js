import {
  Message
} from 'element-ui'

/**
 *  用户登录 状态  的统一管理。
 */
export default {
  httpClient: null, // 用于发送请求的httpClient.
  router: null, // 路由器
  store: null, // 状态管理器
  /** 初始化 */
  init(http, router, store) {
    this.httpClient = http
    this.router = router
    this.store = store
  },
  /** 用户登录  */
  login(args,switchLanguage) {
    this.httpClient.post('ajaxLogin', args, r => {
      if (!r.result) {
        Message.error(r.msg)
        return
      }
      var state = r.map.state //获取用户的登录状态
      console.log("state:" + state)
      Message.success('登录成功！')
      //保存登录 信息
      console.log(r.map,321)
      this.saveLoginStatus(r.data, r.map)
      this.router.replace('/main')
      this.httpClient.get('switchLanguage', switchLanguage, r => {
      })
    })
  },
  /** 用户退出 */
  logout() {
    this.httpClient.get('ajaxLogout', '', r => {
      if (!r.result) {
        Message.error('退出登录失败')
        return
      }
      // 清除登录 信息，并重定向至 登录页面
      this.clearLoginStatus_toLoginPage(true)
    })
  },
  /** 刷新登录用户的状态信息 */
  refreshLoginInfo() {
    this.httpClient.get('loginInfo', null, r => {
      if (r.result) {
        this.saveLoginStatus(r.data, r.map)
      }
    })
  },
  /** 保存用户登录状态 */
  saveLoginStatus(menu, userInfo) {
    //保存至状态管理器
    this.store.commit('updateMenu', menu) //setMenu
    this.store.commit('updateUserInfo', userInfo) //setUserInfo
    //保存至sessionStorage
    sessionStorage.menu = JSON.stringify(menu)
    sessionStorage.userInfo = JSON.stringify(userInfo)
    sessionStorage.token = 'yj'
  },
  /** 清除登录 信息，并重定向至 登录页面 */
  clearLoginStatus_toLoginPage(noShowMsg) {
    if (!noShowMsg) {
      // Message.warning('登录验证超时，请重新登录！')
    }
    sessionStorage.clear()
    this.store.commit('resetLoginInfo')
    this.router.replace('/login')
  },
  /** 本地验证用户是否已登录  */
  validateLogin() {
    return sessionStorage.token ? true : false
  },
  /** 通过发送请求到服务器，验证用户是否已登录  */
  validateLoginByRequest() {
    // 请求验证
    this.httpClient.get('isLogin', null, r => {
      if (!r.result) {
        // 清除登录 信息，重定向至  登录页面
        this.clearLoginStatus_toLoginPage()
      }
    })
  },

}
