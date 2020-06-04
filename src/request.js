import axios from 'axios';
import Vue from 'vue';
import {
    debounce,
    getCleanCacheData,
    trimObj,
    clone,
    getCookie,
    deleteNull,
    isEmpty
} from "assets/js/reused";
import Observer from "./observer";
import {
    Loading
} from 'element-ui';
import store from "./vuex/store";
// 添加TOKEN
// AUTH_TOKEN
// axiosIns.defaults.headers.common['Authorization'] = 212233;
const axiosIns = axios.create({}); 
axiosIns.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axiosIns.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
axiosIns.defaults.responseType = 'json';
let observer=new Observer();
// 一分钟超时
axiosIns.defaults.timeout = 60000; 
let loadingInstance = "";
let loadingTableInstance=[];
//配置正在发送请求白名单 导入提交，编辑
let beforeSendArr = ["login","logout"]
//列表查询白名单
let beforeSendTableArr = []
// 添加一个请求拦截器
axiosIns.interceptors.request.use((config) => {
    // 配置config
    // /\/(?=(edit|add|import))/
    observer.subscribe();
    if ((/(edit|add|import)/.test(config.url)) || (beforeSendArr.some(v => config.url.includes(v)))) {
        loadingInstance = Loading.service({
            lock: true,
            text: '正在发送请求',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        document.querySelector(".el-loading-mask.is-fullscreen").style.zIndex=3000;
    }
    if(/(?![\s\S]*codelist)^[\s\S]*(list|paging|Paging)/g.test(config.url)||(beforeSendTableArr.some(v => config.url.includes(v)))){
        document.querySelectorAll(".el-table .el-table__body-wrapper").forEach((item,index)=>{
            loadingTableInstance.push({
                url:config.url,
                dom:document.querySelectorAll(".el-table__empty-text")[index],
                loadingInstance:Loading.service({
                    target:item,
                    lock: true,
                    text: '正在发送请求',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
            });
        })
    }
    
    config.headers.Accept = 'application/json';
    if (config.config && config.config.headers) {
        config.headers.Accept = config.config["Content-Type"];
        config.headers["Content-Type"] = config.config;
   
    }
    // if(!config.url.includes("system/optionlist")){
        
    // }
    //设置取消token
   
    if(!isEmpty(getCookie("insId"))){
        config.headers["Id"]=getCookie("insId");
        window.cancelRequest.setCancelToken();
        config.cancelToken=window.cancelRequest.getCancelToken();
    }
    if (store.state.baseInfo && store.state.baseInfo.token) {
        config.headers.Token = store.state.baseInfo.token;
    }
    // config.headers.Token = store.state.baseInfo.token||"token";
    config.headers.Lt = 1;
    return config;
}, error => {
    console.log(error)
    return Promise.reject(error)
});
// 添加一个响应拦截器
axiosIns.interceptors.response.use((response) => {
    window.cancelRequest.setPaded();
    setTimeout(() => {
        if (loadingInstance) {
            loadingInstance.close();
        }
        if(!isEmpty(loadingTableInstance)){
            loadingTableInstance.map((item)=>{
                if(response.config.url===item.url){
                    item.loadingInstance.close()
                    if(item.dom){
                        item.dom.style.display="block";
                        item.dom.innerText="暂无数据";
                    }
                }
            })
        }
    })
   
    // const data = response.data;
    // const status = response.status;
    // if (status === 200) {
    //   return Promise.resolve(response);
    // }
    // return promise.reject(response);
    return response;
}, (error) => {
    setTimeout(async() => {
        if(loadingInstance){
            loadingInstance.close();
        }
        if(!isEmpty(loadingTableInstance)&&error&&error.response&&error.response.config){
            loadingTableInstance.map((item)=>{
                if(error.response.config.url===item.url){
                    item.loadingInstance.close()
                }
            })
        }
        if (error.response && error.response.status) {
            if (error.response.status == 320) {
                //非登录页弹出
                if(router.currentRoute.path!=="/login"){
                    function reLogin() {
                        Vue.prototype.$alert("该账号已经在别处登录,点击确定重新登录", {
                            confirmButtonText: '确定',
                            callback: action => {
                                router.push({
                                    path: '/login'
                                });
                            }
                        })
                    }
                    observer.setCallback(reLogin);
                    observer.onResolve()
                }
            } else {
                // Vue.prototype.$throw(error.response)
                Vue.prototype.$alert(error.response.status)
            }
        } else {
            if(error&&error.config&&error.config.url&&/(?:find)|(?:info)/g.test(error.config.url)){
                function serverErr() {
                    Vue.prototype.$alert("服务端异常");
                }
                // debounce(openDailog1, 1000);
                observer.setCallback(serverErr)
                observer.onResolve()
            }else{
                Vue.prototype.$alert("服务端异常");
            }
            
        }
    })
});

const ajaxMethod = ['get', 'post'];
const api = {};

ajaxMethod.forEach((method) => {

    // 数组取值的两种方式
    api[method] = function ({
        url,
        data,
        config,
        error = undefined,
        success = undefined,
        complete = undefined,
        openDailog = true,
        isDebounce = false,
        isSubmit = false,
    }) {
        return new Promise(((resolve, reject) => {
            // Loading.service({ target: "body" });
            const REFRESHDATA = async function() {
                if (store.state.baseInfo == "" || store.state.baseInfo.token == undefined) {
                    let baseInfo = await getCleanCacheData({
                        action: "cookie",
                        keyword: "baseInfo"
                    });
                    store.commit('setBaseInfo', baseInfo);
                }
                // if (store.getters.dailogObj) {
                //     store.getters.dailogObj.close()
                // }
                //传输数据批量处理，提交数据类型如果为null，字段不传
                let dataObj = clone(data);
                deleteNull(dataObj)
                trimObj(dataObj)
                //基本上所有的提交都要加商家id,这里统一
                if (isSubmit == true) {
                    // store.state.baseInfo.institutionId
                    // dataObj["institutionId"] = "";
                }
                if (dataObj == undefined) {
                    dataObj = {};
                }
                axiosIns({
                    url: `${url}`,
                    config: config,
                    method: method,
                    data: dataObj,
                }).then((response) => {
                    if (method == 'post') {
                        if (response === undefined) {
                            return
                        }
                        if (response.status != 200) {
                            reject(response)
                        }
                        if (complete != undefined) {
                            complete(response.data)
                        }
                        if (response.data.status === "0") {
                            if (error != undefined) {
                                error(response.data);
                            } else {
                                if (openDailog) {
                                    setTimeout(() => {
                                        //通过让该组件获取焦点的方式，防止搜索下拉菜单组件重复报错
                                        document.querySelector("#activeFocus").focus()
                                        Vue.prototype.$alert(response.data.message, "提示")
                                    })
                                }
                            }
                        } else if (response.data.status === "1") {
                            if (success != undefined) {
                                success(response.data)
                            } else {
                                if (openDailog) {
                                    setTimeout(() => {
                                        Vue.prototype.$alert(response.data.message, "提示")
                                    })
                                }
                                resolve(response.data)
                            }
                        }
                    } else if (method == "get") {

                    }
                }).catch((response) => {
                    // Vue.prototype.$throw(response)
                    console.log(response)
                })
            }
            //如果接口名为add或者edit开头,自动开启防抖函数
            if(/\/(?=(edit|add|import))/.test(url)){
                isDebounce=true;
            }
            if (isDebounce == false) {
                REFRESHDATA()
            } else {
                debounce(REFRESHDATA, 500)
            }
        }));
    };
});
window.post=function(url,data={},reWriteUrl){
    return new Promise((resolve)=>{
        let preBaseUrl=baseURL;
        if(reWriteUrl){
            preBaseUrl=preBaseUrl.replace("manage",reWriteUrl);
        }
        api.post({
            url:preBaseUrl+url,
            data:data,
            success:(res)=>{
                resolve(res.data)
            }
        })
    })
}
export default api;