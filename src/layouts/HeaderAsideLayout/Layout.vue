<template>
  <div class="app-wrapper">
    <div style="font-size:0">
      <input type="text" id="activeFocus" class="activeFocus">
    </div>
    
    <div v-if="ieShow" class="text_center bg">该浏览器可能有部分不兼容,请更换chrome浏览器获得最佳体验。<a style="color:red" href="/manage/download/ChromeSetup.exe">点击下载</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" @click="notNotice()">不再提示</a></div>
    <div v-if="$route.path!='/login'&&$route.path!='/notFound'&&$route.path!='/serverError'&&$route.path!='/operationGuide'">
      <!-- <side-bar class="sidebar-container"></side-bar> -->
      <div class="main-container">
        <nav-bar class="nav-container"></nav-bar>
        <side-bar class="sidebar-container"></side-bar>
        <!-- <app-main style="margin-left: 11vw ;"></app-main> -->
        <app-main ref="appMain" class="app_main"></app-main>
      </div>
    </div>
    <div v-else>
      <div class="main-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, SideBar, AppMain } from "./components";
import { eventUtil, getCookie, setCookie,iEVersion,isEmpty,setLocal,getFourRoleArr,getRouterArr,getLocal} from "assets/js/reused";
export default {
  name: "layout",
  data() {
    return {
      isOffine: false,
      ieShow:false
    };
  },
  components: {
    NavBar,
    SideBar,
    AppMain
  },
  created() {
    
    if(getCookie("notNotice")==="true"){
        this.ieShow=false;
    }else{
      if(!(iEVersion()===-1||iEVersion()==="edge")){
        this.ieShow=true;
      }
    }
    this.isOnline();
    //主要是登录页
    if (
      this.$route.path == "/login" &&
      this.$route.query.insId &&
      this.$route.query.insId != getCookie("insId")
    ) {
      setCookie("insId", "");
      setCookie("baseInfo", "");
      this.$store.commit("clearOption");
    }
  },
  mounted() {
    //window大小发生变化重新渲染组件
    window.onresize=()=>{
      this.$refs.appMain&&this.$refs.appMain.$forceUpdate()
    }
  },
  methods: {
    notNotice(){
      this.ieShow=false;
      setCookie("notNotice","true")
    },
    isOnline() {
      eventUtil.addHandler(window, "online", () => {
        //网络中断后再判断
        if (this.isOffine) {
          this.$message({
            showClose: true,
            message: "网络已恢复",
            type: "success"
          });
        }
      });
      eventUtil.addHandler(window, "offline", () => {
        this.isOffine = true;
        this.$message({
          showClose: true,
          message: "您的网络已中断",
          type: "error"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.activeFocus{
  height: 0px;
}
.bg{
  background: yellow;
  position: fixed;
  z-index: 2;
  width: 100%;
  height: 20px;
  line-height: 20px;
}
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}
.nav-container {
  z-index: 7;
}
.main-container {
  min-height: 100vh;
  background-color: #f0f2f5;
}
.app_main{
  margin-left: 11vw ;
  background: #f3f3f3;
  transition: margin-left .28s;
}
</style>
