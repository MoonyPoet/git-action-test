import Vue from 'vue';
import routerConfig from './routerConfig';
import Router from 'vue-router';
import { getCookie } from './assets/js/reused';
let HeaderAsideLayout = () => import('./layouts/HeaderAsideLayout');
/**
 * 将路由配置扁平化
 * @param {Array} config 路由配置
 * @return {Route}
 * @example
 * const routes = [
 *   {
 *     path: '/dashboard/analysis',
 *     component: HeaderAsideLayout,
 *     children: [
 *       {
 *         path: '',
 *         component: Dashboard,
 *       },
 *     ],
 *   },
 * ];
 */

const routerMap = [];

const recursiveRouterConfig = (config = []) => {
  config.forEach((item) => {
    const route = {
      path: item.path,
      component: item.layout,
      meta:item.meta,
      redirect:item.redirect,
      children: [
        {
          path: '',
          name:item.name,
          component: item.component,
          redirect:item.redirect,
          meta:item.meta
        },
      ],
    };
    if (Array.isArray(item.children)) {
      recursiveRouterConfig(item.children);
    }
    routerMap.push(route);
  });

  return routerMap;
};
// post("",)
Vue.use(Router);
// (async ()=>{
//   let routerConfigArr=await post("auth/find_router")
//   console.log(routerConfig)
//   const routes = recursiveRouterConfig(routerConfig);
//   debugger
//   if(window.router===undefined){
//     window.router=new Router({
//       routes,
//     });
//   }
// })()
// function setRouter(arr){
//   arr.map((element)=>{
//     if(element.component){
//       console.log(element.component)
//       element.layout=HeaderAsideLayout;
//       let path=element.component;
//       element.component=()=>import(path)
//     }
//     if(element.children&&element.children.length>0){
//       element.children.map((item)=>{
//         console.log(item.component)
//         item.layout=HeaderAsideLayout;
//         let childPath=item.component;
//         item.component=()=>import(childPath);
//         if(!item.children){
//           delete item.children
//         }
//       })
//     }else{
//       delete element.children;
//     }
//   })
//   return arr;
// }
// let request = new XMLHttpRequest();
// request.open('POST', baseURL+"auth/find_router?insId="+getCookie("insId"), false); 
// request.setRequestHeader("Content-Type","application/json")
// request.send(JSON.stringify({}));
// if (request.status === 200) {
//     console.log()
//     let routerConfigArr=JSON.parse(request.response).data;
//     let arr=setRouter(routerConfigArr);
//     // console.log(arr)
//     routerConfig.push(...arr)
//     console.log(routerConfig)
//     // recursiveRouterConfig(routerConfig)
   
// }
const routes = routerConfig;
if(window.router===undefined){
  window.router=new Router({
    routes,
  });
}



