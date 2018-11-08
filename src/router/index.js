import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
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
