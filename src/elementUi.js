import ElementUI from 'element-ui';
import Input from "common/VInput";
let keys=Object.keys(ElementUI);
let excludeArr=["Input","version","locale","i18n","install","Loading","default"];
let components=[];
keys.forEach((key)=>{
  if(!excludeArr.some((v)=>v===key)){
    components.push(ElementUI[key]);
  }else if(key==='Input'){
    components.push(Input);
  }
  
});  
  const install = function(Vue, opts = {}) {
    components.forEach(component => {
      Vue.component(component.name, component);
    });
    let Loading=ElementUI.Loading;
    let MessageBox=ElementUI.MessageBox;
    let Message=ElementUI.Message;
    Vue.use(Loading.directive);
  
    Vue.prototype.$ELEMENT = {
      size: opts.size || '',
      zIndex: opts.zIndex || 2000
    };
  
    Vue.prototype.$loading = Loading.service;
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$prompt = MessageBox.prompt;
    Vue.prototype.$message = Message;
  
  };
  
  /* istanbul ignore if */
  if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
// module.exports.default={
//     install
// }
export default install