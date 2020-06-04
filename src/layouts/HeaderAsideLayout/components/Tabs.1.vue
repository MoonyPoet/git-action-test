<template>
    <div class="app-wrap">
        <!-- 此处放置el-tabs代码 -->
         <!-- <router-view/> -->
            <div class="template-tabs">
            <!-- <el-tabs
                v-model="activeIndex"
                type="border-card"
                closable
                @tab-click="tabClick"
                v-if="options&&options.length"
                @tab-remove="tabRemove">
                <el-tab-pane
                :key="item.name"
                v-for="(item) in options"
                :label="item.name"
                :name="item.route">
                </el-tab-pane>
            </el-tabs>
            <button class="return" v-show="btnIsShow" @click="back()">返回</button>
            <button class="reload" @click="reload()">刷新</button> -->
            </div>
            <div class="content-wrap">
                <div style="height:40px;">
                  
                </div>
                <!-- <keep-alive :exclude="exCache">
                    <router-view/>
                </keep-alive> -->

                 <router-view/> 
            </div>
        </div>
</template>

<script>
import {deDuplication,getLocal} from 'assets/js/reused'
export default {
  data() {
    return {
      btnIsShow:true
    };
  },
  mounted () {
    
    // 刷新时以当前路由做为tab加入tabs
    // if (this.$route.path !== '/' && this.$route.path.indexOf('userInfo') == -1) {
    //   console.log("2342")
    //   this.$store.commit('addTabs', {route: '/', name: '机构首页'});
    //   this.$store.commit('addTabs', {route: this.$route.path , name: this.$route.name });
    //   this.$store.commit('activeIndex', this.$route.path);
    // } else {
    // }
    //如果已经存在，不再执行
    // this.$store.state.options.forEach(element => {
    //   if(element.route==this.$route.path){
    //     return
    //   }
    // });
    // //如果刷新前路由为首页的情况
    // if(this.$route.path=="/index"||this.$route.path=="/"){
    //     this.$store.state.options.forEach(element => {
    //       if(element.route=='index'){
    //         return
    //       }
    //     });
    //   this.$store.commit('addTabs', {route: '/index', name: '机构首页'});
    //   this.$store.commit('activeIndex', '/index');
    // }else{
    //   this.$store.commit('addTabs', {route: '/index', name: '机构首页'});
    //   this.$store.commit('addTabs', {route: this.$route.path , name: this.$route.name ,query:this.$route.query});
    //   this.$store.commit('activeIndex', this.$route.path);
    // }setOptions
    //  if(this.$route.path=="/index"||this.$route.path=="/"){
    //     this.$store.state.options.map(element => {
    //       if(element.route=='index'){
    //         return
    //       }
    //     });
    //     this.$store.commit('addTabs', {route: '/index', name: '机构首页'});
    //  }
    if(getLocal("options")==undefined){
      this.$store.commit('setOptions',[{route: '/index', name: '机构首页'}]);
      this.$store.commit('activeIndex','/index');
    }else{
      this.$store.commit('setOptions',getLocal("options"));
      this.$store.commit('activeIndex',getLocal("activeIndex"));
    }
    //返回按钮设置
    let patt=/add|edit|Back|back|view|View|Detail|detail/;
    if(patt.test(this.$route.fullPath)){
      this.btnIsShow=true;
    }else{
      this.btnIsShow=false;
    }
    // this.$store.options=deDuplication(this.$store.options);
    // if(this.$route.path=="/"||this.$route.path=="/index"){
     
    //   this.$store.commit('addTabs', {route: '/', name: '机构首页'});
    //   this.$store.commit('activeIndex', '/');
    //   this.$router.push('/');
    // }else{
    //   this.$store.commit('addTabs', {route: '/', name: '机构首页'});
    //   this.$store.commit('addTabs', {route: this.$route.path , name: this.$route.name });
    //   this.$store.commit('activeIndex', this.$route.path);
    // }
  },
  methods: {
    // tab切换时，动态的切换路由
    tabClick(tab) {
      let path = this.activeIndex;
      // 用户详情页的时候，对应了二级路由，需要拼接添加第二级路由
      if (this.activeIndex === "/userInfo") {
        path = this.activeIndex + "/" + this.$store.state.userInfo.name;
      }
      let data="";
      this.$store.state.options.forEach(element=>{
        if(element.route==path){
          data=element.query;
        }
      })
      this.$router.push({ path: path,query:data});
      this.$store.commit("setCache");
    },
    tabRemove(targetName) {
      // 首页不可删除
      if (targetName == "/index") {
        return;
      }
      this.$store.commit("deleteTabs", targetName);
      this.$store.commit("setCache");
      if (this.activeIndex === targetName) {
        // 设置当前激活的路由
        if (this.options && this.options.length >= 1) {
          this.$store.commit(
            "activeIndex",
            this.options[this.options.length - 1].route
          );
          //解决删除标签没有url的bug
          this.$router.push({ path: this.activeIndex,query:{
            ...this.options[this.options.length - 1].query
          }});
        } else {
          this.$router.push({ path: "/index" });
        }
      }
    },
    back(){
      this.$router.go(-1)
    },
    reload(){
      // console.log(this.$router)
      // this.$router.replace(this.$router.history.current.path)
      location.reload()
    }
  },
  computed: {
    isCache(){
       if(this.$store.getters&&this.$store.getters.isCache){
          return this.$store.getters.isCache;
       }
    },
    exCache(){
      if(this.$store.getters&&this.$store.getters.exCache){
          return this.$store.getters.exCache;
       }
    },
    options() {
      // console.log(this.$store.state.options)
      // console.log(deDuplication(this.$store.options))
      return deDuplication(this.$store.state.options);
    },
    activeIndex: {
      get() {
        return this.$store.state.activeIndex;
      },
      set(val) {
        this.$store.commit("activeIndex", val);
      }
    }
  },
  watch: {
    $route(to) {
      //处理按钮显示隐藏
      let patt=/add|edit|Back|back|view|View|Detail|detail/;
      if(patt.test(this.$route.fullPath)){
        this.btnIsShow=true;
      }else{
        this.btnIsShow=false;
      }
      if(to.name==undefined){
        return
      }
      if(to.path=="/index"){
        //切到首页
        this.$store.commit("activeIndex", to.path);
        return
      }
      //返回会触发,防止重复添加
      let flag = false;
      if(this.options==undefined){
        return
      }
      for (let option of this.options) {
        if (option.route === to.route) {
          flag = true;
          this.$store.commit("activeIndex", to.path);
          break;
        }
      }
      if (!flag) {
        this.$store.commit("addTabs", {
          route: to.path,
          name: to.name,
          query:to.query
        });
        this.$store.commit("activeIndex",to.path);
      }
    }
  }
};
</script>
<style lang="scss">
    .app-wrap {
      flex: 1;
      //   padding: 10px 20px;
      overflow: auto;
      .content-wrap {
        // height: 90%;
        // border: 1px solid #d1dbe5;
        border-top: none;
        // padding: 0 20px;
      }
      & > .template-tabs > .el-tabs > .el-tabs__content {
        padding: 0px 0;
        // box-shadow: 0px 4px 5px 5px #ccccccc9;
      }
      .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
          color: #409EFF;
          background-color: #fff;
          // border-bottom: 1px solid #d9dadd;
      }
      .template-tabs{
          position: fixed;
          width: 100%;
          z-index: 4;
          top: 65px;
      }
      // .el-tabs--border-card,
      & > .template-tabs>.el-tabs--border-card,& > .template-tabs>.el-tabs__header,& > .template-tabs>.el-tabs__nav-wrap{
        width: calc(1920px - 341px);
      }
       @media screen and (max-width: 1919px) {
         & > .template-tabs>.el-tabs--border-card,& > .template-tabs>.el-tabs__header,& > .template-tabs>.el-tabs__nav-wrap{
         width: calc(1920px - 750px);
         }
      }
      @media screen and (max-width: 1366px) {
         & > .template-tabs>.el-tabs--border-card,& > .template-tabs>.el-tabs__header,& > .template-tabs>.el-tabs__nav-wrap{
         width: calc(1920px - 800px);
         }
      }
      @media screen and (max-width: 1000px) {
         & > .template-tabs>.el-tabs--border-card,& > .template-tabs>.el-tabs__header,& > .template-tabs>.el-tabs__nav-wrap{
         width: 630px;
         }
      }
      .el-tabs__nav-next, .el-tabs__nav-prev{
        position: absolute;
        cursor: pointer;
        line-height: 38px;
        font-size: 12px;
        color: #909399;
      }
      & > .template-tabs>.el-tabs--border-card{
        height: 39px;
        float: left;
      }
      & > .template-tabs{
        // box-shadow: 0px 4px 5px 5px #ccccccc9;
        background: #f5f7fa;
      }
      .return{
        float: left;
        height: 39px;
        border: none;
        color: #909399;
        background: #f5f7fa;
        border-bottom: 1px solid #e4e7ed;
        cursor: pointer;
        border-left: 1px solid #e4e7ed;
      }
      .reload{
        float: left;
        height: 39px;
        border: none;
        color: #909399;
        background: #f5f7fa;
        border-bottom: 1px solid #e4e7ed;
        border-left: 1px solid #e4e7ed;
        cursor: pointer;
        border-right: 1px solid #e4e7ed;
      }
     
    }
</style>
