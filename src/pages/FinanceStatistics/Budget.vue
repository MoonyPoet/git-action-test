<template>
  <div class="expend">
     <div>
        <FilterOptions ref="filterBar"  @searchData="budgetStatistics">
        </FilterOptions>
     </div>
            <br>
     <div class="expend_border">
        <span>收入总额:{{allIncom}}</span>
        <span>支出总额:{{allExpend}}</span>
        <span>当前结余:{{allBalance}}</span>
     </div>
     <div class="expend_top_chart">
        <div class="abs">
          <el-button :class="{ active: isActive }" @click="activeDay1()" size="mini">天</el-button>
          <el-button  :class="{ active: !isActive }" @click="activeWeek1()"  size="mini">周</el-button>
        </div>
        <!-- 元/月 -->
        <div ref="chart_top" id="chart_top_1"></div>
     </div>
     <div class="expend_center_chart">
        <el-table
            :data="tableData"
             border
            style="width: 100%;float:right">
              <el-table-column
            label="项目">
            <template slot-scope="scope">
              <span>{{scope.row.cardTypeDisplay}}</span>
            </template>
            </el-table-column>
             <el-table-column
            label="购卡笔数">
            <template slot-scope="scope">
              <span>{{scope.row.num}}</span>
            </template>
            </el-table-column>
             <el-table-column
            label="应收金额">
            <template slot-scope="scope">
              <span>{{scope.row.receivableAmount}}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="实收金额">
            <template slot-scope="scope">
              <span>{{scope.row.receivedAmount}}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="欠费金额">
            <template slot-scope="scope">
              <span>{{scope.row.arrearsAmount}}</span>
            </template>
            </el-table-column>
             <el-table-column
            label="退费笔数">
            <template slot-scope="scope">
               <span>{{ scope.row.refundNum }}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="退费金额">
            <template slot-scope="scope">
               <span>{{ scope.row.refundAmount }}</span>
            </template>
            </el-table-column>
            </el-table-column>
        </el-table>
     </div>
     <!-- <Pagination ref="pagination" :pageNum="totalAll" :size="limit" v-on:currentPage="getCurrentPage" v-on:currentPageSize="getCurrentPageSize"></Pagination> -->
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar");
require("echarts/lib/chart/pie");
require("echarts/lib/component/title");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");
import Pagination from "common/Pagination";
import FilterOptions from "common/FilterOptions";
// import FilterBar from "common/FilterBar";
import {debounce,getCodeData,getTableSectionData,isEmpty,dateFormat} from 'assets/js/reused';
  export default {
  components: {Pagination,FilterOptions},
  name: 'budget',
  data() {
    return {
      formData:{},
      tableData:[],
      chargeType:[],
      checkArr: "",
      indexMethod: 1,
      isActive:true,
      incomeChart:0,
      incomeData:"",
      allIncom:null,
      allExpend:null,
      allBalance:null,
      offset: 0,
      limit: 10,
      totalAll:0,
      members:[]
    }
  },
  activated(){
  },
  created(){
    
  },
  mounted(){ 
    this.init()
  },
  watch:{
  },
  methods: {
    async init(){
        this.budgetStatistics().then((res)=>{
            this.allIncom=res.allIncom;
            this.allExpend=res.allExpend;
            this.allBalance=res.allBalance;
            let xAxisTitleData;
            if(this.incomeChart===0&&!isEmpty(res.days)){
                xAxisTitleData=getTableSectionData({tableData:res.days,itemName:["day"],filter:(item)=>dateFormat("MM/dd",new Date(item.day))})
            }else if(this.incomeChart===1&&!isEmpty(res.weeks)){
                xAxisTitleData=getTableSectionData({tableData:res.weeks,itemName:["day"],getArr:true});
            }else{
                xAxisTitleData=[];
            }
            if(this.incomeChart===0){
                this.setTopChart(xAxisTitleData,getTableSectionData({tableData:res.days,itemName:["income"],getArr:true}),getTableSectionData({tableData:res.days,itemName:["expend"],getArr:true}),"chart_top_1");
            }else{
                this.setTopChart(xAxisTitleData,getTableSectionData({tableData:res.weeks,itemName:["income"],getArr:true}),getTableSectionData({tableData:res.days,itemName:["expend"],getArr:true}),"chart_top_1");
            }
            this.$refs.filterBar.setSearchData(res.search);
            this.tableData=res.cardTypeStatic;
            // this.members=res.members;
            // this.setTablePagination();
        })
    },
    handleEdit(index,row,status) {
      if(status===1){
        this.$store.commit("addTabAndActive",{
          url:"/statisticsMarket/sale",
          data:{
            memberId:row.memberId,
            ...this.searchData
          }
        });
      }
    },
    activeDay1(){
        this.isActive=true;
        this.incomeChart=0;
        this.init()
    },
    activeWeek1(){
        this.isActive=false;
        this.incomeChart=1;
        this.init()
    },
    setTablePagination(){
      let list=this.members;
      let end=this.limit+this.offset;
      this.tableData=list.slice(this.offset,end);
      this.totalAll = list.length;
    },
    getCurrentPage(v) {
      //切换页码时会触发
      this.offset = v == 1 ? 0 : (v - 1) * this.limit;
      this.getTableData();
    //   this.setTablePagination();
    },
    getCurrentPageSize(v) {
      this.limit = v;
      this.getTableData();
    //   this.setTablePagination();
    },
    budgetStatistics(v){
        return new Promise((resolve,reject)=>{
             let obj = Object.assign(v == undefined ? {} : v, {
                    ...this.searchData
             });
             this.$axios.post({
                url:baseURL+"statistics/budget",
                data:obj,
                success:(res)=>{
                    resolve(res.data)
                }
            })
        })
    },
    setTopChart(xAxisTitleData,data1,data2,id) {
        var option = {
            title: {
                text: '收支走势图(单位: 元)'
            },
            legend: {
                data: ['收入', '支出'],
                align: 'left'
            },
            tooltip: {
                formatter: function(params) {
                    return params.value + "元";
                }
            },
            grid: {
                left: '3%',
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
                    name:'收入',
                    type:'bar',
                    data:[...data1]
                },
                 {
                    name:'支出',
                    type:'bar',
                    data:[...data2]
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
        #chart_top_1{
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
            #chart_top_1{
                width:100%;
                height:300px;
            }
        }
    }
    .expend_center_chart{
        overflow: hidden;
        margin-bottom: 20px;
        #chart_left_1{
            width: 47%;
            float: left;
            height: 300px;
            border-radius: 5px;
            padding: 20px;
            border: 1px solid #ddd;
        }
    }
</style>
