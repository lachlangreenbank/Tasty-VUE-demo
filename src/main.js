// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import VueFire from 'vuefire'
import firebase from 'firebase'
import Vuetify from 'vuetify'
import './firebase'
import VueMq from 'vue-mq'

Vue.use(VueMq, {
  breakpoints: { // default breakpoints - customize this
    sm: 500,
    md: 1250,
    lg: Infinity
  }
})

Vue.use(Vuetify)
Vue.use(VueFire)
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    safelyStoredNumber: 0
  },
  mutations: {
    setStoredNumber (state, newNumber) {
      // newNumber is the payload passed in.
      state.safelyStoredNumber = 1
    },
    unSetStoredNumber (state, newNumber) {
      // newNumber is the payload passed in.
      state.safelyStoredNumber = 0
    }
  }
})

// init firebase app
let app

Vue.config.productionTip = false

firebase.auth().onAuthStateChanged(function (user) {
/* eslint-disable no-new */
  if (!app) {
    new Vue({
      data: {
        currentUser: firebase.auth().currentUser
      },
      store,
      el: '#app',
      router,
      template: '<App/>',
      components: { App },
      VueMq
    })
  }
})
