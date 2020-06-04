import Vue from 'vue'
// let date=Vue.filter('date',function (data) {
//   return new Date(parseInt(data) * 1000).toLocaleString().replace(/\//g,'-').split(" ")[0]
// })
// 注册date.Format("yyyy-MM-dd hh:mm:ss");new Date(parseInt(data) * 1000).toLocaleString().replace(/\//g, '-').split(" ")[0]
Vue.filter('date', function(data) {
  if (!data) return ''
  return dateFormat("yyyy-MM-dd",new Date(parseInt(data) * 1000));
})
Vue.filter('allDate', function(data) {
  if (!data) return ''
  return dateFormat("yyyy-MM-dd hh:mm:ss",new Date(parseInt(data) * 1000));
})
Vue.filter('hour', function(data) {
  if (!data) return ''
  return dateFormat("hh:mm:ss",new Date(parseInt(data) * 1000));
})
Vue.filter('array_String', function(data) {
  if (!data) return ''
  return data.toString();
})
Vue.filter('cut_font', function(data, value) {
  if (!data) return ''
  return data.substr(0, parseInt(value))
})
Vue.filter('number', function(data) {
  if (isNaN(data)) return ''
  return data;
})
function dateFormat(fmt,date)
{ //author: meizz
  var o = {
    "M+" : date.getMonth()+1,                 //月份
    "d+" : date.getDate(),                    //日
    "h+" : date.getHours(),                   //小时
    "m+" : date.getMinutes(),                 //分
    "s+" : date.getSeconds(),                 //秒
    "q+" : Math.floor((date.getMonth()+3)/3), //季度
    "S+"  : date.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}


// getter，返回已注册的过滤器
var date = Vue.filter('date');
var array_String = Vue.filter('array_String');
