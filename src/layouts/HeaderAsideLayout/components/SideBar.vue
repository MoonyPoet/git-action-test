<template>
  <scroll-bar>
    <el-menu mode="vertical" :show-timeout="200" background-color="#2d323f" :default-active="defaultActive" text-color="white" active-text-color="#1e1e1e" unique-opened>
      <div class="close" @click="close">
        <i class="el-icon-arrow-left" v-if="!isClose"></i>
        <i class="el-icon-arrow-right" v-else></i>
      </div>
      <template v-for="item in asideMenuConfig">
        <!-- 只有一级 -->
        <div v-if="item.childrenModules&&item.childrenModules.length==0" :key="item.id" style="border-bottom: 1px solid #000;">
          <router-link @click.native="chickHandler" :to="(typeof(item.path)=='undefined'?'':'/'+(item.path===''?'noAuthority':item.path))">
            <el-menu-item :index="item.id.toString() ||(typeof(item.path)=='undefined'?'':item.path)" unique-opened>
              <i v-if="item.icon" :class="item.icon">
                <imageBar :load="item.icon" :style="{display:'inline-block',width:'35px',transform: 'scale(0.8)',marginTop:'-8px'}"></imageBar>
              </i>
              <span v-if="item.name" slot="title">{{item.name}}</span>
            </el-menu-item>
          </router-link>
        </div>
        <!-- 有多级 -->
        <div v-else :key="item.id" style="border-bottom: 1px solid #000;">
          <!-- @click.native="navShow1?'':chickHandler1" 判断如果有第三级则无任何点击效果 -->
          <el-submenu @click.native="navShow1?'':chickHandler1" :index="item.id.toString() || (typeof(item.path)=='undefined'?'':item.path)">
            <template slot="title">
              <i v-if="item && item.icon" :class="item.icon">
                <imageBar :load="item.icon" :style="{display:'inline-block',width:'35px',transform: 'scale(0.8)',marginTop:'-8px'}"></imageBar>
              </i>
              <span v-if="item && item.name" slot="title">{{item.name}}</span>
            </template>
            <!-- 第二级 -->
            <template v-for="child in item.childrenModules">
              <!-- navShow1? 判断如果有第三级 则不产生任何点击效果 -->
              <!-- <router-link :to="navShow1?'':(typeof(item.path)=='undefined'?'':'/'+item.path) + (child.path===''?'noAuthority':child.path)" @mousemove.native="mouseoverEvent(child)" :key="child.name"> -->
              <router-link :to="navShow1?'/'+childMenu[0].path:(typeof(item.path)=='undefined'?'':'/'+item.path) + (child.path===''?'noAuthority':child.path)" @mousemove.native="mouseoverEvent(child)" :key="child.name">
                <el-menu-item :index="child.id.toString()" @click="parent(child,childMenu)">
                  <span v-if="child && child.name" slot="title">{{child.name}}</span>
                </el-menu-item>
              </router-link>
            </template>
          </el-submenu>
        </div>
      </template>
    </el-menu>
    <!-- 第三级 -->
    <!-- <ul class="nav_ul1" v-show="navShow1" @mouseout="mouseoutEvent"> -->
    <ul class="nav_ul1" v-show="false" @mouseout="mouseoutEvent">
      <li v-for="child in childMenu" @mousemove="mouseoverEvent1" :key="child.id">
        <router-link v-if="child.path!=''" @click.native="clickEvent" :to="(typeof(child.path)=='undefined'?'':'/'+child.path)">
          {{child.name}}
        </router-link>
        <a v-else href="javascript:;">{{child.name}}</a>
      </li>
    </ul>
  </scroll-bar>
</template>

<script>
import ScrollBar from "./ScrollBar";
import ImageBar from "common/ImageBar";

import { getLocal, isEmpty, type,setSession } from "assets/js/reused";

