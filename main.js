import Vue from 'vue'
import App from './App'
import MpComponents from './wxml'

Vue.config.productionTip = false

Vue.use(MpComponents)

/* eslint-disable no-new */
const instance = new Vue({
  render: h => h(App)
})

instance.$mount('#app')
