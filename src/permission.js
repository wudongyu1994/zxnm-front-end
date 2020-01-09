import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  const hasAuth = store.getters.authorities
  // hasAuth.forEach(auth => { console.log(auth) })
  // next()
  // determine whether the user has logged in
  if (hasAuth.length > 0) {
    if (to.path === '/login') {
      next({ path: '/' }) // if is logged in, redirect to the home page
      NProgress.done()
    } else {
      if (store.getters.hasAddRoutes) {
        next()
      } else {
        try {
          const accessRoutes = await store.dispatch('permission/generateRoutes', hasAuth)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('auth/resetAuth')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no auth*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
