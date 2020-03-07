import Vue from 'vue'
import App from './App'
import store from './store'
import { api,util } from '@/comps/base/index.js'
Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$store = store;

 util.init();
// Vue.prototype.$cloud = api.init();

const app = new Vue({
    ...App
})
app.$mount()
