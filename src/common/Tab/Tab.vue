<template>
  <div class="app-wrap">
       <el-tabs v-if="isShowTab" class="shadow"  type="border-card" v-model="curRouter" @tab-click="changeTab">
            <el-tab-pane  v-for="(item) in routerArr" :name="item.path"  :label="item.name" :key="item.id">
            </el-tab-pane>
            <router-view></router-view>
       </el-tabs>
       <router-view v-else />
  </div>
</template>

<script>
import { deDuplication, getLocal,getCookie} from "assets/js/reused";
import {Observable} from "rxjs";
export default {
  data() {
    return {
      btnIsShow: true,
      parentArr: [],
      routerName: "",
      authTabs: [],
      routerArr:[],
      isHasChild:false,
      curRouter:null,
      routerObj:{
        educationStatistics:[
            "/educationStatistics/tchrStatistics"
        ],
        financeStatistics:[
          "/financeStatistics/budget",
          "/financeStatistics/consume"
        ]
      },
      isShowTab:false
    };
  },
  created(){
    let ob1=this.watchRouter();
    let routerArr=[];
    for(let key in this.routerObj){
       routerArr.push(...this.routerObj[key]); 
    };
    ob1.subscribe((res)=>{
      if(routerArr.includes(res.path)){
        this.curRouter=res.path.split(/^\//)[1];
        this.routerArr=this.getTabName(res.path);
        this.isShowTab=true;
      }else{
        this.isShowTab=false;
      }
    });
    
  },
  mounted() {
    
  },
  methods: {
    getTabName(path){
       let tabArr=[];
       let parentRoute;
        getLocal("auths").map((element)=>{
          if(element.childrenModules&&element.childrenModules.length>0){
            element.childrenModules.map((item)=>{
              if(item.optList&&item.optList.length>0){
                item.optList.map((note)=>{
                  if(path==="/"+note.path){
                    parentRoute=item.path;
                  }
                })
              }
            })
          }
        });
       getLocal("auths").map((element)=>{
          if(element.childrenModules&&element.childrenModules.length>0){
            element.childrenModules.map((item)=>{
              if(parentRoute===item.path){
                if(item.optList&&item.optList.length>0){
                   
                 item.optList.map((note)=>{
                  tabArr.push({
                    name:note.name,
                    path:note.path
                  })
                 })
                }
              }
            })
          }
        })
        return tabArr;
    },
    changeTab(url){
      this.$store.commit("addTabAndActive", {
        url: "/"+this.curRouter,
        isAddTab:false
			});
    },
    watchRouter(){
        return Observable.create((observer)=> {
            this.$watch("$route",(newV,oldV)=>{
                observer.next(newV);
            },{immediate: true})
        });
    }

  },
};
</script>
<style lang="scss" scoped>
.filterHeader{
  padding-bottom: 15px  ;
}
.app-wrap {
  flex: 1;
  min-width: 1190px;
  // overflow: auto;
  & > .template-tabs > .el-tabs > .el-tabs__content {
    padding: 0px 0;
    // box-shadow: 0px 4px 5px 5px #ccccccc9;
  }
  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: #409eff;
    background-color: #fff;
    // border-bottom: 1px solid #d9dadd;
  }

  .template-tabs {
    position: fixed;
    width: 100%;
    z-index: 4;
    top: 65px;
  }
  // .el-tabs--border-card,
  & > .template-tabs > .el-tabs--border-card,
  & > .template-tabs > .el-tabs__header,
  & > .template-tabs > .el-tabs__nav-wrap {
    width: calc(1920px - 341px);
  }
  @media screen and (max-width: 1919px) {
    & > .template-tabs > .el-tabs--border-card,
    & > .template-tabs > .el-tabs__header,
    & > .template-tabs > .el-tabs__nav-wrap {
      width: calc(1920px - 750px);
    }
  }
  @media screen and (max-width: 1366px) {
    & > .template-tabs > .el-tabs--border-card,
    & > .template-tabs > .el-tabs__header,
    & > .template-tabs > .el-tabs__nav-wrap {
      width: calc(1920px - 800px);
    }
  }
  @media screen and (max-width: 1000px) {
    & > .template-tabs > .el-tabs--border-card,
    & > .template-tabs > .el-tabs__header,
    & > .template-tabs > .el-tabs__nav-wrap {
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
  & > .template-tabs > .el-tabs--border-card {
    height: 39px;
    float: left;
  }
  & > .template-tabs {
    // box-shadow: 0px 4px 5px 5px #ccccccc9;
    background: #f5f7fa;
  }
  .return {
    float: left;
    height: 39px;
    border: none;
    color: #909399;
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    cursor: pointer;
    border-left: 1px solid #e4e7ed;
  }
  .reload {
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
  // .content-wrap {
  //   width: 98%;
  //   margin: auto;
  //   margin-top: 1%;
  //   border-top: none;
  //   .content_table {
  //     background: #fff;
  //   }
  //   .conten-dd > .el-tabs--border-card > .el-tabs__content {
  //     padding: 0px 0;
  //   }
  //   .el-tabs__nav-scroll {
  //     // padding: 1px;
  //     background: #f3f3f3;
  //     // margin-bottom: 1px;
  //   }
  //   .conten-dd > .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  //     background: #fff;
  //     margin: 0px 0px;
  //     border: 2px solid #f3f3f3;
  //     box-sizing:border-box;
  //     border-left: 0px;
  //     font-weight: 500;
  //   }
  //   .conten-dd
  //     > .el-tabs--border-card
  //     > .el-tabs__header
  //     .el-tabs__item.is-active {
  //     color: #409EFF;
  //     border-bottom: 2px solid #fff;
  //     font-weight: 700;
  //   }
  // }
}
</style>
