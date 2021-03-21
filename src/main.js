/* eslint-disable spaced-comment,space-infix-ops */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios';
import qs from 'qs';
Vue.use(iView);
Vue.config.productionTip = false;
//全局使用
Vue.prototype.$ajax=axios;
Vue.prototype.$qs=qs;

router.beforeEach((to, from, next) => {

  //需要的认证的组件
  const  arr=['Order','ShoppingCart','Pay','MyAddress','MyOrder'];
  //判断是否需要认证
  let a=arr.indexOf(to.name);
  if(a!=-1){ //需要认证了
    //进行认证
    let user=sessionStorage.getItem("loginInfo");
    if(user!=null){
      iView.LoadingBar.start();
      next();
    }else{
      next('/Login');
    }
  }
  next();
});


//设置axios的全局设置   每次请求添加一个token参数
axios.interceptors.request.use(
  config => {
    // 判断本地的sessionstory中是否有token
    const loginInfo=sessionStorage.getItem("loginInfo");

    if(loginInfo!=null){
    let token= JSON.parse(loginInfo).token;
      config.params={
        'token':token
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  })

//设置axios的全局设置   对应每次的请求响应 进行处理
axios.interceptors.response.use((response) => {
  if(response.data.code===501){
    router.push("/Login");
  }
  return response
}, error => {
  return Promise.reject(error)
})

router.afterEach(route => {
  iView.LoadingBar.finish();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
