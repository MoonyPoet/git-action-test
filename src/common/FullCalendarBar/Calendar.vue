<template lang='html'>
    <div class='calendar'>
       <div class="mb_10 month">
          <el-date-picker
                v-model="month"
                type="month"
                placeholder="选择月"
                value-format="timestamp"
                :clearable="false"
                @change="monthChange"
            >
            </el-date-picker>
       </div>
    <el-row>
        <el-col :span="2" class="left_btn">
            <el-button icon="el-icon-arrow-left"  @click="lastWeek" circle>
            </el-button>
        </el-col>
        <el-col :span="20" class="table">
             <div v-for="item in daysData" class="weekItem">
                <div class="week">{{item.week}}</div>
                <div class="day" @click="dayChange(item)" :class="{'disabled':item.disabled,'now_day':item.date===nowDay,'cur_day':item.date===day}">
                    {{item.day}}
                </div>
            </div>
        </el-col>
        <el-col :span="2" class="right_btn">
            <el-button icon="el-icon-arrow-right"  @click="nextWeek" circle>
            </el-button>
        </el-col>
    </el-row>      
    </div>
</template>
<script>
    import {setDayTime,clone} from 'assets/js/reused';
     export default {
        name: 'Calendar',
        props:{
            data:{
                type:Object,
                default:()=>{
                    return {};
                }
            }
        },
        data () {
            return{
                month:Date.parse(new Date()),
                currentFirstDate:null,//上周末时间
                startDt:"",//日历上的开始时间
                endDt:"",//日历上的结束时间
                daysData:[],
                curWeekFirstDay:null,//本周一
                curWeekLastDay:null,//本周末
                day:null,//选择那天，默认选今天
                nowDay:setDayTime(new Date()),//今天
                flag1:false,
                flag2:false,
                isChangeMonth:false
            }
        },
        created(){
            this.init()
        },
        methods:{
            init(){
                 //根据今天计算这周
                this.currentFirstDate=setDayTime(new Date());
                this.setWeekDate(new Date(setDayTime(new Date())));
                this.change(setDayTime(new Date()));
            },
            change(date){
                this.day=date;
                let date1=date/1000; 
                this.$emit("change",date1)
            },
            getDaysInOneMonth(year, month){ 
                month = parseInt(month, 10); 
                var d= new Date(year, month, 0); 
                return d.getDate(); 
            },
            monthChange(timestamp){
              this.time=new Date(timestamp).setDate(1);
              this.isChangeMonth=true;
              this.setWeekDate(new Date(this.time));
              this.change(setDayTime(new Date(timestamp)));
            },
            addDate(date,n){
                //设置某天，一月内某天
                date.setDate(date.getDate()+n).valueOf(); 
                return new Date(date);
            },
            lastWeek(){
                //上一周
                let timestamp=new Date(this.currentFirstDate.valueOf());
                let newTimestamp=this.addDate(timestamp,-7);
                this.setMonth(newTimestamp)
                this.setWeekDate(newTimestamp); 
            },
            nextWeek(){
                //下一周
                let timestamp=new Date(this.currentFirstDate.valueOf());
                let newTimestamp=this.addDate(timestamp,7);
                this.setMonth(newTimestamp)
                this.setWeekDate(newTimestamp);
            },
            setNextMonth(month){
                return new Date(new Date().setFullYear(new Date(month).getFullYear())).setMonth(new Date(month).getMonth()+1);
            },
            setLastMonth(month){
                return new Date(new Date().setFullYear(new Date(month).getFullYear())).setMonth(new Date(month).getMonth()-1);
            },
            isHasALLDisabled() {
                let disabledArr=[]
                 this.daysData.map((item)=>{
                    disabledArr.push(item.disabled);
                })
                if(disabledArr.every((item)=>item===false)){
                    return true;
                }else{
                    return false;
                }
            },
            dayChange(item){ 
                if(this.getYear(item.date)===this.getYear(this.month)){
                    //同年不同月
                    if(this.getMonth(item.date)>this.getMonth(this.month)){
                        //切下一月
                       this.nextWeek()
                    }else if(this.getMonth(item.date)<this.getMonth(this.month)){
                        //切上一月
                       this.lastWeek()
                    }
                }else if(this.getYear(item.date)<this.getYear(this.month)){
                    //切到上一年
                    this.lastWeek()
                }else if(this.getYear(item.date)>this.getYear(this.month)){
                    //切到下一年
                    this.nextWeek()
                }
                this.change(item.date);
            },
            setMonth(date){
                var week = date.getDay();//获取一周内某天
                //根据当前的时间推到上周末的时间
                date = this.addDate(date,week*-1);
                this.curWeekFirstDay=this.addDate(new Date(date),1);
                this.curWeekLastDay=this.addDate(new Date(date),7);
                this.flag1=false;
                this.flag2=false;
                 //同年不同月的判断
                if(this.getYear(this.curWeekLastDay)===this.getYear(this.month)&&this.getMonth(this.curWeekLastDay)>this.getMonth(this.month)){ 
                    // 设置时间为下一个月
                    this.flag1=true;
                    this.month=this.setNextMonth(this.month)
                    if(this.isHasALLDisabled()){
                        this.addDate(this.currentFirstDate,7)
                    }
                }
                //跨年判断
                 if(this.getYear(this.curWeekLastDay)>this.getYear(this.month)&&this.getMonth(this.curWeekLastDay)<this.getMonth(this.month)){ 
                    // 设置时间为下一个月
                    this.flag1=true;
                    this.month=this.setNextMonth(this.month)
                    if(this.isHasALLDisabled()){
                        this.addDate(this.currentFirstDate,7)
                    }
                }
                //同年不同月的判断
                if(this.getYear(this.curWeekFirstDay)===this.getYear(this.month)&&this.getMonth(this.curWeekLastDay)<this.getMonth(this.month)){ 
                    // 设置时间为上一个月
                    this.flag2=true;
                    this.month=this.setLastMonth(this.month);
                    if(this.isHasALLDisabled()){
                        this.addDate(this.currentFirstDate,-7)
                    }
                }
              
                //跨年判断
                 if(this.getYear(this.curWeekFirstDay)<this.getYear(this.month)&&this.getMonth(this.month)<this.getMonth(this.curWeekLastDay)){ 
                    // 设置时间为上一个月
                    this.flag2=true;
                    this.month=this.setLastMonth(this.month);
                    if(this.isHasALLDisabled()){
                        this.addDate(this.currentFirstDate,-7)
                    }
                }
            },
        
            setWeekDate(date){
                //设置一周
                if(!this.flag1&&!this.flag2){
                    var week = date.getDay();//获取一周内某天
                    //如果这一天刚好是周末,推它上周末那天
                    if(this.isChangeMonth){
                        if(week===0){
                            date = this.addDate(date,-7);
                        }
                        else{
                            //根据当前的时间推到上周末的时间
                            date = this.addDate(date,week*-1);
                        }
                        this.isChangeMonth=false;
                    }else{
                        date = this.addDate(date,week*-1);
                    }
                    this.daysData=[];
                    this.currentFirstDate = new Date(date);
                    this.setWeekTime(date)
                }else if(this.flag1){
                    if(!this.isHasALLDisabled()){
                        date = this.addDate(date,-7);
                    }
                    this.daysData=[];
                    this.setWeekTime(date)
                }else if(this.flag2){
                    if(!this.isHasALLDisabled()){
                       date = this.addDate(date,7);
                    }
                    this.daysData=[];
                    this.setWeekTime(date)
                }
            },
            setWeekTime(date){
                 for(let i = 0;i<7;i++){
                    //根据上周末的时间推算这一周的时间
                    let cellDate=this.addDate(date,1);
                    this.daysData.push(this.getFormatDate(cellDate));
                    if(i==1){
                        this.startDt=setDayTime(date)/1000;
                    }
                    if(i==6){
                        this.endDt=setDayTime(date,2)/1000;
                    }
                }
            },
            getFormatDate(date){
                var day = date.getDate();
                //非同一个月被禁用
                let disabled=this.getMonth(new Date(date))===this.getMonth(this.month)?false:true;
                var week = ['星期天','星期一','星期二','星期三','星期四','星期五','星期六'][date.getDay()]; 
                return {
                    date:setDayTime(new Date(date)),
                    day,
                    disabled,
                    week
                };
            },
            formatDate(date){
                //一周时间格式化       
                var year = date.getFullYear()+'年';
                var month = (date.getMonth()+1)+'月';
                var day = date.getDate()+'日';
                var week = '('+['星期天','星期一','星期二','星期三','星期四','星期五','星期六'][date.getDay()]+')'; 
                return year+month+day+' '+week;
            },
            getMonth(timestamp){
                let date=new Date(timestamp);
                return date.getMonth()+1;
            },
            getYear(timestamp){
                let date=new Date(timestamp);
                return date.getFullYear();
            },
            add0(m){
                return m<10?'0'+m : m;
            },
            getTimestamp(){
                var time = new Date();
                var y = time.getFullYear();
                var m = time.getMonth()+1;
                var d = time.getDate();
                var h = 0;
                var mm =0;
                var s = 0;
            
                return y+add0(m)+add0(d)+add0(h)+add0(mm)+add0(s);
            }

        }
    }
</script>
<style lang="scss" scoped>
.calendar{
    overflow: hidden;
    .left_btn{
        padding-top: 20px;
        padding-left: 76px;
        text-align: left;
    }
    .right_btn{
        padding-top: 20px;
        padding-right: 76px;
        text-align: right;
    }
    .week{
        margin-bottom:10px;
    }
    .table{
        display: table;
    }
    .weekItem{
        display: table-cell;
        text-align: center;
    }
    .month{
        margin-left: 80px;
    }
    .day{
        border: 1px solid #ddd;
        border-radius: 17px;
        width: 80%;
        height: 30px;
        text-align: center;
        line-height: 30px;
        margin: 0 auto;
        cursor: pointer;
    }
    .now_day{
        background: #FF9800;
        color: #fff;
    }
    .cur_day{
        background: #317ffe;
        color: #fff;
    }
  
    .day:hover{
        background: #317ffe;
        color: #fff;
    }
    .disabled{
        background: #ccc;
        color: #fff;
    }
}
</style>