export default {
  components: { ScrollBar, ImageBar },
  name: "SideBar",
  data() {
    return {
      navShow1: false,
      // asideMenuConfig: [],
      childMenu: [],
      defaultActive: "",
      isClose:false
    };
  },
  computed:{
    asideMenuConfig(){
      if(this.$store&&this.$store.getters&&!isEmpty(this.$store.getters.authData)){
        return this.$store.getters.authData;
      }else{
        return [];
      }
    }
  },
  created() {
    window.addEventListener("scroll", () => {
      this.scrollTo();
    });
    window.onresize = () => {
      this.scrollTo();
    };
    this.init();
  },
  watch: {
    $route(to) {
      this.init();
    }
  },
  methods: {
    close(){
      if(this.isClose===false){
        document.querySelector(".sidebar-container").style.width="0px";
        document.querySelector(".app-main").style.marginLeft="0px";
        document.querySelector(".close").style.left="0px";
        document.querySelector(".close").style.display="block";
        this.isClose=true;
      }else{
        document.querySelector(".sidebar-container").style.width="11vw";
        document.querySelector(".app-main").style.marginLeft="11vw";
        document.querySelector(".close").style.left="211px";
        document.querySelector(".close").style.display=null;
        this.isClose=false;
      }
      
    },
    init() {
      let threeRoute = this.$route.path.split("/")[1]; //获取第三级路由
      //根据三级路由查询二级路由
      let auth = getLocal("auths");
      // if(auth&&auth.length>0){
      //   for (let i = 0; i < auth.length; i++) {
      //     if(auth[i].childrenModules&&auth[i].childrenModules.length>0){
      //       for (let k = 0; k < auth[i].childrenModules.length; k++) {
      //         if (
      //           auth[i].childrenModules[k].pathRela.split(",").includes(threeRoute)
      //         ) {
      //           this.defaultActive = auth[i].childrenModules[k].id.toString();
      //           return false;
      //         }
      //       }
      //     }
      //   }
      // }
      // this.defaultActive=this.$route
      // this.defaultActive=this.$route.path;
      function findPathId(auth,path){
         if(auth&&auth.length>0){
          for(let element of auth){
            if("/"+element.path===path){
              return element.id;
            }else{
              if(element.childrenModules&&element.childrenModules.length>0){
                let id=findPathId(element.childrenModules,path);
                if(id){
                  return id;
                }
              }
            }
          }
        }
      }
      let id=findPathId(auth,this.$route.path);
      if(id){
        this.defaultActive=findPathId(auth,this.$route.path).toString();
      }
    },
    mouseoutEvent() {
      this.navShow1 = false;
    },
    mouseoverEvent1() {
      this.navShow1 = true;
    },
    chickHandler() {
      this.navShow1 = false;
      setSession("searchData",[])
    },
    chickHandler1() {
      this.navShow1 = false;
      setSession("searchData",[])
    },
    clickEvent() {
      this.navShow1 = false;
    },
    mouseoverEvent(child) {
      if(isEmpty(child.childrenModules)){
        return
      }
      this.childMenu = [...child.childrenModules];
      let divHeight = 0;
      if (
        document.querySelector(".scroll-wrapper").offsetHeight >
        document.querySelector(".sidebar-container").offsetHeight
      ) {
        divHeight = document.querySelector(".scroll-wrapper").offsetHeight;
      } else {
        divHeight = document.querySelector(".sidebar-container").offsetHeight;
      }
      document.querySelector(".nav_ul1").style.height = divHeight + "px";
      if (child.childrenModules.length > 0) {
        this.navShow1 = true;
      } else {
        this.navShow1 = false;
      }
    },
    scrollTo() {
      let appMainObj=document.getElementsByClassName("app-main");
      let sideBarContainter=document.querySelector(".sidebar-container");
      if(appMainObj){
         if (window.outerWidth < 1500) {
          appMainObj[0].style.height = "calc(100% - 65px)";
          sideBarContainter.style.height = "calc(100% - 65px)";
        } else {
          appMainObj[0].style.height =
            " calc(100% - 65px)";
          sideBarContainter.style.height =
            " calc(100% - 65px)";
        }
      }
    },
    parent(obj, v) {
      if (v.length == 0) {
        v = [];
      }
      this.defaultActive =obj.id.toString();
      this.$parent.$emit("parentRoute", v);
      setSession("searchData",[])
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  line-height: 64px;
  background: #002140;
  color: #fff;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  overflow: hidden;
}
.scroll-container:hover .close{
  display: block;
}
.close{
  position: fixed;
  transition: left 0.28s;
  left: 211px;
  top: 0;
  color: #fff;
  bottom: 0;
  background: #ccc;
  z-index: 2000;
  height: 26px;
  margin: auto;
  line-height: 26px;
  border-radius: 0 4px 4px 0;
  display: none;
  cursor: pointer;
}
.close:hover{
  background: #409eff;
  color: #fff;
}
img{
  width: 60%;
}
.site-name {
  margin-left: 10px;
  color: #fff;
}
.sidebar-container {
  // overflow: auto;
  // box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  transition: width 0.28s;
  width: 11vw;
  position: absolute;
  top: 65px;
  bottom: 0;
  left: 0;
  z-index: 5;
  bottom: 0;
  overflow: hidden;
  height: calc(100% - 65px);
  a {
    display: inline-block;
    width: 100%;
  }
  .nav_ul1 {
    display: block;
    position: absolute;
    left: 11vw;
    width: 200px;
    background: #000c17;
    overflow: visible;
    top: 0;
    li {
      font-size: 15px;
      background: #000c17;
      border-bottom: 1px solid rgb(68, 68, 68);
      text-align: center;
      a {
        color: #fff;
        padding: 12px 0;
      }
    }
    li:hover {
      background: #1b80ae !important;
    }
  }
  .el-menu {
    // padding-top: 16px;
    width: 100% !important;
    border: none;
  }
  .el-submenu .el-menu-item {
    min-width: 11vw !important;
    font-weight: 500;
    background-color:#171a22 !important;
    &:hover {
      color: #fff !important;
    }

    @media screen and (max-width: 1400px) {
      & {
        padding-left: 57px !important;
      }
    }
  }
  .el-menu-item,
  .el-submenu .el-menu-item {
    &.is-active {
      background-color: #0076d1 !important;
      color: #fff !important;
      &:hover {
        background-color: #0076d1 !important;
        color: #fff !important;
      }
    }
    &:hover {
      background-color: #144266 !important;
      color: #fff !important;
    }
  }

  .el-submenu__title i {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.65);
  }
}
</style>
