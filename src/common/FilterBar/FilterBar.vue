<template lang='html'>
    <div class="filter_bar">
        <div class="over_hide">
            <div class="btn_left">
                <slot></slot>
            </div>
            <!-- <div class="btn_right"> -->
                <!-- <el-button class="pull_right" @click="isShow=!isShow">筛选</el-button> -->
            <!-- </div> -->
        </div>
        <div class='filter_content' v-show="isShow">
                <div class="filterBarDiv" v-for="(element,index) in filterData">
                    <div class="pull_left element" v-if="element.type==='select'">
                        <el-select v-model="element.value" :title="element.placeholder" :style="{width:element.width===undefined?200:element.width+'px'}":placeholder="element.placeholder" @change="(v)=>selectChange(v,element)">
                            <el-option
                            v-for="item in element.options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.ids">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="pull_left element" v-if="element.type==='date'" :title="element.placeholder">
                        <!-- <el-date-picker
                            :title="element.placeholder"
                            v-model="element.value"
                            type="daterange"
                            :clearable="false"
                            :unlink-panels="true"
                            :style="{width:element.width===undefined?300:element.width+'px'}"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="timestamp"
                            :default-time="['00:00:00', '23:59:59']"
                            >
                        </el-date-picker> -->
                        <el-col style="width:160px;margin-right:10px">
                          <DatePickerStart v-model="filterData[index]" :width="160" :keyName="element.searchBy[0]" :clearable="false" :otherKeyName="element.searchBy[1]"></DatePickerStart>
                        </el-col>
                        <el-col style="width:160px;">
                          <DatePickerEnd v-model="filterData[index]" :width="160" :keyName="element.searchBy[1]" :clearable="false" :otherKeyName="element.searchBy[0]"></DatePickerEnd>
                        </el-col>
                    </div>
                    <div class="pull_left element" v-if="element.type==='input'" >
                        <el-input v-model="element.value" :title="element.placeholder" :style="{borderRadius: '33px ',width:element.width===undefined?200:element.width+'px'}" :placeholder="element.placeholder" @keyup.enter.native="search"></el-input>
                    </div>
                     <div class="pull_left element" v-if="element.type==='button'" :style="{margin:'4px'}" >
                        <el-button  icon="el-icon-search" size="small" type="primary" circle @click="search"></el-button>
                    </div>
                </div>
        </div>
    </div>
