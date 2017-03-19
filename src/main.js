// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import Wilddog from 'wilddog'
import WildVue from 'wildvue'

import Edit from './components/Edit'
import Result from './components/Result'
import Answer from './components/Answer'

Vue.use(VueRouter)
Vue.use(Wilddog)
Vue.use(WildVue)

Vue.config.productionTip = false

const routes = [
  {
    path: '/edit',
    name: 'edit',
    component: Edit
  },
  {
    path: '/result',
    name: 'result',
    component: Result
  },
  {
    path: '/answer',
    name: 'answer',
    component: Answer
  },
  { path: '*', redirect: '/edit' }
]

const router = new VueRouter({routes})

var wilddogApp = Wilddog.initializeApp({
  syncURL: 'https://lie.wilddogio.com/'
})
var sync = wilddogApp.sync()
let ref = sync.ref('/data')
let ref2 = sync.ref('/test')

ref.on('value', function (snapshot) {
  console.log(snapshot.val())
})

// ref.on('child_added', (data) => {
//   console.log(data)
// })

// ref2.push({
//   name: 'run',
//   value: 23
// })

// ref2.child('朝润2017').set({
//   name: 'chao',
//   age: 22
// })

// ref.child('chao').set({
//   name: 'chao',
//   age: 22
// })

let vm = new Vue({
  router,
  wilddog: {
    ref: ref,
    wilddogData: sync.ref('/data2')
  }
}).$mount('#app')

vm.$bindAsArray('questions', ref2.child('/chao'))
