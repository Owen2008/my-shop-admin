import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/users/Users'
import Rights from '@/components/rights/Rights'
import Roles from '@/components/rights/Roles'
import Goods from '@/components/products/Goods'
import Categories from '@/components/products/Categories'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/users',
          name: 'Users',
          component: Users
        },
        {
          path: '/roles',
          name: 'Roles',
          component: Roles
        },
        {
          path: '/rights',
          name: 'Rights',
          component: Rights
        },
        {
          path: '/goods',
          name: 'Goods',
          component: Goods
        },
        {
          path: '/categories',
          name: 'Categories',
          component: Categories
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('token') || to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})
export default router
