<template lang='html'>
    <div class="filter_options">
        <div class="over_hide first_line">
            <div class="btn_left">
                <slot></slot>
            </div>
            <div class="pull_right" v-if="isHasSearchInput">
              <div>
                <el-input class="search" v-model="keywordSearch.value" :title="keywordSearch.placeholder" :style="{borderRadius: '33px ',width:200+'px'}" :placeholder="keywordSearch.placeholder" @keyup.enter.native="keywordSearchFn"></el-input>
              </div>
            </div>
        </div>
        <hr class="col1">
        <div class='filter_content' v-show="isShow">
          <el-col :span="22">
            <div class="filterBarDiv">
                  <template v-for="(element,index) in filterData" v-if="element.type!=='input'&&element.id!=='keyword'">
                     <div class="pull_left element" v-if="element.type==='select'">
                        <el-col :span="6" class="title">
                            {{element.title}}
                        </el-col>
                        <el-col :span="18">
                            <el-select v-model="element.value" :title="element.placeholder" :style="{width:200+'px'}":placeholder="element.placeholder" @change="(v)=>selectChange(v,element)">
                                <el-option
                                    v-for="item in element.options"
                                    :key="item.value"
                                    :label="item.display"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </div>
                    <div class="pull_left element date" v-if="element.type==='date'" :title="element.placeholder">
                        <el-col :span="6" class="title date_title">
                            {{element.title}}
                        </el-col>
                        <el-col :span="18" style="width:290px">
                            <el-col style="width:140px;margin-right:10px">
                                <DatePickerStart v-model="filterData[index]" :width="140" :keyName="element.id[0]" :clearable="false" :otherKeyName="element.id[1]"></DatePickerStart>
                            </el-col>
                            <el-col style="width:140px;">
                                <DatePickerEnd v-model="filterData[index]" :width="140" :keyName="element.id[1]" :clearable="false" :otherKeyName="element.id[0]"></DatePickerEnd>
                            </el-col>
                        </el-col>
                    </div>
                    <div  class="pull_left element" v-if="element.type==='search'" :title="element.placeholder">
                        <el-col :span="6" class="title">
                            {{element.title}}
                        </el-col>
                        <el-col :span="18">
                           <!-- <span v-if="isRelCampus&&!filterClass(filterData)&&(element.id==='clasId'||element.id==='followMemberId')" style="line-height:33px">
                              {{$t("components.msg2")}}
                            </span> -->
                             <SearchItem
                            :url="element.url"
                             v-model="element.value" 
                             :nameLike.sync="element.nameLike"
                             :placeholder="element.placeholder" 
                             :searchKey="element.searchKey" 
                             :val="element.display" 
                             :key="element.val"
                             :otherSearchOpt="element.otherSearchOpt"
                            >
                            </SearchItem> 
                        </el-col>
                    </div>
                    <div  class="pull_left element week" v-if="element.type==='week'" :title="element.placeholder">
                        <el-col :span="6" class="title">
                            {{element.title}}
                        </el-col>
                        <el-col :span="18" class="week_content">
                           <el-select v-model="filterData[index][element.id[0]]" :title="element.placeholder" :style="{width:200+'px'}" :placeholder="element.placeholder" @change="(v)=>weekChange(v,element.options,filterData[index],element.id[1])">
                                <el-option
                                    v-for="item in element.options"
                                    :key="item.value"
                                    :label="item.display"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                             至
                             <el-select v-model="filterData[index][element.id[1]]" :title="element.placeholder" :style="{width:200+'px'}" :placeholder="element.placeholder">
                                <el-option
                                    v-for="item in curWeek"
                                    :key="item.value"
                                    :label="item.display"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </div>
                    <div  class="pull_left element time" v-if="element.type==='time'" :title="element.placeholder">
                        <el-col :span="6" class="title">
                            {{element.title}}
                        </el-col>
                        <el-col :span="18" class="time_content">
                           <TimeSelect v-model="filterData[index][element.id[0]]" :clearable="false" :start="element.start" :end="element.end" :step="element.step" :title="element.placeholder" :placeholder="element.placeholder"></TimeSelect>
                             至
                            <TimeSelect v-model="filterData[index][element.id[1]]" :clearable="false" :start="element.start" :end="element.end" :step="element.step" :minTime="filterData[index][element.id[0]]" :title="element.placeholder" :placeholder="element.placeholder"></TimeSelect>
                        </el-col>
                    </div>
                  </template>
                </div>
                <div class='filter_content sort_div' v-show="isShow">
                  <template v-for="(element,index) in filterData">
                    <div class="pull_left element" v-if="element.type==='sort'"  :key="element.id">
                        <el-checkbox v-model="element.isChecked" @change="(v)=>checkChange(v,element)" class="check_item">{{element.title}}</el-checkbox>
                        <span v-for="item in element.options" :key="item.id" class="check_item check_span" :class="{isChecked:item.isChecked}" @click="getCheckItemId(item,element)">{{item.display}}</span>
                      </div>
                  </template>
                </div>
                
          </el-col>
          <el-col :span="2">
             <el-button class="search_btn" v-if="isHasSearchBtn" round size="small" type="primary" @click="search">{{buttonSearch.title}}</el-button>
          </el-col>
          <hr class="col1">
        </div>
    </div>
