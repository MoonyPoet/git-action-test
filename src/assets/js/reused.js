import axios from 'axios'
import api from '@/request';
import Vue from 'vue';
import { differenceInCalendarQuarters } from 'date-fns';
// function ajax({url=url,method='get',params={ajax:1},callback='undefined',obj='undefined'}={}){
//   axios({
//     url: url,
//     method:method,
//     params:params,
//     withCredentials: true
//   }).then(function (res) {
//     if(typeof callback==='function'){
//       callback(res.data,obj)
//     }else{
//       if(res.data.status<0){
//         obj.$router.push({ name: 'login'});
//       }else{
//         obj.$dialog.alert({mes: res.data.msg});
//       }
//     }
//   })
// }
let authArr = [];
/**
 * 
 * 
 * @param {any} [{
 *   url = url,
 *   method = 'post',
 *   params = {
 *     ajax: 1
 *   }
 * }={}] 
 * @returns 
 */
function ajax({
    url = url,
    method = 'post',
    params = {
        ajax: 1
    }
} = {}) {
    return new Promise(function (resolve) {
        axios({
            url: url,
            method: method,
            params: params,
            withCredentials: true
        }).then(function (res) {
            if (res.data.status < 0) {
                self.$router.push({
                    name: 'login'
                });
            } else if (res.data.status >= 0) {
                resolve(res.data)
            }
        })
    })
}
/**
 * 
 * 
 * @param {any} c_name 
 * @param {any} value 
 * @param {any} expiredays 
 */
