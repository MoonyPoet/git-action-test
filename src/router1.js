import Vue from 'vue';
import routerConfig from './routerConfig';
import Router from 'vue-router';

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
const routes = recursiveRouterConfig(routerConfig);
Vue.use(Router);
if(window.router===undefined){
  window.router=new Router({
    routes,
  });
}
