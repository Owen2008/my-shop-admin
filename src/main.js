// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import Login from './Login'
import router from './router'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import './assets/common.css'
import axios from 'axios'
// 引入树形表格菜单,并注册成公用组件
import ElTreeGrid from 'element-tree-grid'
import moment from 'moment'
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// console.log(ElTreeGrid.name) //el-table-tree-column
Vue.component(ElTreeGrid.name, ElTreeGrid)
Vue.use(VueQuillEditor /* { default global options } */)
// 日期过滤器
Vue.filter('dateFilter', (input, format = 'YYYY-MM-DD HH:mm') => {
  return moment(input * 1000).format(format)
})
// 优化axios
Vue.prototype.axios = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // console.log(11, config)
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response.data
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  render: (h) => h(App)
})
