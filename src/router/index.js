import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: 'Dashboard',
        icon: 'dashboard'
      }
    }]
  },
  {
    path: '/product',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Product',
      component: () => import('@/views/product/index'),
      meta: {
        title: 'Product',
        icon: 'product'
      }
    }]
  },
  {
    path: '/order',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Order',
      component: () => import('@/views/order/index'),
      meta: {
        title: 'Order',
        icon: 'order'
      }
    }]
  },
  {
    path: '/device',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Device',
      component: () => import('@/views/device/index'),
      meta: {
        title: 'Device',
        icon: 'device'
      }
    }]
  },
  {
    path: '/step',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Step',
      component: () => import('@/views/step/index'),
      meta: {
        title: 'Step',
        icon: 'step'
      }
    }]
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/logistics',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Logistics',
      component: () => import('@/views/logistics/index'),
      meta: {
        title: 'Logistics',
        icon: 'logistics',
        permissions: '/logistics'
      }
    }]
  },
  {
    path: '/user',
    component: Layout,
    children: [{
      path: 'index',
      name: 'User',
      component: () => import('@/views/user/index'),
      meta: {
        title: 'User',
        icon: 'peoples',
        permissions: '/user'
      }
    }]
  },
  {
    path: '/role',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Role',
      component: () => import('@/views/role/index'),
      meta: {
        title: 'Role',
        icon: 'people',
        permissions: '/role'
      }
    }]
  },
  {
    path: '/permission',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Permission',
      component: () => import('@/views/permission/index'),
      meta: {
        title: 'Permission',
        icon: 'form',
        permissions: '/permission'
      }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
