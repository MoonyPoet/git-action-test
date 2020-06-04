import { setLocal, deDuplication } from 'assets/js/reused';
import Vue from 'vue';
export const setPrompt = (state, v) => {
    state.isPrompt = v;
};
export const setOptions = (state, v) => {
    state.options = v;
};
export const setBaseInfo = (state, v) => {
    state.baseInfo = v;
};
export const setUserInfo = (state, v) => {
    state.userInfo = v;
};
export const setMerchantInfo = (state, v) => {
    state.merchantInfo = v;
};
export const setDailogShow = (state, v) => {
    state.dailogShow = v;
};
export const setRecordUserName = (state, v) => {
    state.recordUserName = v;
}
export const setDailogObj = (state, v) => {
    state.dailogObj = v;
}
export const addTabs = (state, data) => {
    let data1 = data;
    if (/\{/.test(data)) {
        data1 = JSON.parse(data)
    }
    let flagIndex = -1;
    if (state.options.length != 0) {
        state.options.map((item,index)=>{
            if(item.route===data1.route){
                flagIndex=index;
            }
        })
        if (flagIndex != -1) {
            state.options.splice(flagIndex, 1, data1);
        } else {
            state.options.push(data1);
            if(state.options.length>6){
                state.options.splice(1,1)
            }
        }
    } else {
        state.options.push(data1);
    }
    setLocal("options", state.options)
}
export const replaceTab = (state, data) => {
    state.options.map((item)=>{
        if(item.name===data.name){
            item.route=data.route;
        }
    })
    setLocal("options",state.options);
}

export const deleteTabs = (state, route) => {
        let a = "";
        state.options.forEach((element, index) => {
            if (element.route == route) {
                a = index;
            }
        });
        if (a != "") {
            state.options.splice(a, 1);
        } else {
            console.log("没有匹配到地址")
        }

    }
    /*
      router 删除地址
      url 跳转地址
      data 跳转url携带参数
    */
export const deleteTabAndGo = (state, {
    route,
    data,
    url
} = {}) => {
    let a = "";
    if (route == undefined) {
        // Vue.prototype.$routerTab.close()
        router.go(-1)
    }
    if (route == "/index") {
        console.error("首页不可删");
        return
    }

    state.options.forEach((element, index) => {
        if ((element.route == route) || (element.route === router.history.current.path)) {
            a = index;
        }
    });
    if (a != "") {
        state.options.splice(a, 1);
        // router.push({ path: url, query: data })
        // router.go(-1)
    } else {
        // console.error("没有匹配到地址")
    }
}
export const activeIndex = (state, index) => {
    state.activeIndex = index;
    setLocal("activeIndex", state.activeIndex)
}
export const addTabAndActive = (state, {
    url,
    data = {},
}) => {
    // status为1表示可以提交标签，0 can't
    if(state.options.some((element)=>{element.url===url})){
        return
    }
    state.activeIndex = url;
    console.log(1)
    clearToken(state);
    router.push({ path: url, query: data });
    //新增不需要缓存
    // state.exCache.push(url.match(/[^\/]\w*$/)[0])
    // state.isCache = false;
}
export const saveDetailInfo = (state, info) => {
    state.pageInfo = info;
}
export const clearOption = (state) => {
    state.options = [];
    setLocal("options", [])
}
export const setCache = (state, v) => {
    state.isCache = v == undefined ? true : v;
}
export const setAuthData = (state, v) => {
    state.authData = v;
}
export const setAuthArr = (state, v) => {
    state.authArr = v;
}
export const setImgOrVideo=(state,v)=>{
    state.imgOrVideo=v;
}
export const setAuthTabs=(state,v)=>{
    state.authTabs=v;
}
export const setParamConfig=(state,v)=>{
    state.paramConfig=v;
}
export const setMemberInfo=(state,v)=>{
    state.memberInfo=v;
}
export const setBaseRouter=(state,v)=>{
    state.baseRouter=v;
}
export const setCancelToken=(state,v)=>{
    state.cancelTokenArr.push(v.cancelToken);
}
export const clearToken=(state) => {
    state.cancelTokenArr.forEach(item => {
        item()
    })
    state.cancelTokenArr = [];
}