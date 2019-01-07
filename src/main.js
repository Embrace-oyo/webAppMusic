import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import store from './store/index.js'
// 加载首页样式
import 'common/stylus/index.styl'
import 'common/stylus/border.css'

// 所有body下300ms 延迟取消
fastclick.attach(document.body)
// 懒加载
Vue.use(VueLazyLoad, {
  loading: require('common/image/defualt.jpg')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  /* render:(function (h) {  return h(App);  }); */
  render: h => h(App),
  router,
  store
})
