<template lang='html'>
    <div class="tab_pages">
        <el-tabs
            v-model="activeIndex"
            type="border-card"
            @tab-click="tabClick"
            v-if="options&&options.length"
            @tab-remove="tabRemove">
            <el-tab-pane
            :closable="item.route!=='/index'"
            :key="item.name"
            v-for="(item) in options"
            :label="filter(item)"
            :name="item.route">
            </el-tab-pane>
        </el-tabs>
        <button class="back" v-show="btnIsShow" @click="back()">{{$t('layouts.back')}}</button>
        <button class="reload" @click="reload()">{{$t('layouts.reload')}}</button>
        <div style="clear:both;"></div>
        <div class="view_show base_container">
          <Alive ref="alive">
            <Tab>
            </Tab>
          </Alive>
         
        </div>
        
    </div>
</template>
<script>
    import {getLocal,deDuplication} from "assets/js/reused";
    import Alive from "common/Alive";
    import Tab from "common/Tab";
     export default {
        name: 'TabPages',
        components:{
          Alive,
          Tab
        },
        data () {
            return{
                btnIsShow:true,
                isPageCache:true
            }
        },
        watch: {
            $route(to,form) {
              console.log( window.cancelRequest)
              window.cancelRequest.setRouter(to.path);
              setTimeout(()=>{
                 window.cancelRequest.clearToken()
              })
              //  this.cleanCache(to,form)
                //处理按钮显示隐藏
                let patt=/add|edit|Back|back|view|View|Detail|detail/;
                if(patt.test(this.$route.fullPath)){
                    this.btnIsShow=true;
                }else{
                    this.btnIsShow=false;
                }
                // 从添加或者编辑返回页面都不缓存,否则缓存
                let patt1=/add|edit/;
                if(form.path.search(patt1)>-1){
                  // this.isPageCache=false;
                  
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
                // let flag = false;
                if(this.options==undefined){
                    return
                }
                // for (let option of this.options) {
                //     if (option.route === to.path) {
                //     flag = true;
                //     this.$store.commit("activeIndex", to.path);
                //     break;
                //     }
                // }
                // if (!flag) {
                //     this.$store.commit("addTabs", {
                //     route: to.path,
                //     name: to.name,
                //     query:to.query
                //     });
                //     this.$store.commit("activeIndex",to.path);
                // }
                if(this.getParentName(to.path)==="财务统计"&&this.options.some((item)=>item.name==="财务统计")){
                   this.$store.commit("replaceTab", {
                    route: to.path,
                    name:this.getParentName(to.path),
                    query:to.query
                });
                }else{
                  this.$store.commit("addTabs", {
                    route: to.path,
                    name: to.name,
                    query:to.query
                });
                }
                
                this.$store.commit("activeIndex",to.path);
            }
        },
        created(){
              if(getLocal("options")==undefined){
                this.$store.commit('setOptions',[{route: '/index', name: '机构首页'}]);
                this.$store.commit('activeIndex','/index');
              }else{
                this.$store.commit('setOptions',getLocal("options"));
                this.$store.commit('activeIndex',getLocal("activeIndex"));
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
                return this.$store.state.options;
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
        methods:{
            getParentName(path){
              let parentName;
              getLocal("auths").map((element)=>{
                if(element.childrenModules&&element.childrenModules.length>0){
                  element.childrenModules.map((item)=>{
                    if(item.optList&&item.optList.length>0){
                      item.optList.map((note)=>{
                        if(path==="/"+note.path){
                          parentName=item.name;
                        }
                      })
                    }
                  })
                }
              });
              return parentName;
            },
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
            cleanCache(val,oldVal){
              // 根据路由清除缓存
              //切换页面时获得路由，该添加,编辑路由跟缓存中的任意路由进行匹配，匹配成功,则清除
              //如果页面对应add或者edit则不进行缓存
              if(val.path.search(/add|edit/)>-1){
                  this.$nextTick(()=>{
                    console.log(this.$refs)
                    this.$refs.alive.cleanAddEditCache()
                  })
                }
              //从新增编辑返回的时候，更新页面
              if(oldVal.path.search(/add|edit/)>-1){
                this.$nextTick(()=>{
                  this.$refs.alive.cleanBackCache(val.path)
                })
               
              }
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
            filter(item){
              if(lang==="cn"){
                return item.name;
              }else{
                let routeStr="";
                item.route.replace(/(?:\/(\w)[^\/]*)?$/,($1)=>{
                  let str=$1.slice(1);
                  routeStr+=str[0].toUpperCase()+str.slice(1)
                })
                return routeStr;
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
        }
    }
</script>
<style lang="scss" scoped>
.tab_pages{
  width: 100%;
  float: left;
  z-index: 4;
  top: 65px;
  // background: #f5f7fa;
  & > .el-tabs > .el-tabs__content {
    padding: 0px 0;
    // box-shadow: 0px 4px 5px 5px #ccccccc9;
  }
 /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color:#fff ;
    background-color: #409eff;
    // border-bottom: 1px solid #d9dadd;
  }
  // .el-tabs--border-card,
  &> .el-tabs--border-card,
  &> .el-tabs__header,
  &> .el-tabs__nav-wrap {
    width: calc(1920px - 341px);
  }
  @media screen and (max-width: 1919px) {
    &> .el-tabs--border-card,
    &> .el-tabs__header,
    &> .el-tabs__nav-wrap {
      width: calc(1920px - 750px);
    }
  }
  @media screen and (max-width: 1366px) {
    &> .el-tabs--border-card,
    &> .el-tabs__header,
    &> .el-tabs__nav-wrap {
      width: calc(1920px - 800px);
    }
  }
  @media screen and (max-width: 1000px) {
    &> .el-tabs--border-card,
    &> .el-tabs__header,
    &> .el-tabs__nav-wrap {
      width: 630px;
    }
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    position: absolute;
    cursor: pointer;
    line-height: 38px;
    font-size: 12px;
    color: #909399;
  }
  &> .el-tabs--border-card {
    height: 39px;
    float: left;
  }
  .back {
    float: left;
    height: 36px;
    border: none;
    color: #909399;
    background: #f5f7fa;
    cursor: pointer;
    border-left: 1px solid #e4e7ed;
  }
  .reload {
    float: left;
    height: 36px;
    border: none;
    color: #909399;
    background: #f5f7fa;
    border-left: 1px solid #e4e7ed;
    cursor: pointer;
    border-right: 1px solid #e4e7ed;
  }
  .el-tabs__nav-scroll {
    // padding: 1px;
    background: #f3f3f3;
    // margin-bottom: 1px;
  }
  .view_show{
    background: #fff;
    overflow:scroll;
    max-height: calc(100vh - 144px);
  }
  /deep/.el-tabs--border-card{
    background: none
  }
}
</style>