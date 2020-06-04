import store from '@/vuex/store';
// let Index = () => import('@/pages/Index');
// let Institution=()=>import('@/pages/Institution/Institution');
import {
    getCookie,
    getLocal,
    isEmpty
} from 'assets/js/reused';
    //路由拦截判断登录
let routerBlock = async() => {
    //路由输入变换
    window.router.beforeEach((to, from, next) => {
        
        //凡是回到登录就清空菜单
        //不存在用户信息则回到登录页,如果是notFound,serverError
        // let loadingInstance = Loading.service({ fullscreen: true });
        // store.commit("setDailogObj", loadingInstance)
        let baseInfo = getCookie('baseInfo');
        if (to.path != "/noAuthority" && to.path != '/login') {
            if(to.meta.isBlock!==false){
                if (getLocal("routerArr")&&!getLocal("routerArr").includes(to.path.split('/')[1])) {
                    next('/noAuthority');
                } else {
                    if (!baseInfo) {
                        if (to.path === '/login' || to.path === '/notFound' || to.path === '/serverError') {
                            store.commit("clearOption");
                            next()
                        } else {
                            store.commit("clearOption");
                            next('/login')
                        }
                    } else {
                        //存在就更新用户信息，并允许跳到下一页；
                        store.commit('setBaseInfo', baseInfo)
                        //如果已经登录直接跳到首页
                        if (to.path === '/login') {
                            //token失效弹窗会触发
                            next()
                        } else {
                           
                            next()
                        }
                    }
                }
            }else{
                next()
            }
        } else {
            next()
        }
    })
}

router.onError((error) => {
    const pattern = /(Loading chunk .* failed\.)|(Failed to load resource: the server responded with a status of 404)|(net::ERR_ABORTED 404)/g;
    const isChunkLoadFailed = error.message.match(pattern);
    if(!isEmpty(router.history.pending)){
        const targetPath = router.history.pending.fullPath;
        if (isChunkLoadFailed) {
        router.replace(targetPath);
        }
    }
});



export default routerBlock;