</template>
<script>
import { type, debounce,isEmpty,setSession,getSession,clone,getTableSectionData,getTableItem,isTableHasKey,selectDefaultData} from "assets/js/reused";
import DatePickerStart from "common/DatePickerStart";
import DatePickerEnd from "common/DatePickerEnd";
import SearchItem from "common/SearchItem";
import TimeSelect from "common/TimeSelect";
export default {
  name: "filterOptions",
  components:{
    DatePickerStart,
    DatePickerEnd,
    SearchItem,
    TimeSelect
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
      sortData:[],
      curWeek:[],
      keywordSearch:{},
      buttonSearch:{},
      isRelCampus:false,//是否关联校区
      oldData:"",
      isHasSearchBtn:false,
      isHasSearchInput:false,
      isShow: true
    };
  },
  created() {
    // if(module.hot){
    //     this.search();
    // }
  },
  methods: {
    init() {
      this.getFilterData().then(res => {
        if(isEmpty(res)){
          return
        }
        let xRes=res;
        this.sortData=[];
        xRes.map((element)=>{
          if(element.type==="date"){
            element.id.map((item)=>{
              this.$set(element,item,null)
            })
          }
          else if(element.type==="week"){
            element.id.map((item)=>{
              this.$set(element,item,null)
            })
            if(element.value.every((item)=>item==="")){
               element.id.map((item)=>{
                this.$set(element,item,"")
              })
            }
          }else if(element.type==="time"){
            element.id.map((item,index)=>{
              this.$set(element,item,element.value[index])
            })
          }
          else if(element.type==="button"){
            this.buttonSearch=element;
          }
          else if(element.type==="sort"){
            //sort
            this.$set(element,"isChecked",false)
            if(element.value===undefined){
              this.$set(element,"value",null)
            }
            element.options.map((item)=>{
              this.$set(item,"isChecked",false)
            })
            this.sortData.push(element)
          }else {
            if(element.value===undefined){
              this.$set(element,"value",null)
            }
          }
          if(element.type==="input"&&element.id==="keyword"){
            this.keywordSearch=element;
          }
        })
        this.oldData=clone(xRes);
        //是否关联校区
        let idArr=getTableSectionData({tableData:xRes,itemName:["id"],getArr:true});
        if(idArr.includes("campusId")&&idArr.includes("clasId")||idArr.includes("campusId")&&idArr.includes("followMemberId")){
          this.isRelCampus=true;
        }
        //是否有搜索按钮
        if(idArr.includes("search")){
           this.isHasSearchBtn=true;
        }
        // 是否有关键字搜索
        if(idArr.includes("keyword")){
          this.isHasSearchInput=true;
        }
        //保存之前的数据
        this.filterData=[...xRes];
        //week初始处理
        
        
        //默认默认项选择
        this.filterData.map((element,index)=>{
          if(element.type==='sort'&&element.value!=undefined){
            element.options.map((item)=>{
              if(element.value===item.value){
                this.$set(item,"isChecked",true)
                this.$set(element,"isChecked",true)
              }
            })
          }else if(element.type==="week"){
            this.weekChange(this.filterData[index][element.id[0]],element.options,this.filterData[index],element.id[1])
          }
        })
          if (this.defaultEmit) {
            this.search();
          }
      });
    },
    getElementId(v){
      //校区
      if(this.isRelCampus){
        //向模糊搜索下拉注入campusId
        if(isTableHasKey(this.filterData,"clasId")){
          getTableItem(this.filterData,"id","clasId").otherSearchOpt.campusId=v;
        }
        if(isTableHasKey(this.filterData,"followMemberId")){
          getTableItem(this.filterData,"id","followMemberId").otherSearchOpt.campusId=v;
        }
        
      }
    },
    filterWeekData(v,data){
      if(!isEmpty(v)){
        this.curWeek=data.filter((item)=>parseInt(item.value)>=parseInt(v));
        return this.curWeek;
      }else{
         this.curWeek=data.filter((item)=>item.value===v);
         return this.curWeek;;
      }
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
    filterClass(data){
      if(getTableItem(data,"id","campusId").value){
         return true;
      }else{
        return false;
      }
    },
    weekChange(v1,data,item,name){
      //week 组件切换前一项清空后一项
      this. filterWeekData(v1,data);
      this.$nextTick(()=>{
        item[name]= selectDefaultData(this.curWeek,"value")
      })
      
    },
    selectChange(v,element){
      //如果校区班级或者校区根据人存在,切换校区的时候,清空班级或者跟进人
      let idArr=getTableSectionData({tableData:this.filterData,itemName:["id"],getArr:true});
      if(idArr.includes("campusId")&&idArr.includes("clasId")||idArr.includes("campusId")&&idArr.includes("followMemberId")){
        this.filterData.map((element)=>{
          if(element.id==="followMemberId"||element.id==="clasId"){
            element.value=null;
            this.$set(element,"nameLike","")
          }
        })
      }
    },
    keywordSearchFn(){
      this.$emit("searchData", {
        [this.keywordSearch.id]:this.keywordSearch.value
      });
    },
    search() {
      let searchData = {};
      //搜索校验
      for(let item of this.filterData){
          if(item.type==="date"){
          if(item[item.id[0]]&&isEmpty(item[item.id[1]])){
            this.$alert('结束日期必填', '错误提示');
            return
          }
        }
      }
      let newFilterData=this.filterData.filter((item)=>item.id!=="keyword");
      newFilterData.map((element)=>{
        if(element.type==="date"){
          searchData[element.id[0]]=element[element.id[0]];
          searchData[element.id[1]]=element[element.id[1]];
        }else if(element.type==="sort"){
          let value=null;
          element.options.map((item)=>{
            if(item.isChecked){
              value=item.value;
            }
          })
          searchData[element.id]=value;
        }else if(element.type==="week"){
          searchData[element.id[0]]=element[element.id[0]];
          searchData[element.id[1]]=element[element.id[1]];
        }
        else if(element.type==="time"){
          searchData[element.id[0]]=element[element.id[0]];
          searchData[element.id[1]]=element[element.id[1]];
        }
        else if(!isEmpty(element.value)){
          searchData[element.id]=element.value;
        }
      })
      debounce(() => {
        this.$emit("searchData", searchData);
      }, 500);
    },
    filterCampus(arr, value, element) {
      for (let item of arr) {
        if (item.ids === value) {
          return item.campusVos;
        }
      }
    },
    getCheckItemId(item,element1){
      item.isChecked=!item.isChecked;
      this.filterData.map((note)=>{
        if(note.type==="sort"){
          note.options.map((element)=>{
            if(element.value!==item.value){
              element.isChecked=false;
            }
            if(note.id===element1.id){
              if(item.isChecked){
                note.isChecked=true;
              }else{
                note.isChecked=false;
              } 
            }
          })
        }
      })
      this.checkChange(item.isChecked,element1)
    },
    checkChange(v,element){
      if(v){
        this.filterData.map((item)=>{
          if(item.type==="sort"&&item.id!==element.id){
            item.isChecked=false;
            item.options.map((note)=>{
              note.isChecked=false;
            })
          }
        })
        element.isChecked=true;
      }else{
        this.filterData.map((item)=>{
          if(item.type==="sort"&&item.id===element.id){
            item.isChecked=false;
            item.options.map((note)=>{
              note.isChecked=false;
            })
          }
        })
        element.isChecked=false;
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
.filter_options {
  overflow: hidden;
  // padding-bottom: 20px;
  padding-top: 17px;
  .first_line{
    margin-bottom: 17px;
  }
  /deep/.search .el-input__inner{
    border-radius: 50px;
    height: 33px;
  }
  .el-select /deep/ .el-input__inner{
    border-radius: 50px;
    height: 33px;
  }
  .el-select /deep/ .el-input__suffix i{
    line-height: 33px;
  }
  .col1{
    background-color:#eee;
    height:1px; 
    border:none;
    clear: both;
  }
  .title{
    line-height: 33px;
  }
  .date_title{
    width: 96px;
  }
  .sort_div{
    line-height: 40px;
  }
  .search_btn{
    margin-top: 10px;
    height: 33px;
    line-height: 12px;
  }
  // padding: 10px;
  .btn_left {
    // width: 400px;
    float: left;
  }
  .check_item{
    margin-right:10px;
    padding: 0 10px;
  }
  .check_span{
    cursor: pointer;
  }
  .el-button--small.is-circle{
    padding: 12px;
  }
  .btn_right {
    width: 200px;
    float: right;
  }
  .isChecked{
    background: #409eff;
    color: #fff;
  }
  .filter_content {
    // width: 100%;
    display:block;
    // margin-bottom: 20px;
    overflow: hidden;
    .filterBarDiv {
      display: inline-block;
      margin-right: 10px;
      margin-top: 10px;
      .element {
        width: 300px;
        margin-right: 25px;
        margin-bottom: 10px;
      }
     
       .week{
        width: 500px;
        .title{
          width: 72px;
        }
        .week_content{
          width: 423px;
        }
      }
      .time{
        width: 295px;
        .title{
          width: 72px;
        }
        .time_content{
          width:223px;
            /deep/.el-date-editor{
              width: 100px;
            }
            /deep/ .el-input--prefix .el-input__inner{
            border-radius: 50px;
            height: 33px;
            width: 100px;
          }
        }
      }
      .date{
        width: 386px;
        /deep/ .el-input--prefix .el-input__inner{
          border-radius: 50px;
          height: 33px;
        }
        /deep/ .el-input--prefix i{
            line-height: 33px;
          }
      }
    }
  }
}
</style>