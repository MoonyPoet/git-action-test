<template>
  <section class="app-main">
      <Tabs v-if="tabIsShow"></Tabs>
      <BackToTop v-if="backToTopIsShow" ref="backToTop"></BackToTop>
  </section>
</template>

<script>
import Tabs from "./Tabs";
import BackToTop from './BackToTop';
import { getCookie, setCookie,isEmpty,setLocal,getFourRoleArr,getRouterArr,getLocal,type} from "assets/js/reused";
import {getMemeberData} from "assets/js/business";
import HeaderAsideLayout from "@/layouts/HeaderAsideLayout";
let NotFound=()=>import('../../../pages/NotFound');
export default {
  name: 'AppMain',
  data(){
    return {
      tabIsShow:false,
      backToTopIsShow:false,
      authTabs:"",
    }
  },
  components:{
    Tabs,
    BackToTop
  },
  async created(){
    let res=await getMemeberData();
    let newRouterArr=[];
    function generateRouter(routerArr,isOptList=false){
      routerArr.map((router)=>{
        let page;
        if(router.page){
          page=router.page.replace('./pages/','');
        }
        let newPath="/"+(router.path||router.val);
        if(page&&page!=""){
          newRouterArr.push({
            path: newPath,
            meta: undefined,
            name: router.name,
            redirect: undefined,
            component: ()=> import('@/pages/' + page + '.vue')
          })
        }
        if(router.optList&&router.optList.length>0){
          generateRouter(router.optList,true)
        }
        if(router.childrenModules&&router.childrenModules.length>0){
          generateRouter(router.childrenModules)
        }
      })
    }
    generateRouter(res.auths)
      newRouterArr.push({
        path: '*',
        component: NotFound
      })
    //路由表不添加重复的
    let newRouterArr1=[];
    newRouterArr.map((item)=>{
      if(!this.$router.options.routes.some((note)=>note.path===item.path)){
        newRouterArr1.push(item)
      }
    })
    this.$router.options.routes.push(...newRouterArr1);
    
    this.$router.addRoutes(newRouterArr1)
    // console.log(newRouterArr)
    //动态路由处理
    setLocal("auths", res.auths);
    // setLocal("authArr", getFourRoleArr());
    // setLocal("routerArr", getRouterArr());
    setLocal("imgUrl",res.imgUrl);
    setLocal("vodIfrUrl",res.vodIfrUrl);
    setLocal("unit",res.unit)
    setLocal("memberInfo",res.member)
    for(let key in res.paramconfig){
      if(key!=="follow_day"){
        if(res.paramconfig[key]==='1'){
          res.paramconfig[key]=true;
        }else{
          res.paramconfig[key]=false;
        }
      }
    }
    setLocal("paramconfig",res.paramconfig)
    this.$store.commit("setParamConfig",res.paramconfig);
    // this.$store.commit("setAuthArr", getFourRoleArr());
    this.$store.commit("setAuthData", res.auths);
    this.$store.commit("setAuthTabs",res.authTabs);
    this.$store.commit("setMemberInfo",res.member);
    if(getCookie("baseInfo")&&getCookie("imgOrVideo") == "" && getCookie("insId")){
      this.findPath().then(res => {
        setCookie("imgOrVideo", res);
        this.$store.commit("setImgOrVideo", res);
      });
    }else{
      this.$store.commit("setImgOrVideo", getCookie("imgOrVideo"));
    }
    this.$nextTick(()=>{
      this.tabIsShow=true;
      this.backToTopIsShow=true;
    });
  },
  methods:{
    findPath() {
      return new Promise(async (resolve, reject) => {
         resolve(await post("system/findfilepath",{},"common"));
      });
    }
  }
};
</script>
<style>
.app-main{
  background: #fff;
  position: absolute;
  /* overflow-x: hidden; */
  top:65px;
  right: 0;
  left: 0;
  bottom: 0;
  /* overflow-y: auto; */
}
@media screen and (max-width: 1366px) {
  .app-main{
    margin-left: 153px !important;
  }
  ::-webkit-scrollbar {
    height: 10px;
  }
  ::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 10px;
    background-color: #000000e3;
  }
  ::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #EDEDED;
    }
}
</style>

