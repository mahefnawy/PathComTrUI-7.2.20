import 'babel-polyfill'
import Vue from 'vue'
import VueTour from 'vue-tour'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import vuetify from './plugins/vuetify'
import 'vue-tour/dist/vue-tour.css'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts-gl'
import vueDebounce from 'vue-debounce'

Vue.use(VueTour)
Vue.use(vueDebounce)
Vue.component('v-chart', ECharts)
Vue.use(require('vue-moment'))
Vue.config.productionTip = false

const vm = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

global.vm = vm
