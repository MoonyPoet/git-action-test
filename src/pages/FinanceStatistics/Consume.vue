<template>
  <div class="sales_class">
     <div>
        <FilterOptions ref="filterBar"  @searchData="stuConStatistics">
        </FilterOptions>
     </div>
            <br>
     <div class="expend_top_chart">
        <div class="abs">
            <el-button :class="{ active: isActive }" @click="activeDay1()" size="mini">天</el-button>
            <el-button  :class="{ active: !isActive }" @click="activeWeek1()"  size="mini">周</el-button>
        </div>
        <div ref="chart_top" id="chart_top_2"></div>
     </div>
     <div class="expend_center_chart">
        <div ref="chart_left" id="chart_left_2"></div>
        <el-table
            :data="tableData"
             border
            style="width: 48%;float:right;">
            <el-table-column
            label="项目">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="数量（张）">
            <template slot-scope="scope">
               <span>{{ scope.row.courseNum }}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="总金额（元）">
            <template slot-scope="scope">
              <span>{{scope.row.total}}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="已消课金额（元）">
            <template slot-scope="scope">
              <span>{{scope.row.consume}}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="未消课金额（元）">
            <template slot-scope="scope">
              <span>{{scope.row.remain}}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="消课比">
            <template slot-scope="scope">
              <span>{{scope.row.radio}}</span>
            </template>
            </el-table-column>
        </el-table>
     </div>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar");
require("echarts/lib/chart/pie");
require("echarts/lib/component/title")
require("echarts/lib/component/tooltip");
import Pagination from "common/Pagination";
import FilterOptions from "common/FilterOptions";
// import FilterBar from "common/FilterBar";
import {debounce,getCodeData,isEmpty,getTableSectionData,dateFormat} from 'assets/js/reused';;
  export default {
  components: {Pagination,FilterOptions},
  name: 'salesClass',
  data() {
    return {
      formData:{},
      tableData:[],
      chargeType:[],
      checkArr: "",
      indexMethod: 1,
      isActive:true,
      salesData:[],
      stuConChart:0
    }
  },
  activated(){
  },
  created(){
    
  },
  mounted(){
    this.init()
  },
  methods: {
    async init(){
        this.stuConStatistics().then((res)=>{  
            let xAxisTitleData;
            if(this.incomeChart===0&&!isEmpty(res.days)){
                xAxisTitleData=getTableSectionData({tableData:res.days,itemName:["day"],filter:(item)=>dateFormat("MM/dd",new Date(item.day))})
            }else if(this.incomeChart===1&&!isEmpty(res.weeks)){
                xAxisTitleData=getTableSectionData({tableData:res.weeks,itemName:["day"],getArr:true});
            }else{
                xAxisTitleData=[];
            }
             this.$refs.filterBar.setSearchData(res.search);
            // this.setTopChart(xAxisTitleData,getTableSectionData({tableData:res.tab1.stuconmaps,itemName:["value"],getArr:true}),"chart_top_2");
            // this.setCenterChart("",res.tab2.chart,"chart_left_2")
            // this.tableData=[...res.tab3.list]
        })
    },
    activeDay1(){
        this.isActive=true;
        this.stuConChart=0;
        this.init()
    },
    activeWeek1(){
        this.isActive=false;
        this.stuConChart=1;
        this.init()
    },
    search(v){
        this.searchData={...v};
        this.$nextTick(()=>{
            try{
                this.init();
            }catch{
               this.init(); 
            }
         
       })
    },
    stuConStatistics({stuConChart=this.stuConChart}={}){
        return new Promise((resolve,reject)=>{
             this.$axios.post({
                url:baseURL+"statistics/consume_cls",
                data:{
                   stuConChart,
                   ...this.searchData
                },
                success:(res)=>{
                    resolve(res.data)
                }
            })
        })
    },
    setTopChart(xAxisTitleData,data,id) {
        var option = {
            title: {
                text: '课消走势图(单位: 元)'
            },
            color: ['#3398DB'],
            tooltip: {
                formatter: function(params) {
                    return params.value + "元";
                }
            },
            grid: {
                left: '0%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : [...xAxisTitleData],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'',
                    type:'bar',
                    barWidth: '60%',
                    data:[...data]
                }
            ]
        };
        if(document.getElementById(id)!==null){
            let chart = echarts.init(document.getElementById(id));
            chart.setOption(option);
        }
    },
    setCenterChart(title,data,id) {
        var option = {
            title: {
                text: title
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            grid: {
                left: '10%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            series : [
                {
                    name: title,
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['40%', '50%'],
                    data: [...data],
                    label: {
                        normal: {
                            formatter: '{b}{c}  {d}%',
                            backgroundColor: '#eee',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            padding:5,
                            fontSize: 16
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        if(document.getElementById(id)!==null){
            let chart = echarts.init(document.getElementById(id));
            chart.setOption(option);
        }
    }
  }
}
</script>

<style lang="scss" scoped>
    .expend_border{
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
        span{
            width: 33.3%;
            display: inline-block;
            height: 40px;
            line-height: 40px;
        }
    }
    .expend_top_chart{
        position: relative;
        #chart_top_2{
            width:100%;
            height:500px;
        }
        .abs{
            top: 10px;
            right: 20px;
            z-index: 1;
            button{
                border: 1px solid #ddd;
                background: #fff;
                cursor: pointer;
                margin-right: 10px;
            }
            .active{
                background: #4189b9;
                border: none;
                color: #fff;
            }
        }
        @media screen and (max-width: 1366px) {
            #chart_top_2{
                width:100%;
                height:300px;
            }
        }
    }
    .expend_center_chart{
        overflow: hidden;
        margin-bottom: 20px;
        #chart_left_2{
            width: 47%;
            float: left;
            height: 300px;
            border-radius: 5px;
            padding: 20px;
            border: 1px solid #ddd;
        }
    }
</style>
