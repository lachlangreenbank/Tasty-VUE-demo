import Vue from 'vue'
import Router from 'vue-router'
// import Tree from '@/components/tree/Tree'
import Login from '@/components/Login/Login'
import Signup from '@/components/Signup/Signup'
import Dashboard from '@/components/Dashboard/dashBoard'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      meta: {
        requiresAuth: true
      }
    },
    // {
    //   path: '/',
    //   redirect: '/login'
    // },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('')
  else next()
})

export default router
