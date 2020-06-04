import Vue from 'vue';
import routerConfig from './routerConfig';
import Router from 'vue-router';
import store from '@/vuex/store';
let Login = () => import('./pages/Login');
let NotFound = () => import('./pages/NotFound');
let NoAuthority = () => import('./pages/NoAuthority/NoAuthority');
let ServerError = () => import('./pages/ServerError');
let PageOne =() =>import('./pages/PageOne');
Vue.use(Router);
let routeArr=[ {
  path: '/',
  redirect:"/index",
  children:[
    ...routerConfig,
    // {
    //   path: 'index',
    //   component: Index,
    //   name: '机构首页',
    // },
    {
      path: 'noauthority',
      component: NoAuthority,
      name: '无权限',
    },
    {
      path: 'serverError',
      component: ServerError,
      name: '服务器错误',
    },
    {
      path: 'notFound',
      name: 'notFound',
      component: NotFound,
    },
    {
      path: 'login',
      component:Login,
    },
    {
      path: 'pageOne',
      component: PageOne,
      name: '测试',
    }
  ]
},
// {
//   path: '*',
//   component: NotFound,
// }
]
// 因为router-view 视图层只有一个，而不是按照每个二级路由component里面设置router-view处理,现在把二级路由处理成一级路由
let newRouterArr=[];
function generateRouter(routerArr,path=""){
  routerArr.map((router)=>{
    let curPath=(router.path==="/")?"/":"/"+router.path;
    newRouterArr.push({
      path:path+curPath,
      meta:router.meta,
      name:router.name,
      redirect:router.redirect,
      component:router.component
    })
    if(router.children){
      generateRouter(router.children,(path+curPath)==="/"?"":(path+curPath))
    }
  }) 
}
generateRouter(routeArr)
store.state.baseRouter=newRouterArr;
const routes = newRouterArr;
if(window.router===undefined){
  window.router=new Router({
    routes,
  });
}



