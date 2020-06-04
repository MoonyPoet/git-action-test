 <template >
  <div class="index_page">
    <div class="content_top">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-row class="write_bg border">
             <el-col :span="16" class="content_top_left">
              <div class="color1">{{pageData.statistics&&pageData.statistics.studentTotalNum}}</div>
              <div>学员数(人)</div>
            </el-col>
            <el-col :span="8" class="text_center img_parent">
              <img class="content_top_img" src="~assets/img/icon/icon1.png" alt="">
            </el-col>
          </el-row>
          <el-row class="bg1">
            <el-col :span="6">
              昨日增长  <span>{{pageData.statistics&&pageData.statistics.studentYesterdayGrowNum}}</span>
            </el-col>
            <el-col :span="8">
              昨日流失  <span>{{pageData.statistics&&pageData.statistics.studentYesterdayFlowNum}}</span>
            </el-col>
          </el-row>
         
        </el-col>
        <el-col :span="8">
          <el-row class="write_bg border">
            <el-col :span="16" class="content_top_left">
              <div class="color2">{{pageData.statistics&&pageData.statistics.consumeTotalNum}}</div>
              <div>消课数(次)</div>
            </el-col>
            <el-col :span="8" class="text_center img_parent">
              <img class="content_top_img" src="~assets/img/icon/icon2.png" alt="">
            </el-col>
          </el-row>
          <el-row class="bg2">
            <el-col :span="6">
              昨日消课  <span>{{pageData.statistics&&pageData.statistics.consumeYesterdayNum}}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row class="write_bg border">
            <el-col :span="16" class="content_top_left">
              <div class="color3">{{pageData.statistics&&pageData.statistics.introduceTotalNum}}</div>
              <div>转介绍人数(人)</div>
            </el-col>
            <el-col :span="8" class="text_center img_parent">
              <img class="content_top_img" src="~assets/img/icon/icon3.png" alt="">
            </el-col>
          </el-row>
          <el-row class="bg3">
            <el-col :span="10">
              昨日转介绍人数  <span>{{pageData.statistics&&pageData.statistics.introduceYesterdayNum}}</span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="content_center">
      <el-row :gutter="10">
        <el-col :span="2">
          <el-button class="button">
            添加学员
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button class="button">
            学员试课
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button class="button">
            学员缴费
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button class="button">
            学员调课
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button class="button">
            学员停/复课
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button class="button">
            学员退费
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="content_bottom">
      <FullCalendar :isShowBtn="false" v-on:weekTime="getWeekTime" :fullCalendarNewData="fullCalendarNewData"></FullCalendar>
    </div>
  </div>
</template>
<script>
import { getRoleArr,getCookie,setLocal,getFourRoleArr,getRouterArr } from "assets/js/reused";
import FullCalendar from "common/FullCalendar";
export default {
  name: "index",
  components:{
    FullCalendar
  },
  data() {
    return {
      pageData:{},
      fullCalendarNewData:{}
    };
  },
  created(){
    this.init()
  },
  methods: {
    async init(){
      
    },
    getWeekTime(obj){
      this.findIndexData(obj)
    },
    async findIndexData(obj={}){
      this.pageData=await post("institution/index",obj);
      this.fullCalendarNewData=this.pageData.classHours;
    }
  }
};
</script>

<style  lang="scss" scoped>
.index_page {
  .base{
    height: 26px;
    line-height: 26px;
    text-indent: 20px;
    font-size:14px;
  }
  .color1{
    color:rgb(20, 138, 242);
    font-size: 20px;
  }
  .color2{
    color:rgb(112, 182, 3);
     font-size: 20px;
  }
  .color3{
    color:rgb(247, 120, 120);
    font-size: 20px;
  }
  .write_bg{
    background: #fff;
  }
  .border{
    border:1px solid #d7d7d7;
  }
  .bg1{
    background: rgb(20, 138, 242);
    color:#fff;
    @extend .base;
  }
  .bg2{
    background: rgb(112, 182, 3);
    color:#fff;
    @extend .base;
  }
  .bg3{
    background: rgb(247, 120, 120);
    color:#fff;
    @extend .base;
  }
  .button{
    background: rgb(61,120,212);
    color: #fff;
    border: none;
  }
  .content_top_left{
    padding-top: 20px;
    padding-left: 15px;
  }
  .content_top_img{
    width:80px;
  }
  .img_parent{
    padding: 10px;
  }
  .content_center{
    padding-top: 20px;
  }
  .content_bottom{
    padding-top: 40px;
  }
  .content_top_left>div:nth-child(2){
    padding-top:20px;
    color: #aaa;
  }
}
</style>