</template>
<script>
import { type, debounce,isEmpty,setSession,getSession,clone} from "assets/js/reused";
import DatePickerStart from "common/DatePickerStart";
import DatePickerEnd from "common/DatePickerEnd";
export default {
  name: "FilterBar",
  components:{
    DatePickerStart,
    DatePickerEnd
  },
  props: {
    link: {
      type: String,
      default: ""
    },
    // serchButton:{
    //   type:Number,
    //   default:1
    // },
    defaultEmit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filterData: [],
      searchData:[],
      oldData:"",
      isShow: true
    };
  },
  created() {
  },
  methods: {
    init() {
      this.getFilterData().then(res => {
        if(isEmpty(res)){
          return
        }
        let xRes=res;
        xRes=xRes.map((item)=>{
          if(type(item.searchBy)==="array"&&item.type==="date"){
            item[item.searchBy[0]]=null;
            item[item.searchBy[1]]=null;
          }
          return item;
        })
        this.oldData=clone(xRes);
        //保存之前的数据
        if(!isEmpty(getSession("searchData"))){
          if(type(getSession("searchData"))==="array"){
            getSession("searchData").map((element)=>{
              if(this.$route.path===element.route&&JSON.stringify(this.$route.query)===JSON.stringify(element.query)){
                let searchData=element.data;
                xRes.map((item)=>{
                  if(type(item["searchBy"])==="array"){
                    item["searchBy"].map((element)=>{
                      if(searchData[item["searchBy"][0]]===0||isEmpty(searchData[item["searchBy"][0]])){
                        item.value="";
                      }else{
                        item.value=[searchData[item["searchBy"][0]]*1000,searchData[item["searchBy"][1]]*1000];
                      }
                    })
                    item[item["searchBy"][0]]=searchData[item["searchBy"][0]];
                    item[item["searchBy"][1]]=searchData[item["searchBy"][1]];
                  }
                  else{
                    if(!isEmpty(searchData[item["searchBy"]])){
                      item.value=searchData[item["searchBy"]].toString();
                    }
                  }
                })
              }
            })
          }else{
            if(this.$route.path===getSession("searchData").route&&JSON.stringify(this.$route.query)===JSON.stringify(getSession("searchData").query)){
                let searchData=getSession("searchData").data;
                xRes.map((item)=>{
                  if(type(item["searchBy"])==="array"){
                    item["searchBy"].map((element)=>{
                      if(searchData[item["searchBy"][0]]===0||isEmpty(searchData[item["searchBy"][0]])){
                        item.value="";
                      }else{
                        item.value=[searchData[item["searchBy"][0]]*1000,searchData[item["searchBy"][1]]*1000];
                      }
                    })
                    item[item["searchBy"][0]]=searchData[item["searchBy"][0]];
                    item[item["searchBy"][1]]=searchData[item["searchBy"][1]];
                  }
                  else{
                    item.value=searchData[item["searchBy"]];
                  }
                })
              }
          }
        }else{
          xRes.map((item)=>{
              if(type(item["searchBy"])==="array"){
                if(!isEmpty(item["value"])){
                  item[item["searchBy"][0]]=item["value"][0]/1000;
                  item[item["searchBy"][1]]=item["value"][1]/1000;
                }
              }
          })
        }
          //默认处理方案
          xRes.map((item)=>{
            if(type(item["searchBy"])==="array"){
                if(!isEmpty(item["value"])){
                  item[item["searchBy"][0]]=item["value"][0]/1000;
                  item[item["searchBy"][1]]=item["value"][1]/1000;
                }
              }
          })
          this.filterData = [...xRes];
          if (this.defaultEmit) {
            this.search();
          }
      });
    },
    getSearchData(){
      return new Promise((resolve,reject)=>{
        let minTimeStamp=2000;
        let timeStamp = new Date().getTime();
        let clearId = setInterval(() => {
            let timeStamp1 = new Date().getTime();
            if(!isEmpty(this.$store.getters.searchData)){
              clearInterval(clearId);
              resolve(this.$store.getters.searchData)
            }
            if ((timeStamp1 - timeStamp) >= minTimeStamp) {
                clearInterval(clearId)
                resolve("")
            }
        })
      })
    },
    selectChange(v,element){
      //说明选中的是培训类别，通过选择的培训类别去筛选校区或者班级
      if(element.type==="select"&&element.key==="trainCategoryIdsFinds"&&element.groupkey==="1"){
        let cityCampus=[],classData=[];
        this.oldData.forEach((item)=>{
          if(item.key==="cityCampus"){
            if(v!=='-1'){
               item.options.forEach((option)=>{
                if(option.trainCategoryIds&&option.trainCategoryIds.split(",").some((trainId)=>trainId==v)||isEmpty(option.trainCategoryIds)){
                  cityCampus.push(option)
                }
              })
            }else{
              cityCampus=item.options
            }
          }
          if(item.key==="classesName"){
            if(v!=='-1'){
              if(!isEmpty(item.options)&&type(item.options)==="array"){
                 item.options.forEach((option)=>{
                  if(option.trainCategoryId==v||isEmpty(option.trainCategoryId)){
                    classData.push(option)
                  }
                })
              }
            }else{
              classData=item.options;
            }
          }
        })
        this.filterData.forEach((item)=>{
          if(item.key==="cityCampus"){
            item.options=cityCampus;
            item.value="-1";
          }
          if(item.key==="classesName"){
            item.options=classData;
            item.value="-1";
          }
        })
      }
       //说明选中的是校区，通过选择的校区去筛选班级，如果已选择培训类别,根据培训类别和校区筛选
      if(element.type==="select"&&element.key==="cityCampus"&&element.groupkey==="1"){
        let classData=[];
        this.oldData.forEach((item)=>{
          if(item.key==="classesName"){
            //如果培训类别只有一种,不会显示培训类别
             if(this.filterData[0].key==="trainCategoryIdsFinds"){
               if(v!=='-1'&&this.filterData[0].value==="-1"){
                //只选择校区
                item.options.forEach((option)=>{
                  if(option.campusId&&option.campusId==v||isEmpty(option.campusId)){
                    classData.push(option)
                  }
                })
              }else if(v!=='-1'&&this.filterData[0].value!=="-1"){
                //选择培训类别和校区
                item.options.forEach((option)=>{
                  if(option.campusId&&option.campusId==v&&(option.trainCategoryId==this.filterData[0].value)||isEmpty(option.campusId)){
                    classData.push(option)
                  }
                })
              }else if(v==="-1"&&this.filterData[0].value==="-1"){
                //校区和培训类别都是全选的情况
                classData=item.options;
              }else if(v==='-1'&&this.filterData[0].value!=="-1"){
                //校区全选但是指定培训类别的情况
                item.options.forEach((option)=>{
                  if(option.trainCategoryId==this.filterData[0].value||isEmpty(option.trainCategoryId)){
                    classData.push(option)
                  }
                })
              }
             }else{
               if(v!=='-1'){
                //只选择校区
                item.options.forEach((option)=>{
                  if(option.campusId&&option.campusId==v||isEmpty(option.campusId)){
                    classData.push(option)
                  }
                })
              }else{
                 classData=item.options;
              }
             }
          }
        })
        this.filterData.forEach((item)=>{
          if(item.key==="classesName"){
            item.options=classData;
            item.value="-1";
          }
        })
      }
    },
    search() {
      let searchData = {};
      //搜索校验
      let flag=true;
      this.filterData.map((item)=>{
        if(item.type==="date"){
          if(!isEmpty(item[item.searchBy[0]])&&isEmpty(item[item.searchBy[1]])){
            flag=false;
          }
        }
      })
      if(flag===false){
        this.$alert('结束日期必填', '错误提示');
        return
      }
      this.filterData.map(item => {
        if (item.type !== "button") {
          if (item.type === "date") {
            if (
              type(item.id) === "array"
            ) {
              // searchData[item.searchBy[0]] = item.value[0] / 1000;
              // searchData[item.searchBy[1]] = item.value[1] / 1000;
              searchData[item.id[0]] = item[item.id[0]];
              searchData[item.id[1]] = item[item.id[1]];
            }
          } else {
            searchData[item.id] = item.value;
          }
        }
      });
      debounce(() => {
        this.$emit("searchData", searchData);
        //兼容以前的
        if(type(getSession("searchData"))==="array"){
          let searchCacheData=getSession("searchData");
          let isSamePath=false;
          searchCacheData.map((item)=>{
            if(item.route===this.$route.path){
              item.query=this.$route.query;
              item.data=searchData;
              isSamePath=true;
            }
          })
          if(isSamePath===false){
             setSession("searchData",[...searchCacheData,{
            route:this.$route.path,
            query:this.$route.query,
            data:searchData
          }])
          }else{
            setSession("searchData",[...searchCacheData])
          }
        }else{
          setSession("searchData",[{
            route:this.$route.path,
            query:this.$route.query,
            data:searchData
          }])
        }
      }, 500);
    },
    filterCampus(arr, value, element) {
      for (let item of arr) {
        if (item.ids === value) {
          return item.campusVos;
        }
      }
    },
    setSearchData(data){
      this.searchData=data;
      this.init();
    },
    getFilterData() {
      return new Promise((resolve, reject) => {
        resolve(this.searchData);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.filter_bar {
  overflow: hidden;
  padding-bottom: 20px;
  .over_hide {
    display: inline-block;
  }
  .pull_left .el-input__inner {
    border-radius: 50px;
  }

  // padding: 10px;
  .btn_left {
    // width: 400px;
    float: left;
  }
  .el-button--small.is-circle{
    padding: 12px;
  }
  .btn_right {
    width: 200px;
    float: right;
  }
  .filter_content {
    // width: 100%;
    float: right;
    display: inline-block;
    // margin-bottom: 20px;
    overflow: hidden;
    .filterBarDiv {
      display: inline;
      .element {
        margin-top: 4px;
        margin-right: 10px;
      }
    }
  }
}
</style>