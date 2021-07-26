import Vue from 'vue'
import Router from 'vue-router'
import pages from '@/page/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'pages',
      component: pages
    }
  ]
})
