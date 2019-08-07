import Vue from 'vue'
import Router from 'vue-router'
import wtInput from '@/components/WebtoolsInput'
import wtOutput from '@/components/WebtoolsOutput'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'wt-input',
      component: wtInput
    },
    {
      path: '/output',
      name: 'wt-output',
      component: wtOutput
    }
  ]
});