function setCookie(c_name, value, expiredays) {
    let val = "";
    if (type(value) == "object") {
        val = JSON.stringify(value)
    } else {
        val = value;
    }
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    if ((c_name + "=" + escape(val) +
            ((expiredays == undefined) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/").length > 4096) {
        throw new Error("cookie存储超出范围")
    }
    document.cookie = c_name + "=" + escape(val) +
        ((expiredays == undefined) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
}
/**
 * 
 * 
 * @param {any} name 
 * @returns 
 */
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    var reg1 = /^\%7B.*\%7D$/;
    if (arr = document.cookie.match(reg)) {
        if (arr[2].search(reg1) > -1) {
            return unescape(arr[2]) == 'undefined' ? '' : JSON.parse(unescape(arr[2]));
        } else {
            return unescape(arr[2]) == 'undefined' ? '' : unescape(arr[2]);
        }
    } else {
        return '';
    }
}
/**
 * 
 * 
 * @param {any} name 
 * @param {any} value 
 */
function setSession(name, value) {
    sessionStorage.setItem(name, escape(JSON.stringify(value)))
}
/**
 * 
 * 
 * @param {any} name 
 * @returns 
 */
function getSession(name) {
    if (!!sessionStorage.getItem(name) && unescape(sessionStorage.getItem(name)) != 'undefined')
        return JSON.parse(unescape(sessionStorage.getItem(name)))
    else
        return '';
}
/**
 * 
 * 
 * @param {any} name 
 * @param {any} value 
 */
function setLocal(name, value) {
    if (type(value) == 'object') {
        localStorage.setItem(name, escape(JSON.stringify(value)));
    } else if ((type(value) == 'array')) {
        let arr = [];
        value.forEach((element) => {
            if (type(element) == "object") {
                arr.push(JSON.stringify(element))
            } else {
                arr.push(element)
            }
        })
        localStorage.setItem(name, escape(arr.toString()));
    } else {
        localStorage.setItem(name, escape(value));
    }

}
/**
 * 
 * 
 * @param {any} name 
 * @returns 
 */
function getLocal(name) {
    if (!!localStorage.getItem(name) && unescape(localStorage.getItem(name)) != 'undefined')
        if (type(unescape(localStorage.getItem(name))) == 'object') {
            return JSON.parse(unescape(localStorage.getItem(name)));
        } else if ((type(unescape(localStorage.getItem(name))) == 'string')) {
        //匹配{},{},{} 不匹配[{},{},{}]
        if (unescape(localStorage.getItem(name)).match(/,(?=\{|\[)/g)) {
            //区分auths和options
            if (unescape(localStorage.getItem(name)).match(/\[(?=\{)/)) {
                return JSON.parse(`[${unescape(localStorage.getItem(name))}]`)
            } else {
                return unescape(localStorage.getItem(name)).split(/,(?=\{|\[)/g).map((v) => JSON.parse(v));
            }
        } else {
            return unescape(localStorage.getItem(name));
        }

    } else
        return ""
}
/**
 * 
 * 
 * @param {any} name 
 */
function delSession(name) {
    localStorage.removeItem(name);
}
//是否没找到session,找到了返回false,没找到返回true
function isNoFindSession(name) {
    if (!!getSession(name))
        return false
    else
        return true
}
/**
 * 
 * 
 * @param {any} title 
 */
function setTitle(title) {
    document.title = title
    var mobile = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(mobile)) {
        var iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        // 替换成站标favicon路径或者任意存在的较小的图片即可
        //    iframe.setAttribute('src', '/favicon.ico')
        var iframeCallback = function () {
            setTimeout(function () {
                iframe.removeEventListener('load', iframeCallback)
                document.body.removeChild(iframe)
            }, 0)
        }
        iframe.addEventListener('load', iframeCallback)
        document.body.appendChild(iframe)
    }
}
//修改url的方法

// function changeUrlArg(url, arg, arg_val) {
//     var pattern = arg + '=([^&]*)';
//     var replaceText = arg + '=' + arg_val;
//     if (url.match(pattern)) {
//         var tmp = '/(' + arg + '=)([^&]*)/gi';
//         if (arg_val == '') {
//             url = url.replace(eval(tmp), "");
//         } else {
//             url = url.replace(eval(tmp), replaceText);
//         }
//     } else {
//         if (arg_val != '') {
//             if (url.match('[\?]')) {
//                 url = url + '&' + replaceText;
//             } else {
//                 url = url + '?' + replaceText;
//             }
//         }
//     }
//     url = url.replace(/(&+)/gi, "&");
//     url = url.replace(/[&|\?]$/gi, "");
//     return url;
// }


//检查是否登录
function checkLogin() {
    if (getSession("base_info")) {
        if (getSession("base_info").tel != '') {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}
/**
 * 
 * 
 * @param {any} fmt 
 * @param {any} date 
 * @returns 
 */
function dateFormat(fmt, date) { //author: meizz
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S+": date.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((("" + o[k]).length == 1) ? ("00" + o[k]).substr(("" + o[k]).length) : ("00" + o[k]).substr(2, RegExp.$1.length)));
        }
    }
    return fmt;
}
//没有回调的，以前写的，暂时保留

function share(title, content, imgUrl, obj) {
    //分享
    let self = obj;
    let url = location.href;
    url = changeUrlArg(url, "share", "");
    //url=changeUrlArg(url,"from_uid",JSON.parse(getSession('base_info')).uid);

    //加参数到path后面
    let url_path = url.split('#')[0];
    let url_hash = url.split('#').length > 1 ? url.split('#')[1] : '';
    // url = url.replace('&', '%26');
    if (!isNoFindSession('base_info')) {
        if (getSession('base_info').uid != undefined) {
            url_path = changeUrlArg(url_path, "from_uid", getSession('base_info').uid);
        }
    }
    url_path = changeUrlArg(url_path, "page_hash", encodeURIComponent(url_hash));
    url = url_path + "#" + url_hash;

    service.share({
        title: title, //标题
        content: content, //描述，除朋友圈外分享都有此项
        link: url, //链接，为空时用当前url
        imgUrl: imgUrl, //图标
    }, function (res) {
        //回调，返回分享状态和类型
        if (res.shareStatus == "success") {
            //self.$dialog.alert({mes:'分享成功'})
        } else {
            //self.$dialog.alert({mes:'您已取消分享'})
        }
    })
}
//分享有回调
function shareCall({
    title,
    content,
    imgUrl,
    url = location.href,
    error = undefined,
    success = undefined,
    complete = undefined,
    obj,
    showDailog = false
} = {}) {
    //分享
    url = changeUrlArg(url, "share", "");
    //url=changeUrlArg(url,"from_uid",JSON.parse(getSession('base_info')).uid);
    //加参数到path后面
    let url_path = url.split('#')[0];
    let url_hash = url.split('#').length > 1 ? url.split('#')[1] : '';
    // url = url.replace('&', '%26');
    if (!isNoFindSession('base_info')) {
        if (getSession('base_info').uid != undefined) {
            url_path = changeUrlArg(url_path, "from_uid", getSession('base_info').uid);
        }
    }
    url_path = changeUrlArg(url_path, "page_hash", encodeURIComponent(url_hash));
    url = url_path + "#" + url_hash;

    service.share({
        title: title, //标题
        content: content, //描述，除朋友圈外分享都有此项
        link: url, //链接，为空时用当前url
        imgUrl: imgUrl, //图标
    }, (res) => {
        //回调，返回分享状态和类型
        if (complete != undefined) {
            complete()
        }
        if (res.shareStatus == "success") {
            if (success != undefined) {
                success()
            } else {
                if (showDailog)
                    obj.$dialog.alert({
                        mes: '分享成功'
                    })
            }

        } else {
            if (error != undefined) {
                error()
            } else {
                if (showDailog)
                    obj.$dialog.alert({
                        mes: '您已取消分享'
                    })
            }
        }
    })
}
//初始化数据字典
/**
 * 
 * 
 * @param {any} {
 *   codeName,
 * } 
 * @returns 
 */
function getCodeData(codeName) {
    let codeData = new Object();
    if (codeData.length == 0) {
        codeData = new Object();
    }
    var codeNameAry = codeName.split(",");
    for (var i = 0; i < codeNameAry.length; i++) {
        codeData[codeNameAry[i]] = [];
    }
    return new Promise(function (resolve) {
        api.post({
            url: baseURL + "system/codelist",
            data: {
                codeCategory: codeName
            },
            success: (res) => {
                let data = res.data;
                for (let i = 0; i < data.length; i++) {
                    codeData[data[i].codeCategory].push(data[i]);
                }
                resolve(codeData)
            }
        })
    })
}
/**
 *
 *getCode("_train_type").then(({trainType})=>{
        console.log(trainType)
    })
 * @param {string} [str=""] 传入字符串即可
 * @returns
 */
function getCode(str=""){
    if(str===''){
        return
    }
    return new Promise(async (resolve,reject)=>{
        let obj={};
        let param={
            optionCategory:str
        };
        let res=await post("system/optionlist",param,"common");
        res.map((item)=>{
            obj[item.key]=item.data;
        })
        resolve(obj);
    })
  
}
async function getAsso(param={}){
   return await post("system/associative",param,"common");
}

/**
 * 
 * 
 */
function delAllCookie() {
    var myDate = new Date();
    myDate.setTime(-1000); //设置时间
    var data = document.cookie;
    var dataArray = data.split("; ");
    for (var i = 0; i < dataArray.length; i++) {
        var varName = dataArray[i].split("=");
        if ((varName[0] != 'PHPSESSID') && (varName[0] != "from_uid") && (varName[0] != "user_info")) {
            document.cookie = varName[0] + "=''; expires=" + myDate.toGMTString();
        }
    }

}
/**
 * 
 * 
 * @param {any} [{
 *   obj = obj,
 *   year = year,
 *   month = month,
 *   day = day
 * }={}] 
 * @returns 
 */
function dayDateOfMonth({
    obj = obj,
    year = year,
    month = month,
    day = day
} = {}) {
    let arr = "";
    if (obj != '') {
        console.log(obj)
        arr = (obj + ' ' + '00:00:00').split(/[- : \/]/);
    } else {
        arr = (year + '-' + month + '-' + day + ' ' + '00:00:00').split(/[- : \/]/);
    }
    let d = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
    return Date.parse(d) / 1000
}
/**
 * 
 * 
 * @param {any} [{
 *   obj = obj,
 *   year = year,
 *   month = month,
 *   day = day
 * }={}] 
 * @returns 
 */
function dayDateOfMonthEnd({
    obj = obj,
    year = year,
    month = month,
    day = day
} = {}) {
    let arr = "";
    if (obj != '') {
        arr = (obj + ' ' + '23:59:59').split(/[- : \/]/);
    } else {
        arr = (year + '-' + month + '-' + day + ' ' + '23:59:59').split(/[- : \/]/);
    }
    let d = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
    return Date.parse(d) / 1000
}
/**
 * 
 * 
 * @param {any} [{
 *   obj = this,
 *   disabled = true,
 * }={}] 
 */
function wxTanchu({
    obj = this,
    disabled = true,
} = {}) {
    disabled = true;
    let self = obj;

    function is_weixin() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }
    var isWeixin = is_weixin();
    var winHeight = typeof window.innerHeight != 'undefined' ? window.innerHeight : document.documentElement.clientHeight;

    function loadHtml() {
        var div = document.createElement('div');
        div.id = 'weixin-tip';
        div.innerHTML = `<p><img style="max-width: 100%" src="/Public/assets/weixin/taekwondo/static/img/weixin_share.png" alt="微信打开"/></p>`;
        document.body.appendChild(div);
        document.getElementById("weixin-tip").onclick = function () {
            removeEle(document.getElementById("weixin-tip"))
            disabled = false;
        }
    }
    /**
     * 
     * 
     * @param {any} removeObj 
     */
    function removeEle(removeObj) {
        if (removeObj) {
            removeObj.parentNode.removeChild(removeObj);
        }
    }
    /**
     * 
     * 
     * @param {any} cssText 
     */
    function loadStyleText(cssText) {
        var style = document.createElement('style');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        try {
            style.appendChild(document.createTextNode(cssText));
        } catch (e) {
            style.styleSheet.cssText = cssText; //ie9以下
        }
        var head = document.getElementsByTagName("head")[0]; //head标签之间加上style样式
        head.appendChild(style);
    }
    var cssText = "#weixin-tip{position: fixed; left:0; top:0; background: rgba(0,0,0,0.8); filter:alpha(opacity=80); width: 100%; height:100%; z-index: 100;} #weixin-tip p{text-align: center; margin-top: 10%; padding:0 5%;}";
    if (isWeixin) {
        loadHtml();
        loadStyleText(cssText);
    }
}
/**
 * 
 * 
 * @param {any} [{
 *   obj = this,
 *   title = "",
 *   content = "",
 *   url_hash = "/introduce",
 *   url = location.href,
 *   imgUrl = "",
 *   callback = undefined
 * }={}] 
 */
function shareDetail({
    obj = this,
    title = "",
    content = "",
    url_hash = "/introduce",
    url = location.href,
    imgUrl = "",
    callback = undefined
} = {}) {
    //分享
    // let url=location.href;
    let url_path = url.split('#')[0];
    url_hash = changeUrlArg(url_hash, "share", "");
    url_hash = changeUrlArg(url_hash, "activityId", obj.$route.query.activityId);
    // url = url.replace('&', '%26');
    if (!isNoFindSession('base_info')) {
        url_path = changeUrlArg(url_path, "from_uid", getSession('base_info').userId);
    }
    url_path = changeUrlArg(url_path, "page_hash", encodeURIComponent(url_hash));
    url = url_path + "#" + url_hash;
    service.share({
        title: title, //标题
        content: content, //描述，除朋友圈外分享都有此项
        link: url, //链接，为空时用当前url
        imgUrl: imgUrl, //图标
    }, (res) => {
        //回调，返回分享状态和类型
        obj.isdisabled = false;
        removeEle(document.getElementById("weixin-tip"));
        if (res.shareStatus == "success") {
            callback()
        }
    })
}
/**
 * 
 * 
 * @param {any} url 
 * @param {any} arg 
 * @param {any} arg_val 
 * @returns 
 */
function changeUrlArg(url, arg, arg_val) {
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + arg_val;
    if (url.match(pattern)) {
        var tmp = '/(' + arg + '=)([^&]*)/gi';
        if (arg_val == '') {
            url = url.replace(eval(tmp), "");
        } else {
            url = url.replace(eval(tmp), replaceText);
        }
    } else {
        if (arg_val != '') {
            if (url.match('[\?]')) {
                url = url + '&' + replaceText;
            } else {
                url = url + '?' + replaceText;
            }
        }
    }
    url = url.replace(/(&+)/gi, "&");
    url = url.replace(/[&|\?]$/gi, "");
    return url;
}
/**
 * 
 * 
 * @param {any} item 
 * @returns 
 */
function clone(item) {
    if (!item) {
        return item;
    } // null, undefined values check

    var types = [Number, String, Boolean],
        result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    //一些通过new方式建立的东东可能会类型发生变化，我们在这里要做一下正常化处理
    //比如new String('aaa'), or new Number('444')
    types.forEach(function (type) {
        if (item instanceof type) {
            result = type(item);
        }
    });

    if (typeof result == "undefined") {
        if (Object.prototype.toString.call(item) === "[object Array]") {
            result = [];
            item.forEach(function (child, index, array) {
                result[index] = clone(child);
            });
        } else if (typeof item == "object") {
            // testign that this is DOM
            //如果是dom对象，那么用自带的cloneNode处理
            if (item.nodeType && typeof item.cloneNode == "function") {
                var result = item.cloneNode(true);
            } else if (!item.prototype) { // check that this is a literal
                // it is an object literal
                //如果是个对象迭代的话，我们可以用for in 迭代来赋值
                result = {};
                for (var i in item) {
                    result[i] = clone(item[i]);
                }
            } else {
                // depending what you would like here,
                // just keep the reference, or create new object
                //这里解决的是带构造函数的情况，这里要看你想怎么复制了，深得话，去掉那个false && ，浅的话，维持原有的引用，
                //但是我不建议你去new一个构造函数来进行深复制，具体原因下面会解释
                if (false && item.constructor) {
                    // would not advice to do that, reason? Read below
                    //朕不建议你去new它的构造函数
                    result = new item.constructor();
                } else {
                    result = item;
                }
            }
        } else {
            result = item;
        }
    }

    return result;
}
//数据结构优化
//[{a:1,b:32},{a:3,b:33}]=>
//[{a:1},{a:3}]
//obj={a}
function arrToArr(tableData, { ...obj
}) {
    return tableData.map(({ ...obj
    }) => ({ ...obj
    }));
}

//防抖函数简易版
var debounce = (() => {
    var clearId;
    return ((callback, delay) => {
        var args = arguments;
        if (clearId) {
            clearTimeout(clearId)
        }
        clearId = setTimeout(function () {
            callback.apply(this, args)
        }, delay)
    })

})()

/**
 *
 *刷新数据，如果时间小于500毫秒，有值的情况返回值，超过500毫秒，返回空,清空定时器,节约资源
 * @param {*} [{
 *   action="local", session ,you should choose one
 *   keyword="", keyword 为存储名
 *   minTimeStamp=300 最小刷新时间，返回时间
 * }={}]
 * @returns
 */
function getCleanCacheData({
    action = "session",
    keyword = "",
    minTimeStamp = 300
} = {}) {
    return new Promise((resolve, reject) => {
        if (keyword == "") {
            console.error("请传入keyword")
            return
        }
        let Fn = "";
        if (action === "local") {
            Fn = getLocal;
        } else if (action === "session") {
            Fn = getSession;
        } else if (action === "cookie") {
            Fn = getCookie;
        }
        let timeStamp = new Date().getTime();
        let clearId = setInterval(() => {
            let value = Fn(keyword);
            let timeStamp1 = new Date().getTime();
            // console.log("!======!")
            // console.log(value)
            // console.log(keyword)
            // console.log("!======!")
            if (!isEmpty(value)) {
                clearInterval(clearId)
                resolve(value)
            }
            // console.log("======")
            // console.log(timeStamp1)
            // console.log(timeStamp)
            // console.log("======")
            if ((timeStamp1 - timeStamp) >= minTimeStamp) {
                clearInterval(clearId)
                resolve("")
            }
        })
    })
}

/**
 *
 *类型判断
 * @param {*} o 传入参数
 * @returns
 */
function type(o) {
    var s = Object.prototype.toString.call(o);
    return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

['Null',
    'Undefined',
    'Object',
    'Array',
    'String',
    'Number',
    'Boolean',
    'Function',
    'RegExp'
].forEach(function (t) {
    type['is' + t] = function (o) {
        return type(o) === t.toLowerCase();
    };
});

//判断字符串，数组，对象是否为空，或者对象某一个可以对应的值是否为空,undefined,null默认为空
function isEmpty(value, keyword = "") {
    if (type(value) === "null" || type(value) === 'undefined') {
        return true
    }
    if (type(value) === 'array' || type(value) === "string") {
        if (value.length == 0) {
            return true
        } else {
            return false
        }
    }
    let val = JSON.stringify(value);
    if (val.match(/^\{[\s\S]*\}$/)) {
        let obj = JSON.parse(val); //执行这个如果为字符串或数组，对象判断空
        //判断关键字不正确的情况
        if (keyword) {
            if (Object.keys) {
                if (Object.keys(obj).indexOf(keyword) === -1) {
                    console.error("请输入正确的关键字")
                    return
                }
            } else {
                let keyArr = [];
                for (let i in obj) {
                    keyArr.push(i)
                }
                if (keyArr.indexOf(keyword) === -1) {
                    console.error("请输入正确的关键字")
                    return
                }
            }
        }
        //如果keword 为空，只需要判断对象是否为空
        if (!keyword) {
            for (let i in obj) {
                return false
            }
            return true
        } else {
            for (let i in obj) {
                if (i === keyword) {
                    return isEmpty(obj[i]);
                }
            }
        }
    } else {
        //判断字符串或者数组为空,因为被JSON.stringify处理了一次,所以用eval
        return eval(val).length === 0 ? true : false;
    }
}
// eventUtil.addHandler(window, "online", function() {
//   console("Online---正常工作");
// });
// eventUtil.addHandler(window, "offline", function() {
//   alert("Offline ---离线工作");
// });
//判断网络是否在线
var eventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
};
//函数节流
var throttle = function (func, wait, options) {
    var context, args, result;
    var timeout = null;
    // 之前的时间戳
    var previous = 0;
    // 如果 options 没传则设为空对象
    if (!options) options = {};
    // 定时器回调函数
    var later = function () {
        // 如果设置了 leading，就将 previous 设为 0
        // 用于下面函数的第一个 if 判断
        previous = options.leading === false ? 0 : _.now();
        // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function () {
        // 获得当前时间戳
        var now = _.now();
        // 首次进入前者肯定为 true
        // 如果需要第一次不执行函数
        // 就将上次时间戳设为当前的
        // 这样在接下来计算 remaining 的值时会大于0
        if (!previous && options.leading === false) previous = now;
        // 计算剩余时间
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        // 如果当前调用已经大于上次调用时间 + wait
        // 或者用户手动调了时间
        // 如果设置了 trailing，只会进入这个条件
        // 如果没有设置 leading，那么第一次会进入这个条件
        // 还有一点，你可能会觉得开启了定时器那么应该不会进入这个 if 条件了
        // 其实还是会进入的，因为定时器的延时
        // 并不是准确的时间，很可能你设置了2秒
        // 但是他需要2.2秒才触发，这时候就会进入这个条件
        if (remaining <= 0 || remaining > wait) {
            // 如果存在定时器就清理掉否则会调用二次回调
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            // 判断是否设置了定时器和 trailing
            // 没有的话就开启一个定时器
            // 并且不能不能同时设置 leading 和 trailing
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};
//快速转数据格式
/*
  [
    {
      key:key,
      id:id
  },
   {
      key:key,
      id:id
  },
]
  =>
  {
    key:[id]
  }
*/
function dataProcess(data, key = 'key', value = "id") {
    let keyArr = [],
        obj = {};
    data.forEach((element) => {
        keyArr.push(element[key])
    })
    for (let i = 0; i < keyArr.length; i++) {
        obj[keyArr[i]] = [];
    }
    data.forEach((element) => {
        obj[element.key].push(element[value])
    })
    for (let key in obj) {
        obj[key] = [...new Set(obj[key])];
    }
    return obj;
}
/*
  "[{"route":"1"},{"route":"1"}]"
  =>
  "[{"route":"1"}]" 对象去重
*/
function deDuplication(arr) {
    if (arr != undefined) {
        if (arr.length > 6) {
            arr.splice(1, 1)
        }
        return [...new Set(arr.map(v => JSON.stringify(v)))].map(v => JSON.parse(v))
    }

}
//时间 hh:mm 转时间戳dateTime格式"19:34"
function timeStamp(type = 1, dateTime) {
    if (type == 1) {
        return Date.parse((new Date()).toString().replace(/(\d{2})\:(\d{2}\:\d{2})/, function ($1, $2, $3) {
            return $2 + ":" + dateTime;
        })) / 1000
    } else {
        return (new Date()).toString().match(/\d{2}\:(\d{2}\:\d{2})/)[1]
    }
}
//绑定默认值
function bindData({
    res: res,
    formData: formData
}) {
    if (type(res) == "object") {
        for (let key in formData) {
            if (type(res[key])!=='undefined' && type(formData[key]) !=='undefined') {
                if (type(res[key]) != "object" && type(res[key]) != "array") {
                    formData[key] = res[key];
                } else if (type(res[key]) == "array" && formData[key].length == 0) {
                    formData[key] = res[key];
                } else {
                    bindData({
                        res: res[key],
                        formData: formData[key] == null ? "" : formData[key]
                    })
                }
            }
        }
    } else if (type(res) == "array") {
        if (formData.length > 0) {
            for (let i = 0; i < formData.length; i++) {
                if (formData[i]) {
                    bindData({
                        res: res[i],
                        formData: formData[i] == null ? "" : formData[i]
                    })
                }
            }
        }
    } else {
        formData = res;
    }
}
//删除字段,会删除元数据的
function deleteField({
    arrField = [],
    formData = {}
}) {
    let arr = arrField;
    if (arr.length > 0) {
        for (let a = 0; a < arr.length; a++) {
            if (type(formData) == "object") {
                for (let key in formData) {
                    if (arr[a] == key) {
                        delete formData[key];
                        //只有没有匹配到对应的formData才删除字段
                        let reg = "/" + key + "/g";
                        if (JSON.stringify(formData).match(reg) && JSON.stringify(formData).match(reg).length == 1) {
                            arr.splice(a, 1);
                        }
                    } else {
                        deleteField({
                            arrField: [arr[a]],
                            formData: formData[key]
                        })
                    }
                }
            } else if (type(formData) == "array") {
                for (let i = 0; i < formData.length; i++) {
                    deleteField({
                        arrField: arr,
                        formData: formData[i]
                    })
                }
            } else {
                return
            }
        }

    }
}
//设置一天的开始或结束
//date为new Date()对象,1为开始,2为结束
function setDayTime(date, status = 1) {
    if (status == 1) {
        return date.setHours(0, 0, 0, 0)
    } else {
        return date.setHours(23, 59, 59, 0)
    }
};
//绑定下拉框默认值
function selectDefaultData(arr, prop) {
    if (arr.length > 0) {
        return arr[0][prop]
    } else {
        return ""
    }
}
//绑定多个下拉框默认值
function selectAllDefaultData([...obj]) {
    for (let key in obj) {
        selectDefaultData(key, obj[key])
    }
}
//获取tabelData 部分数据，如果只是id 就toString处理,否则数组对象 处理,
/**
 *
 *
 * @param {*} {
 *     tableData = [],
 *     itemName = [], item的节点名
 *     isString = true,itemName只有id时默认转成字符串
 *     getArr = true 当itemName只有一个并且为true,返回数组,类似于[{a:1},{a:2}]=>[1,2],
 *     filter 用法类似于map
 *     objectReplaceKey 数组批量替换对象里面的key值
 * }
 * @returns
 */
function getTableSectionData({
    tableData = [],
    itemName = [],
    isString = true,
    getArr = false,
    filter = undefined,
    replaceKeyObj = {}
} = {}) {
    let arr = [];
    if (itemName.length == 0 && type(itemName) == "array") {
        console.warn("itemName必填并且为数组")
        return
    }
    if (tableData.length > 0) {
        tableData.map((element) => {
            let obj = {};
            for (let key in element) {
                if (itemName.indexOf(key) > -1) {
                    obj[key] = element[key];
                }
            }
            arr.push(obj)
        })
        if (Object.keys(replaceKeyObj).length !== 0) {
            arr = arrRenameKeys(arr, replaceKeyObj)
        }
        if (filter) {
            return arr.map(filter)
        }
        if (itemName.length === 1 && getArr) {
            let arr1 = []
            arr.map((item) => {
                arr1.push(item[Object.keys(item)[0]])
            })
            return arr1
        }
        if (itemName.length == 1 && JSON.stringify(itemName).match(/id/i)) {
            //针对id转字符串处理
            if(isString){
                return arr.map((item) => item[itemName[0]]).toString()
            }else{
                return arr.map((item) => item[itemName[0]])
            }
        } else {
            return arr;
        }
    } else {
        return [];
        console.warn("tableData为空数组")
    }
}
//删除数组中部分数据,该方法会修改原数组

/**
 *
 *
 * @param {*} { arr = [], val = "" }
 *  arr 原数组 val为具体某个值
 */
function deleteForArr({
    arr = [],
    val = ""
}) {
    if (arr.length > 0) {
        if (arr.indexOf(val) > -1) {
            arr.splice(arr.indexOf(val), 1)
        }
    } else {
        console.warn("arr为空数组")
    }
}
//注意isDefault默认值为true的时候只有一个默认值
function watchObj({
    obj,
    prop,
    isDefault = false,
    callback
} = {}) {
    if (prop in obj) {
        var old = obj[prop];
        if (isDefault) {
            callback(old);
        }
        Object.defineProperty(obj, prop, {
            enumerable: true,
            configurable: true,
            set: function (val) {
                var o = old;
                old = val;
                callback(val, o, obj);
            },
            get: function () {
                return old;
            }
        });
    } else {
        throw new Error("no such property: " + prop);
    }
}
//重置初始数据
function resetObj(data = {}) {
    for (let key in data) {
        if (type(data[key]) == "string") {
            data[key] = "";
        } else if (type(data[key]) == "array") {
            data[key] = [];
        } else if (type(data[key]) == "object") {
            if (Object.keys(data[key]).length == 0) {
                data[key] = {}
            } else {
                resetObj(data[key])
            }
        } else if (type(data[key]) == "null") {
            data[key] = null
        } else if (type(data[key]) == "number") {
            data[key] = 0;
        }
    }
}

//弹窗信息提示 form 为dom对象,由于obj的原型链于原方法的this一致，统一写成form
/**
 * @param  {} form
 * @param  {} promptArr=[]
 * promptArr数据应为 [{
 *  label:"",
 *  message:"",
 * }]
 */
function promptMsg(form, promptArr = []) {
    let propsArr = Object.keys(form.rules);
    let errorData = [];
    console.log(propsArr)
    form.fields.map((fieldItem, index) => {
        if (propsArr.includes(fieldItem.prop)) {
            if (fieldItem.validateState == "error" && fieldItem.showMessage == true) {
                errorData.push({
                    label: fieldItem.label,
                    message: fieldItem.validateMessage,
                    showMessage: fieldItem.showMessage,
                    validateDisabled: fieldItem.validateDisabled,
                    sort: index + 1
                })
            }
        }
    })
    if (promptArr.length > 0) {
        let len = errorData.length;
        promptArr = promptArr.map((item, index) => {
            if (typeof item.sort == "undefined") {
                item.sort = index + len + 1
            } else {
                return item;
            }
        })
        errorData.push(...promptArr);
        errorData.sort(compare("sort"))
    }

    if (errorData.length > 0) {
        console.log(errorData)
        form.$alert(errorData[0].label + errorData[0].message, "错误提示", {
            confirmButtonText: "确定",
            callback: action => {}
        });
        return false
    }
}
//数组对象跟据prop排序
function compare(prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
}
/**
 *
 *
 * @param {*} {
 *     form = {},//提交的dom
 *     formData = {},提交数据
 *     isShowMes = true,//是否提示
 *     isBack = true,//是否返回上一页
 *     validCallback = undefined,//正常校验回调
 *     validScsCallback = undefined,//成功校验回调
 *     error: undefined,//请求失败回调
 *     success = undefined,//请求成功回调
 *     complete = undefined,//请求完成回调
 *     openDailog = true,//是否弹窗提醒
 *     isDebounce = true,//是否防抖
 *     url = ""//请求链接后缀
 *     promptArr = []//自定义消息提示
 * }
 * @returns
 */
function validateForm({
    form = {},
    formData = {},
    isShowMes = true,
    isBack = true,
    validCallback = undefined,
    validScsCallback = undefined,
    validEorCallback = undefined,
    error = undefined,
    success = undefined,
    complete = undefined,
    openDailog = true,
    isDebounce = true,
    promptArr = [],
    prefix=baseURL,
    url = ""
}) {
    form.validate((valid) => {
        if (!validCallback) {
            //如果valid为false或者promptArr不为空数组弹出提示信息
            if (valid && promptArr.length == 0) {
                if (!validScsCallback) {
                    let submitData = {
                        url: prefix + url,
                        openDailog: openDailog,
                        isDebounce: isDebounce,
                        data:formData,
                        success: (res) => {
                            if (!success) {
                                if (isShowMes) {
                                    form.$message({
                                        message: res.message || "修改成功",
                                        type: 'success'
                                    })
                                }
                                if (isBack) {
                                    form.$store.commit("deleteTabAndGo")
                                }
                            } else {
                                success(res)
                            }
                        }
                    }
                    if (complete) {
                        submitData.complete = (res) => {
                            complete(res)
                        }
                    }
                    if (error) {
                        submitData.error = (res) => {
                            error(res)
                        }
                    }
                    form.$axios.post(submitData)
                } else {
                    validScsCallback()
                }
            } else {
                if (!validEorCallback) {
                    promptMsg(form, promptArr)
                    return false;
                } else {
                    validEorCallback()
                }
            }
        } else {
            validCallback()
        }
    });
}
/**
 *  查询模块中按钮级权限
 */
function getRoleArr(roterStr) {
    let roleArr = getLocal("authArr") || [];
    return roleArr.includes(roterStr)
}

/**
 * 获取所有按钮级权限 存储
 */
function getFourRoleArr(path) {
    let auth = [];
    let roleArr = getLocal("auths");
    roleArr.map((element)=>{
        if(element.childrenModules&&element.childrenModules.length>0){
            element.childrenModules.map((item)=>{
                if(item.optList&&item.optList.length>0){
                    item.optList.map((note)=>{
                        auth.push(note.path)
                    })
                }
            })
        }
    })
    if(auth.includes(path)){
        return true;
    }else{
        return false;
    }
}
//获取 一级 /二级路由存储
function getRouterArr() {
    let roterArr = []
    let roleArr = getLocal("auths");
    for (let i = 0; i < roleArr.length; i++) { //循环第一级 教务中心，销售中心
        if (roleArr[i].path != "") {//判断是否有路由
            roterArr.push(roleArr[i].path)
        }
        if (roleArr[i].childrenModules.length > 0) {
            for (let k = 0; k < roleArr[i].childrenModules.length; k++) {//循环第二级  学员管理/常规班管理
                if (roleArr[i].childrenModules[k].path != "") {
                    roterArr.push(roleArr[i].childrenModules[k].path)
                }
                if (roleArr[i].childrenModules[k].childrenModules.length > 0) {
                    for (let l = 0; l < roleArr[i].childrenModules[k].childrenModules.length; l++) {//循环第三级 学员列表/日常客户
                        if (roleArr[i].childrenModules[k].childrenModules[l].path != "") {
                            roterArr.push(roleArr[i].childrenModules[k].childrenModules[l].path)
                        }
                    }
                }
            }
        }
    }


    return roterArr;
}


function getParentRole(pId, childId) {
    let roleArr = getLocal("auths");
    for (let i = 0; i < roleArr.length; i++) {
        if (roleArr[i].id == pId) {
            for (let k = 0; k < roleArr[i].childrenModules.length; k++) {
                if (roleArr[i].childrenModules[k].id == childId) {
                    return roleArr[i].childrenModules[k];
                }
            }
        }
    }
}

//对象键名替换 renameKeys({a:2},{a:"d"})=> {d: 2}
function objRenameKeys(obj, replaceKeyObj) {
    if (!(type(obj) === "object")) {
        console.error(`obj必须是object数据类型`);
        return
    }
    if (!((type(replaceKeyObj) === "object") || (type(replaceKeyObj) === "string"))) {
        console.error("replaceKeyObj必须是object或string数据类型")
        return
    }
    let mapped = Object.keys(obj).map(key => {
        let newKey = replaceKeyObj[key];
        return {
            [newKey]: obj[key]
        };
    });
    return Object.assign({}, ...mapped);
}
//数组对象键名批量替换
function arrRenameKeys(tableData, replaceKeyObj) {
    if (type(tableData) !== "array") {
        console.error("tableData必须是arr数据类型");
        return
    }
    if (!((type(replaceKeyObj) === "object") || (type(replaceKeyObj) === "string"))) {
        console.error("replaceKeyObj必须是object或string数据类型");
        return
    }
    return tableData.map((element) => objRenameKeys(element, replaceKeyObj))
}
function requestFn({
    url=baseURL,
    suffix="",
    data={},
    isJson=true
}={}){
    return new Promise((resolve)=>{
        Vue.prototype.$axios.post({
            url: url + suffix,
            data: {
            ...data
            },
            success: res => {
                if(isJson){
                    resolve(res.data[0])
                }else{
                    resolve(res.data);
                }
                
            }
        });
    })
}
//递归删除所有为null的字段
function deleteNull(obj){
    if(typeof(obj)==="object"){
        for (let key in obj) {
            if (type(obj[key]) === "null") {
                delete obj[key]
            }else if(type(obj[key])==="object"){
                deleteNull(obj[key])
            }else if(type(obj[key])==="array"){
                obj[key].map((item)=>{
                    deleteNull(item)
                })
            }
        }
    }else if(typeof(obj)==="array"){
        obj.map((item)=>deleteNull(item))
    }
}

//主要针对编辑时如果有旧值清空的清空
function selectEditDefaultData(selectData,key,newV){
    let result=null;
    for(let item of selectData){
        if(item[key]===newV){
            result=newV;
            break;
        }
    }
    return result;
}

/**
 *
 * 补集
 * @param {*} [{
 *     orgArr=[], 原数组 例:[1,2,3]
 *     newArr=[], 新数组 例:[2,3]
 *     callback=undefined,回调函数会传入element,item 例:element.id===item.id
 * }={}]
 */
function complementSet({
    orgArr=[],
    newArr=[],
    callback=undefined
}={}){
    return orgArr.filter((element)=>newArr.some((item)=>callback(element,item)));
}

function iEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6; //IE版本<=7
        }
    } else if (isEdge) {
        return 'edge'; //edge
    } else if (isIE11) {
        return 11; //IE11  
    } else {
        return -1; //不是ie浏览器
    }
}
/**
 *
 *
 * @param {*} data 传入字典
 * @returns
 */
// function getCodeDataAsync(data) {
//     return new Promise((resolve, reject) => {
//         getCodeData(data).then((res) => {
//             resolve(res)
//         })
//     })
// }
// class a {}
// this.items = rsp.data.map(t => Object.assign(new a, t))
//
function trimObj(obj){
    if(type(obj)==="object"){
        for(let key in obj){
            if(type(obj[key])==="string"){
                obj[key]=obj[key].trim()
            }else if(type(obj[key])==="array"){
                obj[key].map((item)=>{
                    trimObj(item)
                })
            }else if(typeof(obj[key])==="object"){
                trimObj(obj[key])
            }else{
                continue;
            }
        }
    }else if(type(obj)==="string"){
        obj.trim()
    }
}
function loadIframeAsync(url){
    return new Promise((resolve,reject)=>{
        var body = document.getElementsByTagName('body')[0];
        var iframe = document.createElement("iframe"); 
        iframe.style.display="none";
        iframe.src = url; 
        body.appendChild(iframe);
        if (!/*@cc_on!@*/0) { //if not IE 
        iframe.onload = function(){ 
            resolve("")
        }; 
        } else { 
                iframe.onreadystatechange = function(){ 
                if (iframe.readyState == "complete"){ 
                    resolve("")
                } 
            }; 
        } 
    })
}
function baseFn({path="",data={}}={}){
	this.$axios.post({
		url: baseURL + path,
		data:data,
		success: res => {
			this.$message({
				message: res.message||"操作成功",
				type: 'success'
			});
			this.getTableData()
		}
	});
}
// 对象转数组
function transArr(obj,key,value){
    let arr=[];
    for(let k in obj){
        arr.push({[key]:k,[value]:obj[k]})
    }
    return arr;
}
//数组对象排重
function reEmphasis(arr,key,value){
    let obj={};
    arr.map((element)=>{
        obj[element[key]]=element[value];
    })
    let newArr=transArr(obj,key,value)
    return newArr;
}
//数组
// 例如传入多个校区id ,就会得到多个校区id的name拼接成的字符串
function getCodeDisplay(arr,ids=[],key="value",value="display"){
  let diplayArr=[];
  let nIds=[];
  if(type(ids)==="array"){
    nIds=ids;
    if(type(arr[0][key])!==type(ids[0])){
        console.warn(`ids和${value}数据类型不一致`)
    }
  }else if(type(ids)==="string"||type(ids)==="number"){
    nIds=[ids];
    if(type(arr[0][key])!==type(ids)){
        console.warn(`ids和${value}数据类型不一致`)
    }
  }else{
      console.warn("请填入正确的ids")
  }
  if(nIds.length>=1){
    arr.map((item)=>{
        if(nIds.some((id)=>id===item[key])){
            diplayArr.push(item[value])
        }
    })
  }
  return diplayArr.toString()
}

// getTableItem
// 通过filter筛选出对象
//[{a:1,b:4},{a:2,b:2}]=> getSelectDataItem([{a:1,b:4},{a:2,b:2}],"a",2)=>{a:2,b:2}
//
function getTableItem(data,itemName="",value){
    if(isEmpty(data)){
        console.warn(`data为空数组`);
        return;
    }
    if(isEmpty(itemName)){
        console.warn("itemName为空串")
        return;
    }
    if(isEmpty(value)){
        console.warn("value必填")
        return;
    }
    if(type(data[0][itemName])!==type(value)){
        console.warn(itemName+"数据类型不一致");
        return;
    }
   return (data.filter((item)=>item[itemName]===value))[0];
}
// 直接判断tableData是否含有key值
// isTableHasKey
function isTableHasKey(data,itemName=""){
    if(isEmpty(itemName)){
        console.warn("itemName为空串")
        return;
    }
    if(isEmpty(data)){
        if(Object.keys(data[0]).includes(itemName)){
            return true;
        }else{
            return false;
        }
    }else{
        console.warn("tableData为空数组")
    }
}

// 快速设置tableData item 的key对应的val,设置默认值的时候使用
function setTableItemVal(data,itemName=[],val=[]){
    if(type(itemName)!=="array"){
        console.warn("itemName应为array")
        return;
    }
    if(type(val)!=="array"){
        console.warn("val应为array");
        return;
    }
    if(isEmpty(itemName)){
        console.warn("itemName为空数组");
        return;
    }
    if(isEmpty(val)){
        console.warn("val为空数组");
        return;
    }
    if(itemName.length!==val.length){
        console.warn("itemName和val长度不一致");
        return;
    }
    data.map((element,index)=>{
       if(itemName[index]&&val[index]){
           element[index]=val[index];
       }
    })
    return data;
}

// let obj={
// 	a:{
// 		b:[
//             {
// 			 c:4 
// 			}
// 		]	
// 	}
// 	}
//getProp(obj,"a","b","0","c")
function getProp(obj, ...keys )
{   
    return keys.reduce((a,b )=>(a || {})[b],obj );
}
//适用于编辑和详情页
//快速设置tableData数据中对应id的display
// {
//     id:{
//         1:"冯雪",
//         2:"付益"
//     },
//     x:{
//         1:"21",
//         3:"2"
//     }
// }
// function setTableVal(){

// }
export {
    setCookie,
    getCookie,
    setTitle,
    share,
    ajax,
    checkLogin,
    dateFormat,
    getCodeData,
    delAllCookie,
    setSession,
    getSession,
    isNoFindSession,
    delSession,
    clone,
    dayDateOfMonth,
    dayDateOfMonthEnd,
    shareDetail,
    shareCall,
    setLocal,
    getLocal,
    debounce,
    getCleanCacheData,
    type,
    isEmpty,
    eventUtil,
    throttle,
    dataProcess,
    deDuplication,
    deleteField,
    setDayTime,
    bindData,
    selectDefaultData,
    getTableSectionData,
    deleteForArr,
    watchObj,
    resetObj,
    validateForm,
    getRoleArr,
    getParentRole,
    getFourRoleArr,
    objRenameKeys,
    arrRenameKeys,
    getRouterArr,
    requestFn,
    deleteNull,
    complementSet,
    selectEditDefaultData,
    trimObj,
    iEVersion,
    loadIframeAsync,
    getCode,
    baseFn,
    transArr,
    reEmphasis,
    getCodeDisplay,
    getTableItem,
    isTableHasKey,
    setTableItemVal,
    getProp,
    getAsso
}