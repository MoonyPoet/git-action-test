import '@babel/polyfill';
import Vue from 'vue';
import elementUi from './elementUi';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css';
import './styles/index.scss';
import App from './App.vue';
import i18n from './i18n/i18n';
import store from '@/vuex/store';
import Router from 'vue-router';
import './ipConfig';
import "./cancelRequest";
import api from './request';
import './router';
import routerBlock from './routerBlocking';
import './assets/js/filter'
import './assets/css/public.css';
import wiierror from "./assets/js/catchError";
import {getFourRoleArr,watchObj,getLocal,getProp} from "assets/js/reused";

// import errorHandler from "./catchError";
String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
// Vue.use();
Vue.use(elementUi);
Vue.prototype.$axios = api;
Vue.mixin({
    methods:{
        getFourRoleArr(path){
            return getFourRoleArr(path)
        },
        getProp(...keys){
            return getProp(...keys)
        },
        log(...argu){
            console.log(argu)
        }
    }
})

// window.addEventListener('error', function (event) {
//     if (event) {
//       var target = event.target || event.srcElement;
     
//       // 写上
//       var isElementTarget = target instanceof HTMLElement
//       if (!isElementTarget) return; // js error不再处理
  
//       var source = event.target
//       console.dir(source)
//       // 对该资源进行处理..
//     }
//     //设为true表示捕获阶段调用，会在元素的onerror前调用
//   }, true)
// window.addEventListener && window.addEventListener("error", function(t) {
//     console.log(t)
//     if (!t.message) {
//         var r, n = (r = t.target ? t.target : t.srcElement) && r.outerHTML;
//         n && n.length > 200 && (n = n.slice(0, 200));
//         var a = {
//             type: "resourceError",
//             target: {
//                 outerHTML: n,
//                 src: r && r.src,
//                 tagName: r && r.tagName,
//                 id: r && r.id,
//                 className: r && r.className,
//                 name: r && r.name,
//                 type: r && r.type
//             }
//         };
//         if (a.target.src && window.XMLHttpRequest) {
//             var u = new XMLHttpRequest;
//             u.Fundebug = !0,
//             u.open("OPTIONS", a.target.src),
//             u.send(),
//             u.onload = function(e) {
//                 200 !== e.target.status && (a.target.status = e.target.status,
//                 a.target.statusText = e.target.statusText),
//                 f(a)
//             }
//         }
//     }
// }, !0);
// function f(message){
//     console.log(message)
// }
// Vue.config.warnHandler = errorHandler;
// Vue.config.errorHandler = errorHandler;

// Vue.prototype.$throw = (error)=> errorHandler(error);
window.lang="cn";
if(getLocal('lang')===undefined){
    window.lang="cn";
    i18n.locale="cn";
}else{
    window.lang=getLocal('lang');
    i18n.locale=getLocal('lang');
}
watchObj({
    obj:window,
    prop:"lang",
    isDefault:false,
    callback:(v)=>{
        i18n.locale=v;
    }
})

Vue.config.productionTip = false;
Vue.use(Router); 
new Vue({
    i18n,
    router,
    store,
    render: h => h(App),
}).$mount('#app');
//路由拦截判断登录
routerBlock();

if(!(location.href.search("http://localhost")>-1)){
    // wiierror.init()
}