// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'

import Edit from './components/Edit'

Vue.use(VueRouter)

Vue.config.productionTip = false

const routes = [
  {
    path: '/edit',
    name: 'edit',
    component: Edit
  },
  { path: '*', redirect: '/edit' }
]

const router = new VueRouter({routes})

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   template: '<App/>',
//   components: { App }
// })

new Vue({
  router
}).$mount('#app')
