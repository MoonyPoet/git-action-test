import { watchObj, setCookie, getCookie } from "assets/js/reused";
window.debug = 3; //1为dev,2为production
let baseURL, commonURL,wechatURL;
if (process.env.NODE_ENV == 'development') {
    baseURL = 'http://192.168.0.104:8181/rest/manage/';
    commonURL = 'http://192.168.0.104:8181/dongbao-web/';
    wechatURL="http://192.168.0.104:8181/dongbao-ws/rest/wechat/";
} else if (process.env.NODE_ENV == 'debug') {
    baseURL = 'http://192.168.0.104:8181/rest/manage/';
    commonURL = 'http://192.168.0.104:8181/dongbao-web/';
    wechatURL="http://192.168.0.104:8181/dongbao-ws/rest/wechat/";
} else if (process.env.NODE_ENV == 'production') {
    if (location.origin.indexOf("op.dongbaoyun.com") > -1) {
        baseURL = "https://miniprogram.dongbaoyun.com/rest/manage/";
        commonURL = 'https://miniprogram.dongbaoyun.com/dongbao-web/';
        wechatURL="http://miniprogram.dongbaoyun.com/rest/wechat/";
    } else {
        baseURL = 'http://m2.dongbaoyun.com/rest/manage/';
        commonURL = 'http://m2.dongbaoyun.com/dongbao-web/';
        wechatURL="http://m2.dongbaoyun.com/rest/wechat/";
    }
}
watchObj({
    obj: window,
    prop: "debug",
    callback(v) {
        setCookie("debug", v)
        setCookie("baseInfo", "")
        setCookie("imgOrVideo", "")
        setCookie("insId", "")
        setCookie("merchantInfo", "")
        router.push("/login")
        if (v == 2) {
            baseURL = 'http://m2.dongbaoyun.com/rest/manage/';
            commonURL = 'http://m2.dongbaoyun.com/dongbao-web/rest/server/';
            wechatURL="http://m2.dongbaoyun.com/rest/wechat/";
        } else if (v == 1) {
            baseURL = 'http://192.168.0.104:8181/rest/manage/';
            commonURL = 'http://192.168.0.104:8181/dongbao-web/';
            wechatURL="http://192.168.0.104:8181/dongbao-ws/rest/wechat/";
        } else if (v == 3) {
            baseURL = 'http://192.168.0.104:8181/rest/manage/';
            commonURL = 'http://192.168.0.104:8181/dongbao-web/';
            wechatURL="http://192.168.0.104:8181/dongbao-ws/rest/wechat/";
        }else if(v==4){
            baseURL = "https://miniprogram.dongbaoyun.com/rest/server/";
            commonURL = 'https://miniprogram.dongbaoyun.com/dongbao-web/';
            wechatURL="https://miniprogram.dongbaoyun.com/rest/wechat/";
        }
        window.baseURL = baseURL;
        window.commonURL = commonURL;
    }
})
if (getCookie("debug") == 2) {
    baseURL = 'http://m2.dongbaoyun.com/rest/manage/';
    commonURL = 'http://m2.dongbaoyun.com/dongbao-web/rest/server/';
    wechatURL="http://m2.dongbaoyun.com/rest/wechat/";
} else if (getCookie("debug") == 1) {
    baseURL = 'http://192.168.0.104:8181/rest/manage/';
    commonURL = 'http://192.168.0.104:8181/dongbao-web/';
    wechatURL="http://192.168.0.104:8181/dongbao-ws/rest/wechat/";
} else if (getCookie("debug") == 3) {
    baseURL = 'http://192.168.0.104:8181/rest/manage/';
    commonURL = 'http://192.168.0.104:8181/dongbao-web/';
    wechatURL="http://192.168.0.104:8181/dongbao-ws/rest/wechat/";
}else if(getCookie("debug") == 4){
    baseURL = "https://miniprogram.dongbaoyun.com/rest/manage/";
    commonURL = 'https://miniprogram.dongbaoyun.com/dongbao-web/';
    wechatURL="https://miniprogram.dongbaoyun.com/rest/wechat/";
}

window.baseURL = baseURL;
window.commonURL = commonURL;
window.wechatURL=wechatURL;