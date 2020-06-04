<template lang='html'>
    <div class="source">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <!-- <el-breadcrumb-item v-for="item in curRouterArr" :key="item.id" :to="{path:'/'+item.router}">{{item.name}}</el-breadcrumb-item>\  -->
            <el-breadcrumb-item v-for="item in curRouterArr" :key="item.id" :to="{path:item.router,query:item.query}">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script>
import routerConfig from "@/routerConfig";
import {type,getLocal} from "assets/js/reused";
export default {
  name: "BreadCrumb",
  data() {
    return {
      router: {},
      options:[],
      curRouterArr: []
    };
  },
  watch:{
    $route(){
       this.options=getLocal("options");  
      this.getRouter(routerConfig)
      this.curRouterArr = this.router[this.$route.path];
    }
  },
  created() {
    //目前只弄了三级
    this.options=getLocal("options");
    this.getRouter(routerConfig)
    this.curRouterArr = this.router[this.$route.path];
  },
  methods:{
    getRouter(routerConfig){
       for (let item of routerConfig) {
        if (item.children && item.children.length > 0) {
          let obj = {
                name: item.name,
                router: item.path,
                query:this.getOption(item.path)
              };
          for (let child of item.children) {
            if(child.children&&(type(child.children)==='array')){
               //三级
              this.router[child.path] = [];
              this.router[child.path].push(obj);
              this.router[child.path].push({
                name: child.name,
                router: child.path,
                query:this.getOption(child.path)
              });
               //四级
              for(let childItem of child.children){
                this.router[childItem.path] = [];
                this.router[childItem.path].push(obj);
                this.router[childItem.path].push({
                  name: child.name,
                  router: child.path,
                  query:this.getOption(child.path)
                },{
                  name:childItem.name,
                  router:childItem.path,
                  query:this.getOption(childItem.path)
                }
              );
              }
            }else{
              //三级
              this.router[child.path] = [];
              this.router[child.path].push(obj);
              this.router[child.path].push({
                name: child.name,
                router: child.path,
                query:this.getOption(child.path)
              });
            }
          }
        }
      }
    },
    getOption(path){
      for(let option of this.options){
            if(option.route===path){
              return option.query
            }
          }
    }
  }
};
</script>
<style scoped>
.source {
  padding: 20px;
  background: #fff;
  margin-bottom: 1px;
}
</style>