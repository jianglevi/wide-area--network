//用于 非父子组件  信息传递。
import Vue from 'vue'
const id = new Date().getTime()
export default new Vue({
  data(){
    return {
      id:'bus'+id
    }
  }
})